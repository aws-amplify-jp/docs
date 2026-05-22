---
title: "カスタムリアルタイムサブスクリプションを追加"
section: "frontend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/data/custom-subscription/"
---

任意のミューテーションに対するカスタムリアルタイムサブスクリプションを作成して、PubSubユースケースを有効にします。

## カスタムサブスクリプションを定義

カスタムサブスクリプションごとに、以下を設定する必要があります：
1. サブスクリプションイベントをトリガーするミューテーション
2. サブスクリプション対象のミューテーションの戻り値の型と一致する戻り値の型
3. 認可ルール

オプションで、フィルター引数を設定してサーバー側のサブスクリプションフィルタールールをカスタマイズできます。

**amplify/data/resource.ts** ファイルで `a.subscription()` を使用してカスタムサブスクリプションを定義します：

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // このPubSubサンプルで使用されるMessageタイプ
  Message: a.customType({
    content: a.string().required(),
    channelName: a.string().required()
  }),

  // メッセージパブリッシュミューテーション
  publish: a.mutation()
    .arguments({
      channelName: a.string().required(),
      content: a.string().required()
    })
    .returns(a.ref('Message'))
    .handler(a.handler.custom({ entry: './publish.js' }))
    .authorization(allow => [allow.publicApiKey()]),

  // highlight-start
  // 受信メッセージをサブスクライブ
  receive: a.subscription()
    // 'publish'ミューテーションをサブスクライブ
    .for(a.ref('publish')) 
    // カスタムフィルターを設定するサブスクリプションハンドラー
    .handler(a.handler.custom({entry: './receive.js'})) 
    // データにサブスクライブできるユーザーの認可ルール
    .authorization(allow => [allow.publicApiKey()]),
  // highlight-end

  // チャネルを管理するデータモデル
  Channel: a.model({
    name: a.string(),
  }).authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema
});
```

この例では、汎用的なPubSub機能を構築しています。これには `publish` の引数を `Channel` の形式に変換する必要があります。**amplify/data/** フォルダに以下の内容の新しい `publish.js` ファイルを作成します：

```js title="amplify/data/publish.js"
// このハンドラーは単にミューテーションの引数を結果として渡すだけです
export function request() {
  return {}
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  return ctx.args
}
```

次に、**amplify/data/** フォルダに新しい `receive.js` ファイルを作成してサブスクリプションのハンドラーを定義します。この場合は単純なパススルーです。次のセクションでは、このハンドラーを使用してより高度なサブスクリプションフィルターを構築する方法を説明します。

> **Info:** **注釈：** 近い将来、このパススルーを内部で自動的に作成する開発者体験の向上を計画しています。

```ts title="amplify/data/receive.js"
export function request() {
  return {};
}

export const response = (ctx) => {
  return ctx.result;
};
```

## クライアント側でカスタムサブスクリプションをサブスクライブ

生成されたDataクライアントから、`client.subscriptions` の下にすべてのカスタムサブスクリプションが見つかります。`.subscribe()` 関数を使用してサブスクライブし、`next` 関数を使用して受信イベントを処理します。

```ts
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'

const client = generateClient<Schema>()

const sub = client.subscriptions.receive()
  .subscribe({
    next: event => {
      console.log(event)
    }
  }
)
```

カスタムミューテーションを使用してイベントをパブリッシュすることで、リアルタイムサブスクリプションをテストできます。

```ts
client.mutations.publish({
  channelName: "world",
  content: "My first message!"
})
```

サブスクリプションイベントが受信され、ペイロードがアプリの開発者コンソールにログされます。`unsubscribe()` 関数を使用してサブスクリプションを切断します。

```ts
sub.unsubscribe()
```

## （オプション）サーバー側のサブスクリプションフィルターを追加

> **Info:** **注釈：** カスタムサブスクリプションの `.authorization()` モディファイアーは `owner` ストラテジーをサポートしていません。これはモデルサブスクリプションと異なり、サブスクリプションイベントがより多くのユーザーにブロードキャストされる可能性があります。

カスタムサブスクリプションに引数を追加することで、サブスクリプションフィルターを追加できます。

フィルターをカスタマイズしたい場合は、サブスクリプションハンドラーを変更します。この例では、顧客が `namePrefix` パラメータを渡すことができるようにして、エンドユーザーが `namePrefix` で始まるチャネル内のチャネルイベントのみを受信できるようにします。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Channel: a.model({
    name: a.string(),
  }).authorization(allow => [allow.publicApiKey()]),

  Message: a.customType({
    content: a.string().required(),
    channelName: a.string().required()
  }),

  publish: a.mutation()
    .arguments({
      channelName: a.string().required(),
      content: a.string().required()
    })
    .returns(a.ref('Message'))
    .handler(a.handler.custom({ entry: './publish.js' }))
    .authorization(allow => [allow.publicApiKey()]),

  receive: a.subscription()
    .for(a.ref('publish'))
    // highlight-next-line
    .arguments({ namePrefix: a.string() })
    .handler(a.handler.custom({entry: './receive.js'}))
    .authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema
});
```

ハンドラーで、カスタムサブスクリプションに渡される引数に基づいてカスタムサブスクリプションフィルターを設定できます。この例では、**amplify/data/resource.ts** ファイルの横に新しい **receive.js** ファイルを作成します：

```js
import { util, extensions } from "@aws-appsync/utils"

// サブスクリプションハンドラーはリクエストで `null` ペイロードを返す必要があります
export function request() { return { payload: null } }

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  const filter = {
    channelName: {
      beginsWith: ctx.args.namePrefix
    }
  }

  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter))

  return null
}
```

---
title: "DynamoDBのバッチ操作"
section: "build-a-backend/data/custom-business-logic"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-13T16:03:51.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/batch-ddb-operations/"
---

DynamoDBのバッチ操作を使用すると、単一のミューテーションで複数のアイテムを追加できます。

## ステップ1 - カスタムミューテーションを定義する

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // 1. 戻り値の型をカスタム型またはモデルとして定義します
  Post: a.model({
    id: a.id(),
    content: a.string(),
    likes: a.integer()
  }),

  // 2. 戻り値の型と、オプションで引数を持つミューテーションを定義します
  BatchCreatePost: a
    .mutation()
    // このクエリが受け入れる引数
    .arguments({
      content: a.string().array()
    })
    .returns(a.ref('Post').array())
    // サインイン済みユーザーのみがこのAPIを呼び出すことを許可します
    .authorization(allow => [allow.authenticated()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema
});
```

## ステップ2 - カスタムビジネスロジックハンドラーコードを構成する

クエリまたはミューテーションを定義した後、[AppSync JavaScriptリゾルバーで提供されるカスタムリゾルバー](https://docs.aws.amazon.com/appsync/latest/devguide/tutorials-js.html)を使用してカスタムビジネスロジックを作成する必要があります。

カスタムリゾルバーは「リクエスト/レスポンス」ベースで機能します。データソースを選択し、リクエストをデータソースの入力パラメーターにマップしてから、データソースのレスポンスをクエリ/ミューテーションの戻り値の型にマップします。カスタムリゾルバーは、コールドスタートがない、管理するインフラストラクチャが少ない、Lambda関数の呼び出しに対する追加料金がないという利点があります。[カスタムリゾルバーと関数の選択](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html#choosing-data-source)を確認してください。

`amplify/data/resource.ts`ファイルで、`a.handler.custom`を使用してカスタムハンドラーを定義します。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    id: a.id(),
    content: a.string(),
    likes: a.integer()
  }),

  BatchCreatePost: a
    .mutation()
    .arguments({
      contents: a.string().array()
    })
    .returns(a.ref('Post').array())
    .authorization(allow => [allow.authenticated()])
    // 1. カスタムハンドラーを追加します
    .handler(
      a.handler.custom({
        dataSource: a.ref('Post'),
        entry: './BatchCreatePostHandler.js',
      })
    )
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema
});
```

Amplifyはリゾルバーコンテキストスタッシュにいくつかの値を格納し、カスタムリゾルバーでアクセスできます。

| 名前                      | 説明                                  |
| ------------------------- | -------------------------------------------- |
| awsAppsyncApiId           | AppSync APIのID。                   |
| amplifyApiEnvironmentName | Amplify APIの環境名。（サンドボックスでは`NONE`) |

Amplifyが生成したDynamoDBテーブル名は、コンテキストスタッシュの変数から構築できます。テーブル名の形式は`<model-name>-<aws-appsync-api-id>-<amplify-api-environment-name>`です。たとえば、`Post`モデルのテーブル名は`Post-123456-dev`になります。ここで、`123456`はAppSync APIのID、`dev`はAmplify API環境名です。

```ts title="amplify/data/BatchCreatePostHandler.js"
import { util } from '@aws-appsync/utils';

export function request(ctx) {
  var now = util.time.nowISO8601();

  return {
    operation: 'BatchPutItem',
    tables: {
      [`Post-${ctx.stash.awsAppsyncApiId}-${ctx.stash.amplifyApiEnvironmentName}`]: ctx.args.contents.map((content) =>
        util.dynamodb.toMapValues({
          content,
          id: util.autoId(),
          createdAt: now,
          updatedAt: now,
        })
      ),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.data[`Post-${ctx.stash.awsAppsyncApiId}-${ctx.stash.amplifyApiEnvironmentName}`];
}
```

## ステップ3 - カスタムクエリまたはミューテーションを呼び出す

生成されたDataクライアントから、すべてのカスタムクエリとミューテーションは、それぞれ`client.queries.`および`client.mutations.` APIの下にあります。

```ts
const { data, errors } = await client.mutations.BatchCreatePost({
  contents: ['Post 1', 'Post 2', 'Post 3']
});
```

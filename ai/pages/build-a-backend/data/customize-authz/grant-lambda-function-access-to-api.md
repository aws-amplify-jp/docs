---
title: "Lambda関数にAPIとデータへのアクセスを許可する"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-04-18T18:44:52.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/"
---

`defineData`への関数アクセスは、スキーマオブジェクトの承認ルールを使用して設定できます。

```ts title="amplify/data/resource.ts"
import {
  a,
  defineData,
  type ClientSchema
} from '@aws-amplify/backend';
import { functionWithDataAccess } from '../function/data-access/resource';

const schema = a
  .schema({
    Todo: a.model({
      name: a.string(),
      description: a.string(),
      isDone: a.boolean()
    })
  })
  // highlight-next-line
  .authorization(allow => [allow.resource(functionWithDataAccess)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema
});
```

新しいディレクトリとリソースファイル `amplify/functions/data-access/resource.ts` を作成します。次に、`defineFunction` を使用して関数を定義します。

```ts title="amplify/functions/data-access/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const functionWithDataAccess = defineFunction({
  name: 'data-access',
});
```

`defineFunction` から返されたオブジェクトは、スキーマ承認ルールの `allow.resource()` に直接渡すことができます。これにより、関数はGraphQL APIに対してQuery、Mutation、およびSubscription操作を実行する権限が付与されます。`.to()` メソッドを使用して、1つ以上の操作へのアクセスを制限します。

```ts title="amplify/data/resource.ts"
const schema = a
  .schema({
    Todo: a.model({
      name: a.string(),
      description: a.string(),
      isDone: a.boolean()
    })
  })
  // highlight-start
  .authorization(allow => [
    allow.resource(functionWithDataAccess).to(['query', 'listen'])
  ]); // クエリとサブスクリプション操作は許可されますが、ミューテーションは許可されません
// highlight-end
```

> **Info:** 関数アクセスはスキーマオブジェクトでのみ設定できます。個別のモデルやフィールドでは設定できません。

## `aws-amplify` を使用したAPIへのアクセス

関数のハンドラーファイルで、Amplifyデータクライアントを設定します

```ts title="amplify/functions/data-access/handler.ts"
import type { Handler } from 'aws-lambda';
import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/<function-name>'; // 関数名に置き換えてください

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler = async (event) => {
  // 関数コードをここに記述
}
```

> **Warning:** `getAmplifyDataClientConfig` でAmplifyを設定する場合、関数はバックエンド展開時に作成されたS3バケットからスキーマ情報を使用し、関数が使用する必要があるアクセスの許可が付与されます。バックエンド展開外でこのバケットに対する変更は、関数を破損する可能性があります。

クライアントコードを生成したら、データにアクセスするように関数を更新します。以下のコードはtodoを作成してから、すべてのtodoを一覧表示します。

```ts title="amplify/functions/data-access/handler.ts"
//...
const client = generateClient<Schema>();

export const handler: Handler = async (event) => {
  const { errors: createErrors, data: newTodo } = await client.models.Todo.create({
    name: "My new todo",
    description: "Todo description",
    isDone: false,
  })

  const { errors: listErrors, data: todos } = await client.models.Todo.list();

  return event;
};
```

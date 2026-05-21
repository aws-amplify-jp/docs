---
title: "外部HTTPエンドポイントに接続"
section: "build-a-backend/data/custom-business-logic"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-06T18:52:05.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/"
---

HTTPデータソースを使用すると、Data API内でHTTPリゾルバーを迅速に設定できます。

このガイドでは、HTTPデータソースを使用して外部REST APIへの接続を確立し、Amplify Dataのカスタムミューテーションとクエリを使用してREST APIと相互作用する方法について説明します。

## ステップ1 - カスタムタイプを設定する

このガイドの目的のために、`Post`タイプを定義し、それのためのレコードを保存する既存の外部REST APIを使用します。Amplify Gen 2では、`customType`はAmplify生成DynamoDBテーブルで支援されないタイプをスキーマに追加します。

`Post`タイプを定義すると、カスタムクエリとミューテーションを定義する際に戻り値の型として参照できます。

まず、`Post`カスタムタイプをスキーマに追加します：

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
  // highlight-start
  Post: a.customType({
    title: a.string(),
    content: a.string(),
    author: a.string().required(),
  }),
  // highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

## ステップ2 - REST APIまたはHTTP APIをデータソースとして追加する

外部REST APIまたはHTTP APIを統合するには、それをHTTPデータソースとして設定する必要があります。`amplify/backend.ts`ファイルに次のコードを追加します。

```ts title="amplify/backend.ts"

import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

const httpDataSource = backend.data.addHttpDataSource(
  "HttpDataSource",
  "https://www.example.com"
);

```
## ステップ3 - カスタムクエリとミューテーションを定義する

REST APIがデータソースとして追加されたので、`a.handler.custom()`修飾子を使用してカスタムクエリとミューテーション内でそれを参照できます。これはデータソースの名前とリゾルバーのエントリポイントを受け入れます。

次のコード例を使用して、`addPost`、`getPost`、`updatePost`、および`deletePost`をカスタムクエリとミューテーションとしてスキーマに追加します：

#### [addPost]
```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
    title: a.string(),
    content: a.string(),
    author: a.string().required(),
  }),
  // highlight-start
  addPost: a
    .mutation()
    .arguments({
      title: a.string(),
      content: a.string(),
      author: a.string().required(),
    })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "HttpDataSource",
        entry: "./addPost.js",
      })
    ),
  // highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

#### [getPost]
```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
    title: a.string(),
    content: a.string(),
    author: a.string().required(),
  }),
  // highlight-start
  getPost: a
    .query()
    .arguments({ id: a.id().required() })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "HttpDataSource",
        entry: "./getPost.js",
      })
    ),
  // highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

#### [updatePost]
```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
    title: a.string(),
    content: a.string(),
    author: a.string().required(),
  }),
  // highlight-start
  updatePost: a
    .mutation()
    .arguments({
      id: a.id().required(),
      title: a.string(),
      content: a.string(),
      author: a.string(),
    })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "HttpDataSource",
        entry: "./updatePost.js",
      })
    ),
  // highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

#### [deletePost]
```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
    title: a.string(),
    content: a.string(),
    author: a.string().required(),
  }),
  // highlight-start
  deletePost: a
    .mutation()
    .arguments({ id: a.id().required() })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "HttpDataSource",
        entry: "./deletePost.js",
      })
    ),
  // highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

## ステップ4 - カスタムビジネスロジックハンドラーコードを設定する

次に、`amplify/data`フォルダに以下のファイルを作成し、コード例を使用して前のステップでスキーマに追加されたカスタムクエリとミューテーションのカスタムリゾルバーを定義します。これらはAppSync JavaScriptリゾルバーです。

#### [addPost]
```js title="amplify/data/addPost.js"
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    method: "POST",
    resourcePath: "/post",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        title: ctx.arguments.title,
        content: ctx.arguments.content,
        author: ctx.arguments.author,
      },
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
    return JSON.parse(ctx.result.body).data;
  } else {
    return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}
```

#### [getPost]
```js title="amplify/data/getPost.js"
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    method: "GET",
    resourcePath: "/posts/" + ctx.arguments.id,
    params: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
    return JSON.parse(ctx.result.body).data;
  } else {
    return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}
```

#### [updatePost]
```js title="amplify/data/updatePost.js"
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    method: "POST",
    resourcePath: "/posts/" + ctx.arguments.id,
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        title: ctx.arguments.title,
        content: ctx.arguments.content,
        author: ctx.arguments.author,
      },
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
    return JSON.parse(ctx.result.body).data;
  } else {
    return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

```

#### [deletePost]
```js title="amplify/data/deletePost.js"
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    method: "DELETE",
    resourcePath: "/posts/" + ctx.arguments.id,
    params: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
    return JSON.parse(ctx.result.body).data;
  } else {
    return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}
```

## ステップ5 - カスタムクエリまたはミューテーションを呼び出す

生成されたDataクライアントから、すべてのカスタムクエリとミューテーションを`client.queries.`および`client.mutations.` APIの下でそれぞれ見つけることができます。

#### [addPost]
```ts title="App.tsx"
const { data, errors } = await client.mutations.addPost({
  title: "My Post",
  content: "My Content",
  author: "Chris",
});
```

#### [getPost]
```ts title="App.tsx"
const { data, errors } = await client.queries.getPost({
  id: "<post-id>"
});
```

#### [updatePost]
```ts title="App.tsx"
const { data, errors } = await client.mutations.updatePost({
  id: "<post-id>",
  title: "An Updated Post",
});
```

#### [deletePost]
```ts title="App.tsx"
const { data, errors } = await client.mutations.deletePost({
  id: "<post-id>",
});
```

## 結論

このガイドでは、外部REST APIをHTTPデータソースとしてAmplify Data APIに追加し、AppSync JSリゾルバーによって処理されるカスタムクエリとミューテーションを定義し、Amplify Gen 2 Dataクライアントを使用して外部REST API内のPostアイテムを操作しました。

クリーンアップするには、ターミナルのサンドボックスプロセスを終了するときにプロンプトを受け入れることで、サンドボックスを削除できます。または、AWS Amplifyコンソールを使用してサンドボックス環境を管理および削除することもできます。

---
title: 並べ替えによるGraphQLクエリ
description: GraphQL クエリでソートを実装する方法
---

このガイドでは、GraphQL 変換ライブラリを使用してGraphQL APIでソートを実装する方法を説明します。

### 概要

始めるには、Todo アプリの基本的なGraphQLスキーマから始めましょう。

```graphql
type Todo @model {
  id: ID!
  title: String!
}
```

API が `@model` ディレクティブで作成されると、次のクエリが自動的に作成されます。

```graphql
type Query {
  getTodo(id: ID!): Todo
  listTodos(filter: ModelTodoFilterInput, limit: Int, nextToken: String): ModelTodoConnection
}
```

次に、 `ModelTodoConnection` 型を見て、 `listTodos` クエリが実行されたときに返されるデータのアイデアを取得します。

```graphql
type ModelTodoConnection {
  items: [Todo]
  nextToken: String
}
```

デフォルトでは、 `listTodos` クエリは `items` array __を順序なしで__を返します。 何度も、タイトル、作成日、またはいくつかの他の方法で順序付けられるこれらの項目が必要になります。

To enable this, you can use the [@key](~/cli/graphql-transformer/key.md) directive. This directive will allow you to set a custom `sortKey` on any field in your API.

### 実装

In this example, you will enable sorting by the `createdAt` field. By default, Amplify will populate this `createdAt` field with a timestamp if none is passed in.

これを有効にするには、以下のスキーマを更新してください:

```graphql
type Todo @model
  @key(name: "todosByDate", fields: ["type", "createdAt"], queryField: "todosByDate") {
  id: ID!
  title: String!
  type: String!
  createdAt: String!
}
```

<amplify-callout>

Todo を作成する際には、 `タイプ` フィールドを正常に動作させる必要があります。

</amplify-callout>

次に、 `タイプ` フィールドを確実に取り込むために、いくつかの ToDo を作成します。

```graphql
mutation createTodo {
  createTodo(input: {
    title: "Todo 1"
    type: "Todo"
  }) {
    id
    title
  }
}
```

これで、新しい `todosByDate` クエリを使用して、日付ごとに昇順または降順でタスクをクエリできます。

```graphql
query todosByDate {
  todosByDate(
    type: "Todo"
    sortDirection: ASC
  ) {
    items {
      id
      title
      createdAt
    }
  }
}

query todosByDateDescending {
  todosByDate(
    type: "Todo"
    sortDirection: DESC
  ) {
    items {
      id
      title
      createdAt
    }
  }
}
```

`@key` ディレクティブの詳細については、こちらのドキュメント [をご覧ください](~/cli/graphql-transformer/key.md)

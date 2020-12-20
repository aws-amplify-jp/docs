---
title: GraphQL ページネーション
description: GraphQL でページネーションを実装する方法
---

このガイドでは、GraphQL API でページネーションを実装する方法を学びます。

大きなレコードセットを扱う場合は、最初の __N__ 個のアイテム数のみを取得することができます。 たとえば、Todo アプリの基本的なGraphQL スキーマから始めましょう。

```graphql
type Todo @model {
  id: ID!
  title: String!
  description: String 
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

When querying the API using the `listTodos` query, the return type will be of `ModelTodoConnection`, meaning you can return both an array of `Todos` and a `nextToken`.

The `nextToken` is what is used to handle pagination. If the `nextToken` is `null`, that means that there is no more data to return from the API. If the `nextToken` is present, you can use the value as an argument to the next `listTodos` query to return the next selection set from the API.

これをテストするには、次のような変更を使用して 5 つの todos を作成してみてください。

```sh
<unk> createTodo {
  createTodo(input: {
    title: "Todo 1"
    description: "My first todo"
  }) {
    id
    title
    description
  }
}
```

Next, you can set the limit of the number of todos in a query by passing in a `limit` argument. In this query, you'll set the limit to 2 items and request a `nextToken` as a return value:

```graphql
query listTodos {
  listTodos(limit: 2) {
    items {
      id
      title
      description
    }
    nextToken
  }
}
```

 APIから次の2つのアイテムをクエリするには、引数としてこの `nextToken` を渡すことができます。

```graphql
query listTodos {
  listTodos(limit: 2, nextToken: <your_token>) {
    items {
      id
      title
      description
    }
    nextToken
  }
}
```

返却される他の項目がない場合、レスポンス内の `nextToken` はnullに設定されます。

<inline-fragment platform="js" src="~/guides/api-graphql/fragments/js/graphql-pagination.md"></inline-fragment> 
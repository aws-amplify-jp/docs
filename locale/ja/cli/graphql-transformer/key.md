---
title: データをキーでインデックスする
description: '@key ディレクティブを使用すると、@model タイプのカスタムインデックス構造を簡単に設定できます。'
---

## @key

`@key` ディレクティブは `@model` 型のカスタムインデックス構造を簡単に設定できます。

Amazon DynamoDBは、キー値およびドキュメントデータベースであり、あらゆる規模で1桁のミリ秒のパフォーマンスを提供しますが、アクセスパターンで動作するようにするには、少しの前置きが必要です。 DynamoDBのクエリ操作は、データを効率的にクエリするために最大2つの属性を使用することができます。 クエリに渡された最初のクエリ引数(ハッシュキー)は厳密な等価性を使用しなければならず、2番目の属性 (ソートキー) は gt を使用できます。 GE、Lt、le、eq、beginsWith、そしてbetween。 DynamoDBは、多くのアプリケーションに十分強力な多種多様なアクセスパターンを効果的に実装できます。

スキーマ設計中にデータをモデリングする場合、活用する必要がある一般的なパターンがあります。 [リレーショナルデザインに関連する17パターンの完全な動作スキーマ](~/cli/graphql-transformer/dataaccess.md) を提供します。

### 定義

```graphql
OBJECTの@key(fields: [String!]!, name: String, queryField: String)
```

**引数**

| 引数         | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| フィールド      | A list of fields that should comprise the @key, used in conjunction with an `@model` type. The first field in the list will always be the **HASH** key. If two fields are provided the second field will be the **SORT** key. If more than two fields are provided, a single composite **SORT** key will be created from a combination of `fields[1...n]`. All generated GraphQL queries & mutations will be updated to work with custom `@key` directives. |
| 名前         | When provided, specifies the name of the secondary index. When omitted, specifies that the `@key` is defining the primary index. You may have at most one primary key per table and therefore you may have at most one `@key` that does not specify a **name** per `@model` type.                                                                                                                                                                           |
| queryField | ( *名* 引数を指定することによって) セカンダリインデックスを定義する場合 これは、指定された名前でセカンダリインデックスをクエリする新しいトップレベルクエリフィールドを指定します。                                                                                                                                                                                                                                                                                                                                                               |

### @key の使い方

For an introduction to the `@key` directive, let's start by looking a basic `Todo` app schema with only an `@model` directive.

```graphql
type Todo @model {
  id: ID!
  name: String!
  status: String!
}
```

デフォルトでは、 `@model` ディレクティブは以下の 2 つのデータアクセスパターンを有効にします。

1. `getTodo` - `idでTodoを取得`
2. `listTodos` - すべての Todos をクエリ

You will often need additional data access patterns. For example in a Todo app you may want to fetch Todos by `status`. The `@key` directive would allow you to add this additional data access pattern with a single new line of code:

```graphql
type Todo @model
  @key(name: "todosByStatus", fields: ["status"], queryField: "todosByStatus") {
  id: ID!
  name: String!
  status: String!
}
```

新しい `todosByStatus` クエリを使用すると、 `ステータス` でタスクをフェッチできます:

```graphql
query todosByStatus {
  todosByStatus(status: "completed") {
    items {
      id
      name
      status
    }
  }
}
```

次に、より一般的なデータアクセスパターンをいくつか検討し、それらをモデル化する方法を詳しく見てみましょう。

### @key を使用してデータモデルを設計する

When designing data models using the `@key` directive, the first step should be to write down your application's expected access patterns. For example, let's say you were building an e-commerce application and needed to implement access patterns like:

1. 顧客をEメールで取得
2. createdAtによって顧客から注文を取得します。
3. createdAtによってステータス順にアイテムを取得します。
4. createdAtによってステータス別にアイテムを取得します。

ここでは、 `schema.graphql` にこれらのアクセスパターンを実装するためのカスタムキーをどのように定義するかを見てみましょう。

#### 顧客をEメールで取得

```graphql
type Customer @model @key(fields: ["email"]) {
  email: String!
  username: String
}
```

A `@key` without a *name* specifies the key for the DynamoDB table's primary index. You may only provide 1 `@key` without a *name* per `@model` type.

The example above shows the simplest case where you are specifying that the table's primary index should have a simple key where the hash key is *email*. This allows you to get unique customers by their *email*.

```graphql
クエリ GetCustomerById {
  getCustomer(email:"me@email.com") {
    email
    username
  }
}
```

これは簡単なルックアップ操作に最適ですが、少し複雑なクエリを実行する必要がある場合はどうでしょうか?

#### createdAtによって顧客の電子メールで注文を取得します。

```graphql
type Order @model @key(fields: ["customerEmail", "createdAt"]) {
    customerEmail: String!
    createdAt: String!
    orderId: ID!
}
```

This `@key` above allows you to efficiently query *Order* objects by both a *customerEmail* and the *createdAt* time stamp. The `@key` above creates a DynamoDB table where the primary index's hash key is *customerEmail* and the sort key is *createdAt*. This allows you to write queries like this:

```graphql
query ListOrdersForCustomerIn2019 {
  listOrders(customerEmail:"me@email.com", createdAt: { beginsWith: "2019" }) {
    items {
      orderId
      customerEmail
      createdAt
    }
  }
}
```

上記のクエリでは、より強力なクエリパターンをDynamoDB上に実装するために複合キー構造を使用する方法を示していますが、まだ完了していません。

Given that DynamoDB limits you to query by at most two attributes at a time, the `@key` directive helps by streamlining the process of creating composite sort keys such that you can support querying by more than two attributes at a time. For example, you can implement “Get items by `orderId`, `status`, and `createdAt”` as well as “Get items by `status` and `createdAt”` for a single `@model` with this schema.

```graphql
type Item @model
  @key(fields: ["orderId", "status", "createdAt"])
  @key(name: "ByStatus", fields: ["status", "createdAt"], queryField: "itemsByStatus") {
  orderId: ID!
  status: Status!
  createdAt: AWSDateTime!
  name: String!
}
enum Status {
  DELIVERED
  IN_TRANSIT
  PENDING
  UNKNOWN
}
```

The primary `@key` with 3 fields performs a bit more magic than the 1 and 2 field variants. The first field orderId will be the **HASH** key as expected, but the **SORT** key will be a new composite key named *status#createdAt* that is made of the *status* and *createdAt* fields on the @model. The `@key` directive creates the table structures and also generates resolvers that inject composite key values for you during queries and mutations.

このスキーマを使用して、プライマリインデックスをクエリして、2019年に作成されたIN_TRANSITアイテムを所定の注文に対して取得できます。

```graphql
# Get items for order by status by createdAt.
query ListInTransitItemsForOrder {
  listItems(orderId:"order1", statusCreatedAt: { beginsWith: { status: IN_TRANSIT, createdAt: "2019" }}) {
    items {
      orderId
      status
      createdAt
      name
    }
  }
}
```

The query above exposes the *statusCreatedAt* argument that allows you to configure DynamoDB key condition expressions without worrying about how the composite key is formed under the hood. Using the same schema, you can get all PENDING items created in 2019 by querying the secondary index "ByStatus" via the `Query.itemsByStatus` field.

```graphql
query ItemsByStatus {
  itemsByStatus(status: PENDING, createdAt: {beginsWith:"2019"}) {
    items {
      orderId
      status
      createdAt
      name
    }
    nextToken
  }
}
```

### @key で API を進化させる

`@key`を使用して API を変更する際に考慮すべきことがいくつかあります。 新しいアクセスパターンを有効にする必要がある場合、または既存のアクセスパターンを変更する必要がある場合は、次の手順に従ってください。

1. 新規または更新されたアクセスパターンを有効にする新しいインデックスを作成します。
2. If adding an `@key` with 3 or more fields, you will need to back-fill the new composite sort key for existing data. With a `@key(fields: ["email", "status", "date"])`, you would need to backfill the `status#date` field with composite key values made up of each object's *status* and *date* fields joined by a `#`. You do not need to backfill data for `@key` directives with 1 or 2 fields.
3. 追加の変更をデプロイし、新しいアクセス パターンを使用するようにダウンストリーム アプリケーションを更新します。
4. 古いインデックスは必要ないと確信したら、その `@key` を削除し、API を再度デプロイします。

### @key と @connection を組み合わせます

Secondary indexes created with the `@key` directive can be used to resolve connections when creating relationships between types. To learn how this works, check out [the documentation for @connection](#connection).

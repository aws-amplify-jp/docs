---
title: あなたのモデルタイプを定義します
description: スキーマを構成するさまざまなタイプを指定します。
---

## @model

Object types that are annotated with `@model` are top-level entities in the generated API. Objects annotated with `@model` are stored in Amazon DynamoDB and are capable of being protected via `@auth`, related to other objects via `@connection`, and streamed into Amazon Elasticsearch via `@searchable`. You may also apply the `@versioned` directive to instantly add a version field and conflict detection to a model type.

### 定義

以下のSDLは、Amazon DynamoDBがサポートするAPI内で `トップレベルのオブジェクトタイプを簡単に定義できる` @model ディレクティブを定義しています。

```graphql
directive @model(
  queries: ModelQueryMap
  mutations: ModelMutationMap
  subscriptions: ModelSubscriptionMap
  timestamps: TimestampConfiguration
) on OBJECT
input ModelMutationMap {
  create: String
  update: String
  delete: String
}
input ModelQueryMap {
  get: String
  list: String
}
input ModelSubscriptionMap {
  onCreate: [String]
  onUpdate: [String]
  onDelete: [String]
  level: ModelSubscriptionLevel
}
enum ModelSubscriptionLevel {
  off
  public
  on
}
input TimestampConfiguration {
  createdAt: String
  updatedAt: String
}
```

### 使用法

GraphQL オブジェクトの型を定義し、 `@model` ディレクティブで注釈を付けて、DynamoDB にその型の オブジェクトを格納し、CRUDL クエリと 変更を自動的に設定します。

```graphql
type Post @model {
  id: ID! # id: ID! is a required attribute.
  title: String!
  tags: [String!]!
}
```

生成されたクエリ、変更、サブスクリプションの名前を上書きしたり、操作を完全に削除したりすることもできます。

```graphql
type Post @model(queries: { get: "post" }, mutations: null, subscription: null) {
  id: ID!
  title: String!
  tags: [String!]!
}
```

Model ディレクティブは自動的に createdAt と updatedAt タイムスタンプを各エンティティに追加します。 timestamp フィールド名はディレクティブに `timestamps` 属性を渡すことで変更できます。

```graphql
type Post @model(timestamps:{createdAt: "createdOn", updatedAt: "updatedOn"}) {
  id: ID!
  title: String!
  tags: [String!]!
}
```

上のスキーマは、 `createdOn` と `updatedOn` フィールドを表示してポストを生成します。

```graphql
type Post {
  id: ID!
  title: String!
  tags: [String!]!
  createdOn: AWSDateTime!
  updatedOn: AWSDateTime!
}
```

The automatically added `createdAt` and `updatedAt` fields can't be set in create or update mutation. If these fields need to be controlled as part of the mutation, they should be in the input schema and should have `AWSDateTime` as their type

```graphql
type Post @model {
  id: ID!
  title: String!
  tags: [String!]!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

これは、単一のクエリ フィールド `post(id: ID!): ポスト` と の変更フィールドを作成し、設定します。

### 生成

単一の `@model` ディレクティブで以下の AWS リソースを設定します。

- PAY_PER_REQUEST請求モードを持つAmazon DynamoDBテーブルをデフォルトで有効にしました。
- 上の表にアクセスするように設定されたAWS AppSync DataSource。
- AWS AppSync がお客様に代わって上記の表を呼び出すことを可能にするDataSourceに接続されたAWS IAMロール。
- Up to 8 resolvers (create, update, delete, get, list, onCreate, onUpdate, onDelete) but this is configurable via the `queries`, `mutations`, and `subscriptions` arguments on the `@model` directive.
- 変更の作成、更新、削除のためのオブジェクトを入力します。
- リストクエリと接続フィールドのオブジェクトをフィルタリングできる入力オブジェクトをフィルタリングします。
- リストクエリの場合、デフォルトのオブジェクト数は 100 です。 **limit** 引数を設定することで、この動作を上書きできます。

この入力スキーマドキュメント

```graphql
type Post @model {
  id: ID!
  title: String
  metadata: MetaData
}
type MetaData {
  category: Category
}
enum Category { comedy news }
```

次のスキーマパーツを生成します

```graphql
type Post {
  id: ID!
  title: String!
  metadata: MetaData
  createdAt: AWSDatetime
  updatedAt: AWSDateTime
}

type MetaData {
  category: Category
}

enum Category {
  comedy
  news
}

input MetaDataInput {
  category: Category
}

enum ModelSortDirection {
  ASC
  DESC
}

type ModelPostConnection {
  items: [Post]
  nextToken: String
}

input ModelStringFilterInput {
  ne: String
  eq: String
  le: String
  lt: String
  ge: String
  gt: String
  contains: String
  notContains: String
  between: [String]
  beginsWith: String
}

input ModelIDFilterInput {
  ne: ID
  eq: ID
  le: ID
  lt: ID
  ge: ID
  gt: ID
  contains: ID
  notContains: ID
  between: [ID]
  beginsWith: ID
}

input ModelIntFilterInput {
  ne: Int
  eq: Int
  le: Int
  lt: Int
  ge: Int
  gt: Int
  contains: Int
  notContains: Int
  between: [Int]
}

input ModelFloatFilterInput {
  ne: Float
  eq: Float
  le: Float
  lt: Float
  ge: Float
  gt: Float
  contains: Float
  notContains: Float
  between: [Float]
}

input ModelBooleanFilterInput {
  ne: Boolean
  eq: Boolean
}

input ModelPostFilterInput {
  id: ModelIDFilterInput
  title: ModelStringFilterInput
  and: [ModelPostFilterInput]
  or: [ModelPostFilterInput]
  not: ModelPostFilterInput
}

type Query {
  getPost(id: ID!): Post
  listPosts(filter: ModelPostFilterInput, limit: Int, nextToken: String): ModelPostConnection
}

input CreatePostInput {
  title: String!
  metadata: MetaDataInput
}

input UpdatePostInput {
  id: ID!
  title: String
  metadata: MetaDataInput
}

input DeletePostInput {
  id: ID
}

type Mutation {
  createPost(input: CreatePostInput!): Post
  updatePost(input: UpdatePostInput!): Post
  deletePost(input: DeletePostInput!): Post
}

type Subscription {
  onCreatePost: Post @aws_subscribe(mutations: ["createPost"])
  onUpdatePost: Post @aws_subscribe(mutations: ["updatePost"])
  onDeletePost: Post @aws_subscribe(mutations: ["deletePost"])
}
```

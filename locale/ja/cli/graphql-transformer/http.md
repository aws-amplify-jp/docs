---
title: HTTP リゾルバの設定
description: '`@http`ディレクティブを使用すると、AWS AppSync HTTPリゾルバを作成することで、HTTPまたはHTTPSエンドポイントをAppSync APIにすばやく接続できます。'
---

## @http

`@http` ディレクティブを使用すると、AWS AppSync API 内で HTTP リゾルバを素早く設定できます。

### 定義

```graphql
@http(method: HttpMethod, url: String! headers: [HttpHeader]) on FIELD_DEFINITION
enum HttpMethod { PUT POST GET DELETE PATCH }
input HttpHeader {
  key: String
  value: String
}
```

### 使用法

The `@http` directive allows you to quickly connect HTTP or HTTPS endpoint to an AppSync API by creating an AWS AppSync HTTP resolver. To connect to an endpoint, add the `@http` directive to a field in your `schema.graphql` file. The directive allows you to define URL path parameters, and specify a query string and/or specify a request body. For example, given the definition of a post type,

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
}

type Query {
  listPosts: Post @http(url: "https://www.example.com/posts")
}
```

Amplifyは、 `listPosts` クエリが使用されたときにリクエストをURLに送信する定義を以下に生成します。

```graphql
type Query {
  listPosts: Post
}
```

**要求ヘッダー**

The `@http` directive generates resolvers that can handle xml and json responses. If an HTTP method is not defined, `GET` is used by default. You can specify a list of static headers to be passed with the HTTP requests to your backend in your directive definition.

```graphql
type Query {
  listPosts: Post
    @http(
      url: "https://www.example.com/posts"
      headers: [{ key: "X-Header", value: "X-Header-Value" }]
    )
}
```

**パスパラメータ**

You can create dynamic paths by specifying parameters in the directive URL by using the special `:<parameter>` notation. Your set of parameters can then be specified in the `params` input object of the query. Note that path parameters are not added to the request body or query string. You can define multiple parameters.

定義が与えられました

```graphql
type Query {
  getPost: Post @http(url: "https://www.example.com/posts/:id")
}
```

Amplify generate

```graphql
type Query {
  getPost(params: QueryGetPostParamsInput!): Post
}

input QueryGetPostParamsInput {
  id: String!
}
```

`params` 入力オブジェクトに `id` id format@@4 を含めることで、特定のポストを取得できます。

```graphql
query post {
  getPost(params: {id: "POST_ID"}) {
    id
    title
  }
}
```

送金されるのは

```
/posts/POST_ID
Host: www.example.com
```

**クエリ文字列**

クエリに変数を指定することで、リクエストでクエリ文字列を送信できます。クエリ文字列はすべてのリクエストメソッドでサポートされています。

定義が与えられました

```graphql
type Query {
  listPosts(sort: String!, from: String!, limit: Int!): Post
    @http(url: "https://www.example.com/posts")
}
```

Amplify generate

```graphql
type Query {
  listPosts(query: QueryListPostsQueryInput!): Post
}

input QueryListPostsQueryInput {
  sort: String!
  from: String!
  limit: Int!
}
```

`クエリ` の入力オブジェクトを使用して、投稿をクエリできます。

```graphql
query posts{
  listPosts(query: {sort: "DESC", from: "last-week", limit: 5}) {
    id
    title
    description
  }
}
```

以下のリクエストを送信します。

```
GET /posts?sort=DESC&from=last-week&limit=5
Host: www.example.com
```

**リクエスト本文**

The `@http` directive also allows you to specify the body of a request, which is used for `POST`, `PUT`, and `PATCH` requests. To create a new post, you can define the following.

```graphql
type Mutation {
  addPost(title: String!, description: String!, views: Int): Post
    @http(method: POST, url: "https://www.example.com/post")
}
```

Amplify generates the `addPost` query field with the `query` and `body` input objects since this type of request also supports a query string. The generated resolver verifies that non-null arguments (e.g.: the `title` and `description`) are passed in at least one of the input objects; if not, an error is returned.

```graphql
type Mutation {
  addPost(query: QueryAddPostQueryInput, body: QueryAddPostBodyInput): Post
}

input QueryAddPostQueryInput {
  title: String
  description: String
  views: Int
}

input QueryAddPostBodyInput {
  title: String
  description: String
  views: Int
}
```

`body` 入力オブジェクトを使用して投稿を追加できます。

```graphql
mutteradd {
  addPost(body: {title: "new post", description: "freshcontent"}) {
    id
  }
}
```

送金されるのは

```
POST /post
Host: www.example.com
{
  title: "new post"
  description: "freshコンテンツ"
}
```

**環境の指定**

`@http` ディレクティブは現在の Amplify CLI 環境を参照するために `${env}` を使用することができます。

```graphql
type Query {
  listPosts: Post @http(
    url: "https://www.example.com/${env}/posts"
  )
}
```

`DEV` 環境で送信される

```
/DEV/posts
Host: www.example.com
```

**異なるコンポーネントを結合する**

@http `@http` ディレクティブの定義では、パラメータ、クエリ、body、ヘッダ、環境の組み合わせを使用できます。

定義が与えられました

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
}

type Comment {
  id: ID!
  content: String
}

type Mutation {
  updatePost(
    title: String!
    description: String!
    views: Int
    withComments: Boolean
  ): Post
    @http(
      method: PUT
      url: "https://www.example.com/${env}/posts/:id"
      headers: [{ key: "X-Header", value: "X-Header-Value" }]
    )
}
```

次の記事を更新できます：

```graphql
mutation update {
  updatePost(
    body: {title: "new title", description: "updated description", views: 100}
    params: {id: "EXISTING_ID"}
    query: {withComments: true}) {
    id
    title
    description
    comments {
      id
      content
    }
  }
}
```

`DEV` 環境で送信される

```
PUT /DEV/posts/EXISTING_ID?withComments=true
Host: www.example.com
X-Header: X-Header-Value
{
  title: "new title"
  description: "updated description"
  views: 100
}
```

**高度なケース**

場合によっては、既存のフィールドデータに基づいてリクエストを送信することができます。 投稿があり、投稿に関連付けられたコメントを単一のクエリでフェッチしたいシナリオを取ります。 `Post` と `Comment` の前の定義を使ってみましょう。


```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
}

type Comment {
  id: ID!
  content: String
}
```

A post can be fetched at `/posts/:id` and a post's comments at `/posts/:id/comments`. You can fetch the comments based on the post id with the following updated definition. `$ctx.source` is a map that contains the resolution of the parent field (`Post`) and gives access to `id`.


```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
    @http(url: "https://www.example.com/posts/${ctx.source.id}/comments")
}

type Comment {
  id: ID!
  content: String
}

type Query {
  getPost: Post @http(url: "https://www.example.com/posts/:id")
}
```

次のクエリと選択セットを使用して、特定の投稿のコメントを取得できます。

```graphql
query post {
  getPost(params: {id: "POST_ID"}) {
    title
    description
    description
    comments {
      id
      content
    }
  }
}
```

`getPost` が id `POST_ID`のポストを取得すると仮定する。 コメント欄は、このリクエストをエンドポイントに送信することで解決されます。

```
/posts/POST_ID/コメント
Host: www.example.com
```

参照変数(ここでは投稿ID)が存在することを確認するチェックはありません。 この技術を使用する場合は、参照されるフィールドが null でないことを確認することをお勧めします。

### 生成

The `@http` transformer will create one HTTP datasource for each identified base URL. For example, if multiple HTTP resolvers are created that interact with the "https://www.example.com" endpoint, only a single datasource is created. Each directive generates one resolver. Depending on the definition, the appropriate `body`, `params`, and `query` input types are created. Note that `@http` transformer does not support calling other AWS services where Signature Version 4 signing process is required.

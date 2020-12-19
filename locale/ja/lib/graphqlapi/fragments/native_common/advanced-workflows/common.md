このセクションでは、独自のカスタム GraphQL リクエストを構築するためのさまざまなユースケースと、そのアプローチ方法について説明します。 必要に応じて、独自のGraphQLリクエストを作成することができます。
- データ転送を減らすためにデータのサブセットのみを取得します
- 選択した深さでネストされたオブジェクトを取得します
- 複数の操作を1つのリクエストに組み合わせます

AWSAPIPluginを既存のワークフローで使用する場合は、GraphQLリクエストが自動的に生成されます。 たとえば、Todo モデルがある場合、変更要求で保存されるTodo は以下のようになります。

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/advanced-workflows/10_example.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/advanced-workflows/10_example.md"></inline-fragment>

カバーの下には、GraphQL ドキュメントと変数を使用してリクエストが生成され、AppSync サービスに送信されます。

```json
{ 
  "query": "mutation createTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      name
      description
    }
  }",
  "variables": "{
    "input": {
      "id": "[UNIQUE-ID]",
      "name": "my first todo",
      "description": "todo description"
    }
  }
}
```

ドキュメントの異なる部分については、次のように説明されています。
- `mution` - 実行される操作タイプ、他の操作タイプは `クエリ` と `サブスクリプション`
- `createTodo($input: CreateTodoInput!)` - 操作の名前と入力。
- `$input: CreateTodoInput!` - 型の入力 `CreateTodoInput!` JSON入力を含む変数を参照する
- `createTodo(input: $input)` - `$inputからの変更操作`
- `id`、 `name`、および `description` を含む選択セットは、レスポンスで指定されたフィールドです。

You can learn more about the structure of a request from [GraphQL Query Language](https://graphql.org/learn/) and [AppSync documentation](https://docs.aws.amazon.com/appsync/latest/devguide/graphql-overview.html). To test out constructing your own requests, open the AppSync console using `amplify console api` and navigate to the Queries tab.

## データのサブセット

ドキュメントの選択セットは、応答で返されるフィールドを指定します。 たとえば、説明なしでTodoのビューを表示する場合は、フィールドを省略するためにドキュメントを作成できます。 選択セット [](https://spec.graphql.org/draft/#sec-Selection-Sets) について詳しくはこちらをご覧ください。

```
query getTodo($id: ID!) {
  getTodo(id: $id) {
    id name
    name
  }
}
```
応答データは次のようになります
```json
{
  "data": {
    "getTodo": {
      "id": "111",
      "name": "my first todo"
    }
  }
}
```
まず、独自の `GraphQLRequest` を作成します。

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/advanced-workflows/20_custom.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/advanced-workflows/20_custom.md"></inline-fragment>

## ネストされたデータ
関係モデルがあれば ネストされたオブジェクトのフィールドを含む選択セットで `GraphQLRequest` を作成することで、ネストされたオブジェクトを取得できます。 例えば、このスキーマでは、Postには複数のコメントとメモを含めることができます。
```graphql
enum PostStatus {
  ACTIVE
  INACTIVE
}
type Post @model {
  id: ID!
  title: String!
  rating: Int!
  status: PostStatus!
  comments: [Comment] @connection(keyName: "byPost", fields: ["id"])
  notes: [Note] @connection(keyName: "byNote", fields: ["id"])
}
type Comment @model
  @key(name: "byPost", fields: ["postID", "content"]) {
  id: ID!
  postID: ID!
  post: Post! @connection(fields: ["postID"])
  content: String!
}
type Note @model
  @key(name: "byNote", fields: ["postID", "content"]) {
  id: ID!
  postID: ID!
  post: Post! @connection(fields: ["postID"])
  content: String!
}
```
メモなしでコメントを取得したいだけの場合。 コメントフィールドのみを含むネストされたフィールドを持つPost用に `GraphQLRequest` を作成します。

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/advanced-workflows/30_nested.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/advanced-workflows/30_nested.md"></inline-fragment>

## 複数操作の結合

1つのリクエストで複数の操作を実行したい場合は、同じドキュメント内にそれらを配置できます。 たとえば、ポストとタスクを取得するには

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/advanced-workflows/40_multiple.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/advanced-workflows/40_multiple.md"></inline-fragment>









DataStore には、モデル間のリレーションシップを扱う機能があります。 例えば *には*が1つあり、 *には多くの*があり、 *は*に属します。 GraphQL では、 [GraphQL Transformer documentation](~/cli/graphql-transformer/connection.md)で定義されている `@connection` および `@key` ディレクティブでこれを行います。

<amplify-callout warning>

When using the `@key` directive with DataStore, as long as you specify a `name` you can use any value(s) in `fields`. However, if the `name` property is omitted, the first item in the `fields` array must be `"id"`. E.g., `@key(fields: ["id", "content"])`.

</amplify-callout>

## 更新されたスキーマ

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/relational/updated-schema.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/relational/updated-schema.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/relational/updated-schema.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/relational/updated-schema.md"></inline-fragment>

## リレーションを保存中

In order to save connected models you will create an instance of the model you wish to connect and pass it's ID to `DataStore.save`:

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/relational/save-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/relational/save-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/relational/save-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/relational/save-snippet.md"></inline-fragment>

## リレーションを照会中

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/relational/query-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/relational/query-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/relational/query-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/relational/query-snippet.md"></inline-fragment>

## 関連の削除

1対多のリレーションで親オブジェクトを削除する場合 子要素もDataStoreから削除され、この削除の変更はネットワーク経由で送信されます。 例えば、次の操作は、ID *123* の投稿と関連するコメントを削除します。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/relational/delete-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/relational/delete-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/relational/delete-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/relational/delete-snippet.md"></inline-fragment>

しかし、多くのリレーションシップでは、子要素は削除されず、明示的に削除する必要があります。

### 多対多で

The above example shows how to use a *one-to-many* schema and save connected models. You can also define *many-to-many* relationships, such as the relationship shown in the [@connection examples](~/cli/graphql-transformer/connection.md#many-to-many-connections).

多対多のリレーションシップの場合 リレーションの各側からモデルのインスタンスを保存し、 `@connection`で定義されたフィールドにタイプを接続して、それらを一緒に結合します。 次のスキーマを考えてみましょう:

```graphql
enum PostStatus {
  ACTIVE
  INACTIVE
}

type Post @model {
  id: ID!
  title: String!
  rating: Int
  status: PostStatus
  editors: [PostEditor] @connection(keyName: "byPost", fields: ["id"])
}

type PostEditor
  @model(queries: null)
  @key(name: "byPost", fields: ["postID", "editorID"])
  @key(name: "byEditor", fields: ["editorID", "postID"]) {
  id: ID!
  postID: ID!
  editorID: ID!
  post: Post! @connection(fields: ["postID"])
  editor: User! @connection(fields: ["editorID"])
}

type User @model {
  id: ID!
  username: String!
  posts: [PostEditor] @connection(keyName: "byEditor", fields: ["id"])
}
```

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/relational/save-many-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/relational/save-many-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/relational/save-many-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/relational/save-many-snippet.md"></inline-fragment>

以下の例では、 [サンプルスキーマ](~/lib/datastore/getting-started.md#sample-schema)に新しいモデルを追加してみましょう。

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
  # New field with @connection
  comments: [Comment] @connection(keyName: "byPost", fields: ["id"])
}

# New model
type Comment @model
  @key(name: "byPost", fields: ["postID", "content"]) {
  id: ID!
  postID: ID!
  post: Post! @connection(fields: ["postID"])
  content: String!
}
```

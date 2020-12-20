以下の例では、 [サンプルスキーマ](~/lib/datastore/getting-started.md#sample-schema)に新しいモデルを追加してみましょう:

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
  comments: [Comment] @connection(name: "PostComments")
}

# New model
type Comment @model {
  id: ID!
  content: String
  post: Post @connection(name: "PostComments")
}
```
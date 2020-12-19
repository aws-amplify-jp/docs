---
title: タイプ間のリレーションシップを追加
description: スキーマ内の他の型とのリレーションシップを定義します。
---

## @connections

The `@connection` directive enables you to specify relationships between `@model` types. Currently, this supports one-to-one, one-to-many, and many-to-one relationships. You may implement many-to-many relationships using two one-to-many connections and a joining `@model` type. See the usage section for details.

[また、リレーショナルデザインに関連する17パターンの完全に機能するスキーマを提供します](~/cli/graphql-transformer/dataaccess.md)。

### 定義

```graphql
@connection(keyName: String, fields: [String!]) on FIELD_DEFINITION
```

### 使用法

型間のリレーションは、 `@model` オブジェクト・タイプのフィールドに `@connection` ディレクティブに注釈を付けることで指定されます。

The `fields` argument can be provided and indicates which fields can be queried by to get connected objects. The `keyName` argument can optionally be used to specify the name of secondary index (an index that was set up using `@key`) that should be queried from the other type in the relationship.

When specifying a `keyName`, the `fields` argument should be provided to indicate which field(s) will be used to get connected objects. If `keyName` is not provided, then `@connection` queries the target table's primary index.

### 持っている

最も単純なケースでは、プロジェクトに 1 つのチームがある接続を定義できます。

```graphql
type Project @model {
  id: ID!
  name: String
  team: Team @connection
}

type Team @model {
  id: ID!
  name: String!
}
```

接続に使用するフィールドを定義するには、最初の引数を fields array に入力し、型のフィールドにマッチさせます。

```graphql
type Project @model {
  id: ID!
  name: String
  teamID: ID!
  team: Team @connection(fields: ["teamID"])
}

type Team @model {
  id: ID!
  name: String!
}
```

In this case, the Project type has a `teamID` field added as an identifier for the team that the project belongs to. `@connection` can then get the connected Team object by querying the Team table with this `teamID`.

変換後、次のようにプロジェクトを作成し、接続されているチームに問い合わせることができます:

```graphql
mutation CreateProject {
    createProject(input: { name: "New Project", teamID: "a-team-id"}) {
        id
        name
        team {
            id
            name
        }
    }
}
```

> **Note** The **Project.team** resolver is configured to work with the defined connection. This is done with a query on the Team table where `teamID` is passed in as an argument.

A Have One @connection can only reference the primary index of a model (すなわち. 以下の Have Manyセクションで説明されているように、"keyName" は指定できません。

### 多数あり

次のスキーマは、多くのコメントを持つことができるポストを定義します。

```graphql
type Post @model {
  id: ID!
  title: String!
  comments: [Comment] @connection(keyName: "byPost", fields: ["id"])
}

type Comment @model
  @key(name: "byPost", fields: ["postID", "content"]) {
  id: ID!
  postID: ID!
  content: String!
}
```

Note how a one-to-many connection needs an `@key` that allows comments to be queried by the postID and the connection uses this key to get all comments whose postID is the id of the post was called on. After it's transformed, you can create comments and query the connected Post as follows:

```graphql
mutation CreatePost {
  createPost(input: { id: "a-post-id", title: "Post Title" } ) {
    id
    title
  }
}

mutation CreateCommentOnPost {
  createComment(input: { id: "a-comment-id", content: "A comment", postID: "a-post-id"}) {
    id
    content
  }
}
```

次のようにコメントを使って投稿をクエリできます。

```graphql
query getPost {
  getPost(id: "a-post-id") {
    id
    title
    comments {
      items {
        id
        content
      }
    }
  }
}
```

### 以下に属する：

すでに1対多の接続を持つタイプに多対1の接続を追加することで、接続を双方向にすることができます。 この場合、各コメントは投稿に属しているため、コメントから投稿への接続を追加します:

```graphql
type Post @model {
  id: ID!
  title: String!
  comments: [Comment] @connection(keyName: "byPost", fields: ["id"])
}

type Comment @model
  @key(name: "byPost", fields: ["postID", "content"]) {
  id: ID!
  postID: ID!
  content: String!
  post: Post @connection(fields: ["postID"])
}
```

変換後、以下のように投稿でコメントを作成できます。

```graphql
mutation CreatePost {
  createPost(input: { id: "a-post-id", title: "Post Title" } ) {
    id
    title
  }
}

mutation CreateCommentOnPost1 {
  createComment(input: { id: "a-comment-id-1", content: "A comment #1", postID: "a-post-id"}) {
    id
    content
  }
}

mutation CreateCommentOnPost2 {
  createComment(input: { id: "a-comment-id-2", content: "A comment #2", postID: "a-post-id"}) {
    id
    content
  }
}
```

そして、そのポストでコメントをクエリし、接続をナビゲートすることで、そのポストのすべてのコメントをクエリできます:

```graphql
query GetCommentWithPostAndComments {
  getComment( id: "a-comment-id-1" ) {
    id
    content
    post {
      id
      title
      comments {
        items {
          id
          content
        }
      }
    }
  }
}
```

### 多数の接続

2つの1-M @connections、@key、@modelを使用して、多くのものを実装できます。例えば:

```graphql
type Post @model {
  id: ID!
  title: String!
  editors: [PostEditor] @connection(keyName: "byPost", fields: ["id"])
}

# Create a join model and disable queries as you don't need them
# and can query through Post.editors and User.posts
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

This case is a bidirectional many-to-many which is why two `@key` calls are needed on the PostEditor model. You can first create a Post and a User, and then add a connection between them with by creating a PostEditor object as follows:

```graphql
mutation CreateData {
    p1: createPost(input: { id: "P1", title: "Post 1" }) {
        id
    }
    p2: createPost(input: { id: "P2", title: "Post 2" }) {
        id
    }
    u1: createUser(input: { id: "U1", username: "user1" }) {
        id
    }
    u2: createUser(input: { id: "U2", username: "user2" }) {
        id
    }
}

mutation CreateLinks {
    p1u1: createPostEditor(input: { id: "P1U1", postID: "P1", editorID: "U1" }) {
        id
    }
    p1u2: createPostEditor(input: { id: "P1U2", postID: "P1", editorID: "U2" }) {
        id
    }
    p2u1: createPostEditor(input: { id: "P2U1", postID: "P2", editorID: "U1" }) {
        id
    }
}
```

UserタイプもPostタイプも接続されているオブジェクトの識別子を持っていないことに注意してください。 接続情報は PostEditor オブジェクト内に完全に保持されます。

特定のユーザーの投稿を照会できます。

```graphql
query GetUserWithPosts {
    getUser(id: U1") {
        id
        username
        posts {
            items {
                post {
                    title
                }
            }
        }
    }
}
```

また、その投稿のエディターで特定の投稿をクエリでき、それらのエディターの投稿を一覧表示できます。 1つの問い合わせですべてを行います

```graphql
query GetPostWithEditorsWithPosts {
    getPost(id: "P1") {
        id
        title
        editors {
            items {
                editor {
                    username
                    posts {
                        items {
                            post {
                                title
                            }
                        }
                    }
                }
            }
        }
    }
}
```

#### 代替定義

The above definition is the recommended way to create relationships between model types in your API. This involves defining index structures using `@key` and connection resolvers using `@connection`. There is an older parameterization of `@connection` that creates indices and connection resolvers that is still functional for backwards compatibility reasons. It is recommended to use `@key` and the new `@connection` via the fields argument.

```
@connection(name: String, keyField: String, sortField: String, limit: Int) の FIELD_DEFINITION
```

このパラメータ化は `@key`と互換性がありません。@key によって作成されたインデックスで `@connection` を使用するには、上記のパラメータ化を参照してください。

### 制限

ネストされたオブジェクトのデフォルト数は 100 です。 **limit** 引数を設定することで、この動作を上書きできます。例えば:

```graphql
type Post @model {
  id: ID!
  title: String!
  comments: [Comment] @connection(limit: 50)
}

type Comment @model {
  id: ID!
  content: String!
}
```

### 生成

In order to keep connection queries fast and efficient, the GraphQL transform manages global secondary indexes (GSIs) on the generated tables on your behalf. In the future you are investigating using adjacency lists along side GSIs for different use cases that are connection heavy.

> **Note** After you have pushed a `@connection` directive you should not try to change it. If you try to change it, the DynamoDB UpdateTable operation will fail. Should you need to change a `@connection`, you should add a new `@connection` that implements the new access pattern, update your application to use the new `@connection`, and then delete the old `@connection` when it's no longer needed.

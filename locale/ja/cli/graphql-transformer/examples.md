---
title: 例
description: サンプルアプリケーションのGraphQLスキーマについては、これらの例を参照してください。
---

## シンプルなタスク

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

## ブログ

```graphql
type Blog @model {
  id: ID!
  name: String!
  posts: [Post] @connection(name: "BlogPosts")
}
type Post @model {
  id: ID!
  title: String!
  blog: Blog @connection(name: "BlogPosts")
  comments: [Comment] @connection(name: "PostComments")
}
type Comment @model {
  id: ID!
  content: String
  post: Post @connection(name: "PostComments")
}
```

### ブログクエリ

```graphql
# Create a blog. Remember the returned id.
# Provide the returned id as the "blogId" variable.
mutation CreateBlog {
  createBlog(input: {
    name: "My New Blog!"
  }) {
    id
    name
  }
}

# Create a post and associate it with the blog via the "postBlogId" input field.
# Provide the returned id as the "postId" variable.
mutation CreatePost($blogId:ID!) {
  createPost(input:{title:"My Post!", postBlogId: $blogId}) {
    id
    title
    blog {
      id
      name
    }
  }
}

# Create a comment and associate it with the post via the "commentPostId" input field.
mutation CreateComment($postId:ID!) {
  createComment(input:{content:"A comment!", commentPostId:$postId}) {
    id
    content
    post {
      id
      title
      blog {
        id
        name
      }
    }
  }
}

# Get a blog, its posts, and its posts comments.
query GetBlog($blogId:ID!) {
  getBlog(id:$blogId) {
    id
    name
    posts(filter: {
      title: {
        eq: "My Post!"
      }
    }) {
      items {
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
}

# List all blogs, their posts, and their posts comments.
query ListBlogs {
  listBlogs { # Try adding: listBlog(filter: { name: { eq: "My New Blog!" } })
    items {
      id
      name
      posts { # or try adding: posts(filter: { title: { eq: "My Post!" } })
        items {
          id
          title
          comments { # and so on ...
            items {
              id
              content
            }
          }
        }
      }
    }
  }
}
```

## タスクアプリ
**注: @auth ディレクティブを使用するには、Amazon Cognito ユーザプールを使用するように API を設定する必要があります。**

```graphql
type Task
  @model
  @auth(rules: [
      {allow: groups, groups: ["Managers"], mutations: [create, update, delete], queries: null},
      {allow: groups, groups: ["Employees"], mutations: null, queries: [get, list]}
    ])
{
  id: ID!
  title: String!
  description: String
  status: String
}
type PrivateNote
  @model
  @auth(rules: [{allow: owner}])
{
  id: ID!
  content: String!
}
```

### タスククエリ

```graphql
# Create a task. Only allowed if a manager.
mutation CreateTask {
  createTask(input:{
    title:"A task",
    description:"A task description",
    status: "pending"
  }) {
    id
    title
    description
  }
}

# Get a task. Allowed if an employee.
query GetTask($taskId:ID!) {
  getTask(id:$taskId) {
    id
    title
    description
  }
}

# Automatically inject the username as owner attribute.
mutation CreatePrivateNote {
  createPrivateNote(input:{content:"A private note of user 1"}) {
    id
    content
  }
}

# Unauthorized error if not owner.
query GetPrivateNote($privateNoteId:ID!) {
  getPrivateNote(id:$privateNoteId) {
    id
    content
  }
}

# Return only my own private notes.
query ListPrivateNote {
  listPrivateNote {
    items {
      id
      content
    }
  }
}
```

## 競合検出

```graphql
type Note @model @versioned {
  id: ID!
  content: String!
  version: Int! # You can leave this out. Validation fails if this is not a int like type (Int/BigInt) and is always coerced to non-null.
}
```

### 競合検出クエリ

```graphql
mutation Create {
  createNote(input:{
    content:"A note"
  }) {
    id
    content
    version
  }
}

mutation Update($noteId: ID!) {
  updateNote(input:{
    id: $noteId,
    content:"A second version",
    expectedVersion: 1
  }) {
    id
    content
    version
  }
}

mutation Delete($noteId: ID!) {
  deleteNote(input:{
    id: $noteId,
    expectedVersion: 2
  }) {
    id
    content
    version
  }
}
```
## APIカテゴリの一般的なパターン

The Amplify CLI exposes the GraphQL Transform libraries to help create APIs with common patterns and best practices baked in but it also provides number of escape hatches for those situations where you might need a bit more control. Here are a few common use cases you might find useful.

### モデルフィールドおよび/またはリレーションによるサブスクリプションのフィルタリング

マルチテナントのシナリオでは、サブスクライブしているクライアントがモデルタイプのすべての変更を受け取りたいとは限りません。 これらは、クライアントサブスクリプションによって返されるオブジェクトを制限するための便利な機能です。 サブスクリプションは、変異クエリから返されるフィールドでのみフィルタリングできることを覚えておくことが重要です。 これらの2つの方法を一緒に使用して、本当に堅牢なフィルタリングオプションを作成することができます。

例として、この単純なスキーマを考えてみましょう。

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
  comments: [Comment] @connection(name: "TodoComments")
}
type Comment @model {
  id: ID!
  content: String
  todo: Todo @connection(name: "TodoComments")
}
```

**型フィールドによるフィルタリング**

これは、リレーションをフィルタリングするよりもモデルへの1つの変更を必要とするため、サブスクリプションをフィルタリングする簡単な方法です。

1. subscriptions 引数を *@model* ディレクティブに追加し、Ampliify に *not* generate for your comment type.

```graphql
type Comment @model(subscription: null) {
  id: ID!
  content: String
  todo: Todo @connection(name: "TodoComments")
}
```

2. サブスクリプションタイプを追加した後に実行するとエラーが発生するため、この時点で `を増幅して` を実行します。 スキーマに2つのサブスクリプション定義を持つことはできないと主張しています。

3. プッシュ後、サブスクリプションタイプをスキーマに追加する必要があります。 フィルタリングに使用したいスカラーコメントフィールドを含む(この場合のコンテンツ):

```graphql
type Subscription {
  onCreateComment(content: String): Comment @aws_subscribe(mutations: ["createComment"])
  onUpdateComment(id: ID, content: String): Comment @aws_subscribe(mutations: ["updateComment"])
  onDeleteComment(id: ID, content: String): Comment @aws_subscribe(mutations: ["deleteComment"])
}
```

**関連タイプ (*@connection* 設計済み) によるフィルタリング**

コメントが接続されている Todo オブジェクトでフィルタリングする必要がある場合に便利です。 これを有効にするには、スキーマを若干拡張する必要があります。

1. Add the subscriptions argument on the *@model* directive, telling Amplify to *not* generate subscriptions for your Comment type. Also, just as importantly, we will be utilizing an auto-generated column from DynamoDB by adding `commentTodoId` to our Comment model:

```graphql
type Comment @model(subscriptions: null) {
  id: ID!
  content: String
  todo: Todo @connection(name: "TodoComments")
  commentTodoId: String # This references the commentTodoId field in DynamoDB
}
```
2. サブスクリプションタイプを追加するとエラーが発生しますので、この時点で `増幅プッシュ` を実行する必要があります。 スキーマに2つのサブスクリプション定義を持つことはできないと主張しています。

3. プッシュ後、 `commentTodoId` をオプション引数として含めて、サブスクリプション型をスキーマに追加する必要があります。

```graphql
type Subscription {
  onCreateComment(commentTodoId: String): Comment @aws_subscribe(mutations: "createComment")
  onUpdateComment(id: ID, commentTodoId: String): Comment @aws_subscribe(mutations: "updateComment")
  onDeleteComment(id: ID, commentTodoId: String): Comment @aws_subscribe(mutations: "deleteComment")
}
```

The next time you run `amplify push` or `amplify api gql-compile`, your subscriptions will allow an `id` and/or `commentTodoId` argument on a Comment subscription. As long as your mutation on the Comment type returns the specified argument field from its query, AppSync filters which subscription events will be pushed to your subscribed client.

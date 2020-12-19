---
title: 概要
description: Amplify CLI と GraphQL 変換を使用します。 GraphQL スキーマ定義言語(SDL)を使用してアプリケーションのデータモデルを定義し、ライブラリによりSDLスキーマがデータモデルを実装する完全に記述的なAWS CloudFormationテンプレートのセットに変換されます。
---

GraphQL Transformは、AWS上のWebおよびモバイルアプリケーションのバックエンドを迅速に作成するための簡単な抽象化を提供します。 GraphQL変換で GraphQL スキーマ定義言語(SDL)を使用してアプリケーションのデータモデルを定義し、ライブラリはSDL定義をデータモデルを実装する完全に記述的なAWS CloudFormationテンプレートのセットに変換します。

たとえば、以下のようなブログのバックエンドを作成できます。

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

The GraphQL Transform simplifies the process of developing, deploying, and maintaining GraphQL APIs. With it, you define your API using the [GraphQL Schema Definition Language (SDL)](https://facebook.github.io/graphql/June2018/) and can then use automation to transform it into a fully descriptive cloudformation template that implements the spec. The transform also provides a framework through which you can define your own transformers as `@directives` for custom workflows.

## GraphQL API の作成

JavaScript、iOS、またはAndroidプロジェクトのルートに移動し、以下を実行します。

```bash
initを増幅する
```

ウィザードに従って新しいアプリを作成します。ウィザードを終了したら、次を実行します。

```bash
増幅して api を追加
```

次のオプションを選択します。

- GraphQLを選択
- スキーマがあるかどうか尋ねられたら、「いいえ」と言います。
- デフォルトのサンプルのいずれかを選択します。後で変更できます。
- スキーマを編集することを選択すると、新しい `schema.graphql` が エディタで開きます

サンプルはそのままにしておくことも、このスキーマを試すこともできます。

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

Once you are happy with your schema, save the file and hit enter in your terminal window. if no error messages are thrown this means the transformation was successful and you can deploy your new API.

```bash
push を増幅する
```

## API をテスト

APIのデプロイが完了したら、 AWS AppSync コンソールにアクセスするか、 `amplify mock api` を実行して、新しい API のクエリページでこれらのクエリのいくつかを試してみてください。

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

# Provide the returned id from the CreateBlog mutation as the "blogId" variable
# in the "variables" pane (bottom left pane) of the query editor:
{
  "blogId": "returned-id-goes-here"
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

# Provide the returned id from the CreatePost mutation as the "postId" variable
# in the "variables" pane (bottom left pane) of the query editor:
{
  "postId": "returned-id-goes-here"
}

# Get a blog, its posts, and its posts' comments.
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

# List all blogs, their posts, and their posts' comments.
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
## スキーマの更新

If you want to update your API, open your project's `backend/api/~apiname~/schema.graphql` file (NOT the one in the `backend/api/~apiname~/build` folder) and edit it in your favorite code editor. You can compile the `backend/api/~apiname~/schema.graphql` by running:

```bash
api gqlコンパイルを増幅する
```

そして、コンパイルされたスキーマの出力を `backend/api/~apiname~/build/schema.graphql` で確認します。

その後、以下の変更をプッシュできます。

```bash
push を増幅する
```

## API カテゴリ プロジェクトの構造

At a high level, the transform libraries take a schema defined in the GraphQL Schema Definition Language (SDL) and converts it into a set of AWS CloudFormation templates and other assets that are deployed as part of `amplify push`. The full set of assets uploaded can be found at *amplify/backend/api/YOUR-API-NAME/build*.

When creating APIs, you will make changes to the other files and directories in the *amplify/backend/api/YOUR-API-NAME/* directory but you should not manually change anything in the *build* directory. The build directory will be overwritten the next time you run `amplify push` or `amplify api gql-compile`. Here is an overview of the API directory:

```console
-build/
- resolvers/
| # Store any resolver templates written in vtl here. E.G.
|-- Query.ping.req.vtl
|-- Query.ping.res.vtl
|
- stacks/
| # Create custom resources with CloudFormation stacks that will be deployed as part of `amplify push`.
|-- CustomResources.json
|
- parameters.json
| # Tweak certain behaviors with custom CloudFormation parameters.
|
- schema.graphql
| # Write your GraphQL schema in SDL
- schema/
| # Optionally break up your schema into many files. You must remove schema.graphql to use this.
|-- Query.graphql
|-- Post.graphql
- transform.conf.json
```

---
title: IDでGraphQLサブスクリプションを作成する方法
description: IDでリッスンするカスタムGraphQLサブスクリプションを作成する方法
---

このガイドでは、特定のIDを引数として含む変異によってのみ接続され、トリガーされるカスタムGraphQLサブスクリプションを作成する方法を学びます。

AmplifyGraphQL変換ライブラリを使用する場合 GraphQL スキーマを展開し、 `@model` ディレクティブで作成された操作を展開する必要がある場合がよくあります。 GraphQL サブスクリプションでは、細かいグレイン制御が必要な場合が一般的な使用例です。

以下のGraphQLスキーマを例に挙げます:

```graphql
type Post @model {
  id: ID!
  title: String!
  content: String
  comments: [Comment] @connection
}

type Comment @model {
  id: ID!
  content: String
}
```

デフォルトでは、以下の変更に対してサブスクリプションが作成されます。

```graphql
# Post type
onCreatePost
onUpdatePost
onDeletePost

# Comment type
onCreateComment
onUpdateComment
onDeleteComment
```

該当しない操作の1つは、特定の投稿のコメントのみを購読したい場合です。

なぜなら、スキーマは投稿とコメントの間に1対多のリレーションシップを持っているからです。 自動生成された項目 `postCommentsId` を使用して、投稿とコメントの関係を定義し、新しいサブスクリプション定義でこれを設定できます。

これを実装するには、次のようにスキーマを更新します。

```graphql
type Post @model {
  id: ID!
  title: String!
  content: String
  comments: [Comment] @connection
}

type Comment @model {
  id: ID!
  content: String
  postCommentsId: ID!
}

type Subscription {
  onCommentByPostId(postCommentsId: ID!): Comment
    @aws_subscribe(mutations: ["createComment"])
}

```

<inline-fragment platform="ios" src="~/guides/api-graphql/fragments/ios/subscriptions-by-id.md"></inline-fragment> <inline-fragment platform="js" src="~/guides/api-graphql/fragments/js/subscriptions-by-id.md"></inline-fragment> <inline-fragment platform="android" src="~/guides/api-graphql/fragments/android/subscriptions-by-id.md"></inline-fragment>
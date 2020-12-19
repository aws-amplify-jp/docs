---
title: LambdaのGraphQLサーバー
description: Lambda関数でApollo GraphQLサーバーを実行する方法
---

このガイドでは、Lambda関数でGraphQLサーバを実行する方法を学びます。 この例では、 [Apollo Server](https://www.apollographql.com/docs/) と [Apollo Server Lambda](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-lambda)を使用します。 でも好きなサーバーの実装を使うことができます

The end goal is to have an API endpoint, like `https://your-api-endpoint.com/graphql`, deployed and integrated with a GraphQL server running in a serverless function.

### Amplifyプロジェクトの作成

始めるには、新しいAmplifyプロジェクトを作成します。

<amplify-callout>

Amplifyプロジェクトがすでに作成されている場合は、次のステップにジャンプできます - GraphQL APIと関数の作成

</amplify-callout>

```sh
amplify init

# 環境名とデフォルトのテキストエディタを選択します。
# 残りの質問に対してデフォルトに答え、増幅を実行したときに作成したプロファイルを選択できます。
```

### GraphQL API と関数の作成

次に、APIとLambda関数を作成します。 `api` カテゴリの使用 CLIはサーバーレス機能と、GraphQLサーバーに使用できるhttpエンドポイントを作成します。

```sh
$ amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: apolloapi
? Provide a path (e.g., /items): /graphql
? Choose a Lambda source: Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: apolloserver
? Provide the AWS Lambda function name: apolloserver
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? N
? Do you want to edit the local lambda function now? N
? Restrict API access: N
? Do you want to add another path? N
```

#### 依存関係のインストール

Lambda関数のフォルダに変更し、以下の依存関係をインストールします。

```sh
cd anplify/backend/function/apolloserver/src
npm install apollo-server-lambda graphql
cd ../../../../../../
```

### 関数コード

関数のコードを開いてみましょう。

__anplify/backend/function/apolloserver/src/index.js__を開きます。ここでは、メイン関数ハンドラが表示されます。次のコードを使用して関数を更新します。

```javascript
const { ApolloServer, gql } = require('apollo-server-lambda');

/* Construct a schema, using GraphQL schema language */
const typeDefs = gql`
  type Query { hello: String }
`

/* Provide resolver functions for your schema fields */
const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo!!',
  },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
  })

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
})
```

これで、関数と GraphQL API をデプロイできます。

```sh
push を増幅する
```

これでAPIがデプロイされ、対話を開始できるようになります。

### API URL

サーバーが起動して実行されると、url は aws-exports.js ファイルで使用できます。最終的な GraphQL エンドポイントは次のようになります。

```
https://6dbg37jfw5.execute-api.us-east-1.amazonaws.com/<env-name>/graphql
```

ブラウザでGraphQLエンドポイント `/graphql` に移動することで、GraphQLのプレイグラウンドを使用することもできます。
---
title: エクスプレスサーバー
description: AWS Amplifyを使用してExpressサーバーをAWSにデプロイする方法
---

このガイドでは、 [Express](https://expressjs.com/) のWebサーバーをルーティングで完全にデプロイする方法を学びます。

### Amplifyプロジェクトの初期化

新しいAmplifyプロジェクトを初期化:

```sh
amplify init

# Follow the steps to give the project a name, environment name, and set the default text editor.
# Accept defaults for everything else and choose your AWS Profile.
```

### API と関数の作成

次に、APIとWebサーバーを作成します。そのためには、Amplify `add` コマンドを使用します。

```sh
amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: myapi
? Provide a path (e.g., /items): /items (or whatever path you would like)
? Choose a Lambda source: Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: mylambda
? Provide the AWS Lambda function name: mylambda
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Serverless express function
? Do you want to access other resources created in this project from your Lambda function? N
? Do you want to invoke this function on a recurring schedule? N
? Do you want to edit the local lambda function now? N
? Restrict API access: N
? Do you want to add another path? N
```

CLIはあなたのためにいくつかのものを作成しました。

- API endpoint
- Lambda 関数
- 関数で [Serverless Express](https://github.com/awslabs/aws-serverless-express) を使用する Web サーバー
- `/items` route (ルート)上のさまざまなメソッドのためのいくつかのボイラープレートコード

### 関数コードの更新

サーバーのコードを開きましょう。

__amplify/backend/function/mylambda/src/index.js__ を開きます。

In this file you will see the main function handler with the `event` and `context` being proxied to an express server located at `./app.js` (do not make any changes to this file):

```js
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports. andler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}');
  awsServerlessExpress.proxy(server, event, context);
};

```

次に、 __amplify/backend/function/mylambda/src/app.js__ を開きます。

ここでは、エクスプレスサーバーのコードと、宣言したルートのさまざまなHTTPメソッドのボイラープレートが表示されます。

`app.get('/items')` のルートを見つけ、以下に更新します。

```js
// amplify/backend/function/mylambda/src/app.js
app.get('/items', function(req, res) {
  const items = ['hello', 'world']
  res.json({ success: 'get call succeed!', items });
});
```

### サービスをデプロイ中

API と関数をデプロイするには、 `push` コマンドを実行します。

```sh
push を増幅する
```

<inline-fragment platform="js" src="~/guides/api-rest/fragments/js/express-api-call.md"></inline-fragment> <inline-fragment platform="ios" src="~/guides/api-rest/fragments/ios/express-api-call.md"></inline-fragment> <inline-fragment platform="android" src="~/guides/api-rest/fragments/android/express-api-call.md"></inline-fragment>

ここから、追加のパスを追加することができます。そのためには、updateコマンドを実行します。

```sh
増幅アップデートAPI
```

そこから、パスを追加、更新、または削除できます。 Amplify を使用した REST API の操作の詳細については、こちら [](~/lib//restapi/getting-started.md) を参照してください。

API エンドポイントは `aws-exports.js` フォルダにあります。

この URL と指定されたパスを使用して API と直接やり取りすることもできます。

```sh
curl https://<api-id>.execute-api.<api-region>.amazonaws.com/<your-env-name>/items
```

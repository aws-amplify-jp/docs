---
title: NodeJS API
description: Amplify 関数を使用して NodeJS API をデプロイする方法
---

このガイドでは、Node.js API のデプロイ方法を学びます。

## 1. 新しいAmplifyプロジェクトを初期化する

```sh
amplify init

# Follow the steps to give the project a name, environment name, and set the default text editor.
# Accept defaults for everything else and choose your AWS Profile.
```

## 2. API と関数を追加

```sh
amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: nodeapi
? Provide a path (e.g., /book/{isbn}): /hello
? Choose a Lambda source: Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: greetingfunction
? Provide the AWS Lambda function name: greetingfunction
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? N
? Do you want to invoke this function on a recurring schedule? N
? Do you want to edit the local lambda function now? N
? Restrict API access: N
? Do you want to add another path? N
```

CLIは、 **amplify/backend/function/greetingfunction**に新しい関数を作成する必要があります。

## 3. 関数コードの更新

次に、  **amplify/backend/function/greetingfunction/src/index.js** を開き、次のコードに更新します。

```js
exports.handler = async (event) => {
  const body = {
      message: "Hello from Lambda"
  }
  const response = {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
          "Access-Control-Allow-Origin": "*",
      }
  };
  return response;
};
```

## 4. API をデプロイ

API をデプロイするには、 `push` コマンドを実行します。

```sh
push を増幅する
```

## 5. API の使用

GETリクエストをAPIに送信する方法は次のとおりです。

<inline-fragment platform="js" src="~/guides/api-rest/fragments/js/rest-api-call.md"></inline-fragment> <inline-fragment platform="ios" src="~/guides/api-rest/fragments/ios/rest-api-call.md"></inline-fragment> <inline-fragment platform="android" src="~/guides/api-rest/fragments/android/rest-api-call.md"></inline-fragment>

Amplify を使用した REST API の操作の詳細については、こちら [](~/lib//restapi/getting-started.md) を参照してください。

API エンドポイントは `aws-exports.js` フォルダにあります。

この URL と指定されたパスを使用して API と直接やり取りすることもできます。

```sh
curl https://<api-id>.execute-api.<api-region>.amazonaws.com/<your-env-name>/hello
```

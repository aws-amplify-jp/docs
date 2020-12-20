---
title: 簡単に再利用できるように、AppSync操作をLambdaレイヤーにエクスポートする
description: Lambda関数で簡単に再利用できるように、AppSync操作をLambdaレイヤーにエクスポートする方法
---

Lambda 関数から AppSync API を呼び出す必要がある場合は、Amplify によって生成された AppSync 操作を Lambda レイヤーにエクスポートできます。 これにより、重複したコードの量が削減され、複数のプロジェクトで Lambda 関数から API を操作できます。

## レイヤーを設定

まず、AppSync操作を含むレイヤーを作成します。

```sh
$ amplify add function

? Select which capability you want to add:
❯ Lambda layer (shared code & resource used across functions)

? Provide a name for your Lambda layer: appsyncOperations

? Select up to 2 compatible runtimes:
❯ NodeJS

✅ Lambda layer folders & files created:
amplify/backend/function/appsyncOperations
```

In the `./amplify/backend/function/appsyncOperations/opt` folder add the following helper library. The library exports a `request` function that you can use to send queries or mutations to your AppSync API. You can specify an API KEY to include the `x-api-key` header in the request. Otherwise the request is signed using SigV4 and the invoked Lambda function's credentials.

```javascript
// amplify/backend/function/appsyncOperations/opt/appSyncRequest.js
const https = require('https')
const AWS = require('aws-sdk')
const urlParse = require('url').URL
const region = process.env.REGION

/**
 *
 * @param {Object} queryDetails the query, operationName, and variables
 * @param {String} appsyncUrl url of your AppSync API
 * @param {String} apiKey the api key to include in headers. if null, will sign with SigV4
 */
exports.request = (queryDetails, appsyncUrl, apiKey) => {
  const req = new AWS.HttpRequest(appsyncUrl, region)
  const endpoint = new urlParse(appsyncUrl).hostname.toString()

  req.method = 'POST'
  req.path = '/graphql'
  req.headers.host = endpoint
  req.headers['Content-Type'] = 'application/json'
  req.body = JSON.stringify(queryDetails)

  if (apiKey) {
    req.headers['x-api-key'] = apiKey
  } else {
    const signer = new AWS.Signers.V4(req, 'appsync', true)
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())
  }

  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      })
    })

    httpRequest.write(req.body)
    httpRequest.end()
  })
}
```

## レイヤーと互換性のあるコードを生成する

Amplify codegen によって生成された GraphQL javascript ファイルを移調するために Babel の依存関係をインストールします。

```sh
npm i --save-dev @babel/core @babel/cli @babel/preset-env
```

コンパイル対象を指定する Babel の設定ファイルを追加します。この設定では、NodeJS 12 のみが対象となります。 `./babel.config.json`:

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "12"
        }
      }
    ]
  ]
}
```

`package.json` 内の `スクリプト` にコマンドを追加し、レイヤーを最新のコードで更新します。

```json
{
  "scripts": {
    "updateAppsyncOperations": "amplify codegen && babel src/graphql --config-file -./babel.config.json -d ./amplify/backend/function/appsyncOperations/opt/graphql/"
  }
}
```

このコマンドは、スキーマを変更してコードジェネレーションとレイヤーを更新した後に実行できます。

```sh
npm run updateAppsyncOperations
```

レイヤー内の `opt` ディレクトリは以下のようになります。

```sh
amplify/backend/function/appsyncOperations/opt
├── appsyncRequest.js
└── graphql
    ├── mutations.js
    ├── queries.js
    ├── subscriptions.js
```

`増幅プッシュ`を使えば、変更をクラウドにプッシュできます。

Lambda関数にレイヤーを割り当てて、AppSync APIを簡単に呼び出せるようになりました。 AppSync API を呼び出すための IAM パーミッションを持つ Lambda 関数でこれを活用する方法は次のとおりです。

```javascript
const appsyncUrl = process.env.API_AMPLIFYLAYERGUIDE_GRAPHQLAPIENDPOINTOUTPUT
const apiKey = process.env.API_AMPLIFYLAYERGUIDE_GRAPHQLAPIKEYOUTPUT

const { request } = require('/opt/appsyncRequest')
const { createTodo } = require('/opt/graphql/mutations')
const { listTodos } = require('/opt/graphql/queries')

exports.handler = async (event) => {
  try {
    // create a TODO with AWS_IAM auth
    var result = await request(
      {
        query: createTodo,
        variables: {
          input: {
            name: 'new todo',
            description: 'the first',
          },
        },
      },
      appsyncUrl
    )
    console.log('iam results:', result)

    // Now, retrieve all TODOs using API_KEY auth
    result = await request(
      {
        query: listTodos,
        operationName: 'ListTodos',
      },
      appsyncUrl,
      apiKey
    )
    console.log('api key results', result)
  } catch (error) {
    console.log(error)
  }
}
```

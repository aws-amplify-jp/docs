---
title: テスト
description: REST API のテスト
---

## 端末からAPIをテストする

ゲストユーザーがREST APIにアクセスできる場合は、Curlを使用して端末からテストできます。

[Curl](https://github.com/curl/curl) は、さまざまなプロトコルを使用してサーバーとの間でデータを転送できるコマンドラインツールです。

> Curlは、Mac、Windows、Linuxなど、多くのディストリビューションで利用できます。 [ドキュメント](https://curl.haxx.se/docs/install.html)のインストール手順に従ってください。

<amplify-block-switcher> <amplify-block name="Mac and Linux">

### GET メソッドの例

```console
curl https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev/todos
```

### POST メソッドの例

```console
curl -H "Content-Type: application/json" -d '{"name":"todo-1"}' https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev/todos
```

</amplify-block> <amplify-block name="Windows">

### GET メソッドの例

```console
curl https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev/todos
```

### POST メソッドの例

```console
curl -H "Content-Type: application/json" -d {\"name\":\"todo-1\"} https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev/todos
```

</amplify-block> </amplify-block-switcher>

> 重要! プロダクションエンドポイントを使用してメソッドをテストすると、元に戻すことができないリソースが変更される可能性があります。

## AmplifyモックでAPIをテストする

Amplify CLI は、 `amplify mock 関数` コマンドを使用して REST API をすばやくテストできます。

Let's test your new REST API using the route below with HTTP Method `GET` and path `/todos?limit=10` which includes a `limit` query string parameter.

```console
 GET /todos?limit=10
```

> 重要! プロダクションエンドポイントを使用してメソッドをテストすると、元に戻すことができないリソースが変更される可能性があります。

続ける前に、ファイルを `{project}/amplify/backend/function/todosLambda/src/event.json` に編集し、テストの目的でその内容を置き換えます。

```json
{
  "httpMethod": "GET",
  "path": "/todos",
  "queryStringParameters": {
    "limit": "10"
  }
}
```

変更を保存して実行したことを確認してください

```bash
amplifyモック関数 todosLambda
```

次のオプションを選択します。

- `{project}/amplify/backend/function/todosLambda` __src/event.json__ への相対的なイベントJSONオブジェクトへのパスを提供します

```console
Starting execution...
EVENT: {"httpMethod":"GET","path":"/todos","queryStringParameters":{"limit":"10"}}
App started

Result:
{"statusCode":200,"body":"{\"success\":\"get call succeed!\",\"url\":\"/todos?limit=10\"}","headers":{"x-powered-by":"Express","access-control-allow-origin":"*","access-control-allow-headers":"Origin, X-Requested-With, Content-Type, Accept","content-type":"application/json; charset=utf-8","content-length":"55", "date":"Tue, 18 Aug 2020 16:50:53 GMT","connection":"close"},"isBase64Encoded":false}
Finished execution.
```

## APIゲートウェイコンソールでAPIをテストする

Let's test your new REST API using the route below with HTTP Method `GET` and path `/todos?limit=10` which includes a `limit` query string parameter.

```console
 GET /todos?limit=10
```

> 重要! API Gateway コンソールでメソッドをテストすると、元に戻すことができないリソースが変更される可能性があります。

- https://console.aws.amazon.com/apigatewayでAPIゲートウェイコンソールにサインインします。
- `todosApi` REST API を選択します。
- `ペインで、テストする方法を選択します。` `/todos`の下にあるformat@@4任意のformat@@5を選択します。

```
/                        
 |_ /todos               Main resource. Eg: /todos
   ANY                   Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
   OPTIONS               Allow pre-flight requests in CORS by browser
    |_ /{proxy+}         Proxy resource. Eg: /todos/, /todos/id, todos/object/{id}
    ANY                  Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
    OPTIONS              Allow pre-flight requests in CORS by browser
```

- In the Method Execution pane, in the Client box, choose TEST. Choose the `GET` method. Add `limit=10` to the Query String `{todos}` field.

- `GET /todos?limit=10`のテストを実行するには、テストを選択します。 以下の情報が表示されます: リクエスト、ステータス、レイテンシー、レスポンスボディ、レスポンスヘッダー、ログ。

```bash
Request: /todos?limit=10
Status: 200
Latency: 139 ms
Response Body
{
  "success": "get call succeed!",
  "url": "/todos?limit=10"
}
Response Headers
{"access-control-allow-origin":"*","date":"Tue, 18 Aug 2020 17:36:14 GMT","content-length":"55","access-control-allow-headers":"Origin, X-Requested-With, Content-Type, Accept","x-powered-by":"Express","content-type":"application/json; charset=utf-8","connection":"close"}
Logs
Execution log for request 4fc3c0c7-6f9f-4ac3-84d7-205500f39b5f
Tue Aug 18 17:36:14 UTC 2020 : Starting execution for request: 4fc3c0c7-6f9f-4ac3-84d7-205500f39b5f
Tue Aug 18 17:36:14 UTC 2020 : HTTP Method: GET, Resource Path: /todos
Tue Aug 18 17:36:14 UTC 2020 : Method request path: {}
Tue Aug 18 17:36:14 UTC 2020 : Method request query string: {limit=10}
Tue Aug 18 17:36:14 UTC 2020 : Method request headers: {}
Tue Aug 18 17:36:14 UTC 2020 : Method request body before transformations: 
Tue Aug 18 17:36:14 UTC 2020 : Endpoint request URI: https://lambda.eu-west-2.amazonaws.com/2015-03-31/functions/arn:aws:lambda:eu-west-2:664371068953:function:expressLambda-dev/invocations
Tue Aug 18 17:36:14 UTC 2020 : Endpoint request headers: { X-Amz-Date=20200818T173614Z, X-Amz-Source-Arn=arn:aws:execute-api:eu-west-2:664371068953:s3zmw6fqy5/test-invoke-stage/GET/todos, Accept=application/json, User-Agent=AmazonAPIGateway_s3zmw6fqy5, X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDEaCWV1LXdlc3QtMiJGMEQCIC3KIeR66WhaCBw+eJ+GPhF7y4hz9xC2nN+ARb7T3psyAiBdsoaD9yMfiw2dHWjQM5x7vM11XmToNSGu64mckUQdzSq0AwgaEAEaDDU0NDM4ODgxNjY2MyIMIzObNbCd6QtYwb0IKpEDpHXEzkM2OYq7JfL0U/WbF09KNamodfnifRYwZd/GNOwykykc/zHiU9X0XZPRd+QTnQe/9eoy8DaxBkDgRzQQjTThQWJWadtcfjryTLRKpVeo1UueL+f6DTUDf+URjb0P9CN1gPm+ntZD3LSyAXGwACKG7YMA5/HyeEk [TRUNCATED]
Tue Aug 18 17:36:14 UTC 2020 : Endpoint request body after transformations: {"resource":"/todos","path":"/todos","httpMethod":"GET","headers":null,"multiValueHeaders":null,"queryStringParameters":{"limit":"10"},"multiValueQueryStringParameters":{"limit":["10"]},"pathParameters":null,"stageVariables":null,"requestContext":{"resourcePath":"/todos","httpMethod":"GET","requestTime":"18/Aug/2020:17:36:14 +0000","path":"/todos","accountId":"EXAMPLE_ID","protocol":"HTTP/1.1","stage":"test-invoke-stage","domainPrefix":"testPrefix","requestTimeEpoch":1597772174890,"requestId":"4fc3c0c7-6f9f-4ac3-84d7-205500f39b5f","identity":{"cognitoIdentityPoolId":null,"cognitoIdentityId":null,"apiKey":"test-invoke-api-key","principalOrgId":null,"cognitoAuthenticationType":null,"userArn":"arn:aws:iam::664371068953:root","apiKeyId":"test-invoke-api-key-id","userAgent":"aws-internal/3 aws-sdk-java/1.11.820 Linux/4.9.217-0.1.ac.205.84.332.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.252-b09 java/1.8.0_252 v [TRUNCATED]
Tue Aug 18 17:36:14 UTC 2020 : Sending request to https://lambda.eu-west-2.amazonaws.com/2015-03-31/functions/arn:aws:lambda:eu-west-2:664371068953:function:expressLambda-dev/invocations
Tue Aug 18 17:36:15 UTC 2020 : Received response. Status: 200, Integration latency: 137 ms
Tue Aug 18 17:36:15 UTC 2020 : Endpoint response headers: {Date=Tue, 18 Aug 2020 17:36:15 GMT, Content-Type=application/json, Content-Length=443, Connection=keep-alive, sampled=0}
Tue Aug 18 17:36:15 UTC 2020 : Endpoint response body before transformations: {"statusCode":200,"body":"{\"success\":\"get call succeed!\",\"url\":\"/todos?limit=10\"}","headers":{"x-powered-by":"Express","access-control-allow-origin":"*","access-control-allow-headers":"Origin, X-Requested-With, Content-Type, Accept","content-type":"application/json; charset=utf-8","content-length":"55","date":"Tue, 18 Aug 2020 17:36:14 GMT","connection":"close"},"isBase64Encoded":false}
Tue Aug 18 17:36:15 UTC 2020 : Method response body after transformations: {"success":"get call succeed!","url":"/todos?limit=10"}
Tue Aug 18 17:36:15 UTC 2020 : Method response headers: {x-powered-by=Express, access-control-allow-origin=*, access-control-allow-headers=Origin, X-Requested-With, Content-Type, Accept, content-type=application/json; charset=utf-8, content-length=55, date=Tue, 18 Aug 2020 17:36:14 GMT, connection=close, Sampled=0}
Tue Aug 18 17:36:15 UTC 2020 : Successfully completed execution
Tue Aug 18 17:36:15 UTC 2020 : Method completed with status: 200
```
To invoke an endpoint, you need to set `apiName`, `path` and `headers` parameters, and each method returns a Promise. Under the hood the API category utilizes [Axios](https://github.com/axios/axios) to execute the HTTP requests. API status code response > 299 are thrown as an exception. If you need to handle errors managed by your API, work with the `error.response` object.

## GET リクエスト

```javascript
const apiName = 'MyApiName';
const path = '/path'; 
const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {  // OPTIONAL
        name: 'param',
    },
};

API
  .get(apiName, path, myInit)
  .then(response => {
    // Add your code here
  })
  .catch(error => {
    console.log(error.response);
 });
```

async/await の例

```javascript
function getData() { 
  const apiName = 'MyApiName';
  const path = '/path';
  const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
  };

  return API.get(apiName, path, myInit);
}

(async function () {
  const response = await getData();
})();
```

## クエリパラメータ付きのリクエストを取得

`get` メソッドでクエリパラメータを使用するには、メソッド呼び出しの `queryStringParameters` パラメータにそれらを渡すことができます。

```javascript
const items = await API.get('myCloudApi', '/items', {
  'queryStringParameters': {
    'order': 'byPrice'
  }
});
```

## 頭

```javascript
const apiName = 'MyApiName'; // replace this with your api name.
const path = '/path'; //replace this with the path you have configured on your API
const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
};

API
 .head(apiName, path, myInit)
 .then(response => {
    // Add your code here
 });
```

async/awaitの例:

```javascript
function head() { 
  const apiName = 'MyApiName';
  const path = '/path';
  const myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
  };

  return API.head(apiName, path, myInit);
}

(async function () {
  const response = await head();
})();
```

## Lambdaプロキシ関数でクエリパラメータ & 本体にアクセス中

> Lambda Proxy Integrationの詳細については、 [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html) をご覧ください。

If you are using a REST API which is generated with Amplify CLI, your backend is created with Lambda Proxy Integration, and you can access your query parameters & body within your Lambda function via the *event* object:

```javascript
exports.handler = function(event, context, callback) {
    console.log(event.queryStringParameters);
    console.log('body: ', event.body);
}
```

あるいは、 `amplify/backend/function/[your-lambda-function]/app.js` にあるバックエンドファイルをミドルウェアで更新することもできます。

```javascript
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
app.use(awsServerlessExpressMiddleware.eventContext());
```

Serverless Express でクエリーパラメーターにアクセスする

リクエストハンドラで `req.apiGateway.event` または `req.query` を使用してください:

```javascript
app.get('/items', function(req, res) {
  const query = req.query;
  // or
  // const query = req.apiGateway.event.queryStringParameters
  res.json({
    event: req.apiGateway.event, // to view all event data
    query: query
  });
});
```

次に、次のようにパス内のクエリパラメータを使用できます。

```javascript
API.get('sampleCloudApi', '/items?q=test');
```

## カスタム応答タイプ

デフォルトでは、AWS AmplifyでAPIを呼び出すと、JSONレスポンスがパースされます。 たとえば、Blob 形式のファイルなどの REST API エンドポイントがある場合。 メソッド呼び出しの `responseType` パラメータを使用して、カスタム応答タイプを指定できます。

```javascript
let file = await API.get('myCloudApi', '/items', {
  'responseType': 'blob',
});
```

Allowed values for `responseType` are "arraybuffer", "blob", "document", "json" or "text"; and it defaults to "json" if not specified. See the [documentation](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) for more information.

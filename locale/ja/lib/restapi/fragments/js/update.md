## POST データ

API エンドポイントにデータを投稿:

```javascript
const apiName = 'MyApiName'; // replace this with your api name.
const path = '/path'; //replace this with the path you have configured on your API
const myInit = {
    body: {}, // replace this with attributes you need
    headers: {}, // OPTIONAL
};

API
  .post(apiName, path, myInit)
  .then(response => {
    // Add your code here
  })
  .catch(error => {
    console.log(error.response);
  });
```

async/await の例

```javascript
async function postData() { 
    const apiName = 'MyApiName';
    const path = '/path';
    const myInit = { // OPTIONAL
        body: {}, // replace this with attributes you need
        headers: {}, // OPTIONAL
    };

    return await API.post(apiName, path, myInit);
}

postData();
```

## PUT データ

REST API と一緒に使用する場合、 `put()` メソッドを使用してレコードを作成または更新できます。 一致するレコードが見つかった場合は、レコードを更新します。それ以外の場合は、新しいレコードが作成されます。

```javascript
const apiName = 'MyApiName'; // replace this with your api name.
const path = '/path'; // replace this with the path you have configured on your API
const myInit = {
    body: {}, // replace this with attributes you need
    headers: {}, // OPTIONAL
};

API
  .put(apiName, path, myInit)
  .then(response => {
    // Add your code here
  })
  .catch(error => {
    console.log(error.response);
  });
```

async/awaitの例:

```javascript
async function putData() { 
    const apiName = 'MyApiName';
    const path = '/path';
    const myInit = { // OPTIONAL
        body: {}, // replace this with attributes you need
        headers: {}, // OPTIONAL
    };

    return await API.put(apiName, path, myInit);
}

putData();
```

Lambda 関数内の本体にアクセス

```javascript
// using a basic lambda handler
exports.handler = (event, context) => {
  console.log('body: ', event.body);
}

// using serverless express
app.put('/myendpoint', function(req, res) {
  console.log('body: ', req.body);
});
```

レコードを更新:

```javascript
const params = {
    body: {
        itemId: '12345',
        itemDesc: ' update description'
    },
};

const apiResponse = await API.put('MyTableCRUD', '/manage-items', params);
```

## Lambdaプロキシ機能で本文にアクセスする

```javascript
// using a basic lambda handler
exports.handler = (event, context) => {
  console.log('body: ', event.body);
}

// using serverless express
app.post('/myendpoint', function(req, res) {
  console.log('body: ', req.body);
});
```
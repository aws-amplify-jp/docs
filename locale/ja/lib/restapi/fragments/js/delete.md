## データを削除

```javascript
const apiName = 'MyApiName'; // replace this with your api name.
const path = '/path'; //replace this with the path you have configured on your API
const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
};

API
  .del(apiName, path, myInit)
  .then(response => {
    // Add your code here
  })
  .catch(error => {
    console.log(error.response);
  });
```

async/await の例

```javascript
async function deleteData() { 
    const apiName = 'MyApiName';
    const path = '/path';
    const myInit = { // OPTIONAL
        headers: {} // OPTIONAL
    }
    return await API.del(apiName, path, myInit);
}

deleteData();
```

Lambda 関数内の本体にアクセス

```javascript
// using a basic lambda handler
exports.handler = (event, context) => {
  console.log('body: ', event.body);
}

// using serverless express
app.delete('/myendpoint', function(req, res) {
  console.log('body: ', req.body);
});
```
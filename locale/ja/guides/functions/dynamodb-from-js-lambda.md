---
title: Node.js の Lambda から DynamoDB を呼び出す
description: Node.jsのLambda関数からDynamoDBデータベースを操作する方法
---

Node.js 環境で Lambda から DynamoDB を操作する最も簡単な方法は、 [DynamoDB ドキュメント クライアント](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)を使用することです。 このガイドでは、Node.js ランタイムを使用して Lambda 関数からDynamoDB データベースとやりとりする方法を学びます。

[put](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property), [get](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property), [scan](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property), [query](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property) の操作を実行する方法を学びます。

### Lambda から DynamoDB にアイテムを作成する

DynamoDBでアイテムを作成するには、 `put` メソッドを使用します。

```js
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName : 'your-table-name',
  /* Item properties will depend on your application concerns */
  Item: {
     id: '12345',
     price: 100.00
  }
}

async function createItem(){
  try {
    await docClient.put(params).promise();
  } catch (err) {
    return err;
  }
}

exports.handler = async (event) => {
  try {
    await createItem()
    return { body: 'Successfully created item!' }
  } catch (err) {
    return { error: err }
  }
};
```

### LambdaからDynamoDBのプライマリキーでアイテムを取得する

To get an item by primary key in DynamoDB you can use the `get` method. A `get` request returns a single item given the primary key of that item:

```js
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName : 'your-table-name',
  /* Item properties will depend on your application concerns */
  Key: {
    id: '12345'
  }
}

async function getItem(){
  try {
    const data = await docClient.get(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
    const data = await getItem()
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}
```

### テーブルをスキャン中

`スキャン` は、テーブル内のすべての項目またはセカンダリインデックス (1 MB のデータの制限) にアクセスすることで、1 つ以上の項目および項目属性を返します。

```js
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName : 'your-table-name'
}

async function listItems(){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
    const data = await listItems()
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}
```

### テーブルのクエリ

`クエリ` は、プライマリキーまたはセカンダリインデックスでテーブルからアイテムをクエリすることによって、1 つ以上のアイテムとアイテムの属性を返します。

```js
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

var params = {
  TableName: 'your-table-name',
  IndexName: 'some-index',
  KeyConditionExpression: '#name = :value',
  ExpressionAttributeValues: { ':value': 'shoes' },
  ExpressionAttributeNames: { '#name': 'name' }
}

async function queryItems(){
  try {
    const data = await docClient.query(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
    const data = await queryItems()
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}
```
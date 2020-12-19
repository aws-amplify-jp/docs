---
title: Python の Lambda 関数から DynamoDB を呼び出す
description: PythonのLambda関数からDynamoDBデータベースを操作する方法
---

Python 環境で Lambda から DynamoDB を操作する最も簡単な方法は、 [boto3 DynamoDB クライアント](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html)を使用することです。 このガイドでは、Pythonランタイムを使ってLambda関数からDynamoDBデータベースを操作する方法を学びます。

[put_item](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item), [get_item](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.get_item), [scan](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.scan), and [query](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query) の操作を実行する方法を学びます。

### Lambda から DynamoDB にアイテムを作成する

DynamoDBでアイテムを作成するには、 `put` メソッドを使用します。

```python
import boto3

client = boto3.client('dynamodb')

def handler(event, context):
  data = client.put_item(
    TableName='your-table-name',
    Item={
        'id': {
          'S': '005'
        },
        'price': {
          'N': '500'
        },
        'name': {
          'S': 'Yeezys'
        }
    }
  )

  response = {
      'statusCode': 200,
      'body': 'successfully created item!',
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  }

  return response
```

### LambdaからDynamoDBのプライマリキーでアイテムを取得する

To get an item by primary key in DynamoDB you can use the `get` method. A `get` request returns a single item given the primary key of that item:

```python
import json
import boto3

client = boto3.client('dynamodb')

def handler(event, context):
  data = client.get_item(
    TableName='your-table-name',
    Key={
        'id': {
          'S': '005'
        }
    }
  )

  response = {
      'statusCode': 200,
      'body': json.dumps(data),
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  }

  return response
```

### テーブルをスキャン中

`スキャン` は、テーブル内のすべての項目またはセカンダリインデックス (1 MB のデータの制限) にアクセスすることで、1 つ以上の項目および項目属性を返します。

```python
import json
import boto3

client = boto3.client('dynamodb')

def handler(event, context):
  data = client.scan(
    TableName='your-table-name'
  )

  response = {
      'statusCode': 200,
      'body': json.dumps(data),
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  }

  return response
```

### テーブルのクエリ

`クエリ` は、プライマリキーまたはセカンダリインデックスでテーブルからアイテムをクエリすることによって、1 つ以上のアイテムとアイテムの属性を返します。

```python
import json
import boto3

client = boto3.client('dynamodb')

def handler(event, context):
  data = client.query(
    TableName='your-table-name',
    IndexName='some-index',
    KeyConditionExpression='#name = :value',
    ExpressionAttributeValues={
      ':value': {
        'S': 'shoes'
      }
    },
    ExpressionAttributeNames={
      '#name': 'name'
    }
  )

  response = {
      'statusCode': 200,
      'body': json.dumps(data),
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  }

  return response
```
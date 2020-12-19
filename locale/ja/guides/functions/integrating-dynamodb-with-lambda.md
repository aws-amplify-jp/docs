---
title: DynamoDBとLambdaの統合
description: DynamoDBテーブルとLambda関数を統合する方法
---

このガイドでは、3つの方法を学びます。

1. 一緒に統合された新しいLambda関数とDynamoDBデータベースを作成
2. 新しいDynamoDBデータベースを作成し、既存のLambda関数と統合します。
3. 新しいLambda関数を作成し、既存のDynamoDBデータベースと統合します。

### 統合された新しいLambda関数とDynamoDBデータベースの作成

DynamoDBテーブルを作成するには、最初に行う必要があります。

```sh
amplify add storage

? Please select from one of the below mentioned services: NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project: testtable
? Please provide table name: testtable

# You can now add columns to the table.
? What would you like to name this column: id
? Please choose the data type: String
? Would you like to add another column? N
? Please choose partition key for the table: id
? Do you want to add a sort key to your table? N
? Do you want to add global secondary indexes to your table? N
? Do you want to add a Lambda Trigger for your Table? N
```

次に、関数を作成します。

```sh
amplify add function

? Provide a friendly name for your resource to be used as a label for this category in the project: mylambda
? Provide the AWS Lambda function name: mylambda
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? Y
? Select the category: storage
? Select the operations you want to permit for testtable: create, read, update, delete
? Do you want to invoke this function on a recurring schedule? N
? Do you want to edit the local lambda function now? N
```

関数とデータベースをデプロイします。

```sh
push を増幅する
```

関数とデータベースを使用する準備ができました！

LambdaからDynamoDBを操作する方法については、Node.js [でLambdaからDynamoDBを呼び出す](~/guides/functions/dynamodb-from-js-lambda.md) を参照してください。

### 新しいDynamoDBデータベースを作成し、既存のLambda関数と統合します

まず、 __storage__ カテゴリを使用してデータベースを作成します。

```sh
amplify add storage

? Please select from one of the below mentioned services: NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project: testtable
? Please provide table name: testtable

# You can now add columns to the table.
? What would you like to name this column: id
? Please choose the data type: String
? Would you like to add another column? N
? Please choose partition key for the table: id
? Do you want to add a sort key to your table? N
? Do you want to add global secondary indexes to your table? N
? Do you want to add a Lambda Trigger for your Table? N
```

次に、関数の権限を更新します。

```sh
amplify update function

? Please select the Lambda Function you would want to update: <your-function>
? Do you want to update permissions granted to this Lambda function to perform on other resources in your project? Y
? Select the category: storage
? Select the operations you want to permit for testtable: create, read, update, delete
? Do you want to invoke this function on a recurring schedule? N
? Do you want to edit the local lambda function now? N
```

データベースをデプロイし、Lambdaの権限を更新します。

```sh
push を増幅する
```

関数とデータベースを使用する準備ができました！

### 新しいLambda関数を作成し、既存のDynamoDBデータベースと統合します

既存のDynamoDBデータベースと統合された新しいLambda関数を作成する 関数の作成プロセスでデータベースへのアクセスを許可する必要があります。

```sh
amplify add function

? Provide a friendly name for your resource to be used as a label for this category in the project: mylambda
? Provide the AWS Lambda function name: mylambda
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? Y
? Select the category: storage

# Select the database you'd like to grant permissions to or go to the next step if there is only one database in the project

? Select the operations you want to permit for <your-table-name>: create, read, update, delete
? Do you want to invoke this function on a recurring schedule? N
? Do you want to edit the local lambda function now? N
```

機能をデプロイします。

```sh
push を増幅する
```

関数とデータベースを使用する準備ができました！

LambdaからDynamoDBを操作する方法については、Node.js [でLambdaからDynamoDBを呼び出す](~/guides/functions/dynamodb-from-js-lambda.md) を参照してください。
---
title: Lambda GraphQLリゾルバの使い方
description: Lambda GraphQLリゾルバを使用して他のサービスとやりとりする方法
---

The [GraphQL Transform Library](~/cli/graphql-transformer/function.md) provides a `@function` directive that enables the configuration of AWS Lambda function resolvers within your GraphQL API. In this guide you will learn how to use Lambda functions as GraphQL resolvers to interact with other services and APIs using the `@function` directive.

## 基本クエリと変更の作成 関数リゾルバ

開始するには クエリとLambda関数としてデータソースが設定されている変異を含むGraphQLスキーマを見てみましょう。

```graphql
# 引数を返すクエリ
type Query {
  echo(msg: String): String @function(name: "functionName-${env}")
}

# 2つの数値を追加する突然変異
type Mutation {
  add(number1: Int, number2: Int): Int@function(named@@0 "functionName-${env}")
}
```

`@function` ディレクティブを使用して、GraphQL リゾルバとして呼び出される Lambda 関数を指定できます。

このガイドでは、GraphQL API でLambda 関数リゾルバを有効にする方法を学びます。

### 関数の作成

始めるには、最初の Lambda 関数を作成します。

```sh
amplify add function

? Provide a friendly name for your resource to be used as a label for this category in the project: addingfunction
? Provide the AWS Lambda function name: echofunction
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? No
? Do you want to invoke this function on a recurring schedule? No
? Do you want to edit the local lambda function now? Yes
```

関数コード( __amplify/backend/function/echofunction/src/index.js__)を開き、Enterキーを押します。

```js
exports.handler = async (event) => {
    const response = event.arguments.msg
    return response;
};
```

この関数は引数として渡される `msg` プロパティの値だけを返します。

#### Lambda イベント情報

`イベント` オブジェクトには以下のプロパティが含まれます。

```js
/*
event = {
  "typeName": "Query" or "Mutation", Filled dynamically based on @function usage location
  "fieldName": Filled dynamically based on @function usage location
  "arguments": { msg }, GraphQL field arguments
  "identity": {}, AppSync identity object
  "source": {}, The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object
  "request": {}, AppSync request object. Contains things like headers
  "prev": {} If using the built-in pipeline resolver support, this contains the object returned by the previous function.
}
*/
```

上記の関数では、関数の引数として渡される値を取得するために、 `arguments` プロパティを使用しました。

次に、別のLambda関数を作成します。

```sh
amplify add function

? Provide a friendly name for your resource to be used as a label for this category in the project: addingfunction
? Provide the AWS Lambda function name: addfunction
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? No
? Do you want to invoke this function on a recurring schedule? No
? Do you want to edit the local lambda function now? Yes
```

次に、関数コード( __amplify/backend/function/addingfunction/src/index.js__)を以下に更新し、Enterキーを押します。

```js
exports.handler = async (event) => {
    /* Add number1 and number2, return the result */
    const response = event.arguments.number1 + event.arguments.number2
    return response;
};
```

この関数は2つの数字を加えて結果を返します。

### GraphQL API の作成

機能が作成されたので、GraphQL API を作成できます。

```sh
amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: gqllambda
? Choose the default authorization type for the API: API Key
? Enter a description for the API key: public (or some description)
? After how many days from now the API key should expire: 365 (or your preferred expiration)
? Do you want to configure advanced settings for the GraphQL API: N
? Do you have an annotated GraphQL schema? N
? Do you want a guided schema creation? Y
? What best describes your project: Single object with fields
? Do you want to edit the schema now? Y
```

次に、( __amplify/backend/api/gqlambda/schema.graphql__にある) ベースのGraphQLスキーマを次のコードで更新し、Enterキーを押します。

```graphql
type Query {
  echo(msg: String): String @function(name: "echofunction-${env}")
}

type Mutation {
  add(number1: Int, number2: Int): Int@function(name: "addfunction-${env}")
}
```

次に、関数とGraphQL APIをデプロイします。

```sh
push を増幅する
```

### GraphQL API のクエリ

これで、次のクエリと変更を実行してAPIとやり取りできます。

```sh
query echo {
  echo(msg: "Hello world!")
}

mutation add {
  add(number1: 1100, number2:100)
}
```

## 別の API と相互作用するリゾルバの作成

次に、パブリックCryptocurrencyのREST APIと相互作用する機能を作成します。

別の機能を作成:

```sh
anmpify add関数
```

次に、関数コード( __amplify/backend/function/src/index.js__)を以下に更新し、Enterキーを押します。

```javascript
const axios = require('axios')

exports.handler = async (event) => {
    let limit = 10
    if (event.arguments.limit) {
        limit = event.arguments.limit
    }
    const url = `https://api.coinlore.net/api/tickers/?limit=${limit}`
    let response = await axios.get(url)
    return JSON.stringify(response.data.data);
};
```

次に、関数 __src__ フォルダに axios ライブラリをインストールし、ルートディレクトリに戻します。

```sh
cd anplify/backend/function/cryptofunction/src
npm install axios
cd ../../../../../
```

GraphQL スキーマを更新し、 `getCoins` リゾルバをクエリタイプに追加します。

```graphql
type Query {
  echo(msg: String): String @function(name: "gqlfunc-${env}")
  getCoins(limit: Int): String @function(name: "cryptocurrency-${env}")
}
```

次に、アップデートをデプロイします。

```sh
push を増幅する
```

これで新しい `getCoins` クエリを使用して GraphQL API をクエリできるようになりました。

#### 基本クエリ

```graphql
getCoinsをクエリする {
  getCoins
}
```

#### クエリの上限あり

```graphql
query getCoins {
  getCoins(limit: 100)
}
```

`@function` ディレクティブの詳細については、GraphQL 変換ドキュメント [を参照してください。](~/cli/graphql-transformer/function.md)。

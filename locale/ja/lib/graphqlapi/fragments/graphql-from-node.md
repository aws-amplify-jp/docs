Node.js アプリまたは Lambda 関数から、AppSync GraphQL API を呼び出すことができます。基本的な `Todo` アプリを例として取ります。

```graphql
type Todo @model {
  id: ID!
  name: String
  description: String
}
```

This API will have operations available for `create`, `read`, `update`, and `delete`. Let's take a look at how to perform both a __query__ as well as a __mutation__ from a Lambda function using Node.js.

## クエリ

```javascript
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const listTodos = gql`
  query listTodos {
    listTodos {
      items {
        id
        name
        description
      }
    }
  }
`

exports.handler = async (event) => {
  try {
    const graphqlData = await axios({
      url: process.env.API_URL,
      method: 'post',
      headers: {
        'x-api-key': process.env.API_<YOUR_API_NAME>_GRAPHQLAPIKEYOUTPUT
      },
      data: {
        query: print(listTodos),
      }
    });
    const body = {
        graphqlData: graphqlData.data.data.listTodos
    }
    return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }
  } catch (err) {
    console.log('error posting to appsync: ', err);
  } 
}
```

## <unk>

この例では、変数を引数として渡す方法を示す変異を作成します。

```js
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const createTodo = gql`
  mutation createTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      name
      description
    }
  }
`

exports.handler = async (event) => {
  try {
    const graphqlData = await axios({
      url: process.env.API_URL,
      method: 'post',
      headers: {
        'x-api-key': process.env.API_<YOUR_API_NAME>_GRAPHQLAPIKEYOUTPUT
      },
      data: {
        query: print(createTodo),
        variables: {
          input: {
            name: "Hello world!",
            description: "My first todo"
          }
        }
      }
    });
    const body = {
      message: "successfully created todo!"
    }
    return {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
          "Access-Control-Allow-Origin": "*",
      }
    }
  } catch (err) {
    console.log('error creating todo: ', err);
  } 
}
```

## Lambdaからのリクエストに署名中

リクエストのカスタム署名で作業することはどうでしょうか? `iam` の認証を使用する別のスキーマ例を見てみましょう。

```graphql
type Todo @model @auth (
    rules: [
        { allow: private, provider: iam }
    ]
) {
  id: ID!
  name: String
  description: String
}
```

`amplify add 関数` を使用して Lambda 関数を作成し、 `amplify add 関数` フローでプロンプトが表示されたら、GraphQL API にアクセスできるようにしてください。

GraphQL API を呼び出すためにLambda 関数に必要な Lambda 実行の IAM ロールを自動的に設定します。 以下の関数はリクエストに署名し、AppSyncとRegionの環境変数を使用します。 `増幅によって作成された関数` を増幅します。

```javascript
const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_<YOUR_API_NAME>_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require('./query.js').mutation;
const apiKey = process.env.API_<YOUR_API_NAME>_GRAPHQLAPIKEYOUTPUT;

exports.handler = async (event) => {
    const req = new AWS.HttpRequest(appsyncUrl, region);

    const item = {
        input: {
            name: "Lambda Item",
            description: "Item Generated from Lambda"
        }
    };

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: graphqlQuery,
        operationName: "createTodo",
        variables: item
    });

    if (apiKey) {
        req.headers["x-api-key"] = apiKey;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
            result.on('data', (data) => {
                resolve(JSON.parse(data.toString()));
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });

    return {
        statusCode: 200,
        body: data
    };
};
```

最後に、実行しているGraphQL操作を定義することができます。この場合、 `createTodo` 変更は、別の `query.js` ファイル内で定義します。

```javascript
module.exports = {
    mutation: `mutation createTodo($input: CreateTodoInput!) {
      createTodo(input: $input) {
        id
        name
        description
      }
    }
    `
}
```

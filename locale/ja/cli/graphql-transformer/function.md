---
title: Lambda リゾルバを設定
description: すばやく & AWS AppSync API内でAWS Lambdaリゾルバを簡単に設定できます。
---

## @function

The `@function` directive allows you to quickly & easily configure AWS Lambda resolvers within your AWS AppSync API.

### 定義

```graphql
@function(name: String!, region: String) の FIELD_DEFINITION
```

### 使用法

@function ディレクティブを使用すると、lambda リゾルバを AppSync API に素早く接続できます。 Amplify CLI、AWS Lambdaコンソール、または他のツールを介してAWS Lambda関数をデプロイできます。 AWS Lambda リゾルバを接続するには、 `schema.graphql` のフィールドに `@function` ディレクティブを追加します。

次の内容を含む *echo* 関数をデプロイしたと仮定します。

```javascript
exports.handler = async function(event, context){
  return event.arguments.msg;
};
```

**「関数の増幅」カテゴリを使用して関数をデプロイした場合**

The Amplify CLI provides support for maintaining multiple environments out of the box. When you deploy a function via `amplify add function`, it will automatically add the environment suffix to your Lambda function name. For example if you create a function named **echofunction** using `amplify add function` in the **dev** environment, the deployed function will be named **echofunction-dev**. The `@function` directive allows you to use `${env}` to reference the current Amplify CLI environment.

```
type Query {
  echo(msg: String): String @function(${env}")
}
```

**関数を増幅せずに展開した場合**

増幅せずに API をデプロイした場合は、完全な Lambda 関数名を指定する必要があります。 **echofunction** という名前で同じ関数をデプロイした場合、以下のようになります。

```
type Query {
  echo(msg: String): String @function(name: "echofunction")
}
```

**例: カスタムデータを返し、カスタムロジックを実行**

You can use the `@function` directive to write custom business logic in an AWS Lambda function. To get started, use `amplify add function`, the AWS Lambda console, or other tool to deploy an AWS Lambda function with the following contents.

例えば、関数に `GraphQLResolverFunction` という名前が付けられていると仮定します:

```javascript
const POSTS = [
    { id: 1, title: "AWS Lambda: How To Guide." },
    { id: 2, title: "AWS Amplify Launches @function and @key directives." },
    { id: 3, title: "Serverless 101" }
];
const COMMENTS = [
    { postId: 1, content: "Great guide!" },
    { postId: 1, content: "Thanks for sharing!" },
    { postId: 2, content: "Can't wait to try them out!" }
];

// Get all posts. Write your own logic that reads from any data source.
function getPosts() {
    return POSTS;
}

// Get the comments for a single post.
function getCommentsForPost(postId) {
    return COMMENTS.filter(comment => comment.postId === postId);
}

/**
 * Using this as the entry point, you can use a single function to handle many resolvers.
 */
const resolvers = {
  Query: {
    posts: ctx => {
      return getPosts();
    },
  },
  Post: {
    comments: ctx => {
      return getCommentsForPost(ctx.source.id);
    },
  },
}

// event
// {
//   "typeName": "Query", /* Filled dynamically based on @function usage location */
//   "fieldName": "me", /* Filled dynamically based on @function usage location */
//   "arguments": { /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }
exports.handler = async (event) => {
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error("Resolver not found.");
};
```

**例: Amazon Cognito User Pools からログインしたユーザーを取得する**

When building applications, it is often useful to fetch information for the current user. You can use the `@function` directive to quickly add a resolver that uses AppSync identity information to fetch a user from Amazon Cognito User Pools. First make sure you have added Amazon Cognito User Pools enabled via `amplify add auth` and a GraphQL API via `amplify add api` to an amplify project. Once you have created the user pool, get the **UserPoolId** from **amplify-meta.json** in the **backend/** directory of your amplify project. You will provide this value as an environment variable in a moment. Next, using the Amplify function category, AWS console, or other tool, deploy a AWS Lambda function with the following contents.

例えば、関数に `GraphQLResolverFunction` という名前が付けられていると仮定します:

```javascript
/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authMyResourceNameUserPoolId = process.env.AUTH_MYRESOURCENAME_USERPOOLID

Amplify Params - DO NOT EDIT */

const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

/**
 * Get user pool information from environment variables.
 */
const COGNITO_USERPOOL_ID = process.env.AUTH_MYRESOURCENAME_USERPOOLID;
if (!COGNITO_USERPOOL_ID) {
  throw new Error(`Function requires environment variable: 'COGNITO_USERPOOL_ID'`);
}
const COGNITO_USERNAME_CLAIM_KEY = 'cognito:username';

/**
 * Using this as the entry point, you can use a single function to handle many resolvers.
 */
const resolvers = {
  Query: {
    echo: ctx => {
      return ctx.arguments.msg;
    },
    me: async ctx => {
      var params = {
        UserPoolId: COGNITO_USERPOOL_ID, /* required */
        Username: ctx.identity.claims[COGNITO_USERNAME_CLAIM_KEY], /* required */
      };
      try {
        // Read more: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminGetUser-property
        return await cognitoIdentityServiceProvider.adminGetUser(params).promise();
      } catch (e) {
        throw new Error(`NOT FOUND`);
      }
    }
  },
}

// event
// {
//   "typeName": "Query", /* Filled dynamically based on @function usage location */
//   "fieldName": "me", /* Filled dynamically based on @function usage location */
//   "arguments": { /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }
exports.handler = async (event) => {
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error("Resolver not found.");
};
```

このスキーマを使用して、Amplify経由でデプロイされたAppSync APIにこの関数を接続できます。

```graphql
type Query {
    posts: [Post] @function(name: "GraphQLResolverFunction")
}
type Post {
    id: ID!
    title: String!
    comments: [Comment] @function(name: "GraphQLResolverFunction")
}
type Comment {
    postId: ID!
    content: String
}
```

このシンプルなlambda関数は、選択した言語を使用して独自のカスタムロジックを書く方法を示しています。 独自のデータとロジックを使用してサンプルを強化してみてください。

> 関数をデプロイする際には、関数が認証リソースにアクセスできることを確認してください。 CLIの `amplify更新関数` コマンドを実行して、関数に `AUTH_<RESOURCE_NAME>_USERPOOLID` という名前の環境変数を自動的に与え、対応するCRUDポリシーを関数の実行ロールに関連付けます。

関数をデプロイしたら、@function ディレクティブを使用して、AppSync に接続できます。 これをスキーマに追加して、 `Query.echo` と `Query.me` を新しい関数に接続します。

```graphql
type Query {
  me: User @function(name: "ResolverFunction")
  echo(msg: String): String @function(name: "ResolverFunction")
}
# These types derived from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminGetUser-property
type User {
  Username: String!
  UserAttributes: [Value]
  UserCreateDate: String
  UserLastModifiedDate: String
  Enabled: Boolean
  UserStatus: UserStatus
  MFAOptions: [MFAOption]
  PreferredMfaSetting: String
  UserMFASettingList: String
}
type Value {
  Name: String!
  Value: String
}
type MFAOption {
  DeliveryMedium: String
  AttributeName: String
}
enum UserStatus {
  UNCONFIRMED
  CONFIRMED
  ARCHIVED
  COMPROMISED
  UNKNOWN
  RESET_REQUIRED
  FORCE_CHANGE_PASSWORD
}
```

Next run `amplify push` and wait as your project finishes deploying. To test that everything is working as expected run `amplify api console` to open the GraphiQL editor for your API. You are going to need to open the Amazon Cognito User Pools console to create a user if you do not yet have any. Once you have created a user go back to the AppSync console's query page and click "Login with User Pools". You can find the **ClientId** in **amplify-meta.json** under the key **AppClientIDWeb**. Paste that value into the modal and login using your username and password. You can now run this query:

```graphql
query {
  me {
    Username
    UserStatus
    UserCreateDate
    UserAttributes {
      Name
      Value
    }
    MFAOptions {
      AttributeName
      DeliveryMedium
    }
    Enabled
    PreferredMfaSetting
    UserMFASettingList
    UserLastModifiedDate
  }
}
```

をクリックすると、現在のユーザーに関連するユーザー情報が直接ユーザープールから返されます。

### ファンクションイベントの構造

`@function` ディレクティブで接続された lambda 関数を書くときは、AWS Lambda イベントオブジェクトの次の構造を期待できます。

| キー        | 説明                                                                                           |
| --------- | -------------------------------------------------------------------------------------------- |
| typeName  | リゾルバであるフィールドの親オブジェクトタイプの名前。                                                                  |
| fieldName | 解決されるフィールドの名前。                                                                               |
| 引数        | 解決されるフィールドに渡された引数を含むマップ。                                                                     |
| identity  | リクエストの ID 情報を含むマップ。存在する場合は JWT クレームを含むネストされたキー「クレーム」が含まれます。                                  |
| ソース       | クエリ内でネストされたフィールドを解決する場合、実行時にソースに親値が含まれます。 例えば、 `Post.comments`を解決する場合、ソースは Post オブジェクトになります。 |
| リクエスト     | AppSync リクエストオブジェクトにはヘッダー情報が含まれています。                                                         |
| 前         | パイプラインリゾルバを使用する場合, これは、前の関数によって返されたオブジェクトを含みます. ユースケースを監査するために、以前の値を返すことができます.               |

### 異なる領域で関数を呼び出し中

デフォルトでは、この機能は増幅プロジェクトと同じ領域にあることを期待します。 異なる(または静的な)領域で関数を呼び出す必要がある場合は、 **region** 引数を指定できます。

```graphql
type Query {
  echo(msg: String): String @function(name: "echofunction", region: "us-east-1")
}
```

異なるAWSアカウントでの関数の呼び出しは、@function ディレクティブではサポートされていませんが、AWS AppSync でサポートされています。

### 連鎖関数

@function ディレクティブは AWS AppSync パイプラインリゾルバをサポートしています。 つまり、フィールドのリゾルバが呼び出されたときに直列に呼び出されるように、複数の関数を連鎖させることができます。 複数の AWS Lambda 関数を直列に呼び出すパイプラインリゾルバを作成する。 フィールドに複数の `@function` ディレクティブを使用します。

```graphql
type Mutation {
  doSomeWork(msg: String): String @function(name: "worker-function") @function(name: "audit-function")
}
```

In the example above when you run a mutation that calls the `Mutation.doSomeWork` field, the **worker-function** will be invoked first then the **audit-function** will be invoked with an event that contains the results of the **worker-function** under the **event.prev.result** key. The **audit-function** would need to return **event.prev.result** if you want the result of **worker-function** to be returned for the field. Under the hood, Amplify creates an `AppSync::FunctionConfiguration` for each unique instance of `@function` in a document and a pipeline resolver containing a pointer to a function for each `@function` on a given field.

#### 生成

`@function` ディレクティブはこれらのリソースを必要に応じて生成します:

1. AWS AppSync で関数を呼び出す権限と信頼ポリシーを持つ、AWS IAM ロール。
2. 新しいロールと既存の関数をAppSync APIに登録するAWS AppSyncデータソース。
3. lambdaイベントを準備し、新しいデータソースを呼び出すAWS AppSyncパイプライン関数。
4. GraphQL 項目にアタッチし、新しいパイプライン機能を呼び出すAWS AppSync リゾルバ。

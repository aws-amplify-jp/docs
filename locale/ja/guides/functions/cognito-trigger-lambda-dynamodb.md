---
title: AWS Cognito トリガーを使用して DynamoDB を呼び出す
description: DynamoDBにエントリを追加するには、登録後の確認後のユーザー情報を入力します。
---

AWS Cognitoをアプリケーションで認証処理に使用している場合は、トリガーを使用して認証 イベントを処理できます。 たとえば、ユーザーがサインアップした後にウェルカムメールを送信します。 AWS Cognitoトリガーに関する完全なドキュメントは こちら [](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)をご覧ください。

In this guide, you will learn how to use a post confirmation trigger to save user's information to your DynamoDB table. Like mentioned in the previous guides, the easiest way to interact with DynamoDB from Lambda in a Node.js environment is to use the [DynamoDB document client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html).

このアプローチを使用すると、Cognito Identity をアプリケーションのユーザープロファイルにリンクできます。 著者が投稿したものをリストアップし名前を表示できる可能性があります メールアドレスの代わりに、 、作成日などを送信します。

このメソッドの主な利点は、変更を使用してGraphQL APIでユーザーを手動で作成する必要がないことです。 別の選択肢があります

このソリューションの主な問題は、AWS Cognito からユーザーを削除すると、アプリケーションがそのことを知らないということです。


### シナリオ

ユーザーがサインアップした後、ユーザー情報を含む DynamoDB テーブルにエントリを作成します。

### GraphQL API の作成

このステップでは、ユーザー情報を含むエントリが保存されるUserテーブルを作成します。 これはAmplify GraphQL API を使用して行います。

Userモデルを持つGraphQL APIを既に持っている場合は、この部分をスキップできます。

```sh
amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: myapi
? Choose the default authorization type for the API API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365
? Do you want to configure advanced settings for the GraphQL API: No, I am done.
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields
? Do you want to edit the schema now? Yes
```

CLIは、テキストエディタでanplify/backend/api/contactapi/schema.graphqlにあるGraphQLスキーマを開きます。スキーマを次のように更新し、ファイルを保存します。

```graphql
type User
  @model
{
  id: ID!
  name: String
  email: String
}
```


### lambda 関数を作成

この関数は、ユーザーが投稿を確認した後に呼び出されます。

```sh
amplify add function

? Provide a friendly name for your resource to be used as a label for this category in the project: mylambda
? Provide the AWS Lambda function name: mylambda
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? Y
? Select the category: storage
? Select the operations you want to permit for UserTable: create, read, update, delete
? Do you want to invoke this function on a recurring schedule? N
? Do you want to configure Lambda layers for this function? N
? Do you want to edit the local lambda function now? N
```

次に、新しく作成した lambda 関数に関連付けられた index.js ファイルを開き、次のコードを貼り付けます。

```js
var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {

    let date = new Date();

    if (event.request.userAttributes.sub) {

        let params = {
            Item: {
                'id': {S: event.request.userAttributes.sub},
                '__typename': {S: 'User'},
                'name': {S: event.request.userAttributes.name},
                'email': {S: event.request.userAttributes.email},
                'createdAt': {S: date.toISOString()},
                'updatedAt': {S: date.toISOString()},
            },
            TableName: process.env.API_{YOUR_APP_NAME}_USERTABLE_NAME
        };

        // Call DynamoDB
        try {
            await ddb.putItem(params).promise()
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success: Everything executed correctly");
        context.done(null, event);

    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: Nothing was written to DynamoDB");
        context.done(null, event);
    }
};
```

環境変数 API_{APP_NAME}_USERTABLE_NAME を呼び出すことでテーブル名にアクセスできます。


lambda 関数をデプロイする :

```sh
push を増幅する
```

lambda関数が使えるようになりました！

### 投稿確認トリガーの設定

AWS Cognitoトリガーを作成したlambda関数を呼び出すように設定するには、以下を行う必要があります。

    - [AWSコンソール](https://console.aws.amazon.com/console/home)に移動する
    - AWS Cognitoサービスに移動し、「ユーザプールを管理」を選択します
    - アプリケーションに関連するユーザープールを選択してください
    - 「トリガー」に移動し、ポスト確認トリガーを探し、ラムダ機能を選択してください

APIカテゴリは、RESTおよびGraphQLエンドポイントにHTTPリクエストを行うためのソリューションを提供します。 GraphQL API の構築については、ドキュメントの [GraphQL Getting Started](~/lib/graphqlapi/getting-started.md) セクションを参照してください。

REST API カテゴリは、API Gateway Authorization が `AWS_IAM` に設定されている場合に、Amazon API Gateway に対する署名済みリクエストを作成するために使用できます。

> [がインストールされ、Amplify CLIおよびライブラリ](~/cli/start/install.md)が設定されていることを確認してください。

## 自動設定：新しい REST API を作成

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して api を追加
```

サービス タイプとして `REST` を選択します。

```console
?以下のサービスのいずれかから選択してください
  GraphQL
<unk> REST
```

CLIはあなたのリソースを作成するためのいくつかのオプションを要求します。提供されたオプションを使用して作成できます。
- Lambda関数をトリガーするRESTエンドポイント
- Amazon DynamoDBテーブルでCRUD操作を可能にするRESTエンドポイント。

セットアップ中に、既存のLambda関数とDynamoDBテーブルを使用するか、CLIプロンプトに従って新しいテーブルを作成することができます。 リソースが作成されたら、 `push` コマンドでバックエンドを更新します。

```bash
push を増幅する
```

`aws-exports.js` と呼ばれる設定ファイルが、 `./src` などの設定されたソースディレクトリにコピーされます。

### アプリケーションの設定

設定ファイルをアプリに読み込みます。Amplify設定ステップをアプリのルートエントリポイントに追加することをお勧めします。 例えば `App.js` 、Angularの `main.ts` など。

```javascript
import Amplify, { API } from 'aws-amply';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
```

## 手動設定: 既存の REST API をインポート

手動設定の場合は、AWS リソースの設定を提供し、必要に応じて認証を設定する必要があります。

```javascript
import Amplify, { API } from 'aws-amplify';

Amplify.configure({
    // OPTIONAL - if your API requires authentication 
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
        // REQUIRED - Amazon Cognito Region
        region: 'XX-XXXX-X', 
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'XX-XXXX-X_abcd1234', 
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',
    },
    API: {
        endpoints: [
            {
                name: "MyAPIGatewayAPI",
                endpoint: "https://1234567890-abcdefgh.amazonaws.com"
            },
            {
                name: "MyCustomCloudFrontApi",
                endpoint: "https://api.my-custom-cloudfront-domain.com",

            }
        ]
    }
});
```

### AWSリージョナルエンドポイント

You can utilize regional endpoints by passing in the *service* and *region* information to the configuration. See [AWS Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html). The example below defines a [Lambda invocation](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html) in the `us-east-1` region:

```javascript
API: {
    endpoints: [
        {
            name: "MyCustomLambda",
            endpoint: "https://lambda.us-east-1.amazonaws.com/2015-03-31/functions/yourFuncName/invocations",
            service: "lambda",
            region: "us-east-1"
        }
    ]
}
```
<amplify-callout warning>

**これは推奨される建築ではありません** そして、Lambda関数を呼び出すためのエンドポイントとしてAWS AppSyncまたはAPIゲートウェイを利用することを強くお勧めします。

</amplify-callout>

 <amplify-callout>

 **Configuring Amazon Cognito Regional Endpoints:** To call regional service endpoints, your Amazon Cognito role needs to be configured with appropriate access for the related service. See [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html) for more details.

 </amplify-callout>

## モジュールインポート

<amplify-callout>

If you only need to use API, you can run: `npm install @aws-amplify/api` which will only install the API module. If you're using Cognito Federated Identity Pool to get AWS credentials, please also install `@aws-amplify/auth`. If you're using Graphql, please also install `@aws-amplify/pubsub`.

</amplify-callout>

次にコードで、API モジュールをインポートすることができます。

```javascript
import API, { graphqlOperation } from '@aws-amplify/api' ;

API.configure();
```

## APIリファレンス

API モジュールの完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/amplify-js/api/classes/apiclass.html) を参照してください。

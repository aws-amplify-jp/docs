## 新しいAppSync GraphQL API を作成します

新しい GraphQL API を作成するには、Amplify CLI `api` カテゴリを使用できます。

```bash
増幅して api を追加
```

プロンプトが表示されたら、 **GraphQL** を選択します。

CLI プロンプトは、GraphQL API のオプションをカスタマイズするのに役立ちます。指定されたオプションでは、次のことができます。
- API名を選択してください
- デフォルトの認証タイプを選択してください
- 認証タイプに API キーを使用する場合は、API キーの有効期限を選択してください。
- 追加の認証タイプを設定
- 競合検出を設定（ [DataStore](~/lib/datastore/getting-started.md) で使用）
- 既存のGraphQLスキーマを参照するか、GraphQLスキーマのボイラープレートを指定してください

GraphQL API オプションを設定した後、バックエンドを更新します。

```bash
push を増幅する
```

`aws-exports.js` の設定ファイルが新しいAPIの詳細で更新されます。

## 既存の AppSync GraphQL API を再利用します

自動設定の代わりに、アプリでAWS AppSyncの設定パラメータを手動で入力できます。 認証タイプのオプションは `API_KEY`、 `AWS_IAM`、 `AMAZON_COGNITO_USER_POOLS` および `OPENID_CONNECT` です。

### API_KEY の使用

```javascript
const myAppConfig = {
    // ...
    'aws_appsync_graphqlEndpoint': 'https://xxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': 'da2-xxxxxxxxxxxxxxxxxxxxxxxxxx',
    // ...
}

Amplify.configure(myAppConfig);
```

### AWS_IAMの使用

```javascript
const myAppConfig = {
    // ...
    'aws_appsync_graphqlEndpoint': 'https://xxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'AWS_IAM',
    // ...
}

Amplify.configure(myAppConfig);
```

### AMAZON_COGNITO_USER_POOLS の使用

```javascript
const myAppConfig = {
    // ...
    'aws_appsync_graphqlEndpoint': 'https://xxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS', // You have configured Auth with Amazon Cognito User Pool ID and Web Client Id
    // ...
}

Amplify.configure(myAppConfig);
```

### OPENID_CONNECTの使用

```javascript
const myAppConfig = {
    // ...
    'aws_appsync_graphqlEndpoint': 'https://xxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'OPENID_CONNECT', // Before calling API.graphql(...) is required to do Auth.federatedSignIn(...) check authentication guide for details.
    // ...
}

Amplify.configure(myAppConfig);
```

## AppSync 以外のGraphQL サーバーの使用

AppSync 以外の GraphQL API にアプリケーションでアクセスするには、アプリの設定でエンドポイント URL を設定する必要があります。 セットアップに次の行を追加します。

```js
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

// Considering you have an existing aws-exports.js configuration file 
Amplify.configure(awsconfig);

// Configure a custom GraphQL endpoint
Amplify.configure({
  API: {
    graphql_endpoint: 'https:/www.example.com/my-graphql-endpoint'
  }
});
```

### AppSync 以外の GraphQL API のカスタム要求ヘッダーを設定します

AppSync 以外の GraphQL エンドポイントを使用する場合は、承認のためにリクエストヘッダーを設定する必要がある場合があります。 これは `graphql_headers` 関数を設定に渡すことで行います。

```js
Amplify.configure({
  API: {
    graphql_headers: async () => ({
        'My-Custom-Header': 'my value'
    })
  }
});
```

### IAMによる署名リクエスト

AWS Amplifyは、AWS APIゲートウェイ経由で処理されるGraphQLリクエストに対して、AWS Identity Access Management(IAM)で自動的にリクエストに署名する機能を提供します。 `graphql_endpoint_iam_region` パラメータを GraphQL 設定文に追加し、署名を有効にします。

```js
Amplify.configure({
  API: {
    graphql_endpoint: 'https://www.example.com/my-graphql-endpoint',
    graphql_endpoint_iam_region: 'my_graphql_apigateway_region'
  }
});
```

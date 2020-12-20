## AmplifyGraphQLクライアントの使用

各 AppSync API は、 __デフォルトの__ 認証モードで設定されます。

AWS AppSync は [複数の認証モードを 1 つの API でサポートしています](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#using-additional-authorization-modes) 。これにより、追加の認証モードを追加できます。

In order to use this feature with the Amplify GraphQL Client the `API.graphql({...})` function accepts an optional parameter called `authMode`, its value will be one of the supported auth modes:

- `API キー`
- `AWS_IAM`
- `接続を開きます。`
- `AMAZON_COGNITO_USER_POOLS`

<br />

これは認証モードとして `AWS_IAM` を使用した例です。

```javascript
// Creating a post is restricted to IAM 
const createdTodo = await API.graphql({
  query: queries.createTodo,
  variables: {input: todoDetails},
  authMode: 'AWS_IAM'
});
```

Previous examples uses `graphqlOperation` function. That function only creates an object with two attributes `query` and `variables`. In order to use `authMode` you need to pass this object as is mentioned on the previous example.

<amplify-callout>

When using __AWS_IAM__ for public API access, unauthenticated logins must be enabled. To enable unauthenticated logins, run `amplify update auth` from the command line and choose __Walkthrough all the auth configurations__.

</amplify-callout>

## AWS AppSync SDK の使用

For client authorization, AppSync supports API Keys, Amazon IAM credentials (we recommend using Amazon Cognito Identity Pools for this option), Amazon Cognito User Pools, and 3rd party OIDC providers. This is inferred from the `aws-exports.js` when you call `.awsConfiguration()` on the `AWSAppSyncClient` builder.

### API キー

APIキーは、AppSyncでアプリケーションを設定してプロトタイプを作成する最も簡単な方法です。 アプリケーションが完全に公開されている場合にも良いオプションです。 アプリケーションがAppSync以外のAWSサービス(S3など)とやり取りする必要がある場合 Cognito Identity Poolsが提供するIAM認証情報を使用する必要があります。これは「ゲスト」アクセスもサポートしています。 詳細については、認証セクションを参照してください。API キーを使用して `AWSAppSyncClient` を設定する方法を次のコードスニペットに示します。

```js
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
});
```


### Cognitoユーザープール

Amazon Cognito User Pools is the most common service to use with AppSync when adding user Sign-Up and Sign-In to your application. If your application needs to interact with other AWS services besides AppSync, such as S3, you will need to use IAM credentials with Cognito Identity Pools. The Amplify CLI can automatically configure this for you when running `amplify add auth` and can also automatically federate User Pools with Identity Pools. This allows you to have both User Pool credentials for AppSync and AWS credentials for S3. You can then use the Auth category for automatic credentials refresh as [outlined in the authentication section](~/lib/auth/getting-started.md). Following code snippet shows how to configure `AWSAppSyncClient` using Cognito User Pools:

```js
import Amplify, { Auth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
});
```

> **メモ** React では、amplifyのwithAuthenticatorを使用できます。

```js
import { withAuthenticator } from 'aws-amplify-react';

export default withAuthenticator(App);
```

### IAM

When using AWS IAM in a mobile application you should leverage Amazon Cognito Identity Pools. The Amplify CLI will automatically configure this for you when running `amplify add auth`. You can then use the Auth category for automatic credentials refresh as [outlined in the authentication section](~/lib/auth/getting-started.md). Following code snippet shows how to configure `AWSAppSyncClient` using AWS IAM:

```js
import Amplify, { Auth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: () => Auth.currentCredentials(),
  },
});
```

> **メモ** React では、amplifyのwithAuthenticatorを使用できます。

```js
import { withAuthenticator } from 'aws-amplify-react';

export default withAuthenticator(App);
```

### OIDC

サードパーティ製のOIDCプロバイダーを使用している場合は、トークンの更新の詳細を管理する必要があります。 以下のコードスニペットは、OIDCを使用して `AWSAppSyncClient` を設定する方法を示しています:


```js
import Amplify, { Auth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const getOIDCToken = async () => await 'token'; // Should be an async function that handles token refresh

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.OPENID_CONNECT,
    jwtToken: () => getOIDCToken(),
  },
});
```

## 新しい認証リソースを作成

これまでに、API カテゴリなど、舞台裏で Authを使用するAmplifyカテゴリを有効にしている場合は、すでに認証設定を持っている可能性があります。 そのような場合は、設定を編集するために、 `増幅する auth update` コマンドを実行してください。 最初から起動するには、プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して認証を追加
```

CLI プロンプトは、アプリの認証フローをカスタマイズするのに役立ちます。指定されたオプションを使用すると、次のことができます。
- サインイン/登録フローを編集する
- 多要素認証のための電子メールとSMSメッセージを編集する
- ユーザーの属性をカスタマイズします。例：名前、電子メール
- Facebook、Twitter、Google、Amazonなどのサードパーティのソーシャルプロバイダを有効にする

ソーシャルプロバイダと連携したい場合は、 [最初に設定する必要があります。](~/lib/auth/social.md#social-providers-and-federation)

認証オプションを設定した後、バックエンドを更新します:

```bash
push を増幅する
```

`aws-exports.js` と呼ばれる設定ファイルが、 `./src` などの設定されたソースディレクトリにコピーされます。

> Amplify CLI バージョン 1.6 で認証リソースが作成された場合。 以下では、AWS LambdaでNode.jsランタイムの問題を回避するために、プロジェクトを手動で更新する必要があります。 [詳しくはこちら](~/cli/migration/lambda-node-version-update.md)

### アプリケーションの設定

Amplifyを `yarn` または `npm` でアプリに追加します。

```bash
yarn add aws-amplify
```

React Native アプリケーションの場合、 `aws-amplify-react-native` とリンクをインストールしてください：

```bash
yarn add aws-amplify aws-anplify-react-native
react-native link amazon-cognito-identity-js # ExpoやExpoKitを使用する場合は実行しないでください。
```

If you are using React Native 0.60.0+, iOS and using Auth methods e.g. `Auth.signIn`, `Auth.signUp`, etc., please run the following commands instead of linking:

```
yarn add amazon-cognito-identity-js
cd ios
pod install --repo-update
```

アプリのエントリポイント、すなわちApp.jsで、設定ファイルをインポートしてロードします。

```javascript
import Amplify, { Auth } from 'aws-amply';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```

## 既存の認証リソースを再利用する

AWSから既存の認証リソースを再利用したい場合(例: Amazon Cognito UserPool または Identity Pool), upd `Amplify.configure()` メソッドを以下の情報で更新する.

```javascript
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

        // REQUIRED - Amazon Cognito Region
        region: 'XX-XXXX-X',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: 'XX-XXXX-X',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'XX-XXXX-X_abcd1234',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
            path: '/',
        // OPTIONAL - Cookie expiration in days
            expires: 365,
        // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            sameSite: "strict" | "lax",
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: true
        },

        // OPTIONAL - customized storage object
        storage: MyStorage,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        clientMetadata: { myCustomKey: 'myCustomValue' },

         // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: 'your_cognito_domain',
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'http://localhost:3000/',
            redirectSignOut: 'http://localhost:3000/',
            responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
});

// You can get the current config object
const currentConfig = Auth.configure();
```

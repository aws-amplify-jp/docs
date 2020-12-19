次に追加する機能は認証です。

## Amplifyで認証

The Amplify Framework uses [Amazon Cognito](https://aws.amazon.com/cognito/) as the main authentication provider. Amazon Cognito is a robust user directory service that handles user registration, authentication, account recovery & other operations. In this tutorial, you'll learn how to add authentication to your application using Amazon Cognito and username/password login.

## 認証サービスを作成

```bash
amplify add auth

? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Username
? Do you want to configure advanced settings?  No, I am done.
```

サービスをデプロイするには、 `push` コマンドを実行します。

```bash
push を増幅する
```

これで認証サービスがデプロイされ、使用を開始できます。 プロジェクトにデプロイされたサービスをいつでも表示するには、次のコマンドを実行してAmplify Consoleに移動します。

```bash
増幅コンソール
```

## ログインUIを作成

Now that we have our authentication service deployed to AWS, it's time to add authentication to our React app. Creating the login flow can be quite difficult and time consuming to get right. Luckily Amplify Framework has an authentication UI component we can use that will provide the entire authentication flow for us, using our configuration specified in our __aws-exports.js__ file.

__src/App.js__ を開き、以下の変更を行います。

1. `withAuthenticator` コンポーネントをインポートします:

```javascript
import { withAuthenticator } from '@aws-amplify/ui-react'
```

2. メインコンポーネントをラップする `withAuthenticator` にデフォルトのエクスポートを変更します:

```javascript
export default withAuthenticator(App)
```

アプリを実行すると、アプリを保護する新しい認証フローが表示されます。

```bash
npm start
```

これで、ユーザーがサインアップしてサインインできるようにする認証フローでアプリのロードが表示されるはずです。

この例では、 Amplify React UI ライブラリと `withAuthenticator` コンポーネントを使用して実際の認証フローを素早く実行しました。

また、このコンポーネントをカスタマイズして、項目の追加や削除、スタイリングの更新などを行うこともできます。

`withAuthenticator` に加えて、 `Auth` クラスを使用してカスタム認証フローを構築できます。

`Auth` has over 30 methods including `signUp`, `signIn`, `forgotPassword`, and `signOut` that allow you full control over all aspects of the user authentication flow. Check out the complete API [here](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html)

次のセクションでは、Amplifyコンソールでアプリをホストします。 世界中で利用可能なCDN、原子配置、簡単なカスタムドメイン、およびCI / CDを備えたホスティングサービス。

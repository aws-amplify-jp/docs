次に追加する機能は認証です。

## Amplifyで認証

The Amplify Framework uses [Amazon Cognito](https://aws.amazon.com/cognito/) as the main authentication provider. Amazon Cognito is a robust user directory service that handles user registration, authentication, account recovery & other operations. In this tutorial, you'll learn how to add authentication to your application using Amazon Cognito and username/password login.

## 認証サービスを作成

```bash
増幅して認証を追加
```

```console
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

最初に、 `aws-amplify-react-native` ライブラリと、他の必要な依存関係をインストールします。 このステップはExpoまたはReact Native CLIを使用しているかによって異なります。

<inline-fragment src="~/start/getting-started/fragments/reactnative/getting-started-steps-ui.md"></inline-fragment>

__App.js__ を開き、次の変更を行います。

1. `withAuthenticator` コンポーネントをインポートします:

```javascript
import { withAuthenticator } from 'aws-amplify-react-native'
```

2. メインコンポーネントをラップする `withAuthenticator` にデフォルトのエクスポートを変更します:

```javascript
export default withAuthenticator(App)
```

アプリを実行すると、アプリを保護する新しい認証フローが表示されます。

<amplify-block-switcher> <amplify-block name="Expo">

```bash
エキスポスタート
```

</amplify-block> <amplify-block name="React Native CLI">

iOS で実行するには、次のコマンドを実行します。
```bash
npx react-native run-ios
```

Android で実行するには、次のコマンドを実行します。
```bash
npx react-native run-android
```

</amplify-block> </amplify-block-switcher>

これで、ユーザーがサインアップしてサインインできるようにする認証フローでアプリのロードが表示されるはずです。

この例では、 React Native Amplify UIライブラリと `withAuthenticator` コンポーネントを使用して実際の認証フローを素早く実行しました。

また、このコンポーネントをカスタマイズして、項目の追加や削除、スタイリングの更新などを行うこともできます。

`withAuthenticator` に加えて、 `Auth` クラスを使用してカスタム認証フローを構築できます。

`Auth` has over 30 methods including `signUp`, `signIn`, `forgotPassword`, and `signOut` that allow you full control over all aspects of the user authentication flow. Check out the complete API [here](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html)

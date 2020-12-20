> 前提条件: [](~/cli/start/install.md) Amplify CLI をインストールして構成する

## Amplifyで認証

The Amplify Framework uses [Amazon Cognito](https://aws.amazon.com/cognito/) as the main authentication provider. Amazon Cognito is a robust user directory service that handles user registration, authentication, account recovery & other operations. In this tutorial, you'll learn how to add authentication to your application using Amazon Cognito and username/password login.

## 認証サービスを作成
最初から起動するには、プロジェクトのrootフォルダで次のコマンドを実行します。

> AWSから既存の認証リソースを再利用したい場合(例えば、Amazon Cognito UserPoolやIdentity Poolなど)は、 [このセクション](~/lib/auth/start.md#re-use-existing-authentication-resource) を参照してください。

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

## アプリケーションの設定

アプリにAmplifyを追加:

<inline-fragment src="~/lib/auth/fragments/js/getting-started-steps-basic-auth.md"></inline-fragment>

アプリのエントリポイント(例: __App.js__, __index.js__, または __main.js__)で、設定ファイルをインポートしてロードします。

```javascript
import Amplify, { Auth } from 'aws-amply';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```

## サインアップ、サインイン、サインアウトを有効にする

認証機能をアプリケーションに追加するには2つの方法があります。

1. [ビルド済みの UI コンポーネントを使用する](#option-1-use-pre-built-ui-components)

2. [認証APIを手動で呼び出す](#option-2-call-authentication-apis-manually)

## オプション 1: ビルド済みの UI コンポーネントを使用する

Creating the login flow can be quite difficult and time consuming to get right. Amplify Framework has authentication UI components you can use that will provide the entire authentication flow for you, using your configuration specified in your __aws-exports.js__ file.

AmplifyはReact、Vue、Angular、React Native向けにUIコンポーネントをあらかじめ構築しています。

<amplify-block-switcher> <amplify-block name="React">

まず、 `@aws-amplify/ui-react` ライブラリと `aws-amplify` をインストールします。

```sh
npm install aws-amplify @aws-amplify/ui-react
```

次に、 __src/App.js__ を開き、 `withAuthenticator` コンポーネントを追加します。

**withAuthenticator**

<inline-fragment src="~/ui/auth/fragments/react/withauthenticator.md"></inline-fragment>

</amplify-block> <amplify-block name="Vue">

まず、 `@aws-amplify/ui-vue` ライブラリと `aws-amplify` をインストールします。

```bash
npm install aws-amplify @aws-amplify/ui-vue
```

__src/main.js__ を開き、最後にインポートした以下を追加してください。

```js
import '@aws-amplify/ui-vue';
```

次に、 __src/App.js__ を開き、 `amplify-authenticator` コンポーネントを追加します。

**anplify-authentication**

The `amplify-authenticator` component offers a simple way to add authentication flows into your app. This component encapsulates an authentication workflow in the framework of your choice and is backed by the cloud resources set up in your Auth cloud resources. You’ll also notice the `amplify-sign-out` component. This is an optional component if you’d like to render a sign out button.


```html
<template>
  <amplify-authenticator>
    <div>
      My App
      <amplify-sign-out></amplify-sign-out>
    </div>
  </amplify-authenticator>
</template>
```

</amplify-block> <amplify-block name="Angular">

まず、 `@aws-amplify/ui-angular` ライブラリと `aws-amplify` をインストールします。

```bash
npm install aws-amplify @aws-amplify/ui-angular
```

Now open __app.module.ts__ and add the Amplify imports and configuration:

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule /* Add Amplify module */, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

次に、 __app.component.html__ を開き、 `amplify-authenticator` コンポーネントを追加します。

**anplify-authentication**

The `amplify-authenticator` component offers a simple way to add authentication flows into your app. This component encapsulates an authentication workflow in the framework of your choice and is backed by the cloud resources set up in your Auth cloud resources. You’ll also notice the `amplify-sign-out` component. This is an optional component if you’d like to render a sign out button.


```html
<template>
  <amplify-authenticator>
    <div>
      My App
      <amplify-sign-out></amplify-sign-out>
    </div>
  </amplify-authenticator>
</template>
```

</amplify-block> <amplify-block name="React Native">

まず、 `aws-amplify-react-native` ライブラリと他の必要な依存関係をインストールします。 このステップはExpoまたはReact Native CLIを使用しているかによって異なります。

<inline-fragment src="~/start/getting-started/fragments/reactnative/getting-started-steps-ui.md"></inline-fragment>

**フロントエンドと統合**

__App.js__ を開き、次の変更を行います。

1. `withAuthenticator` コンポーネントをインポートします:

```javascript
import { withAuthenticator } from 'aws-amplify-react-native'
```

2. メインコンポーネントをラップする `withAuthenticator` にデフォルトのエクスポートを変更します:

```javascript
export default withAuthenticator(App)
```
</amplify-block> </amplify-block-switcher>

## オプション2：手動で認証APIを呼び出す

Follow the instructions in the [Sign in, Sign up and Sign out](~/lib/auth/emailpassword.md) to learn about how to integrate these authentication flows in your application with the Auth APIs.

## Summary

Amplifyを使用した認証フローを実装するには、AmplifyUIライブラリを使用するか、 `Auth` クラスで認証メソッドを直接呼び出すことができます。

`Auth` has over 30 methods including [`signUp`](~/lib/auth/emailpassword.md#sign-up), [`signIn`](~/lib/auth/emailpassword.md#sign-in), [`forgotPassword`](~/lib/auth/manageusers.md#forgot-password), and [`signOut`](~/lib/auth/emailpassword.md#sign-out) that allow you full control over all aspects of the user authentication flow.

完全な API [はこちら](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html) をご覧ください。

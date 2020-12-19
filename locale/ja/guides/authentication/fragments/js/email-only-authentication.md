ユーザー名を作成する代わりに、多くのアプリは認証のためにユーザーのメールアドレスを使用します。 このガイドでは、Amplify CLI とライブラリを使用してこの機能を有効にする方法を学びます。

## はじめに - サービスの作成

`メールアドレス` を主認証プロパティとして指定する認証を有効にするには、以下の手順に従ってください。

```sh
amplify add auth

? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Email
? Do you want to configure advanced settings? No, I am done.
```

次に、認証サービスをデプロイします。

```sh
push を増幅する
```

## クライアント側の統合

サービスがデプロイされたので、クライアントアプリケーションが認証サービスとやり取りするように構成します。 Amplify JavaScriptライブラリの `Auth` クラスとUIコンポーネントの両方を使用してサービスとやり取りする方法を学びます。

### UI コンポーネント

UI コンポーネントでは、メールアドレスをユーザーのサインアップとサインインプロパティとして使用するように指定する必要があります。 これを行うには、 `usernameAlias` に `email` を設定します。

<amplify-block-switcher>

<amplify-block name="React">

```js
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';

<AmplifyAuthenticator usernameAlias="email" />
```
</amplify-block>

<amplify-block name="Angular">

```js
<amplify-authenticator usernameAlias="email"></amplify-authenticator>
```

</amplify-block>

<amplify-block name="Vue">

```js
<amplify-authenticator username-alias="email"></amplify-authenticator>
```

</amplify-block>

<amplify-block name="React Native">

```js
import { withAuthenticator, Authenticator } from 'aws-amplify-react';

// When using Authenticator
class App {
  // ...

  render() {
    return (
      <Authenticator usernameAttributes='email'/>
    );
  }
}

export default App;

// When using withAuthenticator
class App2 {
  // ...
}

export default withAuthenticator(App2, { usernameAttributes: 'email' });
```

</amplify-block>

</amplify-block-switcher>

### 認証APIから直接通話

`認証` カテゴリを使用して直接認証サービスを呼び出すこともできます。

**サインアップ**

```js
import { Auth } from 'aws-amplify';

await Auth.signUp({
  username: "youremail@yourdomain.com",
  password: "your-secure-password",
  attributes: {
    email: "youremail@yourdomain.com"
  }
});
```

**サインアップ確認**

```js
import { Auth } from 'aws-amplify';

await Auth.confirmSignUp("youremail@yourdomain.com", "123456");
```

**サインイン中**

```js
import { Auth } from 'aws-amplify';

await Auth.signIn("youremail@yourdomain.com", "your-secure-password");
```
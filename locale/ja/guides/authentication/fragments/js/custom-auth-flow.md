[Amplify UI Component library](~/ui/auth/authenticator.md) を使用すると、ほんの数行のコードでエンドツーエンドの認証フローを足場化できます。 しかし、通常、ゼロからカスタム認証フローを作成する必要があります。

このガイドでは、 `Auth` クラスを使用してユーザー ID を管理する方法と、 `Hub` ユーティリティを使用して認証イベントをリッスンする方法を学びます。

## 認証クラス

[Auth class](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html) は、アプリケーションでユーザー ID を管理するための 30 以上のメソッドを持つ Amplify JavaScript ライブラリによって提供される API です。

このガイドでは、以下の方法で作業します。

- [signUp](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#signup) - 新規ユーザーアカウントを作成
- [confirm SignUp](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#confirmsignup) - MFA(多要素認証)フローの認証コードを持つユーザーを確認する
- [signIn](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#signin) - ユーザにサインインする
- [currentAuthenticatedUser](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#currentauthenticateduser) - ユーザがサインインしている場合、現在サインインしているユーザに関するメタデータを返します。 ログインしていないユーザは、null を返します。

## ハブ

The [Hub](~/lib/utilities/hub.md) utility is a local eventing system used to share data between modules and components in your app. In this guide you will learn how to listen to authentication events using the `Hub` utility:

## コンセプト

ユーザー認証フローを構築する場合、管理しなければならない状態がいくつかあります:

1. __フォームの状態__ - フォームの状態は、ユーザーにどのフォームを表示すべきかを管理します。 彼らは新しいユーザーですか? どのように彼らにサインアップフォームを表示できますか? 彼らはサインアップ中ですか? あなたはMFAフローの確認サインアップフォームを表示する必要がありますか?
2. __フォーム入力状態__ - フォーム入力状態は、ユーザーが入力している実際のフォームフィールドの値です。 たとえば、ユーザーがメールアドレス、パスワード、電話番号を入力できるフォームを持つことができます。 フォーム入力の状態はこれらの値を保持し、API リクエストで送信することができます。
3. __ルーティング状態__ - ルーティング状態は、ユーザが閲覧しているURL、ルーティング、またはページを決定します。 何度も、これはユーザーが特定のルートまたはページを表示できるかどうかを決定します。 実装は、構築しているアプリの種類と、使用しているフレームワーク(もしあれば)によって大きく異なります。
4. __User state__ - ユーザの状態は現在のユーザ(存在する場合)である。 このユーザーの状態を使用する ルーティング状態を決定し、ユーザーがサインインしているか、ユーザーのサインインIDに基づいて、より細かい制御を有効にできます。

<!-- This guide will cover strategies for handling __form state__, __form input state__, and __user state__ but will not be covering routing state as this is very dependent on the framework. -->

## カスタム認証フローの実装

Using a combination of application state and the Amplify APIs you can easily manage the authentication flow of your app. Let's have a look at how we could achieve this with __pseudocode__:

```javascript
/* Import the Amplify Auth API */
import { Auth } from 'aws-amplify';

/* Create the form state and form input state */
let formState = "signUp";
let formInputState = { username: '', password: '', email: '', verificationCode: '' };

/* onChange handler for form inputs */
function onChange(e) {
  formInputState = { ...formInputState, [e.target.name]: e.target.value };
}

/* Sign up function */
async function signUp() {
  try {
    await Auth.signUp({
      username: formInputState.username,
      password: formInputState.password,
      attributes: {
        email: formInputState.email
      }});
    /* Once the user successfully signs up, update form state to show the confirm sign up form for MFA */
    formState = "confirmSignUp";
  } catch (err) { console.log({ err }); }
}

/* Confirm sign up function for MFA */
async function confirmSignUp() {
  try {
    await Auth.confirmSignUp(formInputState.username, formInputState.verificationCode);
    /* Once the user successfully confirms their account, update form state to show the sign in form*/
    formState = "signIn";
  } catch (err) { console.log({ err }); }
}

/* Sign in function */
async function signIn() {
  try {
    await Auth.signIn(formInputState.username, formInputState.password);
    /* Once the user successfully signs in, update the form state to show the signed in state */
    formState = "signedIn";
  } catch (err) { console.log({ err }); }
}


/* In the UI of the app, render forms based on form state */
/* If the form state is "signUp", show the sign up form */
if (formState === "signUp") {
  return (
    <div>
      <input
        name="username"
        onChange={onChange}
      />
      <input
        name="password"
        type="password"
        onChange={onChange}
      />
      <input
        name="email"
        onChange={onChange}
      />
      <button onClick={signUp}>Sign Up</button>
    </div>
  )
}

/* If the form state is "confirmSignUp", show the confirm sign up form */
if (formState === "confirmSignUp") {
  return (
    <div>
      <input
        name="username"
        onChange={onChange}
      />
      <input
        name="verificationCode"
        onChange={onChange}
      />
      <button onClick={confirmSignUp}>Confirm Sign Up</button>
    </div>
  )
}

/* If the form state is "signIn", show the sign in form */
if (formState === "signIn") {
  return (
    <div>
      <input
        name="username"
        onChange={onChange}
      />
      <input
        name="password"
        onChange={onChange}
      />
      <button onClick={signIn}>Sign In</button>
    </div>
  )
}

/* If the form state is "signedIn", show the app */
if (formState === "signedIn") {
  return (
    <div>
      <h1>Welcome to my app!</h1>
    </div>
  )
}
```

## ユーザーの状態を管理する

ユーザーの状態を管理するには、 `Auth` クラスの `currentAuthenticatedUser` メソッドを呼び出すことができます。 この例では、アプリがロードされたときにサインアップフォームを表示または非表示にするメソッドを呼び出すことができます。

```javascript
async function onAppLoad() {
  const user = await Auth.currentAuthenticatedUser();
  console.log('user:', user)
  if (user) {
    formState = "signedIn";
  } else {
    formState = "signUp";
  }
}
```

## 認証イベントを聴いています

認証イベントをリッスンするには、 `Hub` ユーティリティを使用します。 アプリ内のどこからでもサインアウトイベントをリッスンする必要があるとしましょう。そのためには、次のコードを使用できます。

```javascript
Hub.listen('auth', (data) => {
  const event = data.payload.event;
  console.log('event:', event);
  if (event === "signOut") {
    console.log('user signed out...');
  }
});
```

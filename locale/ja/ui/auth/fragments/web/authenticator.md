<amplify-authenticator></amplify-authenticator>

## インストール

<docs-filter framework="react">

```
yarn add aws-amplify @aws-amplify/ui-react
```

</docs-filter> <docs-filter framework="angular">

```
yarn add aws-amplify @aws-amplify/ui-angular
```

</docs-filter> <docs-filter framework="ionic">

```
yarn add aws-amplify @aws-amplify/ui-angular
```

</docs-filter> <docs-filter framework="vue">

```
yarn add aws-amplify @aws-amplify/ui-vue
```

</docs-filter>

## 使用法

### 基本的な使用法

<docs-filter framework="react">

```jsx
import React from "react";
import Amplify from "aws-amplify";
import {AmplifyAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const App = () => (
  <AmplifyAuthenticator>
    <div>
      My App
      <AmplifySignOut />
    </div>
  </AmplifyAuthenticator>
);
```

</docs-filter>

### 推奨使用法

ほとんどの場合、Authenticatorのレンダリングとレイアウトを個別に管理する必要があります。

<docs-filter framework="react"> <inline-fragment src="~/ui/auth/fragments/react/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="angular"> <inline-fragment src="~/ui/auth/fragments/angular/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="ionic"> <inline-fragment src="~/ui/auth/fragments/ionic/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="vue"> <inline-fragment src="~/ui/auth/fragments/vue/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="angular">

_app.module.ts_

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```html
<amplify-authenticator>
  <div>
    自分のアプリ
    <amplify-sign-out></amplify-sign-out>
  </div>
</amplify-authenticator>
```

</docs-filter>

<docs-filter framework="ionic">

_app.module.ts_

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```html
<amplify-authenticator>
  <div>
    自分のアプリ
    <amplify-sign-out></amplify-sign-out>
  </div>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

_main.js_

```js
import Vue from "vue";
import App from "./App.vue";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

_App.vue_

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

</docs-filter>

<ui-component-props tag="amplify-authenticator" prop-type='attr' use-table-headers></ui-component-props>

<ui-component-props tag="amplify-authenticator" prop-type='slots' use-table-headers></ui-component-props>

<ui-component-props tag="amplify-authenticator" prop-type='css' use-table-headers></ui-component-props>

## カスタマイズ

### カスタムフォームフィールド

Authenticator サインインまたはサインアップコンポーネント内のフォームフィールドをカスタマイズしたい場合。 `formFields` プロパティを使用することで、これを行うことができます。

次の例では、カスタマイズされたサインアップフォームフィールドと [電子メールでの認証](#authenticate-with-email-or-phone-number) を使用した認証システムの使用を強調します。

<docs-filter framework="react">

<inline-fragment src="~/ui/auth/fragments/react/custom-form-fields.md"></inline-fragment>

</docs-filter> <docs-filter framework="angular">

<inline-fragment src="~/ui/auth/fragments/angular/custom-form-fields.md"></inline-fragment>

</docs-filter> <docs-filter framework="ionic">

<inline-fragment src="~/ui/auth/fragments/ionic/custom-form-fields.md"></inline-fragment>

</docs-filter> <docs-filter framework="vue">

<inline-fragment src="~/ui/auth/fragments/vue/custom-form-fields.md"></inline-fragment>

</docs-filter>

使用中のコンポーネントの例を次に示します。

<docs-component-playground component-name="AuthenticatorWithSlots"></docs-component-playground>

<amplify-callout warning>

If you are using the `usernameAlias` prop with custom `slots`, keep in mind that you must pass the `usernameAlias` prop value to both the Authenticator and custom slotted component since the slotted component overrides the configuration passed from the Authenticator.

</amplify-callout>

このカスタマイズの詳細については、 `amplify-form-field` [prop documentation](https://github.com/aws-amplify/amplify-js/tree/main/packages/amplify-ui-components/src/components/amplify-form-field#properties) および内部 [`FormFieldType` インターフェイス](https://github.com/aws-amplify/amplify-js/blob/main/packages/amplify-ui-components/src/components/amplify-auth-fields/amplify-auth-fields-interface.ts#L3) を参照してください。

### フォームフィールドを非表示

多くの場合、たとえば電話番号フィールドなど、デフォルトのフォームフィールドは必要ありません。 これを実装するには、表示したい項目の配列を定義することができます (オプションの項目カスタマイズとともに)。

この例では、認証されたユーザーの状態に基づいてAuthenticatorコンポーネントを表示および非表示にするための認証状態を管理しています。 このコードは、更新時にユーザーのサインイン状態を保持します。

<docs-filter framework="react">

<inline-fragment src="~/ui/auth/fragments/react/hiding-form-fields.md"></inline-fragment>

</docs-filter>

<docs-filter framework="angular">

<inline-fragment src="~/ui/auth/fragments/angular/hiding-form-fields.md"></inline-fragment>

</docs-filter>

<docs-filter framework="ionic">

<inline-fragment src="~/ui/auth/fragments/ionic/hiding-form-fields.md"></inline-fragment>

</docs-filter>

<docs-filter framework="vue">

<inline-fragment src="~/ui/auth/fragments/vue/hiding-form-fields.md"></inline-fragment>

</docs-filter>

### CSS でレイアウトを管理する

UI コンポーネントは Web コンポーネントを使用して実装されているので、CSS を使用して直接最上位の `amplify-authenticator` コンポーネントを制御することができます。

```css
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
}
```

## コンポーネント

### サインイン

<amplify-sign-in header-text="My Custom Sign In Text"></amplify-sign-in>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifySignIn
    headerText="My Custom Sign In Text"
    slot="sign-in"
  ></AmplifySignIn>
</AmplifyAuthenticator>
```

</docs-filter>

<docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-sign-in
    header-text="My Custom Sign In Text"
    slot="sign-in"
  ></amplify-sign-in>
</amplify-authenticator>
```

</docs-filter>

<docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-sign-in
    header-text="My Custom Sign In Text"
    slot="sign-in"
  ></amplify-sign-in>
</amplify-authenticator>
```

</docs-filter>

<docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-sign-in
    header-text="My Custom Sign In Text"
    slot="sign-in"
  ></amplify-sign-in>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-sign-in" prop-type="attr"></ui-component-props>

<ui-component-props tag="amplify-sign-in" prop-type="css"></ui-component-props>

<ui-component-props tag="amplify-sign-in" prop-type="slots"></ui-component-props>

### 新規登録

<amplify-sign-up header-text="My Custom Sign Up Text"></amplify-sign-up>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifySignUp
    headerText="My Custom Sign Up Text"
    slot="sign-up"
  ></AmplifySignUp>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-sign-up
    header-text="My Custom Sign Up Text"
    slot="sign-up"
  ></amplify-sign-up>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-sign-up
    header-text="My Custom Sign Up Text"
    slot="sign-up"
  ></amplify-sign-up>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-sign-up
    header-text="My Custom Sign Up Text"
    slot="sign-up"
  ></amplify-sign-up>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-sign-up" prop-type='attr'></ui-component-props>

<ui-component-props tag="amplify-sign-up" prop-type='css'></ui-component-props>

<ui-component-props tag="amplify-sign-up" prop-type='slots'></ui-component-props>

### サインアウト

<amplify-sign-out button-text="Custom Text"></amplify-sign-out>

**使用法**

<docs-filter framework="react">

```jsx
<div>
  自分のアプリ
  <AmplifySignOut buttonText="Custom Text"></AmplifySignOut>
</div>
```

</docs-filter> <docs-filter framework="angular">

```html
<div>
  自分のアプリ
  <amplify-sign-out button-text="Custom Text"></amplify-sign-out>
</div>
```

</docs-filter> <docs-filter framework="ionic">

```html
<div>
  自分のアプリ
  <amplify-sign-out button-text="Custom Text"></amplify-sign-out>
</div>
```

</docs-filter> <docs-filter framework="vue">

```html
<div>
  自分のアプリ
  <amplify-sign-out button-text="Custom Text"></amplify-sign-out>
</div>
```

</docs-filter>

<ui-component-props tag="amplify-sign-out" prop-type="attr"></ui-component-props>

<ui-component-props tag="amplify-sign-out" prop-type="css"></ui-component-props>

<ui-component-props tag="amplify-sign-out" prop-type="slots"></ui-component-props>

### ログイン確認

<amplify-confirm-sign-in header-text="My Custom Confirm Sign In Text"></amplify-confirm-sign-in>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyConfirmSignIn
    headerText="My Custom Confirm Sign In Text"
    slot="confirm-sign-in"
  ></AmplifyConfirmSignIn>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-confirm-sign-in
    header-text="My Custom Confirm Sign In Text"
    slot="confirm-sign-in"
  ></amplify-confirm-sign-in>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-confirm-sign-in
    header-text="My Custom Confirm Sign In Text"
    slot="confirm-sign-in"
  ></amplify-confirm-sign-in>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-confirm-sign-in
    header-text="My Custom Confirm Sign In Text"
    slot="confirm-sign-in"
  ></amplify-confirm-sign-in>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-confirm-sign-in" prop-type="attr"></ui-component-props>

### サインアップを確認

<amplify-confirm-sign-up header-text="My Custom Confirm Sign Up Text"></amplify-confirm-sign-up>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyConfirmSignUp
    headerText="My Custom Confirm Sign Up Text"
    slot="confirm-sign-up"
  ></AmplifyConfirmSignUp>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-confirm-sign-up
    header-text="My Custom Confirm Sign Up Text"
    slot="confirm-sign-up"
  ></amplify-confirm-sign-up>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-confirm-sign-up
    header-text="My Custom Confirm Sign Up Text"
    slot="confirm-sign-up"
  ></amplify-confirm-sign-up>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-confirm-sign-up
    header-text="My Custom Confirm Sign Up Text"
    slot="confirm-sign-up"
  ></amplify-confirm-sign-up>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-confirm-sign-up" prop-type="attr"></ui-component-props>

### パスワードを忘れた場合

<amplify-forgot-password header-text="My Custom Forgot Password Text"></amplify-forgot-password>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyForgotPassword
    headerText="My Custom Forgot Password Text"
    slot="forgot-password"
  ></AmplifyForgotPassword>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-forgot-password
    header-text="My Custom Forgot Password Text"
    slot="forgot-password"
  ></amplify-forgot-password>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-forgot-password
    header-text="My Custom Forgot Password Text"
    slot="forgot-password"
  ></amplify-forgot-password>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-forgot-password
    header-text="My Custom Forgot Password Text"
    slot="forgot-password"
  ></amplify-forgot-password>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-forgot-password" prop-type='attr'></ui-component-props>

### 新しいパスワードを必須にする

<amplify-require-new-password header-text="My Custom Require New Password Text"></amplify-require-new-password>

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyRequireNewPassword
    headerText="My Custom Require New Password Text"
    slot="require-new-password"
  ></AmplifyRequireNewPassword>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-require-new-password
    header-text="My Custom Require New Password Text"
    slot="require-new-password"
  ></amplify-require-new-password>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-require-new-password
    header-text="My Custom Require New Password Text"
    slot="require-new-password"
  ></amplify-require-new-password>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-require-new-password
    header-text="My Custom Require New Password Text"
    slot="require-new-password"
  ></amplify-require-new-password>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-require-new-password" prop-type="attr"></ui-component-props>

### TOTP Setup

**使用法**

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyTOTPSetup
    headerText="My Custom TOTP Setup Text"
    slot="totp-setup"
  ></AmplifyTOTPSetup>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-totp-setup
    header-text="My Custom TOTP Setup Text"
    slot="totp-setup"
  ></amplify-totp-setup>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-totp-setup
    header-text="My Custom TOTP Setup Text"
    slot="totp-setup"
  ></amplify-totp-setup>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-totp-setup
    header-text="My Custom TOTP Setup Text"
    slot="totp-setup"
  ></amplify-totp-setup>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-totp-setup" prop-type='attr'></ui-component-props>

### 連絡先を確認

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator>
  <AmplifyVerifyContact
    headerText="My Custom Verify Contact Text"
    slot="verify-contact"
  ></AmplifyVerifyContact>
</AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator>
  <amplify-verify-contact
    header-text="My Custom Verify Contact Text"
    slot="verify-contact"
  ></amplify-verify-contact>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator>
  <amplify-verify-contact
    header-text="My Custom Verify Contact Text"
    slot="verify-contact"
  ></amplify-verify-contact>
</amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator>
  <amplify-verify-contact
    header-text="My Custom Verify Contact Text"
    slot="verify-contact"
  ></amplify-verify-contact>
</amplify-authenticator>
```

</docs-filter>

<ui-component-props tag="amplify-verify-contact" prop-type="attr"></ui-component-props>

### Greetings

<amplify-greetings username="username"></amplify-greetings>

**使用法**

<docs-filter framework="react">

```jsx
import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import {AmplifyAuthenticator, AmplifyGreetings} from "@aws-amplify/ui-react";
import {AuthState, onAuthUIStateChange} from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const GreetingsApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <AmplifyGreetings username={user.username}></AmplifyGreetings>
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
};

export default GreetingsApp;
```

</docs-filter> <docs-filter framework="angular">

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.ts_ 内のコンテンツを以下に置き換えます:

```js
import { Component, ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    })
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
```

_app.component.html_ 内のコンテンツを以下に置き換えます:

```html
<amplify-authenticator *ngIf="authState !== 'signedin'"></amplify-authenticator>

<div *ngIf="authState === 'signedin' && user" class="App">
  <amplify-greetings [username]="user.username"></amplify-greetings>
</div>
```

</docs-filter> <docs-filter framework="ionic">

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.ts_ 内のコンテンツを以下に置き換えます:

```js
import { Component, ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    })
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
```

_app.component.html_ 内のコンテンツを以下に置き換えます:

```html
<amplify-authenticator *ngIf="authState !== 'signedin'"></amplify-authenticator>

<div *ngIf="authState === 'signedin' && user" class="App">
  <amplify-greetings [username]="user.username"></amplify-greetings>
</div>
```

</docs-filter> <docs-filter framework="vue">

_App.vue_

```html
<template>
  <div>
    <amplify-authenticator
      v-if="authState !== 'signedin'"
    ></amplify-authenticator>
    <div v-if="authState === 'signedin' && user">
      <amplify-greetings :username="user.username"></amplify-greetings>
    </div>
  </div>
</template>
```

```js
import {onAuthUIStateChange} from "@aws-amplify/ui-components";

export default {
  name: "AuthStateApp",
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
    };
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
};
```

</docs-filter>

<ui-component-props tag="amplify-greetings" prop-type="attr"></ui-component-props>

<ui-component-props tag="amplify-greetings" prop-type="css"></ui-component-props>

<ui-component-props tag="amplify-greetings" prop-type="slots"></ui-component-props>

<docs-filter framework="react">

### withAuthenticator

<inline-fragment src="~/ui/auth/fragments/react/withauthenticator.md"></inline-fragment>

[AmplifyAuthenticator プロパティ](#props-amplify-authenticator) のいずれかを渡すこともできます:

```jsx
export withAuthenticator(App, {initialAuthState: 'signup'});
```

</docs-filter>

## メソッド & 列挙数

### AuthState

`AuthState` は以下の値を持つ列挙型である。

```js
enum AuthState {
  SignUp = 'signup',
  SignOut = 'signout',
  SignIn = 'signin',
  Loading = 'loading',
  SignedOut = 'signedout',
  SignedIn = 'signedin',
  SigningUp = 'signingup',
  ConfirmSignUp = 'confirmSignUp',
  confirmingSignUpCustomFlow = 'confirmsignupcustomflow',
  ConfirmSignIn = 'confirmSignIn',
  confirmingSignInCustomFlow = 'confirmingsignincustomflow',
  VerifyingAttributes = 'verifyingattributes',
  ForgotPassword = 'forgotpassword',
  ResetPassword = 'resettingpassword',
  SettingMFA = 'settingMFA',
  TOTPSetup = 'TOTPSetup',
  CustomConfirmSignIn = 'customConfirmSignIn',
  VerifyContact = 'verifyContact'
}
```

**使用法**

```js
import {AuthState, onAuthUIStateChange} from "@aws-amplify/ui-components";

onAuthUIStateChange((nextAuthState, authData) => {
  if (nextAuthState === AuthState.SignedIn) {
    console.log("user successfully signed in!");
  }
});
```

### onAuthUIStateChange

`onAuthUIStateChange` は認証UIコンポーネントの状態が変更されるたびに発行される関数です。

**使用法**

```js
import {AuthState, onAuthUIStateChange} from "@aws-amplify/ui-components";

onAuthUIStateChange((nextAuthState, authData) => {
  if (nextAuthState === AuthState.SignedIn) {
    console.log("user successfully signed in!");
    console.log("user data: ", authData);
  }
  if (!authData) {
    console.log("user is not signed in...");
  }
});
```

## ユースケース

### 認証状態と条件付きアプリのレンダリングを管理

<docs-filter framework="react"> <inline-fragment src="~/ui/auth/fragments/react/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="angular"> <inline-fragment src="~/ui/auth/fragments/angular/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="ionic"> <inline-fragment src="~/ui/auth/fragments/ionic/auth-state-management.md"></inline-fragment> </docs-filter>

<docs-filter framework="vue"> <inline-fragment src="~/ui/auth/fragments/vue/auth-state-management.md"></inline-fragment> </docs-filter>

### メールアドレスまたは電話番号で認証

`anplify-authenticator` コンポーネントには、デフォルトの `ユーザー名` ではなく `email` または `phone_number` でサインイン/サインアップする機能があります。

To achieve this, you first need to setup the userpool to allow email or phone number as the username [using the cli workflow](~/cli/auth/overview.md#configuring-auth-without-social-providers) or through the [Cognito Console](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases-settings-option-2). To reflect this in the `amplify-authenticator` component, you can use the `usernameAlias` property. It can take one of the three values - `email`, `phone_number` or `username`. Default is set to `username`.

<docs-filter framework="react">

```jsx
<AmplifyAuthenticator usernameAlias="email"></AmplifyAuthenticator>
```

</docs-filter> <docs-filter framework="angular">

```html
<amplify-authenticator username-alias="email"></amplify-authenticator>
```

</docs-filter> <docs-filter framework="ionic">

```html
<amplify-authenticator username-alias="email"></amplify-authenticator>
```

</docs-filter> <docs-filter framework="vue">

```html
<amplify-authenticator username-alias="email"></amplify-authenticator>
```

</docs-filter>

## 移行

`aws-amplify-<framework>` ライブラリを最新の `@aws-amplify/ui- に使用してから移行するには、<framework>` ライブラリを以下の手順で使用します。

### インストール

<docs-filter framework="react">

```diff
- yarn add aws-amplify-react
+ yarn add @aws-amplify/ui-react
```

</docs-filter> <docs-filter framework="angular">

```diff
- yarn add aws-amplify-angular
+ yarn add @aws-amplify/ui-angular
```

</docs-filter> <docs-filter framework="ionic">

```diff
- yarn add aws-amplify-angular
+ yarn add @aws-amplify/ui-angular
```

</docs-filter> <docs-filter framework="vue">

```diff
- yarn add aws-amplify-vue
+ yarn add @aws-amplify/ui-vue
```

</docs-filter>

### 使用法

<docs-filter framework="react">

```diff
- import { Authenticator } from 'aws-amplify-react';
+ import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const App = () => (

+ <AmplifyAuthenticator>
- <Authenticator>
    <div>
      My App
+     <AmplifySignOut />
    </div>
+ </AmplifyAuthenticator>;
- </Authenticator>
);
```

`withAuthenticator` を使用している場合:

```diff
- import { withAuthenticator } from 'aws-amplify-react';
+ import { withAuthenticator } from '@aws-amplify/ui-react';
```

```jsx
export default withAuthenticator(App);
```

<docs-filter framework="react">

### withAuthenticatorの変更を中断しています

<amplify-callout warning>

We have deprecated some of the properties passed into `withAuthenticator`. If you were providing additional options to `withAuthenticator` (e.g. `includeGreetings`, `authenticatorComponents`, `federated`, `theme`), these have changed. Refer to the updated list of [Properties here](~/ui/auth/authenticator.md/q/framework/react#props-amplify-authenticator).

</amplify-callout>

The previous `withAuthenticator` component would render a Greetings and Sign Out button at the top of your app after logging in. If you would like to add a Greetings or Sign Out button to your app you can add the [`AmplifyGreetings`](#greetings) or [`AmplifySignOut`](#sign-out) component to your app. Visit the [`withAuthenticator` example](#withauthenticator) above to see this.

</docs-filter>

</docs-filter> <docs-filter framework="angular">

_app.module.ts_

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
- import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
+ import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
- imports: [AmplifyAngularModule, BrowserModule],
+ imports: [AmplifyUIAngularModule, BrowserModule],
- providers: [AmplifyService],
+ providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

</docs-filter> <docs-filter framework="ionic">

_app.module.ts_

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
- import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
+ import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
- imports: [AmplifyAngularModule, BrowserModule],
+ imports: [AmplifyUIAngularModule, BrowserModule],
- providers: [AmplifyService],
+ providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

</docs-filter> <docs-filter framework="vue">

_main.ts_

```diff
import Vue from 'vue';
import App from "./App.vue";
- import Amplify, * as AmplifyModules from 'aws-amplify'
- import { AmplifyPlugin } from 'aws-amplify-vue'
+ import '@aws-amplify/ui-vue';
+ import Amplify from 'aws-amplify';
+ import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

new Vue({
  render: h => h(App),
}).$mount('#app');
```

</docs-filter>

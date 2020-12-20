Authenticatorコンポーネントはアプリケーションの基本的なログイン/ログアウト機能、および新規ユーザー登録とユーザーログインの確認ステップを提供します。 以下のコンポーネントを子要素として使用します。

* SignIn
* ログイン確認
* サインアップ
* サインアップを確認
* ForgotPassword


使用法: `<amplify-authenticator></amplify-authenticator>`

設定:

```
<amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
```

| 属性                                                        | タイプ    |
| --------------------------------------------------------- | ------ |
| [confirmSignInConfig](#confirmsignin)                     | オブジェクト |
| [SignUpConfig の確認](#confirmsignup)                        | オブジェクト |
| [forgotPasswordConfig](#forgotpassword)                   | オブジェクト |
| [signInConfig](#signinconfig)                             | オブジェクト |
| [signUpConfig](#signupconfig)                             | オブジェクト |
| [usernameAttributes](#Sign-up/in-with-email/phone-number) | 文字列    |

&ast; 上記の属性は、Authenticator 内にネストされたコンポーネントの config オブジェクトを参照します。詳細については個々のコンポーネントを参照してください。


イベント: なし

### SignIn

SignInコンポーネントはユーザにサインイン機能を提供します。

使用法: `<amplify-sign-in></amplify-sign-in>`

設定:
```
<amplify-sign-in v-bind:signInConfig="signInConfig"></amplify-sign-in>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/sign-in-attributes.md"></inline-fragment>

イベント:

* `AmplifyEventBus.$emit('authState', 'signedIn')`: ユーザーがMFAチャレンジに回答せずに正常にサインインしたときに発生します。
* `AmplifyEventBus.$emit('authState', 'confirmSignIn')`: ユーザーが正常に資格情報を提供したときに発生しますが、回答とMFAチャレンジが求められます。
* `AmplifyEventBus.$emit('authState', 'forged Password')`: ユーザが「パスワードを忘れた」ボタンをクリックしたときに発生します。
* `AmplifyEventBus.$emit('authState', 'signUp')`: ユーザが「サインアップに戻る」をクリックしたときに発生します。

### ログイン確認

ConfirmSignInコンポーネントは、ユーザーにMFAチャレンジに答える機能を提供します。

使用法: `<amplify-confirm-sign-in></amplify-confirm-sign-in>`

設定:
```
<amplify-confirm-sign-in v-bind:confirmSignInConfig="confirmSignInConfig"></amplify-confirm-sign-in>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/confirm-sign-in-attributes.md"></inline-fragment>


イベント:

* `AmplifyEventBus.$emit('authState', 'signedIn')`: ユーザーがMFAチャレンジに正常に回答したときに発生します。
* `AmplifyEventBus.$emit('authState', 'signIn');`: ユーザが「サインインに戻る」をクリックしたときに発生します。


### サインアップ

サインアップコンポーネントはユーザーにサインアップする機能を提供します。

使用法: `<amplify-sign-up></amplify-sign-up>`

設定:
```
<amplify-sign-up v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/sign-up-attributes.md"></inline-fragment>

順番に signUpFields 配列はオブジェクトの配列で構成されています それぞれがユーザーが記入するサインアップフォームに表示される項目を記述します (下記参照)。

イベント:

* `AmplifyEventBus.$emit('authState', 'confirmSignUp')`: ユーザが情報を正常に入力し、必要な検証ステップを完了していないときに発生します。
* `AmplifyEventBus.$emit('authState', 'signIn')`: Emitted when a user successfully provides their information and does not need to complete a required verification step, or when they click 'Back to Sign In'.


### サインアップを確認

ConfirmSignUpコンポーネントでは、ユーザが本人確認を行うことができます。

使用法: `<amplify-confirm-sign-up></amplify-confirm-sign-up>`

設定:
```
<amplify-confirm-sign-up v-bind:confirmSignUpConfig="confirmSignUpConfig"></amplify-confirm-sign-up>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/confirm-sign-up-attributes.md"></inline-fragment>


イベント:

* `AmplifyEventBus.$emit('authState', 'signIn')`: ユーザが正常に検証ステップを完了したり、「サインインに戻る」をクリックしたときに発生します。

### ForgotPassword

ForgotPasswordコンポーネントは、ユーザーにパスワードをリセットする機能を提供します。

使用法: `<amplify-forgot-password></amplify-forgot-password>`

設定:
```
<amplify-forgot-password v-bind:forgotPasswordConfig="forgotPasswordConfig"></amplify-forgot-password>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/forgot-password-attributes.md"></inline-fragment>


イベント:

* `AmplifyEventBus.$emit('authState', 'signIn')`: ユーザがパスワードを正常にリセットしたり、「サインインに戻る」をクリックしたときに発生します。

### SignOut

format@@0 コンポーネントでは、ユーザにサインアウトする機能を提供します。

使用法: `<amplify-sign-out></amplify-sign-out>`

設定:
```
<amplify-sign-out v-bind:signOutConfig="signOutConfig"></amplify-sign-out>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/sign-out-attributes.md"></inline-fragment>


イベント:

* `AmplifyEventBus.$emit('authState', 'signedOut')`: ユーザが正常にサインアウトしたときに発生します。

### SetMFA

SetMFA コンポーネントにより、ユーザに好ましいマルチファクター認証 (MFA) 方法を設定することができます。 それは(あなたがそれに渡すオプションに応じて)SMSテキストメッセージ、TOTP、またはなし、3つのオプションを表示することができます。

使用法: `<amplify-set-mfa></amplify-set-mfa>`

設定:
```
<amplify-set-mfa v-bind:mfaConfig="mfaConfig"></amplify-set-mfa>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/set-mfa-attributes.md"></inline-fragment>


イベント: なし

### サインアップフィールド

`aws-amplify-vue` SignUp コンポーネントを使用すると、ユーザーに表示されるユーザー入力フィールドをプログラム的に定義できます。 これらの項目に入力された情報は、ユーザープールにユーザーレコードを入力します。

使用方法:

```
<amplify-sign-up v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
```

#### サインアップ項目属性
<inline-fragment framework="vue" src="~/ui-legacy/fragments/sign-up-fields.md"></inline-fragment>

The following example will replace all the default sign up fields with the ones defined in the `signUpFields` array. It will also indicate that the `Email` field will be used to sign up with.

`MyComponent.vue`:
```html
<template>
  <div>
    <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
  </div>
</template>
<script>
export default {
  name: 'MyComponent',
  props: [],
  data () {
    return {
      authConfig: {
          signUpConfig: {
            header: 'My Customized Sign Up',
            hideAllDefaults: true,
            defaultCountryCode: '1',
            signUpFields: [
              {
                label: 'Email',
                key: 'email',
                required: true,
                displayOrder: 1,
                type: 'string',
                signUpWith: true
              },
              {
                label: 'Password',
                key: 'password',
                required: true,
                displayOrder: 2,
                type: 'password'
              },
              {
                label: 'PhoneNumber',
                key: 'phone_number',
                required: true,
                displayOrder: 3,
                type: 'string'
              },
              {
                label: 'Custom Attribute',
                key: 'custom_attr',
                required: false,
                displayOrder: 4,
                type: 'string',
                custom: true
              }
            ]
          }
        }
      }
    }
  }
</script>
```

### メールアドレス/電話番号でサインアップ/ログイン
ユーザープールがユーザー名としてメールアドレス/電話番号を許可するように設定されている場合 `usernameAttributes`を使用して、それに応じてUIコンポーネントを変更できます。

Setting `usernameAttributes` to `email` when signing up/in with email address. Setting `usernameAttributes` to `phone_number` when signing up/in with phone number.

Note: if you are using custom signUpFields to customize the `username` field, then you need to make sure either the label of that field is the same value you set in `usernameAttributes` or the key of the field is `username`.

例:
```html
<template>
  <div>
    <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
  </div>
</template>
<script>
export default {
  name: 'MyComponent',
  props: [],
  data () {
    return {
      authConfig: {
          usernameAttributes: 'My user name',
          signUpConfig: {
            header: 'My Customized Sign Up',
            hideAllDefaults: true,
            defaultCountryCode: '1',
            signUpFields: [
              {
                label: 'My user name',
                key: 'username',
                required: true,
                displayOrder: 1,
                type: 'string',
              },
              {
                label: 'Password',
                key: 'password',
                required: true,
                displayOrder: 2,
                type: 'password'
              },
              {
                label: 'Phone Number',
                key: 'phone_number',
                required: true,
                displayOrder: 3,
                type: 'string'
              },
              {
                label: 'Custom Attribute',
                key: 'custom_attr',
                required: false,
                displayOrder: 4,
                type: 'string',
                custom: true
              }
            ]
          }
        }
      }
    }
  }
</script>
```
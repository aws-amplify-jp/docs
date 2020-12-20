AWS Amplifyにはビューテンプレートで使用できるUIコンポーネントが用意されています。

Authenticatorコンポーネントはドロップインユーザー認証体験を作成します。 `amplify-authenticator` コンポーネントを `app.component.html` ビューに追加します。

```html
  <amplify-authenticator framework="Ionic"></amplify-authenticator>
```

### サインアップ設定
サインアップコンポーネントはユーザーにサインアップする機能を提供します。 これは `amplify-authenticator` コンポーネントの一部として含まれていますが、分離して使用することもできます。

Usage:  
`<amplify-auth-sign-up framework="Ionic" [signUpConfig]="signUpConfig"></amplify-auth-sign-up>`  
or  
`<amplify-authenticator framework="Ionic" [signUpConfig]="signUpConfig"></amplify-authenticator>`

SignUpコンポーネントは、カスタマイズできる「signUpConfig」オブジェクトを受け取ります。

<inline-fragment framework="angular" src="~/ui-legacy/fragments/sign-up-attributes.md"></inline-fragment>

順番に signUpFields 配列はオブジェクトの配列で構成されています 各項目について説明します。登録フォームに表示されます。

<inline-fragment framework="angular" src="~/ui-legacy/fragments/sign-up-fields.md"></inline-fragment>

The following example will replace all the default sign up fields with the ones defined in the `signUpFields` array. In `app.component.ts`:
```js
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  signUpConfig = {
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
```

`app.component.html`:
```html
<amplify-authenticator [signUpConfig]="signUpConfig"></amplify-authenticator>
```

### メールアドレスまたは電話番号でサインインまたはサインアップ
ユーザープールが電子メールアドレスまたは電話番号をユーザー名として許可するように設定されている場合 `usernameAttributes`を使用して、それに応じてUIコンポーネントを変更できます。

`app.component.ts`:
```js
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  usernameAttributes = "email"; 
}
```

`app.component.html`: `<amplify-authenticator framework="Ionic" [usernameAttributes]="usernameAttributes"></amplify-authenticator>`

ユーザープール設定に基づいて、 `usernameAttributes` は `メールアドレス` または `電話番号` のいずれかである必要があります。

Note: if you are using custom signUpFields to customize the `username` field, then you need to make sure either the label of that field is the same value you set in `usernameAttributes` or the key of the field is `username`.

例:
```js
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  usernameAttributes: 'My user name',
  signUpConfig = {
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
```

---

### 認証コンポーネントをカスタムコンポーネントに置き換え
Authenticator 内に表示される子コンポーネントは非表示またはカスタムコンポーネントに置き換えることができます。

使用法: `<amplify-authenticator framework="Ionic" [hide]="['Greetings']"></amplify-authenticator>`

#### 認証システムなしで認証コンポーネントを使用する
Authenticator 内に表示される子コンポーネントはスタンドアロンコンポーネントとして使用することができます。 これは、例えば、 登録および認証フローの特定の部分に対して独自のコンポーネントを表示したい場合です。

これらのコンポーネントは次のとおりです。

```javascript
<amplify-auth-confirm-sign-in>
<amplify-auth-confirm-sign-up>
<amplify-auth-forgot-password>
<amplify-auth-greetings>
<amplify-auth-require-new-password>
<amplify-auth-sign-in>
<amplify-auth-sign-up>
```

これらの各コンポーネントは、'state' 文字列と 'user' オブジェクトで構成される authState オブジェクトを受け取ることを期待しています。 authStateはanplifyServiceによって管理されているため、自身のカスタムコンポーネントがauthStateを適切に設定していることを確認してください。

例
```javascript
this.amplyService.setAuthState({ state: 'confirmSignIn', user });
```

authState についての詳細は、 [認証状態の変更を購読する](~/ui-legacy/auth/authenticator.md#subscribe-to-authentication-state-changes) セクションを参照してください。

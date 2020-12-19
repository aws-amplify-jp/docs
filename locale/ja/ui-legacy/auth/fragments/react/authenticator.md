## withAuthenticator HOC の使用

React では、アプリケーションに認証フローを追加する最も簡単な方法は、 `withAuthenticator` Higher Order Componentを使用することです。

`withAuthenticator` は自動的に認証状態を検出し、UI を更新します。 ユーザーがサインインしている場合、基礎となるコンポーネント (通常はアプリのメインコンポーネント) が表示され、サインイン/サインアップコントロールが表示されます。

> デフォルトの実装では、AmplifyのUIスタイルを使用しています。 例えば、ウェブとモバイルの箱の外見は、ここ <a href="https://aws-amplify.github.io/media/ui_library" target="_blank">を参照してください</a>。

`App.js`に以下の2行を追加してください:

```javascript
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
// Get the aws resources configuration parameters
import awsconfig from './aws-exports'; // if you are using Amplify CLI

Amplify.configure(awsconfig);

// ...

export default withAuthenticator(App);
```
Now, your app has complete flows for user sign-in and registration. Since you have wrapped your **App** with `withAuthenticator`, only signed in users can access your app. The routing for login pages and giving access to your **App** Component will be managed automatically.

`withAuthenticator` component renders your App component after a successful user signed in, and it prevents non-sign-in users to interact with your app. In this case, we need to display a *sign-out* button to trigger the related process.

To display a sign-out button or customize other, set `includeGreetings = true` in the parameter object. It displays a *greetings section* on top of your app, and a sign-out button is displayed in the authenticated state. Other customization options are also available as properties to the HOC:

```jsx
export default withAuthenticator(App, {
                // Render a sign out button once logged in
                includeGreetings: true, 
                // Show only certain components
                authenticatorComponents: [MyComponents],
                // display federation/social provider buttons 
                federated: {myFederatedConfig}, 
                // customize the UI/styling
                theme: {myCustomTheme}});
```

## 認証コンポーネントの使用

`withAuthenticator` HOC は `Authenticator` コンポーネントをラップします。 `Authenticator` を使用すると、UI のより多くのカスタマイズオプションが直接与えられます。

```jsx

<Authenticator 
    // Optionally hard-code an initial state
    authState="signIn"
    // Pass in an already authenticated CognitoUser or FederatedUser object
    authData={CognitoUser | 'username'} 
    // Fired when Authentication State changes
    onStateChange={(authState) => console.log(authState)} 
    // An object referencing federation and/or social providers 
    // The federation here means federation with the Cognito Identity Pool Service
    // *** Only supported on React/Web (Not React Native) ***
    // For React Native use the API Auth.federatedSignIn()
    federated={myFederatedConfig}
    // A theme object to override the UI / styling
    theme={myCustomTheme} 
    // Hide specific components within the Authenticator
    // *** Only supported on React/Web (Not React Native)  ***
    hide={ 
        [
            Greetings,
            SignIn,
            ConfirmSignIn,
            RequireNewPassword,
            SignUp,
            ConfirmSignUp,
            VerifyContact,
            ForgotPassword,
            TOTPSetup,
            Loading
        ]
    }
    // or hide all the default components
    hideDefault={true}
    // Pass in an aws-exports configuration
    amplifyConfig={myAWSExports}
    // Pass in a message map for error strings
    errorMessage={myMessageMap}
>
    // Default components can be customized/passed in as child components. 
    // Define them here if you used hideDefault={true}
    <Greetings/>
    <SignIn federated={myFederatedConfig}/>
    <ConfirmSignIn/>
    <RequireNewPassword/>
    <SignUp/>
    <ConfirmSignUp/>
    <VerifyContact/>
    <ForgotPassword/>
    <TOTPSetup/>
    <Loading/>
</Authenticator>
```

## 独自のコンポーネントをカスタマイズ

React と React Native の子コンポーネントとして `Authenticator` にカスタムコンポーネントを提供することができます。

```jsx
import { Authenticator, SignIn } from 'aws-amplify-react';

// The override prop tells the Authenticator that the SignUp component is not hidden but overridden
<Authenticator hideDefault={true}>
  <SignIn />
  <MyCustomSignUp override={'SignUp'}/> 
</Authenticator>

class MyCustomSignUp extends Component {
  constructor() {
    super();
    this.gotoSignIn = this.gotoSignIn.bind(this);
  }

  gotoSignIn() {
    // to switch the authState to 'signIn'
    this.props.onStateChange('signIn',{});
  }

  render() {
    return (
      <div>
        {/* only render this component when the authState is 'signUp' */}
        { this.props.authState === 'signUp' && 
        <div>
          My Custom SignUp Component
          <button onClick={this.gotoSignIn}>Goto SignIn</button>
        </div>
        }
      </div>
    );
  }
}
```

コンポーネント内の注入された `authState` に基づいてカスタムコンポーネントをレンダリングしたり、コンポーネント内の他の状態にジャンプしたりすることができます。

```jsx
if (props.onStateChange) props.onStateChange(state, data);
```

Federated Identities sign-inのUIをカスタマイズするには、 `withFederated` コンポーネントを使用できます。 以下のコードは、ログインボタンとソーシャルサインインのレイアウトをカスタマイズする方法を示しています。

> ***withFederatedおよびFederatedコンポーネントはReact Native ではサポートされていません***. React Native で API Auth.federatedSignIn() を使用してください。

```javascript
import { withFederated } from 'aws-amplify-react';

const Buttons = (props) => (
    <div>
        <img
            onClick={props.googleSignIn}
            src={google_icon}
        />
        <img
            onClick={props.facebookSignIn}
            src={facebook_icon}
        />
        <img
            onClick={props.amazonSignIn}
            src={amazon_icon}
        />
    </div>
)

const Federated = withFederated(Buttons);

...

const federated = {
    google_client_id: '', // Enter your google_client_id here
    facebook_app_id: '', // Enter your facebook_app_id here   
    amazon_client_id: '' // Enter your amazon_client_id here
};

<Federated federated={federated} onStateChange={this.handleAuthStateChange} />
```

単一のプロバイダをカスタマイズする必要がある場合に備えて、 `withGoogle`, `withFacebook`, `withAmazon` コンポーネントもあります。

#### コンポーネントをラップしています

*Authenticator* を使用してアプリケーションコンポーネントをレンダリングします:

```javascript
import { Authenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native'
...

class AppWithAuth extends Component {
  render(){
    return (
      <div>
      <Authenticator>
        <App />
      </Authenticator>
      </div>
    );
  }
}

export default AppWithAuth;
```

## サインイン後にアプリを表示

In the previous example, you'll see the App is rendered even before the user is signed-in. To change this behavior, you can use *Authenticator* properties. When inside `Authenticator`, the App component automatically receives those properties.

**authState** は現在の認証状態（文字列）です。
```
 - signIn
 - signUp
 - confirmSignIn
 - confirmSignUp
 - forged Password
 - requireNewPassword
 - verifyContact
 - signedIn
 ```

**authData** - authState内の追加データ。 state が ** signedIn ** である場合、 `CognitoUser` [`オブジェクトを返します。`](https://github.com/aws-amplify/amplify-js/blob/main/packages/amazon-cognito-identity-js/index.d.ts#L48)

Using the options above, to control the condition for *Authenticator* to render App component, simply set `_validAuthStates` property:

```javascript
this._validAuthState = ['signedIn'];
```

次に、コンポーネントのコンストラクタで、 `showComponent(theme) {}` を典型的な `render() {}` メソッドの代わりに実装します。

## サインアップ

サインアップコンポーネントはユーザーにサインアップ機能を提供します。これは、 `Authenticator` コンポーネントの一部として含まれています。

使用法: `<Authenticator signUpConfig={ signUpConfig }/>`

認証 HOC の一部としても使用できます: `export default withAuthenticator(App, { signUpConfig });`

SignUpコンポーネントは、カスタマイズできる「signUpConfig」オブジェクトを受け取ります。

<inline-fragment framework="react" src="~/ui-legacy/auth/fragments/react/sign-up-attributes.md"></inline-fragment>

順番に signUpFields 配列はオブジェクトの配列で構成されています 各項目について説明します。登録フォームに表示されます。

<inline-fragment framework="react" src="~/ui-legacy/auth/fragments/react/sign-up-fields.md"></inline-fragment>

signUpFields 属性の例は次のようになります。

```js
const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'My custom email label',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    ... // and other custom attributes
  ]
};

export default withAuthenticator(App, { signUpConfig });
```

## メールアドレス/電話番号でサインアップ/ログイン

ユーザープールがユーザー名としてメールアドレス/電話番号を許可するように設定されている場合 `usernameAttributes` [(設定の詳細)](~/lib/auth/getting-started.md/q/platform/js) を使用して、それに応じてUIコンポーネントを変更できます。

`email` をユーザー名として使用している場合:

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

ユーザー名に `電話番号` を使用している場合

```js
import { Authenticator, withAuthenticator } from 'aws-amplify-react';

class App {
  // ...

  render() {
    return (
      <Authenticator usernameAttributes='phone_number'/>
    );
  }
}

export default App;

// When using withAuthenticator
class App2 {
  // ...
}

export default withAuthenticator(App2, { usernameAttributes: 'phone_number' });
```

**Note:** If you are using custom signUpFields to customize the `username` field, then you need to make sure either the label of that field is the same value you set in `usernameAttributes` or the key of the field is `username`.

例:

```js
import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(awsconfig);

class App extends Component {}

const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'My user name',
      key: 'username',
      required: true,
      displayOrder: 1,
      type: 'string'
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
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 4,
      type: 'string'
    }
  ]
};
const usernameAttributes = 'My user name';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});
```

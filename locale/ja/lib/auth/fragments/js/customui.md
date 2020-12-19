### UIテーマをカスタマイズ

React では、独自のテーマを作成してAmplifyコンポーネントをレンダリングすることができます：

カスタムテーマは、次の [テンプレート](https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-react/src/Amplify-UI/Amplify-UI-Theme.tsx) からセレクタを使用する必要があります。

```javascript
import MyTheme from './MyTheme';

<Authenticator theme={MyTheme} />
```

または、いくつかのプロパティを変更し、同じファイルからテーマオブジェクトを渡すこともできます。

```javascript
const MyTheme = {
    signInButtonIcon: { 'display': 'none' },
    googleSignInButton: { 'backgroundColor': 'red', 'borderColor': 'red' }
}

<Authenticator theme={MyTheme} />
```

React Nativeの場合、ここでAmplifyTheme.js [で定義されているプロパティを上書きする必要があります](https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-react-native/src/AmplifyTheme.js)

```javascript
import { AmplifyTheme } from 'aws-amplify-react-native';

const MySectionHeader = Object.assign({}, AmplifyTheme.sectionHeader, { background: 'orange' });
const MyTheme = Object.assign({}, AmplifyTheme, { sectionHeader: MySectionHeader });

<Authenticator theme={MyTheme} />
```

### 独自のUIを作成

デフォルトの認証体験をさらにカスタマイズするには、独自の認証UIを作成できます。 これを行うには、コンポーネントが次の *Authenticator* プロパティを利用します:

```
- authState
- authData
- onStateChange
```

次の例では、アプリケーションで現在の認証状態を継続的に表示する 'Always On' Auth UI を作成します。

```javascript
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';

const AlwaysOn = (props) => {
    return (
        <div>
            <div>I am always here to show current auth state: {props.authState}</div>
            <button onClick={() => props.onStateChange('signUp')}>Show Sign Up</button>
        </div>
    )
}

handleAuthStateChange(state) {
    if (state === 'signedIn') {
        /* Do something when the user has signed-in */
    }
}

render() {
    return (
        <Authenticator hideDefault={true} onStateChange={this.handleAuthStateChange}>
            <SignIn/>
            <SignUp/>
            <ConfirmSignUp/>
            <Greetings/>
            <AlwaysOn/>
        </Authenticator>
    )
}
```

## 独自の認証システムを作成中

`Authenticator` は多くの認証コンポーネントのコンテナとして設計されています。各コンポーネントは単一のジョブを行います。e. 、サインイン、サインアップなど デフォルトでは、これらの要素はすべて認証状態に応じて表示されます。

If you want to replace some or all of the Authenticator elements, you need to set `hideDefault={true}`, so the component doesn't render its default view. Then you can pass in your own set of child components that listen to `authState` and decide what to do.

使用する子コンポーネントを渡すこともできます。 例えば、次の Authenticator 設定は *Greetings* コンポーネントのみをレンダリングします。これには *Sign Out* ボタンがあります:

```javascript
<Authenticator hideDefault={true}>
    <Greetings />
</Authenticator>
```

### 挨拶メッセージのカスタマイズ

The *Greetings* component has two states: signedIn, and signedOut. To customize the greeting message, set properties `inGreeting` and `outGreeting` using a string or function.

```javascript
<Authenticator hideDefault={true}>
    <Greetings
        inGreeting={(username) => 'Hello ' + username}
        outGreeting="サインインしてください..."
    />
</Authenticator>
```
### エラーメッセージのカスタマイズ

認証フロー中、Amplifyはサーバーから返されるエラーメッセージを処理します。 Amplifyは、それらのエラーメッセージを `messageMap` コールバックでカスタマイズする簡単な方法を提供します。

この関数は、元のメッセージを引数として受け取り、希望するメッセージを出力します。 Amplifyがどのようにマップを機能させるかを確認するには、 `AmplifyMessageMap.js` ファイルを確認してください。

```javascript
const map = (message) => {
    if (/incorrect.*username.*password/i.test(message)) {
        return 'Incorrect username or password';
    }

    return message;
}

<Authenticator errorMessage={map} />
```

`AmplifyMessageMap.js` では、国際化も処理します。このトピックは、 [I18n Guide](~/lib/utilities/i18n.md) で説明されています。

### テキストラベルのカスタマイズ

ローカリゼーションエンジンに独自の辞書を提供することで、ビルトインユーザーインターフェイスのラベルのテキスト(「サインイン」や「サインアップ」など)を変更できます。

```javascript
import { I18n } from 'aws-amplify';

const authScreenLabels = {
    en: {
        'Sign Up': 'Create new account',
        'Sign Up Account': 'Create a new account'
    }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);
```


### 初期認証状態のカスタマイズ

You can change the initial auth state for your Authenticator. By default the initial state is `signIn` which will shows the `signIn` component. If you want the `signUp` component shows first, you can do:
```javascript
<Authenticator authState='signUp'>
```

## withAuthenticator HOC をカスタマイズ

The `withAuthenticator` HOC gives you some nice default authentication screens out-of-box. If you want to use your own components rather than provided default components, you can pass the list of customized components to `withAuthenticator`:

```javascript
import React, { Component } from 'react';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

class App extends Component {
  render() {
    ...
  }
}

// This is my custom Sign in component
class MySignIn extends SignIn {
  render() {
    ...
  }
}

export default withAuthenticator(App, false, [
  <MySignIn/>,
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp/>,
  <ConfirmSignUp/>,
  <ForgotPassword/>,
  <RequireNewPassword />
]);
```

If you would like to add custom styling to the UI components you can pass a custom theme object as a parameter to the withAuthenticator HOC using the instructions [above](#customize-ui-theme):

```javascript
export default withAuthenticator(App, false, [], null, MyTheme);
```


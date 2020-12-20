## UIテーマをカスタマイズ

React では、独自のテーマを作成してAmplifyコンポーネントをレンダリングすることができます：

> カスタムテーマは、次の [テンプレート](https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-react/src/Amplify-UI/Amplify-UI-Theme.tsx)からセレクターを使用する必要があります。

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

### 独自のUIを作成する

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
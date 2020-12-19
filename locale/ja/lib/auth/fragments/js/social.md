## OAuthとフェデレーションの概要

[OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) is the common Authorization framework used by web and mobile applications for getting access to user information ("scopes") in a limited manner. Common analogies you will hear in OAuth is that of boarding a plane or staying in a hotel - showing your identification is the Authentication piece (signing into an app) and using the boarding pass/hotel key is what you are Authorized to access.

AmplifyでのOAuthサポートはCognitoユーザープールを使用し、ソーシャルプロバイダとの連盟をサポートしています。 これは、ログイン後に自動的に対応するユーザーをユーザープールに作成します。 [OIDC](https://en.wikipedia.org/wiki/OpenID_Connect) トークンは、アプリケーションがこのプロセスを完了した後にアプリで利用できます。

<inline-fragment src="~/lib/auth/fragments/common/social_signin_web_ui/setup_auth_provider.md"></inline-fragment>

## 認証カテゴリの設定

ソーシャルプロバイダを設定したら、プロジェクトのルートフォルダで以下を実行してください：

```bash
amplify add auth ## "amplify update auth" already configured
```

ソーシャルプロバイダ(Federation)でデフォルト設定を選択します。

```console
デフォルトの認証とセキュリティ設定を使用しますか？ 
  デフォルト設定 
<unk> ソーシャルプロバイダ(Federation)によるデフォルト設定 
  手動設定 
  詳細を知りたい。
```

**リダイレクト URI**

For *Sign in Redirect URI(s)* inputs, you can put one URI for local development and one for production. Example: `http://localhost:3000/` in dev and `https://www.example.com/` in production. The same is true for *Sign out redirect URI(s)*.

**注意:** 複数のリダイレクト URI 入力がある場合は、Amplifyプロジェクトを設定する場合、両方の入力を処理する必要があります。例えば:

```javascript
import awsConfig from './aws-exports';

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
}

Amplify.configure(updatedAwsConfig);
```

**React Native - リダイレクト URI**

For React Native applications, You need to define a custom URL scheme for your application before testing locally or publishing to the app store. This is different for Expo or vanilla React Native. Follow the steps below for React Native iOS & Android or [Expo Linking docs](https://docs.expo.io/versions/latest/workflow/linking/) for more information. After completing those steps, assuming you are using `myapp` as the name of your URL Scheme (or whatever friendly name you have chosen), you will use these URLs as *Sign in Redirect URI(s)* and/or *Sign out redirect URI(s)* inputs. Your URIs could look like any of these:

- `myapp://`
- `exp://127.0.0.1:19000/-/` (アプリがエキスポクライアント [で実行されている場合は、ローカル開発](https://docs.expo.io/versions/latest/workflow/linking/#linking-to-your-app))。

*React Native - iOS - Info.plist*

```xml

 <plist version="1.0">

     <dict>
     <!-- YOUR OTHER PLIST ENTRIES HERE -->

     <!-- ADD AN ENTRY TO CFBundleURLTypes for Cognito Auth -->
     <!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
     <key>CFBundleURLTypes</key>
     <array>
         <dict>
             <key>CFBundleURLSchemes</key>
             <array>
                 <string>myapp</string>
             </array>
         </dict>
     </array>

     <!-- ... -->
     </dict>
```

*React Native - Android - AndroidManifest.xml*

- MainActivity の `launchMode` を `singleTask` に設定する
- `scheme="myapp"` で新しいインテントフィルターを追加する

```xml
<application>
  <activity
    android:name=".MainActivity"
    android:launchMode="singleInstance">

    <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="myapp" />
    </intent-filter>

  </activity>
</application>
```

<inline-fragment src="~/lib/auth/fragments/common/social_signin_web_ui/configure_auth_category.md"></inline-fragment>

### 既知の制限
When using the federated OAuth flow with Cognito User Pools, the [device tracking and remembering](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/) features are currently not available within the library. If you are looking for this feature within the library, please open a feature request [here](https://github.com/aws-amplify/amplify-js/issues/new?assignees=&labels=feature-request&template=feature_request.md&title=) and provide upvotes in order for us to take this into consideration for the future of the library.

## Setup frontend

After configuring the OAuth endpoints, you can use them or the Hosted UI with `Auth.federatedSignIn()`. Passing `LoginWithAmazon`, `Facebook`, `Google`, or `SignInWithApple` will bypass the Hosted UI and federate immediately with the social provider as shown in the below React example. If you are looking to add a custom state, you are able to do so by passing a string (e.g. `Auth.federatedSignIn({ customState: 'xyz' })`) value and listening for the custom state via Hub.

```javascript
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Open Facebook</button>
        <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
        <button onClick={() => Auth.signOut()}>Sign Out {user.getUsername()}</button>
      </div>
    );
  }
}
```

### Amplifyコンソールにデプロイ中

フロントエンドとバックエンドの継続的なデプロイでアプリをAmplifyコンソールにデプロイするには、 [以下の手順](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html#creating-a-new-backend-environment-with-authentication-parameters)に従ってください。

### 完全なサンプル

<amplify-block-switcher>

<amplify-block name="React">

```js
import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <div>
      <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => Auth.federatedSignIn()}>Federated Sign In</button>
      )}
    </div>
  );
}

export default App;
```
</amplify-block>

<amplify-block name="React Native">

<amplify-callout>

**iOS アプリ向けメモ**

In order for Amplify to listen for data from Cognito when linking back to your app, you will need to setup the `Linking` module in `AppDelegate.m` (see [React Native docs](https://reactnative.dev/docs/linking#enabling-deep-links) for more information):

```objective-c
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```
</amplify-callout>

**アプリ内ブラウザ設定 (オプションですが、推奨)**

By default, Amplify will opened the Cognito Hosted UI in Safari/Chrome, but you can override that behavior by providing a custom `urlOpener`. The sample below uses [react-native-inappbrowser-reborn](https://github.com/proyecto26/react-native-inappbrowser), but you can use any other in-app browser available.

**サンプル**

```js
import React, { useEffect, useState } from 'react';
import { Button, Linking, Text, View } from 'react-native';
import Amplify, { Auth, Hub } from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import awsconfig from './aws-exports';

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const { type, url: newUrl } = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener,
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <View>
      <Text>User: {user ? JSON.stringify(user.attributes) : 'None'}</Text>
      {user ? (
        <Button title="Sign Out" onPress={() => Auth.signOut()} />
      ) : (
        <Button title="Federated Sign In" onPress={() => Auth.federatedSignIn()} />
      )}
    </View>
  );
}

export default App;
```

<inline-fragment src="~/lib/auth/fragments/js/react-native-withoauth.md"></inline-fragment>

</amplify-block>

<amplify-block name="Expo">

**アプリ内ブラウザ設定 (オプションですが、推奨)**

By default, Amplify will opened the Cognito Hosted UI in Safari/Chrome, but you can override that behavior by providing a custom `urlOpener`. The sample below uses Expo's [WebBrowser.openAuthSessionAsync](https://docs.expo.io/versions/v37.0.0/sdk/webbrowser/).

**サンプル**

```js
import React, { useEffect, useState } from 'react';
import { Button, Linking, Platform, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

async function urlOpener(url, redirectUrl) {
    const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
        url,
        redirectUrl
    );

    if (type === 'success' && Platform.OS === 'ios') {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
}

Amplify.configure({
    ...awsconfig,
    oauth: {
        ...awsconfig.oauth,
        urlOpener,
    },
});

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                    getUser().then((userData) => setUser(userData));
                    break;
                case 'signOut':
                    setUser(null);
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });

        getUser().then((userData) => setUser(userData));
    }, []);

    function getUser() {
        return Auth.currentAuthenticatedUser()
            .then((userData) => userData)
            .catch(() => console.log('Not signed in'));
    }

    return (
        <View>
            <Text>User: {user ? JSON.stringify(user.attributes) : 'None'}</Text>
            {user ? (
                <Button title="Sign Out" onPress={() => Auth.signOut()} />
            ) : (
                <Button title="Federated Sign In" onPress={() => Auth.federatedSignIn()} />
            )}
        </View>
    );
}

export default App;

```

<inline-fragment src="~/lib/auth/fragments/js/react-native-withoauth.md"></inline-fragment>

</amplify-block>

</amplify-block-switcher>

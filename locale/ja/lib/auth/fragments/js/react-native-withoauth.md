**with OAuth Higher-Order Component (HOC)**

With React Native & Expo, you can also use the `withOAuth` HOC to launch the Cognito Hosted UI experience. Just wrap your app's main component with our HOC. Doing so, will pass the following `props` available to your component:

- `oAuthUser`: 署名が成功した場合、このオブジェクトはユーザプールからユーザを取得します。
- `oAuthError`: エラーが発生した場合、Cognito Hosted UI で指定されたエラーのある文字列。
- `hostedUISignIn`: ホストされた UI サインインをフローでトリガーするコールバック関数、これは Cognito Hosted UI を表示します。
- `signOut`: ホストされた UI サインアウトフローをトリガーするコールバック関数。

<amplify-callout>

Cognito UI を表示したくない場合は、次の `props` を使用して、ボタン付きのカスタム UI を構築します。 ただし、OAuth フローが完了すると、ユーザープールエントリは引き続き作成されます。

</amplify-callout>

- `facebookSignIn`: Facebook でホストされている UI サインインをトリガーするコールバック関数、Facebook ログインページが表示されます。
- `googleSignIn`: Google 用にホストされた UI サインインをトリガーするコールバック関数、Google ログインページが表示されます。
- `amazonSignIn`: LoginWithAmazonのフローでホストされているUIサインインをトリガーするコールバック関数。
- `customProviderSignIn`: A callback function to trigger the hosted UI sign in flow for an OIDC provider, this will show the OIDC provider login page. This function expects a string with the **provider name** specified when [adding the OIDC  IdP to your User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-oidc-idp.html#cognito-user-pools-oidc-idp-step-2).

React Native アプリケーションで `withOAuth` を使用するには、まず適切な依存関係をインストールします。

```terminal
yarn add aws-amplify-react-native aws-amplify 
```

次のコードスニペットは、その使用可能な例を示しています:

<amplify-callout>

Although `urlOpener` is left out of this sample for brevity, it is still recommended to use the custom example from above in this `withOAuth` sample.

</amplify-callout>

```javascript
import React from 'react';
import { Button, Text, View } from 'react-native';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { withOAuth } from "aws-amplify-react-native";
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App(props) {
    const {
      oAuthUser,
      oAuthError,
      hostedUISignIn,
      facebookSignIn,
      googleSignIn,
      amazonSignIn,
      customProviderSignIn,
      signOut,
    } = props;

  return (
    <View>
        <Text>User: {oAuthUser ? JSON.stringify(oAuthUser.attributes) : 'None'}</Text>
        {oAuthUser ? (
            <Button title="Sign Out" onPress={signOut} />
        ) : (
            <>
                {/* Go to the Cognito Hosted UI */}
                <Button title="Cognito" onPress={hostedUISignIn} />

                {/* Go directly to a configured identity provider */}
                <Button title="Facebook" onPress={facebookSignIn} />
                <Button title="Google" onPress={googleSignIn}  />
                <Button title="Amazon" onPress={amazonSignIn} />

                {/* e.g. for OIDC providers */}
                <Button title="Yahoo" onPress={() => customProviderSignIn('Yahoo')} />
            </>
        )}
    </View>
  );
}

export default withOAuth(App);
``` 
Amazon Cognitoユーザープールは、認証フローのカスタマイズをサポートし、カスタムチャレンジタイプを可能にします。 これらのチャレンジタイプにはCAPTCHAまたは動的チャレンジの質問が含まれる場合があります。チャレンジを定義するには、3つのLambdaトリガーを実装する必要があります。

> カスタム認証チャレンジのための Lambda Trigger の操作の詳細については、 [Amazon Cognito Developer Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html) を参照してください。

## Amplifyでのカスタム認証

カスタム認証フローを有効にするには、 `awsconfiguration.json` ファイルを更新し、 `authenticationFlowType` を `CUSTOM_AUTH` に設定します。

```json
{
  "CognitoUserPool": {
    "Default": {
      "PoolId": "XX-XXXX-X_abcd1234",
      "AppClientId": "XXXXXXXX",
      "Region": "XX-XXXX-X"
    }
  },
  "Auth": {
    "Default": {
      "authenticationFlowType": "CUSTOM_AUTH"
    }
  }
}
```

アプリコードで `signIn` をダミーパスワードで呼び出します。カスタムチャレンジは、 `confirmSignIn` メソッドを使用して回答する必要があります。

```swift
AWSMobileClient.default().signIn(username: username, password: "dummyPassword") { (signInResult, error) in

    if let signInResult = signInResult {
        if (signInResult.signInState == .customChallenge) {
            // Retrieve challenge details
        }
    }

}

```

ユーザーからチャレンジの詳細を取得し、 `confirmSignin` を呼び出します。

```swift
AWSMobileClient.default().confirmSignIn(challengeResponse: "<Challenge Response>",
                                                completionHandler: { (signInResult, error) in
    if let error = error  {
        print("\(error.localizedDescription)")
    } else if let signInResult = signInResult {
        switch (signInResult.signInState) {
        case .signedIn:
            print("User is signed in.")
        default:
            print("\(signInResult.signInState.rawValue)")
        }
    }

})
```

### Lambda Trigger セットアップ

Amplify CLI は、カスタム認証フローによって必要なトリガーを生成するために使用できます。 詳細は [CLI ドキュメント](~/cli/usage/lambda-triggers.md) を参照してください。CLI は手動で編集できるカスタム認証フロースケルトンを作成します。

> 利用可能なトリガーの詳細については、 [Cognito documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html) を参照してください。

`AWSMobileClient` assumes the custom auth flow starts with username and password. If you want a passwordless authentication flow, modify your **Define Auth Challenge** Lambda trigger to bypass the initial username/password verification and proceed to the custom challenge:

```javascript
exports.handler = (event, context) => {
  if (event.request.session.length === 1 && 
    event.request.session[0].challengeName === 'SRP_A') {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
  } else if (
    event.request.session.length === 2 &&
    event.request.session[1].challengeName === 'CUSTOM_CHALLENGE' &&
    event.request.session[1].challengeResult === true
  ) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }
  context.done(null, event);
};
```

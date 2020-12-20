<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func customChallenge(response: String) {
    Amplify.Auth.confirmSignIn(challengeResponse: response) { result in
        switch result {
        case .success:
            print("Confirm sign in succeeded")   
        case .failure(let error):
            print("Confirm sign in failed \(error)")
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func customChallenge(response: String) -> AnyCancellable {
    Amplify.Auth.confirmSignIn(challengeResponse: response)
        .resultPublisher
        .sink {
            if case let .failure(authError) = $0 {
                print("Confirm sign in failed \(authError)")
            }
        }
        receiveValue: { _ in
            print("Confirm sign in succeeded")
        }
}
```

</amplify-block>

</amplify-block-switcher>

### Lambda Trigger セットアップ

Amplify CLI は、カスタム認証フローによって必要なトリガーを生成するために使用できます。 詳細は [CLI ドキュメント](~/cli/usage/lambda-triggers.md) を参照してください。CLI は手動で編集できるカスタム認証フロースケルトンを作成します。

> 利用可能なトリガーの詳細については、 [Cognito documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html) を参照してください。

`AWSCognitoAuthPlugin` assumes the custom auth flow starts with username and password (SRP_A). If you want a passwordless authentication flow, modify your **Define Auth Challenge** Lambda trigger to bypass the initial username/password verification and proceed to the custom challenge:

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
また、サインアッププロセス中にダミーパスワードを渡す必要があります。
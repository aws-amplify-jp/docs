## サインアップ

Cognitoユーザープールに新しいユーザーを作成します:

```swift
AWSMobileClient.default().signUp(username: "your_username",
                                        password: "Abc@123!",
                                        userAttributes: ["email":"john@doe.com", "phone_number": "+1973123456"]) { (signUpResult, error) in
    if let signUpResult = signUpResult {
        switch(signUpResult.signUpConfirmationState) {
        case .confirmed:
            print("User is signed up and confirmed.")
        case .unconfirmed:
            print("User is not confirmed and needs verification via \(signUpResult.codeDeliveryDetails!.deliveryMedium) sent at \(signUpResult.codeDeliveryDetails!.destination!)")
        case .unknown:
            print("Unexpected case")
        }
    } else if let error = error {
        if let error = error as? AWSMobileClientError {
            switch(error) {
            case .usernameExists(let message):
                print(message)
            default:
                break
            }
        }
        print("\(error.localizedDescription)")
    }
}
```

## ユーザー属性

`signUp()` メソッドで、 `userAttributes` 引数をキーと値のペアとして渡すことで、カスタムユーザー属性を提供できます。 例:

```swift
AWSMobileClient.default().signUp(
    username: "your_username",
    password: "Abc@123!",
    userAttributes: [
        "nickname":"Johnny", 
        "badge_number": "ABC123XYZ"
        ]) { (signUpResult, error) in
            //Use results as before
        }
```

## サインアップを確認

サインアップ後に新規ユーザーを確認します:

```swift
AWSMobileClient.default().confirmSignUp(username: "your_username", confirmationCode: signUpCodeTextField.text!) { (signUpResult, error) in
    if let signUpResult = signUpResult {
        switch(signUpResult.signUpConfirmationState) {
        case .confirmed:
            print("User is signed up and confirmed.")
        case .unconfirmed:
            print("User is not confirmed and needs verification via \(signUpResult.codeDeliveryDetails!.deliveryMedium) sent at \(signUpResult.codeDeliveryDetails!.destination!)")
        case .unknown:
            print("Unexpected case")
        }
    } else if let error = error {
        print("\(error.localizedDescription)")
    }
}
```

## 確認コード（MFA）を再送信する

```swift
AWSMobileClient.default().resendSignUpCode(username: "your_username", completionHandler: { (result, error) in
    if let signUpResult = result {
        print("A verification code has been sent via \(signUpResult.codeDeliveryDetails!.deliveryMedium) at \(signUpResult.codeDeliveryDetails!.destination!)")
    } else if let error = error {
        print("\(error.localizedDescription)")
    }
})
```

## SignIn

ユーザー資格情報でサインイン:

```swift
AWSMobileClient.default().signIn(username: "your_username", password: "Abc@123!") { (signInResult, error) in
    if let error = error  {
        print("\(error.localizedDescription)")
    } else if let signInResult = signInResult {
        switch (signInResult.signInState) {
        case .signedIn:
            print("User is signed in.")
        case .smsMFA:
            print("SMS message sent to \(signInResult.codeDetails!.destination!)")
        default:
            print("Sign In needs info which is not et supported.")
        }
    }
}
```

## Confirm SignIn (MFA)

```swift
AWSMobileClient.default().confirmSignIn(challengeResponse: "code_here") { (signInResult, error) in
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
}
```

## パスワードを強制的にリセットする

If a user is required to change their password on first login, a `newPasswordRequired` state will be returned when `signIn` is called and you will need to provide a new password. This can be done by using `confirmSignIn`:

```swift
AWSMobileClient.default().signIn(username: "abc123", password: "Abc123!@") { (signInResult, error) in
    if let signInResult = signInResult {
        switch(signInResult.signInState) {
        case .signedIn:
            print("User signed in successfully.")
        case .smsMFA:
            print("Code was sent via SMS to \(signInResult.codeDetails!.destination!)")
        case .newPasswordRequired:
            print("A change of password is needed. Please provide a new password.")
        default:
            print("Other signIn state: \(signInResult.signInState)")
        }
    } else if let error = error {
        print("Error occurred: \(error.localizedDescription)")
    }
}

AWSMobileClient.default().confirmSignIn(challengeResponse: "NEW_PASSWORD_HERE") { (signInResult, error) in
    if let signInResult = signInResult {
        switch(signInResult.signInState) {
        case .signedIn:
            print("User signed in successfully.")
        case .smsMFA:
            print("Code was sent via SMS to \(signInResult.codeDetails!.destination!)")
        default:
            print("Other signIn state: \(signInResult.signInState)")
        }
    } else if let error = error {
        print("Error occurred: \(error.localizedDescription)")
    }
}
```

## SignOut

```swift
AWSMobileClient.default().signOut()
```

## グローバルサインアウト

グローバルサインアウトを使用すると、すべてのアクティブなログインセッションからユーザーにサインアウトできます。 これにより、あなたはすべてのトークンを無効にしています（IDトークン） アクセストークンとリフレッシュトークンは、ユーザーが **すべての** デバイスからサインアウトされていることを意味します。

> **メモ** トークンは一時的な AWS 資格情報 (Access and Secret Keys) が失効するまで有効です。 デフォルトでは1時間です

```swift
AWSMobileClient.default().signOut(options: SignOutOptions(signOutGlobally: true)) { (error) in
    print("Error: \(error.debugDescription)")
}
```

## パスワードを忘れた場合

パスワードを忘れた2ステップのプロセスです。

1. Call a `forgotPassword()` method which sends a confirmation code via email or phone number. The details of how the code was sent are included in the response of `forgotPassword()`.
2. コードが `confirmForgotPassword()` を呼び出すと確認コードが表示されます。

```swift
AWSMobileClient.default().forgotPassword(username: "my_username") { (forgotPasswordResult, error) in
    if let forgotPasswordResult = forgotPasswordResult {
        switch(forgotPasswordResult.forgotPasswordState) {
        case .confirmationCodeSent:
            print("Confirmation code sent via \(forgotPasswordResult.codeDeliveryDetails!.deliveryMedium) to: \(forgotPasswordResult.codeDeliveryDetails!.destination!)")
        default:
            print("Error: Invalid case.")
        }
    } else if let error = error {
        print("Error occurred: \(error.localizedDescription)")
    }
}
```

```swift
AWSMobileClient.default().confirmForgotPassword(username: "my_username", newPassword: "MyNewPassword123!!", confirmationCode: "ConfirmationCode") { (forgotPasswordResult, error) in
    if let forgotPasswordResult = forgotPasswordResult {
        switch(forgotPasswordResult.forgotPasswordState) {
        case .done:
            print("Password changed successfully")
        default:
            print("Error: Could not change password.")
        }
    } else if let error = error {
        print("Error occurred: \(error.localizedDescription)")
    }
}
```

## ユーティリティのプロパティ

AWSMobileClient は、ローカルに自動的にキャッシュされるいくつかのプロパティヘルパーを提供します。

```swift
AWSMobileClient.default().username //String
AWSMobileClient.default().isSignedIn //Boolean
AWSMobileClient.default().identityId //String
```

> 注: プロパティ `username` は、Cognito User Pools でユーザー名ベースの認証を使用している場合にのみ使用できます。

## セキュリティトークンの管理

AWSMobileClientで認証を使用する場合、Amazon Cognitoトークンを手動で更新する必要はありません。トークンは必要に応じてSDKによって自動的にリフレッシュされます。

### OIDCトークン

```swift
AWSMobileClient.default().getTokens { (tokens, error) in
    if let error = error {
        print("Error getting token \(error.localizedDescription)")
    } else if let tokens = tokens {
        print(tokens.accessToken!.tokenString!)
    }
}
```

### AWS 資格情報

```swift
AWSMobileClient.default().getAWSCredentials { (credentials, error) in
    if let error = error {
        print("\(error.localizedDescription)")
    } else if let credentials = credentials {
        print(credentials.accessKey)
    }
}
```
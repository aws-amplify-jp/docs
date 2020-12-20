```swift

import AmplifyPlugins

func getEscapeHatch() {
    do {
        let plugin = try Amplify.Auth.getPlugin(for: "awsCognitoAuthPlugin") as! AWSCognitoAuthPlugin
        guard case let .awsMobileClient(awsmobileclient) = plugin.getEscapeHatch() else {
            print("Failed to fetch escape hatch")
            return
        }
        print("Fetched escape hatch - \(awsmobileclient)")

    } catch {
        print("Error occurred while fetching the escape hatch \(error)")
    }
}
```

エスケープハッチオブジェクトを通じて`AWSMobileClient` 資格情報の apis のような `getToken`、 `getAWSCredentials` を使用することは推奨されません。

他のソーシャルプロバイダからの有効なトークンを使用して、 `federatedSignin` へのエスケープハッチを使用できます。詳細はこちら [](https://docs.amplify.aws/sdk/auth/federated-identities/q/platform/ios)

```swift
awsmobileclient.federatedSignIn(providerName: IdentityProvider.apple.rawValue,
                                            token: "<APPLE_TOKEN_HERE>") { (userState, error) in
        if let error = error {
            print("Error in federatedSignIn: \(error)")
            return
        }

        guard let userState = userState else {
            print("userState unexpectedly nil")
            return
        }
        print("federatedSignIn successful: \(userState)")

}
```        
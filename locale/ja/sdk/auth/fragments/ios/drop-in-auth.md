`AWSMobileClient` クライアントは、アプリケーションに認証のための完全な機能を簡単に追加できる「ドロップイン」UIコンポーネントをサポートしています。

```swift
AWSMobileClient.default().showSignIn(
    navigationController: self.navigationController!, { (signInState, error) in
    if let signInState = signInState {
        print("Sign in flow completed: \(signInState)")
    } else if let error = error {
        print("error logging in: \(error.localizedDescription)")
    }
})
```

> **Note**: The drop-in UI requires the use of a navigation controller. Please make sure your app has an active navigation controller which is passed in via the `navigationController` parameter.

## カスタマイズ

`AWSMobileClient` を使用して、ドロップインUIの次のプロパティを変更できます:
- **ロゴ**: png または jpg の任意の画像ファイル
- **Background Color**: Any iOS UIColor

```swift
AWSMobileClient.default()
    .showSignIn(navigationController: self.navigationController!,
                    signInUIOptions: SignInUIOptions(
                        // dismiss the sign-in process
                        canCancel: false,
                        logoImage: UIImage(
                            named: "MyCustomLogo"
                        ),
                        backgroundColor: UIColor.black)) { (result, err) in
                        //handle results and errors               
}
```
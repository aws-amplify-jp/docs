To initialize the Amplify Auth category, pass in the AWSCognitoAuthPlugin to 'Amplify.add()'.  When we are done calling `add()` on each category that we need, we finish configuring Amplify by calling `Amplify.configure()`.

**Add the following imports** to the top of your `AppDelegate.swift` file:

```swift
import Amplify
import AmplifyPlugins
```

**AppDelegateの** アプリケーションに次のコード `を追加します:didFinishLaunchingWithOptions` メソッド:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.configure()
        print("Amplify configured with auth plugin")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }

    return true
}
```
このアプリケーションをビルドして実行すると、コンソールウィンドウに次のようなものが表示されます:

```bash
Amplify configured with auth plugin
```
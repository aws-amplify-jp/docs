To initialize the Amplify API category, we are required to use the `Amplify.add()` method for the plugin followed by calling `Amplify.configure()`.

**Add the following imports** to the top of your `AppDelegate.swift` file:
```swift
import Amplify
import AmplifyPlugins
```

**AppDelegateの** アプリケーションに次のコード `を追加します:didFinishLaunchingWithOptions` メソッド:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    do {
        try Amplify.add(plugin: AWSAPIPlugin(modelRegistration: AmplifyModels()))
        try Amplify.configure()
        print("Amplify configured with API plugin")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }

    return true
}
```
このアプリケーションをビルドして実行すると、コンソールウィンドウに次のようなものが表示されます:

```console
Amplify configured with API plugin
```
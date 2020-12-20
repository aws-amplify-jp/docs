Amplify DataStore コールを初期化するには `Amplify.add(plugin:)` メソッドを追加し、 `AWSDataStorePlugin`を追加し、 `Amplify.configure()` を呼び出します。

**Add the following imports** to the top of your `AppDelegate.swift` file:

```swift
import Amplify
import AmplifyPlugins
```

**AppDelegateの** アプリケーションに次のコード `を追加します:didFinishLaunchingWithOptions` メソッド:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    do {
        // AmplifyModels is generated in the previous step
        let dataStorePlugin = AWSDataStorePlugin(modelRegistration: AmplifyModels())
        try Amplify.add(plugin: dataStorePlugin)
        try Amplify.configure()
        print("Amplify configured with DataStore plugin")
    } catch {
        print("Failed to initialize Amplify with \(error)")
        return false
    }

    return true
}
```
このアプリケーションをビルドして実行すると、コンソールウィンドウに次のようなものが表示されます:

```console
Amplify configured with DataStore plugin
```

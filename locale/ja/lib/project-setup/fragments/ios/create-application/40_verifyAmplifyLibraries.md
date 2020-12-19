**AppDelegate.swift** を開き、 `import Amplify` をファイルの上部に追加します:
```swift
import Amplify
```

**Amplifyがプロジェクトにコンパイルできることを確認するために、以下の機能** を更新します。
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    do {
        try Amplify.configure()
    } catch {
        print("An error occurred setting up Amplify: \(error)")
    }
    return true
}
```

プロジェクトをビルドする (`Cmd+b`) そうすると、Amplifyライブラリがプロジェクトに追加され、アプリケーションを実行できるようになります。

Optionally, if you'd like to see additional log messages of what amplify is doing during configuration, you can turn on verbose logging before calling `Amplify.configure()`:
```swift
do {
    Amplify.Logging.logLevel = .verbose
    // Amplify の設定...
    try Amplify.configure()
    // ...
```

詳細なログオン時にアプリケーションを再実行すると、次のメッセージが表示されます:
```console
[Amplify]
[Amplify] 構成: nil
```

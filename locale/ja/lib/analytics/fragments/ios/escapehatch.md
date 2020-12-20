Amplifyが機能を提供していない高度なユースケースでは、エスケープハッチを取得して、基礎となるAmazon Pinpointクライアントにアクセスできます。

次のインポートを追加:

```swift
import AmplifyPlugins
import AWSPinpoint
```

次に、このコードでエスケープハッチを取得します。

```swift
func getEscapeHatch() {
    do {
        let plugin = try Amplify.Analytics.getPlugin(for: "awsPinpointAnalyticsPlugin") as! AWSPinpointAnalyticsPlugin
        let awsPinpoint = plugin.getEscapeHatch()
    } catch {
        print("Get escape hatch failed with error - \(error)")
    }
}
```
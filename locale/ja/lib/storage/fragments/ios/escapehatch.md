Amplifyが機能を提供していない高度なユースケースの場合は、エスケープハッチを取得して [AWSS3](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSS3/Classes/AWSS3.html) インスタンスにアクセスできます。

次のインポートを追加:

```swift
import AmplifyPlugins
import AWSS3
```

このコードでエスケープハッチを取得します。

```swift
func getEscapeHatch() {
    do {
        let plugin = try Amplify.Storage.getPlugin(for: "awsS3StoragePlugin") as! AWSS3StoragePlugin
        let awsS3 = plugin.getEscapeHatch()
    } catch {
        print("Get escape hatch failed with error - \(error)")
    }
}
```
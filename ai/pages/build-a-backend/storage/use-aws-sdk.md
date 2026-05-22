---
title: "AWS SDK for S3 APIを使用する"
section: "build-a-backend/storage"
platforms: ["android", "swift"]
gen: 2
last-updated: "2024-09-24T23:57:23.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/storage/use-aws-sdk/"
---

Amplifyが機能を提供していない高度なユースケースの場合、エスケープハッチを取得して`S3Client`インスタンスにアクセスできます。

<!-- Platform: android -->

#### [Java]

<Callout>

ブロッキングインターフェースまたはフューチャーに基づいた同等の非同期インターフェースのいずれかを使用して、JavaからKotlinクライアントを使用する方法について詳しくは、[こちら](https://github.com/awslabs/smithy-kotlin/blob/main/docs/design/kotlin-smithy-sdk.md#java-interop)を参照してください。

</Callout>

```java
AWSS3StoragePlugin plugin = (AWSS3StoragePlugin) Amplify.Storage.getPlugin("awsS3StoragePlugin");
S3Client client = plugin.getEscapeHatch();
```

#### [Kotlin]

```kotlin
val plugin = Amplify.Storage.getPlugin("awsS3StoragePlugin") as AWSS3StoragePlugin
val client = plugin.escapeHatch
```

<!-- /Platform -->

<!-- Platform: swift -->
以下のインポートを追加します。

```swift
import AWSS3StoragePlugin
```

次に、このコードを使用してエスケープハッチを取得します。

```swift
do {
    // Retrieve the reference to AWSS3StoragePlugin
    let plugin = try Amplify.Storage.getPlugin(for: "awsS3StoragePlugin")
    guard let storagePlugin = plugin as? AWSS3StoragePlugin else {
        return
    }

    // Retrieve the reference to S3Client
    let s3Client = storagePlugin.getEscapeHatch()

    // Make requests using s3Client...
    // ...
} catch {
    print("Get escape hatch failed with error - \(error)")
}
```

クライアント追加ドキュメントについては、[AWS SDK for Swift クライアントドキュメント](https://docs.aws.amazon.com/sdk-for-swift/latest/developer-guide/using-client-services.html)を参照してください。S3Clientコード例については、[SDK for Swiftを使用したAmazon S3の例](https://docs.aws.amazon.com/sdk-for-swift/latest/developer-guide/swift_s3_code_examples.html)を参照してください。
<!-- /Platform -->

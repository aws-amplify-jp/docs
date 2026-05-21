---
title: "AWS SDKを使用する"
section: "frontend/analytics"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/sdk/"
---

<!-- Platform: swift -->
Amplifyが提供していない高度なユースケースでは、エスケープハッチを取得して基盤となるAmazon Pinpointクライアントにアクセスできます。

次のインポートを追加します:

```swift
import AWSPinpointAnalyticsPlugin
```

次のコードを使用してエスケープハッチを取得します:

```swift
do {
    // Retrieve the reference to AWSPinpointAnalyticsPlugin
    let plugin = try Amplify.Analytics.getPlugin(for: "awsPinpointAnalyticsPlugin")
    guard let analyticsPlugin = plugin as? AWSPinpointAnalyticsPlugin else {
        return
    }

    // Retrieve the reference to PinpointClientProtocol
    let pinpointClient = analyticsPlugin.getEscapeHatch()

    // Make requests using pinpointClient...
    // ...
} catch {
    print("Get escape hatch failed with error - \(error)")
}
```
<!-- /Platform -->

<!-- Platform: android -->
Amplifyが提供していない高度なユースケースでは、エスケープハッチを取得して基盤となるAmazon Pinpointクライアントにアクセスできます。

#### [Java]

<Callout>

KotlinクライアントをJavaで使用する方法について、ブロッキングインターフェイスまたはフューチャーベースの等価な非同期インターフェイスを使用する詳細は[こちら](https://github.com/awslabs/smithy-kotlin/blob/main/docs/design/kotlin-smithy-sdk.md#java-interop)を参照してください。

</Callout>

```java
AWSPinpointAnalyticsPlugin plugin = (AWSPinpointAnalyticsPlugin)
    Amplify.Analytics.getPlugin("awsPinpointAnalyticsPlugin");
PinpointClient pinpointClient = plugin.getEscapeHatch();
```

#### [Kotlin]

```kotlin
val plugin = Amplify.Analytics.getPlugin("awsPinpointAnalyticsPlugin")
val pinpointClient = (plugin as AWSPinpointAnalyticsPlugin).escapeHatch
```

#### [RxJava]

```java
AWSPinpointAnalyticsPlugin plugin = (AWSPinpointAnalyticsPlugin)
    RxAmplify.Analytics.getPlugin("awsPinpointAnalyticsPlugin");
PinpointClient pinpointClient = plugin.getEscapeHatch();
```

<!-- /Platform -->

---
title: "ロギング用の AWS SDK を使用"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/sdk/"
---

Amplify が機能を提供していない高度なユースケースでは、エスケープ ハッチを取得して、基になる Amazon CloudWatch クライアントにアクセスできます。

<!-- Platform: android -->
エスケープ ハッチは、基になる `CloudWatchLogsClient` インスタンスへのアクセスを提供します。次のコードでエスケープ ハッチを取得します。

**Gradle インポート**

```kotlin title="app/build.gradle.kts" 
implementation("aws.sdk.kotlin:cloudwatchlogs:KOTLIN_SDK_VERSION")
```

#### [Java]

```java
AWSCloudWatchLoggingPlugin plugin = (AWSCloudWatchLoggingPlugin)Amplify.Logging.getPlugin("awsCloudWatchLoggingPlugin");
CloudWatchLogsClient client = plugin.getEscapeHatch();
```

#### [Kotlin]

```kotlin
val plugin = Amplify.Logging.getPlugin("awsCloudWatchLoggingPlugin") as AWSCloudWatchLoggingPlugin
val client = plugin.escapeHatch
```

#### [RxJava]

```java
AWSCloudWatchLoggingPlugin plugin = (AWSCloudWatchLoggingPlugin)Amplify.Logging.getPlugin("awsCloudWatchLoggingPlugin");
CloudWatchLogsClient client = plugin.getEscapeHatch();
```

<!-- /Platform -->

<!-- Platform: swift -->
インポートステートメントを追加

```swift
import AWSCloudWatchLoggingPlugin
import AWSCloudWatchLogs
```

CloudWatchLogsClientProtocol インスタンスへの直接参照を取得し、[AWS SDK for Swift](https://docs.aws.amazon.com/sdk-for-swift/index.html) を経由して AWSCloudWatch と直接相互作用します

```swift
let cloudWatchPlugin = try Amplify.Logging.getPlugin(for: "awsCloudWatchLoggingPlugin") as? AWSCloudWatchLoggingPlugin
let cloudWatchClient: CloudWatchLogsClientProtocol? = cloudWatchPlugin?.getEscapeHatch()
```
<!-- /Platform -->

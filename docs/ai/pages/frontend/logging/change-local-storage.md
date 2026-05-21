---
title: "ローカルストレージを変更する"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/change-local-storage/"
---

Amplify Logger を使用する場合、ログされたすべてのメッセージは、CloudWatch に送信される前にまずユーザーのデバイスにローカルで保存されます。

このセクションでは、ローカルに保存されるログの最大量を構成する方法について説明します。これは、ネットワークの可用性とオフライン使用ケースに応じてローカルに保存されるログの量を決定するのに役立ちます。

## ローカルストレージの最大サイズを変更する

以下は、ローカルストレージサイズを 2 MB に設定する例です：

  #### [設定ファイルを使用する場合]
設定ファイルの `localStoreMaxSizeInMB` フィールドを更新します。

```json
{
    "awsCloudWatchLoggingPlugin": {
        "enable": true,
        "logGroupName": "<log-group-name>",
        "region": "<region>",
        "localStoreMaxSizeInMB": 2,
        "flushIntervalInSeconds": 60,
        "loggingConstraints": {
            "defaultLogLevel": "WARN"
        }
    }
}
```
  
  #### [コードを使用する場合]
    <!-- Platform: android -->

#### [Java]

```java
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, true, 2);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

#### [Kotlin]

```kotlin
val config = AWSCloudWatchLoggingPluginConfiguration(logGroupName = <log-group-name>, region = <region>, localStoreMaxSizeInMB = 2)
Amplify.addPlugin(AWSCloudWatchLoggingPlugin(config))
```

#### [RxJava]

```java
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, true, 2);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

<!-- /Platform -->

<!-- Platform: swift -->
`AWSCloudWatchLoggingPlugin` の初期化と設定で `localStoreMaxSizeInMB` パラメータを指定します。

```swift
do {
    let loggingConfiguration = AWSCloudWatchLoggingPluginConfiguration(logGroupName: "<log-group-name>", region: "<region>", localStoreMaxSizeInMB: 2)
    let loggingPlugin = AWSCloudWatchLoggingPlugin(loggingPluginConfiguration: loggingConfiguration)
    try Amplify.add(plugin: loggingPlugin)
    try Amplify.configure(with: .amplifyOutputs)
} catch {
    assert(false, "Error initializing Amplify: \(error)")
}
```
<!-- /Platform -->

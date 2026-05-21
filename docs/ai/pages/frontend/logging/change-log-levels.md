---
title: "ログレベルの変更"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/change-log-levels/"
---

このセクションでは、Amplify ロガーを使用する際にアプリケーションのログレベルを設定する方法について学びます。これは、ユースケースに最適なログレベルを決定し、Amazon CloudWatch にキャプチャしたいエラーまたは警告のレベルを決定するのに役立ちます。

## デフォルトログレベルを変更する

以下は、デフォルトログレベルを `WARN` に設定する例です：

<!-- Platform: android -->

  #### [設定ファイルを使用する]
`loggingConstraints` の下の `defaultLogLevel` フィールドを更新します。

```json
{
    "awsCloudWatchLoggingPlugin": {
        "enable": true,
        "logGroupName": "<log-group-name>",
        "region": "<region>",
        "localStoreMaxSizeInMB": 1,
        "flushIntervalInSeconds": 60,
        "loggingConstraints": {
            "defaultLogLevel": "WARN"
        }
    }
}
```

サポートされているログレベルは以下の通りです：
* `ERROR`
* `WARN`
* `INFO`
* `DEBUG`
* `VERBOSE`
* `NONE`

ログレベルを `NONE` に設定すると、事実上ログが無効になります。
  
  #### [コードを使用する]
AWSCloudWatchLoggingPlugin の初期化と設定時にデフォルトログレベルを指定します。

#### [Java]

```java
LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN);
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

#### [Kotlin]

```kotlin
val loggingConstraints = LoggingConstraints(defaultLogLevel = LogLevel.WARN)
val config = AWSCloudWatchLoggingPluginConfiguration(logGroupName = <log-group-name>, region = <region>, loggingConstraints = loggingConstraints)
Amplify.addPlugin(AWSCloudWatchLoggingPlugin(config))
```

#### [RxJava]

```java
LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN);
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>,<region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

サポートされているログレベルは以下の通りです：
```java
LogLevel.ERROR
LogLevel.WARN
LogLevel.INFO
LogLevel.DEBUG
LogLevel.VERBOSE
LogLevel.NONE
```
ログレベルを LogLevel.NONE に設定すると、事実上ログが無効になります。

  

<!-- /Platform -->

<!-- Platform: swift -->

  #### [設定ファイルを使用する]
`loggingConstraints` の下の `defaultLogLevel` フィールドを更新します。

```json
{
    "awsCloudWatchLoggingPlugin": {
        "enable": true,
        "logGroupName": "<log-group-name>",
        "region": "<region>",
        "localStoreMaxSizeInMB": 1,
        "flushIntervalInSeconds": 60,
        "loggingConstraints": {
            "defaultLogLevel": "WARN"
        }
    }
}
```

サポートされているログレベルは以下の通りです：
* `ERROR`
* `WARN`
* `INFO`
* `DEBUG`
* `VERBOSE`
* `NONE`

ログレベルを `NONE` に設定すると、事実上ログが無効になります。
  
  #### [コードを使用する]
`AWSCloudWatchLoggingPlugin` の初期化と設定時にデフォルトログレベルを指定します。

```swift
do {
    let loggingConstraints = LoggingConstraints(defaultLogLevel: .warn)
    let loggingConfiguration = AWSCloudWatchLoggingPluginConfiguration(logGroupName: "<log-group-name>", region: "<region>", loggingConstraints: loggingConstraints)
    let loggingPlugin = AWSCloudWatchLoggingPlugin(loggingPluginConfiguration: loggingConfiguration)
    try Amplify.add(plugin: loggingPlugin)
} catch {
    assert(false, "Error initializing Amplify: \(error)")
}
```

サポートされているログレベルは以下の通りです：
```swift
LogLevel.error
LogLevel.warn
LogLevel.info
LogLevel.debug
LogLevel.verbose
LogLevel.none
```

ログレベルを `LogLevel.none` に設定すると、事実上ログが無効になります。
  

<!-- /Platform -->

## カテゴリ別にログレベルを設定する

各 Amplify カテゴリは、独自のログレベルを持つように設定できます。

以下は、Storage と Auth カテゴリに異なるログレベルを設定する例です。

  #### [設定ファイルを使用する]
`categoryLogLevel` セクションを追加し、各カテゴリとそのログレベルを指定します。

```json
{
    "awsCloudWatchLoggingPlugin": {
        "enable": true,
        "logGroupName": "<log-group-name>",
        "region": "<region>",
        "localStoreMaxSizeInMB": 1,
        "flushIntervalInSeconds": 60,
        "loggingConstraints": {
            "defaultLogLevel": "ERROR",
            "categoryLogLevel": {
                    "Authentication": "VERBOSE",
                    "Storage": "DEBUG"
            }
        }
    }
}
```

特定のカテゴリのログを無効にするには、ログレベルを `NONE` に設定します。

  
  #### [コードを使用する]
  <!-- Platform: android -->
`AWSCloudWatchLoggingPlugin` の初期化と設定時にカテゴリとそれに対応するログレベルのマップを指定します。

#### [Java]

```java
Map<CategoryType, LogLevel> categoryOverrides = new HashMap<>();
categoryOverrides.put(CategoryType.AUTH, LogLevel.VERBOSE);
categoryOverrides.put(CategoryType.STORAGE, LogLevel.DEBUG);
LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN, categoryOverrides);
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

#### [Kotlin]

```kotlin
val categoryOverrides = mapOf<CategoryType, LogLevel>(CategoryType.AUTH to LogLevel.VERBOSE, CategoryType.STORAGE to LogLevel.DEBUG)
val loggingConstraints = LoggingConstraints(defaultLogLevel = LogLevel.WARN, categoryLogLevel = categoryOverrides)
val config = AWSCloudWatchLoggingPluginConfiguration(logGroupName = <log-group-name>, region = <region>, loggingConstraints = loggingConstraints)
Amplify.addPlugin(AWSCloudWatchLoggingPlugin(config))
```

#### [RxJava]

```java
Map<CategoryType, LogLevel> categoryOverrides = new HashMap<>();
categoryOverrides.put(CategoryType.AUTH, LogLevel.VERBOSE);
categoryOverrides.put(CategoryType.STORAGE, LogLevel.DEBUG);
LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN, categoryOverrides);
AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>,<region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

<!-- /Platform -->

  <!-- Platform: swift -->
`AWSCloudWatchLoggingPlugin` の初期化と設定時にカテゴリとそれに対応するログレベルの辞書を指定します。

```swift
do {
    let categoryLogLevels: [String: LogLevel] = ["Authentication": .verbose, "Storage": .debug]
    let loggingConstraints = LoggingConstraints(defaultLogLevel: .warn, categoryLogLevel: categoryLogLevels)
    let loggingConfiguration = AWSCloudWatchLoggingPluginConfiguration(logGroupName: "<log-group-name>", region: "<region>", loggingConstraints: loggingConstraints)
    let loggingPlugin = AWSCloudWatchLoggingPlugin(loggingPluginConfiguration: loggingConfiguration)
    try Amplify.add(plugin: loggingPlugin)
} catch {
    assert(false, "Error initializing Amplify: \(error)")
}
```

特定のカテゴリのログを無効にするには、ログレベルを `LogLevel.none` に設定します。
<!-- /Platform -->

  

<!-- Platform: android -->
以下は、Amplify がライブラリからのエラーを自動的にログする際に使用されるデフォルトの既存 Amplify カテゴリ名です。
* `ANALYTICS`
* `API`
* `AUTH`
* `DATASTORE`
* `HUB`
* `LOGGING`
* `NOTIFICATIONS`
* `PREDICTIONS`
* `STORAGE`
* `GEO`
<!-- /Platform -->

<!-- Platform: swift -->
以下は、Amplify がライブラリからのエラーを自動的にログする際に使用されるデフォルトの既存 Amplify カテゴリ名です。
* `Analytics`
* `API`
* `Authentication`
* `DataStore`
* `Geo`
* `Hub`
* `Logging`
* `Predictions`
* `PushNotifications`
* `Storage`
<!-- /Platform -->

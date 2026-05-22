---
title: "ユーザーのみを許可リストとして設定する"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/configure-user/"
---

Amplify認証済みユーザーごとに、独自のロギング設定を構成できます。これにより、ユーザーごとにより細かくデバッグの問題を有効にするのに役立ちます。

## Amplify Authを使用してuserIDを取得する

必要に応じて、Amplify Authカテゴリを使用して、特定のユーザーのuserIdを取得できます。Amazon Cognitoコンソールにアクセスしてユーザープール内の`User ID`を検査することで、userIdを取得することもできます。

<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.getCurrentUser(
   user.userId,
   error -> // failed to fetch user
);
```

#### [Kotlin]

```kotlin
Amplify.Auth.getCurrentUser({ user ->
    user.userId,{
    // failed to get user
})
```

#### [RxJava]

```java
RxAmplify.Auth.getCurrentUser().subscribe(
        result -> result.userId,
        error -> // failed to get user
 );
```

<!-- /Platform -->

<!-- Platform: swift -->
```swift
Amplify.Auth.getCurrentUser().userId
```
<!-- /Platform -->

## ユーザーのみを許可リストとして設定する

以下は、認証されたユーザーに対して異なるデフォルトおよびカテゴリログレベルを設定する例です。

  #### [With Configuration File]
    `userLogLevel`セクションを追加し、各ユーザー識別子に対して`defaultLogLevel`と`categoryLogLevel`を追加します。

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
            "userLogLevel": {
                "xyz-123": {
                    "defaultLogLevel": "DEBUG",
                    "categoryLogLevel": {
                        "Storage": "VERBOSE",
                        "Api": "VERBOSE"
                    }
                }
            }
        }
    }
}
```

  
  #### [With Code]

<!-- Platform: android -->
`AWSCloudWatchLoggingPlugin`の初期化と設定時に、`UserLogLevel`のマップを提供します。

#### [Java]

```java
Map<CategoryType, LogLevel> categoryOverrides = new HashMap<>();
categoryOverrides.put(CategoryType.AUTH, LogLevel.VERBOSE);
categoryOverrides.put(CategoryType.STORAGE, LogLevel.DEBUG);

UserLogLevel userLogLevel = new UserLogLevel(LogLevel.WARN, categoryOverrides);

Map<String, UserLogLevel> userOverrides = new HashMap<>();
userOverrides.put("USER_ID", userLogLevel);

LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN, categoryOverrides, userOverrides);

AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

#### [Kotlin]

```kotlin
val categoryOverrides = mapOf(CategoryType.AUTH to LogLevel.VERBOSE, CategoryType.STORAGE to LogLevel.DEBUG)
val userOverrides = mapOf("USER_ID" to UserLogLevel(LogLevel.WARN, categoryOverrides))

val loggingConstraints = LoggingConstraints(defaultLogLevel = LogLevel.WARN, userLogLevel = userOverrides)

val config = AWSCloudWatchLoggingPluginConfiguration(logGroupName = <log-group-name>, region = <region>, loggingConstraints = loggingConstraints)
Amplify.addPlugin(AWSCloudWatchLoggingPlugin(config))
```

#### [RxJava]

```java
Map<CategoryType, LogLevel> categoryOverrides = new HashMap<>();
categoryOverrides.put(CategoryType.AUTH, LogLevel.VERBOSE);
categoryOverrides.put(CategoryType.STORAGE, LogLevel.DEBUG);

UserLogLevel userLogLevel = new UserLogLevel(LogLevel.WARN, categoryOverrides);

Map<String, UserLogLevel> userOverrides = new HashMap<>();
userOverrides.put("USER_ID", userLogLevel);

LoggingConstraints loggingConstraints = new LoggingConstraints(LogLevel.WARN, categoryOverrides, userOverrides);

AWSCloudWatchLoggingPluginConfiguration config = new AWSCloudWatchLoggingPluginConfiguration (<log-group-name>, <region>, loggingConstraints);
Amplify.addPlugin(new AWSCloudWatchLoggingPlugin(config));
```

<!-- /Platform -->
<!-- Platform: swift -->
`AWSCloudWatchLoggingPlugin`の初期化と設定時に、`UserLogLevel`の辞書を提供します。

```swift
do {
    let categoryLogLevels: [String: LogLevel] = ["Storage": .verbose, "API": .verbose]
    let userLogLevel = UserLogLevel(defaultLogLevel: .debug, categoryLogLevel: categoryLogLevels)
    let userLogLevels: [String: UserLogLevel] = ["xyz-123": userLogLevel]
    let loggingConstraints = LoggingConstraints(defaultLogLevel: .warn, userLogLevel: userLogLevels)
    let loggingConfiguration = AWSCloudWatchLoggingPluginConfiguration(logGroupName: "<log-group-name>", region: "<region>", loggingConstraints: loggingConstraints)
    let loggingPlugin = AWSCloudWatchLoggingPlugin(loggingPluginConfiguration: loggingConfiguration)
    try Amplify.add(plugin: loggingPlugin)
} catch {
    assert(false, "Error initializing Amplify: \(error)")
}
```
<!-- /Platform -->

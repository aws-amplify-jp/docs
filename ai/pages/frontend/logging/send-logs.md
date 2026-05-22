---
title: "ログを送信"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/send-logs/"
---

Amplify Loggerを使用すると、Amplifyライブラリによってキャッチされたエラーや独自のカスタムログメッセージを追加することで、Amazon CloudWatchにログを送信できます。CloudWatchに送信するログメッセージのレベルをカスタマイズすることもできます。

## ログメッセージ

<Callout>

ログメッセージをログに記録する際は、セキュリティのベストプラクティスに従う必要があります。これには、ログメッセージの検証、および個人識別情報や機密データが含まれていないことを確認することが含まれます。

</Callout>

Amplify loggerを使用して特定のネームスペースにメッセージをログに記録し、CloudWatchに送信されるときに同様のログをグループ化するのに役立ちます。これを実現するには、`Logger`のインスタンスを取得し、`category name`および/または`namespace`を指定します。`Logger`インスタンスを使用して、目的のログレベルでメッセージをログに記録します。`category name`と`namespace`の値は、CloudWatchに表示されるログメッセージにタグを付けるために使用されます。また、新しい`Logger`インスタンスを作成せずにロガーを識別して再度取得するためにも使用されます。

JSON形式のログメッセージをログに記録して、[AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)のクエリおよびフィルター機能を活用することもできます。

<!-- Platform: android -->

#### [Java]

```java
Logger logger = Amplify.Logging.logger(AmplifyCategory.Auth, "<namespace>")
try {
  String result = doSomething();
  logger.debug("result: " + result);
} catch(Exception: exception) {
  logger.error("operation failed", exception);
}

```

#### [Kotlin]

```kotlin
val logger = Amplify.Logging.logger(AmplifyCategory.Auth, "<namespace>")
try {
  val result = doSomething()
  logger.debug("result: $result")
} catch (exception: Exception) {
  logger.error("operation failed", exception)
}
```

#### [RxJava]

```java
Logger logger = Amplify.Logging.logger(AmplifyCategory.Auth, "<namespace>")
try {
  String result = doSomething();
  logger.debug("result: " + result);
} catch(Exception: exception) {
  logger.error("operation failed", exception);
}
```

以下は、ライブラリからのエラーを自動的にログに記録する際にAmplifyがデフォルトで使用する既存のAmplifyカテゴリー名です。
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
```swift
let logger = Amplify.Logging.logger(forCategory: "Authentication", forNamespace: "<your-code-namespace>")
do {
    let jsonEncoder = JSONEncoder()
    let person = Person(firstName: "John", lastName: "Doe", age: 25)
    let jsonData = try jsonEncoder.encode(person)
    let jsonString = String(data: jsonData, encoding: String.Encoding.utf8)!
    logger.debug(jsonString)
} catch {
    logger.error("Error encoding person instance")
}
```

以下は、ライブラリからのエラーを自動的にログに記録する際にAmplifyがデフォルトで使用する既存のAmplifyカテゴリー名です。
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

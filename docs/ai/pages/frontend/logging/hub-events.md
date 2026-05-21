---
title: "ログイベントをリッスンする"
section: "frontend/logging"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/logging/hub-events/"
---

Amplify Loggerは、Amplifyの使用時に発生したエラーをAmplify Hubを通じて送信します。ログの使用時にエラーが発生しないようにするため、ログメッセージを検証し、ベストセキュリティプラクティスに従う必要があります。さらに、ログメッセージが[Amazon CloudWatchログイベントサイズの256 KB](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html)を超えないようにする必要があります。

Amplify Hubからロギングイベントをリッスン/サブスクライブすることで、ロギングエラーイベントを取得できます。

    <!-- Platform: android -->

#### [Java]

```java
Amplify.Hub.subscribe(HubChannel.LOGGING,
            hubEvent -> {
                if (hubEvent.getName().equals(LoggingEventName.WRITE_LOG_FAILURE.toString())) {
                    Log.i("LOGGING", "Failed to write logs");
                } else if (hubEvent.getName().equals(LoggingEventName.FLUSH_LOG_FAILURE.toString())){
                    Log.i("LOGGING", "Failed to flush logs");
                }
            }
        );
```

#### [Kotlin]

```kotlin
Amplify.Hub.subscribe(
    HubChannel.LOGGING
) { hubEvent: HubEvent<*> ->
    if (hubEvent.name == LoggingEventName.WRITE_LOG_FAILURE.toString()) {
        Log.i("LOGGING", "Failed to write logs")
    } else if (hubEvent.name == LoggingEventName.FLUSH_LOG_FAILURE.toString()) {
        Log.i("LOGGING", "Failed to flush logs")
    }
}
```

#### [RxJava]

```java
RxAmplify.Hub.on(HubChannel.LOGGING)
.map(HubEvent::getName)
.subscribe(name -> {
    if (name.equals(LoggingEventName.WRITE_LOG_FAILURE.toString())) {
        Log.i("LOGGING", "Failed to write logs");
        return;
    } else if (name.equals(LoggingEventName.FLUSH_LOG_FAILURE.toString())) {
        Log.i("LOGGING", "Failed to flush logs");
        return;
    }
});
```

<!-- /Platform -->

    <!-- Platform: swift -->

#### [Listener]

```swift
import Amplify
```

```swift
// unsubscribeTokenがビュー内のインスタンス変数として宣言されていることを想定しています
unsubscribeToken = Amplify.Hub.listen(to: .logging) { payload in
    switch payload.eventName {
    case HubPayload.EventName.Logging.writeLogFailure:
        print("Error writing to local log")
    case HubPayload.EventName.Logging.flushLogFailure:
        print("Error sending log events to CloudWatch")
    default:
        break
    }
}
```

#### [Combine]

```swift
import Amplify
```

```swift
// sinkがコード内のインスタンス変数として宣言されていることを想定しています
sink = Amplify.Hub
    .publisher(for: .logging)
    .sink { payload in
        switch payload.eventName {
        case HubPayload.EventName.Logging.writeLogFailure:
            print("Error writing to local log")
        case HubPayload.EventName.Logging.flushLogFailure:
            print("Error sending log events to CloudWatch")
        default:
            break
        }
    }
```

<!-- /Platform -->

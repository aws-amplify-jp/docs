---
title: "イベントを記録する"
section: "frontend/analytics"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/record-events/"
---

<InlineFilter filters= {["android"]}>
## イベントを記録する

Amplify Analyticsプラグインを使用すると、アプリ内でカスタムイベントを簡単に記録できます。プラグインはデバイスがネットワーク接続を失った場合の再試行ロジックを処理し、リクエストを自動的にバッチ処理してネットワーク帯域幅を削減します。

#### [Java]

```java
AnalyticsEvent event = AnalyticsEvent.builder()
    .name("PasswordReset")
    .addProperty("Channel", "SMS")
    .addProperty("Successful", true)
    .addProperty("ProcessDuration", 792)
    .addProperty("UserAge", 120.3)
    .build();

Amplify.Analytics.recordEvent(event);
```

#### [Kotlin]

```kotlin
val event = AnalyticsEvent.builder()
    .name("PasswordReset")
    .addProperty("Channel", "SMS")
    .addProperty("Successful", true)
    .addProperty("ProcessDuration", 792)
    .addProperty("UserAge", 120.3)
    .build()

Amplify.Analytics.recordEvent(event)
```

#### [RxJava]

```java
AnalyticsEvent event = AnalyticsEvent.builder()
    .name("PasswordReset")
    .addProperty("Channel", "SMS")
    .addProperty("Successful", true)
    .addProperty("ProcessDuration", 792)
    .addProperty("UserAge", 120.3)
    .build();

RxAmplify.Analytics.recordEvent(event);
```

<Callout>

Amazon Pinpointのイベント数は、イベントを記録してから数分以内に更新されます。

ただし、フィルターセクションにイベントが表示されたり、カスタム属性がPinpointに表示されたりするには、最大30分かかる場合があります。

</Callout>

## イベントをフラッシュする

イベントはデフォルトで30秒ごとにネットワークにフラッシュされるように設定されています。この値は、`AWSPinpointAnalyticsPlugin`に`autoFlushEventsInterval`オプションを渡すことで変更できます。オプション値はミリ秒で測定されます。

```kotlin
val options = AWSPinpointAnalyticsPlugin.Options {
    autoFlushEventsInterval = 60_000
}
Amplify.addPlugin(AWSPinpointAnalyticsPlugin(options))
Amplify.configure(AmplifyOutputs(R.raw.amplify_outputs), this)
```

イベントを手動でフラッシュするには、以下を呼び出します：

#### [Java]

```java
Amplify.Analytics.flushEvents();
```

#### [Kotlin]

```kotlin
Amplify.Analytics.flushEvents()
```

#### [RxJava]

```java
RxAmplify.Analytics.flushEvents();
```

イベントをフラッシュするとき、Pinpointサービスに正常に送信されたイベントを含む[Hubイベント](/[platform]/frontend/auth/listen-to-auth-events/)が送信されます。これらのイベントのリストを受け取るには、`HubChannel.ANALYTICS`チャネルを購読し、`AnalyticsChannelEventName.FLUSH_EVENTS`タイプのイベントを処理します。

## グローバルプロパティ

グローバルプロパティを登録して、`Amplify.Analytics.recordEvent`のすべての呼び出しで送信できます。

#### [Java]

```java
Amplify.Analytics.registerGlobalProperties(
    AnalyticsProperties.builder()
        .add("AppStyle", "DarkMode")
        .build());
```

#### [Kotlin]

```kotlin
Amplify.Analytics.registerGlobalProperties(
    AnalyticsProperties.builder()
        .add("AppStyle", "DarkMode")
        .build())
```

#### [RxJava]

```java
RxAmplify.Analytics.registerGlobalProperties(
    AnalyticsProperties.builder()
        .add("AppStyle", "DarkMode")
        .build());
```

グローバルプロパティの登録を解除するには、`Amplify.Analytics.unregisterGlobalProperties()`を呼び出します：

#### [Java]

```java
Amplify.Analytics.unregisterGlobalProperties("AppStyle", "OtherProperty");
```

#### [Kotlin]

```kotlin
Amplify.Analytics.unregisterGlobalProperties("AppStyle", "OtherProperty")
```

#### [RxJava]

```java
RxAmplify.Analytics.unregisterGlobalProperties("AppStyle", "OtherProperty");
```

</InlineFilter>

<!-- Platform: flutter -->
## イベントを記録する

Amplify Analyticsプラグインを使用すると、アプリ内でカスタムイベントを簡単に記録できます。プラグインはデバイスがネットワーク接続を失った場合の再試行ロジックを処理し、リクエストを自動的にバッチ処理してネットワーク帯域幅を削減します。

```dart
Future<void> recordCustomEvent() async {
  final event = AnalyticsEvent('PasswordReset');

  event.customProperties
    ..addStringProperty('Channel', 'SMS')
    ..addBoolProperty('Successful', true);

  // 以下のようにプロパティを1つずつ追加することもできます
  event.customProperties.addIntProperty('ProcessDuration', 792);
  event.customProperties.addDoubleProperty('doubleKey', 120.3);

  await Amplify.Analytics.recordEvent(event: event);
}
```

<Callout>

Amazon Pinpointのイベント数は、イベントを記録してから数分以内に更新されます。

ただし、フィルターセクションにイベントが表示されたり、カスタム属性がAmazon Pinpointに表示されたりするには、最大30分かかる場合があります。

</Callout>

## イベントをフラッシュする

イベントはデフォルトで30秒ごとにネットワークにフラッシュされるように設定されています。これを変更したい場合は、`amplify_outputs.dart`を更新して、`autoFlushEventsInterval`の値（ミリ秒単位）を設定してください。この設定により、イベントは10秒ごとにフラッシュされます：

```json
{
  "Version": "1.0",
  "analytics": {
    "plugins": {
      "awsPinpointAnalyticsPlugin": {
        "pinpointAnalytics": {
          "appId": "<your-app-id>",
          "region": "<your-app-region>"
        },
        "pinpointTargeting": {
          "region": "<your-app-region>"
        },
        "autoFlushEventsInterval": 10
      }
    }
  }
}
```

> **注意**
>
> `autoFlushEventsInterval`を0に設定すると、イベントの自動フラッシュは**無効化**され、イベントの送信はあなたが責任を持つことになります。

イベントを手動でフラッシュするには、以下を呼び出します：

```dart
await Amplify.Analytics.flushEvents();
```

## グローバルプロパティ

グローバルプロパティを登録して、`Amplify.Analytics.recordEvent`のすべての呼び出しで送信できます。

```dart
Future<void> registerGlobalProperties() async {
  final properties = CustomProperties()
    ..addStringProperty('AppStyle', 'DarkMode');
  await Amplify.Analytics.registerGlobalProperties(
    globalProperties: properties,
  );
}
```

グローバルプロパティの登録を解除するには、`Amplify.Analytics.unregisterGlobalProperties()`を呼び出します：

```dart
Future<void> unregisterGlobalProperties() async {
  await Amplify.Analytics.unregisterGlobalProperties(
    propertyNames: ['AppStyle', 'OtherProperty'],
  );
}
```

さらに、`propertyNames`を指定しないで`unregisterGlobalProperties`を呼び出すことで、すべてのグローバルプロパティを削除できます：

```dart
Future<void> unregisterAllGlobalProperties() async {
  await Amplify.Analytics.unregisterGlobalProperties();
}
```
<!-- /Platform -->

<!-- Platform: swift -->
## イベントを記録する

Amplify Analyticsプラグインは、アプリ内でカスタムイベントを記録するための簡単なインターフェースを提供します：

```swift
let properties: AnalyticsProperties = [
    "eventPropertyStringKey": "eventPropertyStringValue",
    "eventPropertyIntKey": 123,
    "eventPropertyDoubleKey": 12.34,
    "eventPropertyBoolKey": true
]

let event = BasicAnalyticsEvent(
    name: "eventName",
    properties: properties
)

Amplify.Analytics.record(event: event)
```

<Callout>

Amazon Pinpointのイベント数は、イベントを記録してから数分以内に更新されます。

ただし、フィルターセクションにイベントが表示されたり、カスタム属性がPinpointに表示されたりするには、最大30分かかる場合があります。

</Callout>

## イベントをフラッシュする

デフォルトでは、イベントは60秒ごとに自動的にネットワークにフラッシュされます。

プラグインを初期化するときに`options`パラメータを通じてこれを変更できます。`AWSPinpointAnalyticsPlugin.Options`インスタンスを作成し、その`autoFlushEventsInterval`プロパティを、目的の値（秒単位）に設定します：

```swift
let options = AWSPinpointAnalyticsPlugin.Options(
    autoFlushEventsInterval: 60
)
try Amplify.add(plugin: AWSPinpointAnalyticsPlugin(options: options))
```

> **注意**
>
> `autoFlushEventsInterval`を0に設定すると、イベントの自動フラッシュは**無効化**され、イベントの送信はあなたが責任を持つことになります。

記録されたイベントをバックエンドに手動で送信するには、以下を呼び出します：

```swift
Amplify.Analytics.flushEvents()
```

プラグインはリクエストを自動的にバッチ処理してネットワーク帯域幅を削減し、デバイスが接続を失った場合の再試行ロジックを処理します。

## 認証イベント

ユーザーがアプリケーションで認証を行う頻度を示します。

**アナリティクス**ページで、**ユーザー**タブに**サインイン、サインアップ、および認証失敗**のグラフが表示されます。

ユーザーがアプリで認証を行う頻度を学習するには、アプリケーションコードを更新して、Pinpointが以下の標準イベントタイプを受け取るようにします：

 - `_userauth.sign_in`
 - `_userauth.sign_up`
 - `_userauth.auth_fail`

これらのイベントは、以下の方法で報告できます：

```swift
let event = BasicAnalyticsEvent(
    name: "_userauth.sign_in" // または受け入れられている値のいずれか
)
Amplify.Analytics.record(event: event)
```

## グローバルプロパティ

すべての`Amplify.Analytics.record(event:)`呼び出しに含まれるプロパティを登録できます。

```swift
let globalProperties: AnalyticsProperties = [
    "globalPropertyKey": "value"
]
Amplify.Analytics.registerGlobalProperties(globalProperties)
```

グローバルプロパティの登録を解除するには、`Amplify.Analytics.unregisterGlobalProperties()`を呼び出します：

```swift
// 引数がない場合、すべてのグローバルプロパティの登録が解除されます
Amplify.Analytics.unregisterGlobalProperties()

// または、登録を解除するプロパティを指定できます
let globalProperties = ["globalPropertyKey1", "globalPropertyKey2"]
Amplify.Analytics.unregisterGlobalProperties(globalProperties)
```
<!-- /Platform -->

<!-- Platform: javascript,  react-native, angular, nextjs, react, vue -->
## カスタムイベントを記録する

カスタムイベントを記録するには、`record` APIを呼び出します：

```javascript title="src/index.js"
import { record } from 'aws-amplify/analytics';

record({
  name: 'albumVisit',
});
```

<Callout>

アナリティクスイベントはメモリにバッファリングされ、定期的にサービスに送信されます。アプリケーションセッション間でローカルに保存されません。バッファリングされたイベントが送信される前にセッションが終了した場合、そのイベントは失われます。`flushEvents` APIを使用してバッファリングされたイベントをサービスに手動で送信してください。

</Callout>

## 属性付きのカスタムイベントを記録する

`record` APIを使用すると、イベントに追加の属性を追加できます。たとえば、_albumVisit_イベントで_artist_情報を記録するには：

```javascript title="src/index.js"
import { record } from 'aws-amplify/analytics';

record({
  name: 'albumVisit',
  attributes: { genre: '', artist: '' },
});
```

記録されたイベントはバッファリングされ、定期的にAmazon Pinpointに送信されます。

## エンゲージメントメトリクスを記録する

メトリクスをイベントに追加することもできます：

```javascript title="src/index.js"
import { record } from 'aws-amplify/analytics';

record({
  name: 'albumVisit',
  metrics: { minutesListened: 30 },
});
```

メトリクス値は、floatやintegerなどの`Number`型である必要があります。

<Callout>

Amazon Pinpointのイベント数は、イベントを記録してから数分以内に更新されます。

ただし、フィルターセクションにイベントが表示されたり、カスタム属性がAmazon Pinpointに表示されたりするには、最大30分かかる場合があります。

</Callout>

## イベントをフラッシュする

記録されたイベントはバッファに保存され、定期的にリモートサーバーに送信されます。必要に応じて、'flushEvents' APIを使用してバッファからすべてのイベントを手動でクリアできます。

```javascript title="src/index.js"
import { flushEvents } from 'aws-amplify/analytics';

flushEvents();
```
<!-- /Platform -->

## イベントを記録

Amplify Analytics プラグインは、カスタム イベントをアプリケーション内で記録するためのシンプルなインターフェイスを提供します。 このプラグインは、デバイスがネットワーク接続を解除した場合の再試行ロジックを処理し、ネットワーク帯域幅を削減するための要求を自動的にバッチ処理します。

```swift
func recordEvents() {
    let properties: AnalyticsProperties = [
        "eventPropertyStringKey": "eventPropertyStringValue",
        "eventPropertyIntKey": 123,
        "eventPropertyDoubleKey": 12.34,
        "eventPropertyBoolKey": true
    ]
    let event = BasicAnalyticsEvent(name: "eventName", properties: properties)
    Amplify.Analytics.record(event: event)
}
```

## イベントをフラッシュする

イベントは60秒ごとにネットワークにフラッシュするためのデフォルトの設定を持っています。これを変更したい場合は、 `amplifyconfigurationを更新してください。 son <code> は` のように `autoFlushEventsInterval` に設定します。

```json
{
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0",
    "analytics": {
        "plugins": {
            "awsPinpointAnalyticsPlugin": {
                "pinpointAnalytics": {
                    "appId": "AppID",
                    "region": "Region"
                },
                "pinpointTargeting": {
                    "region": "Region"
                },
                "autoFlushEventsInterval": 60
            }
        }
    }
}
```

> **Note**: If you set `autoFlushEventsInterval` to 0, you are responsible for calling `Amplify.Analytics.flushEvents()` to submit the recorded events to the backend.

## グローバルプロパティ

`Amplify.Analytics.record(event:)` のすべての呼び出しで使用するプロパティを登録できます。

```swift
let globalProperties: AnalyticsProperties = ["globalPropertyKey": "value"]
Amplify.Analytics.registerGlobalProperties(globalProperties)
```

グローバルプロパティの登録を解除するには、 `Amplify.Analytics.unregisterGlobalProperties()`:

```swift
// 引数なしで呼び出されたとき、すべてのグローバルプロパティを登録解除します
Amplify.Analytics.unregisterGlobalProperties()

// または、登録解除するプロパティを指定できます。
Amplify.Analytics.unregisterGlobalProperties(["globalPropertyKey1", "globalPropertyKey2"])
```

## 分析を無効にする

アナリティクスはバックエンドに自動的に送信されます（デフォルトでは有効）。コールを無効にするには:

```swift
Amplify.Analytics.disable()
```

## 分析を有効にする

通話を再度有効にするには:

```swift
Amplify.Analytics.enable()
```

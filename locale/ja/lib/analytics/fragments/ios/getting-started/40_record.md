イベントを記録するには、 `BasicAnalyticsEvent` を使用してイベントを指定し、 `Amplify.Analytics.record()` を呼び出します。

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
イベントを記録するには、 `AnalyticsEvent` を作成し、 `Amplify.Analytics.recordEvent()` を呼び出します。

```dart
AnalyticsEvent イベント = AnalyticsEvent("test");

event.properties.addBoolProperty("boolKey", true);
event.properties.addDoubleKey("doubleKey", 10.0);
event.properties.addIntProperty("intKey", 10);
event.properties.addStringProperty("stringKey", "stringValue");

Amplify.Analytics.recordEvent(event: event);
```
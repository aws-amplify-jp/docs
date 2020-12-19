## イベントを記録

Amplify分析プラグインを使用すると、アプリ内でカスタムイベントを簡単に記録できます。 このプラグインは、デバイスがネットワーク接続を解放し、ネットワーク帯域幅を削減するための要求を自動的にバッチ処理した場合の再試行ロジックを処理します。


```dart
AnalyticsEvent = AnalyticsEvent("PasswordReset");
event.properties.addStringProperty("Channel", SMS"); 
event.properties.addBoolProperty("Successful", true);
event.properties.addIntProperty("Processation", 792); 
event.properties.addDoubleProperty("doubleKey", 120.3);

Amplify.Analytics.recordEvent(event: event);
```

## イベントをフラッシュする

Events have default configuration to flush out to the network every 30 seconds. If you would like to change this, update `amplifyconfiguration.json` with the value in milliseconds you would like for `autoFlushEventsInterval`. This configuration will flush events every 10 seconds:

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
                "autoFlushEventsInterval": 10000
            }
        }
    }
}
```

イベントを手動でフラッシュするには、以下を呼び出します:


```dart
Amplify.Analytics.flushEvents();
```


## グローバルプロパティ

`Amplify.Analytics.recordEvent` のすべての呼び出しと一緒に送信されるグローバルプロパティを登録できます。

```dart
AnalyticsProperties = new AnalyticsProperties();
properties.addStringProperty("AppStyle", "DarkMode"); 
Amplify.Analytics.registerGlobalProperties(globalProperties: properties);
```

グローバルプロパティの登録を解除するには、 `Amplify.Analytics.unregisterGlobalProperties()`:


```dart
Amplify.Analytics.unregisterGlobalProperties(propertyName: ["AppStyle", "OtherProperty"]);
```

## 分析を無効にする

分析を無効にするには、以下を呼び出します。


```dart
Amplify.Analytics.disable();
```


## 分析を有効にする

再び有効化するには、以下のように呼び出します。


```dart
Amplify.Analytics.enable();
```


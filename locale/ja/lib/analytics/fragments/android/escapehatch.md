Amplifyが機能を提供していない高度なユースケースでは、エスケープハッチを取得して、基礎となるAmazon Pinpointクライアントにアクセスできます。

<amplify-block-switcher> <amplify-block name="Java">

```java
AWSPinpointAnalyticsPlugin plugin = (AWSPinpointAnalyticsPlugin) Amplify
        .Analytics
        .getPlugin("awsPinpointAnalyticsPlugin");
AnalyticsClient analyticsClient = plugin.getEscapeHatch();
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
val plugin: AWSPinpointAnalyticsPlugin = Amplify.Analytics
        .getPlugin("awsPinpointAnalyticsPlugin") as AWSPinpointAnalyticsPlugin
val analyticsClient: AnalyticsClient? = plugin.getEscapeHatch()
```

</amplify-block> </amplify-block-switcher>
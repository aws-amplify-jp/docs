Amplifyが機能を提供していない高度なユースケースの場合は、エスケープハッチを取得して `AmazonS3Client` インスタンスにアクセスできます。

<amplify-block-switcher> <amplify-block name="Java">

```java
AWSS3StoragePlugin プラグイン = (AWSS3StoragePlugin) Amplify.Storage.getPlugin("awsS3StoragePlugin");
AmazonS3Client クライアント = plugin.getEscapeHatch();
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
val プラグイン = Amplify.Storage.getPlugin("awsS3StoragePlugin") as AWSS3StoragePlugin
val クライアント = plugin.escapeHatch
```

</amplify-block> </amplify-block-switcher>
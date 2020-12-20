アプリに次のコードを追加します。

<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.addPlugin(new AWScognitoAuthPlugin());
Amplify.addPlugin(new AWSApiPlugin());
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.addPlugin(AWScognitoAuthPlugin())
Amplify.addPlugin(AWSApiPlugin())
```

</amplify-block> </amplify-block-switcher>

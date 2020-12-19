`Amplify.configure`を呼び出す前に認証プラグインを追加します。 更新 [あなたが追加したコード](~/lib/project-setup/create-application.md#n4-initialize-amplify-in-the-application) **前提条件**:

<amplify-block-switcher> <amplify-block name="Java">

```java
// Add this line, to include the Auth plugin.
Amplify.addPlugin(new AWScognitoAuthPlugin());
Amplify.configure(getApplicationContext());
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
// Add this line, to include the Auth plugin.
Amplify.addPlugin(AWScognitoAuthPlugin())
Amplify.configure(applicationContext)
```

</amplify-block> <amplify-block name="RxJava">

```java
// Add this line, to include the Auth plugin.
RxAmplify.addPlugin(new AWScognitoAuthPlugin());
RxAmplify.configure(getApplicationContext());
```

</amplify-block> </amplify-block-switcher>

Amplify AuthとAPIカテゴリを初期化するには、カテゴリごとに `Amplify.addPlugin()` メソッドを呼び出します。初期化を完了するには、 `Amplify.configure()` を呼び出します。

アプリケーションクラスの `onCreate()` メソッドに次のコードを追加します。

<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.addPlugin(new AWSApiPlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add this line to add the AWSApiPlugin plugin
            Amplify.addPlugin(new AWSApiPlugin());
            Amplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify.");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error);
        }
    }
}
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.addPlugin(AWSApiPlugin())
```

あなたのクラスは次のようになります：

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // Add this line to add the AWSApiPlugin plugin
            Amplify.addPlugin(AWSApiPlugin())
            Amplify.configure(applicationContext)

            Log.i("MyAmplifyApp", "Initialized Amplify.")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error)
        }
    }
}
```

</amplify-block> <amplify-block name="RxJava">

```java
RxAmplify.addPlugin(new AWSApiPlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add this line to add the AWSApiPlugin plugin
            RxAmplify.addPlugin(new AWSApiPlugin());
            RxAmplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify.");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error);
        }
    }
}
```

</amplify-block> </amplify-block-switcher>

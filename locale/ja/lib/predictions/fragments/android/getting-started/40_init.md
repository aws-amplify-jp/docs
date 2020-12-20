Amplify予測および認証カテゴリを初期化するには、各カテゴリの `Amplify.addPlugin()` メソッドを呼び出します。初期化を完了するには、 `Amplify.configure()` を呼び出します。

アプリケーションクラスの `onCreate()` メソッドに次のコードを追加します。

<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.addPlugin(new AWScognitoAuthPlugin());
Amplify.addPlugin(new AWSPredictionsPlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPredictionsPlugin plugins
            Amplify.addPlugin(new AWSCognitoAuthPlugin());
            Amplify.addPlugin(new AWSPredictionsPlugin());
            Amplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.addPlugin(AWScognitoAuthPlugin())
Amplify.addPlugin(AWSPredictionsPlugin())
```

あなたのクラスは次のようになります：

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPredictionsPlugin plugins
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.addPlugin(AWSPredictionsPlugin())
            Amplify.configure(applicationContext)

            Log.i("MyAmplifyApp", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
        }
    }
}
```

</amplify-block> <amplify-block name="RxJava">

```java
RxAmplify.addPlugin(new AWScognitoAuthPlugin());
RxAmplify.addPlugin(new AWSPredictionsPlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPredictionsPlugin plugins
            RxAmplify.addPlugin(new AWSCognitoAuthPlugin());
            RxAmplify.addPlugin(new AWSPredictionsPlugin());
            RxAmplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

</amplify-block> </amplify-block-switcher>
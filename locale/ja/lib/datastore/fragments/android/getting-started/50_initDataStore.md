To initialize the Amplify DataStore, use the `Amplify.addPlugin()` method to add the AWS DataStore Plugin. Next, finish configuring the Amplify framework by calling `Amplify.configure()`.


MainActivity `onCreate` メソッドの一番下に次のコードを追加します。 (つまり、このコードはアプリケーションサブクラスに含まれていますが、これはすぐに始めるために機能します。

<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.addPlugin(new AWSDataStorePlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            Amplify.addPlugin(new AWSDataStorePlugin());
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
Amplify.addPlugin(AWSDataStorePlugin())
```

あなたのクラスは次のようになります：

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            Amplify.addPlugin(AWSDataStorePlugin())
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
RxAmplify.addPlugin(new AWSDataStorePlugin());
```

あなたのクラスは次のようになります：

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            RxAmplify.addPlugin(new AWSDataStorePlugin());
            RxAmplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

</amplify-block> </amplify-block-switcher>

このアプリケーションをビルドして実行すると、コンソールウィンドウに次のようなものが表示されます:

```console
Amplifyを初期化しました
```

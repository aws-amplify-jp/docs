`Application` クラスを作成し、Amplify の初期化を `onCreate()` に追加して、アプリケーションで一度だけAmplify を初期化します。

Right-click on your namespace (e.g. `com.example.MyAmplifyApp`), click **New**, and click **Java Class** or **Kotlin File/Class** depending on which language you choose.

<amplify-block-switcher> <amplify-block name="Java">

**New Java Class** で新しいクラスを構成する

- *名前* フィールドに **MyAmplifyApp** を入力してください
- *Superclass* フィールドに **android.app.Application** format@@4 を入力してください
- **OK** を押します

Amplifyを初期化するには、次のコードを使用して `onCreate` メソッドを追加します。

```java
  public void onCreate() {
      super.onCreate();

      try {
          Amplify.configure(getApplicationContext());
          Log.i("MyAmplifyApp", "Initialized Amplify");
      } catch (AmplifyException error) {
          Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
      }
  }
```

</amplify-block>

<amplify-block name="Kotlin">

**New Kotlin File/Class** で新しいクラスを設定する

- *名前* フィールドに **MyAmplifyApp** を入力してください
- タイプから *クラス* を選択する
- Enter キーを押します

Amplifyを初期化するには、次のコードを使用して `onCreate` メソッドを追加します。

```kotlin
override fun onCreate() {
    super.onCreate()

    try {
        Amplify.configure(applicationContext)
        Log.i("MyAmplifyApp", "Initialized Amplify")
    } catch (error: AmplifyException) {
        Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
    }
}
```

</amplify-block> </amplify-block-switcher>

これは `onCreate()` を上書きし、アプリケーションの起動時にAmplifyを初期化します。

Next, configure your application to use your new custom `Application` class. Open **manifests** > **AndroidManifest.xml**, and add a `android:name` attribute with the value of your new class name:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.MyAmplifyApp">

    <!-- Add the android:name attribute to the application node -->
    <application
        android:name=".MyAmplifyApp"
        ...
    </application>
</manifest>
```

次に、アプリケーションをビルドして実行します。logcatでは、成功を示すログ行が表示されます。

```console
com.example.MyAmplifyApp I/MyAmplifyApp: Initialized Amplify
```
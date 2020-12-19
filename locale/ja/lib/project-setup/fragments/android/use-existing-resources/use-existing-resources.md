An application’s backend is built with cloud resources such as AWS AppSync GraphQL APIs, Amazon S3 storage, and Amazon Cognito authentication. The Amplify CLI simplifies the provisioning of new backend resources across these different categories. However, you can alternatively use the Amplify libraries to add or re-use existing AWS resources that you provisioned without the CLI. The Amplify libraries support configuration through the *amplifyconfiguration.json* file which defines all the regions and service endpoints for your backend AWS resources.

## Androidアプリケーションに既存のAWSリソースを追加する

Androidアプリケーションに既存のAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 詳細な手順については、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。

### 1. Androidプロジェクト用のAmplify設定ファイルを手動で作成する

First, locate your project’s `res` folder. For example, if the name of your project is *MyAmplifyApp*, you can find the `res` folder at the following location, `MyAmplifyApp/app/src/main/res`:

![GSA](~/images/project-setup/2_useExistingResources.png)

次に、プロジェクトの `res` フォルダ内に、 `raw` という名前の新しいフォルダを作成します。

Finally, in the `raw` folder, create a file named `amplifyconfiguration.json`. At this point the contents of your `amplifyconfiguration.json` file can be an empty object, `{}`.

### 2. アプリケーションでAmplifyを初期化する
アプリケーション起動時にAmplifyを初期化する 新しい `アプリケーション` クラスを作成し、 `onCreate()` メソッドをオーバーライドする必要があります。

First, locate your application’s namespace where you will create the new application class. For example, if your application is named *MyAmplifyApp*, navigate to either `MyAmplifyApp/app/src/main/java/com.example.MyAmplifyApp` or `MyAmplifyApp/app/src/main/kotlin/com.example.MyAmplifyApp` depending on the programming language you are using.

Android Studio のメインメニューから **File -> New** を選択し、プログラミング言語に応じて **Java Class** または **Kotlin File/Class** のいずれかを選択します。

**クラス**を選択し、 **名前** フィールドで新しいクラスの名前を指定します。

新しいクラス内の `onCreate()` メソッドの次のコードを貼り付けます。

<amplify-block-switcher>

<amplify-block name="Java">

```java
  public void onCreate() {
          super.onCreate();

          try {
                Amplify.configure(getApplicationContext());

                Log.i("MyAmplifyApp", "Initialized Amplify");
         } catch (AmplifyException e) {
             Log.e("MyAmplifyApp", "Could not initialize Amplify", e);
         }
}
```

</amplify-block>

<amplify-block name="Kotlin">

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

</amplify-block>

</amplify-block-switcher>

Next, configure your application to use your new custom `Application class`. Open the `AndroidManifest.xml` file located in your project directory at `app/src/main/AndroidManifest.xml`.

Add the `android:name` attribute to the application node. For example, if the application name is  *MyAmplifyApp* and the new class is named *MyAmplifyApplication*, the update to the `AndroidManifest.xml` file looks as follows:
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.MyAmplifyApp">

    <!-- Add the android:name attribute to the application node -->
    <application
        android:name=".MyAmplifyApplication"
        ...
    </application>
</manifest>
```

### 3. 既存のAWSリソースを使用するように設定ファイルを編集します

これで、アプリケーションの `amplifyconfiguration.json`  ファイルをカスタマイズして、使用する既存のAWSリソースを指定する準備が整いました。

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。

以下のリストからカテゴリを選択して、 `の例を表示します。 son <code> ファイル` をテンプレートとして使用して、独自の `amplifyconfiguration.json` ファイルを作成できます。

* 既存の AWS Pinpoint リソースを使用するには [Analytics カテゴリ](~/lib/analytics/existing-resources.md) を参照してください。
* 既存の AWS AppSync リソースを使用する [API (GraphQL) カテゴリ](~/lib/graphqlapi/existing-resources.md) を参照してください。
* 既存の Amazon API Gateway および AWS Lambda リソースを使用するには、 [API (REST) カテゴリ](~/lib/restapi/existing-resources.md) を参照してください。
* 既存の Amazon Cognito リソースを使用するには [認証カテゴリ](~/lib/auth/existing-resources.md) を参照してください。
* 既存の Amazon S3 リソースを使用するには [ストレージカテゴリ](~/lib/storage/existing-resources.md) を参照してください。
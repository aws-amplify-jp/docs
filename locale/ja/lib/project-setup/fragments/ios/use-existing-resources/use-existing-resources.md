An application’s backend is built with cloud resources such as AWS AppSync GraphQL APIs, Amazon S3 storage, and Amazon Cognito authentication. The Amplify CLI simplifies the provisioning of new backend resources across these different categories. However, you can alternatively use the Amplify libraries to add or re-use existing AWS resources that you provisioned without the CLI. The Amplify libraries support configuration through the *amplifyconfiguration.json* file which defines all the regions and service endpoints for your backend AWS resources.

## iOSアプリケーションに既存のAWSリソースを追加

iOSアプリケーションに既存のAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 詳細な手順については、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。

### 1. iOSプロジェクト用のAmplify設定ファイルを手動で作成する

Create a file named `amplifyconfiguration.json` in your project’s main directory. At this point the contents of your `amplifyconfiguration.json` file can be an empty object, `{}`.

For example, if the name of your project is *MyAmplifyApp*, you will create the configuration file in your main application directory, `MyAmplifyApp/amplifyconfiguration.json`, as follows:

![GSA](~/images/project-setup/1_useExistingResources.png)

### 2. アプリケーションでAmplifyを初期化

AmplifyをiOSアプリケーションで初期化するには、 `AppDelegate.swift` ファイルを開き、ファイルの上部に `import Amplify` を追加します。
```swift
import Amplify
```

Update the `application` function in the `AppDelegate.swift` file to verify that Amplify can be compiled into your project. The `application` function’s code should be the following:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
   do {
     try Amplify.configure()
   } catch {
      print("An error occurred setting up Amplify: \(error)")
   }
   return true
}
```
### 3. 既存のAWSリソースを使用するように設定ファイルを編集します

これで、アプリケーションの `amplifyconfiguration.json` ファイルをカスタマイズして、使用する既存のAWSリソースを指定する準備が整いました。

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。

以下のリストからカテゴリを選択して、 `の例を表示します。 son <code> ファイル` をテンプレートとして使用して、独自の `amplifyconfiguration.json` ファイルを作成できます。

* 既存の AWS Pinpoint リソースを使用するには [Analytics カテゴリ](~/lib/analytics/existing-resources.md) を参照してください。
* 既存の AWS AppSync リソースを使用する [API (GraphQL) カテゴリ](~/lib/graphqlapi/existing-resources.md) を参照してください。
* 既存の Amazon API Gateway および AWS Lambda リソースを使用するには、 [API (REST) カテゴリ](~/lib/restapi/existing-resources.md) を参照してください。
* 既存の Amazon Cognito リソースを使用するには [認証カテゴリ](~/lib/auth/existing-resources.md) を参照してください。
* 既存の Amazon S3 リソースを使用するには [ストレージカテゴリ](~/lib/storage/existing-resources.md) を参照してください。




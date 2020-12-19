## 概要

[Amazon Location Service](http://aws.amazon.com/location) は、アプリケーションに位置情報を追加できる位置情報サービスです。 Amazon Location Service では、地図や興味のあるポイントを提供するアプリケーションを構築できます。 リソースを追跡し、場所に基づいてアクションを実行し、通りの住所を地理座標に変換します。 このガイドでは、以下の情報を提供します。

- Amazon Location Service SDK を使用して iOS アプリをセットアップおよび構成する方法
- アプリケーションに認証を追加する方法
- Amazon Location Service API へのアクセス方法

サービスの詳細については、 [Amazon Location Service Developer Guide](https://docs.aws.amazon.com/location/latest/developerguide/) を参照してください。

## 前提条件

iOSアプリ内でAmazon Location Serviceを使用する場合は、iOS 9以降をターゲットにする必要があります。

## Amplify CLI を使用してアプリに認証を追加する

Amplify Frameworkは、主要認証プロバイダとして [Amazon Cognito](https://aws.amazon.com/cognito/) を使用しています。 Amazon Cognitoは、ユーザー登録、認証、アカウント復旧などの操作を行う堅牢なユーザーディレクトリサービスです。 Amazon CognitoとAmplify CLIを使用してアプリに認証を追加するには、次の手順を使用します。

1. ターミナルウィンドウを開きます。
1. 次のコマンドを実行して、 [Amplify CLI](https://docs.amplify.aws/cli/start/install) をインストールします。

    <amplify-block-switcher>

    <amplify-block name="NPM">

    ```bash
    npm install -g @aws-amplify/cli
    ```

    </amplify-block>

    <amplify-block name="cURL (Mac and Linux)">

    ```bash
    curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
    ```

    </amplify-block>

    <amplify-block name="cURL (Windows)">

    ```bash
    curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
    ```

    </amplify-block>

    </amplify-block-switcher>

1. アプリのルートディレクトリから次のコマンドを実行して、Amplifyプロジェクトを初期化します。

    ```bash
    initを増幅する
    ```

1. Cognito Identity Poolを作成します。アプリユーザーを認証し、Amazon Location Service へのアクセスを許可するために使用されます。 バックエンドで認証リソースのプロビジョニングを開始するには、プロジェクトディレクトリに移動して次のコマンドを実行します。

    ```bash
    増幅して認証を追加
    ```

1. プロンプトが表示されたら、以下の情報を入力してください。

    ```console
    ? Do you want to use the default authentication and security configuration? 
      `Default configuration`
    ? How do you want users to be able to sign in? 
      `Username`
    ? Do you want to configure advanced settings? 
      `No, I am done.`
    ```

1. Run the following command to push your changes to the cloud. When completed, the `awsconfiguration.json` file will be updated to reference your newly provisioned backend auth resources.

    ```bash
    push を増幅する
    ```

## 依存関係のインストール

次に、必要な Amazon Location Service SDK をiOSアプリにインストールする必要があります。

**依存関係をインストールするには:**

1. ターミナルで、アプリのプロジェクトディレクトリに移動します。
1. 以下のコマンドを実行して、CocoaPods パッケージマネージャでプロジェクトを初期化します。

    ```bash
    pod init 
    ```

1. **Podfile** という名前の新しいファイルが作成されます。このファイルはプロジェクトのパッケージ依存性を説明するために使用されます。
1. Open the **Podfile** in a file editor, and add `AWSLocation` and `AWSMobileClient` SDKs as pod dependencies. When you’re done, your Podfile will look similar to this example:

    ```ruby
    ターゲット 'MyAmplifyApp' do 
      use_frameworks! 
      pod 'AWSLocation' 
      pod 'AWSMobileClient'
    end
    ```

1. 以下のコマンドを実行して、ポッドをインストール、ダウンロード、および解決します。

    ```bash
    pod install --repo-update
    ```

1. After doing this, you should now see a file ending with `.xcworkspace`. You are required to use this file from now on instead of the `.xcodeproj` file. To open your workspace, **run the command**:

    ```bash
    xed .
    ```

1. Finderを開き、 `awsconfiguration.json` ファイルを探します。 次のスクリーンショットで参照されているように、このファイルをプロジェクトに追加するには、プロジェクトのフォルダの下のXcode ウィンドウにドラッグします。

    ![Amazon Location Service - iOS プロジェクトファイルをコピー](~/images/als/ios-copy-project-files.png)

    1. 必要に応じて **アイテムをコピー** を有効にする

    1. 「追加されたフォルダ」の場合、 **グループの作成** が選択されています。

    1. 「ターゲットに追加」の場合は、アプリのターゲット(例えば、 **MyAmplifyApp**)がチェックされていることを確認してください。

    次のスクリーンショットに示すように、これらのファイルをプロジェクトに追加するには、 **終了** を選択します。

    ![Amazon Location Service - ファイルオプションの追加](~/images/als/ios-adding-files-options.png)

## Amazon Location Service SDK の初期化

The following procedure details how to initialize the `AWSMobileClient` and the `AWSLocation` client. The `AWSLocation` client is the low level SDK you need to access the Amazon Location Service APIs.

1. `AppDelegate` ファイルの先頭に以下のインポートを追加します:

    ```swift
    AWSMobileClient をインポート
    ```

1. `AWSMobileClient` を、 `AppDelegate`の `アプリケーション(_:didFinishLaunchingWithOptions:)` メソッドに初期化するコードを追加します。

      ```swift
      func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
          // Override point for customization after application launch.
          AWSMobileClient.default().initialize { (userState, error) in
              if let userState = userState {
                  print("UserState: \(userState.rawValue)")
              } else if let error = error {
                  print("error: \(error.localizedDescription)")
              }
          }
          return true
      }
      ```

      **Note:** If you are building an app that conforms to the `App` protocol, you can instead create your own `AppDelegate` and use the `UIApplicationDelegateAdaptor` property wrapper to tell SwiftUI to use your `AppDelegate class` for the application delegate.

      ```swift
      class AppDelegate: NSObject, UIApplicationDelegate {
          func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
              AWSMobileClient.default().initialize { (userState, error) in
                  if let userState = userState {
                      print("UserState: \(userState.rawValue)")
                  } else if let error = error {
                      print("error: \(error.localizedDescription)")
                  }
              }
              return true
          }
      }
      @main
      struct MyAmplifyApp: App {
          @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

          var body: some Scene {
              WindowGroup {
                  ContentView()
              }
          }
      }
      ```

1. Now, edit the `awsconfiguration.json` file and add the `Location` section, replacing `[REGION]` with the region that your Amazon Location Service is located in. This will initialize the `AWSLocation` client:

    ```json
    {
        "UserAgent": "aws-amplify/cli",
        "Version": "0.1.0",
        // ...
        "Location": {
            "Default": {
                "Region": "[REGION]"
            }
        }
    }

1. Build (⌘B) and run the app (⌘R).

You have now successfully setup and configured your app to use Amazon Location Service.

## Using the Amazon Location Service APIs

In order to access Amazon Location Service APIs you will need to create resources. You can create resources using the [Amazon Location Service console](http://console.aws.amazon.com/location/home) or using the [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/). Once you have created the resources, you can use these resources by calling the [APIs](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSLocation/index.html). 

This section provides you an example of using the Amazon Location Service APIs. In this example, we will first create a Place Index in the Amazon Location Service console and use the APIs to search for places.  

### Creating a new place index

1. Open the [Amazon Location Service console](https://console.aws.amazon.com/location/places/home#/create) to create a place index.
1. Enter **MyPlaceIndex** in **Name**.
1. Press **Create place index**

    ![Amazon Location Service - Create place index](~/images/als/create-place-index.png)

1. Note the Amazon Resource Name (ARN) of your place index. This will start with *arn:aws:geo* as in the below screenshot.

    ![Amazon Location Service - Place index](~/images/als/my-place-index.png)

### Allow Guest users access to the place index

Now create an inline policy that will give guest users of your application access to the Place Index resource you just created in Amazon Location Service.

1. Navigate to the root of your project and run the following command:

    ```bash
    amplify console auth
    ```

1. **どのコンソール** の **アイデンティティプール** を選択するプロンプトが表示されたら。
1. Amazon Cognitoコンソールに移動します。ページの右上隅にある **Edit Identity pool** をクリックします。
1. Open the drop down for **Unauthenticated identities**, choose **Enable access to unauthenticated identities**, and then press **Save Changes**.
1. Click on **Edit identity pool** once more. Make a note of the name of the Unauthenticated role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`.
1. [AWS Identity and Access Management (IAM) コンソール](https://console.aws.amazon.com/iam/home#/roles) を開き、ロールを管理します。
1. **Search** フィールドに、上記の未認証ロールの名前を入力してクリックします。
1. **+ Add インラインポリシー**をクリックし、 **JSON** タブをクリックします。
1. `[ARN]` プレースホルダに、上記のプレースインデックスのARNを入力し、ポリシーの内容を以下に置き換えます。

    ```json
{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "geo:SearchPlaceIndexForText",
                "Resource": "[ARN]"
            }
        ]
}
    ```

1. **Review Policy** ボタンをクリックします。
2. **名前** フィールドに、 *LocationTracker* と入力します。
3. **ポリシーの作成** ボタンをクリックします。iOS アプリに認証が正常に追加されました。

### 場所を検索中

作成した場所のインデックスを使用して場所を検索する方法は次のとおりです。

```swift
// Add the following import to the top of your class
import AWSLocation

func searchForPlaces() {
    let request = AWSLocationSearchPlaceIndexForTextRequest()!
    request.text = "Space Needle"
    request.indexName = "MyPlaceIndex"
    let result = AWSLocation.default().searchPlaceIndex(forText: request)
    result.continueWith { (task) -> Any? in
        if let error = task.error {
            print("error \(error)")
        } else if let taskResult = task.result {
            print("taskResult \(taskResult)")
        }
        return nil
    }
}
```

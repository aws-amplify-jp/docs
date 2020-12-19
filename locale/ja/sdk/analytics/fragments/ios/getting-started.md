アプリの分析データを収集するには、 [Amazon Pinpoint](#using-amazon-pinpoint) と [Amazon Kinesis](#using-amazon-kinesis) を使用します。

Amazon Pinpointは完全に管理されたAWSサービスで、デバイスからキャプチャした分析を使用して、複数のメッセージングチャネルの顧客とのやり取りに使用できます。 キャンペーンの目的に応じて、プッシュ通知、メール、またはテキストメッセージ(SMS)を送信できます。

**オーディエンスセグメント** - アプリケーションによって報告されたデータに基づいて動的セグメントを定義することができます。 例えばオペレーティングシステムやモバイル機器などです Amazon Pinpoint 以外で定義した静的セグメントをインポートすることもできます。

**メッセージキャンペーン** - 設定したスケジュールに合わせてキャンペーンが送信されます。 モバイルプッシュ、メール、SMSメッセージを送信するキャンペーンを作成できます。 別のキャンペーン戦略を試してみるには、キャンペーンを A/B テストとして設定し、Amazon Pinpoint 分析で結果を分析します。

**トランザクションメッセージ** - 新しいアカウントのアクティベーションメッセージなど、トランザクション型のモバイルプッシュやSMSメッセージを送信することで、顧客に知らせ続けましょう 注文確認、および特定のユーザーへのパスワードリセット通知

**ユーザーの行動を分析する** - ユーザーのエンゲージメントレベル、購入アクティビティ、人口統計に関するトレンドを表示できます。 メッセージトラフィックは、送信および開いたメッセージのメトリックで監視できます。 Amazon Pinpoint APIを使用すると、アプリケーションがカスタムデータをレポートでき、Amazon Pinpointで分析が可能になります。

Amplify CLI は、アプリケーション内で Pinpoint を設定し、AWS Mobile SDK に接続するのに役立ちます。

 > **前提条件:** [Amplify CLI をインストールして構成する](~/cli/start/install.md)

## バックエンドを設定

1. CLI を使用して、クラウド対応のバックエンドとアプリに分析を追加します。

    ターミナルウィンドウで、プロジェクトフォルダ(フォルダにアプリ `.xcodeproj` ファイルが含まれています)に移動し、SDKをアプリケーションに追加します。

    ```bash
    cd ./YOUR_PROJECT_FOLDER
    増幅分析を追加
    ```

2. アナリティクスの設定が完了すると、このカテゴリのローカル CLI メタデータを設定していることを確認するメッセージが表示されます。 ステータスを表示することで確認できます。

    ```console
    $ amplify status
    | Resource name | Operation | Provider プラグイン|
    | --------------- | ------------- | ------------ |
    | 認証 | cognitoabcd0123 | Create | awscloudforming |
    | Analytics | yourprojectname | awscloudforming |
    ```

3. バックエンドAWSのリソースを作成するには、以下を実行します。

    ```bash
    push を増幅する
    ```

### IAM ポリシーを手動で更新する:

> **メモ** Amplify CLI は、適切なポリシーと権限を追加します。 ここで提供される情報は、プロジェクトで Amplify CLI を使用して ** ** ***ではない*** の場合に提供されます。

The Amazon Pinpoint service requires permissions defined in an IAM policy to use the `submitEvents` API. If you are using long-term AWS credentials attached to an `Amazon IAM` user, attach the following policies to the role of that `IAM` user. If you are using temporary AWS credentials vended by `Amazon Cognito Identity Pools`, then attach the following policies to the Unauthenticated and/or Authenticated `IAM` roles of your `Cognito Identity Pool`. The role you attach the policies to depends on the scope of your application. For example, if you only want events submitted when users login, attach to the authenticated role. Similarly, if you want events submitted regardless of authentication state, attach the policy to the unauthenticated role. For more information on Cognito Identities authenticated/unauthenticated roles see <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html" target="_blank">here</a>.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "mobiletargeting:UpdateEndpoint",
                "mobiletargeting:PutEvents"
            ],
            "Resource": [
                "arn:aws:mobiletargeting:*:${accountID}:apps/${appId}*"
            ]
        }
    ]
}
```

## バックエンドに接続

次の手順を使用して、分析をモバイルアプリに追加し、Amazon Pinpointを通じて結果を監視します。

### 分析を追加

AWS Mobile SDK コンポーネントを以下のように設定します。

1. AWS Mobile SDK をインストールするように設定する `Podfile` を含める必要があります。

```ruby
platform :ios, '9.0'
target 'YourAppName' do
    use_frameworks!

    pod 'AWSPinpoint'
    pod 'AWSMobileClient'

    # other pods

end
```

続行する前に `pod install --repo-update` を実行します。

If you encounter an error message that begins `[!] Failed to connect to GitHub to update the CocoaPods/Specs . . .`, and your internet connectivity is working, you may need to [update openssl and Ruby](https://stackoverflow.com/questions/38993527/cocoapods-failed-to-connect-to-github-to-update-the-cocoapods-specs-specs-repo/48962041#48962041).

2. Amazon Pinpoint API を呼び出すクラスは、次のインポート文を使用する必要があります。

```swift
/** コードコピー ***
インポート AWSPinpoint
import AWSMobileClient
/** エンドコードコピー ***
```

3. To send events with Amazon Pinpoint, you'll instantiate a Pinpoint instance. We recommend you do this during app startup, so you can use Pinpoint to record app launch analytics. Edit the `application(_:didFinishLaunchingWithOptions:)` method of your app's `AppDelegate.swift` by adding a `pinpoint` instance property, and initializing the Pinpoint client as shown below:

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    /** start code copy **/
    var pinpoint: AWSPinpoint?
    /** end code copy **/

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

        // Other didFinishLaunching code...

        /** start code copy **/
        // Create AWSMobileClient to connect with AWS
        AWSMobileClient.default().initialize { (userState, error) in
          if let error = error {
        print("Error initializing AWSMobileClient: \(error.localizedDescription)")
          } else if let userState = userState {
        print("AWSMobileClient initialized. Current UserState: \(userState.rawValue)")
          }
        }

        // Initialize Pinpoint
        let pinpointConfiguration = AWSPinpointConfiguration.defaultPinpointConfiguration(launchOptions: launchOptions)
        pinpoint = AWSPinpoint(configuration: pinpointConfiguration)
        /** end code copy **/
        return true
    }
}
```

### 分析の監視

Amazon Pinpointで使用状況のメトリックを確認するには、アプリをビルドして実行します。以前のコードサンプルを実行すると、コンソールに記録されたセッションが表示されます。

1. 分析のビジュアライゼーションをアプリから見るには、Amazon Pinpoint コンソールで以下を実行してプロジェクトを開きます。

```bash
コンソール分析を増幅する
```

2. コンソールの左側のアイコンから `Analytics` を選択し、アプリの使用状況のグラフを表示します。 メトリックが表示されるまでに最大15分かかる場合があります。

    ![getting-started-analytics](~/images/getting-started-analytics.png)

分析イベントをセグメントにグループ化できます。 さらに、アプリの使用状況をプッシュ通知、メール、またはSMSメッセージキャンペーンと結びつけることで、ユーザーをより深くエンゲージメントさせることができます。 詳細については、 [メッセージングセクション](~/sdk/push-notifications/messaging-campaign.md) または [をクリックして Amazon Pinpoint](http://docs.aws.amazon.com/pinpoint/latest/developerguide/welcome.html) の詳細をご覧ください。

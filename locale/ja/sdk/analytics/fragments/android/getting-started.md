アプリの分析データを収集するには、 [Amazon Pinpoint](#using-amazon-pinpoint) または [Amazon Kinesis](#using-amazon-kinesis) を使用します。

Amazon Pinpointは完全に管理されたAWSサービスで、デバイスからキャプチャした分析を使用して、複数のメッセージングチャネルの顧客とのやり取りに使用できます。 キャンペーンの目的に応じて、プッシュ通知、メール、またはテキストメッセージ(SMS)を送信できます。

**オーディエンスセグメント** - アプリケーションによって報告されたデータに基づいて動的セグメントを定義することができます。 例えばオペレーティングシステムやモバイル機器などです Amazon Pinpoint 以外で定義した静的セグメントをインポートすることもできます。

**メッセージキャンペーン** - 設定したスケジュールに合わせてキャンペーンが送信されます。 モバイルプッシュ、メール、SMSメッセージを送信するキャンペーンを作成できます。 別のキャンペーン戦略を試してみるには、キャンペーンを A/B テストとして設定し、Amazon Pinpoint 分析で結果を分析します。

**トランザクションメッセージ** - 新しいアカウントのアクティベーションメッセージなど、トランザクション型のモバイルプッシュやSMSメッセージを送信することで、顧客に知らせ続けましょう 注文確認、および特定のユーザーへのパスワードリセット通知

**ユーザーの行動を分析する** - ユーザーのエンゲージメントレベル、購入アクティビティ、人口統計に関するトレンドを表示できます。 メッセージトラフィックは、送信および開いたメッセージのメトリックで監視できます。 Amazon Pinpoint APIを使用すると、アプリケーションがカスタムデータをレポートでき、Amazon Pinpointで分析が可能になります。

Amplify CLI は、アプリケーション内で Pinpoint を設定し、AWS Mobile SDK に接続するのに役立ちます。

<b>前提条件:</b> [Amplify CLI](~/cli/start/install.md)<br>
<b>推奨:</b> [Getting Startedガイドを完了](~/start/start.md)

## バックエンドを設定

1. CLI を使用して、クラウド対応のバックエンドとアプリに分析を追加します。

    In a terminal window, navigate to your project folder (the folder that typically contains your project level `build.gradle`), and add the SDK to your app.

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

### IAM ポリシーを更新:

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

## 分析を追加
1. `app/build.gradle` の依存関係リストに次のライブラリを含めることで、AWS Mobile SDKコンポーネントを設定します。

```groovy
dependencies {
  implementation 'com.<unk> s:aws-android-sdk-pinpoint:2.15.+'
  implementation ('com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
}
```

* `aws-android-sdk-pinpoint` ライブラリにより、分析結果を Amazon Pinpoint に送信できます。
* `aws-android-sdk-mobile-client` ライブラリは AWS 資格情報プロバイダと設定へのアクセスを提供します。

2. アプリマニフェストに必要な権限を追加する

    AWS Mobile SDK は `INTERNET` と `ACCESS_NETWORK_STATE` パーミッションが必要です。これらは `AndroidManifest.xml` ファイルで定義されています。

    ```xml
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    ```

3. Add calls to capture session starts and stops. A session is one use of an app by the user. A session begins when an app is launched (or brought to the foreground), and ends when the app is terminated (or goes to the background). To accommodate for brief interruptions, like a text message, an inactivity period of up to 5 seconds is not counted as a new session. `Total daily sessions` shows the number of sessions your app has each day. `Average sessions per daily active user` shows the mean number of sessions per user per day.

   以下は、アプリセッションの開始と停止を計測するための典型的な場所です。

   * `Application.onCreate()` メソッドでセッションを開始します。

   * アプリの最初のアクティビティの `onCreate()` メソッドでセッションを開始します。

   * [ActivityLifecycleCallbacks](https://developer.android.com/reference/android/app/Application.ActivityLifecycleCallbacks) クラスでセッションを開始または停止します。

   次の例は、 `MainActivity` の `OnCreate` イベントでセッションを開始する方法を示しています。

    ```java
    import android.support.v7.app.AppCompatActivity;
    import android.os.Bundle;

    import com.amazonaws.mobileconnectors.pinpoint.PinpointManager;
    import com.amazonaws.mobileconnectors.pinpoint.PinpointConfiguration;
    import com.amazonaws.mobile.client.AWSMobileClient;
    import com.amazonaws.mobile.config.AWSConfiguration;
    import com.amazonaws.mobile.client.UserStateDetails;
    import com.amazonaws.mobile.client.Callback;
    import android.content.Context;

    public class MainActivity extends AppCompatActivity {
        private static final String TAG = MainActivity.class.getSimpleName();

        public static PinpointManager pinpointManager;

        public static PinpointManager getPinpointManager(final Context applicationContext) {
            if (pinpointManager == null) {
                // Initialize the AWS Mobile Client
                final AWSConfiguration awsConfig = new AWSConfiguration(applicationContext);
                AWSMobileClient.getInstance().initialize(applicationContext, awsConfig, new Callback<UserStateDetails>() {
                    @Override
                    public void onResult(UserStateDetails userStateDetails) {
                        Log.i("INIT", userStateDetails.getUserState().toString());
                    }

                    @Override
                    public void onError(Exception e) {
                        Log.e("INIT", "Initialization error.", e);
                    }
                });

                PinpointConfiguration pinpointConfig = new PinpointConfiguration(
                        applicationContext,
                        AWSMobileClient.getInstance(),
                        awsConfig);

                pinpointManager = new PinpointManager(pinpointConfig);
            }
            return pinpointManager;
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            final PinpointManager pinpointManager = getPinpointManager(getApplicationContext());
            pinpointManager.getSessionClient().startSession();
        }
    }
    ```

    To stop the session, use `stopSession()` and `submitEvents()` at the last point in the session you want to capture. In this example, we are using a single Activity, so the session will stop when the MainActivity is destroyed. `onDestroy()` is usually called when the back button is pressed while in the activity.

    ```java
    @Override
    protected void onDestroy() {
        super.onDestroy();

        pinpointManager.getSessionClient().stopSession();
        pinpointManager.getAnalyticsClient().submitEvents();
}
    ```

## 分析の監視

Amazon Pinpointで使用状況のメトリックを確認するには、アプリをビルドして実行します。以前のコードサンプルを実行すると、コンソールに記録されたセッションが表示されます。

1. 分析のビジュアライゼーションをアプリから見るには、Amazon Pinpoint コンソールで以下を実行してプロジェクトを開きます。

    ```bash
    コンソール分析を増幅する
    ```

2. コンソールの左側のアイコンから `Analytics` を選択し、アプリの使用状況のグラフを表示します。 メトリックが表示されるまでに最大15分かかる場合があります。

    ![getting-started-analytics](~/images/getting-started-analytics.png)

分析イベントをセグメントにグループ化できます。 さらに、アプリの使用状況をプッシュ通知、メール、またはSMSメッセージキャンペーンと結びつけることで、ユーザーをより深くエンゲージメントさせることができます。 詳細については、 [メッセージングセクション](~/sdk/push-notifications/messaging-campaign.md) または [をクリックして Amazon Pinpoint](http://docs.aws.amazon.com/pinpoint/latest/developerguide/welcome.html) の詳細をご覧ください。

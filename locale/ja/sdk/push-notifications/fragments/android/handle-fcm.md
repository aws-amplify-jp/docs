## FCM/GCM プッシュ通知の処理

Amazon Pinpointを使用すると、Androidが送信したプッシュ通知を受信できるようになります。 Amazon Pinpointを使用すると、Firebase Cloud Messaging (FCM) またはその前身であるGoogle Cloud Messaging (GCM) 経由でプッシュ通知を送信できます。

Amazon Pinpoint キャンペーンは、ユーザーが通知をタップしたときに 3 つのアクションのうちの 1 つを実行できます。 URLに移動するか、ディープリンクを開きます。

### アプリを開く

この操作を指定することで、ユーザーが通知をタップしたときにアプリを開くことができます。

**受信者の追加**

The SDK provides `PinpointNotificationReceiver` which handles the notification to open your app. In order to use this action, you must register this receiver in your `AndroidManifest.xml` file. For example:

```xml
<receiver
    android:name="com.amazonaws.mobileconnectors.pinpoint.targeting.notification.PinpointNotificationReceiver" android:exported="false" >
    <intent-filter>
        <action android:name="com.amazonaws.intent.fcm.NOTIFICATION_OPEN" />
    </intent-filter>
</receiver>
```

### ディープリンクを開く

このアクションは指定されたアクティビティにアプリを開きます。

ディープリンクの宛先アクティビティを指定するには、アプリがディープリンクを設定している必要があります。 このセットアップには、ディープリンクが使用する URL スキームを登録するインテントフィルタが必要です。 アプリケーションがインテントフィルタを作成した後、インテントによって提供されたデータによってレンダリングするアクティビティが決定されます。

**インテントフィルタの作成**

`AndroidManifest.xml` ファイルにインテントフィルタを作成してディープリンクの設定を開始します。例:

```xml
<!-- This activity allows your application to receive a deep link
that navigates directly to the "Deeplink Page" -->
<activity
    android:name=".DeepLinkActivity"
    android:label="A deeplink!" >
    <intent-filter android:label="inAppReceiver">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- Accepts URIs of type "pinpoint://deeplink" -->
        <data android:scheme="pinpoint"
              android:host="deeplink" />
    </intent-filter>
</activity>
```

The data element in the previous example registers a URL scheme, `pinpoint://`, as well as the host, `deeplink`. As a result, when given a URL in the form of `pinpoint://deeplink`, the manifest is prepared to execute the action.

**インテントの処理**

次に、登録されたURLスキームとホストに関連付けられている画面を表示するインテントハンドラを設定します。 Intent data は onCreate() メソッドで取得され、 `Uri` データを使用してアクティビティを作成できます。 次の例はアラートを表示し、イベントを追跡します。

```java
public class DeepLinkActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getIntent().getAction() == Intent.ACTION_VIEW) {
            Uri data = getIntent().getData();

            if (data != null) {

                // show an alert with the "custom" param
                new AlertDialog.Builder(this)
                        .setTitle("An example of a Deeplink")
                        .setMessage("Found custom param: " +data.getQueryParameter("custom"))
                        .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        })
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .show();
            }
        }
    }
}
```

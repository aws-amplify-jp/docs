## Baiduプッシュ通知の処理

Baidu Cloud Pushは、中国のクラウドサービスであるBaiduが提供するプッシュ通知サービスです。 Baidu Cloud Pushをモバイルアプリに統合することで、 Amazon Pinpointを使用すると、Baiduモバイルプッシュチャネルを通じてアプリに通知を送信できます。

**前提条件**

Amazon PinpointとBaiduを使用してモバイルデバイスにプッシュ通知を送信するには、以下が必要です。

* Baiduアカウント。

* Baidu開発者として登録します。

* Baidu Cloud Pushプロジェクト。

* Baidu Cloud PushプロジェクトのAPIキーとシークレットキー。

* BaiduのユーザーIDとチャンネルID。

以下の手順は、Baidu プッシュサービス jar のバージョン `5.7.1.65` に基づいています。

**Baiduをアプリと統合するには**

最新のBaidu Cloud Push SDK Androidクライアントをhttp://push.baidu.com/からダウンロードしてください。

ZIP ファイルを抽出し、 `pushservice-x.xx.jar` ファイルを `Baidu-Push-SDK-Android` libs フォルダから Android アプリの libフォルダにインポートします。

`Baidu-Push-SDK-Android` libs フォルダには以下のフォルダも含める必要があります:

* arm64-v8a

* armeabi

* armeabi-v7a

* mips

* mips64

* x86

* x86_64

Android アプリの `src/main/jniLibs` フォルダにそれぞれ完全なフォルダを追加します。

Android アプリの `AndroidManifest.xml` ファイル内で、次の権限を宣言してください：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

<!-- Baidu permissions -->
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />

<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WRITE_SETTINGS" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_DOWNLOAD_MANAGER" />
<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />
<uses-permission android:name="android.permission.DISABLE_KEYGUARD" />
```

`<application>`の下に、以下の受信機とインテントフィルタを指定します。

```xml
<!-- Baidu settings -->
<receiver android:name="com.baidu.android.pushservice.PushServiceReceiver"
          android:process=":bdservice_v1">
  <intent-filter>
    <action android:name="android.intent.action.BOOT_COMPLETED" />
    <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
    <action android:name="com.baidu.android.pushservice.action.notification.SHOW" />
    <action android:name="com.baidu.android.pushservice.action.media.CLICK" />

    <action android:name="android.intent.action.MEDIA_MOUNTED" />
    <action android:name="android.intent.action.USER_PRESENT" />
    <action android:name="android.intent.action.ACTION_POWER_CONNECTED" />
    <action android:name="android.intent.action.ACTION_POWER_DISCONNECTED" />
  </intent-filter>
</receiver>

<receiver android:name="com.baidu.android.pushservice.RegistrationReceiver"
          android:process=":bdservice_v1">
  <intent-filter>
    <action android:name="com.baidu.android.pushservice.action.METHOD" />
    <action android:name="com.baidu.android.pushservice.action.BIND_SYNC" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.PACKAGE_REMOVED" />

    <data android:scheme="package" />
  </intent-filter>
</receiver>

<service android:name="com.baidu.android.pushservice.PushService"
         android:exported="true"
         android:process=":bdservice_v1">
  <intent-filter>
    <action android:name="com.baidu.android.pushservice.action.PUSH_SERVICE" />
  </intent-filter>
</service>
<service android:name="com.baidu.android.pushservice.CommandService"
         android:exported="true" />

<!-- Amazon Pinpoint Notification Receiver -->
<receiver android:name="com.amazonaws.mobileconnectors.pinpoint.targeting.notification.PinpointNotificationReceiver">
  <intent-filter>
  <action android:name="com.amazonaws.intent.baidu.NOTIFICATION_OPEN" />
  </intent-filter>
</receiver>
```

Update the `AndroidManifest.xml` file with the following permissions, which are specific to your application. Remember to replace `<YourPackageName>` with the name of your package.

```xml
<uses-permission android:name="baidu.push.permission.WRITE_PUSHINFOPROVIDER.YourPackageName" />

<permission
    android:name="baidu.push.permission.WRITE_PUSHINFOPROVIDER.YourPackageName"
    android:protectionLevel="normal" />

<provider
    android:name="com.baidu.android.pushservice.PushInfoProvider"
    android:authorities="YourPackageName.bdpush"
    android:exported="true"
    android:protectionLevel="signature"
    android:writePermission="baidu.push.permission.WRITE_PUSHINFOPROVIDER.YourPackageName" />
```

Inside your Android application, create a `MessageReceiver` class that subclasses `com.baidu.android.pushservice.PushMessageReceiver`. The subclass should implement the following methods and perform the corresponding calls:

**`onBind`**

デバイスがBaidu Cloud Pushに登録されたときに呼び出されます。 Amazon Pinpointでデバイスを登録するために必要なBaiduのユーザーIDとチャンネルIDを提供します。 このメソッドの一部として次の呼び出しを含めます:

```java
pinpointManager.getNotificationClient().registerDeviceToken(userId, channelId);
```

**`onUnbind`**

デバイスがBaidu Cloud Pushに登録されなくなったときに呼び出されます。

**`onMessage`**

デバイスがBaidu Cloud Pushから生メッセージを受信したときに呼び出されます。 Amazon Pinpoint は、Baidu Cloud Push raw メッセージ形式でキャンペーンプッシュ通知を送信します。このメソッドの一部として次のコールを含めます。

```java
NotificationDetails = NotificationDetailsBuilder.builder()
                              .message(message);
                              .intentAction(NotificationClient.BAIDU_INTENT_ACTION)
                              .build();

pinpointManager.getNotificationClient().handleCampaignPush(details)
```

message パラメータのみデータを含んでいます。 `customContentString` は生のメッセージでは使用されません。

After creating the subclass, modify the `AndroidManifest.xml` file to register it as a receiver. In the following example, the `PushMessageReceiver` subclass is named `com.baidu.push.example.MyPushMessageReceiver`.

```xml
<receiver android:name="com.baidu.push.example.MyPushMessageReceiver">
  <intent-filter>
    <action android:name="com.baidu.android.pushservice.action.MESSAGE" />
    <action android:name="com.baidu.android.pushservice.action.RECEIVE" />
    <action android:name="com.baidu.android.pushservice.action.notification.CLICK" />
  </intent-filter>
</receiver>
```

Baiduリスナーサービスを開始するには、Androidアプリのメインアクティビティで、以下のコードをonCreateメソッドに追加してください。

```java
// ATTENTION：You need to modify the value of api_key to your own !!
PushManager.startWork(getApplicationContext(), PushConstants.LOGIN_TYPE_API_KEY, api_key);

CustomPushNotificationBuilder cBuilder = new CustomPushNotificationBuilder(
  getResources().getIdentifier("notification_custom_builder", "layout", getPackageName()),
  getResources().getIdentifier("notification_icon", "id", getPackageName()),
  getResources().getIdentifier("notification_title", "id", getPackageName()),
  getResources().getIdentifier("notification_text", "id", getPackageName()));
cBuilder.setNotificationFlags(Notification.FLAG_AUTO_CANCEL);
cBuilder.setNotificationDefaults(Notification.DEFAULT_VIBRATE);

cBuilder.setStatusbarIcon(this.getApplicationInfo().icon);
cBuilder.setLayoutDrawable(getResources().getIdentifier(
  "simple_notification_icon", "drawable", getPackageName()));
cBuilder.setNotificationSound(Uri.withAppendedPath(
  Audio.Media.INTERNAL_CONTENT_URI, "6").toString());
PushManager.setNotificationBuilder(this, 1, cBuilder);
```

Remember to properly initialize your `PinpointManager` reference. Use a `PinpointConfiguration` with a `ChannelType` value of `ChannelType.BAIDU`. You can do this programmatically, as in the following example:

```java
final PinpointConfiguration config =
  new PinpointConfiguration(this,
                            IdentityManager.getDefaultIdentityManager()
                            .getCredentialsProvider(),
                            awsConfiguration)
  .withChannelType(ChannelType.BAIDU);
Application.pinpointManager = new PinpointManager(config);
```

または、 `AWSConfiguration` で使用する構成ファイルを定義することもできます。

```
"PinpointAnalytics": {
    "Default": {
      "AppId": "[YourPinpointAppId]",
      "Region": "us-east-1",
      "ChannelType": "BAIDU"
    }
}
```

**Baiduプッシュ通知のテスト**

テストには、Amazon Pinpoint プロジェクト、Baidu API キー、Baidu Secret キーが必要です。

始める前に、登録後にデバイストークンを表示するアプリを増強してください。デバイストークンは以下のように呼び出すことで取得できます。

```java
pinpointManager.getNotificationClient().getDeviceToken()
```

Amplify CLI と Amazon Pinpoint コンソールを使用して、Baidu のプッシュ通知をテストします。

次のコマンドを実行して、Amazon Pinpoint コンソールに移動します。

```bash
コンソール分析を増幅する
```

* 左側のペインで、 `設定` と `プッシュ通知` を選択します。
* `Edit` をクリックして `Show more push services` を選択し、 `Baidu Cloud Push` をクリックします。
* `Baidu API Key` と `Baidu Secret Key` を入力し、ページの右下にある `Save` をクリックします。

現在、 `Baidu Cloud Push` がプッシュ通知サービスとして登録されています。

`Baidu対応の` デバイスにアプリをインストールし、生成されたデバイストークンをキャプチャします。

アドレスとしてデバイストークンを指定してデバイスにダイレクトメッセージを送信します。

* Amazon Pinpoint コンソールで、 `Test messages` に移動します。
* `Push notifications` をチャンネルとして選択します。
* エンドポイントIDまたはデバイストークンを `デスティネーション`に入力します。
* プッシュ通知サービスとして `Baidu` を選択します。
* メッセージを作成し、ダイレクトメッセージを送信するには、ページ右下の `メッセージを送信` をクリックします。

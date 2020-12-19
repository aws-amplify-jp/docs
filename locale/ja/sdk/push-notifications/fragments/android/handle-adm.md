## Amazon Device Messaging Push Notifications の処理

Amazon Device Messaging (ADM) は、Kindle FireタブレットなどのAmazonデバイスで動作するアプリにプッシュ通知を送信するために使用されるサービスです。 ADMとアプリを統合することで、Amazon Pinpointを使用してADMモバイルプッシュチャネルを通じてアプリに通知を送信できます。

**前提条件**

Amazon PinpointとADMを使用してアプリにプッシュ通知を送信するには、次の手順が必要です。

1. Amazon Developer Account.

1. Amazon Device MessagingからのクライアントIDとクライアントシークレット。

1. ADM 登録 ID (ADM プラットフォームを含むエンドデバイスによって提供されます)。

**ADMとアプリの統合**

If you are already familiar with ADM and have ADM credentials, you can follow the steps for [Integrating Your App with Amazon Device Messaging](https://developer.amazon.com/public/apis/engage/device-messaging/tech-docs/adm-integrating-your-app) in the Amazon Developer documentation. Otherwise, for an introduction to ADM, see [Understanding Amazon Device Messaging](https://developer.amazon.com/docs/adm/overview.html).

Amazon Pinpoint と統合するには、 `com.amazon.device.messaging.ADMMessageHandlerBase` のサブクラス実装には、次のメソッドが含まれており、対応する呼び出しを実行する必要があります。

**`onRegistered`**

デバイスが ADM サービスに登録されたときに呼び出されます。 Amazon Pinpointでデバイスを登録するために必要なADM登録IDを提供します。このメソッドの一部として次の呼び出しを含めます：

```java
pinpointManager.getNotificationClient().registerDeviceToken(registrationId)
```

**`onUnregistred`**

デバイスが ADM サービスに登録されなくなったときに呼び出されます。

**`onMessage`**

デバイスがADMからメッセージ通知を受け取ったときに呼び出されます。このメソッドの一部として以下を含めてください。

```java
NotificationDetails = NotificationDetailsBuilder.builder()
                                .intent(intent);
                                .intentAction(NotificationClient.ADM_INTEN_ACTION)
                                .build();

pinpointManager.getNotificationClient().handleCampaignPush(details)
```

**ADM プッシュ通知のテスト**

テストには、Amazon Pinpoint プロジェクト、ADM クライアントID、ADM クライアントシークレットが必要です。

始める前に、登録後にデバイストークンを表示するアプリを増強してください。デバイストークンは以下のように呼び出すことで取得できます。

```java
pinpointManager.getNotificationClient().getDeviceToken()
```

Amplify CLI と Amazon Pinpoint コンソールを使用して、以下の手順を完了し、ADM プッシュ通知をテストします。

Amazon Pinpoint プロジェクトでチャンネルとして ADM を登録します。ADM クライアント ID と ADM クライアントシークレットを提供します。

次のコマンドを実行して、Amazon Pinpoint コンソールに移動します。

```bash
コンソール分析を増幅する
```

* 左側のペインで、 `設定` と `プッシュ通知` を選択します。
* `Edit` をクリックして `Show more push notification services` を選択し、 `Amazon Device Messaging` をクリックします。
* `Client ID` と `Client Secret` を入力し、ページの右下にある `Save` をクリックします。

現在、 `ADM` がプッシュ通知サービスとして登録されています。

ADMが有効なデバイスにアプリをインストールし、生成されたデバイストークンをキャプチャします。

アドレスとしてデバイストークンを指定してデバイスにダイレクトメッセージを送信します。

* Amazon Pinpoint コンソールで、 `Test messages` に移動します。
* `Push notifications` をチャンネルとして選択します。
* エンドポイントIDまたはデバイストークンを `デスティネーション`に入力します。
* プッシュ通知サービスとして `ADM` を選択します。
* メッセージを作成し、ダイレクトメッセージを送信するには、ページ右下の `メッセージを送信` をクリックします。

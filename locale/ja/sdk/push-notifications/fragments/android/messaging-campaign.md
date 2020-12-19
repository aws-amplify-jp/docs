The [Amazon Pinpoint console](https://console.aws.amazon.com/pinpoint/) enables you to target your app users with push messaging. You can send individual messages or configure campaigns that target a group of users that match a profile that you define. For instance, you could email users that have not used the app in 30 days, or send an SMS to those that frequently use a given feature of your app.

次の手順では、アプリを対象としたプッシュ通知を受信する方法を示します。

1. アプリにプッシュリスナーサービスを追加します。

    The name of the class must match the push listener service name used in the app manifest. `pinpointManager` is a reference to the static `PinpointManager` variable declared in the `MainActivity` shown in a previous step. Use the following steps to detect and display Push Notification in your app.

1. 以下のプッシュ・リスナーのコードは、アプリの `MainActivity` が前のセクションで説明されているマニフェスト・セットアップを使用して設定されていることを前提としています。

    ```java
    import android.content.Intent;
    import android.os.Bundle;
    import android.support.v4.content.LocalBroadcastManager;
    import android.util.Log;

    import com.amazonaws.mobileconnectors.pinpoint.targeting.notification.NotificationClient;
    import com.amazonaws.mobileconnectors.pinpoint.targeting.notification.NotificationDetails;
    import com.google.firebase.messaging.FirebaseMessagingService;
    import com.google.firebase.messaging.RemoteMessage;

    import java.util.HashMap;

    public class PushListenerService extends FirebaseMessagingService {
        public static final String TAG = PushListenerService.class.getSimpleName();

        // Intent action used in local broadcast
        public static final String ACTION_PUSH_NOTIFICATION = "push-notification";
        // Intent keys
        public static final String INTENT_SNS_NOTIFICATION_FROM = "from";
        public static final String INTENT_SNS_NOTIFICATION_DATA = "data";

        @Override
        public void onNewToken(String token) {
            super.onNewToken(token);

            Log.d(TAG, "Registering push notifications token: " + token);
            MainActivity.getPinpointManager(getApplicationContext()).getNotificationClient().registerDeviceToken(token);
        }

        @Override
        public void onMessageReceived(RemoteMessage remoteMessage) {
            super.onMessageReceived(remoteMessage);
            Log.d(TAG, "Message: " + remoteMessage.getData());

            final NotificationClient notificationClient = MainActivity.getPinpointManager(getApplicationContext()).getNotificationClient();

            final NotificationDetails notificationDetails = NotificationDetails.builder()
                    .from(remoteMessage.getFrom())
                    .mapData(remoteMessage.getData())
                    .intentAction(NotificationClient.FCM_INTENT_ACTION)
                    .build();

            NotificationClient.CampaignPushResult pushResult = notificationClient.handleCampaignPush(notificationDetails);

            if (!NotificationClient.CampaignPushResult.NOT_HANDLED.equals(pushResult)) {
                /**
                   The push message was due to a Pinpoint campaign.
                   If the app was in the background, a local notification was added
                   in the notification center. If the app was in the foreground, an
                   event was recorded indicating the app was in the foreground,
                   for the demo, we will broadcast the notification to let the main
                   activity display it in a dialog.
                */
                if (NotificationClient.CampaignPushResult.APP_IN_FOREGROUND.equals(pushResult)) {
                    /* Create a message that will display the raw data of the campaign push in a dialog. */
                    final HashMap<String, String> dataMap = new HashMap<>(remoteMessage.getData());
                    broadcast(remoteMessage.getFrom(), dataMap);
                }
                return;
            }
        }

        private void broadcast(final String from, final HashMap<String, String> dataMap) {
            Intent intent = new Intent(ACTION_PUSH_NOTIFICATION);
            intent.putExtra(INTENT_SNS_NOTIFICATION_FROM, from);
            intent.putExtra(INTENT_SNS_NOTIFICATION_DATA, dataMap);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        }

        /**
         * Helper method to extract push message from bundle.
         *
         * @param data bundle
         * @return message string from push notification
         */
        public static String getMessage(Bundle data) {
            return ((HashMap) data.get("data")).toString();
        }
    }
    ```

1. Amazon Pinpointコンソールからアプリに通知を送信する新しいキャンペーンを作成するには、アプリのプロジェクトフォルダから次のコマンドを実行します。

    ```bash
    通知コンソールを増幅する
    ```

1. Provide a campaign name, choose `Next`, choose `Filter by standard attributes`, and then choose `android` as the platform.

1. 私たちがAndroidデバイス上で実行しているアプリであるターゲットエンドポイントとして、1つのデバイスが表示されるはずです。 オプションを選択し、 `次のステップ` を選択します。

1. プッシュ通知のサンプルタイトルと本文のテキストを入力し、 `次のステップ` を選択します。

1. `即時`を選択し、 `次のステップ` を選択します。

1. 画面の詳細を確認し、 `キャンペーンを開始` を選択します。

1. Androidデバイスに通知が表示されます。 前面にあるときと閉じたときに通知を受け取るアプリをテストすることができます。

## 次のステップ

* [FCM / GCM プッシュ通知の処理](~/sdk/push-notifications/setup-push-service.md#handling-fcmgcm-push-notifications)

* [Amazon Device Messaging Push Notifications の処理](~/sdk/push-notifications/setup-push-service.md#handling-amazon-device-messaging-push-notifications)

* [Baiduプッシュ通知の処理](~/sdk/push-notifications/setup-push-service.md#handling-baidu-push-notifications)

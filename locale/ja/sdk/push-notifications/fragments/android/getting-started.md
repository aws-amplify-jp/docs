Enable your users to receive mobile push messages sent from the Apple (APNs) and Google (FCM/GCM) platforms. The CLI deploys your push notification backend using [Amazon Pinpoint](http://docs.aws.amazon.com/pinpoint/latest/developerguide/). You can also create Amazon Pinpoint campaigns that tie user behavior to push or other forms of messaging.

## バックエンドを設定

1. 先に進む前に [はじめに](~/start/start.md) ステップを完了してください。

1. CLI を使用して、クラウド対応のバックエンドとアプリにストレージを追加します。

    In a terminal window, navigate to your project folder (the folder that typically contains your project level `build.gradle`), and add the SDK to your app.

    ```bash
    cd ./YOUR_PROJECT_FOLDER
    増幅して通知を追加
    ```

1. プッシュ通知の受信をサポートするバックエンドを設定:

    - Firebase Cloud Messaging (FCM) を選択します。

        ```console
        > FCM
        ```

    - Provide your ApiKey. The FCM console refers to this value as `ServerKey`. For information on getting an FCM ApiKey, see the section [Setting Up FCM/GCM Guide](~/sdk/push-notifications/setup-push-service.md). Use the steps in the next section to connect your app to your backend.

## バックエンドに接続

アプリをプッシュ通知バックエンドサービスに接続するには、次の手順を実行します。

1. 次の依存関係とプラグインを `app/build.gradle`に追加します:

    ```groovy
    dependencies {
        // Overrides an auth dependency to ensure correct behavior
        implementation 'com.google.android.gms:play-services-auth:15.0.1'

        implementation 'com.google.firebase:firebase-messaging:17.3.0'

        implementation 'com.amazonaws:aws-android-sdk-pinpoint:2.15.+'
        implementation ('com.amazonaws:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
    }

    apply plugin: 'com.google.gms.google-services'
    ```

1. 以下をプロジェクト レベル `build.gradle`に追加します。 `google` リポジトリを指定してください:

    ```groovy
    buildscript {
        dependencies {
            classpath 'com.google.gms:google-services:4.0.1'
        }
    }

    allproject {
        repositories {
            google()
        }
}
    ```

1. `AndroidManifest.xml` は `PushListenerService` の次のサービスの定義をアプリケーション タグに含める必要があります。

    ```xml
    <service
        android:name=".PushListenerService">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
        </intent-filter>
    </service>
    ```

1. プッシュ通知コードの場所に Amazon Pinpoint クライアントを作成します。

    ```java
    import android.content.BroadcastReceiver;
    import android.content.Context;
    import android.content.Intent;
    import android.content.IntentFilter;
    import android.os.Bundle;
    import android.support.annotation.NonNull;
    import android.support.v4.content.LocalBroadcastManager;
    import android.support.v7.app.AlertDialog;
    import android.support.v7.app.AppCompatActivity;
    import android.util.Log;

    import com.amazonaws.mobile.client.AWSMobileClient;
    import com.amazonaws.mobile.client.AWSStartupHandler;
    import com.amazonaws.mobile.client.AWSStartupResult;
    import com.amazonaws.mobileconnectors.pinpoint.PinpointConfiguration;
    import com.amazonaws.mobileconnectors.pinpoint.PinpointManager;
    import com.google.android.gms.tasks.OnCompleteListener;
    import com.google.android.gms.tasks.Task;
    import com.google.firebase.iid.FirebaseInstanceId;
    import com.google.firebase.iid.InstanceIdResult;

    public class MainActivity extends AppCompatActivity {
        public static final String TAG = MainActivity.class.getSimpleName();

        private static PinpointManager pinpointManager;

        public static PinpointManager getPinpointManager(final Context applicationContext) {
            if (pinpointManager == null) {
                final AWSConfiguration awsConfig = new AWSConfiguration(applicationContext);
                AWSMobileClient.getInstance().initialize(applicationContext, awsConfig, new Callback<UserStateDetails>() {
                    @Override
                    public void onResult(UserStateDetails userStateDetails) {
                        Log.i("INIT", userStateDetails.getUserState());
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

                FirebaseInstanceId.getInstance().getInstanceId()
                        .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                            @Override
                            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                                if (!task.isSuccessful()) {
                                    Log.w(TAG, "getInstanceId failed", task.getException());
                                    return;
                                }
                                final String token = task.getResult().getToken();
                                Log.d(TAG, "Registering push notifications token: " + token);
                                pinpointManager.getNotificationClient().registerDeviceToken(token);
                            }
                        });
            }
            return pinpointManager;
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            // Initialize PinpointManager
            getPinpointManager(getApplicationContext());
        }
    }
    ```

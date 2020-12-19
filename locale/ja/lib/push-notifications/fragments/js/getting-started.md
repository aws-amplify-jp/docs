Android と iOS 用にセットアップ手順が提供されており、両方のプラットフォームの設定は同じ React Native プロジェクトに含めることができます。

## 要件
1. Amazon Pinpointを使用するには、AndroidやiOSなどの対象となるモバイルプラットフォームの資格情報(キーまたは証明書)を設定する必要があります。
2. プッシュ通知のテスト シミュレータやエミュレータはプッシュ通知を処理できないため、物理的なデバイスが必要です。

<amplify-callout>

プッシュ通知カテゴリは [AWS Amplify Analytics category](~/lib/analytics/getting-started.md) と統合され、通知を追跡できます。 プッシュ通知カテゴリを設定する前に、アプリで Analytics カテゴリを設定していることを確認します。

</amplify-callout>

## Android 用のセットアップ

1. [Firebase プロジェクト](https://console.firebase.google.com) とアプリのセットアップがあることを確認してください。

2. Firebase コンソールで Android 向けプッシュメッセージの認証情報を取得します。 [手順は こちら](~/sdk/push-notifications/setup-push-service.md/q/platform/android) をクリックしてください。

3. 依存関係のインストール:

    ```bash
    npm install aws-amplify @aws-amplify/pushnotification
    ```

4. Amplify CLI を使用して、プッシュメッセージングの認証情報(サーバーキー)を追加します。

    ```bash
    増幅して通知を追加
    ```

    プロモーション時に *FCM* を選択:

    ```console
    ? 有効にするプッシュ通知チャンネルを選択します。
    APNS
    <unk> FCM
    メール
    SMS
    ```

    CLI は *Firebase 資格情報*を要求し、それぞれ入力します。


    You can find said *Firebase credentials* by visiting https://console.firebase.google.com/project/[your-project-id]/settings/cloudmessaging or by navigating to (gear-next-to-project-name) > Project Settings > Cloud Messaging on the Firebase Console.

    あるいは、Amazon Pinpoint ConsoleでAndroidのプッシュ通知を設定できます。 [ここをクリックして手順](https://docs.aws.amazon.com/pinpoint/latest/developerguide/mobile-push-android.html)。

5. Firebaseでアプリを有効にします。これを行うには、次の手順に従ってください。

    <amplify-callout> 既存の Firebase プロジェクトをお持ちでない場合は、続行するには作成する必要があります。 </amplify-callout>

    * [Firebase コンソール](https://console.firebase.google.com)にアクセスし、 **プロジェクト概要** の横にあるギアアイコンをクリックし、 **プロジェクト設定** をクリックします。
    * **Add App**をクリックします。既存のアプリがある場合は、この手順をスキップできます。
    * **FirebaseをAndroidアプリに追加**
    * パッケージ名、例えば **com.myProjectName** を追加し、 **アプリを登録** をクリックします。
    * *google-services.json* ファイルをダウンロードし、 `android/app` プロジェクトフォルダの下にコピーします。

    <amplify-callout warning>

    *google-services.json* ファイルが用意されているか、ビルドプロセスに合格しないことを確認してください。

    </amplify-callout>

6. *android/build.gradle* ファイルを開き、次の編集を行います:

    - `classpath("com.google.gms:google-services:4.3.3")` `buildscript` の下の `依存関係に追加`:

    ```gradle
    buildscript {
        ...
        dependencies {
            ...
            classpath("com.google.gms:google-services:4.3.3")
            ...
        }
}
    ```

7. *android/app/build.gradle* を開き、以下の編集を行います:

    - Firebase libs を `依存関係` セクションに追加します。

    ```gradle
    dependencies {
        ...
        implement "com.google.firebase:firebase-core:15.0.2"
        implementation "com.google.firebase:firebase-messaging:15.0.2"
        ...
}
    ```
    - 以下の設定をファイルの一番下に追加します:

    ```gradle
    apply plugin: "com.google.gms.google-services"
    ```

8. *android/gradle/wrapper/gradle-wrapper.properties* Gradle を更新する `distributionUrl`:

    ```properties
    distributionUrl=https\://services.gradle.org/distributions/gradle-6.3-all.zip
    ```

9. *android/app/src/main/AndroidManifest.xml* ファイルを開き、 `アプリケーション` 要素に次の設定を追加します。

    ```xml
    <application ... >

        <!--[START Push notification config -->
            <!-- [START firebase_service] -->
            <service
                android:name="com.amazonaws.amplify.pushnotification.RNPushNotificationMessagingService">
                <intent-filter>
                    <action android:name="com.google.firebase.MESSAGING_EVENT"/>
                </intent-filter>
            </service>
            <!-- [END firebase_service] -->
            <!-- [START firebase_iid_service] -->
            <service
                android:name="com.amazonaws.amplify.pushnotification.RNPushNotificationDeviceIDService">
                <intent-filter>
                    <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
                </intent-filter>
            </service>
            <receiver
                android:name="com.amazonaws.amplify.pushnotification.modules.RNPushNotificationBroadcastReceiver"
                android:exported="false" >
                <intent-filter>
                    <action android:name="com.amazonaws.amplify.pushnotification.NOTIFICATION_OPENED"/>
                </intent-filter>
            </receiver>
        <!-- [END Push notification config -->

    </application>
    ```

10. [アプリの設定](#configure-your-app) セクションに示すように、アプリのプッシュ通知カテゴリを設定します。

11. アプリの実行:

    ```bash
    npx react-native run-android
    ```

## iOS用のセットアップ

1. iOS のプッシュ通知を設定するには、 [Apple Developer Center](https://developer.apple.com/xcode/) から Xcode をダウンロードしてインストールする必要があります。

2. [Amazon Pinpoint Developer Guide](https://docs.aws.amazon.com/pinpoint/latest/developerguide/apns-setup.html) で指示されているように、iOS プッシュ通知を設定し、p12 証明書を作成します。

3. 依存関係と CocoaPods のインストール:

    ```bash
    npm install aws-amplify @aws-amplify/pushnotification @react-native-community/push-notification-ios
    ```
    ```bash
    npx pod-install
    ```

4. 次のコマンドを使用して、通知を有効にし、Amplify CLI を使用してp12 証明書を追加します。

    ```bash
    増幅して通知を追加
    ```

    プロモーション時に *APNS* を選択:

    ```console
    ? 有効にするプッシュ通知チャンネルを選択してください。
    > APNS
    FCM
    メール
    SMS
    ```

    プロモーション時に *証明書* を選択:

    ```console
    ? APNs
    > Certificate
    Key に使用される認証方法を選択してください
    ```

    CLI は *p12 証明書パス*をプロンプトし、それぞれ入力します。

5. Xcode でプロジェクトを開き、 `@react-native-community/push-notification-ios`:
    - [機能を追加: バックグラウンドモード - リモート通知](https://github.com/react-native-community/push-notification-ios#add-capabilities--background-mode---remote-notifications)
    - [Augment `AppDelegate`](https://github.com/react-native-community/push-notification-ios#augment-appdelegate)

6. 一般的なアプリ設定を更新:

    - バンドル識別子を設定 (Apple Developer Accountで作成した識別子)
    - Xcode の Apple Developer アカウントでログインし、ターゲット用の Team が選択されていることを確認してください。

7.  [アプリの設定](#configure-your-app) セクションに示すように、アプリのプッシュ通知モジュールを設定します。

8. アプリの実行:

    ```bash
    npx react-native run-ios --device
    ```

## アプリの設定

プッシュ通知カテゴリは `Analytics` モジュールと統合され、通知を追跡できます。 プッシュ通知モジュールを設定する前に、アプリで Analytics モジュールを設定していることを確認してください。

<amplify-callout>

Analytics がまだ有効になっていない場合は、 [Analytics Developer Guide](~/lib/analytics/getting-started.md) を参照して、アプリケーションに Analytics を追加してください。

</amplify-callout>

```javascript
import Amplify from 'aws-amplify';
import PushNotification from '@aws-amplify/pushnotification';
import { PushNotificationIOS } from '@react-native-community/push-notification-ios';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
```

### 設定オプション

- `requestIOSPermissions` is an optional boolean flag which specifies whether or not to automatically request push notifications permissions in iOS when calling `PushNotification.configure` for the first time. If not provided, it defaults to `true`. When set to `false`, you may later call the method `PushNotification.requestIOSPermissions` at the explicit point in your application flow when you want to prompt the user for permissions.
- `appId` is optional and *only* needed if `aws-exports` doesn't contain `aws_mobile_analytics_app_id` or you are manually configuring each category inside `Amplify.configure()`.

```javascript
Amplify.configure({
    ...awsconfig,
    PushNotification: {
        requestIOSPermissions: false
    }
});
```
```javascript
Amplify.configure({
    Auth: { /* ... */ },
    Analytics: { /* ... */ },
    PushNotification: {
        appId: 'XXXXXXXXXXabcdefghij1234567890ab',
        requestIOSPermissions: false
    }
});
```

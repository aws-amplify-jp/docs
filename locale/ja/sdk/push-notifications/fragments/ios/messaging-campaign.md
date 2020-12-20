The [Amazon Pinpoint console](https://console.aws.amazon.com/pinpoint/) enables you to target your app users with push messaging. You can send individual messages or configure campaigns that target a group of users that match a profile that you define. For instance, you could email users that have not used the app in 30 days, or send an SMS to those that frequently use a given feature of your app.

次の手順では、アプリを対象としたプッシュ通知を受信する方法を示します。

1. Amazon Pinpoint プッシュ通知をアプリに受信するには、 `ピンポイントを使用します。 otificationManager <code>` で [`アプリケーション(_:didRegisterForRemoteNotificationsWithDeviceToken:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622958-application) アプリケーションがAppDelegate でコールバックします。

    Then add and call a function like [`registerForPushNotifications()`](https://developer.apple.com/documentation/uikit/uiapplication/1623078-registerforremotenotifications) to prompt permission from the user for the app to use notifications. The following example uses the [`UNUserNotificationCenter`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter) framework, which is available in iOS 10.0+. Choose the right location in your app to prompt the user for permissions. In the following example the call is implemented in the [`application(_:didFinishLaunchingWithOptions:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application) event in AppDelegate. This causes the prompt to appear when the app launches.

    ```swift
    import UserNotifications

    // Other imports...

    class AppDelegate: UIResponder, UIApplicationDelegate {

        // Other app delegate methods...
        func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
            // Other didFinishLaunching code, including Pinpoint initialization...

            registerForPushNotifications()

            // Other didFinishLaunching code...
        }

        func application(
            _ application: UIApplication,
            didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {

            pinpoint!.notificationManager.interceptDidRegisterForRemoteNotifications(
                withDeviceToken: deviceToken)
        }

        func application(
            _ application: UIApplication,
            didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                                        fetchCompletionHandler completionHandler:
            @escaping (UIBackgroundFetchResult) -> Void) {

            pinpoint!.notificationManager.interceptDidReceiveRemoteNotification(
                userInfo, fetchCompletionHandler: completionHandler)

            if (application.applicationState == .active) {
                let alert = UIAlertController(title: "Notification Received",
                                              message: userInfo.description,
                                              preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))

                UIApplication.shared.keyWindow?.rootViewController?.present(
                    alert, animated: true, completion:nil)
            }
        }

        // Request user to grant permissions for the app to use notifications
        func registerForPushNotifications() {
            UNUserNotificationCenter.current().delegate = self
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
                (granted, error) in
                print("Permission granted: \(granted)")
                // 1. Check if permission granted
                guard granted else { return }
                // 2. Attempt registration for remote notifications on the main thread
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }

        // Other app delegate methods...
    }
    ```

    **Note**: If you already have push notification delegate methods, you can just add the [`interceptDidRegisterForRemoteNotificationsWithDeviceToken:`](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSPinpoint/Classes/AWSPinpointNotificationManager.html#/c:objc(cs)AWSPinpointNotificationManager(im)interceptDidRegisterForRemoteNotificationsWithDeviceToken:) and [`interceptDidReceiveRemoteNotification:fetchCompletionHandler:`](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSPinpoint/Classes/AWSPinpointNotificationManager.html#/c:objc(cs)AWSPinpointNotificationManager(im)interceptDidReceiveRemoteNotification:fetchCompletionHandler:) callbacks to Pinpoint client.

1. In Xcode Project Navigator, choose your app name at the top, choose your app name under **Targets**, choose the **Capabilities** tab, and then turn on **Push Notifications**.

1. デフォルトの **Debug** プロファイルの代わりに、 **Release** プロファイルで実行するアプリを構成します。 次の手順を実行して、デバイスに通知を取得します。

    1. アプリをターゲットにしてください プロジェクト構成の **一般** タブに移動し、 **署名の自動管理** チェックボックスが選択されていないことを確認します。

    1. In the **Signing (Release)** section, choose the production provisioning profile you created on Apple developer console. For testing push notifications on a device, you will need an [Ad Hoc Provisioning Profile](https://help.apple.com/xcode/mac/current/#/dev4335bfd3d) configured with a Production AppStore and Ad Hoc certificate, and with the device(s) to be used for testing.

    1. In the top left corner of Xcode (where your app name is displayed next to the current build target device), choose on your app name and then select **Edit Scheme**, and then set **Build configuration** to **Release**

        **メモ**: iPhone デバイスでアプリを実行してテストします。プッシュ通知はシミュレータではサポートされていません。

    1. Xcode は、アプリを実行できなかったことにエラーが発生します。これは、本番プロファイルのアプリがデバッグできないためです。 **OK** をクリックし、デバイスから直接アプリを起動します。

    1. プロンプトが表示されたら、デバイスの通知を許可することを選択しました。

    1. Amazon Pinpointコンソールからアプリに通知を送信する新しいキャンペーンを作成するには、アプリのプロジェクトフォルダから次のコマンドを実行します。

        ```bash
        cd YOUR_APP_PROJECT_FOLDER
        増幅通知コンソール
        ```

    1. キャンペーン名を入力し、 **次の**を選択し、 **標準属性**でフィルター を選択し、プラットフォームとして iOS を選択します。

    1. 私たちがiPhoneデバイス上で実行しているアプリであるターゲットエンドポイントとして、1デバイスが表示されるはずです。 オプションを選択し、 **次のステップ** を選択します。

    1. プッシュ通知のサンプルタイトルと本文のテキストを入力し、 **次のステップ** を選択します。

    1. **即時**を選択し、 **次のステップ** を選択します。

    1. 画面の詳細を確認し、 **キャンペーンを開始** を選択します。

    1. iPhoneに通知が表示されます。 アプリがフォアグラウンドにあるときや閉じられているときに、プッシュ通知をテストすることをお勧めします。

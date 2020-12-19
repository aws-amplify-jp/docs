Enable your users to receive mobile push messages sent from the Apple (APNs) and Google (FCM/GCM) platforms. The Amplify CLI deploys your push notification backend using [Amazon Pinpoint](http://docs.aws.amazon.com/pinpoint/latest/developerguide/). You can also create Amazon Pinpoint campaigns that tie user behavior to push or other forms of messaging.

## バックエンドを設定

### 前提条件

1. 先に進む前に [はじめに](~/start/start.md) ステップを完了してください。

1. On Xcode, under the target, select "Signing & Capabilities", make sure the `Bundle Identifier` is unique. Make sure `Automatically manage signing` is enabled and your apple developer team is chosen.

1. デバイスを接続し、それが登録されていることを確認し、このページでプロファイルをプロビジョニングする際にエラーが発生しません。

1. Click on `+ Capability`, and add `Push Notification` and `Background Modes`. For `Background Modes`, have `Remote notifications` checked.

### ステップバイステップ

1. 新しいAmplifyプロジェクトを設定します。既存のプロジェクトを使用している場合は、このステップをスキップできます。

    ```
    initを増幅する
    ```

1. ゲストと認証されていないユーザーが分析イベントを送信できるように、アプリに分析機能を追加します。

    ```
    anmpify add analytics
    ```

1. バックエンドの提供:

    ```
    push を増幅する
    ```

## バックエンドに接続

プッシュ通知バックエンドサービスをアプリに接続するには、次の手順を実行します。

1. `Podfile` に以下のポッドを追加します:

    ```ruby
    target :'YOUR-APP-NAME' do
      use_frameworks!
      pod 'AWSPinpoint'
      pod 'AWSMIClient'
    end
    ```

    続行する前に `pod install --repo-update` を実行します。

1. `.xcworkspace` ファイルを開きます。

1. Make sure the project contains the `awsconfiguration.json` file and it is added to Xcode (by dragging it in with `copy as needed` checked). It should be generated when you [set up your backend](#set-up-your-backend).

1. アプリがビルドされていることを確認してください。

1. AppDelegate ファイルに次のインポート ステートメントを追加します。

    ```swift
    import UserNotifications
    import AWSPinpoint
    ```

1. In the `AppDelegate` file, inside [`application(_:didFinishLaunchingWithOptions:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application), initialize an [`AWSPinpoint`](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSPinpoint/Classes/AWSPinpoint.html) instance and register for push notifications from the user. When the app runs, the user will be prompt with a modal to allow notifications. We recommend you request for authorization from the user during app startup, so your users can begin receiving notifications as early as possible.

    ```swift
    class AppDelegate: UIResponder, UIApplicationDelegate {
        var pinpoint: AWSPinpoint?

        func application(
            _: UIApplication,
            didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?
        ) -> Bool {
            // Instantiate Pinpoint
            let pinpointConfiguration = AWSPinpointConfiguration
                .defaultPinpointConfiguration(launchOptions: launchOptions)
            // Set debug mode to use APNS sandbox, make sure to toggle for your production app
            pinpointConfiguration.debug = true
            pinpoint = AWSPinpoint(configuration: pinpointConfiguration)

            // Present the user with a request to authorize push notifications
            registerForPushNotifications()

            return true
        }

        // MARK: Push Notification methods

        func registerForPushNotifications() {
            UNUserNotificationCenter.current().delegate = self
            UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .sound, .badge]) { [weak self] granted, _ in
                    print("Permission granted: \(granted)")
                    guard granted else { return }

                    // Only get the notification settings if user has granted permissions
                    self?.getNotificationSettings()
                }
        }

        func getNotificationSettings() {
            UNUserNotificationCenter.current().getNotificationSettings { settings in
                print("Notification settings: \(settings)")
                guard settings.authorizationStatus == .authorized else { return }

                DispatchQueue.main.async {
                    // Register with Apple Push Notification service
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }
    ```

    アプリがビルドされ、実行され、ユーザーに通知の承認を求めるように促します。

1. Add the AppDelegate methods to listen on the callbacks from [`UIApplication.shared.registerForRemoteNotifications()`](https://developer.apple.com/documentation/uikit/uiapplication/1623078-registerforremotenotifications). Either [`application(_:didRegisterForRemoteNotificationsWithDeviceToken:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622958-application) will be called indicating successfully registering with APNS or [`application(_:didFailToRegisterForRemoteNotificationsWithError:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622962-application) indicating a failure. On successfully registering with APNS, pass the device token to AWS pinpoint to register the endpoint

    ```swift
    // MARK: Remote Notifications Lifecycle
    func application(_: UIApplication,
                    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("Device Token: \(token)")

        // Register the device token with Pinpoint as the endpoint for this user
        pinpoint?.notificationManager
            .interceptDidRegisterForRemoteNotifications(withDeviceToken: deviceToken)
    }

    func application(_: UIApplication,
                    didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register: \(error)")
    }
    ```

1. アプリをビルドして実行します。出力されたデバイストークンが表示されます。

1. プッシュ通知を処理するには、 [`application(_:didReceiveRemoteNotification:fetchCompletionHandler:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application) を追加します。

    ```swift
    func application(_ application: UIApplication,
                    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult)
                        -> Void) {
        // if the app is in the foreground, create an alert modal with the contents
        if application.applicationState == .active {
            let alert = UIAlertController(title: "Notification Received",
                                          message: userInfo.description,
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))

            UIApplication.shared.keyWindow?.rootViewController?.present(
                alert, animated: true, completion: nil
            )
        }

        // Pass this remote notification event to pinpoint SDK to keep track of notifications produced by AWS Pinpoint campaigns.
        pinpoint?.notificationManager.interceptDidReceiveRemoteNotification(
            userInfo, fetchCompletionHandler: completionHandler
        )

        // Pinpoint SDK will not call the `completionHandler` for you. Make sure to call `completionHandler` or your app may be terminated
        // See https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application for more details
        completionHandler(.newData)
    }
    ```
    iOS 10 以降では、 `userNotificationCenter(_:willPresent:withCompletionHandler:)` と `userNotificationCenter(_:didReceive:withCompletionHandler:) の SDK に通知イベントを渡してください。`
    ```swift
    extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: (UNNotificationPresentationOptions) -> Void) {
        // Handle foreground push notifications
        pinpoint?.notificationManager.interceptDidReceiveRemoteNotification(notification.request.content.userInfo, fetchCompletionHandler: { _ in })

        // Make sure to call `completionHandler`
        // See https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649518-usernotificationcenter for more details
        completionHandler(.badge)
     }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: () -> Void)  {
        // Handle background and closed push notifications
        pinpoint?.notificationManager.interceptDidReceiveRemoteNotification(response.notification.request.content.userInfo, fetchCompletionHandler: { _ in })

        // Make sure to call `completionHandler`
        // See https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649501-usernotificationcenter for more details
        completionHandler()
    }
}
    ```

1. (オプション) AWSPinpoint SDK の詳細なログを有効にします。詳細なログを有効にすると、 `endpointId` が出力されます。 AWS Pinpointキャンペーンでプッシュ通知イベントをテストする場合に便利です。

    これを [`application(_:didFinishLaunchingWithOptions:) に追加します。`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application)

    ```swift
    AWSDDLog.sharedInstance.logLevel = .verbose
    AWSDDLog.add(AWSDDTTYLogger.sharedInstance)
    ```

### 手動設定

Amplify CLI を使用した自動構成の代替として、必要な構成を手動で入力できます。 次に、 `awsconfiguration.json` ファイルの関連するセクションの抜粋を示します。

```json
{
    "Version": "0.1.0",
    "IdentityManager": {
        "Default": {}
    },
    "CredentialsProvider": {
        "CognitoIdentity": {
            "Default": {
                "PoolId": "COGNITO-IDENTITY-POOL-ID",
                "Region": "COGNITO-IDENTITY-POOL-REGION"
            }
        }
    },
    "CognitoUserPool": {
        "Default": {
            "PoolId": "COGNITO-USER-POOL-ID",
            "AppClientId": "COGNITO-USER-APP-CLIENT-ID",
            "Region": "COGNITO-USER-POOL-REGION"
        }
    },
    "PinpointAnalytics": {
        "Default": {
            "AppId": "PINPOINT-APP-ID",
            "Region": "PINPOINT-REGION"
        }
    },
    "PinpointTargeting": {
        "Default": {
            "Region": "PINPOINT-REGION"
        }
    }
}
```

設定ファイルに次の変更を加えます。値は [AWS コンソール](https://console.aws.amazon.com) で使用できます。

* **CognitoIdentity**
    * `COGNITO-IDENTITY-POOL-ID` を ID プールの ID に置き換えます。
    * 識別プールが作成されたリージョンに `COGNITY-POOL-REGION` を置き換えます。
* **CognitoUserPool**
    * `COGNITO-USER-POOL-ID` をユーザプール ID に置き換えます。
    * ユーザープールが作成されたリージョンに `COGNITO-USER-POOL-REGION` を置き換えます。
    * `COGNITO-USER-APP-CLIENT-ID` を、ユーザプールへのアクセス権を持つアプリクライアントIDに置き換えます。
    * `COGNITO-USER-POOL-APP-CLIENT-SECRET` をアプリクライアントIDのアプリクライアントシークレットに置き換えます。
    * ユーザープールが作成されたリージョンに `COGNITO-USER-POOL-REGION` を置き換えます。
* **PinpointAnalytics**
    * `PINPOINT-APP-ID` を Pinpoint プロジェクトのプロジェクト ID に置き換えます。
    * Pinpoint プロジェクトが作成されたリージョンに `PINPOINT-REGION` を置き換えます。
* **ターゲットのピンポイント**
    * Pinpoint プロジェクトが作成されたリージョンに `PINPOINT-REGION` を置き換えます。


## Amazonピンポイントターゲットとキャンペーンプッシュメッセージを追加

The [Amazon Pinpoint console](https://console.aws.amazon.com/pinpoint/) enables you to target your app users with push messaging. You can send individual messages or configure campaigns that target a group of users that match a profile that you define. For instance, you could email users that have not used the app in 30 days, or send an SMS to those that frequently use a given feature of your app.

次の手順では、アプリを対象としたプッシュ通知を送信する方法を示します。

1. https://developer.apple.com/account/ に移動

1. 「証明書、識別子 & プロファイル」の下で、左側の「キー」をクリックして+をクリックしてください。 「プッシュ通知キー」のような名前を入力し、Apple Push Notification Service (APNs) をチェックしてください。 ファイルを登録してダウンロードします。format@@0 AuthKey_ `<Key ID>.p8` の形式である必要があります。

1. 「チームID」を取得するには、「メンバーシップの詳細」ページに移動してください。

1. `増幅通知を追加`を実行する

    ```
    ? Choose the push notification channel to enable. `APNS`
    ? Choose authentication method used for APNs `Key`
    ? The bundle id used for APNs Tokens:  <Your App's BundleID like com.yourname.projectname>
    ? The team id used for APNs Tokens:  `XXXXXXXXX`
    ? The key id used for APNs Tokens:  `ABCDEXXXXX`
    ? The key file path (.p8):  `AuthKey_ABCDEXXXXX.p8`
    ✔ The APNS channel has been successfully enabled.
    ```

1. AWSピンポイントコンソールを `増幅コンソール解析`で開く

1. 「キャンペーン」に移動し、「キャンペーンの作成」をクリックし、キャンペーン名を指定し、チャンネルとして「プッシュ通知」を選択し、「次へ」をクリックします。

1. In the segment section, select `Create a segment` and you should see 1 device as a targeted endpoint, which is the app we are running on the device. Choose this option and then choose **Next Step**.

1. プッシュ通知のサンプルタイトルと本文のテキストを入力し、アプリから取得したデバイストークンまたはエンドポイントIDを入力します。

    - アプリがフォアグラウンドにあることを確認してください Test messageをクリックすると、テストメッセージがプッシュ通知データにラップされたアラートモーダルが表示されます。
    - アプリがバックグラウンドにあることを確認し、テストメッセージをクリックすると、上から下にプッシュ通知が表示されます。


## キャンペーンメッセージングイベント

ユーザーが通知を受け取ってタップしたとき AWS Pinpoint SDK は、AWS Pinpoint コンソールでフィルタリングできる対応するイベントを送信します。

`_campaign.opened_notification` イベントは、アプリの非アクティブ状態または終了状態から通知を開いたときに送信されます。

`_campaign.received_foreground` アプリがフォアグラウンドで受信されたとき。

`_campaign.received_background` アプリがバックグラウンドでタップされたときの通知

開発者がデバイス上で受信しても通知をタップしない場合。 アプリは、その通知がデバイスによって受信されたことを知る方法がないため、そのためのイベントを送信しません。

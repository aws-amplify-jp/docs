## トラッカーリソースを作成

トラッキングを開始するには、Amazon Location Tracking リソースを作成して、ユーザーの位置を取得して保存します。

1. トラッカーを作成するには、 [Amazon Location Service コンソール](https://console.aws.amazon.com/location/tracking/home#/create) を開きます。
1. **名前** に **MyTracker** を入力します。
1. **Create tracker** を押します。

      ![Amazon Location Service - トラッカーの作成](~/images/als/create-tracker.png)

1. トラッカーの Amazon Resource Name (ARN) に注意してください。以下のスクリーンショットのように、 **arn:aws:geo** から始まります。

      ![Amazon Location Service - トラッカー](~/images/als/my-tracker.png)

## ゲストユーザーにトラッカーへのアクセスを許可する

トラッカーリソースを作成したら、アプリケーションのユーザーにリソースへのアクセスを許可するインラインポリシーを作成する必要があります。

1. プロジェクトのルートに移動し、次のコマンドを実行します。

    ```bash
    コンソールの認証を増幅する
    ```

1. **どのコンソール** から **アイデンティティプール** を選択します。
1. Amazon Cognitoコンソールに移動します。ページの右上隅にある **Edit Identity pool** をクリックします。
1. Open the drop down for **Unauthenticated identities**, choose **Enable access to unauthenticated identities**, and then press **Save Changes**.
1. Click on **Edit identity pool** once more. Make a note of the name of the Unauthenticated role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`.
1. ロールを管理するには、 [AWS Identity and Access Management (IAM) コンソール](https://console.aws.amazon.com/iam/home#/roles) を開きます。
1. **Search** フィールドに、上記に記載されている unauthRole の名前を入力してクリックします。
1. **+ Add インラインポリシー**をクリックし、 **JSON** タブをクリックします。
1. **[ARN]** プレースホルダに上記のトラッカーのARNを記入し、ポリシーの内容を以下に置き換えます。

    ```json
{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "geo:BatchUpdateDevicePosition",
                "Resource": "[ARN]"
            }
        ]
}
    ```

1. **Review Policy** ボタンをクリックします。
2. **名前** フィールドに、 **LocationTracker** と入力します。
3. **ポリシーの作成** ボタンをクリックします。

これで、iOSアプリに認証が正常に追加されました。

## コア位置情報サービスの設定

アプリがデバイスの場所を取得するために。 最初に [コアロケーション](https://developer.apple.com/documentation/corelocation) サービスを使用するようにアプリを設定します。 次の手順に従って、権限のリクエストと位置情報の更新を取得します。

1. **情報に記載されています。 list ** file,** set the `Privacy - Location When In Use Description` and a description message. このメッセージは、アプリが位置情報へのアクセス許可を要求すると、ユーザーに表示されます。</li>
2
次の内容で `LocationManagement.swift` という新しいファイルを作成します。

    <amplify-block-switcher> <amplify-block name="Deployment target iOS 14">

    ```swift
    import CoreLocation

    class LocationManagement: NSObject, ObservableObject, CLLocationManagerDelegate {
    let locationManager = CLLocationManager()

    override init() {
      super.init()
      requestUserLocation()
    }

    func requestUserLocation() {
      // Set delegate before requesting for authorization
      locationManager.delegate = self
      // You can request for `WhenInUse` or `Always` depending on your use case
      locationManager.requestWhenInUseAuthorization()
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse:
            print("Received authorization of user location, requesting for location")
            locationManager.startUpdatingLocation()
        default:
            print("Failed to authorize")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
          print("Got locations: \(locations)")           
    }

    // Error handling is required as part of developing using CLLocation
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
          if let clErr = error as? CLError {
              switch clErr {
              case CLError.locationUnknown:
                  print("location unknown")
              case CLError.denied:
                  print("denied")
              default:
                  print("other Core Location error")
              }
          } else {
              print("other error:", error.localizedDescription)
          }
      }
    }
    ```

    </amplify-block> <amplify-block name="Deployment target iOS 13">

    ```swift
    import CoreLocation

    class LocationManagement: NSObject, CLLocationManagerDelegate {
        let locationManager = CLLocationManager()

        override init() {
            super.init()
            requestUserLocation()
        }

        func requestUserLocation() {
            // Set delegate before requesting for authorization
            locationManager.delegate = self
            // You can request for `WhenInUse` or `Always` depending on your use case
            locationManager.requestWhenInUseAuthorization()
        }

        func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
            switch status {
            case .authorizedWhenInUse:
                print("Received authorization of user location, requesting for location")
                locationManager.startUpdatingLocation()
            default:
                print("Failed to authorize")
            }
        }

        func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
            print("Got locations: \(locations)")
        }

        // Error handling is required as part of developing using CLLocation
        func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
            if let clErr = error as? CLError {
                switch clErr {
                case CLError.locationUnknown:
                    print("location unknown")
                case CLError.denied:
                    print("denied")
                default:
                    print("other Core Location error")
                }
            } else {
                print("other error:", error.localizedDescription)
            }
        }
    }
    ```

    </amplify-block> </amplify-block-switcher>

1

ユーザーにデバイスの場所を取得する権限を求めるビューで `LocationManagement` のインスタンスを作成します。 例:

    <amplify-block-switcher>

    <amplify-block name="ViewController">

    ```swift
    class ViewController: UIViewController {
      let locationManagement = LocationManagement()
}
    ```

    </amplify-block> <amplify-block name="SwiftUI">

    ```swift
    struct ContentView: View {
      let locationManagement = LocationManagement()
}
    ```

    </amplify-block> </amplify-block-switcher>

1

アプリをビルド(⌘B)して実行します。UIは位置情報の許可を要求するモーダルを表示します。

1

**Allow while Using App**. デバッグログに `Received authorization of user location` が表示されることを確認してください。</ol>

位置情報を取得するためのアプリのセットアップに成功しました。 シミュレーションの場所ボタンをクリックすると、 位置情報の更新は、 `locationManager(_:didUpdateLocations)` delegate メソッドで、コア位置情報サービスからアプリに送信されます。

## デバイスの位置情報データを Amazon Location Service に送信します

以下の手順では、Amazon Location Serviceで作成したトラッカーリソースにデバイスの場所を渡す方法を説明します。

1. `LocationManagement.swift` ファイルに以下のインポートを追加します。

    ```swift
    import AWSLocation
    import AWSMobileClient
    ```

1. `AWSLocationTracker`のインスタンスを作成し、次の例のように `AWSLocationTrackerDelegate`に準拠を追加します。

    ```swift
    class LocationManagement: NSObject, 
                              ObservableObject, 
                              CLLocationManagerDelegate, 
                              AWSLocationTrackerDelegate {  // Add AWSLocationTrackerDelegate conformance
        let locationTracker = AWSLocationTracker(trackerName: "MyTracker",
                                                region: AWSRegionType.[UPDATE_ME],
                                                credentialsProvider: AWSMobileClient.default())
    }
    ```

1. By conforming to `AWSLocationTrackerDelegate`, the `requestUserLocation` method will be added. You can leave this empty for now, as in the following example:

    ```swift
    func requestLocation() {
    }
    ```

1. `AWSLocationTracker`を使用してデバイスの位置を追跡し始めます。 `locationManagerDidChangeAuthorization(_)` 許可された状況シナリオで次のコードを追加します。

    ```swift
    case .authorizedWhenInUse:
        print("Received authorization of user location, requesting for location")
        let result = locationTracker.startTracking(
            delegate: self,
            options: TrackerOptions(
                customDeviceId: "12345",
                retrieveLocationFrequency: TimeInterval(30),
                emitLocationFrequency: TimeInterval(120)))
        switch result {
        case .success:
            print("Tracking started successfully")
        case .failure(let trackingError):
            switch trackingError.errorType {
            case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                print("onFailedToStart \(trackingError)")
            case .serviceError(let serviceError):
                print("onFailedToStart serviceError: \(serviceError)")
            }
        }
    ```

    **Note:** Make sure to update the `customDeviceId` to an assigned deviceId or remove the parameter to have a random device ID assigned for this device. The assigned `deviceId` will be persisted across app restarts.

    **Note:** The example configures the tracking to retrieve location data every 30 seconds and send the location updates to Amazon Location Service every 120 seconds. The default values are 30 seconds for `retrieveLocationFrequency` and 300 seconds for `emitLocationFrequency`.

    **Note:** `startTracking` should be called after the user has authorized the app to retrieve device location data. Make sure to remove the call to `startUpdatingLocation()` as that will continuously retrieve a stream of location updates, rather than tracking the location at an interval.

1. `requestLocation` メソッドの本文を `locationManager.requestLocation()`を呼び出して更新します。次の例のようにします。

    ```swift
    class LocationManagement: NSObject, ObservableObject, CLLocationManagerDelegate, AWSLocationTrackerDelegate { 
      // ...
      func requestLocationLocation() {
        locationManager.requestLocation()
      }
      // ...
}
    ```

    **注意:** `requestLocation` は `retrievLocationFrequency` の間隔で呼び出されます。

1. アプリが位置情報の更新を取得する時 位置追跡のデータを渡してトラッカーを更新し、次の例のようにアプリのロジックを引き続き実行します。

      ```swift
      class LocationManagement: NSObject, ObservableObject, CLLocationManagerDelegate, AWSLocationTrackerDelegate  { 
        // ...
        func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
          print("Got locations: \(locations)")
          locationTracker.interceptLocationsRetrieved(locations)
        }
        // ...
      }
      ```

1. (オプション)トラッカーがデータをAmazon Location Serviceに送信し、トラッカーが停止したときに通知されるイベントをトラッキング待ちます。 次の例は、これを実装する方法を示しています。

    ```swift
    func onTrackingEvent(event: TrackingListener) {
        switch event {
        case .onDataPublished(let trackingPublishedEvent):
            print("onDataPublished: \(trackingPublishedEvent)")
        case .onDataPublicationError(let error):
            switch error.errorType {
            case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                print("onDataPublicationError \(error)")
            case .serviceError(let serviceError):
                print("onDataPublicationError serviceError: \(serviceError)")
            }
        case .onStop:
            print("tracker stopped")
        }
    }
    ```
    `onTrackingEvent` を `startTracking()` に渡します。
    ```swift
    let result = locationTracker.startTracking(
                    delegate: self,
                    options: TrackerOptions(
                        customDeviceId: "12345",
                        retrieLocationFrequency: TimeInterval(30),
                        emitLocationFrequency: TimeInterval(120)),
                    listener: onTracker: onTrackingEvent)
      ```

      **Note**: `onDataPublished` will be triggered for each successful call to Amazon Location Service. The `trackingPublishedEvent` payload contains the request containing locations sent and the successful response from the service.

      **メモ**: `onDataPublicationError` は、位置データを Amazon Location Service に送信しようとするたびにトリガーされ、エラーで失敗します。

      **メモ**: `onStop` はトラッカーが開始され、 `追跡が開始された` が呼び出されたときにトリガーされます。

1. (オプション)アプリケーションをデバッグするには、アプリの起動時に、開発中に詳細なログを有効にできます。

    ```swift
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
      // Override point for customization after application launch.
      AWSDDLog.sharedInstance.logLevel = .verbose
      AWSDDLog.add(AWSDDTTYLogger.sharedInstance)

      //...
      return true
    }
    ```

アプリで `AWSLocationTracker` の設定に成功しました。

### 追跡を停止

トラッカーが位置情報の保存と送信を続行しないようにしたい場合は、次の方法を呼び出します。

```swift
func stopTracking() {
    locationTracker.stopTracking()
}
```

### トラッキングステータス

トラッカーが現在トラッキングされているかどうかは、以下の方法で確認することもできます。

```swift
func isTracking() -> Bool {
    locationTracker.isTracking()
}
```

## コードサンプルを完了

参照として、これらのセクションと手順全体で作成した完全なコードサンプルを次に示します。


<amplify-block-switcher>

<amplify-block name="Deployment target iOS 14">

```swift
import CoreLocation
import AWSLocation
import AWSMobileClient

class LocationManagement: NSObject, CLLocationManagerDelegate, AWSLocationTrackerDelegate {
    func requestLocation() {
        locationManager.requestLocation()
    }

    let locationManager = CLLocationManager()
    let locationTracker = AWSLocationTracker(trackerName: "MyTracker",
                                             region: AWSRegionType.[UPDATE_ME],
                                             credentialsProvider: AWSMobileClient.default())

    override init() {
        super.init()
        requestUserLocation()
    }

    func requestUserLocation() {
        // Set delegate before requesting for authorization
        locationManager.delegate = self
        // You can request for `WhenInUse` or `Always` depending on your use case
        locationManager.requestWhenInUseAuthorization()
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .authorizedWhenInUse:
            print("Received authorization of user location, requesting for location")
            let result = locationTracker.startTracking(
                delegate: self,
                options: TrackerOptions(
                    customDeviceId: "12345",
                    retrieveLocationFrequency: TimeInterval(30),
                    emitLocationFrequency: TimeInterval(120)),
                listener: onTrackingEvent)
            switch result {
            case .success:
                print("Tracking started successfully")
            case .failure(let trackingError):
                switch trackingError.errorType {
                case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                    print("onFailedToStart \(trackingError)")
                case .serviceError(let serviceError):
                    print("onFailedToStart serviceError: \(serviceError)")
                }
            }
        default:
            print("Failed to authorize")
        }
    }
    func onTrackingEvent(event: TrackingListener) {
        switch event {
        case .onDataPublished(let trackingPublishedEvent):
            print("onDataPublished: \(trackingPublishedEvent)")
        case .onDataPublicationError(let error):
            switch error.errorType {
            case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                print("onDataPublicationError \(error)")
            case .serviceError(let serviceError):
                print("onDataPublicationError serviceError: \(serviceError)")
            }
        case .onStop:
            print("tracker stopped")
        }
    }
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("Got locations: \(locations)")
        locationTracker.interceptLocationsRetrieved(locations)
    }

    // Error handling is required as part of developing using CLLocation
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if let clErr = error as? CLError {
            switch clErr {
            case CLError.locationUnknown:
                print("location unknown")
            case CLError.denied:
                print("denied")
            default:
                print("other Core Location error")
            }
        } else {
            print("other error:", error.localizedDescription)
        }
    }
    func stopTracking() {
        locationTracker.stopTracking()
    }

    func isTracking() -> Bool {
        locationTracker.isTracking()
    }
}
```

</amplify-block> <amplify-block name="Deployment target iOS 13">

```swift
import CoreLocation
import AWSLocation
import AWSMobileClient

class LocationManagement: NSObject,
                          ObservableObject,
                          CLLocationManagerDelegate,
                          AWSLocationTrackerDelegate {
    func requestLocation() {
        locationManager.requestLocation()
    }

    let locationManager = CLLocationManager()
    let locationTracker = AWSLocationTracker(trackerName: "TrackerExample",
                                             region: AWSRegionType.USEast1,
                                             credentialsProvider: AWSMobileClient.default())
    override init() {
        super.init()
        requestUserLocation()
    }

    func requestUserLocation() {
        // Set delegate before requesting for authorization
        locationManager.delegate = self
        // You can request for `WhenInUse` or `Always` depending on your use case
        locationManager.requestWhenInUseAuthorization()
    }

    func onTrackingEvent(event: TrackingListener) {
        switch event {
        case .onDataPublished(let trackingPublishedEvent):
            print("onDataPublished: \(trackingPublishedEvent)")
        case .onDataPublicationError(let error):
            switch error.errorType {
            case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                print("onDataPublicationError \(error)")
            case .serviceError(let serviceError):
                print("onDataPublicationError serviceError: \(serviceError)")
            }
        case .onStop:
            print("tracker stopped")
        }
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse:
            print("Received authorization of user location, requesting for location")
            let result = locationTracker.startTracking(
                delegate: self,
                options: TrackerOptions(
                    customDeviceId: "12345",
                    retrieveLocationFrequency: TimeInterval(30),
                    emitLocationFrequency: TimeInterval(120)),
                listener: onTrackingEvent)
            switch result {
            case .success:
                print("Tracking started successfully")
            case .failure(let trackingError):
                switch trackingError.errorType {
                case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                    print("onFailedToStart \(trackingError)")
                case .serviceError(let serviceError):
                    print("onFailedToStart serviceError: \(serviceError)")
                }
            }
        default:
            print("Failed to authorize")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("Got locations: \(locations)")
        locationTracker.interceptLocationsRetrieved(locations)
    }

    // Error handling is required as part of developing using CLLocation
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if let clErr = error as? CLError {
            switch clErr {
            case CLError.locationUnknown:
                print("location unknown")
            case CLError.denied:
                print("denied")
            default:
                print("other Core Location error")
            }
        } else {
            print("other error:", error.localizedDescription)
        }
    }
    func stopTracking() {
        locationTracker.stopTracking()
    }

    func isTracking() -> Bool {
        locationTracker.isTracking()
    }
}
```

</amplify-block> </amplify-block-switcher>
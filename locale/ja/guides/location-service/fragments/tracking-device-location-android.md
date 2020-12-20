
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
1. **名前** フィールドに、 **LocationTracker** と入力します。
1. **ポリシーの作成** ボタンをクリックします。

Androidアプリに認証を追加しました。

## デバイスの位置情報データを Amazon Location Service に送信します

以下の手順では、デバイスの場所を取得し、Amazon Location Service で作成したトラッカーリソースに渡す方法を説明します。 [aws-samples/amazon-location-samples](https://github.com/aws-samples/amazon-location-samples/blob/main/tracking-android/) リポジトリに完全なサンプルアプリがあります。

1. Android Studio で、プロジェクト ビューアで **マニフェスト** を展開し、 **AndroidManifest.xml** を開きます。

1. Add the following permissions after the opening **manifest** tag. This grants your application access to location services and network connectivity. To learn more, refer to [Request location permissions](https://developer.android.com/training/location/permissions) in the Android Developers documentation.

    ```xml
    <manifest ...>
        ...

        <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <uses-permission android:name="android.permission.INTERNET" />
    </manifest>
    ```

1. まず、新しい `AWSLocationTracker` をアクティビティに追加します。

    <amplify-block-switcher> <amplify-block name="Java">

    ```java
    プライベート AWSLocationTrackerトラッカー;
    ```

    </amplify-block> <amplify-block name="Kotlin">

    ```kotlin
    private lateinit var tracker: AWSLocationTracker
    ```

    </amplify-block> </amplify-block-switcher>

1. アプリケーションユーザーに位置の許可を要求し、追跡を開始するクラスにヘルパーメソッドを追加します。

    <amplify-block-switcher> <amplify-block name="Java">

    ```java
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == 0 && grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            startTracking();
        }
    }

    void startTracking() {
            TrackingListener listener = new TrackingListener() {
            @Override
            public void onStop() {
                // Handle tracked stopped event.
            }

            @Override
            public void onDataPublished(TrackingPublishedEvent trackingPublishedEvent) {
                // Handle a successful publishing event for a batch of locations.
            }

            @Override
            public void onDataPublicationError(TrackingError trackingError) {
                // Handle an unsuccessful publishing event for a batch of locations.

            }
        };

        TrackingOptions options = TrackingOptions.builder()
                .customDeviceId("MyTracker")
                .retrieveLocationFrequency(1_000L) // Retrieve the current location every 30 seconds
                .emitLocationFrequency(5_000L)    // Emit a batch of locations to Amazon Location every 5 minutes
                .build();

        tracker.startTracking(this, options, listener);
    }
    ```

    </amplify-block> <amplify-block name="Kotlin">

    ```kotlin
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        if (requestCode == 0 && grantResults.size == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            startTracking()
        }
    }

    fun startTracking() {
        val listener: TrackingListener = object : TrackingListener {
            override fun onStop() {
                // Handle tracked stopped event.
            }

            override fun onDataPublished(trackingPublishedEvent: TrackingPublishedEvent) {
                // Handle a successful publishing event for a batch of locations.
            }

            override fun onDataPublicationError(trackingError: TrackingError) {
                // Handle an unsuccessful publishing event for a batch of locations.
            }
        }
        val options = TrackingOptions.builder()
                .customDeviceId("MyTracker")
                .retrieveLocationFrequency(1000L) // Retrieve the current location every 30 seconds
                .emitLocationFrequency(5000L) // Emit a batch of locations to Amazon Location every 5 minutes
                .build()

        tracker.startTracking(this, options, listener)
    }
    ```

    </amplify-block> </amplify-block-switcher>

1. `onCreate` メソッドで `AWSMobileClient` を初期化します。 このコードは Amazon Cognito から資格情報を取得し、アプリケーションに位置情報権限があるかどうかを確認し、必要に応じてリクエストし、トラッカーを開始します。

    <amplify-block-switcher>

    <amplify-block name="Java">

    ```java
    AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
        @Override
        public void onResult(UserStateDetails userStateDetails) {
            tracker = new AWSLocationTracker("MyTracker", AWSMobileClient.getInstance());

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    startTracking();
                } else {
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 0);
                }
            } else {
                startTracking();
            }
        }

        @Override
        public void onError(Exception error) {
            // Handle AWSMobileClient initialization error
        }
    });
    ```

    </amplify-block> <amplify-block name="Kotlin">

    ```kotlin
    AWSMobileClient.getInstance().initialize(applicationContext, object : Callback<UserStateDetails?>() {
        override fun onResult(userStateDetails: UserStateDetails?) {
            tracker = AWSLocationTracker("MyTracker", AWSMobileClient.getInstance())

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    startTracking()
                } else {
                    requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 0)
                }
            } else {
                startTracking()
            }
        }

        override fun onError(error: Exception?) {
            // Handle AWSMobileClient initialization error
        }
    })
    ```

    </amplify-block> </amplify-block-switcher>
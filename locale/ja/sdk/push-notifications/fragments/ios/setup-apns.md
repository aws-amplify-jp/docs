## プッシュ通知のAPNSを設定する

iOS アプリのプッシュ通知は、Apple Push Notification Service (APNs) を使用して送信されます。 iOS端末にプッシュ通知を送信する前に Apple Developer Portal でApp ID を作成する必要があり、必要な証明書を作成する必要があります。

このセクションでは、Apple Developer ポータルを使用して iOS および APN の資格情報を取得する方法について説明します。 これらの資格情報を使用すると、プッシュ通知を受信できる iOS プロジェクトを作成できます。

このセクションの手順を完了するために、既存のiOSアプリは必要ありません。 これらの手順を完了したら、 AWS Pinpointを使用してプッシュ通知を受信するアプリを設定する手順については、メインの [プッシュ通知](~/sdk/push-notifications/getting-started.md) APIガイドを参照してください。

このセクションの手順を完了すると、Apple Developer アカウントに次の項目が表示されます。

* アプリ ID
* SSL証明書。APNs経由でプッシュ通知をアプリに送信することを許可します。
* Apple Developer アカウントを使用して、iPhoneなどのテストデバイスの登録を行います。
* iOSディストリビューション証明書を使用すると、テストデバイスにアプリをインストールできます。
* プロビジョニングプロファイル。テストデバイスでアプリを実行できます。

始める前に、個人または組織の一部として Apple Developer Program のアカウントを持っている必要があります。 そのアカウントにはエージェントまたは管理者権限が必要です。

このチュートリアルの手順は、以下のバージョンの Mac OS ソフトウェアに基づいています。

* OS X El Capitan バージョン 10.11.6
* Xcode バージョン 8.1

**トピック**

* [ステップ 1: アプリIDを作成](#step-1-create-an-app-id)
* [ステップ 2: APNs SSL 証明書を作成する](#step-2-create-an-apns-ssl-certificate)
* [ステップ3：テストデバイスを登録する](#step-3-register-a-test-device)
* [ステップ4:iOSディストリビューション証明書を作成する](#step-4-create-an-ios-distribution-certificate)
* [ステップ 5: プロビジョニングプロファイルを作成](#step-5-create-a-provisioning-profile)


### ステップ 1: アプリIDを作成

App ID を作成して、Apple Developer ポータルでアプリケーションを識別します。 プッシュ通知を送信するための SSL 証明書を作成する場合、この ID が必要です。 たとえば、iOS ディストリビューション証明書を作成するときと、プロビジョニング・プロファイルを作成するときです。

すでにアプリにIDが割り当てられている場合は、この手順をスキップできます。 ワイルドカード文字("*")を含まない場合、既存のアプリ ID を使用できます。

**アプリにアプリIDを割り当てるには**

- [Apple Developer アカウント](https://developer.apple.com/membercenter/index.action.) にサインインする
- **証明書、識別子 & プロファイル** を選択します。
- **識別子** セクションで、 **アプリ ID** を選択します。
- **iOS アプリ ID** ペインで、 **追加** ボタン (+) を選択します。
- **アプリIDの登録** ペイン、 **名前**で アプリIDのカスタム名を入力すると、後で簡単に認識できます。
- App ID プレフィックスのデフォルト選択を選択します。
- **App ID Suffix**の場合、 **明示的なApp ID**を選択し、アプリにバンドルIDを入力します。 すでにアプリをお持ちの場合は、バンドルIDを使用してください。 この ID は、Mac の Xcode のアプリプロジェクトで確認できます。 それ以外の場合は、後で Xcode のアプリに割り当てるため、バンドル ID をメモします。
- **App Services** で **Push Notifications** を選択します。
- **Continue**を選択します。 **App ID を確認** ペインで、すべての値が正しく入力されていることを確認します。 識別子はアプリIDとバンドルIDと一致するはずです。
- 新しいアプリ ID を登録するには、 **登録** を選択します。

### ステップ 2: APNs SSL 証明書を作成する

APNs SSL 証明書を作成して、APNs を介してプッシュ通知をアプリに配信できます。 Apple Developer アカウントから証明書を作成し、ダウンロードします。 次に、証明書を Keychain Access にインストールし、 `.p12` ファイルとしてエクスポートします。

すでにアプリ用の SSL 証明書をお持ちの場合は、この手順をスキップできます。

**プッシュ通知用の SSL 証明書を作成する**

- **証明書、識別子 & プロファイル** を選択します。
- **識別子** セクションで、 **アプリ ID** を選択します。
- iOSアプリIDの一覧から、 [ステップ1:アプリIDを作成](#step-1-create-an-app-id)で作成したアプリIDを選択します。
- **編集** を選択します。
- **Push Notifications**の下で、 **Production SSL Certificate** セクションで **Create Certificate...** を選択します。
- In the **About Creating a Certificate Signing Request (CSR)** pane, follow the instructions for creating a Certificate Signing Request (CSR) file. You use the Keychain Access application on your Mac to create the request and save it on your local disk. When you are done, choose **Continue**.
- In the **Generate your certificate** pane, choose Choose **File...**, and then select the CSR file you created and Choose Continue. -When the certificate is ready, choose **Download** to save the certificate to your computer.
- ダウンロードした証明書をダブルクリックして、MacのKeychainにインストールします。
- Mac で、キーチェーンアクセスアプリケーションを起動します。
- In **My Certificates**, find the certificate you just added. The certificate is named "Apple Push Services:`com.my.app.id`", where `com.my.app.id` is the app ID for which the certificate was created.
- コンテキストを選択し、プッシュ証明書を含むファイルをエクスポートするには、コンテキストメニューから **エクスポート...** を選択します。
- 認識しやすい証明書の名前を入力し、コンピュータに保存します。 プロンプトが表示されたら、エクスポートパスワードを提供しないでください。AWS Mobile Hubでアプリを作成する際に、この証明書をアップロードする必要があります。

[トップに戻る](#setting-up-ios-push-notifications)

### ステップ3：テストデバイスを登録する

そのデバイスでアプリをテストできるように、Apple Developer アカウントにテストデバイスを登録します。 後で、このテストデバイスをプロビジョニングプロファイルに関連付けます。これにより、アプリがデバイスで起動できるようになります。

すでに登録済みのデバイスをお持ちの場合は、この手順をスキップできます。

**デバイスを追加するには**

- **証明書、識別子 & プロファイル** を選択します。
- **デバイス** セクションで、追加するデバイスの種類、 **iPhone** などを選択します。
- **追加** ボタン (+) を選択します。
- **Register Device** ( **Name**の)セクションで、後で簡単に認識できる名前を入力します。
- **UDID**の場合は、一意のデバイス ID を入力します。iPhone の場合は、次の手順でUDID を見つけることができます。

    - iPhoneをMacにUSBケーブルで接続します。
    - iTunesアプリを開きます。
    - iTunesウィンドウの左上隅に、iPhoneアイコンのあるボタンが表示されます。 このボタンを選択します。iTunesはiPhoneのサマリページを表示します。
    - In the top box, the summary page provides your iPhone's **Capacity**, **Phone Number**, and **Serial Number**. Click **Serial Number**, and the value changes to **UDID**.
    - UDIDをコンテキスト選択し、 **コピー** を選択します。
    - Apple Developer Web サイトの **UDID** フィールドに UDID を貼り付けます。
    - **** を選択します。

- **レビューと** ペインで、デバイスの詳細を確認し、 **登録**を選択します。 デバイス名と識別子がデバイスのリストに追加されます。

[トップに戻る](#setting-up-ios-push-notifications)

### ステップ4:iOSディストリビューション証明書を作成する

iOS ディストリビューション証明書を使用すると、テストデバイスにアプリをインストールし、そのデバイスにプッシュ通知を配信できます。 アプリ用のプロビジョニング・プロファイルを作成する際に、iOS 配布証明書を後で指定します。

すでにiOSディストリビューション証明書をお持ちの場合は、この手順をスキップできます。

**iOSディストリビューション証明書を作成する**

- Apple Developer アカウントの **証明書、識別子 & プロファイル** ページで、 **証明書** セクションで、 **プロダクション** を選択します。
- **iOS Certificates (Production)** ペインで、 **Add** ボタン (+) を選択します。 **Add iOS Certificate** ペインが開きます。
- **Production** セクションで、 **App Store と Ad Hoc**を選択し、 **Continue** を選択します。
- **証明書署名リクエスト (CSR)** ページで、 **** を選択します。
- In the **About Creating a Certificate Signing Request (CSR)** pane, follow the instructions for creating a Certificate Signing Request (CSR) file. You use the Keychain Access application on your Mac to create the request and save it on your local disk. When you are done, choose **Continue**.
- **証明書を生成する** ペインで、 **ファイルを選択...**を選択し、作成した CSR ファイルを選択します。
- **** を選択します。
- 証明書の準備ができたら、 **ダウンロード** を選択して証明書をコンピュータに保存します。
- ダウンロードした証明書をダブルクリックして、MacのKeychainにインストールします。

[トップに戻る](#setting-up-ios-push-notifications)

### ステップ 5: プロビジョニングプロファイルを作成

プロビジョニングプロファイルを使用すると、アプリがテストデバイスで実行されます。 Apple Developer アカウントからプロビジョニング・プロファイルを作成してダウンロードし、Xcode にプロビジョニング・プロファイルをインストールします。

**プロビジョニングプロファイルを作成するには**

- **証明書、識別子 & プロファイル** を選択します。
- format@@0セクションで、format@@1を選択します。
- In the **iOS Provisioning Profiles (Distribution)** pane, choose the **Add** button (+). The **Add iOS Provisioning Profiles (Distribution)** pane is shown.
- **Distribution** セクションで、 **Ad Hoc**を選択し、 **Continue** を選択します。
- **App ID**の場合は、アプリ用に作成したアプリ ID を選択し、 **Continue** を選択します。
- iOS 開発証明書を選択し、 **Continue** を選択します。
- **デバイス**を選択するには、テスト用に登録したデバイスを選択し、 **Continue** を選択します。
- `ApnsDistributionProfile`など、このプロビジョニングプロファイルの名前を入力し、 **Continue** を選択します。
- 生成されたプロビジョニング・プロファイルをダウンロードするには、 **ダウンロード** を選択します。
- ダウンロードしたファイルをダブルクリックしてプロビジョニング・プロファイルをインストールします。Xcode アプリが応答で開きます。
- プロビジョニング・プロファイルがインストールされていることを確認するには、以下の手順で Xcode のインストール済みプロビジョニング・プロファイルのリストを確認してください。

    - Xcode のメニューバーで、 **Xcode** を選択し、 **環境設定** を選択します。
    - 設定ウィンドウで、 **アカウント** を選択します。
    - **アカウント** タブで Apple ID を選択し、 **詳細** を選択します。
    - プロビジョニングプロファイルが **Provisioning Profiles** セクションにリストされていることを確認します。

[トップに戻る](#setting-up-ios-push-notifications)

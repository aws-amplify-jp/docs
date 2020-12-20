<amplify-callout> 現在、AWSMobileClient のフェデレーション機能は、Cognito Identity Pools のみをサポートしています。 </amplify-callout>

## 連合サインイン

```swift
AWSMobileClient.default().federatedSignIn(providerName: IdentityProvider.facebook.rawValue, token: "FACEBOOK_TOKEN_HERE") { (userState, error) in
    if let error {
        print("Federated Sign In failed: \(error.localizedDescription")
    }
}
```

`federatedSignIn()` can be used to obtain federated "Identity ID" using external providers like Google, Facebook or Twitter. If the tokens are expired and new tokens are needed, a notification will be dispatched on the `AWSMobileClient` listener with the user state `signedOutFederationTokensInvalid`. You can give the updated tokens via the same `federatedSignIn()` method.

The API calls to get AWS credentials will be asynchronously blocked until you fetch the social provider's token and give it to `AWSMobileClient`. Once you pass the tokens, the `AWSMobileClient` will fetch AWS Credentials using the new tokens and unblock all waiting calls. It will then use the new credentials.

### Cognitoアイデンティティを持つSAML

アプリで呼び出されるAWSサービスのユーザーサインインプロバイダとしてSAMLサインインプロバイダを連携させるには トークンを `AWSMobileClientに渡します。 efault() ederatedSignIn() <code> .`. 次の [手順](https://docs.aws.amazon.com/cognito/latest/developerguide/saml-identity-provider.html) を使用して、まずAWS IAMでSAMLアプリケーションを登録する必要があります。

ログインから SAML トークンを取得したら、 `AWSMobileClient` の `federatedSignIn` API を呼び出すことができます。

```swift
// Perform SAML token federation
AWSMobileClient.default().federatedSignIn(providerName: "YOUR_SAML_PROVIDER_NAME",
                                          token: "YOUR_SAML_TOKEN") { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}

```

**Note:** If the SAML token contains more than one Role ARN, you will need to specify which role will be assumed when federating. If the SAML token has more than one Role ARN and a `customRoleARN` is not specified, it will result in an error.

```swift
// Choose one of the roles available in the token
val options = FederatedSignInOptions(customRoleARN: "choose-one")

// Perform SAML token federation
AWSMobileClient.default().federatedSignIn(providerName: "YOUR_SAML_PROVIDER_NAME",
                                          token: "YOUR_SAML_TOKEN"
                                          federatedSignInOptions: options) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}
```

### Facebook を設定

To federate Facebook as a user sign-in provider for AWS services called in your app, you will pass tokens to `AWSMobileClient.default().federatedSignIn()`. You must first register your application with Facebook by using the [Facebook Developers portal](https://developers.facebook.com/) and configure this with Amazon Cognito Identity Pools.

AWS Amplifyはこの設定に役立ちますが、まずはアプリのIDプロバイダーとしてFacebookを設定する方法を説明します。

If you already have a Facebook app ID, you can copy and paste it into the `Facebook App ID` field when configuring authentication using the AWS Amplify CLI.

**FacebookアプリIDを取得するには**

Facebookの [アプリ開発ガイド](https://developers.facebook.com/docs/apps) に従ってFacebookにアプリを設定してください。 [Facebook開発者ポータル](https://developers.facebook.com/)にサインインしてください。

 - **新しいアプリを追加** を選択するか、 **My Apps** から以前に作成したアプリを選択します。
    - 尋ねられた場合は、Facebookログインを使用するアプリのプラットフォームを選択し、 **基本設定**を選択します。
 - Type a display name for your app, select a category for your app from the **Category** drop-down list, then choose **Create App ID**; take note of the **App ID**.
 - Facebook Developer ポータルの左側のナビゲーションリストで、 **Settings**を選択し、 **+ Add Platform** を選択します。
 - **iOS** を選択し、アプリのバンドル ID を追加します(例: com.amazon.YourProjectName)
 - **変更を保存** を選択してください

Facebookポータルに割り当てられたロールを持つユーザーのみが、開発中(まだ公開されていない)にアプリを通じて認証することができます。 ユーザーを承認するには、Facebook Developer ポータルの左側のナビゲーション リストにあります。 **ロール**を選択し、 **テスターを追加する** を選択し、有効な Facebook ID を提供します。

> Facebookログインとの統合の詳細については、 [Facebookログイン入門ガイド](https://developers.facebook.com/docs/facebook-login) を参照してください。

**Amplify CLI 設定 - Facebook**

ターミナルウィンドウで、アプリファイルのルートに移動し、認証カテゴリをアプリに追加します。 CLIは設定パラメータを求めます。 **を選択してください。** とプロンプトが表示されたら **AWS IAM コントロール** をセットアップします。

```bash
cd ./YOUR_PROJECT_FOLDER
増幅する ##"amplify update auth" がすでに設定されている場合、認証を追加
```

```console
<unk> Manual Configuration.
<unk> AWS IAMコントロールに接続されたユーザサインアップ、サインイン。
```

Choose **YES** to `? Allow unauthenticated logins?` and **YES** to `? Do you want to enable 3rd party authentication providers in your identity pool?`.

**Facebook** を選択し、先ほど保存したFacebook **App ID** を提供します。

Facebook のサインインの設定が完了すると、CLI はこのカテゴリのローカル CLI メタデータを設定したことを確認するメッセージを表示します。 クラウドの変更を更新するには、以下を実行してください。

```bash
push を増幅する
```

モバイルアプリ [で Facebook を設定できるようになりました](#facebook-login-in-your-mobile-app)。

CLI では、アプリケーションの ID プロバイダーを複数選択できます。 既存の認証設定にアイデンティティプロバイダを追加するために、 `増幅認証アップデート` を実行することもできます。

### Google を設定

アプリで呼び出されたAWSサービスのユーザーサインインプロバイダーとしてGoogleを連携させるには、トークンを `AWSMobileClient.default().federatedSignIn()`に渡します。 アプリケーションを Google Developers Console で登録し、次にAmazon Cognito Identity Poolsで設定する必要があります。

iOSアプリにGoogleサインインを実装するには、次の2つのことが必要です。

1. OAuthウェブクライアントID
2. iOS クライアントID

これらのクライアントIDは、Google Developersプロジェクトの一部です。 Web クライアント ID は、Cognito と Google の間の OAuth フローをサーバー側で管理するために Cognito ID プールで使用されます。 iOSクライアントIDはiOSアプリでGoogleと直接OAuthフローを承認するために使用されます ユーザーが Google アカウントを使用して認証することを許可します。

> **注意:** Google サインイン用の OAuth クライアントを作成するための作成と設定手順は、常に変更されています。 常にGoogleからの公式設定手順を参照してください。

最初に Google Developer Portal [](https://developers.google.com/identity/sign-in/ios/start-integrating) の **"連携を開始" セクションに移動し、** をクリックして OAuth クライアント ID を取得します。

When prompted choose **iOS** as the calling platform along with your Package name and certificate. Once created the **iOS Client ID** will be created; take note of this value.

Next, obtain your **OAuth Web Client ID** by navigating to the [Credentials section of the Google Developer console](https://console.developers.google.com/apis/credentials). Select your project (you may need to click **All**) and under **OAuth 2.0 client IDs** copy the **Client ID** associated with the Web application type; take note of this value.

**Amplify CLI 設定 - Google**

ターミナルウィンドウで、アプリファイルのルートに移動し、auth を追加します。CLIは設定パラメータを求めます。 **を選択してください。** とプロンプトが表示されたら **AWS IAM コントロール** をセットアップします。

```bash
cd ./YOUR_PROJECT_FOLDER
amplify add auth # or `amplify update auth`
```

```console
<unk> 手動設定  
<unk> AWS IAM コントロールで接続されたユーザサインアップ、サインイン。
```

Choose **YES** to `? Allow unauthenticated logins?` and **YES** to `? Do you want to enable 3rd party authentication providers in your identity pool?`.

**Google** を選択し、上記の **Web Client ID** と **iOS Client ID** を入力します。 完了したら、以下を実行してバックエンドを更新します。

```bash
push を増幅する
```

モバイルアプリで [Googleを設定](#google-login-in-your-mobile-app)できるようになりました。

> CLI では、アプリケーションの ID プロバイダーを複数選択できます。 既存の認証設定にアイデンティティプロバイダを追加するために、 `増幅更新認証` を実行することもできます。

### Appleでサインインを設定する

To federate Sign in with Apple as a user sign-in provider for AWS services called in your app, you will pass tokens to `AWSMobileClient.default().federatedSignIn()`. You must set up your application to use Sign in with Apple, and then configure Amazon Cognito Identity Pools to use Apple as an authentication provider. There are three main steps to setting up Sign in with Apple: implementing Sign in with Apple in your app, configuring Sign in with Apple as an authentication provider in your Amazon Cognito Identity Pool, and passing the Sign in with Apple token to AWSMobileClient via `federatedSignIn`.

1. **アプリで Apple でサインインを実装する**

    iOS デバイスでは、Apple でサインインするには、ネイティブコントロールとシステム提供の API を使用して実装できます。 設定の詳細については、 [Appleのドキュメントとサンプルアプリ](https://developer.apple.com/documentation/authenticationservices/implementing_user_authentication_with_sign_in_with_apple) を参照してください。

2. **Amazon Cognito Identity Pool で認証プロバイダとして Apple でサインインを設定する**

    Once you have configured your application to use Sign in with Apple, paste your app's **Bundle Identifier** into the **Apple Services ID** field of your [Amazon Cognito Identity Pool](https://console.aws.amazon.com/cognito/home). The Bundle Identifier can be found in the [**Certificates, IDs & Profiles** section](https://developer.apple.com/account/resources/identifiers/list) of your Apple Developer Account.

    > **注意:** ウェブサイトで使用するためにAppleでサインインを設定している場合。 またはCognito HostedUIを使用している場合は、Apple Services IDを設定してください。 しかし、これは Amazon Cognito Identity Pool の認証プロバイダとして Apple でサインインを設定するのに適切な値ではありません。

3. **`federatedSignIn` 経由で Apple トークンでサインインする**

    Once you have configured Sign in with Apple as an authentication provider for your Amazon Cognito Identity Pool, and your app implements authentication with Sign in with Apple, you can use the authentication tokens provided by Sign in with Apple to obtain credentials to authorize calls to AWS services in your app. When your app's [`authorizationController(controller:didCompleteWithAuthorization:)`](https://developer.apple.com/documentation/authenticationservices/asauthorizationcontrollerdelegate/3153050-authorizationcontroller) delegate method receives an `ASAuthorizationCredential` of type `ASAuthorizationAppleIDCredential`, you can use the credential's `identityToken` to federate into your Amazon Cognito Identity Pool, as in the following sample code:

    ```swift
    func authorizationController(controller: ASAuthorizationController,
                                 didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential,
            let identityTokenData = appleIDCredential.identityToken else {
                print("No token available")
                return
        }

        guard let identityToken = String(data: identityTokenData, encoding: .utf8) else {
            print("Can't convert identity token data to string")
            return
        }

        AWSMobileClient.default().federatedSignIn(providerName: IdentityProvider.apple.rawValue,
                                                  token: identityToken) { userState, error in
            if let error = error {
                print("Error in federatedSignIn: \(error)")
                return
            }

            guard let userState = userState else {
                print("userState unexpectedly nil")
                return
            }

            print("federatedSignIn successful: \(userState)")
        }
    }
    ```

    `federatedSignIn` メソッドが正常に完了すると、 `AWSMobileClient` は自動的に連合IDを使用して AWS サービスコールを行うための資格情報を取得します。

### Cognitoアイデンティティを持つ開発者認証ID

Amazon Cognitoを使用してAWSリソースにアクセスしながら、ご自身の既存の認証サービスでユーザー登録と認証ができます。 開発者の認証済みIDを使用するには、エンドユーザーデバイスと認証のためのバックエンドとAmazon Cognitoとの間の相互作用が必要です。

まずは、Cognito Identity をコンソールに登録してください。

![画像](~/images/dev-auth-ids-console-settings.png)

ユーザーが認証されると、アプリは Cognito ID とサーバーからのサインインを確認するトークンを受け取ります。 その後、アプリはAWSの資格情報を受け取るためにCognito Identityのサインインを連携させます。

```swift
AWSMobileClient.default().federatedSignIn(providerName: IdentityProvider.developer.rawValue,
                                          token: "YOUR_TOKEN",
                                          federatedSignInOptions: FederatedSignInOptions(cognitoIdentityId: identityId!)) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}
```

## モバイルアプリでのFacebookログイン

1. プロジェクトの `Podfile` に次の依存関係を追加します。

    ```ruby
    platform :ios, '9.0'
      target 'YOUR-APP-NAME' do
        use_frameworks!

        pod 'AWSFacebookSignIn'     # Add this new dependency
        pod 'AWSAuthUI'             # Add this dependency if you have not already added

        # Other Pod entries
        pod 'AWSMobileClient'
        pod 'AWSUserPoolsSignIn'

      end
    ```

`pod install --repo-update` を実行します。

> **注意:** `AWSFacebooksignin` はアプリで Facebook を使用する場合にのみ必要で、  `AWSAuthUI` は「ドロップイン UI 」を使用する場合にのみ必要です。

1. `Info.plist`にFacebookメタデータを追加。

    Xcode プロジェクトで Facebook ログインを使用するように設定するには、 `Info.plist` を選択し、 `Open As > Source Code` を選択します。

    プロジェクト名、Facebook ID、ログインスキームIDを使用して、次のエントリを追加します。

```xml
  <plist version="1.0">

  <dict>
  <!-- YOUR OTHER PLIST ENTRIES HERE -->

  <!-- START OF FACEBOOK PLIST ENTRIES HERE -->
  <!-- 0123456789012345 BELOW IS EQUIVALENT TO YOUR APP ID -->
  <key>FacebookAppID</key>
  <string>0123456789012345</string>
  <key>FacebookDisplayName</key>
  <string>YOUR-PROJECT-NAME</string>
  <key>LSApplicationQueriesSchemes</key>
  <array>
      <string>fbapi</string>
      <string>fb-messenger-api</string>
      <string>fbauth2</string>
      <string>fbshareextension</string>
  </array>
  <!-- END OF FACEBOOK PLIST ENTRIES HERE -->

  <!-- ADD AN ENTRY TO CFBundleURLTypes for Facebook -->
  <!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
  <key>CFBundleURLTypes</key>
  <array>
      <dict>
          <key>CFBundleURLSchemes</key>
          <array>
              <string>fb0123456789012345</string>
          </array>
      </dict>
  </array>

  <!-- ... -->
  </dict>
```

ドロップインの UI には、 `federatedSignIn()` フローを使用する Facebook のサインインボタンが表示されます。

## モバイルアプリでGoogleログイン

Podfileに次の依存関係を追加します。

    ```ruby
    platform :ios, '9.0'
    target :'YOUR-APP-NAME' do
      use_frameworks!
      pod 'AWSGoogleSignIn'                 # Add this new dependency
      pod 'GoogleSignIn', '~> 4.0'          # Add this new dependency
      pod 'AWSAuthUI'                       # Add this dependency if you have not already added

      # Other Pod entries
      pod 'AWSMobileClient'
      pod 'AWSUserPoolsSignIn'

    end
    ```

`pod install --repo-update` を実行します。

> **注意:** `AWSGoogleSign In` は、アプリで Google Login を使用する場合にのみ必要です。 `AWSAuthUI` は、「Drop-In UI」を使用する場合にのみ必要です。

Google メタデータを `Info.plist` に追加する。

Xcode プロジェクトで Google ログインを使用するように設定するには、 `Infoを開きます。 list <code> using` file with **右クリック > Open As > Source Code** そして次のエントリを追加します。 プレースホルダー文字列のプロジェクト名を置き換えます。

    ```xml

    <plist version="1.0">
	<!-- YOUR OTHER PLIST ENTRIES HERE -->

	<!-- ADD AN ENTRY TO CFBundleURLTypes for Google -->
	<!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
	<key>CFBundleURLTypes</key>
    <array>
        <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</string>
        </array>
        </dict>
    </array>

	<!-- ... -->
	```

ドロップインUIには、 `federatedSignIn()` フローを使用する Google サインインボタンが表示されます。

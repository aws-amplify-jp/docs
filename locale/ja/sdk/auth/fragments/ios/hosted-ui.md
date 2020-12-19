## Amazon Cognito Hosted UIの使用

Amazon Cognitoユーザープールは、ウェブ「Hosted UI」を介してカスタマイズ可能なユーザーエクスペリエンスを提供します。Hosted UIはOAuth 2を提供します。 フローを使用すると、(Cognitoまたはソーシャルプロバイダ用のSDKを埋め込むことなく)Webビューをアプリケーション経由で起動できます。 Hosted UIにより、エンドユーザーはFacebook経由で直接ログインしてユーザープールに登録することができます。 AmazonとGoogleだけでなく、OpenID Connect(OIDC)とSAML IDプロバイダを介して。 Amplify CLI は、アプリに認証を追加する際にホストされた UI を設定します。 [詳細はこちら](~/cli/auth/overview.md)

### CLIによる自動セットアップ

CLI で認証を設定する場合は、ID プロバイダー (Google、Facebook または Amazonでログイン) を選択するか、Cognito のユーザープールを直接使用できます。 ソーシャルプロバイダを設定する場合、Cognitoユーザープールによって生成されたドメイン名が必要になります。 ソーシャルプロバイダのウェブサイトから取得された資格情報と同様に。

プロジェクトの root フォルダーで次のコマンドを実行します。

```bash
増幅して認証を追加
```

ソーシャルプロバイダ(Federation)でデフォルト設定を選択します。

```console
デフォルトの認証とセキュリティ設定を使用しますか？ 
  デフォルト設定 
<unk> ソーシャルプロバイダ(Federation)によるデフォルト設定 
  手動設定 
  詳細を知りたい。
```

ソーシャルプロバイダの設定から資格情報を求められます：

<amplify-block-switcher> <amplify-block name="Facebook Login">

Set up your app in Facebook by following Facebook's [App Development](https://developers.facebook.com/docs/apps) guide. Facebook will provide you an **App ID** and **App Secret** for your application which you will find in the app's **Basic Settings**; Take note of these.

アプリを設定する際には、以下の設定を使用してください(次のセクションでドメインが生成されます):

- シナリオを設定するときは、 **Facebookログイン**を選択してください
- Cognito User Pools ドメインを */oauth2/idpponse* で追加する :
    - `https://<your-user-pool-domain>/oauth2/idpponse` to:
        - **Facebook ログイン > 設定 > 有効な OAuth リダイレクト URI**
        - **プラットフォーム > ウェブサイト > サイト URL**

</amplify-block> <amplify-block name="Google Sign-In">

Set up and create a *Web application* in Google by following Google's [Setting up OAuth 2.0](https://support.google.com/googleapi/answer/6158849) doc. Google will provide you a a **Client ID** and **Client Secret** for your application; take note of these.

- **OAuth 同意画面**で、 `amazoncognito.com を追加します`
- **Web アプリケーション** を設定する場合、以下を追加します。
    - **Name Field**: アプリケーションの名前
    - **認証済みJavaScriptの起源**: `amazoncognito.com`
    - **認証されたリダイレクト URI**: `https://<your-user-pool-domain>/oauth2/idpponse`

</amplify-block> <amplify-block name="Login with Amazon">

- [Amazon](http://login.amazon.com/)でログインし、Amazon.com 資格情報を使用して **アプリコンソール** を選択します。
- **セキュリティプロファイルの作成** を選択するか、作成した既存のプロファイルを選択します。
    - **セキュリティプロファイル名**: アプリケーション名
    - **セキュリティ プロファイル 説明**: アプリケーションの説明
    - **同意プライバシー通知URL**: プライバシー通知のURL
- **Client ID と Client Secret の表示** をクリックし、これらの値をメモします。

</amplify-block> <amplify-block name="Sign in with Apple">

> [Apple App Store Developer Guidelines](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple) では、 ***独占的*** がサードパーティのサインインオプションを使用するアプリケーションで利用できるようにする必要があります。 例えばFacebookやGoogleなどです Cognitoユーザープールのみを使用している場合、または追加で使用している場合(電子メール/パスワードを使用して署名する場合)、Appleにサインインを含める必要はありません。

Apple でサインインのサポートを追加する前に、Apple Developer アカウントが必要になります。

Learn more about [How to set up Sign in with Apple for Amazon Cognito](https://aws.amazon.com/blogs/security/how-to-set-up-sign-in-with-apple-for-amazon-cognito/). You can then use `AWSMobileClient` to launch the Hosted UI directly to sign in with Apple by specifying `HostedUIOptions(identityProvider: "SignInWithApple")`

</amplify-block> </amplify-block-switcher>

フローを実行した後、次のコマンドを実行して、構成されたリソースをクラウドにデプロイします。

```bash
push を増幅する
```
ホストされているUI用のCLIがターミナルで出力としてプロビジョニングしたドメイン名を見つけることができます。 また、 `増幅ステータス` コマンドを使用して、いつでもその情報を見つけることができます。

> Your Cognito User Pool domain is structured like so: `<unique_domain_prefix>-<env-name>.auth.<region>.amazoncognito.com`. Use this domain in the above steps when setting up your social provider.

### 手動セットアップ

To configure your application for hosted UI, you need to use *HostedUI* options. Update your `awsconfiguration.json` file to add a new configuration for `Auth`. The configuration should look like this:

    ```json
    {
        "IdentityManager": {
            ...
        },
        "CredentialsProvider": {
            ...
        },
        "CognitoUserPool": {
            ...
        },
        "Auth": {
            "Default": {
                "OAuth": {
                    "WebDomain": "YOUR_AUTH_DOMAIN.auth.us-west-2.amazoncognito.com", // Do not include the https:// prefix
                    "AppClientId": "YOUR_APP_CLIENT_ID",
                    "SignInRedirectURI": "myapp://",
                    "SignOutRedirectURI": "myapp://",
                    "Scopes": ["openid", "email"]
                }
            }
        }
    }
    ```

> 注:成功したサインインから取得されたユーザープール OIDC JWTトークンが構成されて、Cognito Identity Poolに連携されます。 一時的なAWS認証情報(アクセスキーIDとシークレットキー)を取得するために、SDKは自動的にCognitoと情報を交換します。

### Cognito Hosted UI を iOS アプリで設定

1. アプリの URL スキームに `myapp://` を追加します。

    Info.plist を右クリックし、Open As > Source Code を選択します。

    URL スキームに次のエントリを追加します。

    ```xml
        <plist version="1.0">

        <dict>
        <!-- YOUR OTHER PLIST ENTRIES HERE -->

        <!-- ADD AN ENTRY TO CFBundleURLTypes for Cognito Auth -->
        <!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
        <key>CFBundleURLTypes</key>
        <array>
            <dict>
                <key>CFBundleURLSchemes</key>
                <array>
                    <string>myapp</string>
                </array>
            </dict>
        </array>

        <!-- ... -->
        </dict>
    ```

### Hosted UIの起動

Hosted UI をアプリケーションから起動するには、 `AWSMobileClient.default()` の `showSignIn` API を使用します。

```swift
// Optionally override the scopes based on the usecase.
let hostedUIOptions = HostedUIOptions(scopes: ["openid", "email"])

// Present the Hosted UI sign in.
AWSMobileClient.default().showSignIn(navigationController: self.navigationController!, hostedUIOptions: hostedUIOptions) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}
```

> Optional: If your app deployment target is < iOS 11, add the following callback in your App Delegate's `application:open url` method. This callback is required, because `SFSafariViewController` is used in < iOS 11 to integrate with the Hosted UI.

```swift
func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    AWSMobileClient.default().handleAuthResponse(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
    return true
}
```

**Note:** By default, the Hosted UI will show all login options; the username-password flow as well as any social providers which are configured. If you wish to bypass the extra sign-in screen showing all the provider options and launch your desired social provider login directly, you can set the `HostedUIOptions` as shown in the next section.

## Facebook、Google、または SAML を直接起動する

Cognito Hosted UI画面をバイパスし、第三者の認証ページから直接アクセスすることができます。 これにより、CognitoのHosted UIを表示しない状態で、Cognitoユーザープールに設定されたソーシャルプロバイダでログインできます(e. をクリックします。 *Facebook* でログインボタンを表示します。

```swift
// Option to launch Google sign in directly
let hostedUIOptions = HostedUIOptions(scopes: ["openid", "email"], identityProvider: "Google")
//  OR
// Option to launch Facebook sign in directly
let hostedUIOptions = HostedUIOptions(scopes: ["openid", "email"], identityProvider: "Facebook")
//  OR
// Option to launch Apple sign in directly
let hostedUIOptions = HostedUIOptions(identityProvider: "SignInWithApple")

// Present the Hosted UI sign in.
AWSMobileClient.default().showSignIn(navigationController: self.navigationController!, hostedUIOptions: hostedUIOptions) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}
```

### Hosted UI経由でサインアウトする

```swift
// Setting invalidateTokens: true will make sure the tokens are invalided
AWSMobileClient.default().signOut(options: SignOut(invalidateTokens: true)) { (error) in
    print("Error: \(error.debugDescription)")
}
```

トークンを削除するだけでローカルにサインアウトしたい場合は、 `signOut` メソッドを呼び出すことができます。

```swift
AWSMobileClient.default().signOut()
```

## Auth0で認証を設定

You can use `AWSMobileClient` to use `Auth0` as an `OAuth 2.0` provider. You use `Auth0` as an identity provider for a Cognito Federated Identity Pool. This will allow users authenticated via Auth0 to have access to your AWS resources. Learn [how to integrate Auth0 with Cognito Federated Identity Pools](https://auth0.com/docs/integrations/integrating-auth0-amazon-cognito-mobile-apps)

### iOSアプリの設定

1. To configure your application for hosted UI, you need to use *HostedUI* options. Update your `awsconfiguration.json` file to add a new configuration for `Auth`. The configuration should look like this:

    ```json
    {
        "IdentityManager": {
            ...
        },
        "CredentialsProvider": {
            ...
        },
        "CognitoUserPool": {
            ...
        },
        "Auth": {
            "Default": {
                "OAuth": {
                    "AppClientId": "YOUR_AUTH0_APP_CLIENT_ID",
                    "WebDomain": "YOUR_AUTH0_DOMAIN.auth0.com", // Do not include the https:// prefix
                    "TokenURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/oauth/token",
                    "SignInURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/authorize",
                    "SignInRedirectURI": "com.your.bundle.configured.in.auth0://YOUR_AUTH0_DOMAIN.auth0.com/ios/com.your.bundle/callback",
                    "SignOutURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/v2/logout",
                    "SignOutURIQueryParameters": {
                        "client_id" : "YOUR_AUTH0_APP_CLIENT_ID",
                        "returnTo" : "com.your.bundle.configured.in.auth0://yourserver.auth0.com/ios/com.amazonaws.AWSAuthSDKTestApp/callback"
                    },
                    "Scopes": ["openid", "email"]
                }
            }
        }
    }
    ```

1. サインインとサインアウトリダイレクトURIをアプリのURLスキームに追加します:

    Info.plist を右クリックし、Open As > Source Code を選択します。

    URL スキームに次のエントリを追加します。

    ```xml
        <plist version="1.0">

        <dict>
        <!-- YOUR OTHER PLIST ENTRIES HERE -->

        <!-- ADD AN ENTRY TO CFBundleURLTypes for Auth0 -->
        <!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
        <key>CFBundleURLTypes</key>
        <array>
            <dict>
                <key>CFBundleURLSchemes</key>
                <array>
                    <string>com.your.bundle.configured.in.auth0://yourserver.auth0.com/ios/com.amazonaws.AWSAuthSDKTestApp/callback</string>
                </array>
            </dict>
        </array>

        <!-- ... -->
        </dict>
    ```

### Auth0のホストされたUIを起動します

Hosted UI をアプリケーションから起動するには、 `AWSMobileClient.default()` の `showSignIn` API を使用します。

```swift
// Specify the scopes and federation provider name.
 let hostedUIOptions = HostedUIOptions(scopes: ["openid", "email"], federationProviderName: "YOUR_AUTH0_DOMAIN.auth0.com")

// Present the Hosted UI sign in.
AWSMobileClient.default().showSignIn(navigationController: self.navigationController!, hostedUIOptions: hostedUIOptions) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}

// Present the Hosted UI sign in.
AWSMobileClient.default().showSignIn(navigationController: self.navigationController!, hostedUIOptions: hostedUIOptions) { (userState, error) in
    if let error = error as? AWSMobileClientError {
        print(error.localizedDescription)
    }
    if let userState = userState {
        print("Status: \(userState.rawValue)")
    }
}
```

> Optional: If your app deployment target is < iOS 11, add the following callback in your App Delegate's `application:open url` method. This callback is required, because `SFSafariViewController` is used in < iOS 11 to integrate with the Hosted UI.

```swift
func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    return AWSMobileClient.default().handleAuthResponse(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
}
```

### Hosted UI経由でサインアウトする

```swift
// Setting invalidateTokens: true will make sure the tokens are invalided
AWSMobileClient.default().signOut(options: SignOut(invalidateTokens: true)) { (error) in
    print("Error: \(error.debugDescription)")
}
```

トークンを削除するだけでローカルにサインアウトしたい場合は、 `signOut` メソッドを呼び出すことができます。

```swift
AWSMobileClient.default().signOut()
```

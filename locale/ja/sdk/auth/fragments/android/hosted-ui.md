
## Amazon Cognito Hosted UI

Amazon Cognitoは、ホストされたUIを介してカスタマイズ可能なユーザーエクスペリエンスを提供します。 フローを使用すると、CognitoまたはソーシャルプロバイダのSDKをアプリケーションに埋め込むことなくログイン画面を起動できます。 Hosted UIにより、エンドユーザーはFacebook経由で直接ユーザープールにサインインできます。 AmazonとGoogleだけでなく、OpenID Connect(OIDC)とSAML IDプロバイダを介して。 Amazon Cognito Hosted UI の詳細については、 [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-configuring-app-integration.html) をご覧ください。

### CLIによる自動セットアップ

利用したいIDプロバイダー(Google、Facebook、またはAmazonでログイン)を設定する必要があります。

<amplify-block-switcher> <amplify-block name="Facebook Login">

1. Facebook [で](https://developers.facebook.com/docs/facebook-login) 開発者アカウントを作成します。
2. [Facebook の認証情報で](https://developers.facebook.com/) にサインインします。
3. *My Apps* メニューから *Add New App* を選択します。 ![画像](~/images/cognitoHostedUI/facebook1.png)
4. Facebook アプリに名前を付け、 *アプリIDの作成* を選択します。 ![画像](~/images/cognitoHostedUI/facebook2.png)
5. 左のナビゲーションバーで、 *設定* を選択し、 *Basic* を選択します。 ![画像](~/images/cognitoHostedUI/facebook3.png)
6. *App ID* と *App Secret*に注意してください。CLI フローの次のセクションでそれらを使用します。

</amplify-block> <amplify-block name="Google Sign-In">

1. [Google 開発者コンソール](https://console.developers.google.com) に移動します。
2. 左のナビゲーションバーで、 *資格情報* を選択します。 ![画像](~/images/cognitoHostedUI/google5.png)
3. *資格情報の作成* ドロップダウン リストから *OAuth クライアント ID* ![Image](~/images/cognitoHostedUI/google6.png) を選択して、OAuth2.0 資格情報を作成します。
4. *Web アプリケーション* を選択します。
5. *Create* をクリックします。
6. *OAuth クライアント ID* および *クライアント シークレット*に注意してください。CLI フローの次のセクションでそれらが必要になります。
7. *OK* を選択します。

</amplify-block> <amplify-block name="Login with Amazon">

1. Amazon [で](https://developer.amazon.com/login-with-amazon)開発者アカウントを作成します。
2. [Amazon の認証情報で](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html) にサインインします。
3. AmazonクライアントIDとクライアントシークレットを受け取るには、Amazonセキュリティプロファイルを作成する必要があります。セキュリティプロファイルの作成を選択してください。 ![画像](~/images/cognitoHostedUI/amazon1.png)
4. セキュリティプロファイル名、セキュリティプロファイル説明、および同意プライバシー通知URLを入力します。 ![画像](~/images/cognitoHostedUI/amazon2.png)
5. 保存を選択します。
6. クライアントIDと秘密を表示するには、クライアントIDとクライアントシークレットを選択します。 CLI フローの次のセクションでそれらが必要になります。 ![画像](~/images/cognitoHostedUI/amazon3.png)

</amplify-block> </amplify-block-switcher>

プロジェクトの root フォルダーで次のコマンドを実行します。

```bash
amplify add auth ##"amplify update auth" がすでに設定されている場合、認証を追加
```

ソーシャルプロバイダ(Federation)でデフォルト設定を選択します。

```console
デフォルトの認証とセキュリティ設定を使用しますか？
  デフォルト設定
<unk> ソーシャルプロバイダ(Federation)によるデフォルト設定
  手動設定
  詳細を知りたい。
```

CLI フローを通過した後、次のコマンドを実行して、構成されたリソースをクラウドにデプロイします。

```bash
push を増幅する
```

After running the `amplify push` command, you will find a domain-name provisioned by the CLI for the hosted UI as an output in the terminal. You can find that information anytime later using the `amplify status` command.

**Note:** your user pool domain is something like: `domain_prefix-<env-name>.auth.<region>.amazoncognito.com`. If you've setup federation through third party providers, you would need to update the providers with the CLI provisioned domain-name.

<amplify-block-switcher> <amplify-block name="Facebook Login">

1. [Facebook の認証情報で](https://developers.facebook.com/) にサインインします。
2. *My Apps* メニューから *Your App* を選択します。 ![画像](~/images/cognitoHostedUI/facebook1.png)
3. 左のナビゲーションバーで、 *設定* を選択し、 *Basic* を選択します。 ![画像](~/images/cognitoHostedUI/facebook3.png)
4. ページ下部から *+ Add Platform* を選択し、 *Website* を選択します。 ![画像](~/images/cognitoHostedUI/facebook4.png)
5. *サイトのURL*に/oauth2/idpponseエンドポイントでユーザプールドメインを入力してください。

    ```console
    https://<your-user-pool-domain>/oauth2/idpponse
    ```

    ![画像](~/images/cognitoHostedUI/facebook5.png)
6. 変更を保存
7. *App Domains* にユーザープールドメインを入力してください:

    ```console
    https://<your-user-pool-domain>
    ```

    ![画像](~/images/cognitoHostedUI/facebook6.png)
8. 変更を保存
9. ナビゲーションバーから *Products* を選択し、 *Set up* from *Facebook Login*. ![画像](~/images/cognitoHostedUI/facebook7.png)
10. ナビゲーションバーから *Facebook Login* を選択し、 *Settings* を選択します。
11. リダイレクトURLを *有効なOAuthリダイレクト URI*に入力します。/oauth2/idpressポンスエンドポイントを持つユーザープールドメインで構成されます。

    ```console
    https://<your-user-pool-domain>/oauth2/idpponse
    ```

    ![画像](~/images/cognitoHostedUI/facebook8.png)
12. 変更を保存

</amplify-block> <amplify-block name="Google Sign-In">

1. [Google Developer Console](https://developers.google.com/identity/sign-in/web/sign-in) に移動
2. *CONFIGURE A PROJECT* をクリックする ![画像](~/images/cognitoHostedUI/google1.png)
3. プロジェクト名を入力し、 *NEXT* を選択します。 ![画像](~/images/cognitoHostedUI/google2.png)
4. 製品名を入力し、 *次* を選択します。
5. *から* Web ブラウザー *を選択します。* ドロップダウン リストから呼び出します。 ![画像](~/images/cognitoHostedUI/google3.png)
6. *CREATE*をクリックします。このステップから *Client ID* と *Client Secret* を使用しません。
7. 完了をクリックします。
8. [Google 開発者コンソール](https://console.developers.google.com) に移動します。
9. 左のナビゲーションバーで、 *資格情報* を選択します。 ![画像](~/images/cognitoHostedUI/google5.png)
10. 最初のステップで作成したクライアントを選択し、編集オプションを選択します。
11. Authorized Javascript オリジンにユーザープールドメインを入力します。
12. `/oauth2/idpponse` エンドポイントで *Authorized Redirect URI* を入力します。

    ![画像](~/images/cognitoHostedUI/google7.png)

    注意: エラーメッセージが表示された場合 `無効なリダイレクト: 送信する前にドメインを許可されたドメインリストに追加する必要があります。 <code> エンドポイントを追加する場合は、` *許可されたドメインリスト* に移動してドメインを追加してください。
13. *保存* をクリックします。

</amplify-block> <amplify-block name="Login with Amazon">

1. [Amazon の認証情報で](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html) にサインインします。
2. 歯車にカーソルを合わせて、前のステップで作成したセキュリティプロファイルに関連付けられているWeb設定を選択し、編集を選択します。 ![画像](~/images/cognitoHostedUI/amazon4.png)
3. 許可されたオリジンにユーザプールドメインを入力し、/oauth2/idpressポンスエンドポイントを使用してユーザプールドメインを許可された返りURLに入力します。 ![画像](~/images/cognitoHostedUI/amazon5.png)
5. 保存を選択します。

</amplify-block> </amplify-block-switcher>

### Amazon Cognito Hosted UI を Android アプリでセットアップ

<amplify-block-switcher> <amplify-block name="Version 2.18.0 and above">

1. Add the following activity to your app's `AndroidManifest.xml` file, replacing `myapp` with whatever value you used for your redirect URI prefix:

  ```xml
  <activity
      android:name="com.amazonaws.mobileconnectors.cognitoauth.activities.CustomTabsRedirectActivity">
      <intent-filter>
          <action android:name="android.intent.action.VIEW" />

          <category android:name="android.intent.category.DEFAULT" />
          <category android:name="android.intent.category.BROWSABLE" />

          <data android:scheme="myapp" />
      </intent-filter>
  </activity>
  ```

2. HostedUIを呼び出している `アクティビティ` に次の結果ハンドラを追加します:

  ```java
  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      if (requestCode == AuthClient.CUSTOM_TABS_ACTIVITY_CODE) {
            AWSMobileClient.getInstance().handleAuthResponse(data);
      }
  }
  ```

3. If you previously setup HostedUI for version 2.17.1 or below, remove the intent filter you previously added to your activity in the `AndroidManifest.xml` file with the URI scheme (e.g. `myapp`) as well as the `onResume()` or `onNewIntent()` handler method you previously added to your `Activity`.

</amplify-block> <amplify-block name="Version 2.17.1 and below">

1. Add `myapp://` to your app's Intent filters located in `AndroidManifest.xml`. The `your.package.YourAuthIntentHandlingActivity` will be referenced in the next step.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
     <manifest xmlns:android="http://schemas.android.com/apk/res/android"
               xmlns:amazon="http://schemas.amazon.com/apk/res/android"
               package="com.amazonaws.mobile.client">

        <uses-permission android:name="android.permission.INTERNET"/>
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

        <application>
            <activity android:name="your.package.YourAuthIntentHandlingActivity">
                <intent-filter>
                    <action android:name="android.intent.action.VIEW" />

                    <category android:name="android.intent.category.DEFAULT" />
                    <category android:name="android.intent.category.BROWSABLE" />

                    <data android:scheme="myapp" />
                </intent-filter>
            </activity>
        </application>

    </manifest>
    ```

2. Attach an intent callback so that `AWSMobileClient` can handle the callback and confirm sign-in or sign-out. This should be in `your.package.YourAuthIntentHandlingActivity`.

    ```java
    @Override
    protected void onResume() {
        super.onResume();
        Intent activityIntent = getIntent();
        if (activityIntent.getData() != null &&
                "myapp".equals(activityIntent.getData().getScheme())) {
            AWSMobileClient.getInstance().handleAuthResponse(activityIntent);
        }
    }
    ```

</amplify-block> </amplify-block-switcher>

### Hosted UIの起動

Hosted UI をアプリケーションから起動するには、 `AWSMobileClient.getInstance()` の `showSignIn` API を使用します。

```java
// No options are being specified, only the config will be used
HostedUIOptions hostedUIOptions = HostedUIOptions.builder()
        .scopes("openid", "email")
        .build();
SignInUIOptions signInUIOptions = SignInUIOptions.builder()
        .hostedUIOptions(hostedUIOptions)
        .build();
// 'this' refers to the current active Activity
AWSMobileClient.getInstance().showSignIn(this, signInUIOptions, new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails details) {
        Log.d(TAG, "onResult: " + details.getUserState());
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

**Note:** By default, the Hosted UI will show all sign-in options; the username-password flow as well as any social providers which are configured. If you wish to bypass the extra sign-in screen showing all the provider options and launch your desired social provider login directly, you can set the `HostedUIOptions` as shown in the next section.

### Facebook/Google/SAML サインインを直接起動するホストされたUIの設定

```java
// For Google
HostedUIOptions hostedUIOptions = HostedUIOptions.builder()
    .scopes("openid", "email")
    .identityProvider("Google")
    .build();

// For Facebook
HostedUIOptions hostedUIOptions = HostedUIOptions.builder()
    .scopes("openid", "email")
    .identityProvider("Facebook")
    .build();

SignInUIOptions signInUIOptions = SignInUIOptions.builder()
    .hostedUIOptions(hostedUIOptions)
    .build();
// 'this' refers to the current active Activity
AWSMobileClient.getInstance().showSignIn(this, signInUIOptions, new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails details) {
        Log.d(TAG, "onResult: " + details.getUserState());
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

### HostedUI からサインアウト

```java
AWSMobileClient.getInstance().signOut(SignOutOptions.builder().invalidateTokens(true).build(), new Callback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

トークンを削除するだけでローカルにサインアウトしたい場合は、 `signOut` メソッドを呼び出すことができます。

```java
AWSMobileClient.getInstance().signOut();
```

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
                "SignInRedirectURI": "myapp://callback",
                "SignOutRedirectURI": "myapp://signout",
                "Scopes": ["openid", "email"]
            }
        }
    }
}
```

Note: The User Pool OIDC JWT token obtained from a successful sign-in will be federated into a configured Cognito Identity pool in the `awsconfiguration.json` and the SDK will automatically exchange this with Cognito Identity to also retrieve AWS credentials.

## Auth0 Hosted UIの使用

You can use `AWSMobileClient` to use `Auth0` as `OAuth 2.0`  provider. You can use `Auth0` as one of the providers of your Cognito Federated Identity Pool. This will allow users authenticated via Auth0 have access to your AWS resources. Learn [how to integrate Auth0 with Cognito Federated Identity Pools](https://auth0.com/docs/integrations/integrating-auth0-amazon-cognito-mobile-apps)

### Android アプリで Auth0 ホストされた UI を設定

### Amazon Cognito Hosted UI を Android アプリでセットアップ

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
                    "TokenURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/oauth/token",
                    "SignInURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/authorize",
                    "SignInRedirectURI": "com.your.bundle.configured.in.auth0://YOUR_AUTH0_DOMAIN.auth0.com/android/com.your.bundle/callback",
                    "SignOutURI": "https://YOUR_AUTH0_DOMAIN.auth0.com/v2/logout",
                    "SignOutRedirectURI": "com.your.bundle.configured.in.auth0://yourserver.auth0.com/android/com.amazonaws.AWSAuthSDKTestApp/signout",
                    "SignOutURIQueryParameters": {
                        "client_id" : "YOUR_AUTH0_APP_CLIENT_ID",
                        "returnTo" : "com.your.bundle.configured.in.auth0://yourserver.auth0.com/android/com.amazonaws.AWSAuthSDKTestApp/signout"
                    },
                    "Scopes": ["openid", "email"]
                }
            }
        }
    }
    ```

1. `AndroidManifest.xml` にあるアプリのインテントフィルタにサインインとサインアウトのリダイレクトURIを追加します。

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
     <manifest xmlns:android="http://schemas.android.com/apk/res/android"
               xmlns:amazon="http://schemas.amazon.com/apk/res/android"
               package="com.amazonaws.mobile.client">

        <uses-permission android:name="android.permission.INTERNET"/>
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

        <application>
            <activity android:name="your.package.YourAuthIntentHandlingActivity">
                <intent-filter>
                    <action android:name="android.intent.action.VIEW" />

                    <category android:name="android.intent.category.DEFAULT" />
                    <category android:name="android.intent.category.BROWSABLE" />

                    <data android:scheme="com.your.bundle.configured.in.auth0" />
                </intent-filter>
            </activity>
        </application>

    </manifest>
    ```

1. 意図したコールバックを添付して、AWSMobileClient がコールバックを処理し、サインインまたはサインアウトを確認できるようにします。これは `your.package.YourAuthIntentHandlingActivity` 内にある必要があります。

    ```java
    @Override
    protected void onResume() {
        super.onResume();
        Intent activityIntent = getIntent();
        if (activityIntent.getData() != null &&
                "myapp".equals(activityIntent.getData().getScheme())) {
            AWSMobileClient.getInstance().handleAuthResponse(activityIntent);
        }
    }
    ```

### Auth0のホストされたUIの起動

Hosted UI をアプリケーションから起動するには、 `AWSMobileClient.getInstance()` の `showSignIn` API を使用します。

```java
final HostedUIOptions hostedUIOptions = HostedUIOptions.builder()
        .federationProviderName("YOUR_AUTH0_DOMAIN.auth0.com")
        .build();
final SignInUIOptions signInUIOptions = SignInUIOptions.builder()
        .hostedUIOptions(hostedUIOptions)
        .build();
// 'this' refers to the current active Activity
AWSMobileClient.getInstance().showSignIn(this, signInUIOptions, new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails result) {
        Log.d(TAG, "onResult: " + result.getUserState());
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

### HostedUI からサインアウト

```java
AWSMobileClient.getInstance().signOut(SignOutOptions.builder().invalidateTokens(true).build(), new Callback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

トークンを削除するだけでローカルにサインアウトしたい場合は、 `signOut` メソッドを呼び出すことができます。

```java
AWSMobileClient.getInstance().signOut();
```

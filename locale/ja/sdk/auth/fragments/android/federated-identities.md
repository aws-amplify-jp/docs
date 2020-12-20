現在、AWSMobileClient のフェデレーション機能は、Cognito Identity Pools のみをサポートしています。

### 連合サインイン

```java
AWSMobileClient.getInstance().federatedSignIn(IdentityProvider.FACEBOOK.toString(), "FACEBOOK_TOKEN_HERE", new Callback<UserStateDetails>() {
    @Override
    public void onResult(final UserStateDetails userStateDetails) {
        //Handle the result
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "sign-in error", e);
    }
});
```

`federatedSignIn()` can be used to obtain federated "Identity ID" using external providers like Google, Facebook or Twitter. If the tokens are expired and new tokens are needed, a notification will be dispatched on the `AWSMobileClient` listener with the user state `SIGNED_OUT_FEDERATED_TOKENS_INVALID`. You can give the updated tokens via the same `federatedSignIn()` method.

The API calls to get AWS credentials will be asynchronously blocked until you fetch the social provider's token and give it to `AWSMobileClient`. Once you pass the tokens, the `AWSMobileClient` will fetch AWS Credentials using the new tokens and unblock all waiting calls. It will then use the new credentials.

#### Cognitoアイデンティティを持つSAML

アプリで呼び出されるAWSサービスのユーザーサインインプロバイダとしてSAMLサインインプロバイダを連携させるには トークンを `AWSMobileClientに渡します。 etInstance() ederatedSignIn() <code> .`. 次の [手順](https://docs.aws.amazon.com/cognito/latest/developerguide/saml-identity-provider.html) を使用して、まずAWS IAMでSAMLアプリケーションを登録する必要があります。

サインインから SAML トークンを取得したら、 `AWSMobileClient` の `federatedSignIn` API を呼び出すことができます。

```java
// Perform SAML token federation
AWSMobileClient.getInstance().federatedSignIn("YOUR_SAML_PROVIDER_NAME", "YOUR_SAML_TOKEN", new Callback<UserStateDetails>() {
    @Override
    public void onResult(final UserStateDetails userStateDetails) {
        //Handle the result
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "sign-in error", e);
});
```

**Note:**If the SAML token contains more than one Role ARN, you will need to specify which role will be assumed when federating. If the SAML token has more than one Role ARN and a `customRoleARN` is not specified, it will result in an error.

```java
// Choose one of the roles available in the token
FederatedSignInOptions options = FederatedSignInOptions.builder()
                                     .customRoleARN("choose-one")
                                     .build();
// Perform SAML token federation
AWSMobileClient.getInstance().federatedSignIn("YOUR_SAML_PROVIDER_NAME", "YOUR_SAML_TOKEN", options, new Callback<UserStateDetails>() {
    @Override
    public void onResult(final UserStateDetails userStateDetails) {
        //Handle the result
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "sign-in error", e);
});
```

### Facebook を設定

To federate Facebook as a user sign-in provider for AWS services called in your app, you will pass tokens to `AWSMobileClient.getInstance().federatedSignIn()`. You must first register your application with Facebook by using the [Facebook Developers portal](https://developers.facebook.com/) and configure this with Amazon Cognito Identity Pools.

AWS Amplifyはこの設定に役立ちますが、まずはアプリのIDプロバイダーとしてFacebookを設定する方法を説明します。

すでにFacebookアプリIDをお持ちの場合 AWS Amplify CLI を使用して認証を設定する際に、 `Facebook App ID` フィールドにコピー&ペーストできます。

**FacebookアプリIDを取得するには**

Facebookの [アプリ開発ガイド](https://developers.facebook.com/docs/apps) に従ってFacebookにアプリを設定してください。 [Facebook開発者ポータル](https://developers.facebook.com/)にサインインしてください。

 - **新しいアプリを追加** を選択するか、 **My Apps** から以前に作成したアプリを選択します。
    - 尋ねられた場合は、Facebookログインを使用するアプリのプラットフォームを選択し、 **基本設定**を選択します。
 - Type a display name for your app, select a category for your app from the **Category** drop-down list, then choose **Create App ID**; take note of the **App ID**.
 - In the Facebook Developer portal's left hand navigation list, choose **Settings**, **Basic**, then press the **+Add Platform** button.
 - **Android** を選択し、 **Google Play Package Name** (例えば、com.example.YourProjectName) と **Class Name** を追加します。
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

Choose **YES** to `? Allow unauthenticated logins?` and **YES** to `? Do you want to enable 3rd party authentication providers in your identity pool?`

**Facebook** を選択し、先ほど保存したFacebook **App ID** を提供します。

Facebook のサインインの設定が完了すると、CLI はこのカテゴリのローカル CLI メタデータを設定したことを確認するメッセージを表示します。 クラウドの変更を更新するには、以下を実行してください。

```bash
push を増幅する
```

モバイルアプリ [で Facebook を設定できるようになりました](#facebook-login-in-your-mobile-app)。

CLI では、アプリケーションの ID プロバイダーを複数選択できます。 既存の認証設定にアイデンティティプロバイダを追加するために、 `増幅認証アップデート` を実行することもできます。

### Google を設定

アプリで呼び出されたAWSサービスのユーザーサインインプロバイダーとしてGoogleを連携させるには、トークンを `AWSMobileClient.getInstance().federatedSignIn()`に渡します。 アプリケーションを Google Developers Console で登録し、次にAmazon Cognito Identity Poolsで設定する必要があります。

iOSアプリにGoogleサインインを実装するには、次の2つのことが必要です。

1. OAuthウェブクライアントID
2. Android Client ID

これらのクライアントIDは、Google Developersプロジェクトの一部です。 Web クライアント ID は、Cognito と Google の間の OAuth フローをサーバー側で管理するために Cognito ID プールで使用されます。 Android クライアント ID は、Android アプリで Google ログイン情報を使用してユーザーが Google で認証できるように OAuth フローを直接認証するために使用されます。

> **注意:** Google サインイン用の OAuth クライアントを作成するための作成と設定手順は、常に変更されています。 常にGoogleからの公式設定手順を参照してください。

最初に Google Developer Portal [](https://developers.google.com/identity/sign-in/ios/start-integrating) の **"連携を開始" セクションに移動し、** をクリックして OAuth クライアント ID を取得します。

When prompted choose **Android** as the calling platform along with your Package name and certificate. Once created the **Android Client ID** will be created; take note of this value.

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

Choose **YES** to `? Allow unauthenticated logins?` and **YES** to `? Do you want to enable 3rd party authentication providers in your identity pool?`

**Google** を選択し、上記の **Web Client ID** と **iOS Client ID** を入力します。 完了したら、以下を実行してバックエンドを更新します。

```bash
push を増幅する
```

モバイルアプリで [Googleを設定](#google-login-in-your-mobile-app)できるようになりました。

> CLI では、アプリケーションの ID プロバイダーを複数選択できます。 既存の認証設定にアイデンティティプロバイダを追加するために、 `増幅更新認証` を実行することもできます。

### Appleでサインインを設定する

To federate Sign in with Apple as a user sign-in provider for AWS services called in your app, you will pass tokens to `AWSMobileClient.getInstance().federatedSignIn()`. You must set up your application to use Sign in with Apple, and then configure Amazon Cognito Identity Pools to use Apple as an authentication provider. There are three main steps to setting up Sign in with Apple: implementing Sign in with Apple in your app, configuring Sign in with Apple as an authentication provider in your Amazon Cognito Identity Pool, and passing the Sign in with Apple token to AWSMobileClient via `federatedSignIn`.

1. **アプリで Apple でサインインを実装する**

    Since we don’t have an SDK that supports Sign in with Apple for Android, we need to use the web flow in a web view. To configure Sign in with Apple in your application, follow [Configuring Your Webpage for Sign In with Apple](https://developer.apple.com/documentation/signinwithapplejs/configuring_your_webpage_for_sign_in_with_apple) in the Apple documentation. To add a Sign in with Apple button to your Android user interface, follow [Displaying and Configuring Sign In with Apple Buttons](https://developer.apple.com/documentation/signinwithapplejs/displaying_and_configuring_sign_in_with_apple_buttons) in the Apple documentation. To securely authenticate users using Sign in with Apple, follow [Configuring Your Webpage for Sign In with Apple](https://developer.apple.com/documentation/signinwithapplerestapi/authenticating_users_with_sign_in_with_apple) in the Apple documentation.

2. **Amazon Cognito Identity Pool で認証プロバイダとして Apple でサインインを設定する**

    Once you have configured your application to use Sign in with Apple, paste your app's **Service Identifier** into the **Apple Services ID** field of your [Amazon Cognito Identity Pool](https://console.aws.amazon.com/cognito/home). The Service Identifier can be found in the [**Certificates, IDs & Profiles** section](https://developer.apple.com/account/resources/identifiers/list) of your Apple Developer Account.

3. **`federatedSignIn` 経由で Apple トークンでサインインする**

    Appleでサインインすると、セッションオブジェクトを使用して状態を追跡します。 Amazon Cognitoは、このセッションオブジェクトのIDトークンを使用してユーザーを認証します。 は、一意の識別子を生成し、必要に応じて、ユーザに他のAWSリソースへのアクセスを許可します。

    設定が完了したら、Amazon Cognito Identity Poolの認証プロバイダとしてAppleでサインインします。 アプリは Apple でサインインを使用して認証を実装しています。 `federatedSignIn` メソッドのトークンとして使用するApple認証レスポンスを使用してサインインの `id_token` 値を取得できます。

    ```java
    // The onSuccess method of your app's Sign in with Apple flow

    @Override
    public void onSuccess(Bundle response) {
        String token = response.getString("id_token");

        AWSMobileClient.getInstance().federatedSignIn("appleid.apple.com", token, new Callback<UserStateDetails>() {
            @Override
            public void onResult(final UserStateDetails userStateDetails) {
                //Handle the result
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "sign-in error", e);
            }
        });
    }
    ```

    `federatedSignIn` メソッドが正常に完了すると、 `AWSMobileClient` は自動的に連合IDを使用して AWS サービスコールを行うための資格情報を取得します。

### モバイルアプリでのFacebookログイン

> **Android API レベル 23 以上を使用する** Android のサインイン用 `AWSMobileClient` ライブラリは、設定したサインインプロバイダの `SignInUI` を表示するためのアクティビティとビューを提供します。 このライブラリは、Android SDK の API レベル 23 以上に依存します。

次の権限とアクティビティを `AndroidManifest.xml` ファイルに追加します。

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

<activity
    android:name="com.facebook.FacebookActivity"
    android:exported="true">
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="@string/fb_login_protocol_scheme" />
</intent-filter>
</activity>

<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id" />
```

次の依存関係を `app/build.gradle` ファイルに追加します。

```groovy
dependencies {
    // Mobile Client for initializing the SDK
    implementation ('com.amazonaws:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }

    // Facebook SignIn
    implementation 'com.android.support:support-v4:28.+'
    implementation ('com.amazonaws:aws-android-sdk-auth-facebook:2.15.+@aar') { transitive = true }

    // Sign in UI
    implementation 'com.android.support:appcompat-v7:28.+'
    implementation ('com.amazonaws:aws-android-sdk-auth-ui:2.15.+@aar') { transitive = true }
}
```

> 注意: 依存関係を追加する場合は、appcompatとサポートライブラリのメジャーバージョンが一致していることを確認してください。 前の例では、バージョン28を使用しています。

In `strings.xml`, add string definitions for your Facebook app ID and login protocol scheme. The value for app_id is your Facebook app ID and the value for logic_protocol_scheme should be your Facebook app ID prefixed with `fb`.

```xml
<string name="facebook_app_id">123123123123123</string>
<string name="fb_login_protocol_scheme">fb123123123123123</string>
```

Next, create an activity that will present your sign-in screen. In Android Studio, choose `File > New > Activity > Basic Activity` and type an activity name, such as `AuthenticatorActivity`. If you want to make this your starting activity, move the intent filter block containing `.LAUNCHER` to the `AuthenticatorActivity` in your app's `AndroidManifest.xml`.

```xml
<activity android:name=".AuthenticatorActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

最後に、以前に概説したように `AWSMobileClient.getInstance().federatedSignIn()` を呼び出すために、 `AuthenticatorActivity の` の `onCreate` 関数を更新することができます。

```java
import android.app.Activity;
import android.os.Bundle;

import com.amazonaws.mobile.auth.ui.SignInUI;
import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.AWSStartupHandler;
import com.amazonaws.mobile.client.AWSStartupResult;

public class AuthenticatorActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authenticator);

        AWSMobileClient.getInstance().initialize(this, new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails userStateDetails) {
                Log.i("INIT", userStateDetails.getUserState());
                AWSMobileClient.getInstance().showSignIn(
                        AuthenticatorActivity.this,
                        SignInUIOptions.builder()
                                .nextActivity(NextActivity.class)
                                .build(),
                        new Callback<UserStateDetails>() {
                            @Override
                            public void onResult(UserStateDetails result) {
                                Log.d(TAG, "onResult: " + result.getUserState());
                            }

                            @Override
                            public void onError(Exception e) {
                                Log.e(TAG, "onError: ", e);
                            }
                        }
                );
            }

            @Override
            public void onError(Exception e) {
                Log.e("INIT", "Error during initialization", e);
            }
        });
    }
}
```

### モバイルアプリでGoogleログイン

> **Android API レベル 23 以上を使用する** Android のサインイン用 `AWSMobileClient` ライブラリは、設定したサインインプロバイダの `SignInUI` を表示するためのアクティビティとビューを提供します。 このライブラリは、Android SDK の API レベル 23 以上に依存します。


`AndroidManifest.xml` ファイルに次の権限を追加します。

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

次の依存関係を `app/build.gradle` ファイルに追加します。

```groovy
dependencies {
    // Mobile Client for initializing the SDK
    implementation ('com.amazonaws:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }

    // Google SignIn
    implementation 'com.android.support:support-v4:28.+'
    implementation ('com.amazonaws:aws-android-sdk-auth-google:2.15.+@aar') { transitive = true }

    // Sign in UI Library
    implementation 'com.android.support:appcompat-v7:28.+'
    implementation ('com.amazonaws:aws-android-sdk-auth-ui:2.15.+@aar') { transitive = true }
}
```

> 注意: 依存関係を追加する場合は、appcompatとサポートライブラリのメジャーバージョンが一致していることを確認してください。 前の例では、バージョン28を使用しています。

Create an activity that will present your sign-in screen. In Android Studio, choose `File > New > Activity > Basic Activity` and type an activity name, such as `AuthenticatorActivity`. If you want to make this your starting activity, move the intent filter block containing `.LAUNCHER` to the `AuthenticatorActivity` in your app's `AndroidManifest.xml`.

```xml
<activity android:name=".AuthenticatorActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

最後に、以前に概説したように `AWSMobileClient.getInstance().federatedSignIn()` を呼び出すために、 `AuthenticatorActivity の` の `onCreate` 関数を更新することができます。

```java
import android.app.Activity;
import android.os.Bundle;

import com.amazonaws.mobile.auth.ui.SignInUI;
import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.AWSStartupHandler;
import com.amazonaws.mobile.client.AWSStartupResult;

public class AuthenticatorActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authenticator);

        AWSMobileClient.getInstance().initialize(this, new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails userStateDetails) {
                Log.i("INIT", userStateDetails.getUserState());
                AWSMobileClient.getInstance().showSignIn(
                        AuthenticatorActivity.this,
                        SignInUIOptions.builder()
                                .nextActivity(NextActivity.class)
                                .build(),
                        new Callback<UserStateDetails>() {
                            @Override
                            public void onResult(UserStateDetails result) {
                                Log.d(TAG, "onResult: " + result.getUserState());
                            }

                            @Override
                            public void onError(Exception e) {
                                Log.e(TAG, "onError: ", e);
                            }
                        }
                );
            }

            @Override
            public void onError(Exception e) {
                Log.e("INIT", "Error during initialization", e);
            }
        });
    }
}
```

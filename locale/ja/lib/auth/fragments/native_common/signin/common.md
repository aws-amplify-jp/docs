
Authカテゴリは、ユーザーを登録し、email/phoneなどの属性を確認し、オプションの多要素認証でサインインするために使用できます。 ユーザーとそのプロパティを管理するAmazon Cognitoユーザープールを使用するように設定されています。

## 前提条件

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/common_prereq.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/common_prereq.md"></inline-fragment>

## ユーザーを登録する

[入門ガイド](~/lib/auth/getting-started.md) に記載されているデフォルトの CLI フローには、ユーザー名が必要です パスワードと有効な電子メールIDをパラメータとしてユーザーを登録します。 以下のAPIを呼び出してサインアップフローを開始します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/10_signUp.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/10_signUp.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/10_signUp.md"></inline-fragment>

サインアップフローの次のステップは、ユーザーを確認することです。 登録時に入力されたメールアドレスに確認コードが送信されます。 `confirmSignUp` 呼び出しにメールで受信した確認コードを入力します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/20_confirmSignUp.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/20_confirmSignUp.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/20_confirmSignUp.md"></inline-fragment>

以下がコンソールウィンドウに表示されている場合は、サインアップフローが完了していることがわかります:

```console
登録を確認しました
```

## ユーザーにサインイン

ユーザーからユーザー名とパスワードを取得するためのUIを実装します。 ユーザー名とパスワードを入力した後、次のメソッドを呼び出してサインインを開始できます。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/30_signIn.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/30_signIn.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/30_signIn.md"></inline-fragment>

以下がコンソールウィンドウに表示されている場合は、フローのサインインが完了していることがわかります:

```console
サインイン成功
```

これでユーザー登録に成功し、Amplifyでそのユーザーのユーザー名とパスワードで認証されました。 認証カテゴリは、Web UI ベースのサインインなどの認証のための他のメカニズムをサポートしています。 他のセクションで探索できる他のプロバイダなどを使用してサインインしてください。

## 多要素認証

多要素認証の設定のいくつかの手順は、Authの初期設定時にのみ選択できます。 CLI 経由ですでに認証を追加している場合は、ターミナルのプロジェクト ディレクトリに移動します。 `を増幅する auth remove` を実行し、完了したら、 `push` を増幅して削除します。

次のオプションを使用して、 `amplify add auth` を実行し、認証をセットアップします。

```console
? Do you want to use the default authentication and security configuration? 
    `Manual configuration`
? Select the authentication/authorization services that you want to use: 
    `User Sign-Up, Sign-In, connected with AWS IAM controls (Enables per-user Storage features for images or other content, Analytics, and more)`
? Please provide a friendly name for your resource that will be used to label this category in the project: 
    `<default>`
? Please enter a name for your identity pool. 
    `<default>`
? Allow unauthenticated logins? (Provides scoped down permissions that you can control via AWS IAM) 
    `Yes`
? Do you want to enable 3rd party authentication providers in your identity pool? 
    `No`
? Please provide a name for your user pool: 
    `<default>`
Warning: you will not be able to edit these selections.
? How do you want users to be able to sign in? 
    `Username`
? Do you want to add User Pool Groups? 
    `No`
? Do you want to add an admin queries API? 
    `No`
? Multifactor authentication (MFA) user login options: 
    `ON (Required for all logins, can not be enabled later)`
? For user login, select the MFA types: 
    `SMS Text Message`
? Please specify an SMS authentication message: 
    `Your authentication code is {####}`
? Email based user registration/forgot password: 
    `Enabled (Requires per-user email entry at registration)`
? Please specify an email verification subject: 
    `Your verification code`
? Please specify an email verification message: 
    `Your verification code is {####}`
? Do you want to override the default password policy for this User Pool? 
    `No`
Warning: you will not be able to edit these selections.
? What attributes are required for signing up? 
    `Email, Phone Number (This attribute is not supported by Facebook, Login With Amazon.)`
? Specify the app's refresh token expiration period (in days): 
    `30`
? Do you want to specify the user attributes this app can read and write? 
    `No`
? Do you want to enable any of the following capabilities?
    `NA`
? Do you want to use an OAuth flow? 
    `No`
? Do you want to configure Lambda Triggers for Cognito? 
    `No`
```

サインアップする際には、次のようにフォーマットされた電話番号と電子メールと電話番号の両方の属性を含めるようにしてください:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/40_multi_factor_signup.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/40_multi_factor_signup.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/40_multi_factor_signup.md"></inline-fragment>

You'll then confirm signup, sign in, and get back a nextStep in the sign in result of type `CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE`. A confirmation code will also be texted to the phone number provided above. Pass the code you received to the confirmSignIn api:

<amplify-callout> signInを呼び出すのと同じアプリセッションでconfirmSignInを呼び出す必要があります。 アプリを閉じた場合は、サインインをもう一度呼び出す必要があります。 結果として、テスト目的のために。 少なくとも、SMS経由で送信されたコードを入力し、confirmSignInにフィードできる入力フィールドが必要です。 </amplify-callout>

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/50_multi_factor_confirm_signin.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/50_multi_factor_confirm_signin.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/50_multi_factor_confirm_signin.md"></inline-fragment>

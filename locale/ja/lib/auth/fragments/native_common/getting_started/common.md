Amplify Authカテゴリは、ユーザーを認証するためのインターフェイスを提供します。舞台裏では、他のAmplifyカテゴリに必要な認証を提供します。 デフォルトでは、 [Amazon Cognito](https://aws.amazon.com/cognito) ユーザプールとアイデンティティプールの組み込みサポートが付属しています。 Amplify CLI は、認証プロバイダを使用して認証カテゴリを作成および設定するのに役立ちます。

## 目標
Amplify Authを使用してアプリケーションをセットアップおよび設定し、シンプルなAPIを経由して現在の認証セッションを確認する

## 前提条件

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/10_preReq.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/10_preReq.md"></inline-fragment>

## 認証カテゴリの設定

バックエンドで認証リソースのプロビジョニングを開始するには、プロジェクトディレクトリに移動し、 **コマンド** を実行します。

```bash
増幅して認証を追加
```

プロンプトが表示されたら以下を入力します:
```console
? Do you want to use the default authentication and security configuration?
    `Default configuration`
? How do you want users to be able to sign in?
    `Username`
? Do you want to configure advanced settings?
    `No, I am done.`
```

クラウドに変更をプッシュするには、 **コマンド** を実行します。

```bash
push を増幅する
```

Upon completion, `amplifyconfiguration.json` should be updated to reference provisioned backend auth resources.  Note that these files should already be a part of your project if you followed the [Project setup walkthrough](~/lib/project-setup/create-application.md).

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/20_installLib.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/20_installLib.md"></inline-fragment>

## Amplify認証を初期化
<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/30_initAuth.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/30_initAuth.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/30_initAuth.md"></inline-fragment>

## 現在の認証セッションをチェックする

現在の認証セッションを確認できるようになりました。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/40_fetchSession.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/40_fetchSession.md"></inline-fragment>

まだカテゴリにサインインしていないため、authSessionのisSignedInプロパティはfalseになります。

## 次のステップ
おめでとうございます! AWS Cognito Authプラグインのセットアップに成功しました。 Amplify Authの使用例を表示するには、次のリンクを参照してください。

* [ユーザー名のパスワードを使用して認証する](~/lib/auth/signin.md)
* [Web UIを使用してユーザーを認証します](~/lib/auth/signin_web_ui.md)
* [別の認証プロバイダでユーザーを認証する](~/lib/auth/social_signin_web_ui.md)

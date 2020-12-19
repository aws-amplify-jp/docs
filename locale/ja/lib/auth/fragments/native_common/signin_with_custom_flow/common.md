Authカテゴリは、あなたが定義したカスタム認証フローを実行するように構成できます。 以下のガイドでは、簡単なパスワードなしの認証フローを設定する方法を示します。

## 前提条件

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/10_preReq.md"></inline-fragment>

## 認証カテゴリの設定

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin_with_custom_flow/10_cli_setup.md"></inline-fragment>

## ユーザーを登録する

上記のCLIフローでは、ユーザーを登録するためのパラメータとしてユーザー名と有効な電子メールIDが必要です。 以下のAPIを呼び出してサインアップフローを開始します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin_with_custom_flow/20_signup.md"></inline-fragment>

サインアップフローの次のステップは、ユーザーを確認することです。 登録時に入力されたメールアドレスに確認コードが送信されます。 `confirmSignUp` 呼び出しにメールで受信した確認コードを入力します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin_with_custom_flow/30_confirmSignup.md"></inline-fragment>

## ユーザーにサインイン

ユーザーからユーザー名を取得するためのUIを実装します。 ユーザー名を入力した後、次のメソッドを呼び出してサインインを開始できます。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin_with_custom_flow/40_signin.md"></inline-fragment>

## カスタムチャレンジでサインインを確認

ユーザーからカスタムチャレンジ (この場合は`1234` ) を取得し、 `confirmSignin()` apiに渡します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin_with_custom_flow/50_custom_challenge.md"></inline-fragment>

以下がコンソールウィンドウに表示されている場合は、フローのサインインが完了していることがわかります:

```console
サインイン成功
```

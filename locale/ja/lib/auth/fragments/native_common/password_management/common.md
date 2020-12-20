## パスワードのリセット
パスワードをリセットするために resetPassword apiを使うと、このようなリセットコードを受け取るように設定されたユーザー属性にコードが送信されます(e. 電子メールまたはSMS:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/password_management/10_reset_password.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/password_management/10_reset_password.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/password_management/10_reset_password.md"></inline-fragment>

パスワードのリセット処理を完了するには、送信されたコードと 新しいパスワードの confirmResetPassword API を呼び出します。

<amplify-callout> resetPasswordを呼び出すのと同じアプリセッションでconfirmResetPasswordを呼び出す必要があります。 アプリを閉じた場合は、resetPasswordをもう一度呼び出す必要があります。 結果として、テスト目的のために。 resetPassword apiによって送信されたコードを入力し、confirmResetPasswordにフィードできる入力フィールドが必要になります。 </amplify-callout>

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/password_management/20_confirm_reset_password.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/password_management/20_confirm_reset_password.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/password_management/20_confirm_reset_password.md"></inline-fragment>

## パスワードの変更
サインインしたユーザーは、updatePassword API を使用してパスワードを更新できます:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/password_management/30_change_password.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/password_management/30_change_password.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/password_management/30_change_password.md"></inline-fragment>

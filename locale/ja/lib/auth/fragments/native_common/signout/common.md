`signOut` api を呼び出し、Authカテゴリからユーザーをサインアウトします。 指定された時間にサインインできるユーザーは1人だけです。

<inline-fragment platform="android" src="~/lib/auth/fragments/android/signout/10_local_signout.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signout/10_local_signout.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signout/10_local_signout.md"></inline-fragment>

signOut をオプションなしで呼び出すと、ユーザーのローカルキャッシュとキーチェーンが削除されます。 すべてのデバイスからサインアウトしたい場合は、高度なオプションで signOut api を呼び出します。

<inline-fragment platform="android" src="~/lib/auth/fragments/android/signout/20_global_signout.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signout/20_global_signout.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signout/20_global_signout.md"></inline-fragment>

`globalSignOut = true` を使用したサインアウトを呼び出すと、ログインしているユーザーのすべての Cognito User Pool トークンが無効になります。 ユーザーがデバイスにサインインしている場合 グローバルサインアウトが他のデバイスから呼び出されたときに有効なトークンを必要とするタスクを実行する権限はありません。 有効なトークンを取得するには、再度サインインする必要があります。

<amplify-callout warning> グローバルサインアウト機能は、Web UI サインインメソッドのいずれかを使用している場合は機能しません。 </amplify-callout>
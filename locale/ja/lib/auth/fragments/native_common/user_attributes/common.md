## 現在のユーザーの属性を取得します

ユーザーに割り当てられた属性のリストを取得するには、次の API を呼び出します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/user_attributes/10_fetch_attributes.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/user_attributes/10_fetch_attributes.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/user_attributes/10_fetch_attributes.md"></inline-fragment>

## ユーザー属性を更新

既存のユーザー属性を新規または更新するためのアップデート API を呼び出します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/user_attributes/20_update_user_attribute.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/user_attributes/20_update_user_attribute.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/user_attributes/20_update_user_attribute.md"></inline-fragment>

## ユーザー属性を確認
Some attributes require confirmation for the attribute update to complete. If the attribute need to be confirmed, the result of the above api will be `CONFIRM_ATTRIBUTE_WITH_CODE`. A confirmation code will be sent to the delivery medium mentioned in the delivery details. When the user gets the confirmation code, you can present a UI to the user to enter the code and invoke the confirm attribute api with their input:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/user_attributes/30_confirm_attribute.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/user_attributes/30_confirm_attribute.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/user_attributes/30_confirm_attribute.md"></inline-fragment>

## 確認コードを再送信する
コードの有効期限が切れているか、ユーザーが確認コードを再送信する必要がある場合は、以下のように再送信APIを呼び出します。

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/user_attributes/40_resend_code.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/user_attributes/40_resend_code.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/user_attributes/40_resend_code.md"></inline-fragment>

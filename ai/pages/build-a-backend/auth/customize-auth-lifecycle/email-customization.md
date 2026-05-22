---
title: "メールのカスタマイズ"
section: "build-a-backend/auth/customize-auth-lifecycle"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-08-15T17:57:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/customize-auth-lifecycle/email-customization/"
---

## 確認メールのカスタマイズ

デフォルトでは、Amplify Auth リソースはメールをデフォルトの方法としてスカッフォールドされます。ユーザーがサインアップすると、サインアップ時に指定したメールアドレスの所有権を確認するための確認メールが届きます。確認メールなどのメールはアプリのブランド ID でカスタマイズできます。

開始するには、`loginWith` の `email` 属性を `true` からオブジェクトに変更して、デフォルトの動作のカスタマイズを開始します:

```diff title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
-   email: true, 
+   email: {
+     verificationEmailStyle: "CODE",
+     verificationEmailSubject: "Welcome to my app!",
+     verificationEmailBody: (createCode) => `Use this code to confirm your account: ${createCode()}`,
+   },
  },
})
```

## 招待メールのカスタマイズ

場合によっては、[Amplify コンソール](/[platform]/build-a-backend/auth/manage-users/with-amplify-console/)でユーザーの代わりにユーザーアカウントをセットアップできます。この場合、Amplify Auth はユーザーをアプリケーションへようこそというウェルカムメールを送信します。このメールには、簡単なウェルカムメッセージと、ログイン時に使用できるメールアドレス、およびセットアップした一時的なパスワードが含まれています。

そのメールをカスタマイズする場合は、`email` オブジェクトの `userInvitation` 属性をオーバーライドできます:

```diff title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
-   email: true, 
+   email: {
+     // can be used in conjunction with a customized welcome email as well
+     verificationEmailStyle: "CODE",
+     verificationEmailSubject: "Welcome to my app!",
+     verificationEmailBody: (createCode) => `Use this code to confirm your account: ${createCode()}`,
+     userInvitation: {
+       emailSubject: "Welcome to my app!",
+       emailBody: (user, code) =>
+         `We're happy to have you! You can now login with username ${user()} and temporary password ${code()}`, 
+     },
+   },
  },
})
```

`emailBody` 関数の `user` と `code` 引数を使用する場合、`user` と `code` は**関数**であり、呼び出す必要があることに注意してください。呼び出さないと、サンドボックスのデプロイ時にエラーが発生します。

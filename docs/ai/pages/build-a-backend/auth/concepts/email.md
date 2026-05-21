---
title: "メール"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/email/"
---

デフォルトでは、Amplify Authは `email` をユーザーサインインのデフォルト方法としてスカフォールドされます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})
```

これにより、サインアップで必須であり、変更できない `email` 属性が設定されます。

## 次のステップ

- [`signIn` APIの使用方法を学ぶ](/[platform]/frontend/auth/sign-in/)
- [メールをカスタマイズする方法を学ぶ](/[platform]/build-a-backend/auth/customize-auth-lifecycle/email-customization/)
- [本番ワークロード向けに認証リソースを設定する方法を学ぶ](/[platform]/build-a-backend/auth/moving-to-production/)

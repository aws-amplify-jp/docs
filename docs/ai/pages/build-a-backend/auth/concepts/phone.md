---
title: "電話番号"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/phone/"
---

デフォルトでは、Amplify Authは`email`をユーザーサインインのデフォルト方法としてスカフォールドされていますが、ユーザーが電話番号を使用してサインインできるように変更または拡張することができます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    // highlight-next-line
    phone: true,
  },
})
```

これにより、サインアップに必要で変更できない`phone_number`属性が設定されます。

## 次のステップ

- [`signIn` APIの使用方法を学ぶ](/[platform]/frontend/auth/sign-in/)
- [本番環境のSMSワークロード用にアカウントを設定する方法を学ぶ](/[platform]/build-a-backend/auth/moving-to-production/)

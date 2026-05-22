---
title: "ユーザー属性の検証"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-04-30T20:16:55.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/"
---

`defineAuth` と `defineFunction` を使用して、[Cognito プリサインアップ Lambda トリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html)を作成し、サインアップの動作を拡張して属性値を検証できます。

まず、新しいディレクトリとリソースファイル `amplify/auth/pre-sign-up/resource.ts` を作成します。次に、`defineFunction` でこの関数を定義します：

```ts title="amplify/auth/pre-sign-up/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: "pre-sign-up",
  resourceGroupName: 'auth'
});
```

次に、対応するハンドラーファイル `amplify/auth/pre-sign-up/handler.ts` を次の内容で作成します：

```ts title="amplify/auth/pre-sign-up/handler.ts"
import type { PreSignUpTriggerHandler } from "aws-lambda"

function isOlderThan(date: Date, age: number) {
  const comparison = new Date()
  comparison.setFullYear(comparison.getFullYear() - age)
  return date.getTime() <= comparison.getTime()
}

export const handler: PreSignUpTriggerHandler = async (event) => {
  const birthdate = new Date(event.request.userAttributes["birthdate"])

  // you must be 13 years or older
  if (!isOlderThan(birthdate, 13)) {
    throw new Error("You must be 13 years or older to use this site")
  }

  return event
}
```

最後に、新しく作成した関数リソースを認証リソースに設定します：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';
import { preSignUp } from './pre-sign-up/resource';

export const auth = defineAuth({
  // ...
  triggers: {
    preSignUp
  }
});
```

変更をデプロイすると、ユーザーがサインアップを試行するたびに、このハンドラーは送信者の年齢が 13 歳以上であることを確認します。

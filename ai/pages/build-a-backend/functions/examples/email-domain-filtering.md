---
title: "メールドメインフィルタリング"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-04-24T15:59:23.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/"
---

`defineAuth` と `defineFunction` を使用して、ユーザーのメールアドレスに基づいてフィルタリングを実行する [Cognito pre sign-up Lambda トリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html) を作成できます。これにより、メールアドレスに基づいてユーザーサインアップを許可または拒否できます。

開始するには、ハンドラー型を定義するために使用される `aws-lambda` パッケージをインストールします。

```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @types/aws-lambda
```

次に、新しいディレクトリとリソースファイル `amplify/auth/pre-sign-up/resource.ts` を作成します。次に、`defineFunction` で Function を定義します。

```ts title="amplify/auth/pre-sign-up/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-sign-up',
  // optionally define an environment variable for your filter
  environment: {
    ALLOW_DOMAIN: 'amazon.com'
  }
});
```

次に、対応するハンドラーファイル `amplify/auth/pre-sign-up/handler.ts` を以下の内容で作成します。

```ts title="amplify/auth/pre-sign-up/handler.ts"
import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { env } from '$amplify/env/pre-sign-up';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes['email'];

  if (!email.endsWith(env.ALLOW_DOMAIN)) {
    throw new Error('Invalid email domain');
  }

  return event;
};
```

最後に、新しく作成した Function リソースを auth リソースに設定します。

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

変更をデプロイした後、`amazon.com` メールアドレスを持たずにサインアップしようとするユーザーはエラーを受け取ります。

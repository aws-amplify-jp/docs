---
title: "ユーザーをグループに追加"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-09T21:42:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/"
---

`defineAuth` と `defineFunction` を使用して、[Cognito post confirmation Lambda トリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html)を作成し、ユーザーが確認されたときに何らかのアクションを実行する動作を拡張できます。

> **Info:** ユーザーが「確認」されるのは、アカウントを検証するときです。通常、これはユーザーが確認メールを介してメールを確認するときに発生します。Post confirmation ハンドラーは、フェデレーテッドサインイン（つまり、ソーシャルサインイン）ではトリガーされません。

開始するには、AWS SDK v3 パッケージをインストールします。これは auth リソースに対してアクションを実行するために使用され、`@types/aws-lambda` パッケージはハンドラータイプを定義するために使用されます：

```bash title="Terminal"
npm add --save-dev @aws-sdk/client-cognito-identity-provider @types/aws-lambda
```

次に、新しいディレクトリとリソースファイル `amplify/auth/post-confirmation/resource.ts` を作成します。次に、`defineFunction` で Function を定義します：

```ts title="amplify/auth/post-confirmation/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  // optionally define an environment variable for your group name
  environment: {
    GROUP_NAME: 'EVERYONE'
  },
  resourceGroupName: 'auth'
});
```

Function 定義を作成した後、以下を実行する必要があります：

1. `EVERYONE` グループを作成
2. auth リソースへのアクセスを許可して、`addUserToGroup` アクションを実行できるようにする
3. Function を post confirmation トリガーとして設定

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["EVERYONE"],
  triggers: {
    postConfirmation,
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
  ],
})
```

次に、Function に対応するハンドラーファイル `amplify/auth/post-confirmation/handler.ts` を以下の内容で作成します：

```ts title="amplify/auth/post-confirmation/handler.ts"
import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const command = new AdminAddUserToGroupCommand({
    GroupName: env.GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const response = await client.send(command);
  console.log('processed', response.$metadata.requestId);
  return event;
};
```

変更をデプロイした後、ユーザーがサインアップしてアカウントを確認するたびに、「EVERYONE」という名前のグループに自動的に追加されます。

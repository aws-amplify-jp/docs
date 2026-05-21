---
title: "ユーザー名"
section: "build-a-backend/auth/concepts"
platforms: ["angular", "javascript", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-05-01T21:54:24.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/usernames/"
---

Amplify Authはユーザー名とパスワードのみでのサインインをサポートしていませんが、表示目的でユーザー名を有効にするように設定できます。Amazon Cognitoはログインメカニズムをプロビジョニングするための2つの方法を提供しています：

1. **ユーザー名属性**
2. **エイリアス属性**

それぞれについては、[Cognitoユーザープール設定に関するAWSドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases)に詳しく説明されていますが、高いレベルでは次のように説明できます：

- **ユーザー名属性**を使用すると、どの属性を「ユーザー名」として使用できるかをカスタマイズしたり、ユーザーがユーザー名の代わりにメールアドレスまたは電話番号でサインインできるようにできます
- **エイリアス属性**を使用すると、ユーザー名に「加えて」サインインで使用できる属性を指定できます

Amazon Cognitoでは、ユーザー名は不変です。つまり、初回サインアップ後、ユーザーは後でユーザー名を変更することができません。一部のアプリケーションではこれが望ましくない場合があり、エイリアス属性の使用を検討する動機となります。エイリアス属性を使用すると、不変のユーザー名に加えて、変更可能な「優先ユーザー名」を定義できます。

Amplify Authは**ユーザー名属性**を活用して、Cognitoを設定し、メールアドレスまたは電話番号を「ユーザー名」として受け入れるようにします。その後、ユーザーは指定されたメールアドレスまたは電話番号の所有権を確認して、アカウントを確認する必要があります。

ただし、表示目的で「ユーザー名」を考慮するのが一般的です。たとえば、「優先ユーザー名」を表示名として使用するように認証リソースを設定できます：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // highlight-start
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false
    }
  }
  // highlight-end
});
```

これはユーザーがサインインできるユーザー名ではありませんが、公開表示時にメールアドレスや電話番号などの個人情報をマスクするために使用できます。

デフォルトの動作をオーバーライドして、ユーザーが不変のユーザー名でサインアップできるようにしたい場合は、CDKを使用して認証リソースの[`usernameAttributes`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.CfnUserPool.html#usernameattributes-1)設定を直接変更できます：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"
import { auth } from "./auth/resource"
import { data } from "./data/resource"

const backend = defineBackend({
  auth,
  data,
})

const { cfnUserPool } = backend.auth.resources.cfnResources
// an empty array denotes "email" and "phone_number" cannot be used as a username
cfnUserPool.usernameAttributes = []
```

## 次のステップ

- [メールサインアップの設定方法を学ぶ](/[platform]/build-a-backend/auth/concepts/email/)
- [電話サインアップの設定方法を学ぶ](/[platform]/build-a-backend/auth/concepts/phone/)

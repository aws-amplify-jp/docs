---
title: "管理アクションを使用"
section: "build-a-backend/auth/manage-users"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-02T01:41:16.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/manage-users/with-admin-actions/"
---

Amplify Authは、[AWS SDKの`@aws-sdk/client-cognito-identity-provider`パッケージ](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/)を使用して管理できます。このパッケージはサーバー側で使用することを目的としており、Functionの中で使用できます。この例では`addUserToGroup`アクションに焦点を当て、[カスタムミューテーション](/[platform]/build-a-backend/data/custom-business-logic/#step-1---define-a-custom-query-or-mutation)として定義されます。

開始するには、ミューテーションを認可するために使用する「ADMINS」グループを作成します。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // highlight-next-line
  groups: ["ADMINS"]
})
```

次に、Functionリソースを作成します。

```ts title="amplify/data/add-user-to-group/resource.ts"
import { defineFunction } from "@aws-amplify/backend"

export const addUserToGroup = defineFunction({
  name: "add-user-to-group",
})
```

次に、authリソースで、関数が`addUserToGroup`アクションを実行するアクセス権を付与します。[authリソースへのアクセス権の付与について詳しく学びます](/[platform]/build-a-backend/auth/grant-access-to-auth-resources)。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"
// highlight-next-line
import { addUserToGroup } from "../data/add-user-to-group/resource"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMINS"],
  // highlight-start
  access: (allow) => [
    allow.resource(addUserToGroup).to(["addUserToGroup"])
  ],
  // highlight-end
})
```

これでカスタムミューテーションを定義する準備ができました。ここでは、新しく作成した`addUserToGroup`関数リソースを使用して`addUserToGroup`ミューテーションを処理します。このミューテーションは「ADMINS」グループのユーザーのみが呼び出すことができます。

```ts title="amplify/data/resource.ts"
import type { ClientSchema } from "@aws-amplify/backend"
import { a, defineData } from "@aws-amplify/backend"
import { addUserToGroup } from "./resource"

const schema = a.schema({
  addUserToGroup: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json())
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
})
```

最後に、エクスポートされたクライアントスキーマを使用してハンドラー関数をタイプ指定し、生成された`env`を使用してインタラクトするユーザープールIDを指定する関数のハンドラーを作成します。

```ts title="amplify/data/add-user-to-group/handler.ts"
import type { Schema } from "../resource"
import { env } from "$amplify/env/add-user-to-group"
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider"

type Handler = Schema["addUserToGroup"]["functionHandler"]
const client = new CognitoIdentityProviderClient()

export const handler: Handler = async (event) => {
  const { userId, groupName } = event.arguments
  const command = new AdminAddUserToGroupCommand({
    Username: userId,
    GroupName: groupName,
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  })
  const response = await client.send(command)
  return response
}
```

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
フロントエンドでは、生成されたクライアントを使用してグループ名とユーザーのIDを使用するミューテーションを呼び出します。

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts title="src/client.ts"
import type { Schema } from "../amplify/data/resource"
import { generateClient } from "aws-amplify/data"

const client = generateClient<Schema>()

await client.mutations.addUserToGroup({
  groupName: "ADMINS",
  userId: "5468d468-4061-70ed-8870-45c766d26225",
})
```
<!-- /Platform -->
<!-- Platform: flutter -->

<!-- /Platform -->
<!-- Platform: android -->

<!-- /Platform -->
<!-- Platform: swift -->

<!-- /Platform -->
<!-- /Platform -->

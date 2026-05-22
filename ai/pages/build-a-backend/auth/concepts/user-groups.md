---
title: "ユーザーグループ"
section: "build-a-backend/auth/concepts"
platforms: ["angular", "javascript", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-05-03T17:21:51.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-groups/"
---

Amplify Authは、ユーザーをグループ化するメカニズムを提供します。ユーザーをグループに割り当てることで、ユーザーのコレクションのアクセスをカスタマイズしたり、監査目的で活用したりできます。たとえば、「ADMINS」ユーザーだけが掲示板から投稿を削除することが許可されているか、「EDITORS」だけが「draft」状態の投稿を変更することが許可されています。グループの使い始めるには、`groups`プロパティを設定してください:

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // highlight-start
  groups: ["ADMINS", "EDITORS"],
  // highlight-end
})
```

<Callout>

**注意:** グループにはいくつかの[制限](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html#user-pool-user-groups-limitations)があります。ユーザープールあたり10,000グループの上限が含まれます。

</Callout>

## アクセスの定義

Amplifyリソースにより、一般的な言語を使用してグループのアクセスを定義できます。たとえば、データで`allow.groups`を使用できます:

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend"

const schema = a.schema({
  Article: a.model({}).authorization(allow => [
    allow.groups(["EDITORS"]).to(["read", "update"])
  ])
})

// ...
```

またはストレージ:

```ts title="amplify/storage/articles/resource.ts"
import { defineStorage } from "@aws-amplify/backend"

export const storage = defineStorage({
  name: "articles",
  access: (allow) => ({
    "drafts/*": [allow.groups(["EDITORS"]).to(["read", "write"])],
  }),
})
```

グループでアクセスを定義することで、Amplifyは現在のユーザーのグループから読み取るための認可ルールを設定します。ユーザープールグループは、ユーザーのIDトークンおよびアクセストークンのクレームとして`cognito:groups`として使用可能です。アクセストークンを使用してセキュアなリソースへのリクエストを実行でき、このクレームに対して検証され、リソースのアクションを許可します。

## グループロール

各Cognitoユーザープールグループには、[IAMロール](https://aws.amazon.com/iam/features/manage-roles/)が割り当てられています。IAMロールは、他のAWSリソースへのアクセスを拡張するように変更できます。ロールは、グループの`role`プロパティのバックエンドからアクセスできます:

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

// highlight-start
const { groups } = backend.auth.resources

// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
groups["ADMINS"].role
// highlight-end
```

## 次のステップ

- [アカウント確認時にユーザーをグループに自動的に追加する方法を学習します](/[platform]/build-a-backend/functions/examples/add-user-to-group/)
- [グループを使用してデータモデルへのアクセスをセキュアにする方法を学習します](/[platform]/build-a-backend/data/customize-authz/user-group-based-data-access)
- [グループを使用してストレージオブジェクトへのアクセスをセキュアにする方法を学習します](/[platform]/build-a-backend/storage/set-up-storage/)

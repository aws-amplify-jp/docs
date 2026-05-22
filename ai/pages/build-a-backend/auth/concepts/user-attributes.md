---
title: "ユーザー属性"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-attributes/"
---

Amplify Auth はユーザー プロフィール情報をユーザー属性に保存します。サインインのデフォルト方法を使用すると、Amplify Auth は自動的にサインインに必要な `email` または `phoneNumber` 属性を構成します。

ユーザー プロフィールを認証リソースの `loginWith` プロパティで指定されたデフォルトの `email` または `phoneNumber` 属性を超えて拡張するには、`userAttributes` プロパティで属性を構成できます:

> **Warning:** **警告**: 認証リソースを作成した後、属性を必須と不要の間で切り替えることはできません。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    // this configures a required "email" attribute
    email: true,
  },
  // highlight-start
  userAttributes: {
    // specify a "birthdate" attribute
    birthdate: {
      mutable: true,
      required: false,
    }
  },
  // highlight-end
})
```

## 標準属性

ユーザー属性は [Cognito 標準属性](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes) として定義されます。属性は値が _mutable_ であるかどうかに加えて、ユーザー サインアップに _required_ になるように構成できます。リソースを `email` でログインするようにユーザーに許可するように構成する場合、ユーザー サインアップ時にメールを指定する必要があり、後で変更することはできません。ただし、追加の属性はオプションで、サインアップ後に変更可能なように構成できます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // Maps to Cognito standard attribute 'address'
    address: {
      mutable: true,
      required: true,
    },
    // Maps to Cognito standard attribute 'birthdate'
    birthdate: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'email'
    email: {
      mutable: true,
      required: true,
    },
    // Maps to Cognito standard attribute 'family_name'
    familyName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'gender'
    gender: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'given_name'
    givenName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'locale'
    locale: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'middle_name'
    middleName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'name'
    fullname: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'nickname'
    nickname: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'phone_number'
    phoneNumber: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'picture'
    profilePicture: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'preferred_username'
    preferredUsername: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'profile'
    profilePage: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'zoneinfo'
    timezone: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'updated_at'
    lastUpdateTime: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'website'
    website: {
      mutable: true,
      required: false,
    },
  },
});
```

## カスタム属性

提供される標準属性に加えて、[カスタム属性](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-custom-attributes) を構成できます。これらは、テナント ID やユーザーの表示名など、ユースケースに固有の属性です。カスタム属性は `custom:` プレフィックスで識別されます:

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    // this configures a required "email" attribute
    email: true,
  },
  userAttributes: {
    // highlight-start
    "custom:display_name": {
      dataType: "String",
      mutable: true,
      maxLen: 16,
      minLen: 1,
    },
    "custom:favorite_number": {
      dataType: "Number",
      mutable: true,
      min: 1,
      max: 100,
    },
    "custom:is_beta_user": {
      dataType: "Boolean",
      mutable: true,
    },
    "custom:started_free_trial": {
      dataType: "DateTime",
      mutable: true,
    },
    // highlight-end
  },
})
```

標準属性とは異なり、カスタム属性はサインアップに必須にすることはできませんが、[pre sign-up トリガーを使用してサインアップ時にユーザー属性を検証することで](/[platform]/build-a-backend/functions/examples/user-attribute-validation/) 何らかの値を必須にするようにコード化できます。

カスタム属性は特定のデータ型で構成することもできます。以下のデータ型がサポートされています:

- `String`
- `Number`
- `Boolean`
- `DateTime`

上記のスニペットに示されているように、`String` と `Number` には最小値と最大値の制約を割り当てることができます。これは簡単な検証を基盤となるサービスに委譲するのに役立ちますが、正規表現に照合するなどの複雑な検証には及びません。

## 次のステップ

- [属性がトークンにどのようにサーフェスされるかについて学ぶ](/[platform]/build-a-backend/auth/concepts/tokens-and-credentials/)
- [ユーザー属性を管理する方法を学ぶ](/[platform]/frontend/auth/manage-user-attributes/)

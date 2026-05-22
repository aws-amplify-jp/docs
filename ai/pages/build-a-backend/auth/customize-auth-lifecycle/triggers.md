---
title: "トリガー"
section: "build-a-backend/auth/customize-auth-lifecycle"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-03T17:21:51.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/customize-auth-lifecycle/triggers/"
---

Amplify Auth の動作はトリガーを使用してカスタマイズできます。トリガーは Function として定義され、認証フロー中に実行するロジックをスロットインするためのメカニズムです。たとえば、トリガーを使用して[メールに許可リストされたドメインが含まれているかどうかを検証](/[platform]/build-a-backend/functions/examples/email-domain-filtering)したり、[確認時にユーザーをグループに追加](/[platform]/build-a-backend/functions/examples/add-user-to-group)したり、[アカウント確認時に「UserProfile」モデルを作成](/[platform]/build-a-backend/functions/examples/create-user-profile-record)したりできます。

トリガーは [Cognito ユーザープール Lambda トリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)に変換されます。

> Lambda トリガーがユーザープールに割り当てられている場合、Amazon Cognito はデフォルトフローを中断して、関数から情報をリクエストします。Amazon Cognito は JSON イベントを生成し、関数に渡します。イベントには、ユーザーアカウントの作成、サインイン、パスワードリセット、または属性の更新に関する要求に関する情報が含まれます。その後、関数はアクションを実行するか、イベントを変更せずに返送できます。

開始するには、関数を定義し、認証リソースで `triggers` プロパティを指定します。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // highlight-next-line
  triggers: {}
})
```

トリガーのユースケースについて詳しく知るには、[Functions の例](/[platform]/build-a-backend/functions/examples/)にアクセスしてください。

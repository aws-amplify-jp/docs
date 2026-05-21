---
title: "カスタムメッセージ"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-04-09T18:10:02.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/"
---

`defineAuth` と `defineFunction` を使用して、カスタムメールまたは電話認証メッセージ、または多要素認証 (MFA) コードを送信する [Amazon Cognito カスタムメッセージ AWS Lambda トリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html) を作成できます。

まず、ハンドラーのタイプを定義するために使用される `@types/aws-lambda` パッケージをインストールします:

```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @types/aws-lambda
```

次に、新しいディレクトリとリソースファイル `amplify/auth/custom-message/resource.ts` を作成します。次に、`defineFunction` を使用して関数を定義します:

```ts title="amplify/auth/custom-message/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const customMessage = defineFunction({
  name: "custom-message",
  resourceGroupName: 'auth'
});
```

次に、対応するハンドラーファイル `amplify/auth/custom-message/handler.ts` を以下の内容で作成します:

<Callout>
`CustomMessage_AdminCreateUser` トリガーソースの入力イベントには、ユーザー名と確認コードの両方が含まれます。管理者が作成したユーザーがサインインするには、ユーザー名とコードの両方を受け取る必要があるため、メッセージテンプレートに `usernameParameter` と `codeParameter` の両方を含める必要があります。
</Callout>

```ts title="amplify/auth/custom-message/handler.ts" 
import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const locale = event.request.userAttributes["locale"];
    if (locale === "en") {
      event.response.emailMessage = `Your new one-time code is ${event.request.codeParameter}`;
      event.response.emailSubject = "Reset my password";
    } else if (locale === "es") {
      event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
      event.response.emailSubject = "Restablecer mi contraseña";
    }
  }

  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    event.response.emailMessage = `Your username is ${event.request.usernameParameter} and your temporary password is ${event.request.codeParameter}`;
    event.response.emailSubject = 'Welcome to Example App';
  }

  return event;
};
```
 

最後に、新しく作成した関数リソースを auth リソースに設定します:

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';
import { customMessage } from "./custom-message/resource";

export const auth = defineAuth({
  // ...
  triggers: {
    customMessage,
  }
});
```

変更をデプロイした後、ユーザー属性 `locale` が `es` に設定されているユーザーがパスワードをリセットしようとするたびに、スペイン語のワンタイムコード付きのメールが届きます。

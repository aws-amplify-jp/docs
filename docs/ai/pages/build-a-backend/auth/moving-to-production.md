---
title: "本番環境への移行"
section: "build-a-backend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-10T22:55:38.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/moving-to-production/"
---

Amplify Auth は、メールおよび SMS メッセージ送信の機能が限定されている [Amazon Cognito](https://aws.amazon.com/cognito/) リソースをプロビジョニングします。デフォルト状態では、本番環境ワークロードを処理することは想定されていませんが、アプリケーションおよび関連するビジネスロジックの開発には十分です。

## メール

Cognito は [デフォルトメール機能](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html#user-pool-email-default) を提供し、1 日に送信できるメール数を制限しています。本番環境ワークロードを検討する場合、Cognito は [Amazon Simple Email Service (Amazon SES)](https://aws.amazon.com/ses/) を使用してメールを送信するように設定できます。

> **Warning:** すべての新しい AWS アカウントは、Amazon SES で「サンドボックス」ステータスがデフォルトです。これは主に、**確認済み**メールアドレスとドメインにのみメールを送信できることを意味します。

本番環境で Amazon SES を開始するには、まず [本番環境アクセスをリクエスト](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) する必要があります。リクエストを送信すると、送信内容は変更できませんが、AWS から 24 時間以内に応答を受け取ります。

本番環境アクセス用にアカウントを設定し、_送信者_メールアドレスを確認したら、確認済み送信者を使用してメールを送信するように Cognito ユーザープールを設定できます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      // configure using the email registered and verified in Amazon SES
      fromEmail: "registrations@example.com",
    },
  },
})
```

これで、新しいユーザーサインアップ、パスワードリセットなどでメールが送信されると、送信アカウントが確認済みメールになります。さらにカスタマイズするには、送信者の表示名を変更したり、オプションでユーザーが返信するためのカスタムアドレスを適用したりできます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: "registrations@example.com",
      // highlight-start
      fromName: "MyApp",
      replyTo: "inquiries@example.com"
      // highlight-end
    },
  },
})
```

## SMS

SMS 認証コードを送信するには、[発信元番号をリクエスト](https://docs.aws.amazon.com/pinpoint/latest/userguide/settings-request-number.html) する必要があります。認証コードは発信元番号から送信されます。AWS アカウントが SMS サンドボックスにある場合、宛先電話番号も追加する必要があります。これは [Amazon Pinpoint コンソール](https://console.aws.amazon.com/pinpoint/) に移動し、ナビゲーションペインで SMS と音声を選択して、「宛先電話番号」タブで電話番号を追加することで実行できます。AWS アカウントが SMS サンドボックスにあるかどうかを確認するには、[SNS コンソール](https://console.aws.amazon.com/sns/) に移動し、ナビゲーションペインから「テキストメッセージング (SMS)」タブを選択し、「アカウント情報」セクションでステータスを確認します。

---
title: "カスタム認証チャレンジ"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-09T21:42:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/"
---

Secure Remote Password (SRP) は、パスワードをネットワーク経由で送信せずにパスワードベースの認証を可能にする暗号化プロトコルです。Amazon Cognito カスタム認証フローでは、`CUSTOM_WITH_SRP` は強化されたセキュリティのために SRP ステップを組み込みますが、`CUSTOM_WITHOUT_SRP` はこれらをバイパスしてシンプルなプロセスを実現します。選択は、アプリケーションのセキュリティニーズとパフォーマンス要件によって異なります。
このガイドでは、AWS Amplify と Lambda トリガーを使用して両方のタイプのカスタム認証フローを実装する方法を示します。

`defineAuth` と `defineFunction` を使用して、`CUSTOM_WITH_SRP` と `CUSTOM_WITHOUT_SRP` を使用する認証エクスペリエンスを作成できます。これは [Amazon Cognito のカスタム認証チャレンジ定義機能](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#Custom-authentication-flow-and-challenges) と 3 つのトリガーを活用することで実現できます。

1. [認証チャレンジの作成](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html)
2. [認証チャレンジの定義](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html)
3. [認証チャレンジレスポンスの検証](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html)

開始するには、ハンドラー型を定義するために使用される `aws-lambda` パッケージをインストールします。

```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @types/aws-lambda
```

## 認証チャレンジ作成トリガー

まず、3 つのトリガーの最初の `create-auth-challenge` を作成します。これは、パスワードが検証された後に reCAPTCHA チャレンジを作成する責務を持つトリガーです。

```ts title="amplify/auth/create-auth-challenge/resource.ts"
import { defineFunction } from "@aws-amplify/backend"

export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、次の内容でハンドラーを作成します。

```ts title="amplify/auth/create-auth-challenge/handler.ts"
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    // Generate a random code for the custom challenge
    const challengeCode = "123456";

    event.response.challengeMetadata = "TOKEN_CHECK";

    event.response.publicChallengeParameters = {
      trigger: "true",
      code: challengeCode,
    };

    event.response.privateChallengeParameters = { trigger: "true" };
    event.response.privateChallengeParameters.answer = challengeCode;
  }
  return event;
};
```

## 認証チャレンジ定義トリガー

次に、認証チャレンジフローを _定義_ する責務を持つトリガー `define-auth-challenge` を作成します。

```ts title="amplify/auth/define-auth-challenge/resource.ts"
import { defineFunction } from "@aws-amplify/backend"

export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、`CUSTOM_WITHOUT_SRP` を使用している場合は次の内容でハンドラーを作成します。

```ts title="amplify/auth/define-auth-challenge/handler.ts"
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // Check if this is the first authentication attempt
  if (event.request.session.length === 0) {
    // For the first attempt, we start with the custom challenge
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === "CUSTOM_CHALLENGE" &&
    event.request.session[0].challengeResult === true
  ) {
    // If this is the second attempt (session length 1),
    // it was a CUSTOM_CHALLENGE, and the result was successful
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // If we reach here, it means either:
    // 1. The custom challenge failed
    // 2. We've gone through more attempts than expected
    // In either case, we fail the authentication
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};
```

または `CUSTOM_WITH_SRP` を使用している場合は：

```ts title="amplify/auth/define-auth-challenge/handler.ts"
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // First attempt: Start with SRP_A (Secure Remote Password protocol, step A)
  if (event.request.session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "SRP_A";
  } else if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === "SRP_A" &&
    event.request.session[0].challengeResult === true
  ) {
    // Second attempt: SRP_A was successful, move to PASSWORD_VERIFIER
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "PASSWORD_VERIFIER";
  } else if (
    event.request.session.length === 2 &&
    event.request.session[1].challengeName === "PASSWORD_VERIFIER" &&
    event.request.session[1].challengeResult === true
  ) {
    // Third attempt: PASSWORD_VERIFIER was successful, move to CUSTOM_CHALLENGE
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
    event.request.session.length === 3 &&
    event.request.session[2].challengeName === "CUSTOM_CHALLENGE" &&
    event.request.session[2].challengeResult === true
  ) {
    // Fourth attempt: CUSTOM_CHALLENGE was successful, authentication complete
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // If we reach here, it means one of the challenges failed or
    // we've gone through more attempts than expected
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};
```

## 認証チャレンジレスポンス検証トリガー

最後に、チャレンジレスポンスの _検証_ を担当するトリガーを作成します。この例の目的のために、検証チェックは常に true を返します。

```ts title="amplify/auth/verify-auth-challenge-response/resource.ts"
import { defineFunction, secret } from "@aws-amplify/backend"

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、次の内容でハンドラーを作成します。

```ts title="amplify/auth/verify-auth-challenge-response/handler.ts"
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda"

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event
) => {
  event.response.answerCorrect = true;
  return event;
};

```

## 認証リソースの設定

最後に、3 つのトリガーをインポートして認証リソースに設定します。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"
import { createAuthChallenge } from "./create-auth-challenge/resource"
import { defineAuthChallenge } from "./define-auth-challenge/resource"
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    createAuthChallenge,
    defineAuthChallenge,
    verifyAuthChallengeResponse,
  },
})
```

変更をデプロイした後、ユーザーが `CUSTOM_WITH_SRP` または `CUSTOM_WITHOUT_SRP` でサインインを試みるたびに、Lambda チャレンジがトリガーされます。

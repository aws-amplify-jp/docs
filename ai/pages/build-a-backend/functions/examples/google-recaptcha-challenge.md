---
title: "Google reCAPTCHA チャレンジ"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-09T21:42:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/"
---

`defineAuth` と `defineFunction` を使用して、[reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) トークンを必要とする認証エクスペリエンスを作成できます。これは、[Amazon Cognito のカスタム認証チャレンジを定義する機能](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#Custom-authentication-flow-and-challenges)と 3 つのトリガーを活用することで実現できます:

1. [認証チャレンジを作成](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html)
2. [認証チャレンジを定義](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html)
3. [認証チャレンジ応答を検証](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html)

## 認証チャレンジを作成するトリガー

まず、3 つのトリガーの最初の 1 つである `create-auth-challenge` を作成します。このトリガーは、パスワード検証後に reCAPTCHA チャレンジを作成する役割を担います。

```ts title="amplify/auth/create-auth-challenge/resource.ts"
import { defineFunction } from "@aws-amplify/backend"

export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、以下の内容でハンドラーを作成します:

```ts title="amplify/auth/create-auth-challenge/handler.ts"
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const { request, response } = event

  if (
    // session will contain 3 "steps": SRP, password verification, custom challenge
    request.session.length === 2 &&
    request.challengeName === "CUSTOM_CHALLENGE"
  ) {
    response.publicChallengeParameters = { trigger: "true" }
    response.privateChallengeParameters = { answer: "" }
    // optionally set challenge metadata
    response.challengeMetadata = "CAPTCHA_CHALLENGE"
  }

  return event
}
```

## 認証チャレンジを定義するトリガー

次に、認証チャレンジフローを「定義」するトリガーである `define-auth-challenge` を作成します。

```ts title="amplify/auth/define-auth-challenge/resource.ts"
import { defineFunction } from "@aws-amplify/backend"

export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、以下の内容でハンドラーを作成します:

```ts title="amplify/auth/define-auth-challenge/handler.ts"
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  const { response } = event
  const [srp, password, captcha] = event.request.session

  // deny by default
  response.issueTokens = false
  response.failAuthentication = true

  if (srp?.challengeName === "SRP_A") {
    response.failAuthentication = false
    response.challengeName = "PASSWORD_VERIFIER"
  }

  if (
    password?.challengeName === "PASSWORD_VERIFIER" &&
    password.challengeResult === true
  ) {
    response.failAuthentication = false
    response.challengeName = "CUSTOM_CHALLENGE"
  }

  if (
    captcha?.challengeName === "CUSTOM_CHALLENGE" &&
    // check for the challenge metadata set in "create-auth-challenge"
    captcha?.challengeMetadata === "CAPTCHA_CHALLENGE" &&
    captcha.challengeResult === true
  ) {
    response.issueTokens = true
    response.failAuthentication = false
  }

  return event
}
```

## 認証チャレンジ応答を検証するトリガー

最後に、チャレンジ応答を「検証」するトリガーを作成します。この場合は reCAPTCHA トークン検証です。

> **Info:** まだ行っていない場合は、アプリケーションを登録して reCAPTCHA シークレットキーを取得する必要があります。その後、以下を使用してクラウドサンドボックスで使用するよう設定できます:
> 
> ```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox secret set GOOGLE_RECAPTCHA_SECRET_KEY
```

```ts title="amplify/auth/verify-auth-challenge-response/resource.ts"
import { defineFunction, secret } from "@aws-amplify/backend"

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  environment: {
    GOOGLE_RECAPTCHA_SECRET_KEY: secret("GOOGLE_RECAPTCHA_SECRET_KEY"),
  },
  resourceGroupName: 'auth'
})
```

リソースファイルを作成した後、以下の内容でハンドラーを作成します:

```ts title="amplify/auth/verify-auth-challenge-response/handler.ts"
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda"
import { env } from "$amplify/env/verify-auth-challenge-response"

/**
 * Google ReCAPTCHA verification response
 * @see https://developers.google.com/recaptcha/docs/v3#site_verify_response
 */
type GoogleRecaptchaVerifyResponse = {
  // whether this request was a valid reCAPTCHA token for your site
  success: boolean
  // the score for this request (0.0 - 1.0)
  score: number
  // the action name for this request (important to verify)
  action: string
  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  challenge_ts: string
  // the hostname of the site where the reCAPTCHA was solved
  hostname: string
  // optional error codes
  "error-codes"?: unknown[]
}

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event
) => {
  if (!event.request.challengeAnswer) {
    throw new Error("Missing challenge answer")
  }

  // https://developers.google.com/recaptcha/docs/verify#api_request
  const url = new URL("https://www.google.com/recaptcha/api/siteverify")
  const params = new URLSearchParams({
    secret: env.GOOGLE_RECAPTCHA_SECRET_KEY,
    response: event.request.challengeAnswer,
  })
  url.search = params.toString()

  const request = new Request(url, {
    method: "POST",
  })

  const response = await fetch(request)
  const result = (await response.json()) as GoogleRecaptchaVerifyResponse

  if (!result.success) {
    throw new Error("Verification failed", { cause: result["error-codes"] })
  }

  // indicate whether the answer is correct
  event.response.answerCorrect = result.success

  return event
}
```

## 認証リソースを設定する

最後に、3 つのトリガーを認証リソースにインポートして設定します:

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

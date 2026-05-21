---
title: "CDKでAmplifyが生成したCognitoリソースを変更する"
section: "build-a-backend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-12-03T11:13:25.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/modify-resources-with-cdk/"
---

Amplify Authは、基になるAmazon Cognitoリソース定義に対して合理的なデフォルト値を提供します。[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)を使用して直接リソースを変更することで、認証リソースをカスタマイズし、ユースケースに合わせて正確に動作するようにできます。

## Cognito UserPoolのパスワードポリシーをオーバーライドする

L1の`cfnUserPool`構造を使用して`addPropertyOverride`を追加することで、パスワードポリシーをオーバーライドできます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

const backend = defineBackend({
  auth,
});
// L1 CfnUserPoolリソースを抽出
const { cfnUserPool } = backend.auth.resources.cfnResources;
// cfnUserPoolポリシーを直接変更
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 10,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true,
    temporaryPasswordValidityDays: 20,
  },
};
```

<!-- Platform: android,angular, javascript, nextjs, react, react-native, swift, vue -->
## Cognito UserPoolをオーバーライドしてパスワードレスサインイン方法を有効にする

> **Info:** **推奨アプローチ:** パスワードレス認証は、CDKオーバーライドを必要とせずに`defineAuth`で直接設定できるようになりました。[パスワードレス認証の設定方法を学びます](/[platform]/build-a-backend/auth/concepts/passwordless/)。

高度なユースケースでは、CDKオーバーライドを使用して基になるCognitoユーザープールリソースを変更して、パスワードレス方法でのサインインを有効にできます。[パスワードレスサインイン方法の詳細を確認します](/[platform]/build-a-backend/auth/concepts/passwordless/)。

また、[Cognitoドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)でパスワードレス認証フローの実装方法の詳細を確認することもできます。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"
import { auth } from "./auth/resource"

const backend = defineBackend({
  auth,
})

const { cfnResources } = backend.auth.resources;
const { cfnUserPool, cfnUserPoolClient } = cfnResources;

// USER_AUTHで許可する認証要素を指定
cfnUserPool.addPropertyOverride(
	'Policies.SignInPolicy.AllowedFirstAuthFactors',
	['PASSWORD', 'WEB_AUTHN', 'EMAIL_OTP', 'SMS_OTP']
);

// USER_AUTHフローはパスワードレスサインインに使用
cfnUserPoolClient.explicitAuthFlows = [
	'ALLOW_REFRESH_TOKEN_AUTH',
	'ALLOW_USER_AUTH'
];

/* WebAuthnに必要 */
// WebAuthnRelyingPartyIDはrequesting party（例：「example.domain.com」）のドメイン
cfnUserPool.addPropertyOverride('WebAuthnRelyingPartyID', '<RELYING_PARTY>');
cfnUserPool.addPropertyOverride('WebAuthnUserVerification', 'preferred');
```
<!-- /Platform -->

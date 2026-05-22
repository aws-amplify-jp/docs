---
title: "Amplify HTTP API をセットアップする"
section: "build-a-backend/add-aws-services/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2025-04-01T19:33:08.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/rest-api/set-up-http-api/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

[AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) を使用して、Amplify Functions を [Amazon API Gateway で提供される HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) のルートのリゾルバーとして構成できます。

## Lambda Function を使用して HTTP API をセットアップする

まず、新しいディレクトリとリソースファイル `amplify/functions/api-function/resource.ts` を作成します。その後、`defineFunction` で関数を定義します：

```ts title="amplify/functions/api-function/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const myApiFunction = defineFunction({
  name: "api-function",
});
```

次に、対応するハンドラーファイル `amplify/functions/api-function/handler.ts` を以下の内容で作成します：

```ts title="amplify/functions/api-function/handler.ts"
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);
  return {
    statusCode: 200,
    // 以下の CORS 設定を特定の要件に合わせて修正してください
    headers: {
      "Access-Control-Allow-Origin": "*", // これを信頼できるドメインに制限してください
      "Access-Control-Allow-Headers": "*", // 許可する必要があるヘッダーのみを指定してください
    },
    body: JSON.stringify("Hello from api-function!"),
  };
};
```

次に、AWS CDK を使用して、バックエンドファイルに HTTP API を作成します：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import {
  HttpIamAuthorizer,
  HttpUserPoolAuthorizer,
} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { myApiFunction } from "./functions/api-function/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  myApiFunction,
});

// 新しい API スタックを作成する
const apiStack = backend.createStack("api-stack");

// IAM オーソライザーを作成する
const iamAuthorizer = new HttpIamAuthorizer();

// ユーザープール オーソライザーを作成する
const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  "userPoolAuth",
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient],
  }
);

// 新しい HTTP Lambda インテグレーションを作成する
const httpLambdaIntegration = new HttpLambdaIntegration(
  "LambdaIntegration",
  backend.myApiFunction.resources.lambda
);

// IAM をデフォルトオーソライザーとした新しい HTTP API を作成する
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    // 以下の CORS 設定を特定の要件に合わせて修正してください
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PUT,
      CorsHttpMethod.DELETE,
    ],
    // これを信頼できるドメインに制限してください
    allowOrigins: ["*"],
    // 許可する必要があるヘッダーのみを指定してください
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

// IAM オーソライザーとさまざまなメソッドを使用して API にルートを追加する
httpApi.addRoutes({
  path: "/items",
  methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE],
  integration: httpLambdaIntegration,
  authorizer: iamAuthorizer,
});

// API にプロキシリソースパスを追加する
httpApi.addRoutes({
  path: "/items/{proxy+}",
  methods: [HttpMethod.ANY],
  integration: httpLambdaIntegration,
  authorizer: iamAuthorizer,
});

// ルートに OPTIONS メソッドを追加する
httpApi.addRoutes({
  path: "/items/{proxy+}",
  methods: [HttpMethod.OPTIONS],
  integration: httpLambdaIntegration,
});

// ユーザープール オーソライザーを使用してルートを API に追加する
httpApi.addRoutes({
  path: "/cognito-auth-path",
  methods: [HttpMethod.GET],
  integration: httpLambdaIntegration,
  authorizer: userPoolAuthorizer,
});

// API への Invoke アクセスを許可する新しい IAM ポリシーを作成する
const apiPolicy = new Policy(apiStack, "ApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${httpApi.arnForExecuteApi("*", "/items")}`,
        `${httpApi.arnForExecuteApi("*", "/items/*")}`,
        `${httpApi.arnForExecuteApi("*", "/cognito-auth-path")}`,
      ],
    }),
  ],
});

// ポリシーを認証済みおよび未認証 IAM ロールにアタッチする
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

// 出力を設定ファイルに追加する
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});
```

## Amplify ライブラリをインストールする

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
任意のパッケージマネージャーを使用して Amplify JavaScript ライブラリをインストールしてください。例えば、`npm` の場合：

```bash title="Terminal" showLineNumbers={false}
npm add aws-amplify
```
<!-- /Platform -->

<!-- Platform: react-native -->
任意のパッケージマネージャーを使用して Amplify JavaScript ライブラリをインストールしてください。例えば、`npm` の場合：

<details><summary>React Native バージョン 0.72 以下の場合の手順</summary>

  `@aws-amplify/react-native` は、`react-native` バージョン 0.72 以下を使用している場合、最小 iOS デプロイメントターゲットが `13.0` である必要があります。_ios_ ディレクトリにある _Podfile_ を開き、`target` の値を更新してください：

  ```diff
   - platform :ios, min_ios_version_supported
   + platform :ios, 13.0
   ```

</details>

```bash title="Terminal" showLineNumbers={false}
npm add aws-amplify @aws-amplify/react-native
```
<!-- /Platform -->

## Amplify API を初期化する

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
Amplify API カテゴリを初期化するには、`Amplify.configure()` で Amplify を構成する必要があります。

アプリの設定ファイルをインポートして読み込みます。Amplify 設定ステップをアプリのルートエントリーポイント（例：`src/main.ts`）に追加することをお勧めします：

<!-- Platform: javascript, angular, react, vue, react-native -->
```ts title="src/main.ts"
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
  {
    ...amplifyConfig,
    API: {
      ...amplifyConfig.API,
      REST: outputs.custom.API,
    },
  },
  {
    API: {
      REST: {
        retryStrategy: {
          strategy: 'no-retry' // デフォルトの再試行戦略をオーバーライドします
        },
      }
    },
  }
);
```
<!-- /Platform -->

<!-- Platform: nextjs -->
```tsx title="pages/_app.tsx"
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '@/amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
  {
    ...amplifyConfig,
    API: {
      ...amplifyConfig.API,
      REST: outputs.custom.API,
    },
  },
  {
    API: {
      REST: {
        retryStrategy: {
          strategy: 'no-retry' // デフォルトの再試行戦略をオーバーライドします
        },
      }
    }
  }
);
```
<!-- /Platform -->

<Callout warning="true">

アプリケーションのライフサイクルの早期に `Amplify.configure` を呼び出してください。`Amplify.configure` が他の Amplify JavaScript API の前に呼び出されていない場合、設定が見つからないか、`NoCredentials` エラーが発生します。この問題の原因については、[ライブラリが構成されていない トラブルシューティングガイド](/[platform]/build-a-backend/troubleshooting/library-not-configured/)を参照してください。

</Callout>
<!-- /Platform -->

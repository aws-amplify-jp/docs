---
title: "認可ルールの定義"
section: "build-a-backend/add-aws-services/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2025-12-11T10:33:44.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/rest-api/customize-authz/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

REST エンドポイントの認可モードを決定する場合、いくつかのカスタマイズが可能です。

## IAM 認可

デフォルトでは、API は IAM 認可を使用し、リクエストは自動的に署名されます。IAM 認可には 2 つのモードがあります。**未認証**ロールを使用するモードと**認証済み**ロールを使用するモードです。ユーザーがサインインしていない場合、デフォルトで未認証ロールが使用されます。ユーザーがサインインすると、代わりに認証済みロールが使用されます。

パブリック REST API の場合、`defaultAuthMode` 属性を使用してデフォルトの動作を変更できます。これをリクエストごとに変更できます。

```javascript
await get({
  apiName: 'myApi', 
  path: '/public-endpoint',
  options: {
    defaultAuthMode: 'none' // このリクエストのデフォルト IAM 認証をスキップ
  }
});
````

または `libraryOptions` を通じてグローバルに変更できます。

```javascript
Amplify.configure({
  // ... その他の設定
}, {
  API: {
    REST: {
      defaultAuthMode: 'none' // すべての REST 呼び出しのデフォルトモード
    }
  }
});
```

## API キー

パブリック REST API を設定する場合、Amazon API Gateway で API キーを設定するか、[CDK コンストラクト](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.ApiKey.html)を使用して作成できます。その後、API 構成で API キーヘッダーを設定できます。これはすべてのリクエストに適用されます。

```ts
Amplify.configure(outputs, {
  API: {
    REST: {
      headers: async () => {
        return { 'X-Api-Key': apiKey };
      }
    }
  }
});
```

## Cognito ユーザープール認可

REST エンドポイントに対して認証するには、設定された Cognito ユーザープールからのアクセストークンを使用できます。JWT トークンは `Auth` カテゴリから取得できます。

```ts
import { fetchAuthSession } from 'aws-amplify/auth'

const session = await fetchAuthSession();
const token = session.tokens?.idToken
```

その後、API カテゴリの構成で Authorization ヘッダーを設定する必要があります。次の例は、すべてのリクエストの Authorization ヘッダーを設定する方法を示しています。

```ts
Amplify.configure(outputs, {
  API: {
    REST: {
      headers: async () => {
        return { Authorization: authToken };
      }
    }
  }
});
```

API Gateway をカスタム認可で設定する方法の詳細については、[こちら](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)を参照してください。

### アクセストークンまたは ID トークンの使用に関する注記

ID トークンには、認証されたユーザーの身元に関する要求（名前、メール、電話番号など）が含まれています。Amplify 認証カテゴリで、次を使用して ID トークンを取得できます。

```ts
const session = await fetchAuthSession();
const token = session.tokens?.idToken
```

アクセストークンには スコープとグループが含まれており、認可されたリソースへのアクセスを許可するために使用されます。[これはカスタムスコープを有効にするためのチュートリアルです](https://aws.amazon.com/premiumsupport/knowledge-center/cognito-custom-scopes-api-gateway/)。アクセストークンを取得するには以下を使用します。

```textSpanIntersectsWith
const session = await fetchAuthSession();
const token = session.tokens?.accessToken
```

## カスタム認可トークン

カスタム認可トークンを使用する場合、API カテゴリの構成でトークンを設定できます。カスタム認可トークンはすべてのリクエストに適用されます。

```ts
Amplify.configure(outputs, {
  API: {
    REST: {
      headers: async () => {
        return { Authorization: customAuthToken };
      }
    }
  }
});
```

## リクエストごとに認可ヘッダーを設定する

または、リクエストごとに認可ヘッダーを設定できます。たとえば、特定の REST リクエストに `Authorization` という名前のカスタムヘッダーを使用する場合、次の構成を設定できます。

```ts
async function updateItem() {
  await del({
    apiName: 'myRestApi',
    path: 'items/1',
    options: {
      headers: {
        Authorization: authToken
      }
    }
  }).response;
}
```

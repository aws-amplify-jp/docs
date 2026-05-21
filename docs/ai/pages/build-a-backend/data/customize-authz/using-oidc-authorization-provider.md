---
title: "OpenID Connectを認可プロバイダーとして使用する"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-06-19T16:13:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/"
---

プライベート、オーナー、およびグループ認可は、OpenID Connect（OIDC）認可モードで設定できます。認可ルールにプロバイダーとして`"oidc"`を追加します。`oidcAuthorizationMode`プロパティを使用して、*OpenID Connectプロバイダー名*、*OpenID Connectプロバイダードメイン*、*Client ID*、*Issued at TTL*、および*Auth Time TTL*を設定します。

以下の例は、`oidc`認可プロバイダーでサポートされている認可戦略を強調しています。オーナーおよびグループベースの認可の場合、[カスタム ID とグループクレームを指定](/[platform]/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim)する必要があります。

```ts title="amplify/data/resource.ts"
// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [
      allow.owner('oidc').identityClaim('user_id'),
      allow.authenticated('oidc'),
      allow
        .groups(['testGroupName'], 'oidc')
        .withClaimIn('user_groups'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'oidc',
    oidcAuthorizationMode: {
      oidcProviderName: 'oidc-provider-name',
      oidcIssuerUrl: 'https://example.com',
      clientId: 'client-id',
      tokenExpiryFromAuthInSeconds: 300,
      tokenExpireFromIssueInSeconds: 600,
    },
  },
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, swift -->
アプリケーションでは、`client.models.<model-name>`を使用して`oidc`認可モードを指定し、モデルに対してCRUD操作を実行できます。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: todos } = await client.models.Todo.list({
  // highlight-start
  authMode: "oidc",
  // highlight-end
});
```
<!-- /Platform -->

<!-- Platform: flutter -->
アプリケーションでは、`oidc`認可モードを使用してモデルに対してCRUD操作を実行できます。

```dart
try {
  final todo = Todo(content: 'My new todo');
  final request = ModelMutations.create(
    todo,  
    authorizationMode: APIAuthorizationType.oidc,
  );
  final createdTodo = await Amplify.API.mutations(request: request).response;

  if (createdTodo == null) {
    safePrint('errors: ${response.errors}');
    return;
  }
  safePrint('Mutation result: ${createdTodo.name}');

} on APIException catch (e) {
  safePrint('Failed to create todo', e);
}
```
<!-- /Platform -->

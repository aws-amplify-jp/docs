---
title: "パブリックデータアクセス"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-12T20:29:55.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/"
---

パブリック認可戦略は、API キーで保護されているAPIへのアクセスをすべてのユーザーに付与します。また、認可プロバイダーをオーバーライドして、API キーの代わりに Cognito の認証されていない IAM ロールを使用してパブリックアクセスを行うこともできます。

## API キーベースの認証を使用してパブリック認可ルールを追加する

すべてのユーザーにアクセスを許可するには、`.public()` 認可戦略を使用します。内部では、API は API キーで保護されます。

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーションでは、`authMode` を `apiKey` に指定して `client.models.<model-name>` を使用してモデルに対する CRUD 操作を実行できます。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
    content: 'My new todo',
  },
  // highlight-start
  {
    authMode: 'apiKey',
  }
  // highlight-end
);
```
<!-- /Platform -->

<!-- Platform: swift, flutter -->
アプリケーションでは、`apiKey` 認証モードを指定してモデルに対する CRUD 操作を実行できます。
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
try {
  final todo = Todo(content: 'My new todo');
  final request = ModelMutations.create(
    todo,
    authorizationMode: APIAuthorizationType.apiKey,
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

<!-- Platform: swift -->
```swift
do {
    let todo = Todo(content: "My new todo")
    let createdTodo = try await Amplify.API.mutate(request: .create(
        todo,
        authMode: .apiKey)).get()
} catch {
    print("Failed to create todo", error)
}
```
<!-- /Platform -->

### API キーの有効期限を延長する

API キーの有効期限が切れていない場合、アプリをもう一度デプロイすることで有効期限を延長できます。API キーの有効期限は、アプリがデプロイされた日付から `expiresInDays` 日に設定されます。以下の例では、API キーは最新のデプロイから 7 日後に有効期限が切れます。

```ts title="amplify/data/resource.ts"
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 7,
    },
  },
});
```

### API キーをローテーションする

有効期限が切れた、侵害された、または削除されたAPIキーをローテーションできます。API キーをローテーションするには、`amplify/backend.ts` ファイルでAPI キーリソースの論理IDをオーバーライドします。これにより、新しい論理IDを持つ新しい API キーが作成されます。

```ts title="amplify/backend.ts"
const backend = defineBackend({
  auth,
  data,
});

backend.data.resources.cfnResources.cfnApiKey?.overrideLogicalId(
  `recoverApiKey${new Date().getTime()}`
);
```

アプリをデプロイします。デプロイが完了したら、論理IDのオーバーライドを削除し、アプリをもう一度デプロイして、デフォルトの論理IDを使用します。

```ts title="amplify/backend.ts"
const backend = defineBackend({
  auth,
  data,
});

// backend.data.resources.cfnResources.cfnApiKey?.overrideLogicalId(
//   `recoverApiKey${new Date().getTime()}`
// );
```

アプリ用の新しい API キーが作成されます。

## Amazon Cognito ID プールの認証されていないロールを使用してパブリック認可ルールを追加する

認可プロバイダーをオーバーライドすることもできます。以下の例では、`identityPool` がプロバイダーとして指定されており、API キーの代わりに Cognito ID プールからの「Unauthenticated Role」(認証されていないロール)を使用してパブリックアクセスを行うことができます。`amplify/auth/resource.ts` で定義された Auth リソースは、Cognito ID プールの「Unauthenticated Role」に対してスコープ設定された IAM ポリシーを自動的に生成します。

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.guest()]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, flutter -->
アプリケーションでは、`identityPool` 認証モードを使用して `client.models.<model-name>` でモデルに対する CRUD 操作を実行できます。

> **Info:** 自動生成された **amplify_outputs.json** ファイルを使用していない場合は、Amplify ライブラリリソース設定の `allowGuestAccess` フラグを `true` に設定する必要があります。これにより、ユーザーがログインしていない場合、Amplify ライブラリが Cognito ID プールから認証されていないロールを使用できるようになります。
> 
> <details><summary>Amplify 設定</summary>
> ```ts title="src/App.tsx"
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(
  {
    ...outputs,
    Auth: {
      Cognito: {
        identityPoolId: config.aws_cognito_identity_pool_id,
        userPoolClientId: config.aws_user_pools_web_client_id,
        userPoolId: config.aws_user_pools_id,
        allowGuestAccess: true,
      },
    },
  }
);
```
> </details>

```ts title="src/App.tsx"
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
    content: 'My new todo',
  },
  // highlight-start
  {
    authMode: 'identityPool',
  }
  // highlight-end
);
```
<!-- /Platform -->

<!-- Platform: flutter -->
アプリケーションでは、`iam` 認証モードを使用してモデルに対する CRUD 操作を実行できます。

```dart
try {
  final todo = Todo(content: 'My new todo');
  final request = ModelMutations.create(
    todo,
    authorizationMode: APIAuthorizationType.iam,
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

<!-- Platform: swift -->
アプリケーションでは、`awsIAM` 認証モードを使用してモデルに対する CRUD 操作を実行できます。

```swift
do {
    let todo = Todo(content: "My new todo")
    let createdTodo = try await Amplify.API.mutate(request: .create(
        todo,
        authMode: .awsIAM)).get()
} catch {
    print("Failed to create todo", error)
}
```
<!-- /Platform -->

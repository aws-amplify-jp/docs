---
title: "サインイン済みユーザーのデータアクセス"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-06-19T16:13:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/"
---

`authenticated` 認可戦略は、IAM、Cognito、または OpenID Connect を通じて認証されたサインイン済みユーザーのみにレコードアクセスを制限し、認可ルールをすべてのユーザーに適用します。これは、認証されたすべてのユーザーのデータをプライベートにする簡単な方法を提供します。

## サインイン済みユーザーの認可ルールを追加する

`authenticated` 認可戦略を使用して、レコードのアクセスをすべてのサインイン済みユーザーに制限できます。

<Callout>
**注:** レコードのアクセスを特定のユーザーに制限したい場合は、[ユーザーごと/所有者ごとのデータアクセス](/[platform]/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)を参照してください。このページで説明する `authenticated` 認可戦略は、**すべて**のサインイン済みユーザーにデータアクセスの認可ルールを適用します。
</Callout>

以下の例では、Cognito ユーザープールからの有効な JWT トークンを持つ誰もがすべての Todo にアクセスできます。

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.authenticated()]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーションで、`client.models.<model-name>` を使用して `userPool` 認証モードで CRUD 操作を実行できます。

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
    authMode: 'userPool',
  }
  // highlight-end
);
```
<!-- /Platform -->

<!-- Platform: flutter -->
アプリケーションで、`userPools` 認証モードでモデルに対して CRUD 操作を実行できます。
  
```dart
try {
  final todo = Todo(content: 'My new todo');
  final request = ModelMutations.create(
    todo,  
    authorizationMode: APIAuthorizationType.userPools,
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
アプリケーションで、`amazonCognitoUserPools` 認証モードでモデルに対して CRUD 操作を実行できます。

```swift
do {
    let todo = Todo(content: "My new todo")
    let createdTodo = try await Amplify.API.mutate(request: .create(
        todo,
        authMode: .amazonCognitoUserPools)).get()
} catch {
    print("Failed to create todo", error) 
}
```
<!-- /Platform -->

## サインイン済みユーザー認証に ID プールを使用する

認可プロバイダーをオーバーライドすることもできます。以下の例では、`identityPool` がプロバイダーとして指定されており、API キーの代わりに Cognito ID プールから「未認証ロール」を使用してパブリックアクセスを許可できます。`amplify/auth/resource.ts` で定義された Auth リソースは、Cognito ID プールの「未認証ロール」に対してスコープダウンされた IAM ポリシーを自動的に生成します。

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.authenticated('identityPool')]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーションで、`client.models.<model-name>` を使用して `iam` 認証モードで CRUD 操作を実行できます。

> **Info:** Amplify ライブラリが Cognito ID プールから認証されたロールを使用するには、ユーザーがログインしている必要があります。

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
    authMode: 'identityPool',
  }
  // highlight-end
);
```
<!-- /Platform -->

<!-- Platform: flutter -->
アプリケーションで、`iam` 認証モードでモデルに対して CRUD 操作を実行できます。

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
アプリケーションで、`awsIAM` 認証モードでモデルに対して CRUD 操作を実行できます。

> **Info:** Amplify ライブラリが Cognito ID プールから認証されたロールを使用するには、ユーザーがログインしている必要があります。

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

さらに、`authenticated` 認可で OpenID Connect を使用することもできます。[認可プロバイダーとしての OpenID Connect](/[platform]/build-a-backend/data/customize-authz/using-oidc-authorization-provider/)を参照してください。

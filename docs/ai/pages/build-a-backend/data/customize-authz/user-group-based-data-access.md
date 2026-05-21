---
title: "ユーザーグループベースのデータアクセス"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-23T16:31:56.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/"
---

`group` 認可戦略を使用して、ユーザーグループに基づいてアクセスを制限できます。ユーザーグループ認可戦略により、特定のユーザーグループまたは各データレコードで動的に定義されたグループへのデータアクセスを制限できます。

## 特定のユーザーグループに対する認可ルールの追加

特定のユーザーグループセットへのアクセスを制限する場合、`groups` パラメータにグループ名を指定します。以下の例では、「Admin」ユーザーグループに属するユーザーのみが Salary モデルへのアクセスが許可されます。

```ts title="amplify/data/resource.ts"
// allow one specific group
const schema = a.schema({
  Salary: a
    .model({
      wage: a.float(),
      currency: a.string(),
    })
    .authorization(allow => [allow.group('Admin')]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーションでは、`client.models.<model-name>` を使用して `userPool` 認証モードでモデルに対して CRUD 操作を実行できます。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// As a signed-in user that belongs to the 'Admin' User Pool Group
const { errors, data: newSalary } = await client.models.Salary.create(
  {
    wage: 50.25,
    currency: 'USD'
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
アプリケーションでは、`userPools` 認証モードでモデルに対して CRUD 操作を実行できます。
  
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
アプリケーションでは、`amazonCognitoUserPools` 認証モードでモデルに対して CRUD 操作を実行できます。

```swift
do {
    let salary = Salary(
        wage: 50.25,
        currency: "USD")
    let createdSalary = try await Amplify.API.mutate(request: .create(
        salary,
        authMode: .amazonCognitoUserPools)).get()
} catch {
    print("Failed to create salary", error)
}
```
<!-- /Platform -->

この例では、複数の定義されたグループへのアクセスを許可するように更新できます。以下の例では「Leadership」へのアクセスを追加しました。

```ts
// allow multiple specific groups
const schema = a.schema({
  Salary: a
    .model({
      wage: a.float(),
      currency: a.string(),
    })
    .authorization(allow => [allow.groups(['Admin', 'Leadership'])]),
});
```

## 動的に設定されたユーザーグループに対する認可ルールの追加

動的グループ認可では、各レコードに、どの Cognito グループがそれにアクセスできるかを指定する属性が含まれます。最初の引数を使用して、基礎となるデータストアのどの属性がこのグループ情報を保持するかを指定します。単一のグループがアクセスできるように指定するには、`a.string()` 型のフィールドを使用します。複数のグループがアクセスできるように指定するには、`a.string().array()` 型のフィールドを使用します。

```ts
// Dynamic group authorization with multiple groups
const schema = a.schema({
  Post: a
    .model({
      title: a.string(),
      groups: a.string().array(),
    })
    .authorization(allow => [allow.groupsDefinedIn('groups')]),
});
```

```ts
// Dynamic group authorization with a single group
const schema = a.schema({
  Post: a
    .model({
      title: a.string(),
      group: a.string(),
    })
    .authorization(allow => [allow.groupDefinedIn('group')]),
});
```

デフォルトでは、`group` 認可は Amazon Cognito ユーザープールグループを使用しますが、`group` 認可で OpenID Connect を使用することもできます。[認可プロバイダーとしての OpenID Connect](/[platform]/build-a-backend/data/customize-authz/using-oidc-authorization-provider) を参照してください。

<Callout>
**動的グループ認可を使用する場合のリアルタイムサブスクリプションの既知の制限:**

1. レコードごとに単一のグループに基づいて認可する場合、ユーザーが 5 個以下のユーザーグループに属している場合にのみサブスクリプションがサポートされます。
2. グループの配列を介して認可する場合（上記の例で使用される `groups: a.string().array()`）
   - ユーザーが 20 個以下のグループに属している場合にのみサブスクリプションがサポートされます
   - レコードごとに 20 個以下のユーザーグループのみを認可できます
</Callout>

## セッションからユーザーグループにアクセス

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
Auth カテゴリを使用してセッションからユーザーのグループにアクセスできます：

```ts
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const groups = session.tokens.accessToken.payload['cognito:groups'] || [];

console.log('User groups:', groups);
```
<!-- /Platform -->

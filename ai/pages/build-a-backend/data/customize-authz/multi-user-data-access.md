---
title: "複数ユーザーのデータアクセス"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-06-19T16:13:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/"
---

`ownersDefinedIn` ルールは、`owners` フィールドを自動的に作成して許可されたレコード所有者を保存することで、ユーザーのセットにレコードへのアクセスを付与します。`inField` を指定することで、デフォルトの owners フィールド名をオーバーライドして、所有者情報を保存する目的のフィールド名を指定できます。所有者フィールドを更新することで、レコードにアクセスできるユーザーを動的に管理できます。

## マルチユーザー認可ルールの追加

ユーザーのセットにレコードへのアクセスを付与したい場合は、`ownersDefinedIn` ルールを使用します。これにより、許可されたオーナーを保存するための `owners: a.string().array()` フィールドが自動的に作成されます。

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      owners: a.string().array(),
    })
    .authorization(allow => [allow.ownersDefinedIn('owners')]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーションでは、`userPool` 認証モードで `client.models.<model-name>` を使用してモデルに対して CRUD 操作を実行できます。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// 現在のユーザーを最初のオーナーとしてレコードを作成
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

別のユーザーをオーナーとして追加

```ts
await client.models.Todo.update(
  {
    id: newTodo.id,
    owners: [...(newTodo.owners as string[]), otherUserId],
  },
  // highlight-start
  {
    authMode: "userPool"
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

別のユーザーをオーナーとして追加

```dart
try {
  createdTodo.owners!.add(otherUserId);
  let updateRequest = ModelMutations.update(
    createdTodo,
    authorizationMode: APIAuthorizationType.userPools,
  );
  final updatedTodo = await Amplify.API.mutations(request: updateRequest).response;

  if (updatedTodo == null) {
    safePrint('errors: ${response.errors}');
    return;
  }

} catch {
  safePrint("Failed to update todo", error)
}
```
<!-- /Platform -->

<!-- Platform: swift -->
アプリケーションでは、`amazonCognitoUserPools` 認証モードでモデルに対して CRUD 操作を実行できます。

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

別のユーザーをオーナーとして追加

```swift
do {
    createdTodo.owners?.append(otherUserId)
    let updatedTodo = try await Amplify.API.mutate(request: .update(
        createdTodo,
        authMode: .amazonCognitoUserPools)).get()
} catch {
    print("Failed to update todo", error)
}
```
<!-- /Platform -->

## オーナーのリストにオーバーライド

`inField` をオーナーのリストにオーバーライドできます。レコードへのアクセスを持つユーザーの動的なセットが必要な場合は、これを使用します。以下の例では、`authors` リストはレコード作成時にレコードの作成者によって入力されます。作成者はその後、`authors` フィールドを追加のユーザーで更新できます。`authors` フィールドにリストされているユーザーは、レコードにアクセスできます。

```ts
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      authors: a.string().array(), // record owner information now stored in "authors" field
    })
    .authorization(allow => [allow.ownersDefinedIn('authors')]),
});
```

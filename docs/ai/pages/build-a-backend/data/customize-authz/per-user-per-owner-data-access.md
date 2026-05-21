---
title: "ユーザー単位/オーナー単位のデータアクセス"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-06-19T16:13:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/"
---

`owner`認可戦略により、レコードへのアクセスが特定のユーザーに制限されます。`owner`認可が設定されている場合、レコードの`owner`のみが指定された操作を実行できます。

## ユーザー単位/オーナー単位の認可ルールを追加

`owner`認可戦略を使用して、レコードのアクセスを特定のユーザーに制限できます。`owner`認可が設定されている場合、レコードの`owner`のみが指定された操作を実行できます。

```ts title="amplify/data/resource.ts"
// Todoの「オーナー」は、自分のTodoの作成、読み取り、更新、削除が許可されます
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.owner()]),
});
```

```ts title="amplify/data/resource.ts"
// Todoレコードの「オーナー」は、作成、読み取り、更新のみが許可されます。
// Todoレコードの「オーナー」は削除が拒否されます。
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.owner().to(['create', 'read', 'update'])]),
});
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
アプリケーション内では、`userPool`認証モードを使用して、`client.models.<model-name>`に対してCRUD操作を実行できます。

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
アプリケーション内では、`userPools`認証モードを使用してモデルに対してCRUD操作を実行できます。
  
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
アプリケーション内では、`amazonCognitoUserPools`認証モードを使用してモデルに対してCRUD操作を実行できます。

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

バックグラウンドで、Amplifyは自動的に各レコードに`owner: a.string()`フィールドを追加し、レコード作成時にレコードオーナーのアイデンティティ情報が含まれます。

デフォルトでは、Cognitoユーザープールのユーザー情報が`owner`フィールドに入力されます。保存される値は`<sub>::<username>`の形式で`sub`と`username`を含みます。APIは`<sub>::<username>`の完全な値または`sub`/`username`を個別に認可し、`username`を返します。または、[OpenID Connectを認可プロバイダーとして設定](/[platform]/build-a-backend/data/customize-authz/using-oidc-authorization-provider)することもできます。

> **Warning:** **デフォルトでは、オーナーは既存レコードのオーナーを別のユーザーに変更できます。**
> 
> オーナーがレコードを別のユーザーに変更できないようにするには、オーナーフィールド（デフォルト：`owner: String`）を[フィールドレベルの認可ルール](/[platform]/build-a-backend/data/customize-authz/#field-level-authorization-rules)で保護してください。たとえば、ソーシャルメディアアプリでは、Aliceが自分のPostをBobに変更できないようにしたいでしょう。
> 
> ```ts
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      owner: a.string().authorization(allow => [allow.owner().to(['read', 'delete'])]),
    })
    .authorization(allow => [allow.owner()]),
});
```

## オーナーフィールドをカスタマイズ

認可ルール内に独自の`ownerField`を指定することで、`owner`フィールドを独自の好みのフィールドでオーバーライドできます。

```ts
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      author: a.string(), // record owner information now stored in "author" field
    })
    .authorization(allow => [allow.ownerDefinedIn('author')]),
});
```

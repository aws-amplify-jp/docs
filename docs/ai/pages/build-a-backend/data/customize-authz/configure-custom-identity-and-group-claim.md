---
title: "カスタム識別情報およびグループクレームの設定"
section: "build-a-backend/data/customize-authz"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-06-19T16:13:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/"
---

Amplify Dataは、デフォルトで提供されるAmazon Cognito の `cognito:groups` またはダブルコロン区切りのクレーム `sub::username` をJWTトークンから使用したくない場合に、カスタム識別情報およびグループクレームの使用をサポートしています。これは、サードパーティのOIDCシステムからのトークンを使用している場合、または[事前トークン生成Lambdaトリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html)を使用している場合など、データベースから読み込むグループのリストで外部システムからクレームを入力したい場合に便利です。

カスタムクレームを使用するには、必要に応じて `identityClaim` または `groupClaim` を指定します。以下の例では、`identityClaim` が指定され、レコードオーナーは この `user_id` クレームに対してチェックされます。同様に、`user_groups` クレームに「Moderator」文字列が含まれている場合、アクセスが許可されます。

```ts title="amplify/data/resource.ts"
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a
    .model({
      id: a.id(),
      owner: a.string(),
      postname: a.string(),
      content: a.string(),
    })
    .authorization(allow => [
      allow.owner().identityClaim('user_id'),
      allow.groups(['Moderator']).withClaimIn('user_groups'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema });

```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, swift -->
アプリケーション内では、`userPool`認証モードで`client.models.<model-name>`を使用してモデルに対するCRUD操作を実行できます。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
    postname: 'My New Post'
    content: 'My post content',
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
アプリケーション内では、`userPools`認証モードでモデルに対するCRUD操作を実行できます。
  
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

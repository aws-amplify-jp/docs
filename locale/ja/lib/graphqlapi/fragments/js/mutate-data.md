## AmplifyGraphQLクライアントの使用

### <unk>

GraphQL では、データの作成、更新、または削除に変更を使用します。 Amplify GraphQL クライアントを使用して項目を作成、更新、および削除する例をいくつか示します。

#### アイテムを作成しています

```javascript
import { API } from "aws-amplify";
import * as mutations from './graphql/mutations';

const todoDetails = {
  name: 'Todo 1',
  description: 'Learn AWS AppSync'
};

const newTodo = await API.graphql({ query: mutations.createTodo, variables: {input: todoDetails}}));
```

`createdAt` と `updatedAt` フィールドを渡す必要はありません。AppSync がこれを管理します。

必要に応じて、引数オブジェクトの構築に役立つ `graphqlOperation` ヘルパー関数をインポートすることができます。

```javascript
import { API, graphqlOperation } from 'aws-amplify';
// ...
const newTodo = await API.graphql({ query: mutations.createTodo, variables: {input: todoDetails}})); // 上記の例
```

#### アイテムを更新中

```javascript
import { API } from "aws-amplify";
import * as mutations from './graphql/mutations';

const todoDetails = {
  id: 'some_id',
  description: 'My updated description!'
};

const updatedTodo = await API.graphql({ query: mutations.updateTodo, variables: {input: todoDetails}}));
```

メモ:

- `createdAt` と `updatedAt` フィールドを渡す必要はありません。AppSync がこれを管理します。
- If you pass in *extra* input fields not expected by the AppSync schema, this query will fail. You can see this in the `error` field returned by the query (the query itself does not throw, per GraphQL design).

#### アイテムを削除しています

```javascript
import { API } from "aws-amplify";
import * as mutations from './graphql/mutations';

const todoDetails = {
  id: 'some_id',
};

const deletedTodo = await API.graphql({ query: mutations.deleteTodo, variables: {input: todoDetails}}));
```

`id` のみが必要です。

### カスタム認証モード

デフォルトでは、各AppSync APIは、アプリを設定する際にデフォルトの認証モードで設定されます。 デフォルトの認証モードを上書きしたい場合は、 `authMode` プロパティを指定することで行うことができます。

#### カスタム認証モードでのミュート

```js
import { API } from "aws-amplify";
import * as mutations from './graphql/mutations';

const todoDetails = {
  id: 'some_id',
  name: 'My todo!',
  description: 'Hello world!'
};

const todo = await API.graphql({
  query: mutations.createTodo,
  variables: {input: todoDetails},
  authMode: 'AWS_IAM'
});
```

## AWS AppSync SDK の使用

To add data you need to run a GraphQL mutation. The syntax is `client.mutate({ mutation:MUTATION, variables: vars})` which like a query returns a `Promise`. The `MUTATION` is a GraphQL document you can write yourself or use the statements which `amplify codegen` created automatically. `variables` are an optional object if the mutation requires arguments. For example, if you have a `createTodo` mutation, your code will look like the following (using `async/await` in this example):

```javascript
import { createTodo } from './graphql/mutations';

(async () => {
  const result = await client.mutate({
    mutation: gql(createTodo),
    variables: {
      input: {
        name: 'Use AppSync',
        description: 'Realtime and Offline',
      }
    }
  });
  console.log(result.data.createTodo);
})();
```

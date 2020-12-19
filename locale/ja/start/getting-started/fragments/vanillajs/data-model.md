新しいAmplifyプロジェクトを初期化したので、機能を追加できます。 最初に追加する機能はAPIです。APIを使用すると、クラウドとの間でデータを保存して読み取ることができます。

Amplify CLI は、 [REST](~/lib/restapi/getting-started.md) と [GraphQL](~/lib/graphqlapi/getting-started.md) の 2 種類の API カテゴリの作成と相互作用をサポートしています。

この手順で作成するAPIは、AWS AppSync(管理されたGraphQLサービス)を使用したGraphQL APIであり、データベースはAmazon DynamoDB(NoSQLデータベース)になります。

## GraphQL API とデータベースの作成

[GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/designing-a-graphql-api.html) をアプリケーションに追加し、アプリケーションディレクトリのルートから次のコマンドを実行して自動的にデータベースをプロビジョニングします。

```bash
増幅して api を追加
```

以下のハイライト表示されている **デフォルト値** を受け入れます。

```console
? Please select from one of the below mentioned services:
# GraphQL
? Provide API name:
# amplifyjsapp
? Choose the default authorization type for the API:
# API Key
? Enter a description for the API key:
# todos
? After how many days from now the API key should expire:
# 7 (or your preferred expiration)
? Do you want to configure advanced settings for the GraphQL API:
# No
? Do you have an annotated GraphQL schema?
# No
? Do you want a guided schema creation?
# Yes
? What best describes your project:
# Single object with fields
? Do you want to edit the schema now?
# Yes
```

CLI がテキストエディタでこの GraphQL スキーマを開く必要があります。

__anplify/backend/api/anplifyjsapp/schema.graphql__

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

The schema generated is for a Todo app. You'll notice a directive on the `Todo` type of `@model`. This directive is part of the [GraphQL transform](~/cli/graphql-transformer/model.md) library of Amplify.

GraphQL Transform ライブラリには、データモデルの定義などを行うためのスキーマで使用できるカスタムディレクティブが用意されています。 認証と認可ルールの設定、サーバレス機能をリゾルバとして設定するなど。

`@model` ディレクティブで装飾された型は、タイプ (Todo テーブル) のデータベーステーブルを足場に置きます。 CRUD (作成、読み取り、更新、削除)およびリスト操作のためのスキーマ、およびすべてを一緒に動作させるために必要な GraphQL リゾルバ。

コマンドラインから __を押して__ を入力し、スキーマを受け入れ、次のステップに進みます。

## GraphQL API をデプロイします

APIが正常に作成されました。APIをデプロイできるように、更新された構成をクラウドにプッシュする必要があります。

```bash
push を増幅する
```

## GraphQL API のコードを生成

`を増幅して`を実行すると、 コード内でスキーマで生成されたすべてのGraphQL操作を選択することができます。 次のオプションを選択してください:

```console
? Do you want to generate code for your newly created GraphQL API (Yes)
? Choose the code generation language target (javascript)
? Enter the file name pattern of graphql queries, mutations and subscriptions (src/graphql/**/*.js)
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions (Yes)
? Enter maximum statement depth [increase from default if your schema is deeply nested] (2)
```

次に、Amplifyの状態を確認するために次のコマンドを実行します。

```bash
増幅の状態
```

これにより、現在の環境を含むAmplifyプロジェクトの現在のステータスが得られます。 どのカテゴリーが作成されているかを調べることができます 以下のようになります。

```console
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| Api      | amplifyjsapp  | No Change | awscloudformation |

GraphQL endpoint: https://•••••••••••.appsync-api.us-east-1.amazonaws.com/graphql
GraphQL API KEY: ••••••••••
```

### API のテスト

AWSコンソールを開いて、新しいAPIに対していつでもクエリ、変更、またはサブスクリプションを実行するには、次のコマンドを実行します。

```bash
コンソールの api を増幅する
```

プロンプトが表示されたら、 **GraphQL**を選択します。 これにより、AWS AppSync コンソールが開き、クエリ、ミューテーションを実行できます。 またはサーバーでサブスクリプションを行い、クライアントアプリケーションの変更を確認します。

## フロントエンドを API に接続

Update your `src/app.js` file to configure the library with `Amplify.configure()` and add data to your database with a mutation by using `API.graphql()`:

```javascript
import Amplify, { API, graphqlOperation } from "@aws-amplify/api";

import awsconfig from "./aws-exports";
import { createTodo } from "./graphql/mutations";

Amplify.configure(awsconfig);

async function createNewTodo() {
  const todo = {
    name: "Use AppSync",
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  };

  return await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");

MutationButton.addEventListener("click", (evt) => {
  createNewTodo().then((evt) => {
    MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
  });
});
```

After restarting your app using `npm start` go back to your browser and click **ADD DATA**.  You'll see that your application is now submitting events to AppSync and storing records in DynamoDB. Next, update `src/app.js` to list all the items in the database by importing `listTodos` and update the page when a query runs on app start by immediately calling the function:

```diff
 import Amplify, { API, graphqlOperation } from "@aws-amplify/api";

 import awsconfig from "./aws-exports";
 import { createTodo } from "./graphql/mutations";
+import { listTodos } from "./graphql/queries";

 Amplify.configure(awsconfig);

 async function createNewTodo() {
   const todo = {
     name: "Use AppSync",
     description: `Realtime and Offline (${new Date().toLocaleString()})`,
   };

   return await API.graphql(graphqlOperation(createTodo, { input: todo }));
 }

+async function getData() {
+  API.graphql(graphqlOperation(listTodos)).then((evt) => {
+    evt.data.listTodos.items.map((todo, i) => {
+      QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
+    });
+  });
+}
+
 const MutationButton = document.getElementById("MutationEventButton");
 const MutationResult = document.getElementById("MutationResult");
+const QueryResult = document.getElementById("QueryResult");

 MutationButton.addEventListener("click", (evt) => {
   createNewTodo().then((evt) => {
     MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
   });
 });

+getData();
```

Now if you wish to subscribe to data, import the `onCreateTodo` subscription and create a new subscription by adding subscription with `API.graphql()` like so:

```diff
 import Amplify, { API, graphqlOperation } from "@aws-amplify/api";

 import awsconfig from "./aws-exports";
 import { createTodo } from "./graphql/mutations";
 import { listTodos } from "./graphql/queries";
+import { onCreateTodo } from "./graphql/subscriptions";

 Amplify.configure(awsconfig);

 async function createNewTodo() {
   const todo = {
     name: "Use AppSync",
     description: `Realtime and Offline (${new Date().toLocaleString()})`,
   };

   return await API.graphql(graphqlOperation(createTodo, { input: todo }));
 }

 async function getData() {
   API.graphql(graphqlOperation(listTodos)).then((evt) => {
     evt.data.listTodos.items.map((todo, i) => {
       QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
     });
   });
 }

 const MutationButton = document.getElementById("MutationEventButton");
 const MutationResult = document.getElementById("MutationResult");
 const QueryResult = document.getElementById("QueryResult");
+const SubscriptionResult = document.getElementById("SubscriptionResult");

 MutationButton.addEventListener("click", (evt) => {
   createNewTodo().then((evt) => {
     MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
   });
 });

+API.graphql(graphqlOperation(onCreateTodo)).subscribe({
+  next: (evt) => {
+    const todo = evt.value.data.onCreateTodo;
+    SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
+  },
+});
+
 getData();
```

`npm start` を使用してアプリを再起動した後、ブラウザーに戻り、開発ツールを使用すると、コンソールログからバックエンドに保存されているデータが表示されます。

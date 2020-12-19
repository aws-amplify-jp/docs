### データ要件

このアプリには以下の要件があります。

1. Todos のリスト
2. Todoの作成/更新/削除機能

### GraphQL 変換を使用してデータをモデル

これらの要件を満たしています。 タスク一覧のAPIをクエリできるようにし、作成するAPIにアップデートを送信する方法を提供する必要があります。 タスクの更新と削除を行います GraphQL では、次のようにエンティティを定義するために `型` を使用します。

```graphql
type Todo {
  id: ID!
  name: String!
  description: String
}
```

Amplifyを使用しているため、GraphQL スキーマ定義言語(SDL)とカスタム Amplifyディレクティブを使用して、API のバックエンド要件を定義できます。 GraphQL Transform ライブラリを使用して、SDL定義を完全に記述的なAWS CloudFormationテンプレートのセットに変換し、データモデルを実装します。

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

`@model` ディレクティブを使用すると、Amplify はこのタイプのデータを格納する必要があることを知ることができます。 これにより、DynamoDBテーブルが作成され、すべてのGraphQL操作がAPIで利用可能になります。

## GraphQL API とデータベースの作成

データがモデリングされたので、GraphQL API を作成します。プロジェクトのルートから、次の操作を実行します。

```bash
増幅して api を追加
```

以下でハイライトされているデフォルト値を選択します。

```console
? Please select from one of the below mentioned services:
# GraphQL
? Provide API name:
# myapi
? Choose the default authorization type for the API:
# API Key
? Enter a description for the API key:
# demo
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

__anplify/backend/api/myapi/schema.graphql__

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

## GraphQL API のフロントエンドコードを生成

`を増幅して`を実行すると、 コード内で生成されたスキーマ内のすべてのGraphQL操作を選択することができます。 次のオプションを選択してください:

```console
Do you want to generate code for your newly created GraphQL API (Yes)
Choose the code generation language target (javascript)
Enter the file name pattern of graphql queries, mutations and subscriptions (src/graphql/**/*.js)
Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions (Yes)
Enter maximum statement depth [increase from default if your schema is deeply nested] (2)
```

次に、Amplifyの状態を確認するために次のコマンドを実行します。

```bash
増幅の状態
```

これにより、現在の環境を含むAmplifyプロジェクトの現在のステータスが得られます。 どのカテゴリーが作成されているかを調べることができます 以下のようになります。

```console
現在の環境: dev

| Resource name | Operation | Provider プラグイン|
| --------------- | ------------- | -------------- |
| Api | myapi | No Change | awscloudforming |
```

### API のテスト

AWS Amplifyコンソールでいつでもプロジェクトにデプロイされたサービスを表示するには、以下のコマンドを実行します。

```bash
増幅コンソール
```

AmplifyアプリプロジェクトがAWSサービスコンソールで開きます。AppSync APIを表示するには、 **API** タブを選択してください。 API をクリックすると、AWS AppSync コンソールが開き、クエリを実行できます。 サーバーでの変更、またはサブスクリプション、クライアントアプリケーションの変更を確認します。

## フロントエンドを API に接続

次に、 __App.vue__ を開きます。

### GraphQL変異でデータを書く

To create a new todo in the database, use the `API.graphql()` operation with the `createTodo` mutation and pass in the data you'd like to write.

```html
<template>
  <div id="app">
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">
    <button v-on:click="createTodo">Create Todo</button>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
import { createTodo } from './graphql/mutations';

export default {
  name: 'app',
  data() {
    return {
      name: '',
      description: ''
    }
  },
  methods: {
    async createTodo() {
      const { name, description } = this;
      if (!name || !description) return;
      const todo = { name, description };
      await API.graphql({
        query: createTodo,
        variables: {input: todo},
      });
      this.name = '';
      this.description = '';
    }
  }
};
</script>
```

### GraphQL クエリでデータを読み込み中

To display the data, update `App.vue` to list all the items in the database by importing `listTodos` and then using the `created()` Vue lifecycle method to update the page when a query runs on page load:

```html
<template>
  <div id="app">
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">
    <button v-on:click="createTodo">Create Todo</button>
    <div v-for="item in todos" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

export default {
  name: 'App',
  async created() {
    this.getTodos();
  },
  data() {
    return {
      name: '',
      description: '',
      todos: []
    }
  },
  methods: {
    async createTodo() {
      const { name, description } = this;
      if (!name || !description) return;
      const todo = { name, description };
      this.todos = [...this.todos, todo];
      await API.graphql({
        query: createTodo,
        variables: {input: todo},
      });
      this.name = '';
      this.description = '';
    },
    async getTodos() {
      const todos = await API.graphql({
        query: listTodos
      });
      this.todos = todos.data.listTodos.items;
    }
  }
}
</script>
```

### GraphQLサブスクリプションによるリアルタイムデータ

Now if you wish to subscribe to data, import the `onCreateTodo` subscription and create a new subscription by adding subscription with `API.graphql()` like so:

```html
<script>
// other imports
import { onCreateTodo } from './graphql/subscriptions';

export default {
  // other functions and properties
  created(){
    this.getTodos();
    this.subscribe();
  },
  methods: {
    // other methods
    subscribe() {
      API.graphql({ query: onCreateTodo })
        .subscribe({
          next: (eventData) => {
            let todo = eventData.value.data.onCreateTodo;
            if (this.todos.some(item => item.name === todo.name)) return; // remove duplications
            this.todos = [...this.todos, todo];
          }
        });
    }
  }
};
</script>
```

## モジュラーインポートの使用

バンドルサイズを小さくするには、特定の機能のみを使用しているときに特定のカテゴリのみをアプリにインポートすることもできます。 `API` など。

```bash
npm install @aws-amplify/api # API カテゴリのみインストールします。
```

インポートするAPI:

```
import API from '@aws-amplify/api'
```

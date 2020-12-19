React アプリケーションを作成して設定し、新しいAmplifyプロジェクトを初期化したので、機能を追加できます。 最初に追加する機能はAPIです。

Amplify CLIは、RESTとGraphQLの2種類のAPIの作成と操作をサポートしています。

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

### API のデプロイ

このバックエンドをデプロイするには、 `push` コマンドを実行します。

```bash
push を増幅する
```

```console
? Are you sure you want to continue? Y

# You will be walked through the following questions for GraphQL code generation
? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Y
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

APIが稼働しているので、対話を始めることができます。

デプロイした API は、ToDo の作成、読み取り、更新、削除、リストの操作を含む、ToDo アプリケーション用です。

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

AppSync コンソールで GraphQL API をいつでも表示するには、次のコマンドを実行します。

```bash
コンソールの api を増幅する
```

Amplifyコンソールでいつでもアプリ全体を表示するには、次のコマンドを実行します。

```bash
増幅コンソール
```

### (オプション) API のテスト

ローカルでテストするには、 `モック` コマンドを実行します。

> 先に進んでフロントエンドを接続したい場合は、 [次のステップ](#connect-frontend-to-api)にジャンプできます。

```bash
amplifyモックapiは
```

*注意:* `はモックAPIを増幅する` にはJavaが必要です。

```console
# If you have not already deployed you API, you will be walked through the following steps for GraphQL code generation
? Choose the code generation language target: javascript (or preferred target)
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
```

これにより、GraphiQL エクスプローラがローカルポート上で開きます。テスト環境では、クエリや変更など、さまざまな操作をローカルで試すことができます。

いくつかの変異をローカルで実行してから、todosをクエリしてみてください。

```graphql
mutation createTodo {
  createTodo(input: {
    name: "Build an API"
    description: "Build a serverless API with Amplify and GraphQL"
  }) {
    id
    name
    description
  }
}

query listTodos {
  listTodos {
    items {
      id
      description
      name
    }
  }
}
```

## フロントエンドを API に接続

このセクションでは、React アプリケーションからtodosを一覧表示して作成する方法を作成します。 これを行うには todosを作成するボタンと、todosのリストを取得してレンダリングする方法を含むフォームを作成します。

__src/App.js__ を開き、次のコードで置き換えます。

```javascript
/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>Create Todo</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App
```

いくつかの関数を見てみましょう。

__useEffect__ - コンポーネントがロードされると、 `useEffect` フックが呼び出され、 `fetchTodos` 関数を呼び出します。

__fetchTodos__ - Uses the Amplify `API` category to call the AppSync GraphQL API with the `listTodos` query. Once the data is returned, the items array is passed in to the `setTodos` function to update the local state.

__addTodo__ - Uses the Amplify `API` category to call the AppSync GraphQL API with the `createTodo` mutation. A difference between the `listTodos` query and the `createTodo` mutation is that `createTodo` accepts an argument containing the variables needed for the mutation.

## ローカルで実行

次に、アプリを実行すると、画面にレンダリングされたフォームが表示され、todosのリストを作成して表示できるようになります。

```bash
npm start
```

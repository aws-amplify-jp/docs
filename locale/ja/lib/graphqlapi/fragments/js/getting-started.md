> 前提条件: [Amplify CLI で Amplify プロジェクト](~/cli/start/install.md) をインストール、構成、初期化

このセクションでは、AWS AppSync GraphQL API をデプロイし、JavaScript クライアントアプリケーションからそれに接続する方法について説明します。

## GraphQL API の作成

GraphQL API を作成するには、Amplify `add` コマンドを使用します。

```bash
増幅して api を追加
```

```console
? Please select from one of the below mentioned services: GraphQL
? Provide API name: myapi
? Choose the default authorization type for the API: API Key
? Enter a description for the API key: demo
? After how many days from now the API key should expire: 7 (or your preferred expiration)
? Do you want to configure advanced settings for the GraphQL API: No
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields
? Do you want to edit the schema now?  Yes
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

API をデプロイするには、Amplify `push` コマンドを使用します。

```bash
push を増幅する
```

```console
? Are you sure you want to continue? Y

? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript (or your preferred language target)
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Y
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

これでAPIがデプロイされ、使用を開始できます。

`Todo` 型は `GraphQL Transform` ライブラリの [@model](~/cli/graphql-transformer/model.md) ディレクティブで飾られていたので。 CLI はクエリ、変更、サブスクリプション用の追加のスキーマとリゾルバ、および Todoist を保持する DynamoDB テーブルを作成しました。

プロジェクトにデプロイされたサービスをいつでも表示するには、Amplify `console` コマンドを実行して、Amplify Console に移動します。

```bash
増幅コンソール
```

## アプリケーションの設定

Amplifyを `yarn` または `npm` でアプリに追加します。

```bash
npm install aws-amplify
```

アプリのエントリポイント、すなわちApp.jsで、設定ファイルをインポートしてロードします。

```javascript
import Amplify, { API, graphqlOperation } from 'aws-amply';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```

## クエリ、変更、サブスクリプションを有効にする

GraphQL API がデプロイされたので、JavaScript クライアント アプリケーションからそれを操作する方法を学ぶ時間です。 GraphQL では、通常、次の種類の操作を行います。

- __Mutations__ - API へのデータの書き込み (create, update, delete operations)

```js
import { API } from 'aws-amplify';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';

const todo = { name: "My first todo", description: "Hello world!" };

/* create a todo */
await API.graphql(graphqlOperation(createTodo, {input: todo}));

/* update a todo */
await API.graphql(graphqlOperation(updateTodo, { input: { id: todoId, name: "Updated todo info" }}));

/* delete a todo */
await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));
```
- __クエリ__ - API からのデータの読み取り (リスト, 操作を取得)

```js
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';

const todos = await API.graphql(graphqlOperation(listTodos));
```

- __Subscriptions__ - リアルタイム機能のためのデータの変更を購読する (onCreate, onUpdate, oneDelete)

```js
import { API } from 'aws-amplify';
import { onCreateTodo } from './graphql/subscriptions';

// Subscribe to creation of Todo
const subscription = API.graphql(
    graphqlOperation(onCreateTodo)
).subscribe({
    next: (todoData) => {
      console.log(todoData);
      // Do something with the data
    }
});

// Stop receiving data updates from the subscription
subscription.unsubscribe();
```

### GraphQLスキーマの更新

CLI を使用して GraphQL バックエンドを作成する場合、バックエンドデータ構造のスキーマ定義が 2 つの場所のいずれかに保存されます。

1. デフォルトでは、スキーマは *amplify/backend/api/YOUR-API-NAME/schema.graphql*に保存されます。 `schema.graphql` ファイルが存在する場合は、オプション 2 より優先されます。
2. Optionally, schemas may be saved as a set of `.graphql` files stored in the *amplify/backend/api/YOUR-API-NAME/schema/* directory. E.g. you might have files `Query.graphql`, `User.graphql`, and `Post.graphql`.

API がデプロイされると、CLI でスキーマを簡単に更新できます。 スキーマファイルを編集し、 *増幅プッシュ* コマンドを実行してGraphQL バックエンドを更新できます。

例えば、サンプル GraphQL スキーマは次のようになります。

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

Todo タイプに *priority* フィールドを追加します。

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
  priority: String
}
```

スキーマファイルを保存し、GraphQL バックエンドを更新します。

```bash
push を増幅する
```

*push* コマンドを実行すると、スキーマの変更が自動的に検出され、バックエンドがそれぞれ更新されます。

```console
| Category | リソース名 | Operation | Provider プラグイン |
| -------------- | ------------ | ---------------- | ----------------- |
| Api | myapi | Update | awscloudforming |
```

アップデートが完了したら、次のコマンドを実行してGraphQLオプションを選択することで、バックエンドへの変更を確認できます。

```bash
api コンソール
? 以下のサービスから選択してください: (矢印キーを使用)
<unk> GraphQL
  REST
```

### GraphQLトランスフォーマーの使用

As you can notice in the sample schema file above, the schema has a `@model` directive. The `@model` directive leverages a set of libraries that can help simplify the process of bootstrapping highly scalable, serverless GraphQL APIs on AWS. The `@model` directive tells the GraphQL Transform that we would like to store Todo objects in an Amazon DynamoDB table and configure CRUD operations for it. When you create or update your backend with *push* command, the CLI will automatically create and configure a new DynamoDB table that works with your AppSync API. The `@model` directive is just one of multiple transformers that can be used by annotating your *schema.graphql*.

スキーマを定義する際には、以下のディレクティブを使用できます:

| Directive                                                         | 説明                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| [@model](~/cli/graphql-transformer/model.md) on Object            | DynamoDBにオブジェクトを格納し、CRUDリゾルバを設定します。                    |
| [@auth](~/cli/graphql-transformer/auth.md) on Object              | API の認証戦略を定義します。                                       |
| [@connection](~/cli/graphql-transformer/connection.md) on Field   | @model オブジェクト タイプ間のリレーションシップを指定します。                    |
| [@searchable](~/cli/graphql-transformer/searchable.md) on Object  | @modelオブジェクトタイプのデータをAmazon Elasticsearchサービスにストリームします。 |
| [@versioned](~/cli/graphql-transformer/versioned.md) on Object    | @modelにオブジェクトのバージョン管理と競合検出を追加します。                      |
| [@key](~/cli/graphql-transformer/key.md) on Object                | データをキーでインデックスします。                                      |
| [@function](~/cli/graphql-transformer/function.md) on Field       | LambdaリゾルバをAPIに接続します。                                  |
| [@predections](~/cli/graphql-transformer/predictions.md) on Field | 機械学習サービスを接続します。                                        |
| [@http](~/cli/graphql-transformer/http.md) on Field               | API 内で HTTP リゾルバを設定します。                                |

また、有用と思われる再現可能なパターンを実装するために、独自の変換器を書くこともできます。

### モックとローカルテスト

Amplifyは、クラウドにプッシュする前に、AWS AppSyncでアプリケーションをテストするためのローカルモックサーバの実行をサポートしています。 詳細は [CLI ツールチェーン ドキュメント](~/cli/usage/mock.md) を参照してください。

### GraphQLスキーマからクライアント型を生成

GraphQL データを使用している場合、型安全のためにスキーマから型をインポートすることが便利です。 Amplify CLIの自動コード生成機能でこれを行うことができます。 CLIは定義されたGraphQLエンドポイントからGraphQL Introspection Schemaを自動的にダウンロードし、TypeScriptまたはFlowクラスを生成します。 GraphQL API をプッシュするたびに、CLI が型とステートメントを生成するオプションを提供します。

GraphQL ステートメントとタイプを生成する場合は、次を実行します。

```bash
コードゲンを増幅する
```

ターゲット フォルダーに TypeScript または Flow 型定義ファイルが生成されます。

### 増幅フォルダ内の API 構成

The Amplify CLI will create an `amplify/backend/api` folder that will hold the existing GraphQL schema, resolvers, and additional configuration around the API. To learn more about how the CLI manages this configuration, check out the documentation [here](~/cli/graphql-transformer/overview.md). To learn how to configure custom GraphQL resolvers, check out the documentation [here](~/cli/graphql-transformer/resolvers.md).

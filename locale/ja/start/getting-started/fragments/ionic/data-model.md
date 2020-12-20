### GraphQL変換でデータをモデル

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
? Choose a schema template: 
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

## GraphQL API とデータベースの作成

以下のコマンドで構成されたAPIに必要なバックエンドリソースを作成します。

```bash
push を増幅する
```

### コード生成

Since you added an API the `amplify push` process will automatically prompt for codegen (select `y` when prompted for automatic query and code generation). For Ionic applications, choose **Angular** which will create an `API.service.ts` file in the app directory.

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

### API をテスト

AWSコンソールを開いて、新しいAPIに対していつでもクエリ、変更、またはサブスクリプションを実行するには、次のコマンドを実行します。

```bash
コンソールの api を増幅する
```

プロンプトが表示されたら、 **GraphQL**を選択します。 これにより、AWS AppSync コンソールが開き、クエリ、ミューテーションを実行できます。 またはサーバーでサブスクリプションを行い、クライアントアプリケーションの変更を確認します。

## フロントエンドを API に接続

__src/main.ts__ を更新してライブラリを設定します:

```javascript
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);
```

When working with underlying `aws-js-sdk`, the "node" package should be included in *types* compiler option. update your `src/tsconfig.app.json`:

```json
"compilerOptions": {
    "types" : ["node"]
}
```

注意: Angular 6 以上を使用している場合は、 `src/polyfills.ts` ファイルの先頭に以下を追加する必要があるかもしれません。
```
(window as any).global = window;

(window as any).process = {
  env: { DEBUG: undefined },
};
```

In your `src/app/app.component.ts` file, add the following imports and modifications to your class to to add data to your database with a mutation by using the `API.service` file which was generated when you ran `amplify add api`:

```javascript
import { APIService } from './API.service';

constructor(
    //other variables
    private apiService: APIService
  ){  
    this.initializeApp();
  }

  createTodo() {
    this.apiService.CreateTodo({
        name: 'ionic',
        description: 'testing'
    });
  }
```

Next, update `initializeApp()` in `src/app/app.component.ts` to list all items in the database by running a query on start and populating a local variable called `todos`:

```javascript
export class AppComponent {
  todos: Array<any>;

  initializeApp() {
    this.platform.ready().then(() => {
      //other code
      this.apiService.ListTodos().then((evt) => {
        this.todos = evt.items;
      });
    });
  }
}
```

`src/app/app.component.html` のコードを次のように更新して、todosのリストを表示します:

```html
<ion-app>
  <ion-button (click)="createTodo()">Add Data</ion-button>
  <ion-list>
    <ion-item *ngFor="let item of todos">
      <p>{{item.name}} - {{item.description}}</p>
    </ion-item>
  </ion-list>
</ion-app>

```

最後に、リアルタイムデータを購読する update `initializeApp()` アプリの起動時にサブスクリプションをセットアップし、新しいイベントを受信したときに `todos` 配列を更新します:

```javascript
initializeApp() {
  this.platform.ready().then(() => {
    //other code
    this.apiService.OnCreateTodoListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateTodo;
      this.todos = [...this.todos, data];
    });
  }
}
```

> 上記のコードは、APIとPubSub カテゴリのみをインポートします。Amplifyライブラリ全体をインポートするには、 `import Amplify from 'aws-anplify'`を使用します。 ただし、最終バンドルサイズを大幅に削減するため、必要なカテゴリのみをインポートすることをお勧めします。

`npm start` を使用してアプリを再起動した後、ブラウザーに戻り、開発ツールを使用すると、コンソールログからバックエンドに保存されているデータが表示されます。

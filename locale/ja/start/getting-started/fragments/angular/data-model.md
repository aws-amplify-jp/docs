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
# RestaurantAPI
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
# Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now?
# Yes
```

生成されたスキーマは Todo アプリ用です。GraphQL スキーマを `amplify/backend/api/RestaurantAPI/schema.graphql` に置換します。

```graphql
type Restaurant @model {
  id: ID!
  name: String!
  description: String!
  city: String!
}
```

 You'll notice a directive on the `Restaurant` type of `@model`. This directive is part of Amplify's [GraphQL transformer](~/cli/graphql-transformer/model.md) functionality.

GraphQL Transform ライブラリには、データモデルの定義などを行うためのスキーマで使用できるカスタムディレクティブが用意されています。 認証と認可ルールの設定、サーバレス機能をリゾルバとして設定するなど。

`@model` ディレクティブで装飾された型は、型 (Restaurant テーブル) のデータベーステーブルを骨格化します。 CRUD (作成、読み取り、更新、削除)およびリスト操作のためのスキーマ、およびすべてを一緒に動作させるために必要な GraphQL リゾルバ。

コマンドラインから __を押して__ を入力し、スキーマを受け入れ、次のステップに進みます。

## データベースで API を作成する

以下のコマンドで構成されたAPIに必要なバックエンドリソースを作成します。

```bash
amplify push

? Are you sure you want to continue? Y
? Do you want to generate code for your newly created GraphQL API: Y
? Choose the code generation language target: angular
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.graphql
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Y
? Enter maximum statement depth: 2
? Enter the file name for the generated code: src/app/API.service.ts
```

### コード生成

Once the deployment is complete, the CLI will create a new directory in `src/graphql` with all of the GraphQL operations you will need for your API. The CLI also created an `API.service.ts` file in the `app` directory that we will be using shortly.

次に、Amplifyの状態を確認するために次のコマンドを実行します。

```bash
増幅の状態
```

これにより、現在の環境を含むAmplifyプロジェクトの現在のステータスが得られます。 どのカテゴリーが作成されているかを調べることができます 以下のようになります。

```console
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| Api      | RestaurantAPI | No Change | awscloudformation |
```

### API のテスト

AWSコンソールを開いて、新しいAPIに対していつでもクエリ、変更、またはサブスクリプションを実行するには、次のコマンドを実行します。

```bash
コンソールの api を増幅する
```

プロンプトが表示されたら、 **GraphQL**を選択します。 これにより、AWS AppSync コンソールが開き、クエリ、ミューテーションを実行できます。 またはサーバーでサブスクリプションを行い、クライアントアプリケーションの変更を確認します。

## フロントエンドを API に接続

`src/main.ts` を開き、Amplify でAngularプロジェクトを構成するために次のコードを追加します。

```javascript
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);
```

<amplify-callout>上のコードはAmplifyライブラリ全体をインポートします。 `import Auth from '@aws-amplify/auth'` のように別々のインポートを使用して、最終バンドルサイズを小さくできます。</amplify-callout>

`tsconfig.app.json` を更新して、 *types* に "node" コンパイラー・オプションを含めます。

```json
"compilerOptions": {
    "types" : ["node"]
}
```

<amplify-callout>Depending on your TypeScript version you may need to rename `aws-exports.js` to `aws-exports.ts` prior to importing, or enable the `allowJs` <a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html" target="_blank">compiler option</a> in your tsconfig.</amplify-callout>

次に、 `Restaurant` 型を定義します。 `src/types/restaurant.ts`:

```ts
export type Restaurant = {
  id : string,
  name : string,
  description : string,
  city: string
};
```

In your `src/app/app.component.ts` file, use the following code to add data to your database with a mutation by using the `API.service` file which was generated when you ran `amplify add api`:

```javascript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from './API.service';
import { Restaurant } from '../types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'amplify-angular-app';
  public createForm: FormGroup;

  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating restaurant...', e);
    });
  }
}
```

次に、 `src/app/app.module.ts` でAngularフォームモジュールを有効にします。

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

/* new form imports */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyUIAngularModule,
    /* configuring form modules */
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

次に、レストランの作成に使用するフォームを追加します。 `src/app/app.component.html` に以下を追加します。

```html
<div class="form-body">
  <form autocomplete="off" [formGroup]="createForm" (ngSubmit)="onCreate(createForm.value)">
    <div>
      <label>Name: </label>
      <input type="text" formControlName="name" autocomplete="off">
    </div>
    <div>
      <label>Description: </label>
      <input type="text" formControlName="description" autocomplete="off">
    </div>
    <div>
      <label>City: </label>
      <input type="text" formControlName="city" autocomplete="off">
    </div>
    <button type="submit">Submit</button>
  </form>
</div>
```

Next, update your `AppComponent` class so that it will list all restaurants in the database when the app starts. To do so, implement [OnInit](https://angular.io/api/core/OnInit) add a `ListRestaurants` query in `src/app/app.component.ts`. Store the query results in an array.

```javascript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from './API.service';
import { Restaurant } from '../types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'amplify-angular-app';
  public createForm: FormGroup;

  /* declare restaurants variable */
  restaurants: Array<Restaurant>;

  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    /* fetch restaurants when app loads */
    this.api.ListRestaurants().then(event => {
      this.restaurants = event.items;
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating restaurant...', e);
    });
  }
}
```

追加したレストランを表示するには、 `src/app/app.component.html` に以下を追加してください。

```html
<div *ngFor="let restaurant of restaurants">
  <div>{{ restaurant.city }}</div>
  <div>{{ restaurant.name }}</div>
  <div>{{ restaurant.description }}</div>
</div>
```

Finally, to subscribe to realtime data, update `ngOnInit` in `src/app/app.component.ts`. When the app starts, this code will set up a subscription. The subscription will update the `restaurants` array when new events are received (when a new restaurant is created):

```javascript
async ngOnInit() {
  this.createForm = this.fb.group({
    'name': ['', Validators.required],
    'description': ['', Validators.required],
    'city': ['', Validators.required]
  });
  this.api.ListRestaurants().then(event => {
    this.restaurants = event.items;
  });

  /* subscribe to new restaurants being created */
  this.api.OnCreateRestaurantListener.subscribe( (event: any) => {
    const newRestaurant = event.value.data.onCreateRestaurant;
    this.restaurants = [newRestaurant, ...this.restaurants];
  });
}
```

次に、アプリを実行します。

```sh
npm start
```

アプリを2つのブラウザウィンドウで開きます(両方ともhttp://localhost:4200/)。アプリが並んで動作するようにします。 新しいアイテムを1つのウィンドウで作成する場合、別のウィンドウでリアルタイムに表示されます。

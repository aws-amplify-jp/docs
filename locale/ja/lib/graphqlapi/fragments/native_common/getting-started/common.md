Amplify APIカテゴリは、モデルデータの取得と永続化のためのインターフェースを提供します。APIカテゴリには、AWS AppSyncのデフォルトの組み込みサポートが付属しています。 Amplify CLI を使用すると、API を定義し、CRUD 操作とリアルタイム機能を備えた GraphQL サービスをプロビジョニングできます。

## 目標

アプリケーションをAmplify APIで設定し、バックエンドに項目を保存します。

## 前提条件

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/getting-started/10_preReq.md"></inline-fragment>

## API の設定

バックエンドで API リソースのプロビジョニングを開始するには、プロジェクト ディレクトリに移動し、 **コマンド** を実行します。

```bash
増幅して api を追加
```

プロンプトが表示されたら以下を入力します:
```console
? Please select from one of the below mentioned services: 
    `GraphQL`
? Provide API name: 
    `apiName`
? Choose the default authorization type for the API 
    `API key`
? Enter a description for the API key:
    `description`
? After how many days from now the API key should expire (1-365): 
    `7`
? Do you want to configure advanced settings for the GraphQL API 
    `No, I am done.`
? Do you have an annotated GraphQL schema? 
    `No`
? Do you want a guided schema creation? 
    `Yes`
? What best describes your project: 
    `Single object with fields (e.g., “Todo” with ID, name, description)`
? Do you want to edit the schema now? 
    `No`
```

<amplify-callout warning>

**Troubleshooting:** The AWS API plugins do not support conflict detection. If AppSync returns errors about missing `_version` and `_lastChangedAt` fields, or unhandled conflicts, disable **conflict detection**. Run `amplify update api`, and choose **Disable DataStore for entire API**.  If you started with the Getting Started guide, which introduces DataStore, this step is required.

</amplify-callout>

ガイド付きスキーマ作成は、以下を含む `amplify/backend/api/{api_name}/schema.graphql` を出力します。
```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

クラウドに変更をプッシュするには、 **コマンド** を実行します。

```bash
push を増幅する
```

プロンプトが表示されたら以下を入力します:
```console
?新しく作成したGraphQL API 
    `いいえ` 用のコードを生成しますか？
```

Upon completion, `amplifyconfiguration.json` will be updated to reference provisioned backend storage resources.  Note that these files should already be a part of your project if you followed the [Project setup walkthrough](~/lib/project-setup/create-application.md).

## Todo Model クラスの生成

`Todo` モデルを生成するには、プロジェクトフォルダにディレクトリを変更し、 **コマンド** を実行します。

```bash
コードゲンモデルを増幅する
```

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/getting-started/40_codegen.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/getting-started/40_codegen.md"></inline-fragment>

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/getting-started/20_installLib.md"></inline-fragment>

## Amplify APIを初期化

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/getting-started/30_initapi.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/getting-started/30_initapi.md"></inline-fragment>

## Todoを作成

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/getting-started/50_createtodo.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/getting-started/50_createtodo.md"></inline-fragment>

Upon successfully executing this code, you should see an instance of `todo` persisted in your dynamoDB table. To navigate to your backend, run `amplify console api` and choose `GraphQL`. This will open the AppSync console to your GraphQL service. Select `Data Sources` and select the Resource link in your `TodoTable` to bring you to the DynamoDB Console. Select the `items` tab to see the `Todo` object that has been persisted in your database.

## 次のステップ

おめでとうございます！ データベースに `Todo` オブジェクトを作成しました。以下のリンクを参照して、Amplify API の使用例を確認してください。

* [データを取得](~/lib/graphqlapi/query-data.md)
* [データを更新](~/lib/graphqlapi/mutate-data.md)
* [データを購読](~/lib/graphqlapi/subscribe-data.md)
* [コンセプト](~/lib/graphqlapi/concepts.md)
* [認証モードを設定](~/lib/graphqlapi/authz.md)

<!-- TODO: * [Authorizing API calls with Cognito User Pool] -->

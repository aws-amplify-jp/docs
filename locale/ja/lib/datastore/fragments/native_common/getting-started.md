
## Amplify付きデータストア

Amplify DataStoreは、オフラインおよびオンラインのシナリオで追加のコードを記述することなく、共有および分散データを活用するプログラミングモデルを提供します。 これにより、分散されたクロスユーザーデータをローカル専用のデータと同じくらい簡単に操作できます。

<amplify-callout>

**注意:** これにより、AWSアカウントなしでもDataStoreで端末にデータをローカルで持続させることができます。

</amplify-callout>

## 目標
Amplify DataStoreでアプリケーションをセットアップおよび設定し、デバイス上のデータをローカルに保持するために使用します。

## 前提条件

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/10_preReq.md"></inline-fragment>

<inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/20_installLib.md"></inline-fragment>

Amplifyビルドプロセスとプロジェクトを統合するには、2つのオプションがあります。

## ローカル開発環境のセットアップ

ローカル開発環境をセットアップするには、2つの選択肢があります。

### オプション1: プラットフォームの統合

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/30_platformIntegration.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/30_platformIntegration.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/30_platformIntegration.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/30_platformIntegration.md"></inline-fragment>

### オプション2: Amplify CLI を使用

Instead of using the platform integration, you can alternatively use the Amplify CLI on its own. This option is particularly **useful for existing projects** where Amplify is already configured and you want to add DataStore to it.

既存のプロジェクトをお持ちでない場合は、以下を実行して新しいAmplifyプロジェクトを作成してください。
```bash
initを増幅する
```

DataStoreアプリの基本構造は、アプリに新しいGraphQL APIを追加して作成されます。

```console
# 新しい API の場合
amplify add api

# 既存の API の場合
amplify update api
```

During the API configuration process select **GraphQL** as the API type and reply to the questions as follows. Make sure you respond **Yes, I want to make some additional changes** when prompted for **advanced settings** and turn on **conflict detection**. This setting is **required** when syncing data to the cloud since the conflict resolution strategy is what allows local data to be reconciled with data from the cloud backend.

```console
? Please select from one of the below mentioned services:
    `GraphQL`
? Provide API name:
    `BlogAppApi`
? Choose the default authorization type for the API
    `API key`
? Enter a description for the API key:
    `BlogAPIKey`
? After how many days from now the API key should expire (1-365):
    `365`
? Do you want to configure advanced settings for the GraphQL API
    `Yes, I want to make some additional changes.`
? Configure additional auth types?
    `No`
? Configure conflict detection?
    `Yes`
? Select the default resolution strategy
    `Auto Merge`
? Do you have an annotated GraphQL schema?
    `No`
? Choose a schema template
    `Single object with fields (e.g., “Todo” with ID, name, description)`
```

<amplify-callout warning>

**Troubleshooting:** Cloud sync will fail without the **conflict detection** configuration. In that case use `amplify update api` and choose **Enable DataStore for entire API** (this option will enable the conflict detection as described above).

</amplify-callout>

## 不屈の持続性

DataStore relies on platform standard data structures to represent the data schema in an idiomatic way. The persistence language is composed by data types that satisfies the `Model` interface and operations defined by common verbs such as `save`, `query` and `delete`.

### データスキーマ

永続的なデータストアによってバックアップされたアプリケーションを作成する最初のステップは、 **スキーマを定義する**です。 DataStoreは、GraphQLスキーマファイルをアプリケーションデータモデルの定義として使用します。スキーマには、アプリケーションの機能を表すデータ型とリレーションシップが含まれています。

<amplify-callout warning>

**Note:** When using Temporal Types, avoid using `AWSDate` and `AWSTime` within your schema.  We only support `AWSDateTime` and `AWSTimestamp` at the moment.

</amplify-callout>

### サンプル スキーマ

次のステップでは、小さなブログアプリケーションのスキーマから始めましょう。現在、それは単一のモデルのみを持っています。 より多くのコンセプトが表示されるにつれて、新しい型と構造がこのベーススキーマに追加されます。

Open the `schema.graphql` file located by default at `amplify/backend/{api_name}/` and **define a model** `Post` as follows.

```graphql
type Post @model {
  id: ID!
  title: String!
  status: PostStatus!
  rating: Int
  content: String
}

enum PostStatus {
  DRAFT
  PUBLISHED
}
```

プラットフォームに依存しない `schema.graphql` をプラットフォーム固有のデータ構造に変換します。 DataStoreはコード生成に依存し、スキーマがプラットフォームコードに正しく変換されることを保証します。

初期設定と同様に、モデルはIDE統合またはAmplifyのCLIを直接使用して生成できます。

### コード生成: プラットフォームの統合

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/40_codegen.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/40_codegen.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/40_codegen.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/40_codegen.md"></inline-fragment>

### Code generation: Amplify CLI

モデルは、Amplify CLI を直接使用して生成することもできます。

あなたの端末で、プロジェクト/ルートフォルダにいることを確認し、 **codegenコマンドを実行します。**:

```console
コードゲンモデルを増幅する
```

**で生成されたファイル** を `amplify/generated/models/`で見つけることができます。iOS の場合は必ずXcode プロジェクトに追加してください。

## Amplify DataStoreを初期化

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/50_initDataStore.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/50_initDataStore.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/50_initDataStore.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/50_initDataStore.md"></inline-fragment>

## 永続操作

これで、アプリケーションは持続性操作を実行する準備ができました。データはローカルデータベースに保持され、デフォルトでオフラインファーストのユースケースを有効にします。

GraphQL API は既にプロジェクトに追加されていますが。 クラウド同期は、API プラグインが初期化され、バックエンドがプロビジョニングされた場合にのみ有効になります。 詳細は [次のステップ](#next-steps) を参照してください。

### データベースに書き込み中

データベースに書き込むには、 `Post` モデルのインスタンスを作成して保存します。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/60_saveSnippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/60_saveSnippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/60_saveSnippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/60_saveSnippet.md"></inline-fragment>

### データベースから読み込み中

データベースから読み込むには、最も簡単なアプローチは、与えられたモデル タイプのすべてのレコードをクエリすることです。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/getting-started/70_querySnippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/getting-started/70_querySnippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/getting-started/70_querySnippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/getting-started/70_querySnippet.md"></inline-fragment>

## 次のステップ

おめでとうございます！ローカルデータベースからデータを作成し、取得しました。以下のリンクを参照して、他のAmplify DataStoreのユースケースや高度な概念を参照してください。

- [データの書き込み](~/lib/datastore/data-access.md#create-and-update)
- [クエリデータ](~/lib/datastore/data-access.md#query-data)
- [モデルの関連](~/lib/datastore/relational.md)
- [クラウドの同期](~/lib/datastore/sync.md)
- [ローカルデータを消去](~/lib/datastore/sync.md#clear-local-data)

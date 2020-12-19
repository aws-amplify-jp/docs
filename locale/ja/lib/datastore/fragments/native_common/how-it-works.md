
Amplify DataStore は、書き込み、読み込みを行うための永続的なデバイス上のストレージリポジトリを提供します。 オンラインまたはオフラインの場合はデータの変更を監視し、クラウドやデバイス間でシームレスに同期できます。 アプリケーションのデータモデリングはGraphQLを使用し、JavaScript、iOS、またはAndroidアプリケーションで使用されるモデルに変換されます。 AWS AppSync と Amazon DynamoDB を使用して、AWS アカウントなしで DataStore をオフラインのユースケースに使用することができます。「ローカルのみ」モードでは、バックエンド全体をプロビジョニングすることができます。 DataStore には、GraphQL バックエンドといくつかの競合解決戦略を使用した Delta Sync が含まれています。

## 仕組み <iframe src="https://www.youtube-nocookie.com/embed/KcYl6_We0EU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

Amplify DataStoreは、クラウドと同期している間、ローカルデータとやり取りするためのデバイス上の永続的なリポジトリです。 GraphQL を使用してアプリケーションのデータモデリングに焦点を当てることです。 必要なときに認可ルールやビジネスロジックをアプリケーションに追加します。 これは、Amplify CLI プロジェクトの機能 (`amplify add auth` または `amplify add function`) および [GraphQL 変換器](~/cli/graphql-transformer/overview.md) を使用して行うことができます。

## ローカルでモデルデータ

(AWS アカウントの有無にかかわらず) GraphQL スキーマから始まるコード生成プロセスは、プログラミングプラットフォームのドメインネイティブ構造である *モデル* を作成します。 Java、Swiftクラス)。 この「modelgen」プロセスは、ターミナルで手動で行われるAmplifyのCLIまたはCLIプロセスを呼び出すビルドツールを使用して行われます(NPXスクリプト)。 Gradle, Xcode ビルドフェーズ)。

モデルが生成されると、DataStore API を使用して変更を保存、クエリ、更新、削除、または監視することができます。 ランタイムモデルは *ストレージアダプタ* を持つ *ストレージエンジン*に渡されます。 Storage Engineは、開発者のGraphQLスキーマによって定義されたモデルの「モデルリポジトリ」と、クラウドと同期する際に、メタデータ(設定など)とネットワーク上で更新をキューイングするために使用される「システムモデル」を管理します。 AmplifyはSQLiteやIndexedDBなどのデフォルトのStorage Adapter実装で出荷されます。 しかし、このパターンは、将来、コミュニティへの貢献を可能にし、1つの技術に固有のものではありません(e. を選択します。

![画像](~/images/storage.png)

開発者アプリケーション・コードが DataStore API と相互作用する場合 モデルリポジトリにGraphQLタイプの特定のモデルを保存し、シリアル化 & 特定のストレージアダプター表現の持続性に適切な場合にデシリアライズすることは、ストレージエンジンの責任です。 これには、GraphQL 固有の型からのデータベースエンジン内の適切な構造への変換が含まれます (e. format@@0 Int `から` Int64 `Int64`)。

## クラウドにデータを同期

If a developer chooses to sync with the cloud, the Amplify CLI will use the GraphQL schema to deploy an AWS AppSync backend with DynamoDB tables for each type and an additional table used for *Delta Sync*. Other AWS services such as Amazon Cognito or AWS Lambda will also be deployed if added to the project. Once this completes the local configuration for the platform (`aws-exports.js` or `amplifyconfiguration.json`) will be generated inside the project and updated with settings and endpoint information.

> アプリケーションは、Delta Sync テーブルに書き込んだり、変更したりしないでください。これは、DataStore 実装の内部です。

If the DataStore starts up and sees API information to sync with an AppSync endpoint, it will start an instance of its *Sync Engine*. This component interfaces with the Storage Engine to get updates from the Model Repository. These components use an *Observer* pattern where the Sync Engine publishes events whenever updates happen in it (such as data being added, updated, or deleted) and both the DataStore API and Sync Engine subscribe to this publication stream. This is how the developer knows when updates have happened from the cloud by interacting with the DataStore API, and conversely how the Sync Engine knows when to communicate with the cloud when applications have made updates to data.

![画像](~/images/sync.png)

ストレージエンジンから同期エンジンに通知が入ると、実行時にモデルリポジトリからの情報をGraphQL文に変換します。 これには、各タイプのすべての create/update/delete 操作のサブスクライブ、およびクエリや変更の実行が含まれます。

The Sync Engine will run a GraphQL query on first start that hydrates the Storage Engine from the network using a *Base Query*. This defaults to a limit of 100 items at a time and will paginate through up to 1000 items. It will then store a *Last Sync Time* and each time the device goes from an offline to online state, it will use this as an argument in a *Delta Query*. When AppSync receives this Last Sync Time in its argument list it will only returned the changes that have been missed by pulling items in a Delta Table.

All items (or "objects") are versioned by *Sync Enabled Resolvers* in AppSync using monotonically increasing counters. Clients never update versions, only the service controls versions. The Sync Engine receives new items or updates from GraphQL operations and applies them with their versions to the Storage Engine. When items are updated by application code they are always written to a queue and the Sync Engine sends them to AppSync using the currently known version as an argument (`_version`) in the mutation.

## 競合の解決

When multiple clients send concurrent updates using the same version and conflict resolution is configured, a strategy for conflict resolution will be entered. The default strategy for clients is Automerge where the GraphQL type information is used to inspect the update and compare it to the current item that has been written to your table. Any non-conflicting fields are merged with the item and any lists will have values appended, with the service updating the item version as appropriate. You can change this default to apply version checks to the entire object with *Optimistic Concurrency* where the latest written item to your database will be used with a version check against the incoming record, or alternatively you can use a Lambda function and apply any custom business logic you wish to the process when merging or rejecting updates. In all cases the service controls the versions. For more information on how these conflict resolution rules work please [see the AWS AppSync documentation](https://docs.aws.amazon.com/appsync/latest/devguide/conflict-detection-and-sync.html).

## AppSync コンソールからデータを書き込み中

DataStoreは、開発者がバックエンドに集中する必要がなく、アプリケーションコードとワークフローがすべてを作成できるように設計されています。 ただし、AppSync コンソール、Lambda 関数を使用するユースケースがいくつかあります。 または他の帯域外のプロセスでデータを書き込み(バッチアクションやデータ移行など)、DataStoreクライアントなしでGraphQL操作を送信することもできます。

In these cases it's important that the selection set of your GraphQL mutation includes all the required fields of the model, including: `_lastChangedAt`, `_version`, and `_deleted` so that the DataStore clients can react to these updates. You will also need to send the **current** object version in the mutation input argument as `_version` so that the service can act accordingly. If you do not send this information the clients will still eventually catch up during the global sync process, but you will not see realtime updates to the client DataStore repositories. An example mutation:

```graphql
mutation UpdatePost {
  updatePost(input: {
    id: "12345"
    title: "updated title 19:40"
    status: ACTIVE
    rating: 5
    _version: 7
  }) {
    id
    title
    status
    rating
    _lastChangedAt
    _version
    _deleted
  }
}
```

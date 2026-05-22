---
title: "機能パリティ"
section: "start/migrate-to-gen2"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-05-14T20:45:03.000Z"
url: "https://docs.amplify.aws/react/start/migrate-to-gen2/feature-matrix/"
---

このページを使用して、Gen 1 のどの機能が Gen 2 で利用可能であり、どのように変更されたかを理解します。

## バックエンドカテゴリ

以下の表は、バックエンドリソース定義に関する Gen 1 と Gen 2 の機能の可用性を比較しています。**Migration Tool** 列は、[移行ツール](/[platform]/start/migrate-to-gen2/migrate-existing-app/)がこの機能に対して提供するサポートのレベルを示しています。

<details><summary>Migration Tool の凡例</summary>

**🟢 完全にサポート**

ツールは Gen 2 コードを生成し、既存のリソースをリファクタリングできます。

**🟠 生成のみ**

ツールは Gen 2 コードを生成できますが、この機能はツールが持たないリファクタリングサポートが必要です。リファクタリング中にスキップするように指示された場合、これらのリソースからデータを手動で移動または移行する必要があります。例えば、Geo (GeofenceCollection) はコード生成できますが、既存のジオフェンスデータを新しい Gen 2 リソースに自動的に移動することはできません。

**🔴 サポートされていない**

ツールは生成またはリファクタリング中にこの機能をサポートしていません。スキップするように指示された場合、ツールはこの機能なしで続行します。移行を完了するには、Gen 2 コードを手動で作成し、関連するデータを移行する必要があります。サポートされていないいくつかの機能には、手動でのデータ複製が必要なステートフルなリソースが含まれます。例えば、`@searchable` は OpenSearch ドメインをインデックス付きデータで作成し、これを Gen 2 で再作成および再入力する必要があります。他の機能は純粋にステートレスであり、CDK コードを記述することによる手動設定のみが必要です。例えば、Python Lambda 関数は、データ移行を必要としない、Gen 2 コードで CDK を使用して再定義するだけです。

必要な機能がまだサポートされていない場合は、[フィーチャーリクエストを作成してください](https://github.com/aws-amplify/amplify-cli/issues/new?labels=gen2-migration,feature-request&template=2.feature_request.yaml)。

</details>

### Auth

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| ユーザー名の設定 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🟢 |
| メールの設定 | Yes | Yes | 🟢 |
| 電話番号の設定 | Yes | Yes | 🟢 |
| Facebook | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/external-identity-providers/) | 🟢 |
| Google | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/external-identity-providers/) | 🟢 |
| Amazon | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/external-identity-providers/) | 🟢 |
| Apple でサインイン | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/external-identity-providers/) | 🟢 |
| ユーザープールグループの追加 | Yes | Yes | 🟢 |
| ユーザープールグループの設定 | Yes | Yes | 🟢 |
| サインアップ属性 | Yes | Yes | 🟢 |
| Auth トリガーサポート | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: Google reCaptcha チャレンジを追加 | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: グループにユーザーを追加 | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: メールドメインフィルタリング (拒否リスト) | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: メールドメインフィルタリング (許可リスト) | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: ID トークンクレームをオーバーライド | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: カスタム認証チャレンジフロー | Yes | Yes | 🟢 |
| Auth トリガーテンプレート: メール検証リンクリダイレクト | Yes | [Yes](/[platform]/build-a-backend/auth/customize-auth-lifecycle/) | 🔴 |
| デフォルトパスワードポリシーの設定 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🟢 |
| 属性の読み取り/書き込み機能の設定 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| OAuth フロー: 認可 v インプリシット付与を設定 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| 管理者クエリ | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| MFA: OFF | Yes | Yes | 🟢 |
| MFA: ON | Yes | Yes | 🟢 |
| MFA: OPTIONAL | Yes | Yes | 🟢 |
| MFA: SMS | Yes | Yes | 🟢 |
| MFA: TOTP | Yes | Yes | 🟢 |
| OAuth スコープを設定 | Yes | [Yes](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| メール検証 - コード | Yes | Yes | 🟢 |
| メールベースのユーザー登録/パスワード忘れ | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/email/) | 🔴 |
| OAuth フロー: リダイレクト URI を設定 | Yes | [Yes](/[platform]/build-a-backend/auth/concepts/external-identity-providers/) | 🔴 |
| ユーザープールのフレンドリー名を設定する機能 | Yes | Yes | - |
| 認証なしのログイン | Yes | Yes | 🟢 |
| カスタム属性 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🟢 |
| OAuth フロー: ドメイン名プレフィックスを設定 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| 一流の OIDC サポート | No | Yes | - |
| 一流の SAML サポート | No | Yes | - |
| 認証のインポート | Yes | Yes | 🟢 |
| 認証のオーバーライド | Yes | [Yes](/[platform]/build-a-backend/auth/modify-resources-with-cdk/) | 🔴 |
| Lambda トリガー (すべてのタイプ) | Yes | Yes | 🟢 |

### Data

> **Info:** 移行ツールは GraphQL スキーマをネイティブ Gen 2 スキーマビルダー API (`a.model()`, `a.string()` など) に変換しません。代わりに、既存の文字列ベースの GraphQL スキーマは Gen 2 データ定義内でそのまま保持されます。

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| model | Yes | Yes | 🟢 |
| primaryKey | Yes | Yes | 🟢 |
| secondaryKey (name, sortKeyFields, query) | Yes | Yes | 🟢 |
| hasOne | Yes | Yes | 🟢 |
| hasMany | Yes | Yes | 🟢 |
| belongsTo | Yes | Yes | 🟢 |
| manyToMany | Yes | No | 🔴 |
| default | Yes | Yes | 🟢 |
| auth - public - apiKey | Yes | Yes | 🟢 |
| auth - public - iam | Yes | Yes | 🟢 |
| auth - owner - userPools | Yes | Yes | 🟢 |
| auth - private - userPools | Yes | Yes | 🟢 |
| auth - private - iam | Yes | Yes | 🟢 |
| auth - group - userPools | Yes | Yes | 🟢 |
| auth - custom - function | Yes | Yes | 🟢 |
| searchable | Yes | No (Zero-ETL DynamoDB-to-OpenSearch を使用したガイド) | 🔴 |
| predictions | Yes | No (AI サービス統合ガイド) | 🔴 |
| カスタムミューテーション、クエリ、サブスクリプション | Yes | Yes | 🟢 |
| VTL ハンドラー | Yes | CDK を使用した Yes | 🟢 |
| JavaScript リゾルバーハンドラー | No | Yes | - |
| function ハンドラー | Yes | Yes | 🟢 |
| http ハンドラー | Yes | Yes (http を含むカスタムデータソース) | 🟢 |
| DataStore サポート | Yes | No | 🔴 |
| MySQL と PostgreSQL サポート | No | Yes | - |

### API

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| GraphQL: API キー認証 | Yes | Yes | 🟢 |
| GraphQL: Cognito ユーザープール認証 | Yes | Yes | 🟢 |
| GraphQL: IAM 認証 | Yes | Yes | 🟢 |
| GraphQL: OpenID Connect 認証 | Yes | Yes | 🔴 |
| GraphQL: Lambda 認証 | Yes | Yes | 🔴 |
| GraphQL: 競合検出 (DataStore) | Yes | No | 🔴 |
| REST API | Yes | Yes | 🟢 |
| REST: API アクセスを制限 | Yes | Yes | 🟢 |
| REST: Auth/Guest/Group のアクセス許可 | Yes | Yes | 🟢 |
| カスタム JS/VTL リゾルバー | Yes | Yes | 🔴 |
| Amplify リゾルバーをオーバーライド/拡張 | Yes | Yes | 🔴 |
| API をオーバーライド | Yes | [Yes (CDK を経由)](/[platform]/build-a-backend/data/override-resources/) | 🔴 |

### Storage

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| S3 バケットのプロビジョニング機能 | Yes | Yes | 🟢 |
| Auth とゲストのアクセス | Yes | [Yes](/[platform]/build-a-backend/storage/authorization/#for-gen-1-public-protected-and-private-access-pattern) | 🟢 |
| Auth - CRUD アクセスを設定 | Yes | Yes | 🟢 |
| Cognito グループの CRUD アクセスを設定 | Yes | Yes | 🟢 |
| ゲスト - CRUD アクセスを設定 | Yes | Yes | 🟢 |
| S3 バケットの Lambda トリガー | Yes | Yes | 🟢 |
| 単一の S3 バケットをインポート | Yes | [Yes](https://docs.amplify.aws/react/frontend/storage/use-with-custom-s3/) | 🔴 |
| 複数の S3 バケットをインポート | No | [Yes](https://docs.amplify.aws/react/frontend/storage/use-with-custom-s3/) | 🔴 |
| ストレージをオーバーライド | Yes | [Yes](/[platform]/build-a-backend/storage/extend-s3-resources/) | 🔴 |
| S3 Lambda トリガー | Yes | Yes | 🟢 |
| NoSQL データベース | Yes | Yes | 🟢 |
| NoSQL: ソートキー、グローバルセカンダリインデックス | Yes | Yes | 🟢 |
| NoSQL: Lambda トリガー | Yes | Yes | 🟢 |

### Functions

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| Function ランタイム: TypeScript | No | Yes | - |
| Function ランタイム: NodeJS | Yes | Yes | 🟢 |
| Function ランタイム: .NET 6 | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/custom-functions/) | 🔴 |
| Function ランタイム: Go | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/custom-functions/) | 🔴 |
| Function ランタイム: Java | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/custom-functions/) | 🔴 |
| Function ランタイム: JavaScript | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/custom-functions/) | 🔴 |
| Function ランタイム: Python | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/custom-functions/) | 🔴 |
| Function リソースアクセス権限: auth | Yes | Yes | 🟢 |
| Function リソースアクセス権限: function | Yes | [Yes](/[platform]/build-a-backend/functions/grant-access-to-other-resources/) | 🔴 |
| Function リソースアクセス権限: API | Yes | Yes | 🟢 |
| Function リソースアクセス権限: カスタム | No | Yes | - |
| Function リソースアクセス権限 CRUD 操作 | Yes | Yes | 🟢 |
| Function リソースアクセス権限: geo | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/grant-access-to-other-resources/#using-cdk) | 🔴 |
| Function リソースアクセス権限: analytics | Yes | [Yes (CDK を使用)](/[platform]/build-a-backend/functions/grant-access-to-other-resources/#using-cdk) | 🟢 |
| 環境変数 | Yes | Yes | 🟢 |
| シークレット | Yes | [Yes](/[platform]/build-a-backend/functions/environment-variables-and-secrets/) | 🔴 |
| Cron ジョブ | Yes | Yes | 🟢 |
| メモリサイズの設定 | Yes | Yes | 🟢 |
| Lambda レイヤー | Yes | [Yes](/[platform]/build-a-backend/functions/add-lambda-layers/) | 🔴 |
| カスタム IAM ポリシー | Yes | [Yes](/[platform]/build-a-backend/functions/grant-access-to-other-resources/) | 🔴 |
| Function テンプレート: Hello World | Yes | Yes | 🟢 |
| Function テンプレート: DynamoDB の CRUD | Yes | Yes | 🟢 |
| Function テンプレート: サーバーレス express | Yes | Yes | 🟢 |
| Function テンプレート: Lambda トリガー | Yes | Yes | 🟢 |

### Hosting

> **Info:** 移行ツールは `amplify.yml` ビルドスペックファイルを生成するため、Amplify Hosting サービスを通じてアプリをデプロイおよび公開できます。詳細は [ビルド仕様リファレンス](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html) を参照してください。

| 機能 | Gen 1 | Gen 2 |
|---|---|---|
| Amplify Console (Git ベースの継続的デプロイ) | [Yes](https://docs.amplify.aws/gen1/javascript/tools/cli/hosting/#type-of-deployments) | Yes |
| Amplify Console (手動デプロイ) | [Yes](https://docs.amplify.aws/gen1/javascript/tools/cli/hosting/#type-of-deployments) | No |
| Amazon CloudFront と S3 | [Yes](https://docs.amplify.aws/gen1/javascript/tools/cli/hosting/#amazon-s3-and-amazon-cloudfront) | No |

> 包括的な Gen 2 デプロイメントオプションのガイダンスについては、完全な [デプロイと公開](/[platform]/deploy-and-host/) ドキュメントを参照してください。

Gen 1 では、デプロイは通常、カスタムパイプラインを使用して `amplify push` (バックエンド) と `amplify publish` (フロントエンド) を通じて行われるか、Amplify Hosting サービスを通じて自動的に行われていました。Gen 2 では、これらのコマンドは存在しなくなりました。

#### Amplify Hosting

最も簡単な方法は、Amplify Console (_App Settings → Branch Settings → Add Branch_) で Git ブランチを接続することです。詳細については、[ブランチデプロイメント](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/branch-deployments/) を参照してください。

カスタムバックエンドパイプラインを使用しているがフロントエンド用に Amplify Hosting を使用したい場合は、`amplify.yml` ビルドスペックを更新して `pipeline-deploy` の代わりに `npx ampx generate outputs` を実行し、バックエンドパイプラインが成功した後、受信 Webhook を使用してフロントエンドビルドをトリガーしてください。

> **Warning:** Gen 1 アプリが**手動デプロイ**を使用する場合 (つまり、Git リポジトリに接続されていない場合)、Amplify Console では同じアプリに Git ベースのブランチデプロイメントを追加することは許可されません。この場合、新しい Amplify アプリを作成し、Git リポジトリを接続する必要があります。

#### カスタムパイプライン

Gen 1 とは異なり、Gen 2 のデプロイメントは常に Amplify アプリ ID とブランチ名を必要とします。独自の CI/CD システム (AWS CodePipeline、Jenkins、CodeCatalyst など) または SVN などの Git 以外の VCS を使用する場合、`ampx` CLI を使用して Gen 2 デプロイメントを直接実行できます。いくつかの 1 回限りのセットアップを実行する必要があります:

```bash
# (オプション) 新しい Amplify App を作成 — 既存のアプリを再利用しない場合のみ必要
aws amplify create-app --name my-app

# パイプラインがデプロイするブランチ名を登録
# (これは論理名であり、必ずしも実 Git ブランチではない)
aws amplify create-branch --app-id <APP_ID> --branch-name gen2-main

# 自動ビルドを無効にして、Amplify が git push でビルドしないようにする
aws amplify update-branch --app-id <APP_ID> --branch-name gen2-main --no-enable-auto-build
```

次に、パイプラインのビルドステップで:

```bash
npm ci
export CI=1
npx ampx pipeline-deploy --branch gen2-main --app-id <AMPLIFY_APP_ID>
```

> **Info:** `--branch` パラメーターは Git ref ではなく論理名です。任意の文字列を使用できます (`trunk`, `release-1.0` など)。ビルド時に `amplify/` フォルダがワーキングディレクトリに存在する必要があります。

詳細は、[カスタムパイプラインガイド](/[platform]/deploy-and-host/fullstack-branching/custom-pipelines/) を参照してください。

#### Amplify なしのフロントエンドホスティング

フロントエンドを個別にホストしている場合 (S3 + CloudFront、オンプレミスなど)、パイプラインで `npx ampx generate outputs` を実行して `amplify_outputs.json` を生成し、フロントエンドビルドアーティファクトにバンドルしてください。

### その他のカテゴリ

<!-- Platform: android, swift -->
[Amplify JS Auth API ドキュメント](/[platform]/frontend/auth/)

| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| REST API | Yes | No | - |
| Analytics | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/analytics/) | 🔴 |
| Geo (Map) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟢 |
| Geo (PlaceIndex) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟢 |
| Geo (GeofenceCollection) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟠 |
| Predictions | Yes | No | 🔴 |
| Interactions | Yes | No | 🔴 |
| カスタム (CDK) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/custom-resources/) | 🟢 |
| カスタム (CFN) | Yes | [Yes (CfnInclude を使用)](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.cloudformation_include.CfnInclude.html) | 🔴 |
<!-- /Platform -->

<!-- Platform: flutter -->
| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| REST API | Yes | Yes (カスタム CDK を使用) | - |
| Analytics | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/analytics/) | 🔴 |
| Geo | No | No | - |
| Predictions | No | No | - |
| Interactions | No | No | - |
| カスタム (CDK) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/custom-resources/) | 🟢 |
| カスタム (CFN) | Yes | [Yes (CfnInclude を使用)](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.cloudformation_include.CfnInclude.html) | 🔴 |
<!-- /Platform -->

<!-- Platform: angular,javascript,nextjs,react,react-native,vue -->
| 機能 | Gen 1 | Gen 2 | Migration Tool |
|---|---|---|---|
| REST API | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/rest-api/) | 🟢 |
| Analytics (Kinesis) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/analytics/) | 🟢 |
| Analytics (Pinpoint) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/analytics/) | 🔴 |
| Geo (Map) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟢 |
| Geo (PlaceIndex) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟢 |
| Geo (GeofenceCollection) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/geo/) | 🟠 |
| Predictions | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/predictions/) | 🔴 |
| Interactions | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/interactions/) | 🔴 |
| カスタム (CDK) | Yes | [Yes (カスタム CDK を使用)](/[platform]/build-a-backend/add-aws-services/custom-resources/) | 🟢 |
| カスタム (CFN) | Yes | [Yes (CfnInclude を使用)](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.cloudformation_include.CfnInclude.html) | 🔴 |
<!-- /Platform -->

## ツールと ワークフロー

### CLI

Gen 2 は Gen 1 の CLI ウィザードアプローチを TypeScript と CDK を使用したコードファーストモデルに置き換えます。以下の表は主要な違いをまとめています:

| 側面 | Gen 1 | Gen 2 |
|---|---|---|
| CLI インストール | グローバル (`npm i -g @aws-amplify/cli`) | ローカル devDep (`npm i @aws-amplify/backend-cli`)、`npx` 経由で実行 |
| バックエンド定義 | CLI ウィザード + `amplify/` の JSON/GraphQL ファイル | `amplify/` の TypeScript + CDK |
| 環境管理 | `amplify env add/checkout/list` | Git ブランチ (またはカスタムパイプラインの論理ブランチ名) |
| ローカル開発 | `amplify mock` (ローカルエミュレーション) | `npx ampx sandbox` (開発者ごとの実クラウドリソース) |
| デプロイメント | `amplify push` | `npx ampx pipeline-deploy` または Amplify Hosting 自動ビルド |
| フロントエンド設定ファイル | `amplifyconfiguration.json` / `aws-exports.js` | `amplify_outputs.json` |
| リソースのオーバーライド | `amplify override <category>` | `amplify/backend.ts` の直接 CDK アクセス |
| リソースの追加 | `amplify add <category>` | `define*()` 関数を使用した TypeScript 定義 |
| シークレット | `amplify function update` シークレットプロンプト | `npx ampx sandbox secret set <NAME>` またはコンソール + コードの `secret()` |
| コード生成 | `amplify codegen` / `amplify codegen model` | 必須ではありませんが、オプションで `npx ampx generate graphql-client-code` |

Gen 2 CLI (`@aws-amplify/backend-cli`) は `npx ampx <command>` で呼び出されます。すべてのコマンドは AWS CLI 環境変数 (`AWS_PROFILE`, `AWS_REGION`) をサポートしています。完全な [CLI コマンドリファレンス](https://docs.amplify.aws/react/reference/cli-commands/) を参照してください。

<details><summary>完全なコマンドマッピング表</summary>

| Gen 1 コマンド | Gen 2 相当 | 注記 |
|---|---|---|
| `amplify init` | 相当なし | Gen 2 プロジェクトは `amplify/` フォルダを TypeScript 定義で作成することによって初期化されます。新規プロジェクトの場合は `npm create amplify@latest` を使用します。 |
| `amplify add auth` | `amplify/auth/resource.ts` の `defineAuth()` | コードファーストの定義。CLI コマンドは必要ありません。 |
| `amplify add api` | `amplify/data/resource.ts` の `defineData()` | GraphQL スキーマは TypeScript で定義されます。 |
| `amplify add storage` | `amplify/storage/resource.ts` の `defineStorage()` | S3 バケット構成はコードで定義されます。 |
| `amplify add function` | `amplify/functions/<name>/resource.ts` の `defineFunction()` | Lambda 関数はコードで定義されます。Gen 2 は既定で TypeScript ランタイムを使用します。 |
| `amplify add hosting` | 削除 | Amplify Hosting ブランチデプロイメントまたはカスタムパイプラインを使用します。Amplify Hosting の場合は [aws amplify CLI](https://docs.aws.amazon.com/cli/latest/reference/amplify/) を使用します。 |
| `amplify push` | `npx ampx pipeline-deploy --branch <branch> --app-id <id>` | バックエンドインフラストラクチャをデプロイします。サンドボックスモードでは、`npx ampx sandbox` を使用します。 |
| `amplify publish` | 削除 | push + フロントエンドデプロイのラッパーでした。パイプラインまたは Amplify Hosting を代わりに使用します。 |
| `amplify pull` | `npx ampx generate outputs --branch <branch> --app-id <id>` | フロントエンド用の `amplify_outputs.json` を生成します。 |
| `amplify env add` | 新しい git ブランチを作成 | Gen 2 環境は git ブランチにマップされます。各ブランチは独自の CloudFormation スタックを取得します。 |
| `amplify env checkout` | `git checkout <branch>` + `npx ampx generate outputs` | ブランチを切り替えてから、出力を再生成します。 |
| `amplify env list` | Amplify Console をチェックするか [list branches](https://docs.aws.amazon.com/cli/latest/reference/amplify/list-branches.html) | 直接 CLI 相当なし。 |
| `amplify status` | `npx ampx sandbox` (ウォッチモードはドリフトを表示) | 直接ステータスコマンドなし。サンドボックスはライブフィードバックを提供します。 |
| `amplify delete` | `npx ampx sandbox delete` (サンドボックスのみ) | ブランチ環境の場合、Amplify Console でブランチを切断します。 |
| `amplify codegen` | `npx ampx generate graphql-client-code` | GraphQL ステートメントと型を生成します。 |
| `amplify codegen model` | `npx ampx generate graphql-client-code --format modelgen` | モバイル/JS のモデルクラスを生成します。 |
| `amplify configure` | AWS CLI プロファイル設定 | Gen 2 は標準的な AWS プロファイルを使用します。Amplify 固有の設定ステップはありません。 |
| `amplify mock` | `npx ampx sandbox` | サンドボックスは開発者ごとの実クラウドリソースをデプロイします。Gen 2 にはローカルモックはありません。 |
| `amplify override <category>` | `amplify/backend.ts` の直接 CDK 修正 | Gen 2 はネイティブに完全な CDK アクセスを提供します。 |

</details>

### コンソール & デベロッパーエクスペリエンス

これらはランタイム、コンソール、ツール機能であり、バックエンドリソース定義の一部ではなく、インフラストラクチャの移行を伴いません。

| 機能 | Gen 1 | Gen 2 |
|---|---|---|
| コンソールでの Auth 設定 | Yes | No |
| コンソールでのユーザー管理 | Yes | Yes |
| ゼロコンフィグ Authenticator サポート | Yes | Yes |
| データビジュアル設定 (Studio) | Yes | No (Gen 2 はデザイン上コードファースト) |
| IDE エンドツーエンド型安全性 | No | Yes |
| コンソールのストレージファイルブラウザー | Yes | Yes |
| ストレージビジュアル設定 (Studio) | Yes | No (Gen 2 はデザイン上コードファースト) |
| ローカルテスト | `amplify mock` | `npx ampx sandbox` (クラウドサンドボックス) |
| コンソールの Function ログ | Yes | Yes |

### UI Builder

Gen 1 UI Builder は Amplify Studio (Gen 1 アプリケーションを管理するためのビジュアルツール) の一部です。Gen 2 にはそのようなビジュアルツールは存在しませんが、[Amplify UI Builder Figma Plugin](https://www.figma.com/community/plugin/1040722185526429545) を使用することでほぼ完全な機能パリティを実現できます。

前提条件: [Amplify UI Kit](https://www.figma.com/community/file/1047600760128127424) に基づいて Figma を使用して設計し、Amplify UI Builder Plugin をインストールします。

| 機能 | Gen 1 (Studio) | Gen 2 (Figma Plugin) |
|---|---|---|
| テーマの調整とカスタムコンポーネントの作成 | サポート対象 | サポート対象 |
| エクスポート前にコンポーネントをデータモデルに接続 | サポート対象 (既存のデータモデルが必要) | サポートされていない。エンジニアリング作業の一部として Amplify Data に接続します。 |
| プロジェクトへのコンポーネントのエクスポート | UI Builder 経由でサポート対象 | Plugin 経由でサポート対象 |

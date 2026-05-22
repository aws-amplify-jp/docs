---
title: "既存の Gen 1 環境を Gen 2 に移行する"
section: "start/migrate-to-gen2"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-05-14T20:45:03.000Z"
url: "https://docs.amplify.aws/react/start/migrate-to-gen2/migrate-existing-app/"
---

> **Warning:** **開発者プレビュー**
> 
> 移行ツールは本番リソースで動作し、慎重に実行する必要があります。このツールは各ステップで対話的な確認が必要です。実行前に確認内容をよく確認してください。このツールは無人で実行することは**推奨されていません**。人間の監督下での実行が想定されています。

Gen 1 環境を Gen 2 に移行することは、アプリケーションの基礎となる CloudFormation インフラストラクチャの変更を伴います。移行ツールは大部分の作業を自動化しますが、各ステップでの確認が必要です。何が起こっているのか、そしてなぜそれが必要なのかを理解することは、スムーズな移行に不可欠です。ステップバイステップガイドを開始する前に、以下の概念と一般的なトピックを読むことをお勧めします。

## 概要

このガイド全体を通じて、移行中に異なる方法で処理される 2 つのタイプのリソースについて説明しています。これらは、バックエンドを構成する基礎となる CloudFormation リソースにマッピングされます。

- **ステートレスリソース**はユーザーデータを保存しません。AppSync GraphQL API、API Gateway REST API、Lambda 関数、IAM ロールなどが含まれます。
- **ステートフルリソース**はユーザーデータを保存します。S3 バケット、DynamoDB テーブル、Cognito ユーザープール、Cognito Identity プール、などが含まれます。

### 移行アプローチ（ブルーグリーン）

バックエンドを Gen2 に移行するには、（部分的な）ブルーグリーン デプロイメント アプローチを使用します。

1. デプロイされた Gen1 環境に基づいて、必要な Gen2 定義ファイルを生成します。
2. Gen 2 コードをデプロイして、新しい環境（Gen 2 ではブランチと呼ばれます）を作成します。この環境は最終的に本番環境になり、Gen 1 環境が廃止されるまで、Gen 1 環境と並行して実行されます。
3. 新しい Gen 2 環境を十分にテストして、正しく動作することを確認します。これは重要なステップです。以降のリファクタリングは逆戻しが困難なため、進める前に高い信頼度を得ることが必要です。
4. 基礎となる CloudFormation スタックをリファクタリングして、Gen1 ステートフルリソースが新しい Gen2 デプロイメントで管理されるようにします。

> **Info:** モデルデータをホストしている DynamoDB テーブルは、デプロイメント時点から Gen 1 と Gen 2 の間で共有され、リファクタリングステップには参加しません。

移行は Gen 1 CLI の新しい `gen2-migration` サブコマンドによって駆動されます。このコマンドは、既存の Gen 1 環境と並行して新しい Gen 2 環境（ブランチと呼ばれます）を生成する一連のステップを案内します。新しいブランチは、ステートレスリソース（API、関数、ロール、など）の新しいコピーを取得し、ステートフルリソース（ユーザープール、S3 バケット、DynamoDB テーブル、など）は転送されるため、データは失われません。以下の図はワークフローを説明しています。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/workflow.png" alt="各ステップでのリソースの状態を示す移行ワークフロー" width="1200" />
</div>

移行中、両方の環境が並行して実行されるため、Gen 2 環境に切り替える前に検証できます。Gen 2 環境が正しく機能していることを確認したら、Gen 2 環境がプライマリになり、Gen 1 環境は[廃止](#decommissioning-gen-1)できます。リファクタリング後、Gen 1 環境はロックされ、今後のすべての更新は Gen 2 コードにプッシュされるべきです。

### Gen2 アプリケーションの生成

移行ツールは Gen 1 CloudFormation スタックと Amplify 設定ファイルを調べて、`amplify/` ディレクトリに同等の Gen 2 TypeScript バックエンド定義を生成します。

Gen 2 でネイティブにサポートされている機能は、ネイティブ Gen 2 API（例えば、`defineAuth`、`defineData`、`defineStorage`）を使用してコード生成されます。ネイティブにサポートされていない機能は、[CDK コンストラクト](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)と[エスケープ ハッチ](https://docs.aws.amazon.com/cdk/v2/guide/cfn-layer.html#develop-customize-escape)としてコード生成されます。

ステートフルリソース（ユーザープール、S3 バケット、など）もコード生成され、新しい空のインスタンスが Gen 2 環境にデプロイされます。リファクタリングステップは後でこれらの空のリソースを実際の Gen 1 リソースに置き換えます。

> **Warning:** 本番データに意図しない変更が加えられないようにするため、まず[複製環境](#step-0-clone)で移行を実行してください。モデルをホストする DynamoDB テーブルは Gen 2 デプロイメントの一部としては複製されず、したがってリファクタリングステップには参加しません。Gen 2 アプリケーションはデプロイメント直後から Gen 1 モデルデータにアクセスできます。

生成されたコードは、Amplify Hosting サービス（ブランチ デプロイメント経由）または Gen 2 CLI（`npx ampx sandbox` / `npx ampx pipeline-deploy`）を使用してデプロイできます。

### データの保存と共有

既存のデータを保存するために、移行ツールは [CloudFormation Stack Refactor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html) API を使用して、Gen 1 ステートフルリソース（Cognito ユーザープール、Identity プール、S3 バケット、など）を Gen 2 CloudFormation スタックに移動します。生成フェーズ中に作成された空のプレースホルダーリソースは、実際の Gen 1 リソースに置き換えられ、既存のすべてのユーザーアカウントとデータが保存されます。

ステートレスリソース（API、関数、IAM ロール、など）は移動されません。Gen 2 環境は既に独自の新しいインスタンスを持っています。Gen 1 ステートレスリソースはそのまま残され、Gen 1 フロントエンドは切り替わるまで機能し続けます。リファクタリング後、Gen 1 と Gen 2 の両方の環境が同じ基礎データにアクセスします。どちらかの環境を通じた変更は、もう一方の環境に即座に表示されます。

> **Info:** データレプリケーション メカニズムを既に実装しているか、それを設定する場合は、それらを使用してリファクタリングステップを実行する代わりに Gen 1 リソースから新しい Gen 2 リソースにデータを移動できます。移行ツールはコード生成とスタック リファクタリングに焦点を当てており、データレプリケーションはその範囲外です。データレプリケーションは、独自のツール、または AWS サービスを使用して処理する必要があります。

### フロントエンドへの影響

Gen 1 フロントエンドは `amplifyconfiguration.json` ファイルを通じてバックエンドリソースと通信します。このファイルのすべての値（AppSync エンドポイント URL、ユーザープール ID、など）は移行プロセス全体を通じて有効なままであるため、Gen 1 フロントエンドは変更なしで機能し続けます。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/gen1-frontend-post-migration.png" alt="移行後、既存の Gen 1 フロントエンドがバックエンドリソースと相互作用する方法" width="500" />
</div>

Gen 2 アプリケーションが正しく機能することに満足したら、Gen 2 ステートレスリソースに接続する新しいバージョンのフロントエンドを公開します。Gen 2 では、設定ファイルは異なる構造を持ち、`amplify_outputs.json` と呼ばれます。

```ts
import amplifyconfig from '../amplify_outputs.json';
Amplify.configure(amplifyconfig);
```

Amplify クライアント ライブラリは異なる構造を検出し、自動的に調整されます。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/two-frontends-post-migration.png" alt="Gen 1 と Gen 2 の両方のフロントエンドが共有バックエンドリソースに接続する" width="600" />
</div>

## 機能カバレッジ

移行を開始する前に、[バックエンドカテゴリ](/[platform]/start/migrate-to-gen2/feature-matrix/#backend-categories)セクションの[機能パリティ](/[platform]/start/migrate-to-gen2/feature-matrix/)ページを注意深く確認してください。これは、お客様の環境が完全に移行できるかどうか、部分的にサポートされた、またはサポートされていない機能に必要な手作業、およびリソースが互換性があるかどうかを確認するのに役立ちます。

## 前提条件

### DataStore

API が競合解決を有効にしている場合（DataStore）、Gen 2 移行に進む前に無効にする必要があります。[DataStore からの移行](/gen1/[platform]/build-a-backend/more-features/datastore/migrate-from-datastore/)ガイドの指示を参照してください。

### `iam` 認証プロバイダーで保護された GraphQL タイプ

IAM で保護されたモデルがある場合：

```graphql
type Todo @model @auth(rules: [{ allow: private, provider: iam }]) {
  id: ID!
  name: String!
  description: String
}
```

リファクタリング後、Identity プールの `AuthRole` は Gen 2 ロールを指すように更新されます。このロールは Gen 1 AppSync API の外部にあるため、デフォルトではアクセスが拒否されます。Gen 2 環境は正しく機能しますが、Gen 1 環境は API への IAM アクセスを失います。

これを回避するには、Gen 2 `AuthRole` の命名パターンに一致するカスタム管理ロールを Gen 1 API に設定します。`amplify/api/<api-name>/custom-roles.json` を追加します。

```json
{
  "adminRoleNames": ["amplify-${appId}"]
}
```

ここで、`${appId}` は Amplify アプリケーション ID です。Gen 2 認証ロール名は this でプレフィックスされているため、パターンは任意の Gen 2 環境（ブランチ）からのアクセスを許可します。追加したら、`amplify push` を実行して再デプロイします。

### Amplify CLI バージョン

移行ツールは、最新の CLI メジャーバージョンによって生成された CloudFormation テンプレート構造とメタデータに依存します。移行前に Gen 1 環境を `v14` でデプロイしてください。

```bash
npm install -g @aws-amplify/cli@14
amplify push
```

### AWS 認証情報

移行ツールには、標準 Amplify CLI 権限に加えて、次の API アクションが必要です。以下のポリシーを IAM ロールに追加してください。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStackRefactor",
        "cloudformation:DescribeStackRefactor",
        "cloudformation:ExecuteStackRefactor",
        "cloudformation:GetStackPolicy",
        "cloudformation:SetStackPolicy",
        "cloudformation:DeleteChangeSet"
      ],
      "Resource": "arn:aws:cloudformation:*:*:stack/amplify-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketVersioning",
        "s3:GetEncryptionConfiguration"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:GetResource"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Info:** 管理された `AdministratorAccess-Amplify` ポリシーには、これらのアクションは含まれていません。

### CDK 対応

Gen 2 は内部で CDK を使用するため、アカウントとリージョンを [CDK でブートストラップ](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html)する必要があります。Gen 2 デプロイメント成功のために。

### フロントエンド

移行を開始する前に、以下をアップグレードしてください。

- `aws-amplify@^6.16.2` 以降にアップグレードしてください。v5 の場合は、[v5 から v6 の移行ガイド](https://docs.amplify.aws/react/build-a-backend/troubleshooting/migrate-from-javascript-v5-to-v6/)を参照してください。
- アプリが `@aws-amplify/ui-react` を使用する場合は、`^6` にアップグレードしてください。

### ツールチェーン

- **Node.js**：`aws-cdk-lib` は Node.js >= 20 が必要です。ローカル環境と CI/CD パイプラインが Node.js 20 以降を実行していることを確認してください。
- **TypeScript**：Gen 2 生成コードはモダン TypeScript 機能を使用しています。`^5.0.0` にアップグレードしてください。

## ステップバイステップ移行

> **Info:** 開始する前に、[機能カバレッジ](#feature-coverage)と[前提条件](#prerequisites)セクションを確認して、アプリが移行できるかどうかを判断してください。

明確にするため、以下の手順は次の規約に従っています。

- Gen 1 環境は Git リポジトリの `main` ブランチに保存されています。
- Gen 1 環境は `main` と呼ばれています。
- デプロイメント手順は Amplify Hosting（ブランチ デプロイメント）を参照しますが、これは必須ではありません。[Hosting](/[platform]/start/migrate-to-gen2/feature-matrix/#hosting)セクションで説明されている任意のデプロイメント方法を使用できます。

まず、移行ツールを含む Amplify CLI バージョンをインストールし、Gen 1 環境の新しいコピーを取得します。

```bash
npm install -g @aws-amplify/cli@^14.4.0
amplify pull --appId <app-id> --envName main
```

ローカルプロジェクトがデプロイされた環境と同期していることを確認してください。

```bash
amplify status  # Should report no changes
git diff        # Should show no changes
```

### Step 0: クローン

本番環境を移行する前に、複製環境から開始して、エンドツーエンドのプロセスを検証してください。このガイドのすべてのステップを慎重に実行し、[機能カバレッジ](#feature-coverage)と[前提条件](#prerequisites)セクションを確認して、環境が準備できていることを確認してください。自動化の範囲と必要な手作業を事前に理解することで、スムーズな移行が可能になります。

`amplify env add` を使用して Gen 1 環境のクローンを作成してデプロイしてください。

```bash
# Environment names must be lowercase letters only and up to 10 characters
amplify env add
amplify push
```

デプロイ後、複製環境が期待通りに動作し、元の環境の動作と一致することを確認してから、続行してください。

複製環境でこの移行フロー全体を実行してください。これにより、各ステップを検証し、設定の問題を検出し、プロセスに対する信頼度を構築できます。結果に満足したら、プライマリ環境で移行を繰り返します。

<Callout warning backgroundColor="var(--amplify-colors-red-10)">

**環境の分離**

`amplify env add` を使用して環境を複製すると、新しい環境は独自の Amplify マネージド リソースセットをデプロイします。ただし、特定のリソースは元の環境と複製環境の間でも共有される場合があります。

- インポートされたリソース - アプリが外部リソースをインポートする場合（例：`amplify import` 経由の Cognito ユーザープール または S3 バケット）、複製環境は同じ基礎リソースを参照します。リファクタリングやテストなど、移行中に実行される操作は、元の環境のデータに影響を与える可能性があります。
- ハードコードされた参照 - ハードコードされた ARN、リソース名、またはアカウント固有の識別子を含むカスタムリソースまたは CDK オーバーライドは、両方の環境間で同じ共有インフラストラクチャを指します。

<br />

**複製環境を確認し、それが完全に分離されていることを確認してから、続行してください。複製専用に、インポートされたリソースまたはハードコードされたリソース参照を更新して、個別のインスタンスを指すようにしてください。**

</Callout>

### Step 1: 評価

移行を開始する前に、Gen 1 環境が準備できているかどうかを評価してください。

```bash
amplify gen2-migration assess
```

このコマンドは読み取り専用です。Gen 1 環境内のすべてのリソースを検出し、`generate` と `refactor` のステップ全体の各リソースの移行サポートを示すレポートを生成します。リソースまたは機能が `generate` でサポートされていない場合、ツールはそれをスキップし、生成されたコード生成 Gen 2 コードに設定を手動で追加できます。`refactor` でサポートされていない場合、ツールはそれをスキップし、これらのリソースからデータを手動で移動または移行する必要があります。

> **Info:** `generate` と `refactor` ステップは、検証の一部として評価を実行し、サポートされていないエントリがある場合は失敗します。

<details><summary>評価例</summary>

認証、オーバーライド付き GraphQL API、ストレージ、およびカスタム IAM ポリシーを持つ Lambda 関数を備えたアプリで `assess` を実行すると、次のようなレポートが生成されます。

```
Assessment For Migrating "my-app" (env: main)

Resources

┌───────────┬─────────────────────────┬────────────────┬──────────┬──────────┐
│ Category  │ Service                 │ Resource       │ Generate │ Refactor │
├───────────┼─────────────────────────┼────────────────┼──────────┼──────────┤
│ auth      │ Cognito                 │ myappAuth      │ ✔        │ ✔        │
│ auth      │ Cognito-UserPool-Groups │ userPoolGroups │ ✔        │ ✔        │
│ api       │ AppSync                 │ myappApi       │ ✔        │ —        │
│ storage   │ S3                      │ myappBucket    │ ✔        │ ✔        │
│ function  │ Lambda                  │ processOrder   │ ✔        │ ✔        │
└───────────┴─────────────────────────┴────────────────┴──────────┴──────────┘

Advanced Features

┌─────────────────┬────────────────────────────────────────────┬────────────────────────────────────────────┬──────────┐
│ Name            │ Path                                       │ Generate                                   │ Refactor │
├─────────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┼──────────┤
│ overrides       │ api/myappApi/override.ts                   │ ✘ requires adding code after generate      │ —        │
│ custom-policies │ function/processOrder/custom-policies.json │ ✘ requires adding code after generate      │ —        │
└─────────────────┴────────────────────────────────────────────┴────────────────────────────────────────────┴──────────┘
```

この例では、すべてのリソースがサポートされていますが、2 つの機能にフラグが付いています。

- GraphQL API には `override.ts` ファイルがあります。移行ツールは上書きを自動的に変換できないため、生成された Gen 2 CDK コードにこれらのカスタマイズを手動で適用する必要があります。
- Lambda 関数にはカスタム IAM ポリシーがあります。これらは Gen 2 コード内の関数のリソース定義に手動で追加する必要があります。

両方の機能は refactor に対して `—` を示しています。これらはコード生成のみを必要とするためです。

**サポートインジケーター：** ✔ サポート済み（実行） · ✘ サポートなし（スキップ） · — 不要（スキップ）

</details>

### Step 2: ロック

<details><summary>検証</summary>

| 検証 | 説明 |
|---|---|
| 環境ステータス | ルート CloudFormation スタックが安定した状態（`UPDATE_COMPLETE` または `CREATE_COMPLETE`）にあることを確認します。 |
| ドリフト | ローカルプロジェクトとデプロイされた CloudFormation スタック間のドリフトを検出します。 |

</details>

移行期間中、Gen 1 環境は変更されないようにしてください。Gen 1 環境にデプロイする自動パイプラインを無効にしてから、次を実行してロックしてください。

```bash
amplify gen2-migration lock
```

ロックステップはまた、移行中の保護のため、Gen 1 スタック内のすべてのステートフルリソースに `Retain` 削除ポリシーを設定します。

<details><summary>カスタムステートフルリソース タイプ</summary>

移行ツールは、ステートフルと見なされる CloudFormation リソース タイプのデフォルト リストを保持しています（例：`AWS::Cognito::UserPool`、`AWS::S3::Bucket`、`AWS::DynamoDB::Table`）。ロックステップ中、これらのタイプに一致するリソースのみが `Retain` 削除ポリシーを受け取ります。

アプリケーションにデフォルト リストに含まれていないステートフル CloudFormation タイプを含むカスタム リソースが含まれている場合は、`--additional-stateful-resource-types` オプションを使用して提供できます。CloudFormation リソース タイプ文字列の配列を含む JSON ファイルを作成します。

```json
[
  "AWS::Elasticsearch::Domain",
  "AWS::RDS::DBInstance"
]
```

次に、ファイルパスをロックコマンドに渡します。

```bash
amplify gen2-migration lock --additional-stateful-resource-types ./my-stateful-types.json
```

提供するタイプは、組み込みのデフォルトとマージされます。これにより、ツールはカスタムステートフルリソースを正しく識別して保護することができます。

> **Info:** 後で `generate` と `refactor` コマンドに同じファイルを渡す必要があります。

</details>

検証が完了すると、以下の制限的な IAM ポリシーがルートスタックに接続されます。

```json
{ "Statement": [{ "Effect": "Deny", "Action": "Update:*", "Principal": "*", "Resource": "*" }] }
```

環境のロックを解除するには、次を実行してください。

```bash
amplify gen2-migration lock --rollback
```

> **Warning:** Gen 1 スタックが既にリファクタリングされている場合（ロールバックされていない場合）はロックをロールバックしないでください。Gen 1 の更新をリファクタリングされたスタックにプッシュすると、リソースの競合が発生する可能性があります。

### Step 3: 生成

<details><summary>検証</summary>

| 検証 | 説明 |
|---|---|
| ロックステータス | Gen 1 環境がロック されている（スタック ポリシーは拒否に設定）ことを確認します。 |
| ワーキング ディレクトリ | Git ワーキング ディレクトリにコミットされていない変更がないことを確認します。 |
| 評価 | `generate` ステップのリソースと機能の評価を実行し、サポートされていないエントリがある場合は失敗します。 |

</details>

Gen 2 定義ファイルを生成します。

```bash
git checkout -b gen2-main
amplify gen2-migration generate
```

このコマンドは、デプロイされた Gen 1 CloudFormation スタックを検査して、同等の Gen 2 TypeScript バックエンド定義ファイルを生成し、ローカル `./amplify` ディレクトリをオーバーライドします。生成されたコードは出発点です。デプロイする前に、一部の機能には手作業での編集が必要です（以下を参照してください）。

<details><summary>カスタムステートフルリソース タイプ</summary>

移行ツールは、ステートフルと見なされる CloudFormation リソース タイプのデフォルト リストを保持しています（例：`AWS::Cognito::UserPool`、`AWS::S3::Bucket`、`AWS::DynamoDB::Table`）。コード生成中、ツールはこのリストを使用して、Gen 2 CDK コードでこれらのリソースの `Retain` 削除ポリシーを生成します。リファクタリング後に Gen 1 リソースの削除ポリシーをオーバーライドしないようにします。

アプリケーションにデフォルト リストに含まれていないステートフル CloudFormation タイプを含むカスタム リソースが含まれている場合は、`--additional-stateful-resource-types` オプションを使用して提供できます。CloudFormation リソース タイプ文字列の配列を含む JSON ファイルを作成します。

```json
[
  "AWS::Elasticsearch::Domain",
  "AWS::RDS::DBInstance"
]
```

次に、ファイルパスを generate コマンドに渡します。

```bash
amplify gen2-migration generate --additional-stateful-resource-types ./my-stateful-types.json
```

提供するタイプは、組み込みのデフォルトとマージされます。これにより、生成された Gen 2 コードに、カスタム ステートフル リソースの保有ポリシーが確実に含まれます。

</details>

成功後、クリーンアップして依存関係を再インストールして、Gen 1 依存関係ツリーの古い解決アーティファクトを回避します。

```bash
rm -rf node_modules package-lock.json
npm install
npm install --package-lock-only
```

> **Warning:** `generate` はローカルの `amplify/` ディレクトリを Gen 2 コードに置き換えるため、Gen 1 環境で作業に戻りたい場合は `amplify pull` を実行する必要があります。

### Step 4: 生成後

生成されたコードは出発点ですが、すぐにはデプロイできないかもしれません。Gen 1 と Gen 2 が設定、モジュール形式、またはデフォルトの動作を処理する方法の違いにより、一部の機能には手作業での調整が必要です。デプロイする前に、以下の編集を確認して適用してください。

> **Info:** これらの編集は機械的であり、AI コーディング アシスタントに適しています。

#### フロントエンド

フロントエンドが `amplifyconfiguration.json` を使用する場合は、インポートを更新してください。

```diff
- import amplifyconfig from './amplifyconfiguration.json';
+ import amplifyconfig from '../amplify_outputs.json';
```

> **Info:** `amplify_outputs.json` ファイルは、デプロイするまでローカルに存在しません。Amplify Hosting を使用する場合、デプロイメント時に生成されます。サンドボックスでテストするときは、サンドボックス デプロイメント成功後にローカルに作成されます。

フロントエンド コードが `amplifyconfiguration.json` 構造に直接アクセスする場合（例えば、`aws_user_pools_id` や `aws_appsync_graphqlEndpoint` などの特定のキーを読み込む）、Amplify クライアント ライブラリが設定を抽出することに依存しない場合は、そのコードを適応させる必要があります。Gen 2 は、異なる構造を持つ `amplify_outputs.json` ファイルを生成します。設定ファイルを手動で解析するコードが破損します。

標準 `Amplify.configure(...)` 呼び出しを使用し、Amplify クライアント ライブラリ経由でリソースにアクセスする場合は、変更は不要です。ライブラリは両方の形式を透過的に処理します。

**REST API** - 移行ツールは完全な REST API CDK コンストラクトを自動的に生成します。フロントエンド コードを新しい Gen 2 API 名を指すように更新してください。

```diff
- apiName: '<gen1-rest-api-name>',
+ apiName: '<gen2-rest-api-name>',
```

さらに、これらの[指示](https://docs.amplify.aws/react/build-a-backend/add-aws-services/rest-api/set-up-rest-api/#initialize-amplify-api)に従って、Gen2 の出力構造に基づいて `Amplify` インスタンスを再設定してください。

**Kinesis** - フロントエンドが Kinesis ストリームに分析イベントを送信する場合は、ストリーム名を新しい Gen 2 ストリームを指すように更新してください。

```diff
- streamName: '<gen1-stream-name>',
+ streamName: '<gen2-stream-name>',
```

#### データ

`./amplify/data/resource.ts` を編集してください。

```diff
- branchName: "main"
+ branchName: "gen2-main"
```

これにより、ホスティング サービスは DynamoDB テーブルを再作成する代わりに再利用（インポート）するよう指示されます。

Gen 1 では、保護されていない `@model` タイプは公開と見なされ、`@aws_api_key` が割り当てられます。Gen 2 では、プライベートと見なされ、`@aws_iam` が割り当てられます。同じ動作を保持するには、`@auth` ディレクティブを明示的に追加してください。

```graphql
type Todo @model @auth(rules: [{ allow: public }]) {
  id: ID!
  name: String!
  description: String
}
```

#### 関数

**ESM 互換性** - Lambda 関数コードを CommonJS から ESM に移植してください。

```diff
- exports.handler = async (event) => {
+ export async function handler(event) {
```

Gen 2 は CommonJS 構文と競合する Lambda シムを追加します。

**シークレット** - 関数がシークレット値を使用する場合は、Amplify コンソールでシークレットを再作成してください（_Hosting → Secrets → Manage Secrets → Add new_）。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/add-secret.png" alt="Amplify コンソールでシークレットを追加する" width="800" />
</div>

次に、関数定義を更新してください。

```diff
- import { defineFunction } from "@aws-amplify/backend";
+ import { defineFunction, secret } from "@aws-amplify/backend";

- MY_SECRET: "/amplify/<hash>/main/AMPLIFY_<function-name>_MY_SECRET"
+ MY_SECRET: secret("MY_SECRET")
```

その後、関数コード内で、`process.env.MY_SECRET` を使用してシークレット値を取得してください。

> **Info:** 詳細については、[シークレット](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/#secrets)を参照してください。

#### 認証

##### 外部 ID プロバイダー

Gen 1 アプリが社会的ログイン（Facebook、Google）を使用する場合、`./amplify/auth/resource.ts` で生成されている `callbackUrls` と `logoutUrls` は Gen 1 から継承され、Gen 1 Amplify Hosting URL のみを参照します。Gen 2 ホスティング URL は、ホストされたUIが Gen 2 フロントエンドからのログインを受け付ける前に追加される必要があります。

ジェネレーターは各 URL リストの上にコメントを出力するため、リマインダーとして機能します。Gen 2 URL を両方の場所に追加してください。

```diff
 callbackUrls: [
   'https://main.<gen1-appId>.amplifyapp.com/',
+  'https://gen2-main.<gen2-appId>.amplifyapp.com/',
 ],
```

トップレベルの `externalProviders.callbackUrls`/`logoutUrls` はフロントエンドで使用される Web クライアントを設定します。`applyEscapeHatches` 内の `oAuth.callbackUrls`/`logoutUrls` は別のネイティブ アプリ クライアントを設定します。両方が存在する場合は、両方を更新してください。

外部プロバイダーの開発者コンソール内の対応するリダイレクト URI も、Gen 2 環境がデプロイされた後に更新する必要があります（[外部 ID プロバイダーの設定](#configure-external-identity-providers)を参照してください）。

### Step 5: デプロイ

生成された Gen 2 コードをリポジトリにプッシュしてください。

```bash
git add .
git commit -m "feat: migrate to gen2"
git push origin gen2-main
```

移行ツールは、Gen 2 ホスティング コマンドと互換性のある `amplify.yml` ビルドスペック ファイルを生成し、Amplify Hosting がすべてのプッシュで Gen 2 バックエンドを自動的にビルドおよびデプロイできるようにします。

AWS Amplify コンソールにログインして、新しいブランチを既存のアプリケーションに接続してください。_App Settings → Branch Settings_ に移動して、_Add Branch_ を選択してください。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/add-branch.png" alt="Amplify コンソールにブランチを追加する" width="900" />
</div>

`gen2-main` ブランチを選択してデプロイメントを開始してください。Amplify Hosting サービスは、前のステップで生成された `amplify.yml` ビルドスペックを検出し、Gen 2 バックエンドを自動的にデプロイします。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/deploying-branch.png" alt="Amplify コンソール内にブランチをデプロイする" width="900" />
</div>

次のステップに進む前に、デプロイメントが完了するまで待機してください。

> **Info:** Gen 1 アプリが手動デプロイメントを使用し、Git リポジトリに接続されていない場合は、既存のアプリにブランチを追加できません。この場合、新しい Amplify アプリを作成し、Git リポジトリをそれに接続してください。セットアップ中に `gen2-main` ブランチを選択してください。リファクタリング ステップを含む、残りの移行を新しいアプリの Gen 2 環境を使用して進めることができます。
> 
> 新しいアプリを使用すると、既存の[カスタム ドメイン](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)を新しい環境に指すように再設定することを阻止できます。

<details><summary>サンドボックスでテスト</summary>

サンドボックスを使用して Gen 2 アプリケーションをデプロイして、Gen 1 環境から完全に分離した状態でテストできます。

```bash
npx ampx sandbox --once
```

デフォルトでは、サンドボックスは独自の DynamoDB テーブルを作成し、Gen 1 モデルデータを共有しません。これらを共有するには、`./amplify/data/resource.ts` で `branchName` を `"sandbox"` に設定してください。

</details>

#### 外部 ID プロバイダーの設定

アプリが社会的ログインを使用する場合、Gen 2 デプロイメント Gen 1 と異なる Cognito ユーザー プール ドメインを作成します。Gen 2 フロントエンドのホストされたUIログインが機能する前に、外部プロバイダーの開発者コンソールを更新して、新しいドメインからのリダイレクトを受け入れる必要があります。

[Cognito コンソール](https://console.aws.amazon.com/cognito/)を開き、Gen 2 ブランチで所有されているユーザー プールを選択し、_App integration → Domain_ の下のドメインをメモします。

その後、各外部プロバイダーのコンソール内で、標準 [External identity providers](/[platform]/build-a-backend/auth/concepts/external-identity-providers/)ガイドに従ってドメインを追加してください。既存の Gen 1 エントリを置き換える必要はありません。移行中に両方の環境が機能するように、Gen 2 ドメインを既存のエントリの横に追加してください。

### Step 6: 機能テスト（重要）

> **Warning:** Gen 2 環境を十分にテストするまで、リファクタリング ステップに進まないでください。リファクタリングはステートフルリソースを Gen 2 スタックに移動し、本番環境に直接影響します。すべてが正しく機能することを確認するための時間を取ってください。

デプロイメント後、以下のすべての側面をテストすることで、Gen 2 環境が期待通りに機能していることを確認してください。

- ユーザー サインアップ、ログイン、およびログアウト フロー
- データ操作 - エンティティの作成、読み取り、更新、削除
- Storage 経由のファイルのアップロードとダウンロード
- API 呼び出し（GraphQL と REST）
- Lambda 関数によって処理されるカスタム ビジネス ロジック

機能が期待通りに機能しない場合は、アプリケーションの特定の動作に一致するように生成された Gen 2 コードを確認して調整してください。移行ツールは出発点を提供しますが、一部の設定には、アプリケーションの特定の動作に一致するための手作業による微調整が必要な場合があります。

DynamoDB モデル テーブル（共有される）を除き、Gen 2 環境は Gen 1 とは別の独自のステートフルリソースを持っていることに注意してください。

### Step 7: リファクタリング

<details><summary>検証</summary>

| 検証 | 説明 |
|---|---|
| ロックステータス | Gen 1 環境がロック されている（スタック ポリシーは拒否に設定）ことを確認します。 |
| 評価 | `refactor` ステップのリソースと機能の評価を実行し、サポートされていないエントリがある場合は失敗します。 |

</details>

リファクタリングは、[CloudFormation Refactor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html) API を使用して Gen 1 ステートフルリソース（Cognito ユーザープール、S3 バケット、など）を Gen 2 CloudFormation スタックに移動するプロセスです。このステップ後、Gen 1 と Gen 2 の両方のアプリケーションが同じ基礎データとユーザー アカウントを共有します。Gen 1 環境は更新できなくなります。

<details><summary>保有スタック</summary>

前方リファクタリング中、ツールは Gen 1 ステートフルリソースを Gen 2 CloudFormation スタックに移動する必要があります。ただし、Gen 2 スタックには既に独自のリソースが含まれています（[デプロイ](#step-5-deploy)ステップ中に作成されました）。CloudFormation は、単一のスタック内で 2 つの物理リソースを同じ論理 ID にマップできないため、既存の Gen 2 リソースをまず移動する必要があります。

これを解決するため、ツールは一時的な保有スタックを作成します。保有スタックは軽量の CloudFormation スタックであり、Gen 2 リソースの中間の宛先として機能します。前方リファクタリング ワークフローは、カテゴリごとに 2 つのフェーズで進行します。

1. Gen 2 リソース → 保有スタック を移動します。既存の Gen 2 ステートフルリソース（例えば、デプロイ中に作成されたユーザー プール、Identity プール、または S3 バケット）は、CloudFormation [StackRefactor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html) API 経由で保有スタックに転送されます。これはメタデータのみの操作です。物理リソースは再作成または変更されません。
2. Gen 1 リソース → Gen 2 スタック を移動します。Gen 2 スタックが競合するリソースから削除されたので、Gen 1 ステートフルリソースが転送されます。

保有スタックは、対応する Gen 2 カテゴリ スタックの名前に `-holding` サフィックスを付けて名付けられます（例：`amplify-d123-gen2main-branch-abc-auth-holding`）。

保有スタックは意図的に、成功した前方リファクタリング後に保持されます。これらはロールバックを有効にします。`refactor --rollback` を実行すると、ツールは Gen 1 リソースを Gen 1 スタックに戻してから、保有スタック リソースを Gen 2 に復元し、すべてをリファクタリング前の状態に戻します。

</details>

まず、AWS CloudFormation コンソールで Gen 2 ルート CloudFormation スタックの名前を見つけてください。パターン `amplify-<appId>-gen2main-branch-<suffix>` を持つスタックを探してください。

<div style={{textAlign: 'center'}}>
<img src="/images/gen2-migration/find-stack.png" alt="CloudFormation コンソールで Gen 2 ルート スタックを見つける" width="800" />
</div>

次に、リファクタリングを実行してください。

```bash
git checkout main
amplify pull --appId <appId> --envName main
amplify gen2-migration refactor --to <gen2-root-stack-name>
```

<details><summary>カスタムステートフルリソース タイプ</summary>

移行ツールは、ステートフルと見なされる CloudFormation リソース タイプのデフォルト リストを保持しています（例：`AWS::Cognito::UserPool`、`AWS::S3::Bucket`、`AWS::DynamoDB::Table`）。リファクタリング中、これらのタイプに一致するリソースのみが Gen 1 スタックから Gen 2 に移動されます。

アプリケーションにデフォルト リストに含まれていないステートフル CloudFormation タイプを含むカスタム リソースが含まれている場合は、[ロック ステップ](#step-2-lock)で使用したのと同じファイルを使用して、`--additional-stateful-resource-types` オプションで提供できます。CloudFormation リソース タイプ文字列の配列を含む JSON ファイルを作成します。

```json
[
  "AWS::Elasticsearch::Domain",
  "AWS::RDS::DBInstance"
]
```

次に、ファイルパスを refactor コマンドに渡します。

```bash
amplify gen2-migration refactor --to <gen2-root-stack-name> --additional-stateful-resource-types ./my-stateful-types.json
```

提供するタイプは、組み込みのデフォルトとマージされます。これにより、リファクタリング ステップ中にツールがカスタム ステートフル リソースを正しく識別して転送することが確認されます。

</details>

> **Info:** リファクタリング ステップ後、`.amplify/gen2-migration/refactor.operations/` ディレクトリが作成されます。これには、すべての CloudFormation 操作のスナップショット（テンプレート、パラメーター、リソース マッピング）が含まれています。これらのファイルは監査またはトラブルシューティングに役立ち、移行が成功したことが確認されたら安全に削除できます。

リファクタリングが失敗したり、不要な結果が生成される場合は、ロールバックしてください。

```bash
amplify gen2-migration refactor --to <gen2-root-stack-name> --rollback
```

ロールバック前に [Step 8: Post-Refactor](#step-8-post-refactor-critical) を既に完了している場合は、`gen2-main` ブランチの `./amplify/backend.ts` で `postRefactor();` をコメントアウトし直してプッシュしてください。関数は、ロールバック後に Gen 2 スタックが所有しなくなったリソースをターゲットとし、そうしないと合成時に失敗します。

ロールバック後、Gen 1 環境をロック解除して再デプロイして、正常な操作を復元する必要があります。

```bash
amplify gen2-migration lock --rollback
amplify push --force
```

### Step 8: ポストリファクタリング（重要）

<Callout warning backgroundColor="var(--amplify-colors-red-10)">

以下のステップは重要です。これらをスキップするとダウンタイムが発生する可能性があります。

</Callout>

リファクタリング ステップは、デプロイされた Gen 2 CloudFormation テンプレートとローカル アプリケーション コードの間にドリフトを作成します。このドリフトはデプロイメントによって調整する必要があります。さらに、フロントエンド設定ファイル（`amplify_outputs.json`）は、新しく転送されたリソースを反映するために更新する必要があるスタック出力値に依存しています。これにはデプロイメントも必要です。

```bash
git checkout gen2-main
```

`./amplify/backend.ts` を編集してください。

```diff
- // postRefactor();
+ postRefactor();
```

> **Info:** この関数はリファクタリング完了後もコメント解除されたままである必要があります。コメント アウトまたは削除するとデプロイメント エラーが発生します。唯一の例外は、その後 `refactor --rollback` を実行した場合です。[Step 7](#step-7-refactor) を参照してください。

アプリケーションに Kinesis ストリームが含まれている場合は、フロントエンドを更新して、元の Gen 1 ストリーム名を指すようにしてください（現在は Gen 2 スタックによって管理されています）。

```diff
- streamName: '<gen2-stream-name>',
+ streamName: '<gen1-stream-name>',
```

### Step 9: デプロイ

変更をプッシュしてデプロイメントが完了するまで待機してください。

```bash
git add .
git commit -m "fix: post refactor"
git push origin gen2-main
```

## Gen 1 廃止

<Callout warning backgroundColor="var(--amplify-colors-red-10)">

Gen 2 環境が完全に運用可能であることを確認し、ユーザーやアプリケーションが Gen 1 ステートレスリソース（AppSync、API Gateway、など）にまだアクセスしていないことを確認した後でのみ、廃止を進めてください。

`amplify env remove` を実行したり、コンソール経由で Gen 1 CloudFormation スタックを直接削除したりしないでください。そうすると、移行された Gen 2 環境を中断するリソース クリーンアップがトリガーされる可能性があります。

</Callout>

移行後、Gen 1 環境は有効な Amplify 環境ではなくなります。ステートフルリソースは Gen 2 スタックにリファクタリングされ、内部参照は解決されています。

Gen 1 CloudFormation スタックには、現在 Gen 2 で所有されているリファクタリングされたリソースを参照するリソース（auth トリガー カスタム リソースなど）が含まれている場合があります。これらのスタックを通常の方法で削除すると、リソース クリーンアップがトリガーされ、移行された環境が中断される可能性があります。

Gen 1 スタックを廃止するには、次の操作を実行してください。

1. ユーザーやアプリケーションが Gen 1 ステートレス リソースにまだアクセスしていないことを確認します。これは、CloudWatch トラフィック メトリックを検査するか、組織的な追跡システムを使用して確認できます。
2. Gen 1 ネストされた CloudFormation スタック内のリソースに `Retain` 削除ポリシーを適用してください。これにより、ルート スタックが削除されたときに CloudFormation がそれらのリソースを削除するのを防ぎます。`retain` コマンドは、ネストされたスタック内のリソースにのみ適用されます。ルート スタック自体のリソースは保持されません。

```bash
amplify gen2-migration retain
```

3. Gen 1 ルート CloudFormation スタックを削除してください。ネストされたスタック内のリソースは、前のステップで適用された削除ポリシーのおかげで保持（孤立）されます。ルート スタック自体のリソースは通常に削除されます。
4. 不要になった個々の孤立したリソース（例：AppSync API、Lambda 関数、IAM ロール）を手動で削除します。各リソースを削除しても安全であることを確認してください。

## トラブルシューティング

### 既知の問題

GitHub の [オープン移行の問題](https://github.com/aws-amplify/amplify-cli/issues?q=is%3Aissue%20state%3Aopen%20label%3Agen2-migration%20type%3ABug)を参照してください。

### Node.js 依存関係のインストール

Gen 1 Lambda 関数は、`package.json` ファイルで宣言された依存関係を持つ場合があります。`generate` 中に、これらはルート `package.json` にマージされ、相互に競合する可能性があります。Gen 2 デプロイメントがインストール エラーで失敗する場合は、ルート `package.json` を検査して競合を手動で解決してください。

### 循環 CloudFormation 依存関係

複数の他のリソースにアクセスする関数を持つ Gen 1 アプリ（例えば、データ API にもアクセスする必要があるクエリ ハンドラー、またはストレージに依存する auth トリガー）は、Gen 2 としてデプロイされた場合、CloudFormation ネストされたスタック間に循環依存関係を生成できます。[循環依存関係の問題のトラブルシューティング](https://docs.amplify.aws/vue/build-a-backend/troubleshooting/circular-dependency/)を参照してください。解決策については、手順を参照してください。

## フィードバック

- [issue を作成する](https://github.com/aws-amplify/amplify-cli/issues/new)
- [GitHub ディスカッションに参加する](https://github.com/aws-amplify/amplify-cli/discussions/14490)

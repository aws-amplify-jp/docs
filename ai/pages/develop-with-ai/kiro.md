---
title: "Amplify で Kiro を使用する"
section: "develop-with-ai"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-04-10T19:18:13.000Z"
url: "https://docs.amplify.aws/react/develop-with-ai/kiro/"
---

[Kiro](https://kiro.dev) は、powers、specs、steering、hooks、agentic chat などの機能により、プロトタイプから本番環境への移行を支援するエージェント型 IDE です。Kiro はプロジェクト全体のコンテキストを理解し、複数のファイルにコードを生成できます。

## はじめに

1. [Kiro をダウンロードしてインストールする](https://kiro.dev/docs/getting-started/installation/)（macOS、Windows、または Linux 用）
2. Kiro で Amplify プロジェクトを開く
3. AWS Amplify power をインストールする（以下を参照）
4. agentic chat を使用して構築を開始するか、機能の spec を作成する

実践的なチュートリアルについては、[Kiro クイックスタート](https://kiro.dev/docs/getting-started/first-project/)を参照してください。

## AWS Amplify Power

Power は、Kiro にオンデマンドで専門的な知識とワークフローへのアクセスを提供するパッケージ化された機能です。**AWS Amplify power** は、認証、データモデル、ストレージ、サーバーレス関数、デプロイメントを含むフルスタック Amplify Gen 2 アプリケーション構築のためのガイド付きワークフローを提供します。

すべてのツールを事前にロードする従来の MCP サーバーとは異なり、Power は会話コンテキストに基づいて動的にアクティブ化されます。Amplify 関連の作業に言及すると、Kiro は Amplify power を自動的にロードします。

### Amplify power のインストール

Kiro で直接 power を閲覧するか、[kiro.dev/powers](https://kiro.dev/powers) にアクセスしてください：

1. **「AWS Amplify」** を検索する
2. **「Install」** をクリックする — power は手動設定なしで自動的に登録されます

### power が提供するもの

Amplify power には以下が含まれます：

- **Steering ファイル** — ワークフローオーケストレーター（`amplify-workflow.md`）が Kiro をフェーズ型開発プロセスを通じてガイドし、バックエンド、サンドボックス、フロントエンド、本番環境作業の段階固有の指示を提供します。
- **MCP 設定** — AWS MCP Server に接続して、AWS ドキュメントと Amplify Standard Operating Procedures（SOPs）へのアクセスを提供します。

### フェーズ型ワークフロー

Amplify アプリの構築を Kiro に依頼すると、power のオーケストレーターは適用可能なフェーズを決定し、それらを順に実行します：

1. **バックエンド** — `amplify/` ディレクトリで認証、データモデル、ストレージ、関数を作成する
2. **サンドボックス** — テスト用にサンドボックス環境にデプロイする
3. **フロントエンド** — フロントエンドフレームワークを Amplify バックエンドに接続する
4. **本番環境** — CI/CD 経由で本番環境にデプロイする

適用可能なフェーズのみが実行されます。たとえば、「データモデルを追加する」はフェーズ 1 と 2 のみをトリガーし、「フルスタックアプリケーションを作成する」は 4 つのフェーズすべてを実行します。Kiro は各フェーズの前にプランを提示し、確認を求めます。

### プロンプトの例

```
Build me a task management app with Amplify
```

```
Add owner-based authentication to my data model
```

```
Deploy my Amplify app to sandbox
```

ソースコードと steering ファイルについては、[GitHub の aws-amplify power](https://github.com/kirodotdev/powers/tree/main/aws-amplify) を参照してください。

## Amplify 開発の主な機能

### Specs

Specs は構造化仕様を使用して機能を計画・構築できます。Amplify プロジェクトの場合、自然言語で機能を記述できます。Kiro は spec を作成し、`amplify/data/resource.ts` でのデータモデル定義からフロントエンド接続まで、タスクに分割します。

たとえば、Kiro に「リアルタイムサブスクリプション付きのコメント機能を追加する」の spec を作成するよう依頼できます。バックエンドスキーマの変更、認可ルール、フロントエンド統合を計画します。

詳細は [Kiro specs ドキュメント](https://kiro.dev/docs/features/specs/)を参照してください。

### Hooks

Hooks はイベントに応答して反復的な開発ワークフローを自動化します。バックエンドファイルが変更されたときに `npx ampx sandbox` を自動実行する、コード生成後にテストを実行する、または Amplify リソース定義をリントするようにフックを設定できます。

詳細は [Kiro hooks ドキュメント](https://kiro.dev/docs/features/hooks/)を参照してください。

### Steering

Steering ファイルは、プロジェクト固有のルールとコンテキストで Kiro の動作をガイドします。Amplify プロジェクトの場合、使用する認可パターン、データモデルの構造化方法、インポートする Amplify ライブラリなど、プロジェクトの規約について Kiro に教える steering ルールを作成できます。

Amplify 固有の steering の例については、[steering ファイル](/[platform]/develop-with-ai/steering-files/)ページを参照してください。

### MCP サーバー

Kiro は Model Context Protocol（MCP）をサポートしており、外部ツールとデータソースを接続できます。[AWS MCP Server](/[platform]/develop-with-ai/mcp-server/)は、Kiro がバックエンドのスキャフォルディング、フロントエンドコード生成、デプロイメント設定に使用できる事前構築された Amplify ワークフローを提供します。

詳細は [Kiro MCP ドキュメント](https://kiro.dev/docs/features/mcp-servers/)を参照してください。

### Agentic chat

Kiro の agentic chat を使用すると、自然言語会話を通じて機能を構築できます。完全な Amplify プロジェクト（データスキーマ、認証設定、フロントエンドコード含む）を理解し、単一のインタラクションで複数のファイルを変更できます。

詳細は [Kiro chat ドキュメント](https://kiro.dev/docs/features/agentic-chat/)を参照してください。

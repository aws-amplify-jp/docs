---
title: "AWS リソースに接続する"
section: "start"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-04-23T15:56:00.000Z"
url: "https://docs.amplify.aws/react/start/connect-to-aws-resources/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

Amplify クライアント ライブラリは、Amplify バックエンド ワークフロー なしで **独立して** 使用できます。CDK、Terraform、CloudFormation、または AWS コンソールでプロビジョニングされた AWS リソースがある場合、Amplify ライブラリをこれらのリソースに直接接続できます。

これにより、Amplify のクライアント API の全機能（認証フロー、データ クエリ、ファイル管理など）を活用しながら、インフラストラクチャの完全な制御を維持できます。

ライブラリは 2 つの方法で設定できます。

- **手動 `amplify_outputs.json`** — リソースの詳細が含まれた設定ファイルを作成します
- **プログラマティック設定** — コード内で設定を構築します（テストと環境切り替えに最適）

どちらの方法も、すべての Amplify サービスをサポートします: **Auth**、**Data**、**Storage**、**Analytics**、**Geo**、および **Notifications**。

各サービスのプラットフォーム固有のコード例を含む完全なガイドについては、「[既存の AWS リソースに接続する](/[platform]/frontend/connect-to-existing-resources/)」を参照してください。

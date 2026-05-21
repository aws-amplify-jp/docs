---
title: "IAM ポリシー"
section: "reference"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-08-02T20:32:56.000Z"
url: "https://docs.amplify.aws/react/reference/iam-policy/"
---

## ブランチデプロイメント

ブランチデプロイメントでは、フルスタックデプロイメント中にバックエンドリソースをデプロイするために、[`AmplifyBackendDeployFullAccess`](https://docs.aws.amazon.com/amplify/latest/userguide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmplifyBackendDeployFullAccess) マネージドポリシーが必要です。コンソール経由でプロジェクトを接続する場合、このポリシーが付与されたロールが自動的に作成されます。

## クラウドサンドボックスデプロイメント

サンドボックスデプロイメントは、設計上、ローカルの認証情報を使用してリソースをデプロイします。ローカルプロファイルに `AmplifyBackendDeployFullAccess` ポリシーが付与されていることを確認する必要があります。

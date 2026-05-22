---
title: "アーキテクチャ"
section: "ai/concepts"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-11-13T23:59:20.000Z"
url: "https://docs.amplify.aws/react/ai/concepts/architecture/"
---

Amplify AI kit はルートの概念を中心に構築されています。AI ルートはバックエンド AI 機能と相互作用するための API エンドポイントのようなものです。AI ルートは Amplify バックエンドで構成され、認可ルール、ルートのタイプ（生成または会話）、AI モデル、温度などの推論設定、入力と出力、およびアクセスできるデータを定義できます。現在、AI ルートには 2 つのタイプがあります：

* **会話:** 会話ルートは非同期のマルチターン API です。会話とメッセージは自動的に DynamoDB に保存されます。これの例としては、チャットベースの AI エクスペリエンスや会話型 UI があります。
* **生成:** 単一の同期リクエスト-レスポンス API です。生成ルートは AppSync クエリで、ルート定義に従って構造化データを生成します。一般的な用途には、非構造化入力から構造化データを生成することと要約があります。

## クラウドインフラストラクチャ

Amplify AI kit で AI ルートを作成すると、以下のサービスを使用しています：

### AWS AppSync
ブラウザからの要求を認可およびルーティングして AWS サービスに接続するサーバーレス API レイヤー。

### Amazon DynamoDB
会話履歴を保存するためのサーバーレスデータベース。

### AWS Lambda
会話のためのサーバーレス実行。

### Amazon Bedrock
サーバーレスファウンデーションモデル。

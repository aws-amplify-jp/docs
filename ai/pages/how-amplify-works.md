---
title: "Amplify の仕組み"
section: "how-amplify-works"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-27T17:02:50.000Z"
url: "https://docs.amplify.aws/react/how-amplify-works/"
---

AWS Amplify は、フルスタックアプリを構築するための完全なツールキットです。独立して使用することも、一緒に使用することもできる 4 つの独立した柱で構成されています。

<Columns columns={2}>
  <Card variation="outlined">
    **[バックエンド](/[platform]/build-a-backend/)**

    TypeScript を使用して認証、データ、ストレージ、関数などのクラウドリソースを定義します。Amplify は AWS インフラストラクチャをプロビジョニングして管理します。
  </Card>
  <Card variation="outlined">
    **[フロントエンドライブラリ](/[platform]/frontend/)**

    Web またはモバイルアプリをバックエンドサービスに接続するライブラリ。JavaScript、React、React Native、Swift、Android、Flutter で利用可能です。
  </Card>
  <Card variation="outlined">
    **[UI ライブラリ](/[platform]/build-ui/)**

    Authenticator、Storage Manager、AI 会話インターフェイスなどの事前構築されたテーマ可能な UI コンポーネント。複雑なワークフローを処理するドロップイン コンポーネント。
  </Card>
  <Card variation="outlined">
    **[ホスティング](/[platform]/deploy-and-host/)**

    Git ベースの CI/CD、ブランチプレビュー、カスタムドメイン、サーバーサイドレンダリングサポートを備えたフルスタック Web アプリをデプロイしてホストします。
  </Card>
</Columns>

各柱は独立して動作します — 独自のバックエンドでフロントエンドライブラリのみを使用するか、静的サイトのみのホスティングを使用してください。一緒に使用すると、統合されたフルスタック開発エクスペリエンスが提供されます。

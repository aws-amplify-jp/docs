---
title: "「Cannot find module $amplify/env/<function-name>」のトラブルシューティング"
section: "build-a-backend/troubleshooting"
platforms: ["angular", "javascript", "flutter", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2025-11-03T15:11:39.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/"
---

<!-- Platform: javascript,  react-native, angular, flutter, nextjs, react -->
Amplify Gen 2 アプリをデプロイする際、Amplify Console のフロントエンドビルドで `Cannot find module $amplify/env/<function-name>` というエラーメッセージが表示される場合があります。このエラーは、フレームワークの `tsconfig.json` 設定が `amplify` ディレクトリを取得してモジュールとして解決しようとするときに発生します。このモジュールは、Amplify がビルド時にインジェクトする環境変数のプレースホルダーです。このエラーを解決するには、`amplify` ディレクトリを除外する必要があります。

`tsconfig.json` で `amplify` ディレクトリを除外するには、`exclude` セクションに以下の行を追加します。

```ts title='tsconfig.json'
{
  "exclude": ["amplify/**/*"]
}
```

Amplify は、サンドボックスとパイプラインデプロイ時に、Amplify バックエンド内の `amplify/tsconfig.json` ローカルな tsconfig を使用してタイプチェックを実行します。ベース設定を拡張する場合は、ローカライズされた tsconfig に追加できます。

別の方法として、モノレポ内で作業する場合は、バックエンドを独自のパッケージに移動し、スキーマとアウトプットをエクスポートして、他のアプリとの共有を簡単にすることができます。たとえば、バックエンドパッケージの `package.json` では

```json title='package.json'
{
  "name": "my-backend",
  "private": true,
  "exports": {
    "./schema": "./amplify/data/resource.ts",
    "./outputs": "./amplify_outputs.json"
  }
}
```
<!-- /Platform -->

<!-- Platform: vue -->
Amplify Gen 2 アプリをデプロイする際、Amplify Console のフロントエンドビルドで `Cannot find module $amplify/env/<function-name>` というエラーメッセージが表示される場合があります。このエラーは、フレームワークの `tsconfig.json` 設定が `amplify` ディレクトリを取得してモジュールとして解決しようとするときに発生します。このモジュールは、Amplify がビルド時にインジェクトする環境変数のプレースホルダーです。このエラーを解決するには、`tsconfig.app.json` ファイルに `resource.ts` ファイルを含める必要があります。

たとえば、`data` リソースに依存する `function` リソースがある場合は、`tsconfig.app.json` ファイルに両方の `resource.ts` ファイルを含める必要があります。

```ts title='tsconfig.app.json'
{
  "include": [
    "amplify/data/resource.ts",
    "amplify/function/api-function/resource.ts",
  ]
}
```
<!-- /Platform -->

`amplify-app` ユーティリティは、Amplify CLI と Xcode の間の統合レイヤーを提供します。

最初に最新のバージョンがインストールされていることを確認してください:

```bash
npm install -g amplify-app
```

次に、 **コマンド** を実行して、Amplify アプリ構造を作成し、必要なファイルを Xcode に自動的に追加します。

```bash
anplify-app --platform ios
```

コマンドが完了すると、 `AmplifyConfig` という名前の新しいグループがプロジェクトに追加され、次のファイルが含まれている必要があります。

- `AmplifyConfig/`
  - `anplifyconfiguration.json`
  - `awsconfiguration.json`
  - `schema.graphql`

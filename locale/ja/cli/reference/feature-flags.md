---
title: 機能フラグ
description: Amplify CLI の機能フラグの詳細情報
---

機能フラグを使用すると、Amplify CLI で特定の機能を微調整することができます。

それらは機能の領域に基づいてセクションにグループ化されます。領域はカテゴリまたはその他のスコープにすることができます。 さまざまな種類の機能フラグが定義されており、ライフサイクルプロセスのライフサイクルが制御されます。

## 機能フラグの種類

### リリース

これらのタイプの機能フラグは、アクティブな開発中の Amplify CLI で特定の機能を有効または無効にするために使用されます。 これらの機能フラグは削除され、機能が出荷されるとサポートされなくなります。

### 機能

Amplify CLI の履歴には、新しいプロジェクトに有益な機能強化がありますが、既存のデプロイメントに壊れた変更を引き起こす可能性があります。 これらの機能フラグは、ライフサイクルプロセスによって制御され、緩和と移行の時間を提供します。 これらのタイプのフラグは、既存のプロジェクトで無効になり、新しいフラグで有効になります。

例

- 異なるコードを生成することで既存のプロジェクトを破壊し、バックエンドのデプロイが必要になります。
- 変更されたリソースのプッシュ操作には、データが失われる可能性のあるリソース再作成が必要です。
- 変更されたリソースのプッシュ操作では、クライアントアプリケーションを動作させるためにデータバックフィルが必要になります。
- クライアントアプリケーション用に生成されたコードを再構築し、新しくプッシュされたバックエンドと互換性があるように再発行する必要があります。

### 実験

実験的な機能フラグは、与えられた機能の実験を可能にし、Amplify CLI チームにフィードバックを提供することです。 本番環境でこれらの機能を有効にすることは非常に推奨されません。

実験的な機能の結果は次のとおりです。
- この機能は製品になりますので、リリースタイプの機能フラグになります。
- 実験的な機能は、製品を作り、コード自体と一緒にコードベースから削除されていません。

## ライフサイクル

各タイプの機能フラグは、ライフサイクル管理プロセスで管理されます。 Amplify CLI に機能フラグが追加されると、リリースノートに記載され、このページは詳細情報とともに更新されます。 機能フラグを追加した後、このページには機能フラグが追加されたバージョンに関する情報が含まれます。 予定されている廃止予定日は何ですか? - がある場合は - 、 どのバージョンの機能フラグが廃止されたのか、どのバージョンの機能フラグが削除されました。

機能フラグが廃止された場合でも使用できますが、Amplify CLI コマンドの実行中に警告が表示されます。

削除する前に、機能フラグに削除日が追加されます。 機能フラグが削除されると、Amplify CLI にエラーメッセージが表示され、バージョンの機能フラグがページに追加されます。

## 設定

Configuration of feature flags are primarily done by having an `cli.json` file in the project's `amplify` folder. If the file does not exist Amplify CLI creates it during the `amplify init` command. The emitted values are representing the default values for new projects. This file must be under version control, to make sure that the same features are used locally, in CI/CD environments, between team members. If an environment specific file exists for the currently checked out environment, during `amplify env add` command the same file will be copied for the newly created environment as well.

設定ファイルの例

```json
{
    "features": {
        "graphQLTransformer": {
            "transformerVersion": 5
        },
        "keyTransformer": {
            "defaultQuery": true
        },
        "experimental": {
            "feature1": true,
            "feature2": false
        },
        "release": {
            "lambdaLayers": true
        }
    }
}
```

何らかの理由で、指定された Amplify CLI 環境で異なる機能を有効にする必要がある場合、以下の命名規則を持つプロジェクト レベル ファイルからコピーを作成できます。 `cli。{environment name}.json`.

### 環境変数

Amplify CLI は、環境変数や `.env` ファイルからの機能フラグ値の定義とオーバーライドもサポートします。

Amplify CLI で取得するには、環境変数は命名規則に従う必要があります。

- プロジェクト レベルの上書き: `AMPLIFYCLI__{SECTION}__{PROPERTY}`、例: `AMPLIFYCLI_GRAPHQLTRANSFORMORVERSION`
- 環境特有のオーバーライド: `AMPLIFYCLI_{ENVNAME}__{SECTION}__ __{PROPERTY}`, for example: `AMPLIFYCLI_PROD_GRAPHQLTRANSFORMERVERSION`

If a `.env` file is used in the project's root folder, then it is being merged on top of the current process' environment variables, overwriting those.

### 評価順

複数の設定オプションとオーバーライドにより、Amplify CLIは以下のように上から下への評価を行います。

- `cli.json`
- `cli.{environment name}.json`
- プロジェクト レベルの環境変数
- CLI 環境レベル 環境変数

## 機能フラグ

現在、機能フラグが定義されていません。

<amplify-feature-flags />

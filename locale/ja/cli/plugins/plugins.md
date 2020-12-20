---
title: 概要
description: プラグインを使用すると、既存の Amplify CLI に追加のコマンドと機能を追加できます。プラグインパッケージの作成、公開、使用方法について学びます。
---  

プラグインはAmplify CLI プラグインで明示的に管理されます。プラグインを使用すると、既存の Amplify CLI に追加のコマンドと機能を追加できます。 このセクションでは、プラグインパッケージを作成、公開、消費するための手順と、フォルダ構造とプラグインパッケージ内のキーファイルについて説明します。

## 公式プラグイン
- anplify-category-analytics
- anplify-category-api
- anplify-category-auth
- anplify-category-function
- anplify-category-hosting
- anplify-category-interaction
- category-notifications
- 増幅カテゴリ予測
- 増幅カテゴリストレージ
- anplify-category-xr
- anplify-codegen
- amplify-frontend-javascript
- anplify-frontend-android
- anplify-frontend-ios
- amplify-provider-awscloudforming

## サードパーティのプラグイン

* [anplify-category-video](https://www.npmjs.com/package/amplify-category-video) - AWS AmplifyとAWS Media Servicesを搭載したモバイルおよびWebアプリケーションにビデオストリーミングを簡単に組み込むことができます。
* [amplify-category-docs](https://www.npmjs.com/package/amplify-category-docs) - Amplify CLI からAmplify Docsを表示する簡単な方法
* [amplify-category-data-importer](https://www.npmjs.com/package/amplify-category-data-importer) - プロジェクトを増幅するためのデータのシーディング、インポート、および管理のプロセスを自動化する
* [graphql-ttl-transformer](https://github.com/flogy/graphql-ttl-transformer) - AWS Amplify APIで古いエントリを自動削除するために、DynamoDBのリアルタイム機能を有効にする

## プラグインのインストール

Amplify CLI にサードパーティのプラグインを追加するには、次の手順を実行します。
- プラグインの作成者が [命名規則](~/cli/plugins/architecture.md#plugin-types) に従ってプラグインパッケージに名前を付けた場合。
1. `npm install -g <plugin>` を実行し、プラグインをグローバルの node_modules ディレクトリにインストールします。<br/>
2. `増幅プラグインスキャン` を実行して、Amplify CLI プラグインプラットフォームが新しく追加されたプラグインをピックアップします。

- プラグインの作成者が上記の命名規則に従ってプラグインパッケージに名前を付けなかった場合。
1. `npm install -g <plugin>` を実行し、プラグインをグローバルの node_modules ディレクトリにインストールします。<br/>
2. `amplify plugin add` を実行し、Amplify CLI プラグインプラットフォームにプラグインパッケージを明示的に追加するためのプラグインへのパスを提供します。

## プラグインコマンド

以下は、 `増幅プラグイン`の下のコマンドのスイートです。

* 増幅プラグインの設定
* anplifyプラグインスキャン
* 増幅プラグインの追加
* anmpify plugin remove
* プラグインリストを増幅する
* anplify plugin init
* 増幅プラグインの検証
* 増幅プラグインのヘルプ

### 設定

`amplify plugin configure` は、 `plugins.json` ファイルの以下の設定に使用されます:

* `plugin-directory` : プラグインパッケージがプラグインスキャン中に検索されるディレクトリを含む。
* `plugin-prefixes`: contains the plugin package name prefixes. A package named with such prefix is considered a plugin candidate and checked during a plugin scan. If `plugin-prefixes` is empty, all packages inside the scanned directories will be checked.
* `max-scan-interval-in-seconds` : 最後のスキャン時間が `max-scan-interval-in-seconds`より長くなった場合、Amplify CLI コアは再びスキャンします。 この値を 0 に設定すると、Amplify CLI コマンドの実行開始時に新しくスキャンされます。デフォルト値は 1 日です。

### スキャン

`amplify plugin scan` will start a fresh scan for plugins in the local environment. A configurable set of directories specified in `plugin-directories`, such as the global node_modules, are scanned for plugins.<br/> Execution of this command will completely update the contents of the `plugins` field in the `plugins.json`. The `last-scan-time` field in the `plugins.json` is the time stamp of the last plugin scan. Note that, other than manually started by this command, a plugin scan can also be triggered by a regular amplify command execution, for example if the Amplify CLI Core noticed something is incorrect, or the last scan time has passed for longer than `max-scan-interval-in-seconds`(set to be one day by default).

### 追加

`amplify plugin add` will prompt you to select a previously removed plugin (see below), or enter the full path of a local package to be added as a plugin into the Amplify CLI. The Amplify CLI Core verifies the existence and validity of the plugin package during execution of the this command. You can use this command to add a plugin that will not be found by the plugin scan process, e.g. if it is not in one of the `plugin-directories`, or its package name does not have the proper prefix as specified in the `plugin-prefixes`.

### 削除

`amplify plugin remove` will prompt you with the list of all the currently active plugins, and allow you to select the ones that you do not want to be included in the Amplify CLI. The Amplify CLI Core will remove the manifest of those plugins from the `plugins` field, so they will NOT be counted as active plugins anymore and will NOT be loaded during command executions.<br/> If a removed plugin is in one of the directories specified in the `plugin-directories`, and its package name has the prefix as specified in the `plugin-prefixes`, it is then inserted in the `excluded` field of the `plugins.json` file. This will not be inserted back to the `plugins` field in the next plugin scan. The actual plugin packages themselves are not removed from your computer, and they can be added back as active plugins by `amplify plugin add`.

### リスト

`増幅プラグインリスト` は、ローカルAmplify CLI プラグインプラットフォームの他の情報とともに、アクティブなすべてのプラグインをリストします。

### init

The Amplify CLI provides the command `amplify plugin init` (with alias `amplify plugin new`) for the development of plugins.<br/> This command first collects the requirements from you and then creates the skeleton of the plugin package for you to start the development. The newly created plugin package is added to your local Amplify CLI platform, so you can conveniently test its functionalities while it is being developed. It can be easily removed from the platform with the `amplify plugin remove` command and added back with the `amplify plugin add` command.

### 確認する

Amplify CLI はユーティリティコマンド `増幅プラグイン 検証` を提供し、以下を確認します。

* パッケージはプラグインに必要なインターフェイスメソッドを実装しています。
* The `commands` field contains all the required commands for the type of the plugin. `amplify plugin verify` command treats the folder where it is executed as the root directory of the plugin package. The command can be executed manually. Its functionality is also invoked by the `amplify plugin scan` and `amplify plugin add` commands.

### ヘルプ

`増幅プラグイン` の下でコマンドのヘルプ情報を出力します。


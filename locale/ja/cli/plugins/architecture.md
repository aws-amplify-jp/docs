---
title: 建築
description: Amplify CLI は、プラグイン可能なアーキテクチャを持っています。CLI コアは、プラグインプラットフォームを提供し、CLI カテゴリのほとんどは、プラグインとして実装されています。
---  

Amplify CLI は、プラグイン可能なアーキテクチャを持っています。CLI コアは、プラグインプラットフォームを提供し、CLI カテゴリのほとんどは、プラグインとして実装されています。

## 概要

![画像](~/images/plugin-platform.png)

The Amplify CLI Core maintains a `plugins.json` file to store the plugin management configuration settings and information of all the installed plugins.  <br/> The Amplify CLI plugins each contain an `amplify-plugin.json` file to manifest themselves as valid plugins.  <br/> The Amplify CLI Core provides a set of utility commands under `amplify plugin` for plugin management and to facilitate the development of plugins.

The Amplify CLI Core does not dynamically scan for plugins at the beginning of each command execution. Instead, information about the installed plugins are retrieved from the `plugins.json` file and only the plugins that are needed for the execution of the command will be loaded.

`plugins.json` ファイルは、パス `<os.homedir>/.amplify/plugins.json`に保存されます。 何をしているのかわからない限り、手動でこのファイルを編集してはいけません。 そうでなければ、Amplify CLIのローカルインストールを破損する危険性があります。

`plugins.json` ファイルは以下の場合に作成または更新されます。

* If the `plugins.json` file is not found when the Amplify CLI Core tries to access it, the Amplify CLI Core will create this file and scan the local environment for plugins, and then store the information in the file.
* 最後のスキャン時間が1日以上前(設定可能)の場合、Amplify CLI Coreは再びスキャンし、情報を更新します。
* 不正確さが検出された場合、例えば指定されたプラグインがロードできない場合、Amplify CLI Coreは再度スキャンし、情報を更新します。
* After the execution of any of the `amplify plugin` commands that could change it, e.g. `amplify plugin scan`, `amplify plugin add/remove`.

By default, the CLI core searches for plugins in its parent directory, its local `node_modules` directory, and the global `node_modules` directory. Plugins are recognized by the `amplify-` prefix in the package names.

プラグインは、CLI コアと、プロジェクトのメタデータを介して相互に通信します。 CLI コアは、プラグインのプロジェクトメタデータへの読み取りおよび書き込みアクセスを提供します。 プロジェクトのメタデータは、ユーザー プロジェクトの `anplify/backend/anplify-meta.json` ファイルに格納されます。

## プラグインの種類
![画像](~/images/AmplifyCliConcept.jpg)

プラグインには4種類あります。
- カテゴリ
- プロバイダー
- フロント
- util

### カテゴリプラグイン
Amplify maintained category plugins are recognized by the `amplify-category-` prefix in the package name.<br/> A category plugin wraps up the logic to create and manage one category of backend resources in the cloud. It defines the "shape" of the cloud resources based on user (the developer) input, constructs parameters to CRUD cloud resource, and exports relevant cloud resource information to the project metadata.

カテゴリーはAWSによって管理され、クライアントエンジニアがUXの一部として構築している機能的なユースケースです。 サービスの実装ではありません

### プロバイダー プラグイン
Amplify maintained provider plugins are recognized by the `amplify-provider-` prefix in the package name.<br/> A provider plugin abstracts the actual cloud resource provider. It wraps up communication details such as access credentials, api invoke, wait logic, and response data parsing. It also exposes simple interface methods for the category plugins to CRUD cloud resource.

#### AWS CloudFormationプロバイダー
Currently, the only official provider plugin, amplify-provider-awscloudformation, uses the AWS CloudFormation to form and update the backend resources in the AWS for the amplify categories. For more information about  AWS CloudFormation, check its user guide: [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html). The `amplify-provider-awscloudformation` uses [nested stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html).

### フロントエンドプラグイン
Amplify maintained frontend plugins are recognized by the `amplify-frontend-` prefix in the package name.<br/> A frontend plugin handles a specific type of frontend projects, such as Javascript, Android or iOS projects. Among other things, it provides the following functionalities:
- クラウドリソース情報をフォーマットし、正しい場所のファイルに書き込むことで、フロントエンドプロジェクトで認識および消費されることができます。
- バックエンドのホットワイヤードをクラウドリソースに接続し、フロントエンドアプリケーションをローカルに構築します。
- 目的のユーザーにアプリケーション（フロントエンドとバックエンド）をビルドして公開します

### util plugin
公式の util プラグインは `anplify-` プレフィックスによって認識されます。パッケージ名のプラグインタイプの装飾はありません。 util houseプラグインはクラウドのバックエンドリソースを管理しません ただし、CLI コアおよびその他のプラグインに特定の CLI コマンドおよび/または特定の機能を提供します。

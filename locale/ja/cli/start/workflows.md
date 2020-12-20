---
title: 典型的なワークフロー
description: 新しいAmplifyプロジェクトやその他の典型的なAmplifyワークフロー & コマンドを初期化する方法。
---

## 新しいプロジェクトを初期化

新しいAmplifyプロジェクトを初期化するには、フロントエンドアプリのルートディレクトリから次のコマンドを実行します。
```
initを増幅する
```

`init` コマンドは、次のステップを実行します。
- プロジェクトを分析し、フロントエンドの設定を確認します
- 選択したフロントエンドの初期化ロジックを実行します。
- 複数のプロバイダプラグインがある場合は、クラウドリソースへのアクセスを提供するプラグインを選択するように促します
- 選択したプラグインの初期化ロジックを順番に実行します。
- プロジェクトのルートディレクトリにアンプフォルダ構造を挿入し、最初のプロジェクト構成を指定します。
- 上記のプラグインの出力でプロジェクトのメタデータファイルを生成します
- [AWS Amplify Console](https://console.aws.amazon.com/amplify) でクラウドプロジェクトを作成し、すべてのバックエンド環境のリソースを表示および管理します。

## サンプルAmplifyプロジェクトを複製

サンプル増幅プロジェクトを複製するには、空のディレクトリ内で以下のコマンドを実行します。

`amplify init --app <github url>`

ここで、Github URL は有効なサンプル増幅プロジェクトリポジトリです。詳細については、 [ここ](~/cli/usage/headless.md#--app) をクリックしてください。

## 一般的な CLI コマンド

### initを増幅する
init プロセスでは、root スタックは 3 つのリソースで作成されます。

- 認証されていないユーザーのIAMロール
- 認証済みユーザーのIAMロール
- S3バケット、デプロイバケット、このプロバイダのワークフローをサポートする

プロバイダは、ルートスタックの情報とリソースをプロジェクトのメタデータ ファイルに記録します(anplify/backend/anplify-meta.json)。


### amplify \<category\> を追加
Once init is complete, run the command `amplify \<category\> add` to add resources of a category to the cloud. This will place a CloudFormation template for the resources of this category in the category's subdirectory `amplify/backend/\<category\>` and insert its reference into the above-mentioned root stack as the nested child stack. When working in teams, it is good practice to run an `amplify pull` before modifying the backend categories.

### push を増幅する
Once you have made your category updates, run the command `amplify push` to update the cloud resources. The CLI will first upload the latest versions of the category nested stack templates to the S3 deployment bucket, and then call the AWS CloudFormation API to create / update resources in the cloud. Based upon the resources added/updated, the `aws-exports.js` file (for JS projects) and the `awsconfiguration.json` file (for native projects) gets created/updated. The root stack's template can be found in `amplify/backend/awscloudformation`.

### 増幅する
The `amplify pull` command operates similar to a *git pull*, fetching upstream backend environment definition changes from the cloud and updating the local environment to match that definition. The command is particularly helpful in team scenarios when multiple team members are editing the same backend, pulling a backend into a new project, or when connecting to [multiple frontend projects](~/cli/teams/multi-frontend.md) that share the same Amplify backend environment.

### 増幅コンソール
`増幅コンソール` コマンドを使用すると、AWS Amplifyコンソールのクラウドプロジェクトに誘導されるブラウザが起動します。 Amplifyコンソールは、開発チームがバックエンド環境を表示および管理し、バックエンドデプロイの状態を管理するための中心的な場所を提供します。 Amplifyカテゴリによるバックエンドリソースへの深いリンクと、環境をプル、クローン、更新、または削除する方法に関する手順。

### プロジェクトを増幅する
The `amplify configure project` command is an advanced command and not commonly used for initial getting started projects. The command should be used to modify the project configuration present in the `.config/` directory and re-configuring AWS credentials (based on profile on your local machine) set up during the `amplify init` step. The `.config/` directory is generated in the `amplify/` directory, if not already present, and the `local-aws-info.json`, `local-env-info.json` and `project-info.json` files are configured to reflect the selections made as a part of the `amplify configure project` command.

`amplify configure project` is also used to enable **Serverless Container** options in your project with Amazon Elastic Container Service. When enabled, you will be able to build APIs with both AWS Lambda and AWS Fargate using a [Dockerfile](https://docs.docker.com/engine/reference/builder/) or a [Docker Compose file](https://docs.docker.com/compose/compose-file/). See [Serverless Containers](~/cli/usage/containers.md) for more information.

## コマンド一覧

- `amplify <category> <subcommand>`
- `push を増幅する`
- `増幅する`
- `anmpify env <subcommand>`
- `増幅の設定`
- `増幅コンソール`
- `amplify削除`
- `助けを増幅する`
- `initを増幅する`
- `amplify publish`
- `増幅ラン`
- `増幅の状態`

### カテゴリコマンド

- `増幅する <category> を追加`
- `増幅する <category> の更新`
- `amplify <category> remove`
- `amplify <category> push`

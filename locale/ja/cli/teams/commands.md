---
title: マーク
description: Amplify CLI コマンドを使用して、複数の環境でチームワークフローを管理します。
---
 
## チームワークフロー

Amplify環境では、ローカルおよびクラウド環境を管理してチームワークフローを模倣することができます。一般的なタスクは次のとおりです。
- 開発プロセスをサポートする環境を管理します。例: 開発、ステージング、生産
- 安全に新機能をテストする
- チームメンバー間で環境を共有
- サポートチームワークフロー

新しいAmplifyプロジェクトで使用可能なすべてのコマンドを表示するには、ルートディレクトリから次のコマンドを実行します。
```
増幅env
```

## コマンドの概要

| (Command)                                                                                                                                | 説明                |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| [`anmpify env add`](#add-a-new-environment)                                                                                              | 新しい環境を追加          |
| [`enmify env pull [--restore]`](#pull-the-environment-from-the-cloud)                                                                    | クラウドから現在の環境をプルします |
| [`anmpify env checkout <env-name> [--restore]`](#checkout-an-environment)                                                          | 選択した環境に切り替えます     |
| [`anmpify env list [--details] [--json]`](#list-environments)                                                                            | すべての環境のリストを表示します  |
| [`amplify env get --name <env-name>`](#show-environment-details)                                                                   | 環境の詳細を表示します       |
| [`amplify env import --name <env-name> --config <provider-configs> [--awsInfo <aws-configs>]`](#import-an-environment) | 環境をインポート          |
| [`enmify env remove <env-name>`](#remove-an-environment)                                                                           | 環境を削除             |

## 環境 CLI コマンド

### 新しい環境を追加
```
anmpify env add
```
`add` コマンドは次のステップを実行します。
- 新しい環境の名前を尋ねます
- 認証されていないユーザーのIAMロールを作成
- 認証済みユーザーのIAMロールを作成
- デプロイ用のS3バケットを作成
- リソースを表示および管理するために、 [AWS Amplify Console](https://console.aws.amazon.com/amplify) で新しいバックエンド環境を作成します。

### クラウドから環境を引っ張ってください
```
enmify env pull [--restore]
```
Use this command to pull the current environment from the cloud. Add the `--restore` flag to overwrite your local changes like `amplify pull` command.

### 環境をチェックアウト
```
anmpify env checkout <env-name> [--restore]
```
\<env-name\> 環境をチェックアウトするには、このコマンドを使用します。ローカルの変更を上書きするには、 `--restore` フラグを追加します。

### リスト環境
```
anmpify env list [--details] [--json]
```
このコマンドを使用して、すべての環境を一覧表示します。 `--details` または `--json` フラグを追加して詳細を表示し、出力をフォーマットします。 詳細には、AWSリージョン、IAMロール、S3バケット、スタック情報が含まれます。

`dev` 環境と `テスト` 環境を持つAmplifyプロジェクトについては、以下の出力を参照してください。アクティブな環境の前にはアスタリスクが付きます。

```bash
envリストを増幅する
```

```console
| 環境 |
| ------------ |
| *dev |
| test |
```

### 環境の詳細を表示
```
amplify env get --name <env-name>
```
\<env-name\> 環境のすべての詳細を一覧表示するには、このコマンドを使用します。詳細にはAWSリージョン、IAMロール、S3バケット、スタック情報が含まれます。

### 環境をインポート
```
amplify env import --name <env-name> --config <provider-configs> [--awsInfo <aws-configs>]
```
既存の環境をインポートするには、このコマンドを使用します。bash コマンドの例を以下に示します。

```
#!/bin/bash
set -e
IFS='|'

AWSCLOUDFORMATIONCONFIG="{\
\"Region\": \"us-east-1\",\
\"DeploymentBucketName\": \"mytestproject-20181106123241-deployment\",\
\"UnauthRoleName\": \"mytestproject-20181106123241-unauthRole\",\
\"StackName\": \"mytestproject-20181106123241\",\
\"StackId\": \"arn:aws:cloudformation:us-east-1:132393967379:stack/mytestproject67-20181106123241/1c03a3e0-e203-11e8-bea9-500c20ff1436\",\
\"AuthRoleName\": \"mytestproject67-20181106123241-authRole\",\
\"UnauthRoleArn\": \"arn:aws:iam::132393967379:role/mytestproject67-20181106123241-unauthRole\",\
\"AuthRoleArn\": \"arn:aws:iam::132393967379:role/mytestproject67-20181106123241-authRole\"\
}"
PROVIDER_CONFIG="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"


AWS_CONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"default\"\
}"

amplify env import \
--name dev \
--config $PROVIDER_CONFIG \
--awsInfo $AWS_CONFIG \
--yes

```

既存のAmplifyプロジェクトから `AWSCLOUDFORMATIONCONFIG` を `team-provider-info.json` ファイルから取得できます。

### 環境を削除
```
enmify env remove <env-name>
```
このコマンドを使用して、環境を削除します。これにより、すべてのプロビジョニングされたサービスとリソースを含むローカル環境とクラウド環境の両方が削除されます。

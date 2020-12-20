---
title: ファイルとフォルダ
description: Amplifyがプロジェクトの状態を維持するために使用するファイルとフォルダの詳細については、こちらをご覧ください。
---

## フォルダ
CLI は、 `amplify init` の間に、プロジェクトのルートディレクトリに以下のフォルダ構造を配置します。

```
amplify
  .config
  #current-cloud-backend
  backend
```

### amplify/.config
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: はい

クラウド構成と `設定/環境設定`を格納するファイルが含まれています。プロジェクト構成を変更するには、 `増幅設定` を実行します。

### amplify/#current-cloud-backend
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: いいえ

Contains the current cloud state of the checked out environment's resources. The contents of this folder should never be manually updated. It will be overwritten on operations such as `amplify push`, `amplify pull` or `amplify env checkout`.

### anplify/backend
> 手動編集は問題ありません: はい

> バージョン管理に追加: はい

Contains the latest local development state of the checked out environment's resources. The contents of this folder can be modified and running `amplify push` will push changes in this directory to the cloud. Each plugin stores contents in its own subfolder within this folder.

### amplify/mock-data
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: いいえ

`amplify mock api`を実行した後にのみ作成されます。 モック時にローカルAPIをバックアップするために使用されるSQLiteデータベースが含まれています。 内容は変更すべきではありませんが、ローカルAPIの状態を消去したい場合はフォルダを削除することができます。
## コアAmplify ファイル

これらのファイルは、プロジェクトで構成されているリソースなど、Amplifyプロジェクトの全体的な状態を維持するために協力します。 最後の一押しがあった時とリソース間の依存関係です

### amplify-meta.json
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: いいえ

Both the `amplify/backend` and `amplify/#current-cloud-backend` directories contain an `amplify-meta.json` file. The `amplify-meta.json` in the `backend` directory serves as the whiteboard for the CLI core and the plugins to log internal information and communicate with each other.

CLI コアは、プラグインのファイルへの読み取りおよび書き込みアクセスを提供します。 Coreはinit後に選択したプロバイダの出力を収集し、「providers」オブジェクトの下にそれらを記録します。例えば、 awscloudforming Providerはルートスタック、デプロイメントS3バケットの情報を出力します そして認可された/許可されていない IAM ロール、およびそれらはプロバイダの下でログインされます。 wscloudforming object. 各カテゴリプラグインは独自の名前で情報を記録します。

1つのカテゴリで1つのプロジェクト内に複数のサービスが作成される可能性があるためです (例: 「インタラクション」カテゴリは複数のボットを作成できます)、カテゴリメタデータは一般的に次のような2つのレベルの構造に従います。

```json
{
    "<category>": {
        "<service1>": {
            //service1 metadata
        },
        "<service2>": {
            //service2 metadata
        }
    }
}
```
The metadata for each service is first logged into the meta file after the `amplify <category> add` command is executed, containing some general information that indicates one service of the category has been added locally. Then, on the successful execution of the `amplify push` command, the `output` object will be added/updated in the service's metadata with information that describes the actual cloud resources that have been created or updated.

### aws-exports.js
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: いいえ

This file is generated only for JavaScript projects. It contains the consolidated outputs from all the categories and is placed under the `src` directory specified during the `init` process. It is updated after `amplify push`.

このファイルは、設定のための [Amplify](https://github.com/aws-amplify/amplify-js) JavaScript ライブラリによって使用されます。 非機密で外部にのみ必要とされる情報が含まれています。 クライアントからの未認証アクション (Authの場合はユーザ登録やサインインフローなど)、承認後に適切なエンドポイントURLを構築するアクション。 以下のより詳細な説明をご覧ください。

- [Cognitoのセキュリティベスト プラクティス(ウェブアプリ)](https://forums.aws.amazon.com/message.jspa?messageID=757990#757990)
- [セキュリティ/ブラウザJSアプリでpoolData(UserPoolId, ClientId)のベストプラクティス。](https://github.com/amazon-archives/amazon-cognito-identity-js/issues/312)
- [CognitoユーザープールIDとクライアントIDは敏感ですか?](https://stackoverflow.com/a/47865747/194974)

### anplifyconfiguration.json
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: いいえ

このファイルは `aws-exports.js` と同じですが、Android と iOS のプロジェクトでは同じです。

設定用に [iOS](https://github.com/aws/aws-sdk-ios/) および [Android](https://github.com/aws/aws-sdk-android) ネイティブSDKで使用されます。

### .gitignore
> 手動編集は問題ありません: はい

> バージョン管理に追加: はい

Amplify CLI から新しいプロジェクトが初期化されると、Amplifyは次のようになります。 ルートディレクトリ内のitignoreファイル。.gitignoreファイルは存在しない場合に作成されます。

```sh
#amplify
amplify/\#current-cloud-backend
amplify/.config/local-*
amplify/mock-data
amplify/backend/amplify-meta.json
amplify/backend/awscloudformation
build/
dist/
node_modules/
aws-exports.js
awsconfiguration.json
amplifyconfiguration.json
amplify-build-config.json
amplify-gradle-config.json
amplifytools.xcconfig
```

### team-provider-info.json
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: プライバシーがある場合のみ。

チーム内のプロジェクト情報の共有に使用します。詳細は [単一の環境を共有](~/cli/teams/shared.md#sharing-projects-within-the-team) をご覧ください。

### cli.json
> 手動編集は問題ありません: はい

> バージョン管理に追加: はい

Contains feature flag configuration for the project. If this file does not exist, it is created by Amplify CLI during `amplify init`. Environment specific feature flag overrides can also be defined in `cli.<environment name>.json`.  If an environment specific file exists for the currently checked out environment, during `amplify env add` command the same file will be copied for the newly created environment as well. Learn more at [Feature flags](~/cli/reference/feature-flags.md).

## 一般的なカテゴリファイル

各カテゴリプラグインにはいくつかの一意のファイルがありますが、すべてのカテゴリに格納されたいくつかの一般的なファイルもあります。

### \<category>-parameters.json
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: はい

`amplify add <category>` の間に選択されたパラメータを格納し、 `amplify update <category>`の間に回答を入力するために使用することができます。 このファイルは基礎となるカテゴリ設定を変更しません。ウォークスルーで回答を入力するためにのみ使用されます。

### parameters.json
> 手動編集は問題ありません: はい

> バージョン管理に追加: はい

CloudFormationパラメータ名をカテゴリのCloudFormationテンプレートに渡される値にマッピングするJSONオブジェクトが含まれています。 例えば、CloudFormationテンプレートにパラメータがある場合:
```json
{
    "Parameters": {
        "RoleArn": {
            "Type": "String",
            "Default": "<default role ARN>"
        }
    }
}
```
そして `parameters.json` には、
```json
{
    "RoleArn": "<role ARN override>"
}
```
すると、テンプレートがプッシュされたときの"RoleArn"の値は"\"になります。<role ARN override\>".

## 関数カテゴリファイル

### amplify.state
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: はい

CLIがどのように構築し、関数を呼び出すかに関する内部メタデータが含まれています。

## AppSync APIカテゴリファイル

### transform.conf.json
> 手動編集は問題ありません: いいえ

> バージョン管理に追加: はい

GraphQL スキーマを解釈し、AppSync リゾルバに変換する方法に関する構成が含まれています。 APIカテゴリの設定を変更するには、 `amplify api update` を実行してください。
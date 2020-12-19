---
title: CI/CD用ヘッドレスモード
description: Amplify CLI のいくつかのコマンドは、CI/CD フローで使用できる引数をサポートしています。
---

Amplify CLI のいくつかのコマンドは、CI/CD フローで使用できる引数をサポートしています。 Amplify CLI 引数は単純な文字列だけでなく、CLI がプロンプトで収集する情報を含む JSON オブジェクトも含みます。 求める情報が引数によって提供されている場合、CLI は入力をプロンプトしません(非対話的に動作します)。

コマンド実行フローがプロンプトで中断されないように、引数は主にスクリプトに使用されます。 この例は [こちら](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-cli/sample-headless-scripts)

**`--yes` フラグ**

The `--yes` flag, or its alias `-y`, suppresses command line prompts if defaults are available, and uses the defaults in command execution. The following commands take the `--yes` flag:
- `initを増幅する`
- `プロジェクトを増幅する`
- `push を増幅する`
- `amplify publish`
- `増幅する`

## `initパラメータを増幅する`
`amplify init` コマンドは以下のパラメータを取ります。
- `--amplify`
- `--frontend`
- `--providers`
- `--はい`
- `--app`

### `--amplify`
プロジェクトの基本情報が含まれており、以下のキーがあります。
- `projectName`: 開発中のプロジェクトの名前
- `appId`: AmplifyサービスプロジェクトID (オプション, 下記参照)
- `envName`: 最初の環境の名前
- `defaultEditor`: デフォルトのコード エディター

`appId` パラメータはオプションであり、2つのユースケースで使用されます。
- Amplify Service は、Amplify Web コンソールでプロジェクトを初期化するときに内部的に使用します。
- For project migrations. For projects initialized by Amplify CLI version prior to 4.0.0, no Amplify Service project is created online to track the backend environment's resources. The latest version of the Amplify CLI will create a new Amplify Service project for them in the post-push check. If you wanted to add the backend environment to an existing Amplify Service project instead of creating a new one, you can run `amplify init` again, and provide the `appId` inside the `--amplify` parameter, or explicitly as `amplify init --appId <Amplify-Service-Project-AppId>`.

### `--frontend`
CLI のフロントエンドプラグインの情報が含まれており、次のキーがあります。
- `frontend`: 選択したフロントエンドプラグインの名前 ( `amplify-frontend-` 接頭辞なし)。
- `framework`: the frontend framework used in the project, such as `react`. Only the `javascript` frontend handler takes it.
- `config`: フロントエンドプラグインの設定。

3つの公式フロントエンドプラグインがあります。 そして、それぞれの `config` オブジェクトの仕様を以下に示します: **`config` `javascript の`**

- `SourceDir`: The project's source directory. The CLI will place and update the `aws-exports.js` file in it, the `aws-exports.js` file is used to configure the `Amplify JS` library.
- `DistributionDir`: The project's distribution directory, where the build artifacts are stored. The CLI will upload the contents inside this directory to the S3 hosting buckets in the execution of the `amplify publish` command.
- `BuildCommand`: The build command for the project. The CLI invokes the build command before uploading the contents in the distribution directory in the execution of the `amplify publish` command.
- `StartCommand`: The start command for the project, used for local testing. The CLI invokes the start command after it has pushed the latest development of the backend to the cloud in the execution of the `amplify run` command.

**`` で `android の構成`**

- `ResDir`: `app/src/main/res` などの Android プロジェクトのリソースディレクトリ。

**`ios` の `設定`**

`ios` フロントエンドハンドラは `config` オブジェクトを取得しません。

### `--providers`
プロバイダプラグインの構成設定が含まれています。 キーは( `anplify-provider-` 接頭辞なしで)プロバイダプラグインの名前であり、値はその設定です。 このオブジェクトに含まれるプラグインは初期化され、クラウドリソースの作成とメンテナンスのための機能を提供することができます。

現在、公式プロバイダプラグインは1つしかありません: `amplify-provider-awscloudforming`, この設定は、CLI が aws の資格情報とリージョンを解決するためのもので、以下の仕様を示します。

- `configLevel`: The configuration level is either `project` or `general`. Unless explicitly set to `general`, the `project` level is chosen. `general` level means the CLI will not manage configuration at the project level, it instead relies on the AWS SDK to resolve aws credentials and region. To learn how it works, check the AWS SDK's documents on [credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) and [region](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html). `project` level means the configuration is managed at the project level by the CLI, each project gets its own independent configuration. The following attributes are used only when the configuration is at project level
- `useProfile`: A boolean indicating whether to use a profile defined in the shared config file (`~/.aws/config`) and credentials file (`~/.aws/credentials`). <br/>
- `profileName`: `useProfile` がtrueに設定されている場合のプロファイル名。
- `accessKeyId`: The aws access key id if `useProfile` is set to false.
- `secretAccessKey`: `useProfile` が false に設定されている場合、aws 秘密のアクセスキー。
- `region`: The aws region if `useProfile` is set to false.

### `--app`

`amplify init --app git@github.com:<github-username>/<repository-name>.git`

提供された GitHub リポジトリ URL からサンプル増幅アプリケーションのリソースをインストール、初期化、およびプロビジョニングします。 このオプションは、空のディレクトリで実行する必要があります。サンプルリポジトリには、以下を含む増幅フォルダが必要です。

- `.config フォルダーの project-config.json`
- `backend-config.json`
- バックエンドフォルダ内の必要なクラウドフォーメーションファイル
    - 例: スタック, `schema.graphql` for api
    - 例: auth 用の cloudformation テンプレート


- local-env.json と local-aws-info.json は *NOT* required

If the repository contains a `yarn.lock` and/or `package.json` file, the sample will be installed with the corresponding package manager and started after resources have been provisioned.

### サンプルスクリプト
```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"envName\":\"myenvname\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `amplify configure プロジェクト` パラメータ
The `amplify configure project` command allows the user to change the configuration settings that were first set by `amplify init`, and it takes the same parameters as the `amplify init` command:
- `--amplify`
- `--frontend`
- `--providers`
- `--はい`

### サンプルスクリプト
```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify configure project \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `push/publish` パラメータを増幅する
The `amplify publish` command internally executes `amplify push` so it takes the same parameters as push command. The `amplify push` command takes the following parameters
- `--codegen`
- `--はい`

### `--codegen`
AppSync [codegen](~/cli/graphql-transformer/codegen.md)の構成が含まれており、以下の仕様が含まれています。
- `generateCode`: <br/> GraphQL 用にコードを生成するかどうかを示すブール値。<br/>
- `codeLanguage`: <br/> `javascript` のように、生成されたコードのターゲット言語。<br/>
- `fileNamePattern`:  <br/> GraphQL クエリ、変更、および契約のファイル名パターン。<br/>
- `generatedFileName`:  <br/> 生成されたコードのファイル名。<br/>
- `generateDocs`:  <br/> GraphQL ステートメントを生成するかどうかを示すブール値 (クエリ) GraphQLスキーマタイプに基づく変更とサブスクリプション)。 生成されたバージョンは、現在のGraphQLクエリ、変更、およびサブスクリプションを上書きします。<br/>

### サンプルスクリプト
```bash
#!/bin/bash
set -e
IFS='|'

CODEGEN="{\
\"generateCode\":true,\
\"codeLanguage\":\"javascript\",\
\"fileNamePattern\":\"src/graphql/**/*.js\",\
\"generatedFileName\":\"API\",\
\"generateDocs\":true\
}"

amplify push \
--codegen $CODEGEN \
--yes
```

## `pull` パラメータを増幅する
`amplify pull` コマンドは最新のバックエンド環境をローカル開発に引き下げます。 これは以下の2つのシナリオで使用されます:
1. Amplify CLI によってすでに初期化されているプロジェクトで。 クラウドから最新の情報を引き出し、 `anplify/#current-cloud-backend` ディレクトリの内容を更新します。 このシナリオで使用されている場合、このコマンドはパラメータを取りません。
2. On projects NOT yet initialized by the Amplify CLI, it pulls down a particular backend environment, and "attaches" it to the project. It will fully set up the `amplify` directory for the project.  The backend environment being pulled is specified by `appId` and `envName` in the `amplify` parameter (see below). The command takes the following parameters when used in this scenario.
- `--amplify`
- `--frontend`
- `--providers`
- `--はい`

### `--amplify`
プロジェクトの基本情報が含まれており、以下のキーがあります。
- `projectName`: 開発中のプロジェクトの名前
- `appId`: Amplify Service project Id
- `envName`: 上記の Amplify サービスのバックエンド環境の名前
- `defaultEditor`: デフォルトのコード エディター

### `--frontend`
CLI のフロントエンドプラグインの情報が含まれており、次のキーがあります。
- `frontend`: 選択したフロントエンドプラグインの名前 ( `amplify-frontend-` 接頭辞なし)。
- `framework`: the frontend framework used in the project, such as `react`. Only the `javascript` frontend handler takes it.
- `config`: フロントエンドプラグインの設定。

3つの公式フロントエンドプラグインがあります。 そして、それぞれの `config` オブジェクトの仕様を以下に示します: **`config` `javascript の`**

- `SourceDir`: The project's source directory. The CLI will place and update the `aws-exports.js` file in it, the `aws-exports.js` file is used to configure the `Amplify JS` library.
- `DistributionDir`: The project's distribution directory, where the build artifacts are stored. The CLI will upload the contents inside this directory to the S3 hosting buckets in the execution of the `amplify publish` command.
- `BuildCommand`: The build command for the project. The CLI invokes the build command before uploading the contents in the distribution directory in the execution of the `amplify publish` command.
- `StartCommand`: The start command for the project, used for local testing. The CLI invokes the start command after it has pushed the latest development of the backend to the cloud in the execution of the `amplify run` command.

**`` で `android の構成`**

- `ResDir`: `app/src/main/res` などの Android プロジェクトのリソースディレクトリ。

**`ios` の `設定`**

`ios` フロントエンドハンドラは `config` オブジェクトを取得しません。

### `--providers`
pullコマンドは公式プロバイダプラグインと結び付けられています: `anplify-provider-awscloudforming` はバックエンド環境をフロントエンドプロジェクトに取り付けます。
- `configLevel`: The configuration level is either `project` or `general`. Unless explicitly set to `general`, the `project` level is chosen. `general` level means the CLI will not manage configuration at the project level, it instead relies on the AWS SDK to resolve aws credentials and region. To learn how it works, check the AWS SDK's documents on [credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) and [region](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html). `project` level means the configuration is managed at the project level by the CLI, each project gets its own independent configuration. The following attributes are used only when the configuration is at project level
- `useProfile`: A boolean indicating whether to use a profile defined in the shared config file (`~/.aws/config`) and credentials file (`~/.aws/credentials`). <br/>
- `profileName`: `useProfile` がtrueに設定されている場合のプロファイル名。
- `accessKeyId`: The aws access key id if `useProfile` is set to false.
- `secretAccessKey`: `useProfile` が false に設定されている場合、aws 秘密のアクセスキー。
- `region`: The aws region if `useProfile` is set to false.

### サンプルスクリプト
```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"appId\":\"amplifyServiceProjectAppId\",\
\"envName\":\"myenvname\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `amplify delete` パラメータ
The `amplify delete` command deletes all of the resources tied to the current project in the cloud, and removes all of the local files created by the Amplify CLI from the filesystem. The `amplify delete` command takes these parameters:
- `--force`

### `--force`

他のコマンドがヘッドレス環境での使用をサポートする `--yes` パラメータと同等です。

### サンプルスクリプト
```bash
#!/bin/bash
set -e

amplify delete --force
```

---
title: サーバーレスコンテナ
description: AWSにコンテナをデプロイする サーバレスコンテナは、アカウントにRESTまたはGraphQL APIを構築するときにAWS Fargateを利用します。 コンテナは、単一の Dockerfile 定義または、Docker Compose ファイルを使用してデプロイできます。 ビルドとデプロイパイプラインをAWSアカウント内に作成します。
---

サーバーレスコンテナは、AWS Fargateを使用してAPIとホストWebサイトをデプロイする機能を提供します。 既存のアプリケーションまたは低レベルの制御を必要とするお客様は、Dockerコンテナを導入し、他のリソースと完全に統合されたAmplifyプロジェクトにデプロイできます。

Amplify [ライブラリ](~/lib/lib.md) を [Authカテゴリ](~/lib/auth/start.md) で使用することで、モバイルおよびWebアプリケーションの安全な接続とサーバーレスコンテナへのアクセス制御を行うことができます。 さらに、 AWS AppSyncやAmazon API Gatewayなどの既存のGraphQLおよびRESTサービスを同じプロジェクトで使用することができ、FargateにバックアップされたAPIとともに、コストの最適化と運用上のニーズに合わせた柔軟性を提供します。

サーバーレスコンテナには追加のコストと運用オーバーヘッドがかかります。 そのため、AmplifyでモバイルアプリやWebアプリを構築する際には、 [GraphQL Transform](~/cli/graphql-transformer/overview.md) を使用してAWS AppSyncを使用することをお勧めします。


> **Billing warning**: When you deploy serverless containers with Amplify, it incurs additional costs when resources are not in use for services such as VPC, Fargate, ECR, Cloud Map, CodePipeline, and CodeBuild. For more information refer to [VPC pricing](https://aws.amazon.com/vpc/pricing/), [Fargate pricing](https://aws.amazon.com/fargate/pricing/), [ECR Pricing](https://aws.amazon.com/ecr/pricing/), [CodePipeline pricing](https://aws.amazon.com/codepipeline/pricing/), [CodeBuild pricing](https://aws.amazon.com/codebuild/pricing/), and [Cloud Map pricing](https://aws.amazon.com/cloud-map/pricing/).

## はじめに

Serverless containers are not enabled in your Amplify CLI project by default. To get started you will need to run `amplify configure project` in order to see the options for deploying to Fargate. To get started initialize your project and enable **container-based deployments**:

```bash
$ amplify init

$ amplify configure project
 > コンテナベースのデプロイを有効にしますか? はい。
```

Next add a NoSQL Database table named **posts** with column called **id** of type **number** (N). Make this the **partition key**.
```bash
増幅してストレージを追加
```
```console
  > NoSQL Database # Name table “posts”

  > What would you like to name this column: id

  ? Please choose the data type: 
    string 
  > number 
    binary

  ? Please choose partition key for the table: (Use arrow keys)
  > id 
```

他の質問には **いいえ** を選択できます。 この後、REST (または GraphQL) のデフォルト ExpressJS テンプレートを使用して API を追加し、この DynamoDB テーブルへのアクセス権限を付与します。

```bash
増幅して api を追加
```
```console
  > REST
  > API Gateway + AWS Fargate (Container-based) 
  > ExpressJS - REST template 
  ? Do you want to access other resources in this project from your api? Y   # select yes
  > storage  # select posts table              # select post table and all permissions
    ◉ create
    ◉ read
    ◉ update
    ◉ delete
  > Do you want to restrict API access (Y/n)    # Will use Amazon Cognito if Yes is selected
```

Note the environment variables printed to the screen. If you choose a different database table name so that your variables are different from `STORAGE_POSTS_NAME` then update the `TableName` variable at the top of `./amplify/backend/api/<apiname>/src/DynamoDBActions.js` appropriately.

最後に、 `amplify push` を実行してバックエンドをデプロイします。
```bash
$ amplify push
```

これが完了すると、コンテナは自動化されたパイプラインを介して構築され、Amazon API Gateway HTTP APIによってフロントエンドされたECS クラスター上のFargate Tasksにデプロイされます。VPCへの直接クラウドマップ統合を使用します。 認証でAPIを保護するために *はい* を選択した場合 Amazon Cognitoユーザープールは、そのAPIのAuthorizer統合で作成されます。

## 単一のコンテナをデプロイ

単一のDockerfileシナリオでは、Dockerfileでビルドされた単一のコンテナでアプリケーションを実行し、Amplify CLIを使用してAWS Fargateにデプロイすることができます。

If you are unfamiliar with using a Dockerfile review the [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) guide or or add an API with an Amplify-provided template.

A simple Dockerfile example is below, which would start a NodeJS application (`index.js`) in a built image by copying all the source files and installing dependencies. This example also shows how could can specify environment variables and use the `EXPOSE` statement for defining your container's communication port.

```dockerfile
FROM public.ecr.aws/bitnami/node:14.15.1-debian-10-r8

ENV PORT=8080
EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "node", "index.js" ]
```

You will need an [`EXPOSE` statement in your Dockerfile](https://docs.docker.com/engine/reference/builder/#expose) to specify a port to communicate with the container. If you do not provide one Amplify will suggest to use port 80.

### ローカル開発とテスト

It is recommended to test your application locally first before deploying with `amplify push`, otherwise your Fargate Task may fail to start if there are application issues such as missing dependencies. With a Single Dockerfile you can do this by navigating to `./amplify/backend/api/<name>/src` and running `docker build -t` to build and tag your image followed by `docker run` to launch your container similar to the below example:

```console
$ cd ./amplify/backend/api/<name>/src
$ docker build -t node-app:1.0 .
$ docker run -p 8080:8080 -d node-app:1.0
$ curl -i localhost:8080  ## Alternatively open in a web browser
```

You can also run your application using standard tooling such as running `node index.js` or `python server.py` in Node or Python. Once you are satisfied with the Dockerfile and your application code, run `amplify push` and the `./amplify/backend/api/<name>/src` will be bundled for the build pipeline to run and deploy your image to Fargate. At the end of the deployment the endpoint URL will be printed and client configuration files will be updated.

## 複数のコンテナをデプロイします

If you wish to deploy multiple containers into Fargate to define your API, Amplify will parse a Docker Compose file (`docker-compose.yml`) in your `./amplify/backend/api/<name>/src` directory to define the backend service. If you are unfamiliar with using a Docker Compose review the [Docker Compose getting started guide](https://docs.docker.com/compose/gettingstarted/) or or add an API with an Amplify-provided template.

Composeファイルには、論理コンテナ名、ビルド & イメージ設定、起動コマンド、ポートなどが含まれています。Dockerコンポジションファイルの例は以下のとおりです。

```yaml
version: "3.8"
services:
  express:
    build:
      context: ./express
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    networks:
      - public
      - private
  python:
    build:
      context: ./python
      dockerfile: Dockerfile
    networks:
      - public
      - private
    ports:
      - "5000:5000"
networks:
  public:
  private:
```

This `docker-compose.yml` file would be placed in your `./amplify/backend/api/<name>/src` when using the "bring your own container" flow. It defines two containers called **express** and **python** which each have a Dockerfile in two sub directories along with the application source files

```
./amplify/backend/api/<name>/src
 docker-compose.yml
 /express
   Dockerfile
   package.json
   index.js
/python
   Dockerfile
   requirements.txt
   server.py
```

### ローカル開発とテスト

As with the single container workflow, it is recommended to test your application locally first before deploying with `amplify push`, otherwise your Fargate Task may fail to start if there are application issues such as missing dependencies. Navigate to `./amplify/backend/api/<name>/src` and run `docker-compose up` which will build your images and start them locally.

```console
$ cd ./amplify/backend/api/<name>/src
$ docker-compose up
$ curl -i localhost:8080 ## あるいはウェブブラウザで開く
```

アプリケーションソースが画像のいずれかに変更された場合。 テストと開発サイクル中に `docker-compose ビルド` を実行する前に `docker-compose ビルド` を実行することで、それらを再構築できます。

### コンテナネットワーク

複数のコンテナは、Fargate 内で 1 つのユニットとして展開されます (例: 同じタスク定義)。 この独自のデプロイメントにより、ローカルループバックインターフェイス上のコンテナ間のネットワーク接続が容易になり、追加の構成、コスト、操作、およびデバッグを回避できます。

#### コンテナがFargateにデプロイされたとき
ループバックインターフェースは 127.0.0 のIPです。 そして、あるコンテナのアプリケーションコードで別のコンテナと通信するために使用できる `localhost` のホスト名。

Using the `docker-compose.yml` example from earlier, you might have the following code in your NodeJS application. It references the *port* of the Redis container and a *host* using the loopback adapter with `localhost`:
```javascript
const options = {
  port: 5000,
  host: 'localhost',  //Loopback interface communication
  method: 'GET',
  path: '/images'
};

http.get(options, data => {...})
```
#### `docker-compose up` を使用してローカルでテストする場合
`docker-compose up` を使用してローカル開発とテストを行う場合は、 `docker-compose.yaml` ファイルで定義されている論理コンテナ名を使用します。

```javascript
const options = {
  port: 5000,
  host: 'python',   //Name of other container in docker-compose
  method: 'GET',
  path: '/images'
};

http.get(options, data => {...})
```

### サポートされる設定

Amplify will configure your Fargate infrastructure (ECS Service and Task Definition) automatically while allowing you to override specific settings with a Docker Compose file. Older versions of Compose files are supported however not all configuration values will be honored, therefore [it is recommended you update to 3.8](https://docs.docker.com/compose/compose-file/). Additionally if a value has been deprecated in one version of Compose, Amplify will prefer the newest version (3.8).

- ビルド
- 名前
- ポート
- (Command)
- entrypoint
- env_file
- 画像
- ヘルスチェック
- working_dir
- ユーザー
- 秘密
- レプリカ:

デフォルトでは、Amplifyはアベイラビリティゾーンを1つ使用しますが、 *High Availability* オプションを選択すると、Fargateタスクが3つのアベイラビリティゾーンに広がります。 トラフィックの要件に応じて、* * [`レプリカ`](https://docs.docker.com/compose/compose-file/#replicas) の値を使用して、 [クラスターで実行されている Fargate タスクの数を増やす必要があります。](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html#sd-desiredcount) しかし、より多くの実行中のタスクは、より多くのコストが発生することに注意してください。

When you have multiple container entries specifying a `port` Amplify will prompt you upon running `amplify push` to select an **Entrypoint Container**. Since all containers are deployed as a "unit" and fronted by an API Gateway HTTP endpoint for client applications to access, Amplify needs to know which container in the Cluster's Service to route requests. The answer to the Entrypoint question will use the first specified `ports` entry to perform this routing.

可能な場合は、開発プロセスの早期段階でコンテナ設定を定義することをお勧めします。 これらの設定は後で更新できますが、 これにより、Fargateサービス構成が置き換えられ、プロセスが完了する間、エンドポイントが利用できなくなる可能性があります。 最良の結果が得られるように、Docker Compose設定の構成変更を最小限に抑え、ビルドでの更新を利用してパイプラインをデプロイするためにより頻繁にアプリケーションコードを更新します。

### 環境変数と秘密

You can use environment variables in your application code that are specified in your Docker Compose file, but do not specify the hostname when deploying in `amplify push`. For example the `DATABASE_HOST` variable below might be specified locally when using `docker-compose up` with the  `environment` setting:

```yaml
environment:
  - DATABASE_DB=amplify
  - DATABASE_USER=root
  - DATABASE_PASSWORD=/run/secrets/db-password
  - DATABASE_HOST=db #comment out before pushing out
```

次に、アプリケーションコードはローカルとクラウドのデプロイメントを自動的に切り替え、 `db` コンテナと通信できます。

```javascript
module.exports = {
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 3306,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  },
  port: process.env.PORT || 8080
};
```

`secrets` allow you to [pass sensitive data to your containers from AWS Secrets Manager](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html). Amplify will do this for you when you populate the `secrets` configuration at the root level of your `docker-compose.yml`. It must be a file name that starts with `.secret-` and cannot be in the `src` directory of `./amplify/backend/api/<name>`, but can be anywhere outside of it including a relative path. It is recommended to place your secrets in a `./amplify/backend/api/<name>/secrets` directory. Every `.secret-` file has only one string value and will referenced by the name you provide in the `docker-compose.yml` entry.

When you perform an `amplify push` you will be prompted to store the secrets in the cloud or bypass (which may be the case in team workflows when one person controls secrets). The name of the secret will be available in your application code similar to if you specified other variables via the `environment` configuration:

```yaml
バージョン:"3. "
services:
  backend:
    build:
      args:
      - NODE_ENV=development
      context: backend
    environment:
      - DATABASE_NAME=mydb
secrets:
  DB_PASSWORD:
    file: . /secret/.secret-pass
```
**NodeJSの例**

```javascript
const database = process.env.DATABASE_NAME;
const password = process.env.DB_PASSWORD;
```

**Python example**

```python
import os
database = os.environ['DATABASE_NAME']
password = os.environ['DB_PASSWORD']
```

## クライアント設定

Serverless containers are fronted by a secure endpoint by which you can interact with them from a mobile or web application. Amplify CLI will attempt to update the project `aws-exports.js` or `amplifyconfiguration.json` file with the endpoint, however for GraphQL API types this is not possible and you will need to manually specify it in an `Amplify.configure()` call within your application code. The endpoint will be printed out to the screen after running an `amplify push` for you to make these changes, take note of it and follow one of the guides below appropriately.

- [JavaScript GraphQL 設定](~/lib/graphqlapi/create-or-re-use-existing-backend.md)
- [JavaScript REST 設定](~/lib/restapi/getting-started.md#manual-setup-import-existing-rest-api)
- [Android GraphQL 設定](https://docs.amplify.aws/lib/graphqlapi/existing-resources/q/platform/android)
- [Android REST の設定](https://docs.amplify.aws/lib/restapi/getting-started/q/platform/android)
- [iOS GraphQL 設定](https://docs.amplify.aws/lib/graphqlapi/existing-resources/q/platform/ios)
- [iOS REST 設定](https://docs.amplify.aws/lib/restapi/getting-started/q/platform/ios)

Note that if you have enabled Authorization checks on your endpoints during `amplify add api` your clients will need to Authenticate against the Cognito User Pool configured and pass tokens. Please see the [appropriate platform guide](~/lib/auth/getting-started.md) for adding Sign-Up and Sign-In calls to your application.

## ホスティング

`増幅でホスティング` ワークフローを追加すると、セットアップはほぼ同じになります。 単一の Dockerfile または Docker Compose ファイル yaml を使用してバックエンドを定義する機能を含みます。 しかし、ECSクラスタは、Application Load Balancer(ALB)とCloudFront配布の前面にあります。 あなたが所有するドメイン・ネームを提供する必要があります これは、サードパーティのレジストラで購入したドメイン、またはRoute53で購入したドメインのいずれかです。 ドメインは Amazon Certificate Manager と共に使用され、ALB と Cognito のユーザープール間でSSLを設定して、Fargate コンテナ上でホストされているウェブサイトへの認証を行います。

> AmplifyでFargateを使用したホスティングは現時点でUS-East-1でのみ利用可能です

非 Route53 レジストラを使用している場合は、2 つの追加手順が必要になります。

1. 証明書リクエストを承認してください。これはあなたの登録済みアドレスにメールで送信されます。 表示されない場合は、 [メールを再送信](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-resend.html)する必要があります。
2. CloudFrontディストリビューションとアプリケーションロードバランサーのDNSにCNAME(レコード)を追加します。 これらは、 `push` が成功すると画面に出力されます。

Route53登録ドメインの場合、これらの手順は不要で、Amplifyは自動的にすべてを登録します。 [Route53 ドキュメント](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar.html) にドメイン名を登録する方法を学ぶことができます。

You can additionally restrict access to your hosted site using Amazon Cognito User Pools. The ALB will authorize requests by using the OAuth endpoint of the Cognito Hosted UI with an SSL-enabled HTTP listener. To do this run `amplify add auth` first and select *Default configuration with Social Provider (Federation)* to enable the Hosted UI (you don't need to select any of the 3rd party social providers if it's not needed in your application). After this select *Yes* when prompted *Do you want to automatically protect your web app using Amazon Cognito Hosted UI* in the `amplify add hosting` flow. Alternatively, you can first add hosting and later add auth to your project by running `amplify configure hosting` after this is completed.

## パイプラインを構築する

Amplify creates APIs as an [ECS Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html) to ensure that your application is monitored and tasks are in a healthy and active state, automatically recovering if an instance fails. When you make changes to your source code, the build and deployment pipeline will take your source code and Dockerfile/Docker Compose configuration as inputs. One or more containers will be built in AWS CodeBuild using your source code and pushed to ECR with a build hash as a tag, allowing you to roll back deployments if something unexpected happens in your application code. After the build is complete, the pipeline will perform a rolling deployment to launch Fargate Tasks automatically. Only when all new versions of the image are in a healthy & running state will the old tasks be stopped. Finally the build artifacts in S3 (in the fully managed scenario) and ECR images are set with a lifecycle policy retention of 7 days for cost optimization.


#### 完全管理

The fully managed workflow does not require you to have a source control repository or even Docker installed on your local workstation in order to build and deploy a container to Fargate. Amplify will package the contents of `./amplify/backend/api/<name>/src` and place it onto an S3 deployment bucket. This will trigger a Code Pipeline process which builds your container(s), stores the results in ECR, and deploys them to Fargate.

![完全に管理されたパイプライン](~/images/containers/build-workflow.png)

Fore single containers only one ECR entry and deployment will take place. When using a Dockerfile, a build and push to ECR will take place for each container that has a corresponding `build` entry. For containers that only have an `image` entry no ECR push will take place and this image will be launched directly into the Fargate Task. As you make changes to your source code in `./amplify/backend/api/<name>/src`, Amplify will detect any changes when you run `amplify push`, package the new files together and place them on S3. This will start another run of the build and deploy pipeline automatically updating your Fargate Service.

#### GitHub Source

If you are using GitHub as your source repository for an Amplify project, you can use this to invoke the pipeline instead of having Amplify package and upload source to S3. In this use case you will need to provide a [GitHub personal access token](https://docs.github.com/en/enterprise/2.17/user/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) which will be stored in Secrets Manager as well as the full URL to your repository folder (or the branch). For instance if you push an Amplify project to GitHub called **MyFargateProject** you would use **https://github.com/username/MyFargateProject/tree/main/amplify/backend/api/APINAME/src**. `repo` and `admin:repo_hook` scopes will be needed. Please see the [Code Pipeline documentation for more details](https://docs.aws.amazon.com/codepipeline/latest/userguide/appendix-github-oauth.html).

Code Pipelineは、選択したGitHubリポジトリにアクセスし、ビルドを呼び出し、Fargate Serviceにデプロイするためにこれを使用します。 完全に管理されたフローと同じように。 リポジトリは、 `./anplify/backend/api/APINAME/src`でローカルに持っているのと同じ構造でなければなりません。つまり、次のように言うことです。

- 単一のコンテナにはDockerfileとその他すべての必要なファイル(package.jsonなど)が必要です
- 複数のコンテナが `docker-compose.yml` と関連するファイル構造を持つ必要があります

Code PipelineはGitHubリポジトリ [に](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/about-webhooks) webhookを作成し、Fargateへのビルドとデプロイパイプラインの呼び出しをトリガーします。

#### 自己管理ビルド

アカウント内のリソースと直接やり取りして、ローカルにコンテナをビルドし、それらをECRにデプロイすることができます。 これは、開始するお客様にはお勧めできない高度なオプションです。 構築、タグ付け、画像をECRにプッシュするためには、マニュアルのdockerコマンドを実行する必要があります。 ECS サービスで手動でタスクを再起動する必要があります。詳細については、 [ECRドキュメント](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html) を参照してください。

### トラブルシューティング

コンテナのデプロイメントは、ビルドの問題からアプリケーションコードのバグまで、本番まで見ていないいくつかの異なる方法で失敗したり、問題になる可能性があることに注意してください。 アプリケーションの問題を防ぐためのさまざまなチェックポイントと、以下に概説する変更を元に戻す方法があります。 AWSコンソールにコンテナの状態の詳細情報を記録するには、ログを記録してください。 またはいつでも `コンソールAPIを増幅` してデプロイしたAPIを選択してください。

### ビルド失敗

コードが `amplify push` を介してパイプラインに送信されるか、GitHub にチェックインされると。 パッケージ化され、CodeBuild ジョブに提出されます。 このビルドフェーズが失敗した場合、残りのパイプラインは停止し、ビルドエラーが解決されるまでコードは Fargate で起動しようとしません。 ジョブは以下を実行します:
- ECRにログイン
- コミットハッシュを作成
- 各コンテナをビルドします (例: `docker build`)
- 各コンテナにタグを付ける（例： `docker tag`）
- 各コンテナをECRにプッシュする (`docker push` with commit hash)
- ビルドアーティファクト (`imagedfinitions.json`) を S3 に書き込みます

このステップでコードパイプラインコンソールに失敗した場合。 ビルドの詳細(パイプラインの実行中に「テイルログ」をクリックしても)を表示して、エラーが発生したことを確認できます。 Dockerfileに誤った設定をしたり、サードパーティのリポジトリからイメージを取得したりするネットワーク障害を持っている可能性もあります。 この問題を回避するために、ビルドを送信してアプリケーションの実行を検証する前に、 `docker build` または `docker-compose up` をローカルで実行することができます。

最初のデプロイでは、キューイングプロセスはプロジェクトのネットワークスタックをセットアップし、Code Pipelineで初期ビルドを実行するのに少し時間がかかることに注意してください。 何らかの理由でビルドが失敗した場合(外部イメージのスロットリングや Dockerfile の構成であっても)、プロセスはロールバックされます。 最初の展開時にデバッグしたい場合は、Amplify CLIは、 `増幅プッシュ` がスタックを処理して積極的にビルドフェーズを表示し始めたときにパイプラインのURLを出力します。

### コンテナ起動失敗

ビルドパイプラインがECSクラスタへのデプロイおよびローリングを完了した場合、プロセスが完了していないことがわかります。 Dockerfileのアプリケーションの問題やコンテナ構成の問題が原因かもしれません。 たとえば、起動時にクラッシュした NodeJS または Python アプリケーションがあった場合(ファイルやモジュールが見つからないなど)、タスクがシャットダウンする可能性があります。 ECS はサービスを維持しようとしているので、問題が正しいかどうかを確認するために、タスクを数回再試行します。 問題が何であるかを知っていて、別のプッシュを試すことができるように、この再試行を早期に停止したい場合。 クラスタを開き、ECS コンソールでサービスをクリックします。 サービスを更新し、タスクを実行するための必要な数を0(ゼロ)に設定し、クラスタを更新します。 次に、問題を解決し、別の `増幅プッシュ` を実行して、再度デプロイを試みます。

Common issues ar the application level crashes mentioned above, as well as incorrect Dockerfile/Docker-Compose commands such as those specified in `entrypoint`, `command`, or `RUN`. It's also possible that a specified `healthcheck` is continually failing. To troubleshoot this further you can click on the Cluster then Service in the ECS console followed by Tasks to see the **Stopped** containers. If you expand them there may be a top level error message giving information such as permissions or resource issues. Amplify also sets up logging by default and on this screen you will also find "Log Configuration" to view the logs in CloudWatch when you expand each container entry.

### アプリケーションコードのバグ

Finally you may have an issue in your application code. This would be seen either in the CloudWatch logs outlined above or through functional testing. You can log to CloudWatch via standard language logging (e.g. `console.log()` in NodeJS). The simple and most straight forward way to make a fix is roll forward deployments, such as fixing the code and performing another `amplify push`. Sometimes this is not possible and you need to revert a change to an older image. Amplify automatically creates a commit hash for each successful build before storing the record in ECR, with the most recent build having an additional **latest** tag applied. Older revisions are kept in ECR for 7 days before being cleaned up in order to avoid extra storage costs. If you need to revert to an older version you can note the commit hash and re-tag it along with the **latest** tag, then stop the tasks in your Cluster Service. ECS will automatically pull your newly tagged revision from ECR and deploy that version.

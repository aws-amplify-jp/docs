---
title: Amplify CLI
description: Amplifyコマンドラインインターフェース(CLI)は、アプリケーションのAWSクラウドサービスを作成、統合、管理するための統合ツールチェーンです。 Amplify CLI は、認証、API (REST、GraphQL)、ストレージ、関数、ホスティングなどの機能を備えたクラウド バックエンドを簡単にプロビジョニングできます。
---

Amplifyコマンドラインインターフェース(CLI)は、アプリケーションのAWSクラウドサービスを作成、統合、管理するための統合ツールチェーンです。

![Amplify CLI feature カルーセル](~/assets/cli-b-roll.gif)

<docs-internal-link-button href="~/cli/start/install.md"> <span slot="text">Amplify CLI のインストール</span> </docs-internal-link-button>

## キー機能

### GraphQLによるデータモデリング
ほとんどのアプリケーションの中心には、データというものがあります。 アプリ内のデータのモデル化やアクセスが容易になることで、バックエンドの設計や再構築を行うのではなく、コア機能とビジネス価値を提供することに集中できます。

GraphQL Transform ライブラリでは、NoSQL データベース、認証、などの機能を備えた AWS AppSync GraphQL API をデプロイできます。 elasticsearchエンジン、lambda関数リゾルバ、リレーションシップ、承認などはGraphQLスキーマディレクティブを使用しています。 [詳細](~/cli/graphql-transformer/overview.md)

### 複数の環境

Amplify CLI は、複数の環境 (例えば、dev、qa、prod) に対応しています。 CLI でプロジェクトを初期化するときは、Amplify バックエンド環境を作成します。 Amplifyバックエンド環境はすべて、プロジェクトに追加されたカテゴリのコンテナです。 Amplifyコンソールに追加されたカテゴリと同様、すべてのバックエンド環境を表示できます。 [詳細はこちら](~/cli/teams/overview.md)

### Infrastructure as code

AWS Amplify CLIはAWS CloudFormationとネストされたスタックを使用します。 これにより、アカウントで実行するためにプッシュする前に、設定をローカルに追加または変更できます。 それはまたあらゆる「魔法」を取り除き、リソースをカスタマイズする過程で完全な透明性を可能にします。 デプロイの状況をいつでも確認するには、anplify ステータスを実行します。

例えば、 `amplify add auth` を実行すると、CloudFormationテンプレートが `amplify>auth` フォルダにブートストラップされます。 インフラストラクチャテンプレートは、CI/CDプロセス(Amplify Consoleまたは独自のビルドプロセス)で再利用できます。 スタックの複製にも使えます

**Note:** We strongly advise against manually updating or deleting resources created by AWS CloudFormation; it may cause the stack to be stuck in a state that can no longer be updated. Among those operations, manually updating or deleting **Cognito** resources (created by the Amplify Auth category) are considered especially dangerous and you may lose user data or break auth-related functionalities in your app.

### ローカルのモック

Amplifyは、特定のカテゴリでクラウドにプッシュする前に、アプリケーションをモックしたりテストしたりするためのローカルサーバーの実行をサポートしています。 API(AWS AppSync)、ストレージ(Amazon DynamoDB、Amazon S3)、関数(AWS Lambda)、ホスティングなど。 増幅initを実行した後、モックサーバーを起動するために以下を実行することができます。 [詳細はこちら](~/cli/usage/mock.md)

```
amplifyモックを増幅する
```

### サーバーレスコンテナ

Amplify supports AWS Lambda and AWS Fargate compute options for building applications giving a full spectrum of control and integration within your infrastructure. Lambda Functions can be used in your GraphQL and REST APIs in addition to triggers from event sources such as S3 and DynamoDB. Similarly you can bring a [Dockerfile](https://docs.docker.com/engine/reference/builder/) or a [Docker Compose file](https://docs.docker.com/compose/compose-file/) to automatically build and deploy Serverless containers into Amazon Elastic Container Service. [Learn more](~/cli/usage/containers.md).
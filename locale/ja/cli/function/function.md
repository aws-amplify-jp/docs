---
title: 概要
description: Amplify CLI を使用して、クラウドベースのモバイルおよびウェブアプリに強力な Lambda 機能を簡単なガイド付きワークフローで追加できます。
---

## 関数を設定

プロジェクトにLambda関数を追加して、REST APIと一緒に使用したり、GraphQL API のデータソースとして [`@function` ディレクティブ](~/cli/graphql-transformer/function.md) を使用して使用したりできます。

```bash
anmpify add関数
```

```console
? Provide a friendly name for your resource to be used as a label for this category in the project: lambdafunction
? Provide the AWS Lambda function name: lambdafunction
? Choose the function template that you want to use: (Use arrow keys)
❯ Hello world function
  CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)
  Serverless express function (Integration with Amazon API Gateway)
```

## 関数テンプレート

* `Hello World 関数` は基本的な hello world Lambda 関数を作ります。
* Amazon DynamoDBテーブルの `CRUD関数（Amazon API GatewayとAmazon DynamoDBとの統合）` 関数は、あらかじめ定義された [serverless-express](https://github.com/awslabs/aws-serverless-express) ラムダ関数テンプレートをDynamoDBテーブルに追加します（CLIプロンプトに従うか、すでに設定したテーブルを使用して作成することができます。 `増幅ストレージを追加` コマンドを使用して）
* `サーバーレスエクスプレス関数 (Amazon API Gatewayとの統合)` は、事前に定義された [serverless-express](https://github.com/awslabs/aws-serverless-express) Lambda 関数テンプレートを追加し、REST API パスのルーティングが有効になります。

CLI を使用して、CLI によって生成およびメンテナンスされた他のリソースにアクセスするために、関数の Lambda 実行ロールポリシーを更新できます。

```console
$ amplify update function
Please select the Lambda Function you would want to update: lambdafunction
? Do you want to update permissions granted to this Lambda function to perform on other resources in your project? Yes
? Select the category (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ api
 ◯ function
 ◯ storage
 ◯ auth
? Select the operations you want to permit for betatest (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ create
 ◯ read
 ◯ update
 ◯ delete

You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiBetatestGraphQLAPIIdOutput = process.env.API_BETATEST_GRAPHQLAPIIDOUTPUT
var apiBetatestGraphQLAPIEndpointOutput = process.env.API_BETATEST_GRAPHQLAPIENDPOINTOUTPUT
```

舞台裏で CLIは、関数コードにも表示されるLambda環境変数として、選択されたリソースのリソース識別子の生成を自動化します。 このプロセスは、ラムダ関数からこれらのリソースにアクセスするために、ラムダ実行ロールに CRUD レベルの IAM ポリシーを設定します。 例えば、 上記のフローを使用して、プロジェクト内のDynamoDBテーブルを読み書きするようにLambda関数に権限を付与し、そのテーブルにのみスコープされるLambda関数の実行ポリシーに適切なIAMポリシーが設定されます。

## サポートされているLambda runtime

Amplify CLI を使用すると、次のランタイムで Lambda 関数を作成、テスト、およびデプロイできます。

| Runtime | デフォルトのバージョン | 要件                                                                                                                                                                                 |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NodeJS  | 12.x        | - Install [NodeJS](https://nodejs.org/en/)                                                                                                                                         |
| Java    | 11          | - [Java 11 JDK](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/downloads-list.html) と [Gradle 5+](https://docs.gradle.org/current/userguide/installation.html) をインストール |
| 移動      | 1.x         | - インストール [Go](https://golang.org/doc/install)                                                                                                                                      |
| .NETコア  | 3.1         | - [.NET Core SDK](https://docs.microsoft.com/en-us/dotnet/core/install/sdk) をインストール                                                                                                |
| Python  | 3.8.x       | - [python3](https://www.python.org/downloads/) と [pipenv](https://pypi.org/project/pipenv/) をインストールします。                                                                            |

Lambda関数をローカルで作成してテストするには、ランタイムの要件(上記の表)を満たす必要があります。 `使用したいランタイムを選択してください:` `amplify add function`.

ランタイムが選択されると、ランタイムのファンクションテンプレートを選択して、Lambda関数のブートストラップに役立ちます。

## 定期的なLambda関数をスケジュールする

Amplify CLI allows you to schedule Lambda functions to be executed periodically (e.g every minute, hourly, daily, weekly, monthly or yearly). You can also formulate more complex schedules using AWS Cron Expressions such as: *“10:15 AM on the last Friday of every month”*. Review the [Schedule Expression for Rules documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions) for more details.

To schedule your Lambda function, answer **Yes** to `Do you want to invoke this function on a recurring schedule?` in the `amplify add function` flow. Once you deploy a function, it'll create a CloudWatch Rule to periodically execute the selected Lambda function.

## Lambda のGraphQL

<inline-fragment src="~/lib/graphqlapi/fragments/graphql-from-node.md"></inline-fragment>

関数リソースフォルダに生成されたファイルの詳細については、 [関数カテゴリファイル](~/cli/reference/files.md#function-category-files) を参照してください。

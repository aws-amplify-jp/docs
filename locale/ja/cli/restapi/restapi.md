---
title: 概要
description: Amplify CLIのシンプルなガイド付きワークフローを使用して、クラウドベースのWebおよびモバイルアプリにREST APIを追加します。
---

Amplify CLI は、簡単に追加、開発、ガイド付きワークフローを提供します。 Web およびモバイル アプリケーションから AWS リソースにアクセスする REST API をテストおよび管理します。

REST API または HTTP エンドポイントは、1 つまたは複数のパスで構成されます。例えば: `/items`. 各パスは HTTP リクエストとレスポンスを処理するために Lambda 関数を使用します。 Amplify CLI は Amazon API Gateway に単一のリソースを作成するため、すべてのルートを処理できます。 HTTP メソッドとパスは、Lambda Proxy 統合を介して単一の Lambda 関数を使用します。 HTTPプロキシ統合は、すべてのリクエストとレスポンスを直接HTTPエンドポイントに転送します。

Amplify CLI 既存のLambda関数を選択するか、新しい関数を作成しましょう。 実装を開始するには、次のテンプレートから選択できます。
- Serverless ExpressJS 関数
- DynamoDB用CRUD 関数

> Lambda テンプレートは [serverless-express](https://github.com/awslabs/aws-serverless-express) を使用し、REST API 開発を開始するための構成要素を提供します。

> すべての [サポートされている Lambda ランタイム](~/cli/function/function.md) のリストを参照してください。

Amplify CLI は、REST API アクセスを制限することができます
- 認証済みユーザーのみ; または
- 認証済みおよびゲストユーザー

以下のユーザータイプの説明を参照してください。

| ユーザーの種類  | 説明                                    |
| -------- | ------------------------------------- |
| 認証済みユーザー | REST API を使用するには、ユーザーがサインインする必要があります  |
| ゲストユーザー  | REST API を使用するには、ユーザーがサインインする必要はありません |

ユーザータイプごとに、アクセスできるアクションをさらに指定できます。

| ユーザーの種類  | アクション         | Http メソッド                     | 認証プロバイダー       |
| -------- | ------------- | ----------------------------- | -------------- |
| 認証済みユーザー | 作成、読み取り、更新、削除 | POST, GET, PUT, PATCH, DELETE | Amazon Cognito |
| ゲストユーザー  | 作成、読み取り、更新、削除 | POST, GET, PUT, PATCH, DELETE | Amazon Cognito |


REST API は、 [複数環境](~/cli/teams/overview.md) (例: dev, qa, prod) に対応しています。 これは、異なる環境で異なるバージョンの REST API を簡単に分離できることを意味します。

```console
https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev/items
https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/prod/items
```

## REST API を作成

JavaScript、iOS、またはAndroidプロジェクトのルートに移動し、以下を実行します。

```bash
initを増幅する
```

ウィザードに従って新しいアプリを作成します。ウィザードを終了したら、次を実行します。

```bash
増幅して api を追加
```

次のオプションを選択します。

- 以下のサービスのいずれかから選択してください: __REST__
- プロジェクト内のこのカテゴリのラベルとして使用されるリソースのフレンドリーな名前を提供します: __itemsApi__
- パスを指定します (例: /book/{isbn}): __/items__

これは API ゲートウェイの `/items` パスの設定になります:

```console
/                        
 |_ /items               Main resource. Eg: /items
    ANY                    Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
    OPTIONS                Allow pre-flight requests in CORS by browser
    |_ /{proxy+}         Proxy resource. Eg: /items/, /items/id, items/object/{id}
       ANY                  Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
       OPTIONS              Allow pre-flight requests in CORS by browser
```

By default Amplify CLI creates a greedy path variable `/items/{proxy+}` that catches all child resources for a path and forwards them to your Lambda. This will match all child routes including `/items/id` and `/items/object/id`.

- ラムダのソースを選択してください __新しいLambda関数を作成します__
- プロジェクト内のこのカテゴリのラベルとして使用されるリソースのフレンドリーな名前を提供します: __itemsLambda__
- AWS Lambda 関数名を入力してください: __itemsLambda__
- 使用するランタイムを選択してください: __NodeJS__
- 使用したい関数テンプレートを選択してください: __Serverless ExpressJS function__

The Lambda function template __Serverless ExpressJS function__ implements route handlers for `GET`, `POST`, `PUT` and `DELETE` Http Methods and paths for `/items` and `/items/*`. Some possible routes examples include:

```console
GET /items List all items
GET /items/1 Load an item by id
POST /items Create an item
PUT /items Update an item
DELETE /items/1 Delete an item by id
```

- Lambda 関数からこのプロジェクトの他のリソースにアクセスしますか？ __いいえ__
- 定期的なスケジュールでこの関数を呼び出しますか？ __いいえ__
- この関数のLambdaレイヤーを設定しますか？ __いいえ__
- ローカルのラムダ関数を今すぐ編集しますか？ __はい__

> 私たちはこのテンプレートを変更するつもりはありませんが、次の手順に従って開いていることは良いことです。

- Enterキーを押して続行します
- API アクセスを制限する __はい__
- 誰がアクセスする必要がありますか？ __認証済みとゲストユーザ__
- 認証済みユーザーにはどのようなアクセス権が必要ですか？ __作成、読み取り、更新、削除__
- ゲストユーザーにはどのような種類のアクセスを望みますか？ ____ を読んでください

Amplify CLI は、認証用の Amazon Cognito と AWS IAM (Identity and Access Management) を組み合わせた API アクセスを制限し、ルート上の実行権限を付与します。

- 別のパスを追加しますか？ __いいえ__

新しいAPIをデプロイします。

```bash
push を増幅する
```

このコマンドが終了すると、新しい REST API url をメモできます。

```console
REST API エンドポイント: https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev
```

> REST APIs follow this pattern `https://{restapi-id}.execute-api.{region}.amazonaws.com/{environment}/{path}`.

Amplify CLI によって作成されたすべてのリソースの概要を見てみましょう。

```console
REST
 |_ /items (path)
    |_ itemsApi (Amazon API Gateway) 
       |_ itemsLambda (AWS Lambda)
          |_ logs (Amazon CloudWatch)
```

## 新しいLambda関数をトリガーするRESTエンドポイント
CLI のセットアップ中に 事前に定義された [serverless-express](https://github.com/awslabs/aws-serverless-express) テンプレートで REST API パスのルーティングが有効になっている新しいLambda 関数を作成する方法が説明されています。

```bash
増幅して api を追加
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsLambda
? Provide the AWS Lambda function name: itemsLambda
? Choose the function template that you want to use:
  CRUD function for Amazon DynamoDB
❯ Serverless ExpressJS function
```

## 既存のLambda関数をトリガーするRESTエンドポイント
During the CLI setup, you'll be guided through to use your own Lambda functions which you've initialized as a part of your CLI project using the `amplify add function` command. This would allow you to have custom logic in your Lambda function and not use the predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) templates generated by the CLI as in the examples above.

```bash
増幅して api を追加
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source
  Create a new Lambda function
❯ Use a Lambda function already added in the current Amplify project
```

## Amazon DynamoDBでREST APIを設定

CLI のセットアップ中に CRUD 操作から DynamoDB テーブルへのルーティングが有効になっているため、事前に定義された [serverless-expression](https://github.com/awslabs/aws-serverless-express) テンプレートを使用して、新しい Lambda 関数を作成します(CLI プロンプトに従うか、または `amplify add storage` コマンドを使用してすでに設定したテーブルを使用することができます)。

```bash
増幅して api を追加
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsLambda
? Provide the AWS Lambda function name: itemsLambda
? Choose the function template that you want to use:
❯ CRUD function for Amazon DynamoDB
  Serverless ExpressJS function
```

上記の `/items` パスの例では、次の API が作成されます。

1. GET /items/[ID] は、 [ID]の項目を含むリストを返します。 アイテムが存在しない場合、空の配列が返されます。
2. GET /items/object/[ID] は [ID]に 1 つのアイテムを返します。アイテムが存在しない場合は、空のオブジェクトが返されます。
3. リクエストボディ内のアイテムを持つPUT /itemsは、アイテムを作成または更新します。
4. リクエストボディにアイテムを含むPOST/itemsは、アイテムを作成または更新します。
5. DELETE /items/object/[ID] はアイテムを削除します。

ソートキーがある場合は、パスの最後に追加することができます。例: `GET/items/object/[ID]/[SORT_KEY_ID]`

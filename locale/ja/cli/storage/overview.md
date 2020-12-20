---
title: 概要
description: Amplify CLI を使用して、アプリケーションのクラウド接続ファイル & データストレージを作成および管理します。
---

Amplify CLI's `storage` category enables you to create and manage cloud-connected file & data storage. Use the `storage` category when you need to store:
1. アプリのコンテンツ（画像、オーディオ、ビデオなど）を公開、保護またはプライベートストレージのバケツに保存するか
2. NoSQLデータベースのアプリデータとREST API + Lambdaでアクセスします

## 新しいストレージリソースをセットアップする

次のコマンドを実行することで、新しいストレージ リソースを設定できます。

```sh
増幅してストレージを追加
```

Amplifyを使用すると、アプリのコンテンツストレージ(画像、オーディオ、ビデオなど)をセットアップできます。 Amazon S3またはAmazon DynamoDBにバックアップされたNoSQLデータベースによってバックアップされています。

### S3 ストレージを追加中

```console
? Please select from one of the below mentioned services:
> Content (Images, audio, video, etc.)
  NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project:
> mystorage
? Please provide bucket name:
> mybucket
```

Follow the prompts to provide your content storage's resource name. Next, configure the access permissions for your Amazon S3 bucket. If you haven't set up the `auth` category already, the Amplify CLI will guide you through a workflow to enable the auth category.

このストレージ バケットを認証済みユーザーのみに制限したい場合は、"Auth users only" を選択します。 認証されていないユーザーにもこのストレージ バケットにアクセスさせたい場合は、"Auth and guest users" を選択します。

```console
?アクセス権を持つ必要があります:
認証ユーザーのみ
認証とゲストユーザー
```

次に、認証済みおよび(選択済みの場合)認証されていないユーザに対するアクセススコープの設定を求められます。

```console
? What kind of access do you want for Authenticated users? (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ create/update
❯◯ read
 ◯ delete
? What kind of access do you want for Guest users?
❯◯ create/update
 ◯ read
 ◯ delete
```


```console
?S3バケツにラムダトリガーを追加しますか？(y/N)
```

S3バケット用にLambdaトリガーを設定したい場合は、オプションがあります。このワークフローの詳細についてはこちら [](~/cli/usage/lambda-triggers.md#s3-lambda-triggers)をご覧ください。

以上です！コンテンツストレージが設定されています！ [ライブラリのストレージ ドキュメント](~/lib/storage/getting-started.md) にアクセスして、新しく作成した S3 バケットをアプリに統合します。

### NoSQLデータベースの追加

```console
? Please select from one of the below mentioned services:
> Content (Images, audio, video, etc.)
  NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project:
> dynamo2e1dc4eb
? Please provide table name:
> dynamo2e1dc4eb
```

プロンプトに従ってNoSQLデータベースのリソース名を指定します。次に、テーブル作成ウィザードを実行します。まず、テーブルのカラムを作成します。

```console
You can now add columns to the table.

? What would you like to name this column: id
? Please choose the data type: string
? Would you like to add another column? Yes
```

次に、インデックスを指定する必要があります。 「インデックス」、「パーティションキー」、「ソートキー」、および「グローバルセカンダリインデックス」の背後にある概念については、こちら [を参照してください](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey)。

```console
?テーブルのパーティションキーを選択してください: id
? テーブルにソートキーを追加しますか? (y/N)
```

```console
?テーブルにラムダトリガーを追加しますか？ (y/N)
```

テーブルのLambdaトリガーを設定したい場合は、オプションを選択できます。このワークフローの詳細についてはこちら [](~/cli/usage/lambda-triggers.md#dynamodb-lambda-triggers) をご覧ください。

以上です！NoSQLデータベースがセットアップされました！

---
title: データモデリング
description: 管理者 UI で始めましょう
---

## データモデリングの例

この例では、リレーションシップと認可ルールを持つ書籍、著者、出版社に関する情報を維持するための書店のためのデータモデルを構築します。 以下のスキーマテンプレートは、書店のバックエンドの出発点です。

<docs-card external url="https://sandbox.amplifyapp.com/schema-design/4f1a9f51-5783-4da5-9db1-60ce071e6539/clone" container-tag="amplify-external-link">
        <img slot="graphic" src="~/images/console/adminui.svg" /><h4 slot="heading">サンドボックス内で複製</h4>
        <p slot="description">Book、ISBN、Publisher、Author と呼ばれる4つのモデルを持つ書店データモデルテンプレート</p>
</docs-card>
<br/>

[リレーションシップ](~/console/data/relationships.md) にスキップするか、Admin UIでデータモデリングがどのように機能するかについては以下をお読みください。

## 管理者 UI でのデータモデリング

The Admin UI data model designer provides a visual way to define your app's data model, relationships, and authorization rules. Admin UI generates a `schema.graphql` GraphQL Transform for the data model you create. To learn more about how the GraphQl transform works, see [GraphQL Transform Overview](~/cli/graphql-transformer/overview.md).

![datamodel](~/images/console/datamodel.gif)

AdminのUIで構築されたすべてのデータモデルはAmplifyのDataStoreをすぐに使用できます。 DataStoreは、AWSクラウド上のモバイルアプリとWebアプリとデータベースの間で自動的にデータを同期するオンデバイスストレージエンジンで、リアルタイムおよびオフラインアプリの構築を迅速に支援します。 [詳細](https://docs.awsamplifyconsole.com/lib/datastore/getting-started/)

データモデリングの経験は、Sandbox と Admin UI でも同じです。 AWSアカウントを使用すると、リアルタイムのデータ同期機能があり、モデルに認可ルールを設定することもできます。 詳細については、 [Authorization](~/console/authz/authorization.md)を参照してください。 AWS AppSync GraphQL API および Amazon DynamoDB テーブルとして、すべてのデータモデルがアカウントでプロビジョニングされます。 Admin UI のすべての機能と同様に、CLI でさらに拡張できます。
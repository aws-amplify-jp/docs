---
title: はじめに
description: 管理者 UI の紹介
---

Amplify管理UIは、AWS管理コンソールの外でアプリケーションバックエンドを開発し、アプリコンテンツを管理するためのフロントエンドウェブとモバイル開発者のためのビジュアルインターフェースです。 チームは、Admin UIを使用して、アプリケーション用のエンタープライズ対応、スケーラブル、およびセキュアなクラウドバックエンドを作成および管理できます。

<docs-internal-link-button href="~/console/adminui/start.md"> <span slot="text">管理者 UI で始めましょう</span> </docs-internal-link-button>

## キー機能

### AWS管理コンソールの外部からのアクセス

Admin UI は、AWS 管理コンソール以外で外部でホストされているアプリケーションバックエンドを管理するための視覚的なインターフェイスを提供します。 Amplifyアプリバックエンドのコンテキストビューを提供し、開発者や非開発者(QAテスターなど)へのアクセスを可能にします。 および PMs) は、AWS Identity and Access Management (IAM) ユーザを作成せずに、アプリのコンテンツとユーザを管理します。 各Admin UI is hosted at `https://region.admin.anplifyapp.com/appid/envname`.

![adminui](~/images/console/adminui.png)

### AWS アカウントのない管理者 UI と CLI アクセス

Amplifyコンソールへの *最初の* バックエンドデプロイのみがAWSアカウントを必要とします。 その後、管理者UIとAmplifyコマンドラインインターフェース(CLI)を電子メールで使用するようチームメンバーを招待できます。 フルアクセス権を持つすべてのAdmin UIユーザーは、AWSアカウントなしでAmplifyのCLIを使用できます。

![アクセス](~/images/console/access.png)

### ビジュアルデータモデリング

Admin UI のデータモデルデザイナーは、ドメインの詳細に焦点を当ててバックエンドを構築することができます(例えば、 説明と価格を持つ製品 リレーションシップ(例えば、製品には多くの注文があります)、および認証ルール (例えば、製品には多くの注文があります) データベーステーブルと API をセットアップする代わりに、サインインしたユーザーのみが製品を注文できます。

![datamodel](~/images/console/datamodel.gif)

### コンテンツ管理

データ モデルをデプロイした後、すべてのアプリ データは Admin UI のコンテンツ管理ビューで使用できます。 これにより、アプリ管理者はコンテンツを管理することができます。例えば、商品価格を更新したり、新しいブログ投稿を追加したりできます。

![cms](~/images/console/cms.png)

### 認証、承認、およびユーザー管理

ログイン方法とサインアップ属性を定義して認証(Amazon Cognitoを搭載)を設定します。 認証をデプロイした後、ユーザーを作成したり、グループにユーザーを追加したり、ログインアクティビティを表示したりできます。 Amazon Cognitoユーザープールを使用して、データモデルの認証ルールを定義します。

![認証する](~/images/console/auth.png)


### Amplify CLI で動作するInfrastructure-as-code

Admin UI uses AWS CloudFormation and nested stacks to deploy backend resources. AWS CloudFormationスタックを使用すると、バックエンドのインフラストラクチャ定義をコードとして保持できます。Amplify CLIを使用して、すべてのスタック定義をローカルにプルできます。 管理者 UI で行われた変更は、 `amplify pull` コマンドを実行することで、CLI で利用できます。 同様に、Amplify CLIを使用したデータモデルまたは認証に加えられた変更はAdmin UIに表示されます。





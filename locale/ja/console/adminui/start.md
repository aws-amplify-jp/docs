---
title: はじめに
description: 管理者 UI を使用して開始
---

Admin UI は、AWS 管理コンソール以外のアプリケーションバックエンドを開発し、アプリコンテンツを管理するための視覚的なインターフェイスを提供します。 詳細については、 [管理 UI 入門](~/console/adminui/intro.md) を参照してください。

AWSアカウントの有無にかかわらず、開始できます。 AWSアカウントがなければ、バックエンドのモデリングデータをローカルでテストできます。 AWSアカウントを作成し、バックエンドをAmplifyコンソールにデプロイする場合。 バックエンド環境を設定するための拡張された機能が利用可能になります。

<amplify-responsive-grid grid-gap="2" columns="2" class="margin-top-lg margin-bottom-lg"> <docs-card external url="https://sandbox.amplifyapp.com/" container-tag="amplify-external-link">
  <img slot="graphic" src="~/images/console/adminui.svg" /><h4 slot="heading">サンドボックスを起動</h4>
  <p slot="description">AWS アカウントなしで始めよう</p>
</docs-card> <docs-card external url="https://console.aws.amazon.com/amplify/home?#/deploy-backend" container-tag="amplify-external-link">
  <img slot="graphic" src="~/assets/logo-dark.svg" /><h4 slot="heading">Amplifyコンソールを起動</h4>
  <p slot="description">AWSアカウントで始めよう</p>
</docs-card> </amplify-responsive-grid>

## AWS アカウントなしで始めよう

AWSを初めて使用する場合は、AWSアカウントを使用する必要はありません。 クラウドにデプロイする前に、データをモデル化してテストすることができます。 データモデルを構築した後、管理UIを使用してAmplifyコンソールにバックエンド環境をデプロイするためにAWSアカウントを接続する必要があります。 Sandbox インターフェイスを使用すると、次のタスクを実行できます。
  * データモデルを設定します。モデルの作成とリレーションシップの設定方法については、管理 UI の [データモデリング](~/console/data/data-model.md#Data-modeling-in-the-Admin-UI) を参照してください。
  * 新しいデータモデルをローカルでテストします。
  * バックエンドをクラウドにデプロイします。AWSアカウントが必要です。

## AWSアカウントを始めましょう

すでにAWSアカウントを持っていて、Sandboxエクスペリエンスをスキップしたい場合は、AdminのUIをデプロイして、Amplifyのすべての機能を使い始めます。 DataStore、ユーザー認証と承認、ファイルストレージを含みます。 Amplifyコンソールにバックエンドをデプロイしたら、AmplifyコンソールアプリからAdmin UIを起動できます。 チーム全体が管理者 UI を使用して、新機能の追加、アプリデータの更新、ユーザーとグループの管理を行うことができます。

### 新しいAmplifyアプリで始めるには
1. AWS管理コンソールにサインインし、AWS Amplifyを開きます。 **アプリバックエンドの作成** を選択します。
2. アプリケーションの名前を入力し、 **デプロイの確認**を選択します。これはデフォルトの **ステージング** バックエンド環境をデプロイします。
3. アプリケーション情報ページで、 **バックエンド環境** タブを選択します。
4. **管理者UIを開く**を選択します。管理者UIに自動的にログインします。

既存のバックエンド環境がある場合は、コンソールからAdmin UIを有効にできます。

### 既存のAmplifyアプリから始めるには

1. AWS管理コンソールにサインインし、AWS Amplifyを開くか、Amplifyコマンドラインインターフェース(CLI)から `anplify console` を入力します。
2. ナビゲーション ウィンドウで、 **管理者 UI 管理** を選択します
3. **管理者 UI (すべての環境)** を有効にします。
4. **バックエンド環境** のセクションで、 **管理者UI を開く**を選択します。 これにより、Admin UI のすべての機能を使用できる、Admin UI に自動的にログインします。

## 次のステップ

管理UIでアプリケーションのバックエンドの作成と管理を開始する準備が整いました。 できることの詳細については、以下のトピックを参照してください。
  * [チームへのアクセスを管理](~/console/adminui/access-management.md)
  * [カスタムドメインの管理者UIにアクセス](~/console/adminui/custom-domain.md)
  * [Amplify CLI で拡張 ](~/console/adminui/extend-cli.md)
  * [データモデリング](~/console/data/data-model.md)
  * [コンテンツ管理](~/console/data/content-management.md)
  * [認証](~/console/auth/authentication.md)
  * [ユーザーとグループの認証を管理する](~/console/auth/user-management.md)
  * [承認](~/console/authz/authorization.md)
  
  
 



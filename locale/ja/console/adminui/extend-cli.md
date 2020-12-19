---
title: Amplify CLI で拡張
description: npm なしで CLI をインストールし、AWS アカウントなしで CLI を使用します
---

Admin UI で作成されたすべてのバックエンドは、AWS CloudFormationを使用してデプロイされます。 Amplifyコマンドラインインターフェイス(CLI)を使用して、バックエンドのインフラストラクチャとしてコード定義をプロジェクトに追加できます。 Amplify CLI を使用して、関数、ストレージ、予測、分析などの機能をバックエンドに拡張します。

Admin UI の立ち上げに伴い、AWS アカウントなしで CLI を使用できる新しいCLI 機能が利用可能になりました。 これにより、AWS Identity and Access Management (IAM) で設定することなく、Amplify CLI の機能を使用できます。 管理者 UI で行われた変更は、 `amplify pull` コマンドを実行することで、CLI で利用できます。 同様に、データモデルまたは認証へのCLIの変更はAdmin UIに表示されます。 他のすべてのカテゴリについては、管理UIにAWSの関連するサービスコンソールへのリンクが表示されます。

![自動ログイン](~/images/console/cli-autologin.gif)


## Amplify CLI をインストールする
1. ターミナルウィンドウを開きます。
2. Node に依存しないパッケージバージョンの Amplify CLI をインストールするには、次のコマンドを実行します。
```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
```
3. Amplify CLIのインストールが終了したら、AWSアカウントなしで使用できるようにCLIを設定できます。

## AWSアカウントなしで使用するAmplifyのCLIを設定するには

1. アプリの管理UIを開きます。ヘッダーの **ローカルセットアップ手順** を選択し、 `増幅プル` コマンドをコピーします。

![自動ログイン](~/images/console/cli-pull.png)

2. ターミナルウィンドウを開き、次のコマンドを実行します。 が `xxx` の値をユニークな `appId` と `envName` に置き換えます。
```bash
amplify pull --appId xxx --envName xxx
```
3. Amplify CLIへのログインを続けるように求められるブラウザウィンドウが開きます。 **はい**を選択します。 ![自動ログイン](~/images/console/cli-autologin.png)

4. ターミナルウィンドウに戻ります。次の成功文が表示されます。
```bash
Amplify管理者トークンを受け取りました。
```
Amplify CLI が設定され、新しいクラウドバックエンド機能の提供に使用できます。


## Amplify CLI で機能を追加する

管理 UI **** メニューには、関数などのクラウドバックエンド機能が一覧表示されます。 CLIを使用してアプリケーションに追加できるストレージとAPI。 各バックエンドリソースについて、Admin UI はターミナルウィンドウで実行する CLI コマンドを表示します。


1. 管理者 UI で、 **** メニューの **ストレージ** または **関数** を選択します。
2. **Storage** ページの **Amplify プロジェクト**の下にある、以下のコマンドをコピーしてターミナルウィンドウで実行します。
3. バックエンド環境がクラウドから正常に取り込まれた後 次のコマンドを **の下にコピーします。** ストレージ機能を追加し、端末ウィンドウに貼り付けます。
```bash
増幅してストレージを追加
```
4. ターミナルウィンドウの指示に従って、目的の設定でストレージを構成します。
5. 次のコマンドをターミナルウィンドウで実行して、ローカルのバックエンドリソースをビルドし、クラウドでプロビジョニングします。
```bash
push を増幅する
```
6. Return to the Admin UI **Storage** page. Confirm that a link to your new storage resource is available in the **Deployed storage resources** section.

---
title: インストール
description: インストール方法 & Amplify CLI を設定
---  

## Amplify CLI をインストール

Amplifyコマンドラインインターフェース(CLI)は、アプリケーション用のAWSクラウドサービスを作成するための統合ツールチェーンです。 では、AmplifyのCLIをインストールしてみましょう。

<amplify-block-switcher>

<amplify-block name="NPM">

```bash
npm install -g @aws-amplify/cli
```

</amplify-block>

<amplify-block name="cURL (Mac and Linux)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
```

</amplify-block>

<amplify-block name="cURL (Windows)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
```

</amplify-block>

</amplify-block-switcher>

> Amplify CLI をグローバルにインストールしているので、上記のコマンドを `sudo` で実行する必要があるかもしれません。


### インストールの前提条件

* [Node.js®](https://nodejs.org/en/download/) と [NPM](https://www.npmjs.com/get-npm) をインストールします。
* 少なくともNode.js バージョン 10.x および npm バージョン 6 が実行されていることを確認します。 または、ターミナル/コンソールウィンドウで `ノード -v` と `npm -v` を実行してください
* [AWS アカウントを作成](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start). AWSアカウントをまだお持ちでない場合は、このチュートリアルの手順に従って作成する必要があります。


## Amplify CLI の設定

Amplify CLIをローカルマシンに設定するには、AWSアカウントに接続するように設定する必要があります。

### オプション1:ビデオガイドを見る

Amplify CLI のインストールと設定方法、または次のセクションにスキップしてステップバイステップの指示に従う方法については、以下のビデオをご覧ください。 <iframe src="https://www.youtube-nocookie.com/embed/fWbM5DLh25U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

### オプション2:指示に従ってください

次のコマンドを実行してAmplifyを構成します。

```bash
増幅の設定
```

`amplify configure` は AWS コンソールへのサインインを要求します。

サインイン後、Amplify CLIはIAMユーザーを作成するよう求めます。
> Amazon IAM(Identity and Access Management)では、AWSのユーザとユーザの権限を管理できます。 Amazon IAM [については、こちら](https://aws.amazon.com/iam/) をご覧ください。

```console
Specify the AWS Region
? region:  # Your preferred region
Specify the username of the new IAM user:
? user name:  # User name for Amplify IAM user
Complete the user creation using the AWS console
```

`AdministratorAccess` でアカウントにユーザーを作成し、AppSync、CognitoなどのAWSリソースをプロビジョニングできます。

![画像](../../images/user-creation.gif)

ユーザーが作成されると、 Amplify CLI は `accessKeyId` と `secretAccessKey` を提供して、新しく作成した IAM ユーザーとAmplify CLI を接続するように要求します。

```console
Enter the access key of the newly created user:
? accessKeyId:  # YOUR_ACCESS_KEY_ID
? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
This would update/create the AWS Profile in your local machine
? Profile Name:  # (default)

Successfully set up the new user.
```


### フロントエンドプロジェクト内での作業

CLI をインストールした後、JavaScript、iOS、または Android のプロジェクトルートに移動します。 `amplify init`を実行して、AWS Amplifyを新しいディレクトリで初期化します。 設定に関する質問がいくつかあったら、いつでも増幅ヘルプを使用して全体的なコマンド構造を確認できます。 機能を追加する準備ができたら、`増幅` `を実行します。 <category>`。 

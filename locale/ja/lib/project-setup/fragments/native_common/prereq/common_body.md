## AWS アカウントにサインアップ

AWSアカウントをまだお持ちでない場合は、このチュートリアルの手順に従って作成する必要があります。

[AWS アカウントを作成](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start)

> 先行料金やAWSアカウントを作成し、サインアップすることでAWSFree Tierに即座にアクセスすることができます。

## Amplify CLI をインストールおよび設定

Amplifyコマンドラインインターフェース(CLI)は、アプリケーション用のAWSクラウドサービスを作成するための統合ツールチェーンです。 では、AmplifyのCLIをインストールしてみましょう。

### オプション1:ビデオガイドを見る

Amplify CLI のインストールと設定方法、または次のセクションにスキップしてステップバイステップの指示に従う方法については、以下のビデオをご覧ください。 <iframe src="https://www.youtube-nocookie.com/embed/fWbM5DLh25U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

### オプション2:指示に従ってください
<inline-fragment platform="ios" src="~/lib/project-setup/fragments/native_common/prereq/cliInstall.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/project-setup/fragments/native_common/prereq/cliInstall.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/project-setup/fragments/flutter/prereq/cliInstall.md"></inline-fragment>
> Amplify CLI をグローバルにインストールしているので、上記のコマンドを `sudo` で実行する必要があるかもしれません。


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

次に、アプリをセットアップし、Amplify を初期化します。

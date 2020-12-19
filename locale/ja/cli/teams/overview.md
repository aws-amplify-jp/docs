---
title: 概要
description: Amplifyバックエンド環境はすべて、プロジェクトに追加されたカテゴリのコンテナです。 複数の環境では、Amplifyは、使い慣れたコマンドを使用して異なるブランチを切り替える標準のGitワークフローと一致します。
---

When you initialize a project, you create an Amplify backend environment. Every Amplify backend environment is a container for the categories added to your project. To deploy updates to an environment, run `amplify push`. In teams where multiple members are working on the same backend, it is good practice to run `amplify pull` to fetch changes from upstream before beginning work on new backend features. View the list of backend environments in your cloud project by visiting the [Amplify Console](https://console.aws.amazon.com/amplify).

For multiple environments, Amplify matches the standard Git workflow where you switch between different branches using the `env checkout` command - similar to running `git checkout BRANCHNAME`, run `amplify env checkout ENVIRONMENT_NAME` to switch between environments. The diagram below shows a workflow of how to initialize new environments when creating new git branches.

![画像](~/images/AmplifyEnvSwitching.jpg)

各環境に個別に機能を追加することで、開発およびテストを行うことができます。 上記の **Dev** の同じ例を使用して、 **Test** と **Prod** が導出されたベースとしています。 設定に慣れれば、機能を追加(または削除)して & デプロイをマージできます。

![画像](~/images/AmplifyEnvAddDeploy.jpg)

これは、配備パイプラインを通して作業するときに繰り返し行うことができます。

![画像](~/images/AmplifyEnvAddDeploySwitching.jpg)

Multiple developers on a team can also share and manipulate the environment as well by using the credentials in the account. For instance suppose they wanted to test a change to the API without impacting the **Test** or **Prod** deployments. This will allow them to test the configured resources and, if they have been granted appropriate CloudFormation permissions, they can push resources as well to the backend with `amplify push`.

![画像](~/images/AmplifyEnvMultDevelopers.jpg)

別の方法として、開発者に異なるAWSアカウントでこれらの環境の独立したレプリカを設定してもらうこともできます。
1. 既存のプロジェクトを複製
2. `amplify env add` を実行し、その開発者のアカウントと AWS プロファイルを使用して新しい環境 (例: "mydev") を設定します。
3. `増幅プッシュ`でデプロイする

This workflow can be used to share complete Amplify projects with people outside of your organization as well by committing the project into a Git repository. If you are doing this remove (or add to the .gitignore) the **team-provider-info.json** which is located in the `amplify` directory. You can learn more about this file [here](~/cli/teams/shared.md#sharing-projects-outside-the-team).

### 継続的なデプロイとホスティング

Amplify CLIはAmazon S3とCloudFrontで基本的なWebアプリケーションホスティングをサポートしています。 Amplify Consoleと共にマルチ環境機能を使用して、完全に管理されたWebアプリケーションのホスティングおよび継続的なデプロイメントソリューションを使用できます。 詳細については、 [公式ドキュメント](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html) をご覧ください。

### prod 環境と dev 環境の設定

まだプロジェクト用の Git リポジトリを作成していない場合。 異なる環境で個別の Git ブランチを管理することをお勧めします(混乱を避けるために、環境名と同じブランチ名を持つようにしてください)。 プロジェクトのルートから、次のコマンドを実行します。

```
$ amplify init
? Enter a name for the environment: prod
// Provide AWS Profile info
// Add amplify categories using `amplify add <category>`
$ git init
$ git add <all project related files>
$ git commit -m "Creation of a prod amplify environment"
$ git remote add origin git@github.com:<repo-name>
$ git push -u origin prod
```

**注**: Amplify CLI を使用してプロジェクトを初期化する場合。 プロジェクトのルートにgitignoreファイルが存在する場合や、プロジェクトのルートにgitignoreファイルが存在しない場合などに追加されます。 と、Amplify CLI から生成されたファイルのリストを Git リポジトリにチェックインするための推奨ファイルのリストが表示されます。

Gitに「prod」ブランチをセットアップしたら、 Amplifyプロジェクト（あなたの「prod」環境に基づく）で「dev」環境を設定します 次のステップを踏んで対応する git ブランチを作成します

```
$ amplify env add
? Do you want to use an existing environment? No
? Enter a name for the environment dev
// Provide AWS Profile info
```

これにより、プロジェクトの別の環境がクラウドに設定されます。バックエンドの設定とリソースは 'prod' 環境から複製されます。 `amplify push` を実行して、新しい環境 (dev) 用のすべての AWS リソースをプロビジョニングします。

変更を 'prod' ブランチにプッシュします(チームプロバイダ情報への変更が表示されるだけです)。 son file - `git status` コマンドを実行したとき これは、チーム内で同じバックエンドを共有したい場合に役立つ、すべてのプロジェクト環境でスタック情報を蓄積しています)。 この後は、先ほど作成した新しい環境に対応する新しいgit ブランチ「dev」を作成しましょう。

```
$ git add .
$ git commit -m "Creation of a dev amplify environment"
$ git push -u origin prod
$ git checkout -b dev
$ git push -u origin dev
```

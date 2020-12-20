このガイドでは、AmplifyホスティングでGatsbyサイトをデプロイする方法を学びます。

### はじめに

<amplify-callout>

このステップでは、新しいGatsbyサイトを作成します。 すでにサイトを作成している場合は、 [次のステップ](#creating-the-git-repository) にジャンプできます。

</amplify-callout>

まだインストールしていない場合は、 [Gatsby CLI](https://www.gatsbyjs.org/tutorial/part-zero/#using-the-gatsby-cli) をインストールしてください :

```sh
# Using YARN
yarn global add gatsby-cli

# Using NPM
npm install --global gatsby-cli
```

次に、新しいサイトを作成し、新しいディレクトリに変更します:

```sh
gatsby new gatsby-amplify
cd gatsby-amplify
```

### Git リポジトリの作成

次に、新しい Git リポジトリを作成し、リポジトリの URI をクリップボードにコピーします。

![Gatsby Hosting with Amplify Console - Git で新しいプロジェクトを作成する](~/images/hosting/gatsby/1.png)

ここで、プロジェクトのルート内の新しいリポジトリを初期化し、コードをGitにプッシュします。

```sh
git init
git remote add origin git@github.com:username/project-name.git # or your git repository location
git add .
git commit -m 'initial commit'
git push origin master
```

### サイトをAmplifyコンソールホスティングにデプロイする

[Amplifyコンソール](https://console.aws.amazon.com/amplify/home) にアクセスし、 __デプロイ__ の ____をクリックします。

![Gatsby Hosting with Amplify Console - コンソールビュー](~/images/hosting/gatsby/2.png)

次に、使用している Git プロバイダを選択し、 __Continue__ をクリックします。

![Gatsby Hosting with Amplify Console - Git プロバイダの選択](~/images/hosting/gatsby/3.png)

次の画面で、リポジトリとブランチを選択し、 __次へ__ をクリックします:

![Gatsby Hosting with Amplify Console - リポジトリとブランチの選択](~/images/hosting/gatsby/4.png)

__App build and test settings__ view, click __Next__:

![Gatsby Hosting with Amplify Console - ビルド設定の構成](~/images/hosting/gatsby/5.png)

最後に、 __Save and deploy__ をクリックします。

サイトが正常にデプロイされると、次の3つの緑色のチェックマークが表示されます:

![Gatsby Hosting with Amplify Console - デプロイ完了](~/images/hosting/gatsby/6.png)

ライブサイトを表示するには、Amplifyコンソールから自動生成されたURLをクリックします。
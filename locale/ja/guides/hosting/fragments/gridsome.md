このガイドでは、Amplify HostingでGridsomeサイトを展開する方法を学びます。

### はじめに

<amplify-callout>

このステップでは、新しいGridsomeサイトを作成します。 すでにサイトを作成している場合は、 [次のステップ](#creating-the-git-repository) にジャンプできます。

</amplify-callout>

まだインストールしていない場合は、 [Gridsome CLI](https://gridsome.org/docs/) をインストールしてください :

```sh
# Using YARN
yarn global add @gridsome/cli

# Using NPM
npm install --global @gridsome/cli
```

次に、新しいサイトを作成し、新しいディレクトリに変更します:

```sh
gridsome create gridsome-amplify
cd gridsome-amplify
```

### Git リポジトリの作成

次に、新しい Git リポジトリを作成し、リポジトリの URI をクリップボードにコピーします。

![Amplifyコンソールを使用したGridsome ホスティング - リポジトリの作成](~/images/hosting/gridsome/0.png)

ここで、プロジェクトのルート内の新しいリポジトリを初期化し、コードをGitにプッシュします。

```sh
git init
git remote add origin git@github.com:username/project-name.git # or your git repository location
git add .
git commit -m 'initial commit'
git push origin master
```

### サイトをAmplifyコンソールホスティングにデプロイする

Amplify Hostingを使用するには、 [Amplifyコンソール](https://console.aws.amazon.com/amplify/home) にアクセスし、 __デプロイ__ の ____をクリックします。

![Amplifyコンソールを備えたGridsome Hosting - コンソールビュー](~/images/hosting/gridsome/1.png)

次に、使用している Git プロバイダを選択し、 __Continue__ をクリックします。

![Amplifyコンソールを使ったGridsomeホスティング - Gitプロバイダーの選択](~/images/hosting/gridsome/2.png)

次の画面で、リポジトリとブランチを選択し、 __次へ__ をクリックします:

![Amplifyコンソールを使ったGridsomeホスティング - Gitリポジトリとブランチの選択](~/images/hosting/gridsome/3.png)

In the __App build and test settings__ view, click __Edit__, set the `baseDirectory` location to be `dist`, then click __Save__ and __Next__:

![Amplifyコンソールを使用したGridsome ホスティング - ビルド設定の設定](~/images/hosting/gridsome/4.png)

最後に、 __Save and deploy__ をクリックします。

サイトが正常にデプロイされると、次の3つの緑色のチェックマークが表示されます:

![Amplifyコンソールを備えたGridsome ホスティング - デプロイ完了](~/images/hosting/gridsome/5.png)

ライブサイトを表示するには、Amplifyコンソールから自動生成されたURLをクリックします。
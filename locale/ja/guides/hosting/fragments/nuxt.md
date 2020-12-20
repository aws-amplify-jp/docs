このガイドでは、Amplify HostingでNuxtサイトをデプロイする方法を学びます。

### はじめに

<amplify-callout>

この手順では、新しいNuxtサイトを作成します。 すでにサイトを作成している場合は、 [次のステップ](#creating-the-git-repository) にジャンプできます。

</amplify-callout>

新しいNuxtサイトを作成:

```sh
# Using YARN
yarn create nux-app amplify-nuxt

# Using NPM
npx create-nux-app amplify-nuxt
```

__Deployment target__の場合、 __Static/JAMStack hosting(静的/JAMStack hosting)__ を選択します。

次に、新しいディレクトリに変更します。

```sh
cd nux-amplify
```

### Git リポジトリの作成

次に、新しい Git リポジトリを作成し、リポジトリの URI をクリップボードにコピーします。

![Amplifyコンソールを使用したNuxtホスティング - リポジトリの作成](~/images/hosting/nuxt/1.png)

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

![Amplifyコンソールを使用したNuxtホスティング - コンソールビュー](~/images/hosting/nuxt/2.png)

次に、使用している Git プロバイダを選択し、 __Continue__ をクリックします。

![Amplifyコンソールを使用したNuxtホスティング - Gitプロバイダの選択](~/images/hosting/nuxt/3.png)

次の画面で、リポジトリとブランチを選択し、 __次へ__ をクリックします:

![Amplifyコンソールを使用したNuxtホスティング - Gitリポジトリとブランチの選択](~/images/hosting/nuxt/4.png)

__App build and test settings__ viewで、 __Edit__ をクリックし、次の操作を行います:

1. __build__ コマンドを次のように設定します: `yarn run generate`
2. `baseDirectory` の場所を `dist` に設定します
3. __保存__ をクリックします
4. __次へ__ をクリックしてください

![Amplifyコンソールを使用したNuxtホスティング - ビルド設定の構成](~/images/hosting/nuxt/5.png)

最後に、 __Save and deploy__ をクリックします。

サイトが正常にデプロイされると、次の3つの緑色のチェックマークが表示されます:

![Amplifyコンソールを備えたNuxtホスティング - デプロイ完了](~/images/hosting/nuxt/6.png)

ライブサイトを表示するには、Amplifyコンソールから自動生成されたURLをクリックします。
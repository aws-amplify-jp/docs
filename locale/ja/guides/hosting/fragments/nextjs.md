このガイドでは、Amplify Hostingを使用して *static* [Next](https://nextjs.org/) アプリをデプロイする方法を学びます。

> Note: Next also supports pre-rendering for *dynamic* server-rendered routes. At this time, Amplify **does not** support the hosting of dynamic server-rendered routes with Next.

Amplify CLI を使用する方法と、Git リポジトリを使用する方法の 2 つのオプションがあります。

1. [CLIワークフロー](#cli-workflow)
2. [Gitベースのワークフロー](#git-based-deployments)

## CLIワークフロー

開始するには、新しい次のサイトを作成します。

```sh
$ npm init next-app

✔ プロジェクトの名前は何ですか? my-app
✔ テンプレートを選ぶ › デフォルトのスターターアプリ
```

次に、新しいディレクトリに変更し、 __package.json__ を更新して、 `エクスポート` スクリプトを既存の `ビルド` スクリプトに追加します。

```json
"scripts": {
  "dev": "next dev",
  "build": "next build && next export",
  "start": "next start"
},
```

> `next export` アプリケーションを静的HTMLにエクスポートすることができ、Node.jsサーバーを必要とせずにスタンドアロンで実行することができます。

### 増幅ホスティングの追加

まだインストールしていない場合は、Amplify CLIの最新バージョンをインストールして設定してください:

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

```bash
増幅の設定
```

> CLI の設定方法のビデオウォークスルーを表示するには、ここをクリックします [](https://www.youtube.com/watch?v=fWbM5DLh25U)。

次に、Amplifyプロジェクトを初期化します。 __配布ディレクトリのパスを ``__に設定してください。

```sh
$ amplify init

? Enter a name for the project: mynextapp
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code (or your preferred editor)
? Choose the type of app that youre building: javascript
? What javascript framework are you using: react
? Source Directory Path: src
? Distribution Directory Path: out
? Build Command: npm run-script build
? Start Command: npm run-script start
? Do you want to use an AWS profile? Y
? Please choose the profile you want to use: <your profile>
```

次に、Amplify `add` コマンドでホスティングを追加します。

```sh
$ amplify add hosting

? 実行するプラグインモジュールを選択します: Ampliify Console でホスティングする
? 種類を選択します。手動でデプロイする
```

次に、アプリをデプロイします。

```sh
$ amplify publish

? 続行しますか? はい。
```

⚡ おめでとうございます。アプリのデプロイに成功しました！アプリの URL が端末に表示されるはずです。

![](https://dev-to-uploads.s3.amazonaws.com/i/bc06wo8unppp7am869ra.png)

Amplifyコンソールでいつでもアプリを表示するには、次のコマンドを実行します。

```sh
$ amplify console
```

### アップデートをデプロイ中

アプリに変更を加えてデプロイする準備ができたら、 `publish` コマンドを再度実行できます。

```sh
$ amplify publish
```

### アプリを削除中

アプリとデプロイメントを削除するには、 `delete` コマンドを実行します。

```sh
$ amplify delete
```

## Gitベースのデプロイメント

Amplifyはまた、CI/CDやブランチプレビューなどの機能を備えたGitベースのデプロイメントを提供します。

Gitベースのデプロイメントを使用してホストするには、代わりに次の手順に従ってください。

__1.__ アプリを作成

```sh
$ npm init next-app

✔ プロジェクトの名前は何ですか? my-app
✔ テンプレートを選ぶ › デフォルトのスターターアプリ
```

__2.__ package.json 内で以下のカスタム `ビルド` スクリプトを設定:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build && next export",
  "start": "next start"
},
```

__3.__ Git リポジトリを作成し、コードを Git にプッシュします。

```sh
$ git init
$ git remote add origin git@github.com:username/my-next-app. it 
 $ git add .
$ git add .
$ git commit -m 'initial commit'
$ git push origin master
```

__4.__ [Amplify Console](https://console.aws.amazon.com/amplify) に移動し、「アプリを接続」をクリックします

__5.__ Gitプロバイダとブランチを選択する手順に従ってください。

__6.__ __baseDirectory__ を __アウト__ に設定:

![baseDirectory プロパティの設定](https://dev-to-uploads.s3.amazonaws.com/i/edt8ccos33addseu2c06.png)

__7.__ __次に__ そして __保存して__ をクリックします。

サイトが正常にデプロイされると、3つの緑色のチェックマークが表示されます。

ライブサイトを表示するには、Amplifyコンソールから自動生成されたURLをクリックします。

### 新しいビルドを開始します。

Amplifyコンソールから直接、または変更をマスターにプッシュすることで、新しいビルドをキックオフできます。

1. コードを変更する

2. 変更を git にプッシュします

```sh
$ git add .
$ git commit -m 'updates'
$ git push origin master
```

## 動的サーバレンダリングされたルート

このガイドでは、Amplify Hostingを使用して静的な __Next__ サイトをデプロイする方法を学びました。

次に、動的なサーバレンダリングルートの事前レンダリングもサポートします。現時点では、AmplifyはNextによる動的なサーバレンダリングルートのホスティングをサポートしていません。

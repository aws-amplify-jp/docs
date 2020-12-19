## 新しい Vue アプリを作成

Vue CLI を使用して新しい Vue アプリを起動します（このプロジェクトでデフォルトを選択すると動作します）：

<amplify-block-switcher> <amplify-block name="NPM">

```bash
npm install -g @vue/cli
vue create myamplifyproject

? Please pick a preset: (Use arrow keys)
❯ default (babel, eslint)   <--
  Manually select features

cd myamplifyproject
```

必要なモジュールをインストール:

```bash
npm install
```

アプリの実行:

```bash
npm run serve --open
```
`Ctrl + C` を押してサーバーを停止します

</amplify-block> <amplify-block name="Yarn">

```bash
yarn global add @vue/cli
vue create myamplifyproject

? Please pick a preset: (Use arrow keys)
❯ default (babel, eslint)   <--
  Manually select features

cd myamplifyproject
```

必要なモジュールをインストール:

```bash
yarn
```

アプリの実行:

```bash
yarn serve --open
```
`Ctrl + C` を押してサーバーを停止します

</amplify-block> </amplify-block-switcher>

## 新しいバックエンドを初期化

Vueアプリを起動しました Amplifyを設定して、アプリをサポートするために必要なバックエンドサービスを作成しましょう。 プロジェクトのルートから、以下を実行します。

```bash
initを増幅する
```

Amplifyを初期化すると、アプリに関する情報が表示されます。

あなたのバックエンドにはリソースを作成するときに使用するプロジェクト名が必要です。 バックエンドプロジェクトに `todo という名前を与えます`
```console
?プロジェクトの名前(myamplifyproject)を入力してください
```

アプリに提供するすべてのAWSサービスは「環境」に分類されます 一般的な命名規則はdev、staging、本番です。

バックエンドの環境名を `dev` に設定する
```console
?環境開発の名前を入力してください
```

時々CLIは、ファイルの編集を求めます、それはそれらのファイルを開くためにこのエディタを使用します。 お好みのコードエディタソフトウェアを選択してください
```console
? Choose your default editor: (Use arrow keys)
❯ Visual Studio Code
  Atom Editor
  Sublime Text
  IntelliJ IDEA
  Vim (via Terminal, Mac OS only)
  Emacs (via Terminal, Mac OS only)
  None
```

Amplifyは、フロントエンドアプリケーションがこのバックエンド環境に接続するための設定ファイルを提供します。 VueはJavascriptに基づいているので、ここで選択します。 バックエンド統合用のJavaScriptフレームワークを選択してください。
```console
# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
? Choose the type of app that you're building (Use arrow keys)
  android
  ios
❯ javascript
```

```console
? どんなJavaScriptフレームワークを使用していますか(矢印キーを使用)
  angular
  ember
  ionic
  react
  react-native
<unk> vue
  none
```

Vue CLI setup the source files for your project under a `./src` folder. Other tools, such as `Nuxt`, place the source files in the root directory. For this tutorial, we'll go with the default, `src`
```console
? ソースディレクトリパス: src
```

プロジェクトをホスティングする準備ができたら、Vueはあなたのウェブサイトを生成します。 `dist`というフォルダに公開する準備ができました。 これはデフォルトなので、Enterキーを押すだけで続行できます。
```console
?配布ディレクトリパス: distt
```

<amplify-block-switcher> <amplify-block name="NPM">

Amplifyの自動デプロイメントは、アプリケーションを公開するために必要なステップを知る必要があります。 ここでは、 `package.json` にある Vue CLI のデフォルトのビルドスクリプトに設定します。
```console
?ビルドコマンド: npm run-script build
```

Amplifyがアプリケーションを開発モードで実行する必要がある場合は、開発サーバーの起動方法を知る必要があります。 ここでも、Vue CLI のデフォルトスクリプトを使用します。
```console
?Start Command: npm run-script serve
```
</amplify-block> <amplify-block name="Yarn">

Amplifyの自動デプロイメントは、アプリケーションを公開するために必要なステップを知る必要があります。 ここでは、 `package.json` にある Vue CLI のデフォルトのビルドスクリプトに設定します。
```console
?Build Command: yarn build
```

Amplifyがアプリケーションを開発モードで実行する必要がある場合は、開発サーバーの起動方法を知る必要があります。 ここでも、Vue CLI のデフォルトスクリプトを使用します。
```console
?Start Command: yarn serve
```
</amplify-block> </amplify-block-switcher>

Finally, Amplify needs an AWS account to connect to so that I can begin creating the backend services. This is the profile you created with the `amplify configure` command in the introduction step. [introduction step](~/start/getting-started/installation.md)

<amplify-block-switcher> <amplify-block name="With A Profile">

`y` と入力して `Enter` を押して「はい」を選択します。

```console
?AWS プロファイルを使用しますか？ (Y/n)
```
リストからプロフィールを選択し、Enterを押します。Amplifyがバックエンドフレームワークをデプロイし始めます。

</amplify-block> <amplify-block name="Without A Profile">

AWSプロファイルをまだ設定していない場合は、 `n` と入力して "no" を選択し、 `Enter` を押します。

```console
?AWS プロファイルを使用しますか？ (Y/n)
```

これでAWSアカウントのアクセスキーとシークレットキーが求められます。詳細を入力し、Enterキーを押します。

```console
? accessKeyId:  (<YOUR_ACCESS_KEY_ID>)
? secretAccessKey:  (<YOUR_SECRET_ACCESS_KEY>)
```

AWSには世界中に複数のリージョンが存在します。アプリケーションを実行するのに適したリージョンを選択してください。 このチュートリアルでは、リージョンが近づくほど、より良い体験が得られます。

```console
? region: (矢印キーを使用)
<unk> us-east-1 
  us-east-2 
  us-west-2 
  eu-west-1 
  eu-west-1 
  eu-central-1 
  ap-northeast-1 
(上下に移動して選択肢を明らかに)
```

Amplifyがバックエンドフレームワークのデプロイを開始します。

</amplify-block> </amplify-block-switcher>

新しいAmplifyプロジェクトを初期化すると、いくつかのことが起こります。

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as authentication, GraphQL API, storage, and set up authorization rules for the API. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- `.gitignore` ファイルを変更し、生成されたファイルを無視リストに追加します。
- AWS Amplifyコンソールで、 `amplifyコンソール`を実行することでアクセスできるクラウドプロジェクトが作成されます。 Consoleは、Amplifyカテゴリごとにプロビジョニングされたリソースへの深いリンクをバックエンド環境のリストを提供します。 最近のデプロイのステータスとバックエンドリソースのプロモーション、クローン、プル、削除方法に関する説明

## Amplifyライブラリのインストール

クライアントでAmplifyを使用する最初のステップは、必要な依存関係をインストールすることです。

<amplify-block-switcher> <amplify-block name="NPM">

```
npm install aws-amplify @aws-amplify/ui-vue
```

</amplify-block> <amplify-block name="Yarn">

```
yarn add aws-amplify @aws-amplify/ui-vue
```

</amplify-block> </amplify-block-switcher>

`@aws-amplify/ui-vue` パッケージは、エンドツーエンドの認証フローのような機能を簡単に統合できる、Vue固有のUIコンポーネントのセットです。

## フロントエンドの設定

次に、クライアントで Amplify を設定してバックエンドサービスとやり取りする必要があります。

__src/main.js__ を開き、最後のインポートの下に次のコードを追加してください。

```js
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-vue';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);
```

Now Amplify has been successfully configured. As you add or remove categories and make updates to your backend configuration using the Amplify CLI, the configuration in __aws-exports.js__ will update automatically.

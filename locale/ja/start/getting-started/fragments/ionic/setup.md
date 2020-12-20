## 新しいIonicアプリを作成

プロジェクトをセットアップするには、まずIonic CLI で新しい Ionic アプリを作成します。次に、Amplify を追加して新しいプロジェクトを初期化します。

プロジェクトディレクトリから以下のコマンドを実行します。

```bash
npm install -g ionic
ionic start myAmplifyProject blank --type=angular 
cd myAmplifyProject
npm start
```

これは開発サーバーを実行し、ビルドによって生成された出力を確認することができます。 `localhost`に移動すると、実行中のアプリが表示されます。

## 新しいバックエンドを初期化

今、私たちは実行中のIonicアプリを持っています Amplifyを設定して、アプリをサポートするために必要なバックエンドサービスを作成しましょう。 プロジェクトのルートから、以下を実行します。

```bash
initを増幅する
```

Amplifyを初期化すると、アプリに関する情報が表示されます。

```console
Enter a name for the project (todo)

# All AWS services you provision for your app are grouped into an "environment"
# A common naming convention is dev, staging, and production
Enter a name for the environment (dev)

# Sometimes the CLI will prompt you to edit a file, it will use this editor to open those files.
Choose your default editor

# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
Choose the type of app that you're building (javascript)

What JavaScript framework are you using (ionic)

Source directory path (src)

Distribution directory path (www)

Build command (npm run-script build)

Start command (ionic serve)

# This is the profile you created with the `amplify configure` command in the introduction step.
Do you want to use an AWS profile
```

新しいAmplifyプロジェクトを初期化すると、いくつかのことが起こります。

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as authentication, GraphQL API, storage, and set up authorization rules for the API. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- `.gitignore` ファイルを変更し、生成されたファイルを無視リストに追加します。
- AWS Amplifyコンソールで、 `amplifyコンソール`を実行することでアクセスできるクラウドプロジェクトが作成されます。 Consoleは、Amplifyカテゴリごとにプロビジョニングされたリソースへの深いリンクをバックエンド環境のリストを提供します。 最近のデプロイのステータスとバックエンドリソースのプロモーション、クローン、プル、削除方法に関する説明

## Amplifyライブラリのインストール

`aws-amplify` コアに加えて、サービスプロバイダ、ヘルパー、およびコンポーネントを提供する Angular Ionic モジュールをインストールします。

```
$ npm install aws-amplify @aws-amplify/ui-angular
```


## 新しいNext.jsアプリを作成

プロジェクトを設定するには、まず新しい次元を作成します。 s アプリ [Create Next App](https://nextjs.org/docs/api-reference/create-next-app)はシンプルな CLI ツールで、新しい次元の構築を素早く開始できます。 sのアプリケーションで、すべてが設定されています。Amplifyを追加し、新しいプロジェクトを初期化します。

プロジェクトディレクトリから以下のコマンドを実行します。

```bash
npx create-next-app next-amplified
cd next-amplified
```

これにより、 `next-amplified` というディレクトリに新しい Next.js アプリケーションが作成され、その新しいディレクトリに切り替わります。

プロジェクトのルートに入ったので、次のコマンドを使用してアプリを実行できます。

```bash
npm run dev
```

これは開発サーバーを実行し、ビルドによって生成された出力を確認することができます。 `http://localhost:3000` にナビゲートすると、実行中のアプリが表示されます。

## 新しいバックエンドを初期化

これで Nextが実行されています。 sアプリ、Amplifyを設定して、アプリをサポートするために必要なバックエンドサービスを作成しましょう。

プロジェクトのルートから、以下を実行します。

```bash
initを増幅する
```

Amplifyを初期化すると、アプリに関する情報が表示されます。

```console
Enter a name for the project (nextamplified)

# All AWS services you provision for your app are grouped into an "environment"
# A common naming convention is dev, staging, and production
Enter a name for the environment (dev)

# Sometimes the CLI will prompt you to edit a file, it will use this editor to open those files.
Choose your default editor

# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
Choose the type of app that you're building (javascript)

What JavaScript framework are you using (react)

Source directory path (src)

Distribution directory path (build)

Build command (npm run build)

Start command (npm start)

# This is the profile you created with the `amplify configure` command in the introduction step.
Do you want to use an AWS profile?
```

> 可能であれば、CLI はプロジェクトのタイプに基づいて適切な構成を推測しますAmplifyが初期化されます。 この場合、Create Next Appを使用しており、アプリの種類に適した設定を提供していました。 フレームワーク、ソース、ディストリビューション、ビルド、および開始オプション。

新しいAmplifyプロジェクトを初期化すると、いくつかのことが起こります。

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as a GraphQL API and authentication. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- `.gitignore` ファイルを変更し、生成されたファイルを無視リストに追加します。
- AWS Amplifyコンソールで、 `amplifyコンソール`を実行することでアクセスできるクラウドプロジェクトが作成されます。 Consoleは、Amplifyカテゴリごとにプロビジョニングされたリソースへの深いリンクをバックエンド環境のリストを提供します。 最近のデプロイのステータスとバックエンドリソースのプロモーション、クローン、プル、削除方法に関する説明

As you add or remove categories and make updates to your backend configuration using the Amplify CLI, the configuration in __aws-exports.js__ will update automatically.

## Amplifyライブラリのインストール

クライアントでAmplifyを使用する最初のステップは、必要な依存関係をインストールすることです。

```bash
npm install aws-amplify @aws-amplify/ui-react
```

The `aws-amplify` package is the main library for working with Amplify in your apps. The `@aws-amplify/ui-react` package includes React-specific UI components we'll use as we build the app.

Next.jsアプリが設定され、Amplifyが初期化されたので、次のステップでAPIを追加する準備が整いました。

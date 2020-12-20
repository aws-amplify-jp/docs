始めるには、React Native プロジェクトが必要です。 既存のプロジェクトがある場合は、 [バックエンドの初期化](#initialize-a-new-backend) にスキップできます。

## 新しい React Native アプリを作成

始めるには、新しい React Native プロジェクトを初期化してください。

<amplify-block-switcher> <amplify-block name="Expo">

```bash
npm install -g expo-cli  
expo init RNAmplify

? テンプレートを選択してください: blank
```

</amplify-block> <amplify-block name="React Native CLI">

```bash
npx react-native init RNAmpliify
```

</amplify-block> </amplify-block-switcher>

## 新しいバックエンドを初期化

これで新しいAmplifyプロジェクトを初期化する準備ができました。そうするには、プロジェクトディレクトリに変更してください

```bash
cd RNAmplify
```

Amplify CLI を使用してプロジェクトを作成します。

```bash
initを増幅する
```

```console
? Enter a name for the project: rnamplify
? Enter a name for the environment: demo
? Choose your default editor: <Your favorite text editor>
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react-native
? Source Directory Path:  ./
? Distribution Directory Path: ./
? Build Command:  npm run-script build
? Start Command: npm run-script start
? Do you want to use an AWS profile? Y
? Please choose the profile you want to use: <Your AWS profile from the configuration step>
```

新しいAmplifyプロジェクトを初期化すると、いくつかのことが起こります。

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as a GraphQL API and authentication. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- `.gitignore` ファイルを変更し、生成されたファイルを無視リストに追加します。
- AWS Amplifyコンソールで、 `amplifyコンソール`を実行することでアクセスできるクラウドプロジェクトが作成されます。 Consoleは、Amplifyカテゴリごとにプロビジョニングされたリソースへの深いリンクをバックエンド環境のリストを提供します。 最近のデプロイのステータスとバックエンドリソースのプロモーション、クローン、プル、削除方法に関する説明。

## Amplifyライブラリのインストール

次に、ローカルのAmplify依存関係をインストールします。ここでの指示は、Expoを使用しているかReact Native CLIを使用しているかによって異なります。

<inline-fragment src="~/start/getting-started/fragments/reactnative/getting-started-steps-ui.md"></inline-fragment>

Finally, open __App.js__ (Expo) or __index.js__ (React Native CLI) and add the following lines of code at the top of the file below the last import:

```javascript
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

これでプロジェクトがセットアップされ、新機能の追加を開始できます。

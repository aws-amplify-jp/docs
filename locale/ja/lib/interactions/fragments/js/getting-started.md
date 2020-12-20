AWS Amplify Interactionsカテゴリでは、WebまたはモバイルアプリでAI搭載のチャットボットを使用できます。 *Interactions* を使用してバックエンドのチャットボットプロバイダを設定したり、たった1行のコードでチャットボットUIをアプリに統合したりできます。

## AWSとの相互作用

AWS Amplifyはデフォルトのチャットボットサービスとして [Amazon Lex](https://aws.amazon.com/lex) を実装している。 Amazon LexはAmazon Alexaを動かすのと同じディープラーニングテクノロジーで対話型ボットの作成をサポートしています。

## 新しいチャットボットを作成

> 前提条件: [Amplify CLI をインストールして構成します](~/cli/start/install.md)

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して相互作用を加えます
```

CLIは、作成するチャットボットを指定する手順を説明します。

サンプルチャットボットから開始するか、最初から開始するかを選択できます。 一から始めることを選択した場合 CLIはチャットボットの意図とスロットを設定するための一連の質問を求めます。

プロジェクトに複数のチャットボットを追加するために、 `増幅を追加する` コマンドを複数回実行することができます。

<amplify-callout warning> Interactions カテゴリは、分析イベントの送信をアプリに許可するために、舞台裏の認証カテゴリを使用します。 </amplify-callout>

`add` コマンドは自動的にバックエンド設定をローカルに作成します。クラウドでバックエンドを更新するには、次を実行します。

```bash
push を増幅する
```

push コマンドが正常に実行されると、 `aws-exports という設定ファイルが生成されます。 s <code>` は `./src` などの設定されたソースディレクトリにコピーされます。

> Amplify CLI バージョン1.6でインタラクションリソースが作成された場合。 以下では、AWS LambdaでNode.jsランタイムの問題を回避するために、プロジェクトを手動で更新する必要があります。 [詳しくはこちら](~/cli/migration/lambda-node-version-update.md)

## 手動セットアップ

Amazon Lexのチャットボックスは、Amazon Lexコンソールで作成できます。 ボットを作成するには、 [Amazon Lex開発者ガイド](https://docs.aws.amazon.com/lex/latest/dg/getting-started.html) の手順に従ってください。

![相互作用](~/images/interactions_lex_console_edit_bot.jpg)


手動で設定する場合は、アプリを構成するために認証情報とボットの詳細を入力する必要があります。

```javascript
import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx',
    region: 'us-east-1'
  },
  Interactions: {
    bots: {
      "BookTrip": {
        "name": "BookTrip",
        "alias": "$LATEST",
        "region": "us-east-1",
      },
    }
  }
});
```

## フロントエンドの設定

設定ファイルをアプリに読み込みます。Amplify設定ステップをアプリのルートエントリポイントに追加することをお勧めします。 例えば `App.js` 、Angularの `main.ts` など。

```javascript
import Amplify, { Interactions } from 'aws-amply';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
```

## ChatBot UI component

`ChatBot` コンポーネントを使用して、会話型 UI をアプリケーションに追加します。 [詳細はこちら](~/ui-legacy/interactions/chatbot.md)。

## API リファレンス

Interactions モジュールの完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/amplify-js/api/classes/interactions.html) を参照してください。

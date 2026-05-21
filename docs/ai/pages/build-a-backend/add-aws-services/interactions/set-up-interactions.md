---
title: "Amplify Interactionsのセットアップ"
section: "build-a-backend/add-aws-services/interactions"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2025-02-07T19:05:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/interactions/set-up-interactions/"
---

AWS Amplify Interactionsは、ウェブアプリやモバイルアプリでAIを活用したチャットボットを有効にします。_Interactions_を使用して、バックエンドチャットボットプロバイダーを構成し、わずか1行のコードでチャットボットUIをアプリに統合できます。

## AWS でのInteractions

AWS Amplifyは、[Amazon Lex](https://aws.amazon.com/lex)をデフォルトのチャットボットサービスとしてサポートしています。Amazon Lexは、Amazon Alexaを動かす同じ深層学習技術を使用して、会話型ボットを作成することをサポートしています。

## AWS LexV2ボットのセットアップ

Amazon Lexコンソールで、Amazon Lex V2チャットボットを作成できます。ボットを作成するには、[Amazon Lex V2開発者ガイド](https://docs.aws.amazon.com/lexv2/latest/dg/getting-started.html)に示されている手順に従ってください。

![Amazon Lexインテントページ。『BookTripNew』というボット内に、ユーザーが『BookCar』や『FallbackIntent』といったボットに実行させたいインテント（ユーザーが達成したいこと）が2つ作成されている状態を表示](/images/interactions_lex_v2_console_edit_bot.png)

## IAMポリシーの更新

Amazon Lexサービスは、Interactions API を使用するためにIAMポリシーが必要です（_テンプレートを実際の値に置き換えることを忘れずに_）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["lex:RecognizeText", "lex:RecognizeUtterance"],
      "Resource": "arn:aws:lex:<your-app-region>:<your-account-id>:bot-alias/<your-bot-id>/<your-bot-alias-id>"
    }
  ]
}
```

## フロントエンドの構成

<!-- Platform: javascript,angular,nextjs,react,vue -->
aws-amplifyとinteractionsパッケージをプロジェクトに追加します：

```bash title="Terminal" showLineNumbers={false} 
npm add --save @aws-amplify/interactions aws-amplify
```
<!-- /Platform -->

<!-- Platform: react-native -->
### Amplifyとその依存関係をインストール

<details><summary>React Nativeバージョン0.72以下の場合の手順</summary>

  `@aws-amplify/react-native`には、`react-native`バージョンが0.72以下の場合、iOSの最小デプロイメント対象が`13.0`である必要があります。_ios_ディレクトリにある_Podfile_を開き、`target`値を更新してください：

  ```diff
   - platform :ios, min_ios_version_supported
   + platform :ios, 13.0
   ```

</details>

```bash title="Terminal" showLineNumbers={false} 
npm add aws-amplify \
  @aws-amplify/react-native \
  @aws-amplify/interactions \
  @react-native-community/netinfo \
  @react-native-async-storage/async-storage \
  react-native-get-random-values
```
<!-- /Platform -->

<Callout>

`package.json`ファイル内の`@aws-amplify/interactions`パッケージが`aws-amplify`パッケージと同じバージョン番号であることを確認してください。

</Callout>

### Amplifyの構成
アプリ内で設定ファイルをインポートして読み込みます。Amplifyの設定ステップをアプリのルートエントリーポイントに追加することをお勧めします。例えば、**App.js**（Expo）または**index.js**（React Native CLI）です。

```javascript title="src/index.js"
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  Interactions: {
    LexV2: {
      '<your-bot-name>': {
        aliasId: '<your-bot-alias-id>',
        botId: '<your-bot-id>',
        localeId: '<your-bot-locale-id>',
        region: '<your-bot-region>'
      }
    }
  }
});
```

<!-- Platform: react-native -->
アプリケーションのエントリーポイントファイル（ほとんどのReact Nativeアプリではトップレベルのindex.js）に、`crypto.getRandomValues`ポリフィルを追加する必要があります。

```js title="src/index.js"
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```
<!-- /Platform -->

<Callout warning="true">

アプリケーションのライフサイクルの可能な限り早い段階で`Amplify.configure`を呼び出してください。`Amplify.configure`が他のAmplify JavaScript APIを呼び出す前に呼び出されていない場合、設定の欠落またはエラー`NoCredentials`がスローされます。この問題の考えられる原因については、[ライブラリが構成されていないトラブルシューティングガイド](/[platform]/build-a-backend/troubleshooting/library-not-configured/)を参照してください。

</Callout>

<!-- Platform: react-native -->
## 既知の問題

バンドラーの起動時に以下のエラーが発生する可能性があります：

> Error: Unable to resolve module stream from /path/to/node_modules/@aws-sdk/...

これは[既知の問題](https://github.com/aws/aws-sdk-js-v3/issues/4877)です。リンクされた問題に記載されている[手順](https://github.com/aws/aws-sdk-js-v3/issues/4877#issuecomment-1656007484)に従ってエラーを解決してください。
<!-- /Platform -->

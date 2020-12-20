React の場合、会話型 UI をアプリケーションに追加する最も簡単な方法は、 *ChatBot* コンポーネントを使用することです。

ChatBotは完全なチャットメッセージングインターフェースを自動的にレンダリングし、すぐに使えるようにします。また、テーマサポートを使用してカスタマイズできます。

## 使用法

React を使用する場合、 *ChatBot* を以下のプロパティで使用できます。

```html
<ChatBot
    title="My Bot"
    theme={myTheme}
    botName="BookTrip"
    welcomeMessage="Welcome, how can I help you today?"
    onComplete={this.handleComplete.bind(this)}
    clearOnComplete={true}
    conversationModeOn={false}
/>
```

デフォルトでは、ChatBotはテキストのみを使用できます。 prop `の textEnabled={false}` を渡すか、prop `voiceEnabled={true}`を渡すことで音声操作をオンにできます。 両方を無効にしてはいけません。これにより、ユーザー入力は利用できなくなります。

注意: Amazon Lexで音声入力を動作させるには、AWSコンソールで音声出力を有効にする必要があります。 Amazon Lexサービスの下で、設定したLexチャットボットをクリックし、設定 -> General に移動し、希望する出力音声を選択します。 次に、format@@0をクリックします。出力音声を有効にし忘れた場合、次のようなエラーが表示されます。
```
ChatBot エラー: 無効なボット設定: このボットにはポリーボイスIDが関連付けられていません。 ユーザーと音声操作を行うには音声IDを設定してください
```

`conversationModeOn` propsは、音声操作で連続会話モードのオン/オフを切り替えます。 連続会話モードでは、ユーザーはチャットボットの会話を完了するために一度だけマイクボタンをクリックする必要があります。 つまり、ユーザが録音を停止するために音声通話を終了し、インタラクションプロバイダにデータを送信するタイミングをコンポーネントが検出します。 やり取りプロバイダから応答を受け取ったら再度録音を開始します 会話が終了するとサイクルが停止します。

必要に応じて、props で `voiceConfig` を渡して、この例のように無音検出パラメータを変更することもできます。

```jsx
const customVoiceConfig = {
    silenceDetectionConfig: {
        time: 2000,
        amplitude: 0.2
    }   
}

<ChatBot
    ...
    voiceConfig={customVoiceConfig}
/>

```

## サンプル React アプリ

以下のシンプルなアプリは、React アプリケーションで **ChatBot** コンポーネントを使用する方法を示しています。上記の自動設定を示しています。

```javascript
import React, { Component } from 'react';
import Amplify, { Interactions } from 'aws-amplify';
import { ChatBot, AmplifyTheme } from 'aws-amplify-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

// Imported default theme can be customized by overloading attributes
const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#ff6600'
  }
};

class App extends Component {

  handleComplete(err, confirmation) {
    if (err) {
      alert('Bot conversation failed')
      return;
    }

    alert('Success: ' + JSON.stringify(confirmation, null, 2));
    return 'Trip booked. Thank you! what would you like to do next?';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ChatBot Demo</h1>
        </header>
        <ChatBot
          title="My Bot"
          theme={myTheme}
          botName="BookTrip"
          welcomeMessage="Welcome, how can I help you today?"
          onComplete={this.handleComplete.bind(this)}
          clearOnComplete={true}
          conversationModeOn={false}
        />
      </div>
    );
  }
}

export default App;
```
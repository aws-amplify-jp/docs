React の場合、会話型 UI をアプリケーションに追加する最も簡単な方法は、 *ChatBot* コンポーネントを使用することです。

ChatBotは完全なチャットメッセージングインターフェースを自動的にレンダリングし、すぐに使えるようにします。また、テーマサポートを使用してカスタマイズできます。

## 使用法

React Nativeを使用する場合、以下のプロパティで *ChatBot* を使用できます。

```jsx
<ChatBot
    botName={botName}
    welcomeMessage={welcomeMessage}
    onComplete={this.handleComplete}
    clearOnComplete={false}
    styles={StyleSheet.create({
        itemMe: {
            color: 'red'
        }
    })}
/>
```

デフォルトでは、ChatBotはテキストの相互作用のみを許可します。prop `textEnabled={false}` を渡すことで、テキストの相互作用をオフにできます。
### 音声操作をオンにする
音声操作をサポートするには、React Native ChatBotコンポーネントでは相互依存関係のインストールとネイティブモジュールのリンクが必要です。 ピアの依存関係は以下のとおりです: [react-native-voice](https://github.com/wenkesj/react-native-voice), [react-native-sound](https://github.com/zmxv/react-native-sound), and [react-native-fs](https://github.com/itinance/react-native-fs).

インストール後、以下を実行してネイティブモジュールをリンクします。
```
react-native link react-native-voice 
react-native-fs
react-native-sound
```

App.js の上部にこのインポートを含める
```jsx
import voiceLibs from 'aws-amplify-react-native/dist/Interactions/ReactNativeModules'
```

Android の設定によっては、許可を要求する必要がありますが、他の設定は必要ありません - [Android ドキュメント](https://developer.android.com/training/permissions/requesting.html) を参照してください。

iOS は `NSMicrophoneUsageDescription` と `NSSpeechRecognitionUsageDescription`の権限が必要です - iOS用のInfo.plistファイルにこのスニペットを追加できます:
```xml  
<dict>
  ...
  <key>NSMicrophoneUsageDescription</key>
  <string>Description of why you require the use of the microphone</string>
  <key>NSSpeechRecognitionUsageDescription</key>
  <string>Description of why you require the use of the speech recognition</string>
  ...
</dict>
```
次に、 `voiceEnabled={true}` と `voiceLibs={voiceLibs}` をChatbot propsに渡して音声操作を有効にします。 音声とテキストの両方の入力を無効にしないでください (voiceEnabled={false} と textEnabled={false} の両方を設定しないでください)

Amazon Lexで音声操作を行うには、AWSコンソールで音声出力を有効にする必要があります。 Amazon Lexサービスの下で、設定したLexチャットボットをクリックし、設定 -> General に移動し、希望する出力音声を選択します。 次に、format@@0をクリックします。出力音声を有効にし忘れた場合、次のようなエラーが表示されます。
```
ChatBot エラー: 無効なボット設定: このボットにはポリーボイスIDが関連付けられていません。 ユーザーと音声操作を行うには音声IDを設定してください
```

`silenceDelay={customTime}` `customTime` がミリ秒単位で無音検出時間を設定することもできます。既定値は 1000 です。

`conversationModeOn` propsは、音声操作で連続会話モードのオン/オフを切り替えます。

音声が有効になっていて会話モードがオンになっている構成済みのChatBotコンポーネントの例を次に示します。
```jsx
<ChatBot
    botName={botName}
    welcomeMessage={welcomeMessage}
    onComplete={this.handleComplete}
    clearOnComplete={false}
    styles={StyleSheet.create({
        itemMe: {
            color: 'red'
        }
    })}
    voiceEnabled={true}
    voiceLibs={voiceLibs}
    conversationModeOn={true}
/>
```

以下のシンプルなアプリは、React Native アプリケーションで **ChatBot** コンポーネントを使用する方法を示しています。

 ```javascript
import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, Alert, StatusBar } from 'react-native';
import Amplify from 'aws-amplify';
import { ChatBot } from 'aws-amplify-react-native';

import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: StatusBar.currentHeight,
  },
});

export default class App extends Component {

    state = {
        botName: 'BookTrip',
        welcomeMessage: 'Welcome, what would you like to do today?',
    };

    constructor(props) {
        super(props);
        this.handleComplete = this.handleComplete.bind(this);
    }

    handleComplete(err, confirmation) {
        if (err) {
        Alert.alert('Error', 'Bot conversation failed', [{ text: 'OK' }]);
        return;
        }

        Alert.alert('Done', JSON.stringify(confirmation, null, 2), [{ text: 'OK' }]);

        this.setState({
        botName: 'BookTrip',
        });

        return 'Trip booked. Thank you! what would you like to do next?';
    }

    render() {
        const { botName, showChatBot, welcomeMessage } = this.state;

        return (
        <SafeAreaView style={styles.container}>
            <ChatBot
            botName={botName}
            welcomeMessage={welcomeMessage}
            onComplete={this.handleComplete}
            clearOnComplete={false}
            styles={StyleSheet.create({
                itemMe: {
                color: 'red'
                }
            })}
            />
        </SafeAreaView>
        );
    }

}
 ```
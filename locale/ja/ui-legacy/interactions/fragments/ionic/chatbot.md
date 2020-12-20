`amplify-interaction` コンポーネントは、7つのプロパティをサポートするドロップインチャットコンポーネントを提供します。

1. `bot`: Amazon Lexチャットボットの名前

2. `clearComplete`: 会話の最後に メッセージをクリアするかどうかを示します。

3. `complete`: 会話が完了するとディスパッチ。
4.  `voiceConfig`: If needed, you can also pass `voiceConfig` from your app component to modify the silence detection parameters, like in this example:

```js
customVoiceConfig = {
    silenceDetectionConfig: {
        time: 2000,
        amplitude: 0.2
    }   
}

```
5. `voiceEnabled`: 音声ユーザー入力を有効にする。デフォルトは `false`

注意: Amazon Lexで音声入力を動作させるには、AWSコンソールで音声出力を有効にする必要があります。 Amazon Lexサービスの下で、設定したLexチャットボットをクリックし、設定 -> General に移動し、希望する出力音声を選択します。 次に、format@@0をクリックします。出力音声を有効にし忘れた場合、次のようなエラーが表示されます。
```
ChatBot エラー: 無効なボット設定: このボットにはポリーボイスIDが関連付けられていません。 ユーザーと音声操作を行うには音声IDを設定してください
```

6. `textEnabled`: `true` のテキストユーザー入力を有効にする
7. `conversationModeOn`: 音声会話モードのオン/オフを切り替えます。デフォルトでは `OFF`

```html
<amplify-interactions 
    framework="Ionic"
    bot="yourBotName" 
    clearComplete="true" 
    (complete)="onBotComplete($event)"
    [conversationModeOn]="false"
    [voiceConfig]="{customVoiceConfig}"
    [voiceEnabled]="true"
    [textEnabled]="true">
</amplify-interactions>
```

Amazon Lexチャットボットの作成については、 [Interactions ドキュメント](~/lib/interactions/getting-started.md) を参照してください。
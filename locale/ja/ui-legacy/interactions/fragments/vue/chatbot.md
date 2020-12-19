Chatbotコンポーネントを使用すると、ユーザはAmazon Lexチャットボットとやり取りできます。

使用法: `<amplify-chatbot></amplify-chatbot>`

設定:
```
<amplify-chatbot v-bind:chatbotConfig="chatbotConfig"></amplify-chatbot>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/interactions-attributes.md"></inline-fragment>

注意: Amazon Lexで音声入力を動作させるには、AWSコンソールで音声出力を有効にする必要があります。 Amazon Lexサービスの下で、設定したLexチャットボットをクリックし、設定 -> General に移動し、希望する出力音声を選択します。 次に、format@@0をクリックします。出力音声を有効にし忘れた場合、次のようなエラーが表示されます。
```
ChatBot エラー: 無効なボット設定: このボットにはポリーボイスIDが関連付けられていません。 ユーザーと音声操作を行うには音声IDを設定してください
```



aws-exports ファイルでない場合は、AWS 構成メソッドでボットを定義することもできます。
```
 Interactions: {
    bots: {
      "BookTrip": {
        "name": "BookTrip",
        "alias": " name": "$LATEST",
        "region": "us-east-1",
      },
    }
}
```

イベント:

* `AmplifyEventBus.$emit('chatComplete', this.options.botTitle)`: チャットセッションが完了したときに発生します (clearComplete オプションが 'true' の場合にのみ発生します)。
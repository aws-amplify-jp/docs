## バックエンドの設定

まだやっていない場合は プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **変換**を選択します。その後、以下の解答を使用します:

```console
? 何を変換したいですか？ 
  テキストを別の言語に変換する 
  テキストを音声に変換する 
<unk> 音声をテキストに変換する 
  詳細はこちら 

? 誰にアクセスする必要がありますか？認証とゲストユーザー
```

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

使用されるサービス: Amazon Transscribe

## API の操作

マイクからの録音など、PCMオーディオバイトバッファをテキストに変換することができます。

```javascript
Predictions.convert({
  transcription: {
    source: {
      bytes
    },
    // language: "en-US", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
  }
})
.then(({ transcription: { fullText } }) => console.log({ fullText }))
.catch(err => console.log({ err }));
```

## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **変換**を選択します。その後、以下の解答を使用します:

```console
? 何を変換したいですか？ (矢印キーを使用)
<unk> テキストを別の言語に変換する 
  テキストを音声に変換する 
  音声をテキストに変換する 
  詳細はこちら 

? 誰にアクセスする必要がありますか？認証とゲストユーザー
```

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

## API の操作

あるソース言語から宛先言語にテキストを翻訳します。

```javascript
Predictions.convert({
  translateText: {
    source: {
      text: textToTranslate,
      // language : "es" // defaults configured on aws-exports.js
      // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
    },
    // targetLanguage: "en"
  }
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));
```

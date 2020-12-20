## バックエンドのセットアップ

これにより、キーフレーズ、文章からのセンチメント分析などを決定することができます。 まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **解釈**を選択します。次に次の解答を使用します:

```console
? What would you like to interpret? (Use arrow keys)
❯ Interpret Text 
  Learn More 

? What kind of interpretation would you like? 
  Language 
  Entity 
  Keyphrase 
  Sentiment 
  Syntax 
❯ All 

? Who should have access? Auth and Guest users
```

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

使用されるサービス: Amazon Compriend

## API の操作

テキストを分析して、キーフレーズ、センチメント(正、負、中立)、または構文(代名詞、動詞など)を検索します。 をクリックします。また、名前や場所などのテキスト内のエンティティを検索したり、言語を検出したりすることもできます。

```js
Predictions.interpret({
  text: {
    source: {
      text: textToInterpret,
    },
    type: "ALL"
  }
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));
```

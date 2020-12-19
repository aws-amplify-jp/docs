まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`を増幅して予測を追加する`を実行し、次の答えを使用します。

```console
? Please select from one of the categories below
  Identify
❯ Convert
  Interpret
  Infer
  Learn More

? What would you like to convert? (Use arrow keys)
❯ Translate text into a different language
  Generate speech audio from text
  Transcribe text from audio

? Provide a friendly name for your resource
  <Enter a friendly name here>

? What is the source language? (Use arrow keys)
  <Select your default source language>

? What is the target language? (Use arrow keys)
  <Select your default target language>

? Who should have access?
  Auth users only
❯ Auth and Guest users

```

クラウドでリソースを作成するには、 `増幅プッシュ` を実行してください

## API の操作

ここでは、テキストを翻訳する例を示します。 Amplify CLI を使用してこのリソースを追加しながら、ターゲット言語またはソース言語に関する選択を上書きするために。 次のようにパラメータとして直接渡すことができます

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func translateText(text:String) {
    Amplify.Predictions.convert(textToTranslate: text,
                                    language: .english,
                                    targetLanguage: .italian) { event in
        switch event {
        case let .success(result):
            print(result.text)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func translateText(text:String) -> AnyCancellable {
    Amplify.Predictions.convert(
        textToTranslate: text,
        language: .english,
        targetLanguage: .italian
    )
    .resultPublisher
    .sink {
        if case let .failure(error) = $0 {
            print(error)
        }
    }
    receiveValue: { result in
        print(result.text)
    }
}
```

</amplify-block>

</amplify-block-switcher>

このコードを実行すると、コンソールに表示される翻訳テキストが表示されます。

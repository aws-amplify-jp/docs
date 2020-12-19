以下のAPIでは、言語、エンティティ(場所、人)、キーフレーズ、センチメント (正、中立、負)、および構文(代名詞、動詞、形容詞)のテキストを分析できます。

iOSで言語を分析するために、AWSバックエンドサービスとAppleのオンデバイス [Natural Language Framework](https://developer.apple.com/documentation/naturallanguage) を使用して、最も正確な結果を提供します。 お使いのデバイスがオフラインの場合は、自然言語のみ結果を返します。 一方、AWSサービスに接続できる場合。 サービスと自然言語の両方から一体となった結果を返します。 バックエンドサービスと自然言語の切り替えは、追加の設定なしに自動的に行われます。

## バックエンドの設定

これにより、テキストからキーフレーズ、センチメント、言語、構文、エンティティを決定することができます。 まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`を増幅して予測を追加する`を実行し、次の答えを使用します。

```console
? Please select from one of the categories below
  Identify
  Convert
❯ Interpret
  Infer
  Learn More

? What would you like to interpret? (Use arrow keys)
❯ Interpret Text

? Provide a friendly name for your resource
  <Enter a friendly name here>

? What kind of interpretation would you like?
  Language
  Entity
  Keyphrase
  Sentiment
  Syntax
❯ All

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

クラウドでリソースを作成するには、 `増幅プッシュ` を実行してください

## API の操作

感情分析や自然言語特性などの解釈用のテキストを送信する例を示します。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func interpret(text: String) {
    Amplify.Predictions.interpret(text: text) { event in
        switch event {
        case let .success(result):
            print(result)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func interpret(text: String) -> AnyCancellable {
    Amplify.Predictions.interpret(text: text)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            print(result)
        }
}
```

</amplify-block>

</amplify-block-switcher>

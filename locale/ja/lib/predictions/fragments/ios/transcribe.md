## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **変換**を選択します。その後、以下の解答を使用します:

```console
? What would you like to convert?
  Translate text into a different language
  Generate speech audio from text
❯ Transcribe text from audio

? Provide a friendly name for your resource
  <Enter a friendly name here>

? What is the source language? (Use arrow keys)
  <Select your default source language>

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

## API の操作

ここでは、音声をテキストに変換する例を示します。 Amplify CLI を使用してこのリソースを追加中に行った選択を上書きするには、次の手順を実行します。 オプションオブジェクトの言語を以下に示すように渡すことができます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func speechToText(speech: URL) {
    let options = PredictionsSpeechToTextRequest.Options(
        defaultNetworkPolicy: .auto,
        language: .usEnglish,
        pluginOptions: nil
    )

    Amplify.Predictions.convert(speechToText: speech, options: options) { event in
        switch event {
        case let .success(result):
            print(result.transcription)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func speechToText(speech: URL) -> AnyCancellable {
    let options = PredictionsSpeechToTextRequest.Options(
        defaultNetworkPolicy: .auto,
        language: .usEnglish,
        pluginOptions: nil
    )

    let sink = Amplify.Predictions.convert(speechToText: speech, options: options)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            print(result.transcription)
        }
    return sink
}
```

</amplify-block>

</amplify-block-switcher>

## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`を増幅して予測を追加する`を実行し、次の答えを使用します。

```console
? Please select from one of the categories below
  Identify
❯ Convert
  Interpret
  Infer
  Learn More

? What would you like to convert?
  Translate text into a different language
❯ Generate speech audio from text
  Transcribe text from audio

? Provide a friendly name for your resource
  <Enter a friendly name here>

? What is the source language? (Use arrow keys)
  <Select your default source language>

? Select a speaker (Use arrow keys)
  <Select your default speaker voice>

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

クラウドでリソースを作成するには、 `増幅プッシュ` を実行してください

## API の操作

テキストを音声に変換する例を次に示します。 Amplify CLI を使用してこのリソースを追加中に行った選択を上書きするには、次の手順を実行します。 以下のようにoptionsオブジェクトの音声を渡すことができます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
import Amplify
import AWSPredictionsPlugin
import AVFoundation

//...

var player: AVAudioPlayer?

//...

func textToSpeech(text: String) {
    let options = PredictionsTextToSpeechRequest.Options(
        voiceType: .englishFemaleIvy,
        pluginOptions: nil
    )

    Amplify.Predictions.convert(textToSpeech: text, options: options) { event in
        switch event {
        case let .success(result):
            print(result.audioData)
            self.player = try? AVAudioPlayer(data: result.audioData)
            if let player = self.player {
                player.play()
            }
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
import Amplify
import AWSPredictionsPlugin
import AVFoundation

//...

var player: AVAudioPlayer?
var textToSpeechSink: AnyCancellable?

//...

func textToSpeech(text: String) {
    let options = PredictionsTextToSpeechRequest.Options(
        voiceType: .englishFemaleIvy,
        pluginOptions: nil
    )

    textToSpeechSink = Amplify.Predictions.convert(textToSpeech: text, options: options)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            print(result.audioData)
            self.player = try? AVAudioPlayer(data: result.audioData)
            if let player = self.player {
                player.play()
            }
        }
}
```

</amplify-block>

</amplify-block-switcher>

このコードを実行すると、デバイスから発せられたテキストの音声が聞こえます。

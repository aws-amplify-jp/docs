以下のAPIでは、画像中の実際のオブジェクト(椅子、机など)を識別することができ、これらのオブジェクトは画像から「ラベル」と呼ばれます。

iOSで画像をラベル付けするには、AWSバックエンドサービスとAppleのオンデバイスCore ML [Vision Framework](https://developer.apple.com/documentation/vision) を使用して、最も正確な結果を提供します。 デバイスがオフラインの場合は、Core MLからのみ結果を返します。 一方、AWSサービスに接続できる場合。 サービスとコアMLの両方からユニオン結果を返します。 バックエンドサービスとCore MLの切り替えは、追加の設定なしに自動的に行われます。

## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`を増幅して予測を追加する`を実行し、次の答えを使用します。

```console
? Please select from one of the categories below (Use arrow keys)
❯ Identify
  Convert
  Interpret
  Infer
  Learn More

? What would you like to identify?
  Identify Text
  Identify Entities
❯ Identify Labels

? Provide a friendly name for your resource
  <Enter a friendly name here>

? Would you like use the default configuration?
❯ Default Configuration
  Advanced Configuration

? Who should have access?
  Auth users only
❯ Auth and Guest users  

```

高度な設定では、安全でないコンテンツまたは特定されたラベルのすべてのモデレーションを選択できます。デフォルトでは両方を使用します。

クラウドでリソースを作成するには、 `増幅プッシュ` を実行してください

## API の操作

以下のサンプルコードを使用して、「ラベル」と呼ばれる椅子、机などの実際のオブジェクトを識別することができます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectLabels(_ image:URL) {
    // For offline calls only to Core ML models replace `options` in the call below with this instance:
    // let options = PredictionsIdentifyRequest.Options(defaultNetworkPolicy: .offline, pluginOptions: nil)
    Amplify.Predictions.identify(type: .detectLabels(.labels), image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyLabelsResult
            print(data.labels)
            // Use the labels in your app as you like or display them
        case let .failure(error):
            print(error)
        }
    }
}

// To identify labels with unsafe content
func detectLabels(_ image:URL) {
    Amplify.Predictions.identify(type: .detectLabels(.all), image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyLabelsResult
            print(data.labels)
            // Use the labels in your app as you like or display them
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func detectLabels(_ image:URL) -> AnyCancellable {
    // For offline calls only to Core ML models replace `options` in the call below with this instance:
    // let options = PredictionsIdentifyRequest.Options(defaultNetworkPolicy: .offline, pluginOptions: nil)
    Amplify.Predictions.identify(type: .detectLabels(.labels), image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyLabelsResult
            print(data.labels)
            // Use the labels in your app as you like or display them
        }
}

// To identify labels with unsafe content
func detectLabels(_ image:URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectLabels(.all), image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyLabelsResult
            print(data.labels)
            // Use the labels in your app as you like or display them
        }
}
```

</amplify-block>

</amplify-block-switcher>

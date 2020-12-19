以下の API では、画像からテキスト(単語、表、本からのページ)を識別することができます。

iOS上でテキストを識別するために、AWSバックエンドサービスとAppleのオンデバイスCore ML [Vision Framework](https://developer.apple.com/documentation/vision) を使用して、最も正確な結果を提供します。 デバイスがオフラインの場合は、Core MLからのみ結果を返します。 一方、AWSサービスに接続できる場合。 サービスとコアMLの両方からユニオン結果を返します。 バックエンドサービスとCore MLの切り替えは、追加の設定なしに自動的に行われます。

## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`を増幅して予測を追加する`を実行し、次の答えを使用します。

```console
? Please select from one of the categories below
❯ Identify
  Convert
  Interpret
  Infer
  Learn More

? What would you like to identify? (Use arrow keys)
❯ Identify Text
  Identify Entities
  Identify Labels

? Provide a friendly name for your resource
    <Enter a friendly name here>

? Would you also like to identify documents?
    <Enter 'y'> 

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

クラウドにリソースを作成するには、 `増幅プッシュ` を実行します。

## 画像からテキストを識別する

Amplifyは、特定したいテキストの種類(画像やドキュメントなど)に応じて、Amazon TextractとRekognitionの両方を呼び出します。

If you are detecting text from an image you would send in `.plain` as your text format as shown below.  Using `.plain` with `PredictionsIdentifyRequest.Options()` combines results from on device results from Core ML and AWS services to yield more accurate results.

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectText(_ image: URL, completion: @escaping ([IdentifiedWord]) -> Void) {
    Amplify.Predictions.identify(type: .detectText(.plain), image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyTextResult
            completion(data.words!)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func detectText(_ image: URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectText(.plain), image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyTextResult
            print(data.words)
        }
}
```

</amplify-block>

</amplify-block-switcher>


**注**: IdentifyTextResult の範囲ボックスは、比率で返されます。 画像に表示される個々の認識された単語にバウンディングボックスを配置する場合。 1つのバウンディングボックスのフレームを計算するには、次の方法を使用します。

```swift 
@IBAction func didTapButton(_ sender: Any) {
    let imageURL = URL(string: "https://imageWithText")
    let data = try? Data(contentsOf: imageURL!)
    let image = UIImage(data: data!)
    let imageView = UIImageView(image: image)
    self.view.addSubview(imageView)

    detectText(imageURL!, completion: { words in
        let word = words.first!
        DispatchQueue.main.async {
            let xBoundingBox = word.boundingBox.origin.x * imageView.frame.size.width
            let yBoundingBox = word.boundingBox.origin.y * imageView.frame.size.height
            let widthBoundingBox = word.boundingBox.size.width * imageView.frame.size.width
            let heightBoundingBox = word.boundingBox.size.height * imageView.frame.size.height
            let boundingBox = UIView(frame: CGRect(x: xBoundingBox, y: yBoundingBox, width: widthBoundingBox, height: heightBoundingBox))
            boundingBox.backgroundColor = .red
            imageView.addSubview(boundingBox)
        }
    })
}
```
さらに、Rekognitionの場所(0,0)が左上に、Core MLの場所(0,0)が左下にあることに注意することが重要です。 この問題を処理するために iOS が左上から (0,0) を起動して以来、CoreML バウンディングボックスの y 軸を反転しました。


To get results that utilize on-device capabilities (Core ML), without combining results from the backend, you can use the following to pass into the `options` argument of the `Amplify.Predictions.identify` function.
```swift
let options = PredictionsIdentifyRequest.Options(defaultNetworkPolicy: .offline, pluginOptions: nil)
```

## ドキュメント内のテキストを識別する

Sending in `.form` or `.table` or `.all` will do document analysis as well as text detection to detect tables and forms in a document. See below for an example with `.form`.

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectText(_ image: URL) {
    Amplify.Predictions.identify(type: .detectText(.form), image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyDocumentTextResult
            print(data)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func detectText(_ image: URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectText(.form), image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyDocumentTextResult
            print(data)
        }
}
```

</amplify-block>

</amplify-block-switcher>

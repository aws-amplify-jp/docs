以下の API により、イメージからエンティティ(顔や有名人)を識別することができます。

iOS上でエンティティを識別するために、AWSバックエンドサービスとAppleのオンデバイスCore ML [Vision Framework](https://developer.apple.com/documentation/vision) を使用して、最も正確な結果を提供します。 デバイスがオフラインの場合は、Core MLからのみ結果を返します。 一方、AWSサービスに接続できる場合。 サービスとコアMLの両方からユニオン結果を返します。 バックエンドサービスとCore MLの切り替えは、追加の設定なしに自動的に行われます。

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
❯ Identify Entities
  Identify Labels

? Provide a friendly name for your resource
    <Enter a friendly name here>

? Would you like use the default configuration? (Use arrow keys)
❯ Default Configuration
  Advanced Configuration

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

クラウドでリソースを作成するには、 `増幅プッシュ` を実行してください


## API の操作

In order to match entities from a pre-created [Amazon Rekognition Collection](https://docs.aws.amazon.com/rekognition/latest/dg/collections.html), ensure that both `collectionId` and `maxEntities` are set in your `amplifyconfiguration.json` file. The value of `collectionId` should be the name of your collection that you created either with the CLI or the SDK. The value of `maxEntities` should be a number greater than `0` or less than `51` (50 is the max number of entities Rekognition can detect from a collection). If both `collectionId` and `maxEntities` do not have valid values in the `amplifyconfiguration.json` file, then this call will just detect entities in general with facial features, landmarks, etc. Bounding boxes for entities are returned as ratios so make sure if you would like to place the bounding box of your entity on an image that you multiple the x by the width of the image, the y by the height of the image, and both height and width ratios by the image's respective height and width.

次のコードサンプルを使用して、アプリ内でRekognition Collectionからエンティティ一致を特定できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectEntities(_ image: URL) {
    Amplify.Predictions.identify(type: .detectEntities, image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyEntityMatchesResult
            print(data.entities)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func detectEntities(_ image: URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectEntities, image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyEntityMatchesResult
            print(data.entities)
        }
}
```

</amplify-block>

</amplify-block-switcher>

顔の特徴、ランドマークなどの一般的なエンティティを検出するには、次の呼び出しパターンを使用できます。 結果は `IdentifyEntityResult`にマッピングされます。例えば:

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectEntities(_ image: URL) {
    Amplify.Predictions.identify(type: .detectEntities, image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyEntitiesResult
            print(data.entities)
        case let .failure(error):
            print(error)
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func detectEntities(_ image: URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectEntities, image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyEntitiesResult
            print(data.entities)
        }
}
```

</amplify-block>

</amplify-block-switcher>

### 有名人を検出

To detect celebrities you can pass in `.detectCelebrity` in the `type:` field. Results are mapped to `IdentifyCelebritiesResult`. For example:

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func detectCelebs(_ image: URL) {
    Amplify.Predictions.identify(type: .detectCelebrity, image: image) { event in
        switch event {
        case let .success(result):
            let data = result as! IdentifyCelebritiesResult
            if let detectedCeleb = data.celebrities.first {
                print("Celebrity Name: \(detectedCeleb.metadata.name)")
            }
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
func detectCelebs(_ image: URL) -> AnyCancellable {
    Amplify.Predictions.identify(type: .detectCelebrity, image: image)
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print(error)
            }
        }
        receiveValue: { result in
            let data = result as! IdentifyCelebritiesResult
            if let detectedCeleb = data.celebrities.first {
                print("Celebrity Name: \(detectedCeleb.metadata.name)")
            }
            print(result)
        }
}
```

</amplify-block>

</amplify-block-switcher>

よく知られている有名人の画像のURLを渡した結果として、 それに対応する有名人の名前と追加のメタデータが表示されます

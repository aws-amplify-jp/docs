
iOS 用のデフォルトの Amplify ライブラリは iOS 11 以降をサポートしており、 `結果` コールバックに結果を返すAPIが以下のように出荷されます。

```swift
Amplify.DataStore.save(Post(title: "My Post", content: "My content", ...), completion: { result in
    switch result {
        case .success:
            print("Post saved")
        case .failure(let dataStoreError):
            print("An error occurred saving the post: \(dataStoreError)")
    }
})
```

プロジェクトが iOS 13 以降のプラットフォームサポートを宣言している場合。 Amplifyには、 [](https://developer.apple.com/documentation/combine) パブリッシャーの組み合わせを公開するAPIも用意されています。これにより、使い慣れたパターンを使用することができます:

```swift
Amplify.DataStore.save(Post(title: "My Post", content: "My content"))
    .sink { completion in
        if case .failure(let dataStoreError) = completion {
            print("An error occurred saving the post: \(dataStoreError)")
        }
    }
    receiveValue: { value in
        print("Post saved: \(value)")
    }
```

これは単一の呼び出しではあまり節約されませんが、非同期呼び出しをチェーンするときに大きな可読性の利点を提供します。 標準的な演算子とパブリッシャーを組み合わせることで、複雑な機能を読み取り可能なチャンクに構成できます。

```swift
subscription = Publishers.Zip(
    Amplify.DataStore.save(Person(name: "Rey")),
    Amplify.DataStore.save(Person(name: "Kylo"))
).flatMap { hero, villain in
    Amplify.DataStore.save(EpicBattle(hero: hero, villain: villain))
}.flatMap { battle in
    Publishers.Zip(
        Amplify.DataStore.save(
            Outcome(of: battle)
        ),
        Amplify.DataStore.save(
            Checkpoint()
        )
    )
}.sink { completion in
    if case .failure(let dataStoreError) = completion {
        print("An error occurred in a preceding operation: \(dataStoreError)")
    }
}
receiveValue: { _ in
    print("Everything completed successfully")
}
```

これらの依存する呼び出しをコールバックでネストするのと比較すると、これははるかに読みやすいパターンを提供します。

**注**: 結合パブリッシャーが `` サブスクリプションをシンクしないことを忘れないでください。 コード内でサブスクリプションへの参照を維持する必要があります。たとえば、囲まれた型のインスタンス変数などです。

```swift
struct MyAppCode {
    var subscription AnyCancellable?

    ...

    func doSomething() {
        // Subscription is retained by the `self.subscription` instance
        // variable, so the `sink` code will be executed
        subscription = Amplify.DataStore.save(Person(name: "Rey"))
            .sink(...)
    }
}
```

## インストール

統合サポートを有効にするために追加の作業は必要ありません。 iOS 13のデプロイメントターゲットを宣言するプロジェクト。 または、呼び出しているカテゴリや API に応じて、適切なメソッドシグネチャとプロパティが自動的に表示されます。

## API比較

Amplify strives to provide an intuitive interface for APIs that expose Combine functionality by overloading the no-Combine API signature, minus the result callbacks. Thus, `Amplify.DataStore.save(_:where:completion:)` has an equivalent Combine-supporting API of `Amplify.DataStore.save(_:where:)`. In most cases, the Result callback `Success` and `Failure` types in standard Amplify APIs translate exactly to the `Output` and `Failure` types of publishers returned from Combine-supporting APIs.

特定の API の結合パブリッシャーにアクセスする方法は、非同期作業をキャンセルできるかどうかによって異なります。

- **ではない** 操作を返すAPI は、 `AnyPublisher` を API 呼び出しから直接返すだけです。
    ```swift
    let publisher = Amplify.DataStore
        .save(myPost)
    ```

- **を行う** のほとんどの API は、返された操作で `resultPublisher` プロパティを公開します。
    ```swift
    let publisher = Amplify.Predictions
        .convert(textToSpeech: text, options: options)
        .resultPublisher
    ```

### 特別なケース

すべての API が `resultPublisher` パターンにきちんとマッピングされるわけではありません。 この非対称性は、組み合わせとAmplifyを使用する学習の精神的なオーバーヘッドを増加させます。 コールサイトでの使いやすさは学習曲線を補うべきです さらに、Xcode は利用可能なパブリッシャーのプロパティを表示し、必要なパブリッシャーを簡単に見つけることができます。

![画像](~/images/combine-xcode.png)

#### `API.subscribe()`

The `API.subscribe()` method exposes a `subscriptionDataPublisher` for the stream of subscription data, and a `connectionStatePublisher` for the status of the underlying connection. Many apps will only need to use the `subscriptionDataPublisher`, since a closed GraphQL subscription will be reported as a completion on that publisher. The `connectionStatePublisher` exists for apps that need to inspect when the connection initially begins, even if data has not yet been received by that subscription.

#### `Hub.publisher(for:)`

Amplify Hubカテゴリでは、1つのCombine-related APIのみが公開されます: `Hub.publisher(for:)`は、特定のチャンネルのすべてのイベントのパブリッシャーを返します。 その後、標準の組み合わせ` ` フィルター [`フィルター`](https://developer.apple.com/documentation/combine/anypublisher/filter(_:)) 演算子を適用して、気になるイベントのみを検査することができます。

#### `ストレージ` アップロード & ダウンロード操作

Storage upload and download APIs report both completion and overall operation progress. In addition to the typical `resultPublisher` that reports the overall status of the operation, Storage upload and download APIs also have a `progressPublisher` that reports incremental progress when available.

## 操作をキャンセル中

ほとんどのAmplify APIは、インプロセス操作をキャンセルするために使用できるユースケース固有の操作を返します。 iOS 13 以降では、これらのオペレーションにはパブリッシャーが含まれており、アプリに値を報告します。

パブリッシャーへのサブスクリプションのキャンセルは、単にそのパブリッシャーをリリースしますが、基盤となる操作での作業には影響しません。 たとえば、アプリのビューでファイルのアップロードを開始するとします。

```swift
import Combine

class MyView: UIView {

// Declare instance properties to retain the operation and subscription cancellables
var uploadOperation: StorageUploadFileOperation?
var resultSink: AnyCancellable?
var progressSink: AnyCancellable?

// Then when you start the operation, assign those instance properties
func uploadFile() {
    uploadOperation = Amplify.Storage.uploadFile(key: fileNameKey, local: filename)

    resultSink = uploadOperation
        .resultPublisher
        .sink(
            receiveCompletion: { completion in
                if case .failure(let storageError) = completion {
                    handleUploadError(storageError)
                }
            }, receiveValue: { print("File successfully uploaded: \($0)") }
        )

    progressSink = uploadOperation
        .progressPublisher
        .sink{ print("\($0.fractionCompleted * 100)% completed") }
}
```

After you call `uploadFile()` as above, your containing class retains a reference to the operation that is actually performing the upload, as well as Combine `AnyCancellable`s that can be used to stop receiving result and progress events.

To cancel the upload (for example, in response to the user pressing a **Cancel** button), you simply call `cancel()` on the upload operation:

```swift
func cancelUpload() {
    // `resultPublisher` と `progressPublisher`
    uploadOperation.cancel()
}
```

If you navigate away from `MyView`, the `uploadOperation`, `resultSink`, and `progressSink` instance variables will be released, and you will no longer receive progress or result updates on those sinks, but Amplify will continue to process the upload operation.

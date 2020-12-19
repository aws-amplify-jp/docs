リアルタイムクライアントを作成するための変更を購読します。

サブスクリプションの有効期間は単一の機能の有効期間より長くなりますので。 クラスの上部にインスタンス変数を作成できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
var subscription: GraphQLSubscriptionOperation<Todo>?
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
var subscription: GraphQLSubscriptionOperation<Todo>?
var dataSink: AnyCancellable?
```

</amplify-block>

</amplify-block-switcher>


作成の更新をリッスンするには、次のコードサンプルを使用できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func createSubscription() {
    subscription = Amplify.API.subscribe(request: .subscription(of: Todo.self, type: .onCreate), valueListener: { (subscriptionEvent) in
        switch subscriptionEvent {
        case .connection(let subscriptionConnectionState):
            print("Subscription connect state is \(subscriptionConnectionState)")
        case .data(let result):
            switch result {
            case .success(let createdTodo):
                print("Successfully got todo from subscription: \(createdTodo)")
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        }
    }) { result in
        switch result {
        case .success:
            print("Subscription has been closed successfully")
        case .failure(let apiError):
            print("Subscription has terminated with \(apiError)")
        }
    }
}
```
</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func createSubscription() {
    subscription = Amplify.API.subscribe(request: .subscription(of: Todo.self, type: .onCreate))
    dataSink = subscription?.subscriptionDataPublisher.sink {
        if case let .failure(apiError) = $0 {
            print("Subscription has terminated with \(apiError)")
        } else {
            print("Subscription has been closed successfully")
        }
    }
    receiveValue: { result in
        switch result {
        case .success(let createdTodo):
            print("Successfully got todo from subscription: \(createdTodo)")
        case .failure(let error):
            print("Got failed result with \(error.errorDescription)")
        }
    }
}
```

</amplify-block>

</amplify-block-switcher>

### アップデートの購読を解除

#### リスナー（iOS 11+)

更新を解除するには、サブスクリプションで `cancel()` を呼び出すことができます。

```swift
func cancelSubscription() {
    // サブスクリプションリスナーが終わったらキャンセルする
    subscription?.cancel();
}
```

#### 結合 (iOS 13以上)

`subscribe()` API のフレーバーを結合します。 下流の結合サブスクリプションまたはGraphQLサブスクリプション全体のみをキャンセルすることができます。

Calling `cancel()` on the subscription will disconnect the subscription from the backend. Any downstream subscribers will also be cancelled. On the other hand, calling `cancel()` on the Combine subscriber (e.g., the `AnyCancellable` returned from `sink()` will cause that Combine subscriber to stop receiving updates, but any other attached subscribers will continue to receive subscription data. For example:

```swift
let subscription = Amplify.API.subscribe(...)
let allUpdates = subscription.subscriptionDataPublisher.sink(...)
let filteredUpdates = subscription.subscriptionDataPublisher.filter{...}.sink(...)

allUpdates.cancel() // subscription is still connected,
                    // filteredUpdates will still receive data

subscription.cancel() // subscription is now disconnected
                      // filteredUpdates will no longer receive data
```
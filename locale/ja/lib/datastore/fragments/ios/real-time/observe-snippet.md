```swift
// In your type declaration, declare a cancellable to hold onto the subscription
var postsSubscription: AnyCancellable?

// Then in the body of your code, subscribe to the publisher
func subscribeToPosts() {
    postsSubscription = Amplify.DataStore.publisher(for: Todo.self)
        .sink {
            if case let .failure(error) = $0 {
                print("Subscription received error - \(error.localizedDescription)")
            }
        }
        receiveValue: { changes in
            // handle incoming changes
            print("Subscription received mutation: \(changes)")
        }
}

// Then, when you're finished observing, cancel the subscription
func unsubscribeFromPosts() {
    postsSubscription?.cancel()
}
```

<amplify-callout>

このAPIは [融合フレームワーク](https://developer.apple.com/documentation/combine)の上に構築されているため、iOS 13以降でしか利用できません。

`publisher(for:)` API は標準 [AnyPublisher](https://developer.apple.com/documentation/combine/anypublisher) を返します。

</amplify-callout>

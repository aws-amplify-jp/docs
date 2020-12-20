特定の投稿IDでコメントを作成するためのカスタムサブスクリプションを作成できるようになりました:

```swift
extension GraphQLRequest {
    static func onCreateComment(byPostId id: String) -> GraphQLRequest<Comment> {
        let operationName = "onCommentByPostId"
        let document = """
        subscription onCreateCommentByPostId($id:ID!) {
          \(operationName)(postCommentsId: $id) {
            content
            id
            postCommentsId
          }
        }
        """
        return GraphQLRequest<Comment>(document: document,
                                    variables: ["id": id],
                                    responseType: Comment.self,
                                    decodePath: operationName)
    }
}
```

サブスクリプションの有効期間は単一の機能の有効期間より長くなりますので。 クラスの上部にインスタンス変数を作成できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
var subscription: GraphQLSubscriptionOperation<Comment>?
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
var subscription: GraphQLSubscriptionOperation<Comment>?
var dataSink: AnyCancellable?
```

</amplify-block>

</amplify-block-switcher>

post IDを使用して特定のポストを使用して作成の更新を聞くには、次のコードサンプルを使用できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func createSubscription() {
    subscription = Amplify.API.subscribe(request: .onCreateComment(byPostId: "12345"), valueListener: { (subscriptionEvent) in
        switch subscriptionEvent {
        case .connection(let subscriptionConnectionState):
            print("Subscription connect state is \(subscriptionConnectionState)")
        case .data(let result):
            switch result {
            case .success(let createdComment):
                print("Successfully got comment from subscription: \(createdComment)")
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        }
    }, completionListener: { (result) in
        switch result {
        case .success:
            print("Subscription has been closed successfully")
        case .failure(let apiError):
            print("Subscription has terminated with \(apiError)")
        }
    })
}
```
</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func createSubscription() {
    subscription = Amplify.API.subscribe(request: .onCreateComment(byPostId: "12345"))
    dataSink = subscription?.subscriptionDataPublisher.sink {
        if case let .failure(apiError) = $0 {
            print("Subscription has terminated with \(apiError)")
        } else {
            print("Subscription has been closed successfully")
        }
    }
    receiveValue: { result in
        switch result {
        case .success(let createdComment):
            print("Successfully got comment from subscription: \(createdComment)")
        case .failure(let error):
            print("Got failed result with \(error.errorDescription)")
        }
    }
}
```

</amplify-block>

</amplify-block-switcher>

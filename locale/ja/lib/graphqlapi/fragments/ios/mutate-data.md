## 変更を実行

クライアントが設定されたので、 `Amplify.API.mutate` を使用して GraphQL 変更を実行して、データを作成、更新、および削除できます。

<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func updateTodo() {
    // Retrieve your Todo using Amplify.API.query
    var todo = Todo(name: "my first todo", description: "todo description")
    todo.description = "updated description"
    Amplify.API.mutate(request: .update(todo)) { event in
        switch event {
        case .success(let result):
            switch result {
            case .success(let todo):
                print("Successfully created todo: \(todo)")
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        case .failure(let error):
            print("Got failed event with error \(error)")
        }
    }
}
```
</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func updateTodo() -> AnyCancellable {
    // Retrieve your Todo using Amplify.API.query
    var todo = Todo(name: "my first todo", description: "todo description")
    todo.description = "updated description"
    let sink = Amplify.API.mutate(request: .update(todo))
        .resultPublisher
        .sink {
            if case let .failure(error) = $0 {
                print("Got failed event with error \(error)")
            }
        }
        receiveValue: { result in
            switch result {
            case .success(let todo):
                print("Successfully created todo: \(todo)")
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        }
    return sink
}
```

</amplify-block>

</amplify-block-switcher>
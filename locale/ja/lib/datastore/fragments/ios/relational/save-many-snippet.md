<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
let post = Post(title: "My post with comments",
                rating: 5,
                status: .active)
let editor = User(username: "Nadia")

Amplify.DataStore.save(post) { postResult in
    switch postResult {
    case .failure(let error):
        print("Error adding post - \(error.localizedDescription)")
    case .success:
        Amplify.DataStore.save(editor) { editorResult in
            switch editorResult {
            case .failure(let error):
                print("Error adding user - \(error.localizedDescription)")
            case .success:
                let postEditor = PostEditor(post: post, editor: editor)
                Amplify.DataStore.save(postEditor) { postEditorResult in
                    switch postEditorResult {
                    case .failure(let error):
                        print("Error saving postEditor - \(error.localizedDescription)")
                    case .success:
                        print("Saved user, post and postEditor!")
                    }
                }
            }
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
let post = Post(title: "My post with comments",
                rating: 5,
                status: .active)
let editor = User(username: "Nadia")

let sink = Amplify.DataStore.save(post)
    .flatMap { _ in Amplify.DataStore.save(editor) }
    .flatMap { _ in Amplify.DataStore.save(PostEditor(post: post, editor: editor)) }
    .sink {
        if case let .failure(error) = $0 {
            print("Error saving post, user and postEditor: \(error.localizedDescription)")
        }
    }
    receiveValue: { _ in
        print("Saved user, post and postEditor!")
    }
```

</amplify-block>

</amplify-block-switcher>

<amplify-callout>

この例では、複数の依存する持続性操作の複雑さを説明します。 コールバックモデルは柔軟性がありますが、そのようなシナリオに対処する際にはいくつかの課題があります。 アプリがiOS 13以上に対応している場合は、Combineモデルを使用することをお勧めします。 そうでない場合は、コードを簡素化するために複数の関数を使用することをお勧めします。

</amplify-callout>

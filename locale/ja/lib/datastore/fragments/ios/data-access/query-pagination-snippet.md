<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
Amplify.DataStore.query(Post.self, paginate: .page(0, limit: 100)) {
    // result を処理
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
let sink = Amplify.DataStore.query(Post.self, paginate: .page(0, limit: 100)).sink {
    // result を処理
}
```

</amplify-block>

</amplify-block-switcher>

`paginate` 引数は、 [`QueryPaginationInput`](https://aws-amplify.github.io/amplify-ios/docs/Structs/QueryPaginationInput.html)型のオブジェクトを取ります。 そのオブジェクトは以下のファクトリ関数で作成できます。

- [`.page(_ page: UInt, limit: UInt)`](https://aws-amplify.github.io/amplify-ios/docs/Structs/QueryPaginationInput.html#/s:7Amplify20QueryPaginationInputV4page_5limitACSu_SutFZ): the page number (starting at `0`) and the page size, defined by `limit` (defaults to `100`)
- [`.firstPage`](https://aws-amplify.github.io/amplify-ios/docs/Structs/QueryPaginationInput.html#/s:7Amplify20QueryPaginationInputV9firstPageACvpZ): `.page(0, limit: 100) への慣用的なショートカット`
- [`.firstResult`](https://aws-amplify.github.io/amplify-ios/docs/Structs/QueryPaginationInput.html#/s:7Amplify20QueryPaginationInputV11firstResultACvpZ): `.page(0, limit: 1) の慣用的なショートカット`

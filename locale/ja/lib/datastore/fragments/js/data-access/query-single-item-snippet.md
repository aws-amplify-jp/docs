### 単一の項目についてクエリ中

単一のアイテムをクエリするには、アイテムの ID をクエリの 2 番目の引数として渡します。

```js
const post = await DataStore.query(Post, "1234567");
```
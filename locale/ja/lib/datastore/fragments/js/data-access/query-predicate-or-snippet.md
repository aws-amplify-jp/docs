これを `または` 文にしたい場合は、組み合わせた述語を `c => c.or(...)` でラップします。

```js
const posts = await DataStore.query(Post, c => c.or(
  c => c.rating("gt", 4).status("eq", PostStatus.PUBLISHED)
));
```

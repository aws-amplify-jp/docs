```js
const comments = (await DataStore.query(Comment)).filter(c => c.postID === "123");
```

その他の方法:

```js
const post = await DataStore.query(Post, "123");
const comments = (await DataStore.query(Comment)).filter(c => c.postID === post.id);
```

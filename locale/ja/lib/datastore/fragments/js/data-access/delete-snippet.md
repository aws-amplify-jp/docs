```js
const todelete = await DataStore.query(Post, "1234567");
DataStore.delete(todelete);
```

複数の項目を削除するために述語演算子を渡すこともできます。例えば、すべての下書きを削除します。

```js
await DataStore.delete(Post, post => post.status("eq", PostStatus.DRAFT));
```

Additionally you can perform a conditional delete, for instance only delete **if** a post is in draft status by passing in an instance of a model:

```js
const todelete = await DataStore.query(Post, "123");
DataStore.delete(todelete, post => post.status("eq", PostStatus.DRAFT));
```

また、モデルのすべてのアイテムを削除するには、 `Predicates.ALL`:

```js
await DataStore.delete(Post, Predicates.ALL);
```

以下では、 `"123"` の `id`のインスタンスをクエリし、見つかった場合は削除します。

```dart
(await Amplify.DataStore.query(Post.classType, where: Post.ID.eq("123")))
    .forEach((element) async {
  try {
    await Amplify.DataStore.delete(element);
    print("Deleted a post");
  } catch (e) {
    print("Delete failed: " + e);
  }
});
```

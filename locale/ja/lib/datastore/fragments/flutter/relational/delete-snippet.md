```dart
(await Amplify.DataStore.query(Post.classType, where: Post.ID.eq("123")))
    .forEach((要素) async {
  await Amplify.DataStore.delete(element);
  print("Deleted a post");
});
```

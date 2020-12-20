```dart
List<Posts> = wait Amplify.DataStore.query(Post.classType, where: Post.RATING.ge(4));
```

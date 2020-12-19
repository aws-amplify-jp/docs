指定されたプレフィックスの下にアップロードされたすべてのオブジェクトを一覧表示できます。これはすべての公開ファイルを一覧表示します:

```dart
try {
  ListResult = await Amplify.Storage.list();
} catch (e) {
  print(e.toString());
}
```

オプションを渡すことによってプライベートまたは保護されたファイルをリストすることができる。 例えば、ID `otherUserID` によって識別されたユーザーが所有するすべての保護されたファイルを一覧表示するには:

```dart
try {
  S3ListOptions options = S3ListOptions(
    targetIdentityId: "otherUserID",
    accessLevel: StorageAccessLevel.protected
  );

  ListResult res = await Amplify.Storage.list(
    options: options
  );
} catch (e) {
  print(e.toString());
}
```

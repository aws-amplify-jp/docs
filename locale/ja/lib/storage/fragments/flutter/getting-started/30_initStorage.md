Amplify Authとストレージのカテゴリを初期化するには、カテゴリごとに `Amplify.addPlugin()` メソッドを呼び出します。初期化を完了するには、 `Amplify.configure()` を呼び出します。

```dart
// Add this line, to include the Auth plugin.
AmplifyAuthCognito auth = AmplifyAuthCognito();
AmplifyStorageS3 storage = AmplifyStorageS3();
amplify.addPlugin(
    authPlugins: [auth], 
    storagePlugins: [storage]
);
```
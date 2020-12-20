Authプラグインと他のプラグインを追加するには、 **前提条件** セクションで説明したように追加します。

```dart
// Add this line, to include the Auth plugin.
AmplifyAuthCognito auth = AmplifyAuthCognito();
amplify.addPlugin(authPlugins: [auth]);
```

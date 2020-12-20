### API プラグインを追加

クラウド同期は [API カテゴリ](~/lib/graphqlapi/getting-started.md) を使用します。したがって、最初のステップは API プラグインを設定します。

`Podfile` に以下のプラグインの依存関係があることを確認してください。

```ruby
pod 'AmplifyPlugins/AWSAPIPlugin'
```

次に、Amplify初期化コードにプラグインを追加し、以前に追加した `AWSDataStorePlugin` と一緒に追加します。

```swift
try Amplify.add(plugin: AWSAPIPlugin())
```

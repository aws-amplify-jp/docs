## Amplifyライブラリのインストール

Amplify DataStoreをアプリケーションにインストールするには、 `AmplifyPlugins/AWSDataStorePlugin`を追加します。 `Podfile` は次のようになります:

```ruby
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'AmplifyPlugins/AWSDataStorePlugin'
  pod 'AmplifyPlugin'
end
```

ポッドをインストール、ダウンロード、解決するには、 **コマンド** を実行します。

```bash
pod install --repo-update
```

Now you can **open your project** by opening the `.xcworkspace` file using the following command:

```bash
xed .
```

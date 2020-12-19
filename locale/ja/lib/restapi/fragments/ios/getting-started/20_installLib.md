To install the Amplify API and Authentication to your application, **add both `AmplifyPlugins/AWSAPIPlugin` and `AmplifyPlugins/AWSCognitoAuthPlugin` to your `Podfile`**.  Your `Podfile` should look similar to:

```ruby
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'AmplifyPlugins/AWScognitoAuthPlugin'
  pod 'AmplifyPlugins/AWSAPIPlugin'
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
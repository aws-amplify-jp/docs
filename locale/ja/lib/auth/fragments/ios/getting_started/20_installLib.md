To install Amplify Auth to your application, **add `AmplifyPlugins/AWSCognitoAuthPlugin` to your `Podfile`**.  Your `Podfile` should look similar to:

```ruby
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'Amplify'
  pod 'AmplifyPlugins/AWScognitoAuthPlugin'
end
```

ポッドをインストール、ダウンロード、解決するには、 **コマンド** を実行します。

```ruby
pod install --repo-update
```

Now you can **open your project** by opening the `.xcworkspace` file using the following command:

```ruby
xed .
```
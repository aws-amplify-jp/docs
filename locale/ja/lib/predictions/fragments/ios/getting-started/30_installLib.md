To install the libraries required to translating text, **add both `AWSPredictionsPlugin` and `CoreMLPredictionsPlugin` to your `Podfile`**.  Your `Podfile` should look similar to:

```ruby
target 'MyAmplifyApp' do
  use_frameworks!
  pod 'AmplifyPlugins/AWScognitoAuthPlugin'
  pod 'AmplifyPlugin'
  pod 'AWSPredictionsPlugin'
  pod 'CoreMLPredictionsPlugin'
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
<!--TODO Update AWSmobile Client -> Auth -->
To install the Amplify Storage and Authentication to your application, **add both `AmplifyPlugins/AWSS3StoragePlugin` and `AmplifyPlugins/AWSCognitoAuthPlugin` to your `Podfile`**.  Your `Podfile` should look similar to:

```ruby
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'AmplifyPlugins/AWSS3StoragePlugin'
  pod 'AmplifyPlugins/AWSCognitoAuthPlugin'
  pod 'AmplifyPlugin/AWSCognitoAuthPlugin'
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
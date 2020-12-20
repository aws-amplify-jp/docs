To install the Amplify Analytics and Authentication to your application, **add both "AmplifyPlugins/AWSPinpointAnalyticsPlugin" and "AmplifyPlugins/AWSCognitoAuthPlugin" to your `Podfile`** (Because IAM credential is required to access AWS Pinpoint Service, `"AWSCognitoAuthPlugin"` also needs to be installed). Your `Podfile` should look similar to:

```bash
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'AmplifyPlugins/AWSPinpointAnalyticsPlugin'
  pod 'AmplifyPlugins/AWSCognitoAuthPlugin'
  pod 'AmplifyPlugin/AWScognitoAuthPlugin'
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
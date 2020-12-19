Amplify CLI は、 [Amazon API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/) および [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/) を使用して REST API とハンドラをデプロイします。

API カテゴリは、SDK コードの生成を実行します。 `AWSMobileClient` と一緒に使用した場合、サービス認証が `AWS_IAM` に設定されている場合、または [Cognito User Pools Authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html) に設定されている場合、Amazon API Gateway の署名済みリクエストを作成するために使用できます。

## 新しい REST API を作成

In a terminal window, navigate to your project folder (the folder that contains your app `.xcodeproj` file), and add the SDK to your app.

```console
cd ./YOUR_PROJECT_FOLDER
増幅して api を追加
```

プロンプトが表示されたら、次のオプションを選択します。

```console
> REST
> Create a new Lambda function
> Serverless express function
> Restrict API access? Yes
> Who should have access? Authenticated and Guest users
```

API の設定が完了すると、CLI はこのカテゴリのローカル CLI メタデータを設定したことを確認するメッセージを表示します。 これを確認するには、 `増幅ステータス`を実行します。最後に、変更をクラウドにデプロイします：

```bash
push を増幅する
```

## バックエンドに接続

`AWSAPIPlugin` をポッドファイルに追加します:

```ruby
target :'YOUR-APP-NAME' do
  use_frameworks!

  pod 'Amplify'
  pod 'AWSPluginsCore'
  pod 'AmplifyPlugins/AWSAPIPlugin'
end
```

Run `pod install --repo-update` and then add `awsconfiguration.json` and `amplifyconfiguration.json` file to your project **(File->Add Files to ..->Add)** and then build your project, ensuring there are no issues.

アプリに次のコードを追加します。

```swift                                
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    AWSMobileClient.default().initialize { (userState, error) in
        guard error == nil else {
            print("Error initializing AWSMobileClient. Error: \(error!.localizedDescription)")
            return
        }
        guard let userState = userState else {
            print("userState is unexpectedly empty initializing AWSMobileClient")
            return
        }

        print("AWSMobileClient initialized, userstate: \(userState)")
    }

    // Amplify section
    let apiPlugin = AWSAPIPlugin()
    try! Amplify.add(plugin: apiPlugin)
    try! Amplify.configure()
    print("Amplify initialized")

    return true
}
```

## IAM 認証

アプリケーションからAPI Gatewayエンドポイントを呼び出すには、AWS IAM認証の場合は、認証セクションの概要に従って `AWSMobileClient` を使用します。

**リンクではなくここに許可モードが含まれるように更新してください**

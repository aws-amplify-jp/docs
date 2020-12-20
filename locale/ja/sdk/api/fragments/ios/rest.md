## 概要

Amplify CLI は、 [Amazon API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/) および [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/) を使用して REST API とハンドラをデプロイします。

API カテゴリは、SDK コードの生成を実行します。 `AWSMobileClient` と一緒に使用した場合、サービス認証が `AWS_IAM` に設定されている場合、または [Cognito User Pools Authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html) に設定されている場合、Amazon API Gateway の署名済みリクエストを作成するために使用できます。

See [the authentication section for more details](~/sdk/auth/how-it-works.md) for using the `AWSMobileClient` in your application.

## バックエンドを設定

In a terminal window, navigate to your project folder (the folder that contains your app `.Xcodeproj` file), and add the SDK to your app.

```bash
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

デプロイが完了すると、 `generated-src` というフォルダがフォルダディレクトリに追加されます。 これは、次のセクションでプロジェクトに追加するクライアント SDK です。

## バックエンドに接続

`AWSPIGateway` をポッドファイルに追加:

```ruby

    target :'YOUR-APP-NAME' do
      use_frameworks!

         # API 用
         pod 'AWSIGateway'
         # other pods
    end
```

Run `pod install --repo-update` and then add the `generated-src` folder and `awsconfiguration.json` file to your project **(File->Add Files to ..->Add)** and then build your project, ensuring there are no issues.

Next, set the bridging header for Swift in your project settings. Double-click your project name in the Xcode Project Navigator, choose the Build Settings tab and search for  `Objective-C Bridging Header`. Enter `generated-src/Bridging_Header.h`

This is needed because the AWS generated code has some Objective-C code which requires bridging to be used for Swift. If you already have a bridging header in your app, you can just append an extra line to it: `#import "AWSApiGatewayBridge.h"` instead of above step.

The generated files determine the name of your client when making API calls. In the `generated-src` folder, files ending with name `*Client.swift` are the names of your client (without .swift extension). The path of the client code file is:

**./generated-src/YOUR_API_RESOURCE_NAME+YOUR_APP_NAME+Client.swift**

So, for an app named `useamplify` with an API resource named `xyz123`, the path of the code file might be **./generated-src/xyz123useamplifyabcdClient.swift**. The API client name would be `xyz123useamplifyabcdClient` and you would use it in your code with `xyz123useamplifyabcdClient.registerClient()` and `xyz123useamplifyabcdClient.client()`.


`amplify status`を実行して、API のリソース名を探します。 次のセクションで API を呼び出すときに使用する API クライアント名をコピーします。

### IAM 認証

To invoke an API Gateway endpoint from your application, import `AWSAPIGateway` and use the generated client class, model, and resource paths as in the below example with `YOUR_API_CLIENT_NAME` replaced from the previous section. For AWS IAM authorization use the `AWSMobileClient` as outlined in [the authentication section](~/sdk/auth/how-it-works.md).

```swift
import AWSAPIGateway
import AWSMobileClient

  // ViewController or application context . . .

    func doInvokeAPI() {
         // change the method name, or path or the query string parameters here as desired
         let httpMethodName = "POST"
         // change to any valid path you configured in the API
         let URLString = "/items"
         let queryStringParameters = ["key1":"{value1}"]
         let headerParameters = [
             "Content-Type": "application/json",
             "Accept": "application/json"
         ]

         let httpBody = "{ \n  " +
                 "\"key1\":\"value1\", \n  " +
                 "\"key2\":\"value2\", \n  " +
                 "\"key3\":\"value3\"\n}"

         // Construct the request object
         let apiRequest = AWSAPIGatewayRequest(httpMethod: httpMethodName,
                 urlString: URLString,
                 queryParameters: queryStringParameters,
                 headerParameters: headerParameters,
                 httpBody: httpBody)

        // Create a service configuration
        let serviceConfiguration = AWSServiceConfiguration(region: AWSRegionType.USEast1,
              credentialsProvider: AWSMobileClient.default())

        // Initialize the API client using the service configuration
        xyz123useamplifyabcdClient.registerClient(withConfiguration: serviceConfiguration!, forKey: "CloudLogicAPIKey")

        // Fetch the Cloud Logic client to be used for invocation
        let invocationClient = xyz123useamplifyabcdClient.client(forKey: "CloudLogicAPIKey")

        invocationClient.invoke(apiRequest).continueWith { (task: AWSTask) -> Any? in
                 if let error = task.error {
                     print("Error occurred: \(error)")
                     // Handle error here
                     return nil
                 }

                 // Handle successful result here
                 let result = task.result!
                 let responseString = String(data: result.responseData!, encoding: .utf8)

                 print(responseString)
                 print(result.statusCode)

                 return nil
             }
         }
```

アプリケーションコードから `self.doInvokeAPI()` でこのメソッドを呼び出すことができます。

### Cognitoユーザープールの承認

When invoking an API Gateway endpoint with Cognito User Pools authorizer, you can leverage the `AWSMobileClient` to dynamically refresh and pass tokens to your endpoint. Using the example from the previous section, update the `doInvokeAPI()` so that it takes an argument of `token:String`. Next, add a header of `"Authorization" : token` and set the service configuration to have `credentialsProvider: nil`. Finally, overload the `doInvokeAPI()` with a new definition that gets the Cognito User Pools token from the `AWSMobileClient` as below:

```swift
//New overloaded function that gets Cognito User Pools tokens
func doInvokeAPI(){
    AWSMobileClient.default().getTokens { (tokens, err) in
        self.doInvokeAPI(token: tokens!.idToken!.tokenString!)
    }
}

//Updated function with arguments and code updates
func doInvokeAPI(token:String) {

    let headerParameters = [
            //other headers
            "Authorization" : token
    ]

    let serviceConfiguration = AWSServiceConfiguration(region: AWSRegionType.USEast1,
                                                           credentialsProvider: nil)

}
```

そうすれば、selfでこのメソッドを呼び出すことができます。 アプリケーションコードから oInvokeAPI() `` を受け取り、Cognito User Pools から IdToken を `Authorization` ヘッダーとして渡します。

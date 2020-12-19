Amplify CLI は、 [Amazon API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/) および [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/) を使用して REST API とハンドラをデプロイします。

The API category will perform SDK code generation which when used with the `AWSMobileClient` can be used for creating signed requests for Amazon API Gateway when the service Authorization is set to `AWS_IAM` or when using a [Cognito User Pools Authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html).

アプリケーションの `AWSMobileClient` を使用する詳細については、認証セクションを参照してください。

## 新しい REST API を作成

In a terminal window, navigate to your project folder (the folder that contains your app `.Android Studioproj` file), and add the SDK to your app.

```bash
cd ./YOUR_PROJECT_FOLDER
増幅して api を追加
```

プロンプトが表示されたら、次のオプションを選択します。

```console
$ > REST
$ > Create a new Lambda function
$ > Serverless express function
$ > Restrict API access? Yes
$ > Who should have access? Authenticated and Guest users
```

API の設定が完了すると、CLI はこのカテゴリのローカル CLI メタデータを設定したことを確認するメッセージを表示します。 これを確認するには、 `増幅ステータス`を実行します。最後に、変更をクラウドにデプロイします：

```bash
push を増幅する
```

## API の操作

次に、GETのような `Amplify.API` のHTTP動詞のいずれかを使用して呼び出します。

```kotlin
val options = RestOptions.builder()
    .addPath("/items")
    .addQueryParameters(mapOf("lang" to "en_US"))
    .build()

Amplify.API.get("myAPI", options,
    { Log.i("ApiQuickStart", "GET succeeded: $it") },
    { Log.e("ApiQuickStart", "GET failed.", it) }
)
```

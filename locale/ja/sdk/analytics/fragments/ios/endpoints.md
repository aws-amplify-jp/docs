## アプリケーションにエンドポイントを登録する

ユーザーがセッションを開始したとき (例えば、モバイルアプリを起動するなど) モバイルまたはWebアプリケーションは、Amazon Pinpointで _エンドポイント_ を自動的に登録(または更新)することができます。 エンドポイントは、ユーザーがセッションを開始するデバイスを表します。 デバイスを記述する属性が含まれ、定義したカスタム属性も含めることができます。 エンドポイントは、電子メールアドレスや携帯電話番号など、顧客との通信方法を表すこともできます。

After your application registers endpoints, you can segment your audience based on endpoint attributes. You can then engage these segments with tailored messaging campaigns. You can also use the **Analytics** page in the Amazon Pinpoint console to view charts about endpoint registration and activity, such as **New endpoints** and **Daily active endpoints**.

1 つのユーザ ID を複数のエンドポイントに割り当てることができます。 ユーザ ID は単一のユーザを表し、ユーザ ID を割り当てられた各エンドポイントはユーザのデバイスの 1 つを表します。 エンドポイントにユーザー ID を割り当てると、コンソールでのユーザー アクティビティに関するグラフを表示できます。 例: **デイリーアクティブユーザー** や **月間アクティブユーザー** など。

## カスタムエンドポイント属性の追加

アプリケーションで Amazon Pinpoint クライアントを初期化した後、エンドポイントにカスタム属性を追加できます。

```swift
// Add a custom attribute to the endpoint
if let targetingClient = pinpoint?.targetingClient {
    targetingClient.addAttribute(["science", "politics", "travel"], forKey: "interests")
    targetingClient.updateEndpointProfile()
    let endpointId = targetingClient.currentEndpointProfile().endpointId
    print("Updated custom attributes for endpoint: \(endpointId)")
}
```

## エンドポイントへのユーザー ID の割り当て

次のいずれかを実行して、ユーザー ID をエンドポイントに割り当てます:

* Amazon Cognitoのユーザープールでのユーザー登録とサインインを管理します。
* Amazon Pinpoint クライアントを使用して、Amazon Cognito のユーザプールを使用せずにユーザIDを割り当てます。

Amazon Cognitoのユーザープールは、アプリにサインアップとサインインを簡単に追加できるユーザーディレクトリです。 AWS Mobile SDK for iOS と Android がエンドポイントを Amazon Pinpoint に登録するとき。 Amazon Cognitoは自動的にユーザープールからユーザーIDを割り当てます。 詳細はこちら See [Amazon Pinpoint Analytics with Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-pinpoint-integration.html) in the _Amazon Cognito Developer Guide_.

Amazon Cognitoユーザプールを使用したくない場合 アプリケーションで Amazon Pinpoint クライアントを使用して、エンドポイントにユーザー ID を割り当てることができます。

```swift
if let targetingClient = pinpoint?.targetingClient {
    let endpoint = targetingClient.currentEndpointProfile()
    // Create a user and set its userId property
    let user = AWSPinpointEndpointProfileUser()
    user.userId = "UserIdValue"
    // Assign the user to the endpoint
    endpoint.user = user
    // Update the endpoint with the targeting client
    targetingClient.update(endpoint)
    print("Assigned user ID \(user.userId ?? "nil") to endpoint \(endpoint.endpointId)")
}
```

## エンドポイントの制限

AWS Android SDK for Pinpoint と Amazon Pinpoint エンドポイント API を使用するエンドポイントに適用できる制限は [こちら](https://docs.aws.amazon.com/pinpoint/latest/developerguide/limits.html#limits-endpoint) です。


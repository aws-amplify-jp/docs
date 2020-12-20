Amazon Pinpoint SDKを使用して、使用状況データまたはイベントをPinpointにレポートできます。 セッション時間、ユーザーの購買行動、サインインの試行、必要なカスタムイベントタイプなどの情報を取得するためにイベントを報告できます。

アプリケーションがイベントを報告したら、解析結果を Pinpoint コンソールで確認できます。

ページのチャートには、ユーザーの行動のさまざまな側面のメトリックが表示されます。 詳細については、[ Amazon Pinpoint Analytics](https://docs.aws.amazon.com/pinpoint/latest/userguide/analytics-charts.html) のチャートリファレンス _Amazon Pinpoint User Guide_ を参照してください。</p> 

イベントデータを Pinpoint 以外で分析して保存するには、Pinpoint を設定して、Amazon Kinesis にデータをストリーミングできます。 詳しい情報については、 [Amazon Pinpoint Events to Kinesis](https://docs.aws.amazon.com/pinpoint/latest/developerguide/analytics-streaming.html) を参照してください。

AWS Mobile SDK と AWS Amplify JavaScript ライブラリを使用することで、Pinpoint API を呼び出して以下の種類のイベントを報告できます。



## セッションイベント

ユーザーがいつ、どのくらいの頻度でアプリを開いて閉じるかを示します。

After your application reports session events, use the **Analytics** page in the Amazon Pinpoint console to view charts for **Sessions, Daily active endpoints, 7-day retention rate**, and more.

上記のように、iOS アプリと Pinpoint SDK を統合すると、これらが自動的に記録されます。



## カスタムイベント

カスタムイベントタイプを割り当てることで定義する非標準イベントです。カスタム属性とメトリックをカスタムイベントに追加できます。

On the **Analytics** page in the console, the **Events** tab displays metrics for all custom events that are reported by your app. Use graphs of your custom usage event data in the Pinpoint console. Visualize how your users' behavior aligns with a model you design using [Amazon Pinpoint Funnel Analytics](https://docs.aws.amazon.com/pinpoint/latest/userguide/analytics-funnels.html), or use [stream the data](https://docs.aws.amazon.com/pinpoint/latest/userguide/analytics-streaming.html) for deeper analysis.

以下の手順を使用して、アプリケーションの Pinpoint カスタム分析を実装します。



```swift
// You can add this function in desired part of your app.
// It will be used to log events to the backend.
func logEvent() {
    if let analyticsClient = pinpoint?.analyticsClient {
        let event = analyticsClient.createEvent(withEventType: "EventName")
        event.addAttribute("DemoAttributeValue1", forKey: "DemoAttribute1")
        event.addAttribute("DemoAttributeValue2", forKey: "DemoAttribute2")
        event.addMetric(NSNumber(value: arc4random() % 65535), forKey: "EventName")
        analyticsClient.record(event)
        analyticsClient.submitEvents()
    }
}
```


Build, run, and use your app. Then, view your custom events on the `Events` tab of the Pinpoint console (choose `Analytics`>`Events`). Look for the name of your event in the `Events` menu.



## 収益化イベント

アプリケーションによって生成された収益とユーザーによって購入されたアイテムの数を報告します。

**Analytics** ページでは、 **収益** タブに、 **収益、支払いユーザー、売却ユニット**などのチャートが表示されます。

以下の手順を使用して、アプリケーションの Pinpoint 収益化分析を実装します。



```swift
func sendMonetizationEvent() {
    if let analyticsClient = pinpoint?.analyticsClient {
        let event = analyticsClient.createVirtualMonetizationEvent(
            withProductId: "DEMO_PRODUCT_ID",
            withItemPrice: 1.00,
            withQuantity: 1,
            withCurrency: "USD"
        )
        analyticsClient.record(event)
        analyticsClient.submitEvents()
    }
}
```




## 認証イベント

ユーザーがアプリケーションでどのくらいの頻度で認証するかを示します。

**Analytics** ページでは、 **Users** タブに、 **サインイン、サインアップ、および認証失敗** のチャートが表示されます。

ユーザーがアプリケーションでどのくらい頻繁に認証するかを知るには、アプリケーションコードを更新して、Pinpoint が認証用の次の標準イベントタイプを受け取るようにします。

* `_userauth.sign_in`
* `_userauth.sign_up`
* `_userauth.auth_fail`

次のいずれかを実行することで認証イベントを報告できます:

* ユーザー登録を管理し、Amazon Cognitoのユーザープールでサインインします。
  
  Cognito user pools are user directories that make it easier to add sign-up and sign-in to your app. As users authenticate with your app, Cognito reports authentication events to Pinpoint. For more information, see [Using Amazon Pinpoint Analytics with Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-pinpoint-integration.html) in the _Amazon Cognito Developer Guide_. Also update **awsconfiguration.json** by adding the `PinpointAppId` key under `CognitoUserPool`. 
  
  

    ```json
    "CognitoUserPool": {
        "Default": {
            "PoolId": "<poolid>",
            "AppClientId": "<appclientid>",
            "Region": "<region>",
            "PinpointAppId": "<pinpointappid>"
       }
    }
    ```


* AWS Mobile SDK for iOSまたはAndroidが提供するPinpoint クライアントを使用して認証イベントを報告します。
  
  Cognitoユーザープールを使用したくない場合 以下の例に示すように、Pinpoint クライアントを使用して認証イベントを記録および送信できます。 これらの例では、イベントタイプは `_userauth.sign_in`に設定されていますが、任意の認証イベントタイプを置き換えることができます。 
  
  

    ```swift
    func sendUserSignInEvent() {
        if let analyticsClient = pinpoint?.analyticsClient {
            let event = analyticsClient.createEvent(withEventType: "_userauth.sign_in")
            analyticsClient.record(event)
            analyticsClient.submitEvents()
        }
}
    ```




## イベントの摂取制限

AWS iOS SDK for Pinpoint と Pinpoint Events API を使用したイベントの取り込みに適用される制限は [こちら](https://docs.aws.amazon.com/pinpoint/latest/developerguide/limits.html#limits-events) です。

<amplify-callout> 注:Cognitoユーザープールは、米国東部のAmazon Pinpointプロジェクトへのイベントの送信のみをサポートしています(N)。 Virginia) us-east-1 Region, 関係なく、ユーザープールがある領域. </amplify-callout>

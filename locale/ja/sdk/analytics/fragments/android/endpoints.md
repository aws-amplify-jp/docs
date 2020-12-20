ユーザーがセッションを開始したとき (例えば、モバイルアプリを起動するなど) モバイルまたはWebアプリケーションは、Amazon Pinpointでエンドポイントを自動的に登録(または更新)できます。 エンドポイントは、ユーザーがセッションを開始するデバイスを表します。 デバイスを記述する属性が含まれ、定義したカスタム属性も含めることができます。 エンドポイントは、電子メールアドレスや携帯電話番号など、顧客との通信方法を表すこともできます。

エンドポイントを登録した後、エンドポイントの属性に基づいてオーディエンスをセグメント化できます。これらのセグメントをカスタマイズされたメッセージキャンペーンと連携させることができます。 Amazon Pinpoint コンソールの Analytics ページを使用してエンドポイントの登録とアクティビティに関するグラフを表示することもできます。 例えば、新しいエンドポイントやデイリーアクティブエンドポイントなど。

1 つのユーザ ID を複数のエンドポイントに割り当てることができます。 ユーザー ID は、単一のユーザーを表し、ユーザー ID を割り当てられた各エンドポイントは、ユーザーのデバイスの 1 つを表します。 エンドポイントにユーザー ID を割り当てると、コンソールでのユーザー アクティビティに関するグラフを表示できます。 例えば、毎日のアクティブユーザーや月間アクティブユーザーなど。

## カスタムエンドポイント属性の追加

アプリケーションで Amazon Pinpoint クライアントを初期化した後、エンドポイントにカスタム属性を追加できます。

<div id="java" class="tab-content current">

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.AnalyticsEvent;

public void addCustomEndpointAttribute() {
    // Add a custom attribute to the endpoint
    TargetingClient targetingClient = pinpointManager.getTargetingClient();
    String[] interests = new String[] {"science", "politics", "travel"};
    targetingClient.addAttribute("interests", Arrays.asList(interests));
    targetingClient.updateEndpointProfile();
    Log.d(TAG, "Updated custom attributes for endpoint: " +
            targetingClient.currentEndpoint().getEndpointId());
}
```
</div>

## エンドポイントへのユーザー ID の割り当て
次のいずれかを実行して、ユーザー ID をエンドポイントに割り当てます:

Manage user sign-up and sign-in with Amazon Cognito user pools. Use the Amazon Pinpoint client to assign user IDs without using Amazon Cognito user pools. Amazon Cognito user pools are user directories that make it easier to add sign-up and sign-in to your app. When the AWS Mobile SDKs for iOS and Android register an endpoint with Amazon Pinpoint, Amazon Cognito automatically assigns a user ID from the user pool. For more information, see Using Amazon Pinpoint Analytics with Amazon Cognito User Pools in the Amazon Cognito Developer Guide.

Amazon Cognitoユーザープールを使用したくない場合は、 アプリケーションで Amazon Pinpoint クライアントを使用して、エンドポイントにユーザー ID を割り当てることができます。

<div id="java" class="tab-content current">

```java
import com.amazonaws.mobileconnectors.pinpoint.targeting.TargetingClient;
import com.amazonaws.mobileconnectors.pinpoint.targeting.endpointProfile.EndpointProfileUser;
import com.amazonaws.mobileconnectors.pinpoint.targeting.endpointProfile.EndpointProfile;

public void assignUserIdToEndpoint() {
    TargetingClient targetingClient = pinpointManager.getTargetingClient();
    EndpointProfile endpointProfile = targetingClient.currentEndpoint();
    EndpointProfileUser endpointProfileUser = new EndpointProfileUser();
    endpointProfileUser.setUserId("UserIdValue");
    endpointProfile.setUser(endpointProfileUser);
    targetingClient.updateEndpointProfile(endpointProfile);
    Log.d(TAG, "Assigned user ID " + endpointProfileUser.getUserId() +
            " to endpoint " + endpointProfile.getEndpointId());
}
```
</div>

## エンドポイントの制限

AWS Android SDK for Pinpoint と Amazon Pinpoint エンドポイント API を使用するエンドポイントに適用できる制限は [こちら](https://docs.aws.amazon.com/pinpoint/latest/developerguide/limits.html#limits-endpoint) です。

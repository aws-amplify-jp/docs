## 接続を確立する

トピックを公開/購読する前に、接続を確立する必要があります。 SDK で提供される以下のいずれかの方法で実行できます。

### 証明書ベースの相互認証

標準の MQTT ポート 8883 上で AWS IoT Core サービスに接続するには、以下のように `接続` API を使用します。

```swift
func mqttEventCallback(_ status: AWSIoTMQTTStatus ) {
    print("connection status = \(status.rawValue)")
}

iotDataManager.connect(withClientId: "<YOUR_CLIENT_ID>",
                       cleanSession: true,
                       certificateId: "<YOUR_CERTIFICATE_ID>",
                       statusCallback: mqttEventCallback)
```

The AWS IoT Core service also allows you to connect devices using MQTT with certificate based mutual authentication on port 443. You can do this using the `connectUsingALPN` API as shown below. See [MQTT with TLS client authentication on port 443](https://aws.amazon.com/blogs/iot/mqtt-with-tls-client-authentication-on-port-443-why-it-is-useful-and-how-it-works/) for more information.

```swift
func mqttEventCallback(_ status: AWSIoTMQTTStatus ) {
    print("connection status = \(status.rawValue)")
}

iotDataManager.connectUsingALPN(withClientId: "<YOUR_CLIENT_ID>",
                       cleanSession: true,
                       certificateId: "<YOUR_CERTIFICATE_ID>",
                       statusCallback: mqttEventCallback)
```

詳細については、 [API リファレンス](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSIoT/Classes/AWSIoTDataManager.html#/c:objc(cs)AWSIoTDataManager(im)connectUsingALPNWithClientId:cleanSession:certificateId:statusCallback:) を参照してください。

### AWS 資格情報ベース認証

この方法では、AWS 署名バージョン 4 資格情報を使用して、AWS IoT エンドポイントに接続するリクエストに署名します。

```swift
func mqttEventCallback(_ status: AWSIOTMQTTStatus ) {
    print("connection status = \(status.rawValue)")
}

iotDataManager.connectUsingWebSocket(withClientId: "<YOUR_CLIENT_ID>",
                                     cleanSession: true,
                                     statusCallback: mqttEventCallback)
```

詳細については、 [API リファレンス](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSIoT/Classes/AWSIoTDataManager.html#/c:objc(cs)AWSIoTDataManager(im)connectUsingWebSocketWithClientId:cleanSession:statusCallback:) を参照してください。

### カスタム認証

AWS IoTを使用すると、カスタム認証サービスとLambda機能を使用して、独自の認証および認証戦略を管理できるカスタムオーサライザを定義できます。 カスタムオーソリザでは、AWS IoTがデバイスを認証し、ベアラートトークン認証と認可戦略を使用して操作を承認することができます。 詳細については、 [AWS IoT Custom Authentication](https://docs.aws.amazon.com/iot/latest/developerguide/iot-custom-authentication.html) を参照してください。

カスタムオーサライザを作成し、AWS IoTを使用してワークフローを設定するには、 [カスタム認証の設定](https://aws.amazon.com/blogs/security/how-to-use-your-own-identity-and-access-management-systems-to-control-access-to-aws-iot-resources/) の手順に従ってください。

カスタムオーサライザのワークフローが設定されると、次のように接続を確立できます。

```swift
func mqttEventCallback(_ status: AWSIoTMQTTStatus ) {
    print("connection status = \(status.rawValue)")
}

iotDataManager.connectUsingWebSocket(withClientId: uuid,
                                     cleanSession: true,
                                     customAuthorizerName: "<name-of-the-custom-authorizer>",
                                     tokenKeyName: "<key-name-for-the-token>",
                                     tokenValue: "<token>",
                                     tokenSignature: "<signature-of-the-token>",
                                     statusCallback: mqttEventCallback)
```

You can take a look at the [API Reference](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSIoT/Classes/AWSIoTDataManager.html#/c:objc(cs)AWSIoTDataManager(im)connectUsingWebSocketWithClientId:cleanSession:customAuthorizerName:tokenKeyName:tokenValue:tokenSignature:statusCallback:) to know more information. This feature is available in the AWS SDK for iOS starting from `2.8.4` version. See [AWSIoT - 2.8.4](https://github.com/aws-amplify/aws-sdk-ios/blob/master/CHANGELOG.md#284) for more details.

## トピックを購読する

プロバイダからのメッセージの受信を開始するには、次のようにトピックを購読する必要があります。

```swift
iotDataManager.subscribe(
    toTopic: "myTopic",
    qoS: .messageDeliveryAttemptedAtMostOnce, /* Quality of Service */
    messageCallback: {
        (payload) ->Void in
        let stringValue = NSString(data: payload, encoding: String.Encoding.utf8.rawValue)!

        print("Message received: \(stringValue)")
} )
```

## 複数のトピックを購読する

複数のトピックを購読するには、購読したいトピックごとに `subscribe()` を呼び出してください。

## トピックに公開

トピックにメッセージを送信するには、トピック名とメッセージを使用して `publishString()` メソッドを使用します:

```swift
iotDataManager.publishString(
    "Hello to all subscribers!",
    onTopic: "myTopic", 
    qoS:.messageDeliveryAttemptedAtMostOnce)
```

## トピックの購読を解除

トピックからのメッセージの受信を停止するには、 `unsubscribeTopic()` メソッドを使用します。

```swift
iotDataManager.unsubscribeTopic("myTopic")

// You will no longer get messages for "myTopic"
```

## 接続を閉じる

接続を切断するには、次のように接続を閉じる必要があります。

```swift
iotDataManager.disconnect()
```

## APIリファレンス

AWS IoT の完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSIoT/Classes/AWSIoTDataManager.html) を参照してください。

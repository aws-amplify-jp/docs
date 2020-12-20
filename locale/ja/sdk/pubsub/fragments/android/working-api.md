## 接続を確立する

### 証明書ベースの相互認証

標準の MQTT ポート 8883 上で AWS IoT Core サービスに接続するには、以下のように `接続` API を使用します。

```java
mqttManager.connect(<YOUR_KEYSTORE>, new AWSIotMqttClientStatusCallback() {
    @Override
    public void onStatusChanged(final AWSIotMqttClientStatus status,
                                final Throwable throwable) {
        Log.d(LOG_TAG, "Status = " + String.valueOf(status));
    }
});
```

The AWS IoT Core service also allows you to connect devices using MQTT with certificate based mutual authentication on port 443. You can do this using the `connectUsingALPN` API as shown below. See [MQTT with TLS client authentication on port 443](https://aws.amazon.com/blogs/iot/mqtt-with-tls-client-authentication-on-port-443-why-it-is-useful-and-how-it-works/) for more information.

```java
mqttManager.connectUsingALPN(<YOUR_KEYSTORE>, new AWSIotMqttClientStatusCallback() {
    @Override
    public void onStatusChanged(final AWSIotMqttClientStatus status,
                                final Throwable throwable) {
        Log.d(LOG_TAG, "Status = " + String.valueOf(status));
    }
});
```

詳細については、 [API リファレンス](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/iot/AWSIotMqttManager.html#connectUsingALPN-java.security.KeyStore-com.amazonaws.mobileconnectors.iot.AWSIotMqttClientStatusCallback-) を参照してください。

### AWS 資格情報ベース認証

この方法では、AWS 署名バージョン 4 資格情報を使用して、AWS IoT エンドポイントに接続するリクエストに署名します。

```java
try {
    mqttManager.connect(AWSMobileClient.getInstance(), new AWSIotMqttClientStatusCallback() {
        @Override
        public void onStatusChanged(final AWSIotMqttClientStatus status, final Throwable throwable) {
            Log.d(LOG_TAG, "Connection Status: " + String.valueOf(status));
        }
    });
} catch (final Exception e) {
    Log.e(LOG_TAG, "Connection error: ", e);
}
```

### カスタム認証

AWS IoTを使用すると、カスタム認証サービスとLambda機能を使用して、独自の認証および認証戦略を管理できるカスタムオーサライザを定義できます。 カスタムオーソリザでは、AWS IoTがデバイスを認証し、ベアラートトークン認証と認可戦略を使用して操作を承認することができます。 詳細については、 [AWS IoT Custom Authentication](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html) を参照してください。

カスタムオーサライザを作成し、AWS IoTを使用してワークフローを設定するには、 [カスタム認証の設定](https://aws.amazon.com/blogs/security/how-to-use-your-own-identity-and-access-management-systems-to-control-access-to-aws-iot-resources/) の手順に従ってください。

カスタムオーサライザのワークフローが設定されると、次のように接続を確立できます。

```java
try {
    String tokenKeyName = <TOKEN_KEY_NAME>;
    String token = <TOKEN>;
    String tokenSignature = <TOKEN_SIGNATURE>;
    String customAuthorizerName = <AUTHORIZER_NAME>;
    mqttManager.connect(
            tokenKeyName,
            token,
            tokenSignature,
            customAuthorizerName,
            new AWSIotMqttClientStatusCallback() {
                @Override
                public void onStatusChanged(final AWSIotMqttClientStatus status,
                        final Throwable throwable) {
                    Log.d(LOG_TAG, "Status = " + String.valueOf(status));
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (throwable != null) {
                                Log.e(LOG_TAG, "Connection error.", throwable);
                            }
                        }
                    });
                }
            });
} catch (final Exception e) {
    Log.e(LOG_TAG, "Connection error.", e);
}
```

この機能は、バージョン `2.16.8` から Android 向け AWS SDK で利用できます。

## トピックを購読する

プロバイダからのメッセージの受信を開始するには、次のようにトピックを購読する必要があります。

```java
try {
    mqttManager.subscribeToTopic("myTopic", AWSIotMqttQos.QOS0 /* Quality of Service */,
        new AWSIotMqttNewMessageCallback() {
            @Override
            public void onMessageArrived(final String topic, final byte[] data) {
                try {
                    String message = new String(data, "UTF-8");
                    Log.d(LOG_TAG, "Message received: " + message);
                } catch (UnsupportedEncodingException e) {
                    Log.e(LOG_TAG, "Message encoding error: ", e);
                }
            }
        });
} catch (Exception e) {
    Log.e(LOG_TAG, "Subscription error: ", e);
}
```

## 複数のトピックを購読する

複数のトピックを購読するには、購読したいトピックごとに `subscribeToTopic()` を呼び出してください。

## トピックに公開

トピックにメッセージを送信するには、トピック名とメッセージを使用して `publishString()` メソッドを使用します:

```java
try {
    mqttManager.publishString("Hello to all subscribers!", "myTopic", AWSIotMqttQos.QOS0);
} catch (Exception e) {
    Log.e(LOG_TAG, "Publish error: ", e);
}
```

## トピックの購読を解除

トピックからのメッセージの受信を停止するには、 `unsubscribeTopic()` メソッドを使用します。

```java
try {
    mqttManager.unsubscribeTopic("myTopic");
} catch (Exception e) {
    Log.e(LOG_TAG, "Unsubscribe error: ", e);
}

// You will no longer get messages for "myTopic"
```

## 接続を閉じる

接続を切断するには、次のように接続を閉じる必要があります。

```java
try {
    mqttManager.disconnect();
} catch (Exception e) {
    Log.e(LOG_TAG, "Disconnect error: ", e);
}
```

## APIリファレンス

AWS IoT の完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/iot/package-summary.html) を参照してください。

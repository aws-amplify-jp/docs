PubSub は、クラウドベースのメッセージ指向ミドルウェアとの接続を提供します。 PubSub を使用して、アプリケーションインスタンスとアプリケーションのバックエンド間のメッセージを渡すことができ、リアルタイムのインタラクティブなエクスペリエンスを作成できます。

PubSub は **AWS IoT** で利用可能です。

<amplify-callout>

AWS IoTを使用する場合、メッセージの送信時にPubSub HTTP要求が自動的に署名されます。

</amplify-callout>

## インストールと設定

### AWS IoT

PubSub カテゴリでは、 `AWSIOTMqttManager` は [署名バージョン 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) に従ってAWS IoT で署名された接続を確立します。

`app/build.gradle` の依存関係リストに次のライブラリを含めることで、AWS Mobile SDKコンポーネントを設定します。

```groovy
dependencies {
  implementation ('com.<unk> s:aws-android-sdk-iot:2.15.+@aar') { transitive = true }
  implementation ('com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
}
```

* `aws-android-sdk-iot` ライブラリはAWS IoTに接続できます。
* `aws-android-sdk-mobile-client` ライブラリは AWS 資格情報プロバイダと設定へのアクセスを提供します。

アプリで使用するには、次のクラスをインポートします。

```java
import com.amazonaws.amazonaws.commobileconnectors.iot.AWSIotMqttManager;
import com.amazonaws.commobileconnectors.iot.AWSIotMqttNewMessageCallback;
import com.amazonaws.com.amazonawsmobileconnectors.iot.AWSIotMqttQos;
```

設定内の固有のクライアント ID とエンドポイント (リージョンを含む) を定義します。

```java
// 設定で AWSIotMqttManager を初期化する
AWSIotMqttManager mqttManager = new AWSIotMqttManager(
    "<YOUR_CLIENT_ID>", 
    "xxxxxxxxxxx-ats.iot.<YOUR-AWS-REGION>.amazonaws.com");
```

<amplify-callout> AWS コンソールの IoT Core -> 設定ページからエンドポイント情報を取得できます。 </amplify-callout>

**AWS IoT 向けの IAM ポリシーを作成**

AWS IoTでPubSubを使用するには、AWS IoTコンソールで必要なIAMポリシーを作成する必要があります。 Amazon Cognito Identityに接続します。

Go to IoT Core and choose *Secure* from the left navigation pane. Then navigate to *Create Policy*. The following `myIOTPolicy` policy will allow full access to all the topics.

![Altテキスト](~/images/iot_attach_policy.png)

**Amazon Cognito IDにポリシーを添付**

ポリシーを *Cognito Identity*に添付するには、 `AWSMobileClient` から `Cognito Identity Id` を取得します。

```java
AWSMobileClient.getInstance().getIdentityId();
```

次に、 `myIOTPolicy` ポリシーを次の *AWS CLI* コマンドでユーザーの [Cognito Identity Id](https://aws.amazon.com/cli/) に添付する必要があります。

```bash
aws iot attach-principal-policy --policy-name 'myIOTPolicy' --principal '<YOUR_COGNITO_IDENTITY_ID>'
```

プログラム的に `myIOTPolicy` ポリシーをユーザの *Cognito Identity Id*に添付するには、次のクラスをインポートします。

```java
import com.amazonaws.com.iot.AWSIotClient;
import com.amazonawsmobile.client.AWSMobileClient;
import com.amazonaws.com.amazonaws.com.model.AttachPolicyRequest;
```

次に、 `AttachPolicyRequest` クラスをインスタンス化し、IoTクライアントを次のようにアタッチします。

```java
AttachPolicyRequest attachPolicyReq = new AttachPolicyRequest();
attachPolicyReq.setPolicyName("myIOTPolicy"); // name of your IOT AWS policy
attachPolicyReq.setTarget(AWSMobileClient.getInstance().getIdentityId());
AWSIotClient mIotAndroidClient = new AWSIotClient(AWSMobileClient.getInstance());
mIotAndroidClient.setRegion(Region.getRegion("<YOUR-AWS-REGION>")); // name of your IoT Region such as "us-east-1"
mIotAndroidClient.attachPolicy(attachPolicyReq);
```

PubSub は、クラウドベースのメッセージ指向ミドルウェアとの接続を提供します。 PubSub を使用して、アプリケーションインスタンスとアプリケーションのバックエンド間のメッセージを渡すことができ、リアルタイムのインタラクティブなエクスペリエンスを作成できます。

PubSub は **AWS IoT** で利用可能です。

<amplify-callout>

Starting with version `12.1.1`, iOS requires that publicly-trusted Transport Layer Security (TLS) server authentication certificates issued after October 15, 2018 meet the Certificate Transparency policy to be evaluated as trusted on Apple platforms. Any existing customer endpoint you have is most likely a VeriSign endpoint. If your endpoint has `-ats` at the end of the first subdomain, then it is an Amazon Trust Services endpoint. You can get an updated endpoint from the AWS console (AWS Console->IoT Core ->Settings page). For more details read: https://aws.amazon.com/blogs/iot/aws-iot-core-ats-endpoints/

</amplify-callout>

## インストールと設定

### AWS IoT

`AWSIoTDataManager`と一緒に使用すると、PubSub は [署名バージョン 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) に従ってリクエストを署名することができます。

AWS Mobile SDK をインストールするように設定する `Podfile` には、 `AWSIoT` ポッドが含まれている必要があります。

```ruby
platform :ios, '9.0'

target :'YOUR-APP-NAME' do
  use_frameworks!

  pod 'AWSIoT'
  # other pods

end
```

続行する前に `pod install --repo-update` を実行します。

アプリで使用するには、以下をインポートしてください。

```swift
import AWSIoT
```

設定内の固有のクライアント ID とエンドポイント (リージョンを含む) を定義します。

```swift
// Initialize the AWSIoTDataManager with the configuration
let iotEndPoint = AWSEndpoint(
    urlString: "wss://xxxxxxxxxxxxx-ats.iot.<YOUR-AWS-REGION>.amazonaws.com/mqtt")
let iotDataConfiguration = AWSServiceConfiguration(
    region: AWSRegionType.<YOUR-AWS-REGION>,
    endpoint: iotEndPoint,
    credentialsProvider: AWSMobileClient.default()
)

AWSIoTDataManager.register(with: iotDataConfiguration!, forKey: "MyAWSIoTDataManager")
let iotDataManager = AWSIoTDataManager(forKey: "MyAWSIoTDataManager")
```

<amplify-callout>

AWS コンソールの IoT Core -> 設定ページからエンドポイント情報を取得できます。

</amplify-callout>

**AWS IoT 向けの IAM ポリシーを作成**

AWS IoTでPubSubを使用するには、AWS IoTコンソールで必要なIAMポリシーを作成する必要があります。 Amazon Cognito Identityに接続します。

Go to IoT Core and choose *Secure* from the left navigation pane. Then navigate to *Create Policy*. The following `myIOTPolicy` policy will allow full access to all the topics.

![Altテキスト](~/images/iot_attach_policy.png)

**Amazon Cognito IDにポリシーを添付**

ポリシーを *Cognito Identity*に添付するには、 `AWSMobileClient` から `Cognito Identity Id` を取得します。

```swift
AWSMobileClient.default().getIdentityId();
```

次に、 `myIOTPolicy` ポリシーを次の *AWS CLI* コマンドでユーザーの [Cognito Identity Id](https://aws.amazon.com/cli/) に添付する必要があります。

```bash
aws iot attach-principal-policy --policy-name 'myIOTPolicy' --principal '<YOUR_COGNITO_IDENTITY_ID>'
```

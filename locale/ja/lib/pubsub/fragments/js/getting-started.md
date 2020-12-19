AWS Amplify PubSub カテゴリは、クラウドベースのメッセージ指向ミドルウェアとの接続を提供します。 PubSub を使用して、アプリケーションインスタンスとアプリケーションのバックエンド間のメッセージを渡すことができ、リアルタイムのインタラクティブなエクスペリエンスを作成できます。

PubSub は、 **AWS IoT** と **WebSocket Providers** で利用できます。

<amplify-callout> AWS IoTでは、AWS AmplifyのPubSubはメッセージ送信時に自動的にHTTPリクエストに署名します。 </amplify-callout>

## AWS IoT

`AWSIOTProvider`と一緒に使用すると、 [署名バージョン 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) に従ってリクエストを署名することができます。

アプリで使用するには、 `AWSIOTProvider` をインポートしてください。

```javascript
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
```

設定でエンドポイントとリージョンを定義します。

```javascript
// 設定
Amplify.addPluggable(new AWSIoTProvider({
     aws_pubsub_region: '<YOUR-IOT-REGION>',
     aws_pubsub_endpoint: 'wss://xxxxxxxxxxxxxxx.iot.<YOUR-IOT-REGION>.amazonaws.com/mqtt',
}));
```

Find your `aws_pubsub_endpoint` by logging onto your **AWS Console**, choose **IoT Core** from the list of services, then choose *Settings* from the left navigation pane.

### ステップ1: AWS IoT用のIAMポリシーを作成する

AWS IoTでPubSubを使用するには、AWS IoTコンソールで必要なIAMポリシーを作成する必要があります。 Amazon Cognito Identityに接続します。

Go to IoT Core and choose *Secure* from the left navigation pane. Then navigate to *Create Policy*. The following `myIoTPolicy` policy will allow full access to all the topics.

![Altテキスト](~/images/create-iot-policy.png)


### ステップ 2: Amazon Cognito IDにポリシーを添付

次のステップは、ポリシーを *Cognito Identity* に添付することです。

認証モジュールを使用してログインしたユーザの `Cognito Identity Id` を取得できます:
```javascript
    Auth.currentCredentials().then(info) => {
      const cognitoIdentityId = info.data.IdentityId;
});
```

Then, you need to send your *Cognito Identity Id* to the AWS backend and attach `myIoTPolicy`. You can do this with the following [AWS CLI](https://aws.amazon.com/cli/) command:

```bash
aws iot attach-principal-policy --policy-name 'myIoTPolicy' --principal '<YOUR_COGNITO_IDENTITY_ID>'
```

### ステップ 3: IoT サービスにアクセスするための Amazon Cognito 認証ロールを許可する

For your Cognito Authenticated Role to be able to interact with **AWS IoT** it may be necessary to update its permissions, if you haven't done this before.  
One way of doing this is to log to your **AWS Console**, select **CloudFormation** from the available services. Locate the parent stack of your solution: it is usually named `<SERVICE-NAME>-<CREATION_TIMESTAMP>`.  
Select the **Resources** tab and tap on `AuthRole` **Physical ID**.  
The IAM console will be opened in a new tab. Once there, tap on the button **Attach Policies**, then search `AWSIoTDataAccess` and `AWSIoTConfigAccess`, select them and tap on **Attach policy**.

> Failing to grant IoT related permissions to the Cognito Authenticated Role will result in errors similar to the following in your browser console: `errorCode: 8, errorMessage: AMQJS0008I Socket closed.`

## サードパーティ製MQTTプロバイダー

PubSub モジュールと関連サービス プロバイダー プラグインをアプリにインポートします。

```javascript
import { PubSub } from 'aws-amplify';
import { MqttOverWSProvider } from "@aws-amplify/pubsub/lib/Providers";
```

サービスプロバイダをサービスエンドポイントで構成するには、次のコードを追加してください。
```javascript
// 設定でプラグインを適用する
Amplify.addPluggable(new MqttOverWSProvider({
    aws_pubsub_endpoint: 'wss://iot.eclipse.org:443/mqtt',
}));
```

任意の MQTT Over WebSocket プロバイダーをアプリケーションに組み込むことができます。 [](https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html#mqtt-ws) をクリックして MQTT Over WebSocket の詳細をご覧ください。

## モジュラーインポートの使用

If you only need to use PubSub, you can do: `npm install @aws-amplify/pubsub` which will only install the PubSub module for you. Note: if you're using Cognito Federated Identity Pool to get AWS credentials, please also install `@aws-amplify/auth`.

その後、コード内でPubSub モジュールをインポートすることができます。
```javascript
import PubSub from '@aws-amplify/pubsub';

PubSub.configure();
```

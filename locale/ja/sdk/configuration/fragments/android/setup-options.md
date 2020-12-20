AWS SDKには、アプリケーションに共通の機能と機能をすばやく追加するための、 [高レベルのクライアントインターフェイス](~/start/start.md) が含まれています。 カスタムまたは高度な要件がある場合は、生成された AWS サービスインターフェイスを手動で追加して直接操作することもできます。

## Android Gradle setup

AWS Mobile SDK for Android は Gradle で利用できます。

If you are using Android Studio, add the dependency for the individual services that your project will use to your `app/build.gradle` file, as shown below.

```groovy
dependencies {
    implementation 'com.<unk> s:aws-android-sdk-ddb:2.15.+'
}
```

依存関係の完全なリストは以下にリストされています。「`@aar`」で終わる依存関係については、以下の形式でコンパイル文を使用してください。

```groovy
implementation ('com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aaar') { transitive = true }
```

<table spaces-before="0" line-breaks-before="2">
  <tr>
    <th>
      依存関係
    </th>
    
    <th>
      Build.gradle の値
    </th>
  </tr>
  
  <tr>
    <td>
      "Amazon APIゲートウェイ"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-apigateway-cor:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Auth Core"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-auth-core:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Facebookサインインプロバイダー"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-auth-facebook:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Google Signin Provider"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-auth-google:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Auth UI"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-auth-ui:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Cognito User Pools Sin Provider"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-auth-userpools:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Auto Scaling"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-autoscaling:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon CloudWatch"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-cloudwatch:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Cognito Auth"
    </td>
    
    <td>
      "com.amazonaws:aws-android-sdk-cognitoauth:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Cognito Identity Provider"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-cognitoidentityprovider:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Core"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-core:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon DynamoDB Document Model"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-ddb-document:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon DynamoDB Object Mapper"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-ddb-mapper:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon DynamoDB"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdkddb:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Elastic Compute Cloud"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-ec2:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Elastic Load Balancing"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-elb:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS IoT"
    </td>
    
    <td>
      "com.amazonaws:aws-android-sdk-iot:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Kinesis"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-kinesis:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      「アマゾンキネシス・ビデオ」
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-kinesisvideo:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      「Amazon Key Management Service (KMS)"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdkkms:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Lambda"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-lambda:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Lex"
    </td>
    
    <td>
      "com.amazonaws:aws-android-sdk-lex:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon CloudWatchログ"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-logs:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Machine Learning"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-machinelearning:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "AWS Mobile Client"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aar"
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Pinpoint"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-pinpoint:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "アマゾンポリー"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-polly:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Rekognition"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-rekognition:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Simple Storage Service (S3)"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-s3:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon Simple DB (SDB)"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-sdb:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon SES"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-ses:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon SNS"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-sns:2.15.+)
    </td>
  </tr>
  
  <tr>
    <td>
      "Amazon SQS"
    </td>
    
    <td>
      "com.<unk> s:aws-android-sdk-sqs:2.15.+"
    </td>
  </tr>
</table>

SDK の新しいバージョンがリリースされるたびに、Gradle Sync を実行してプロジェクトを再構築し、新機能を使用することで更新できます。

### AWS SDKバージョンvs. セマンティックバージョン管理

AWS SDK for Android は、セマンティックバージョンに従っていません。 代わりに、後方互換性のあるバグ修正 *と* 壊れない変更の両方について、パッチレベルのバージョンが増加します。 をクリックして、変更を破るマイナーバージョンを増やします。 主なバージョン変更はまれであり、通常は劇的に異なるプログラミングモデルを示します。

比較のために、Semantic バージョン管理は、後方互換性のあるバグ修正のパッチレベルを増加させます。 後方互換性のある新機能のマイナーバージョンと、互換性のない変更のためのメジャーバージョンです。

## マニフェストの権限を設定

`AndroidManifest.xml` に次の権限を追加します。

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## 直接AWSサービスへのアクセス

You can call AWS service interface objects directly via the generated SDK clients. You can use the client credentials provided by the [AWSMobileClient](~/sdk/auth/getting-started.md) by calling `AWSMobileClient.getInstance()` and passing it to the service client. This will leverage short term AWS credentials from Cognito Identity.

<amplify-callout warning>

サービス インターフェイス オブジェクトを使用するには、Amazon Cognito ユーザの [IAM ロール](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html) には、要求されたサービスを呼び出すための適切な権限が必要です。

</amplify-callout>

For example, if you were using [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) in your Android project you would first add `aws-android-sdk-sqs:2.11.+` to your `app/build.gradle` and install the dependencies by running a Gradle Sync.

次に、Android Studio プロジェクトに `AmazonSQS` をインポートし、クライアントを作成します。

```java
import com.amazonaws.services.sqs.AmazonSQSAsyncClient;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageResult;

public void addItemSQS() {
    AmazonSQSAsyncClient sqs = new AmazonSQSAsyncClient(AWSMobileClient.getInstance());
    sqs.setRegion(Region.getRegion("XX-XXXX-X"));
    SendMessageRequest req = new SendMessageRequest("https://sqs.XX-XXXX-X.amazonaws.com/XXXXXXXXXXXX/MyQueue", "hello world");
    sqs.sendMessageAsync(req, new AsyncHandler<SendMessageRequest, SendMessageResult>() {
        @Override
        public void onSuccess(SendMessageRequest request, SendMessageResult sendMessageResult) {
            Log.i(LOG_TAG, "SQS result: " + sendMessageResult.getMessageId());
        }

        @Override
        public void onError(Exception e) {
            Log.e(LOG_TAG, "SQS error: ", e);
        }
    });
}
```

`this.addItemSQS()` を呼び出して、アプリケーションからこのアクションを呼び出すことができます。
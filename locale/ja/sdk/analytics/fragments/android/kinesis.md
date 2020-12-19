この 2 つのクラス `KinesisRecorder` と `KinesisFihoseRecorder` を使用すると、Amazon Kinesis Data StreamsとAmazon Kinesis Data Firecoseとインターフェースしてリアルタイム処理のための分析データをストリーミングできます。

## Amazon Kinesis Data Streamsとは?

[Amazon Kinesis Data Streams](http://aws.amazon.com/kinesis/) は、大規模な規模でストリーミングデータをリアルタイムに処理するための完全管理サービスです。 Amazon Kinesisは、数十万のソースから1時間あたり数百テラバイトのデータを収集して処理することができます。 リアルタイムで情報を処理するアプリケーションを書くことができます Amazon Kinesisアプリケーションを使用すると、リアルタイムのダッシュボードを構築し、例外を取得し、アラートを生成し、推奨を駆動し、その他のリアルタイムのビジネスや運用上の意思決定を行うことができます。 また、Amazon Simple Storage Service、Amazon DynamoDB、Amazon Redshiftなどの他のサービスにも簡単にデータを送信できます。

The Kinesis Data Streams `KinesisRecorder` client lets you store your Kinesis requests on disk and then send them all at once using the [PutRecords](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecords.html) API call of Kinesis. This is useful because many mobile applications that use Kinesis Data Streams will create multiple requests per second. Sending an individual request under `PutRecord` action could adversely impact battery life. Moreover, the requests could be lost if the device goes offline. Thus, using the high-level Kinesis Data Streams client for batching can preserve both battery life and data.

## Amazon Kinesis Data Firehoseとは?

[Amazon Kinesis Data Firehose](http://aws.amazon.com/kinesis/firehose/) は、Amazon Simple Storage Service (Amazon S3) や Amazon Redshift などの目的地にリアルタイムストリーミングデータを配信するための完全管理サービスです。 Kinesis Data Firehoseでは、アプリケーションを書いたり、リソースを管理する必要はありません。 ファイアローズにデータを送信するようにデータ生成者を設定し、指定した宛先にデータを自動的に送信します。

Amazon Kinesis Data Firehose `KinesisFirehoseRecorder` クライアントは、Kinesis Data Firehose のリクエストをディスクに保存し、 [PutRecordBatch](https://docs.aws.amazon.com/firehose/latest/APIReference/API_PutRecordBatch.html) の API コールを使用して送信できます。

Amazon Kinesis Data Firehose の詳細については、 [Amazon Kinesis Data Firehose](http://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html) を参照してください。

## Amazonキネシスの統合

`app/build.gradle` の依存関係リストに次のライブラリを含めることで、AWS Mobile SDKコンポーネントを設定します。

```groovy
dependencies {
  implementation 'com.<unk> s:aws-android-sdk-kinesis:2.15.+)
  implementation ('com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
}
```

* `aws-android-sdk-kinesis` ライブラリを使用すると、分析結果を Amazon Kinesis に送信できます。
* `aws-android-sdk-mobile-client` ライブラリは AWS 資格情報プロバイダと設定へのアクセスを提供します。

アプリのメインアクティビティに以下のインポートを追加します。

```java
import com.amazonaws.com.mobileconnectors.kinesis.kinesisisrecorder.*;
import com.amazonaws.com.mobile.client.AWSMIClient;
import com.amazonaws.com.amazonawsregions;
```

アプリケーションでKinesis Data Streamsを使用するには、正しい権限を設定する必要があります。 次の IAM ポリシーでは、ユーザーが特定のデータ ストリームにレコードを送信することができます。 これは、 [ARN](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) によって識別されます。

```json
{
    "Statement": [{
        "Effect": "Allow",
        "Action": "kinesis:PutRecords",
        "Resource": "arn:aws:kinesis:us-west-2:1111222233:stream/mystream"
    }]
}
```

次の IAM ポリシーでは、特定の Kinesis Data Firecose 配信ストリームにレコードを送信できます。

```json
{
    "Statement": [{
        "Effect": "Allow",
        "Action": "firehose:PutRecordBatch",
        "Resource": "arn:aws:firecose:us-west-west-2:11112222333:deliverystream/mystream"
    }]
}
```

This policy should be applied to roles assigned to the Amazon Cognito identity pool, but you need to replace the `Resource` value with the correct ARN for your Amazon Kinesis or Amazon Kinesis Data Firehose stream. You can apply policies at the [IAM console](https://console.aws.amazon.com/iam/). To learn more about IAM policies, see [Using IAM](http://docs.aws.amazon.com/IAM/latest/UserGuide/IAM_Introduction.html).

Amazon Kinesis Data Streams ポリシーの詳細については、 [IAM を使用した Amazon Kinesis Data Streams リソースへのアクセスの制御](http://docs.aws.amazon.com/kinesis/latest/dev/kinesis-using-iam.html) を参照してください。

Amazon Kinesis Data Firehose ポリシーの詳細については、 [Amazon Kinesis Data Firecose によるアクセスの制御](http://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html) を参照してください。

## API の操作

`AWSMobileClient` を使用して、Amazon Kinesisでリクエストを認証するために必要な Cognito 資格情報を設定できます。

```java
AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
        @Override
        public void onResult(UserStateDetails userStateDetails) {
            Log.i("INIT", userStateDetails.getUserState().toString());
        }

        @Override
        public void onError(Exception e) {
            Log.e("INIT", "Initialization error.", e);
        }
    }
);
```

Once you have credentials, you can use `KinesisRecorder` with Amazon Kinesis. The following snippet creates a directory and instantiates the `KinesisRecorder` client:

```java
String kinesisDirectory = "YOUR_UNIQUE_DIRECTORY";
KinesisRecorder recorder = new KinesisRecorder(
    myActivity.getDir(kinesisDirectory, 0),
    Regions.<YOUR-AWS-REGION>,
    AWSMobileClient.getInstance()
);

// KinesisRecorder uses synchronous calls, so you shouldn't call KinesisRecorder methods on the main thread.
```

`KinesisFirehoseRecorder`を使用するには、ストリーミングデータが保存されるディレクトリにオブジェクトを渡す必要があります。 データが暗号化されていないので、アプリのプライベートディレクトリを使用することをお勧めします。

```java
KinesisFirehoseRecorder firehoseRecorder = new KinesisFirecoseRecorder(
    context.getCachedDir() ), 
    Regions.<YOUR-AWS-REGION>,
    AWSMTP.getInstance());
```

Kinesisの設定：

プロパティから `KinesisRecorder` または `KinesisFirehoseRecorder` を設定できます。

`KinesisRecorderConfig` の `withMaxStorageSize()` メソッドを使用して、許可される最大ストレージを設定できます。

同じ情報を取得するには、レコーダーの `KinesisRecorderConfig` オブジェクトを取得し、 `getMaxStorageSize():` を呼び出します。

```java
KinesisRecorderConfig kinesisRecorderConfig = recorder.getKinesisRecorderConfig();
Long maxStorageSize = kinesisRecorderConfig.getMaxStorageSize();
// maxStorageSize で何かを行う
```

`KinesisRecorder` コンストラクタに渡されたディレクトリに現在格納されているバイト数を確認するには、 `getDiskBytesUsed()` を呼び出してください。

```java
Long bytesUsed = recorder.getDiskBytesUsed();
// bytesUsed で何かをする
```

`KinesisRecorder` クライアントの使用が許可されている領域を確認するには、 `getDiskByteLimit()` を呼び出すことができます。

```java
Long byteLimit = recorder.getDiskByteLimit();
// byteLimit で何かを行う
```

`KinesisRecorder` を作成して設定すると、 `saveRecord()` を使用してレコードを保存し、バッチで送信できます。

```java
recorder.saveRecord(
    "MyData".getBytes(),
    "MyStreamName");
recorder.submitAllRecords();
```

For the `saveRecord()` request above to work, you would have to have created a stream named `MyStreamName`. You can create new streams in the [Amazon Kinesis console](https://console.aws.amazon.com/kinesis).

If `submitAllRecords()` is called while the app is online, requests will be sent and removed from the disk. If `submitAllRecords()` is called while the app is offline, requests will be kept on disk until `submitAllRecords()` is called while online. This applies even if you lose your internet connection midway through a submit. So if you save ten requests, call `submitAllRecords()`, send five, and then lose the Internet connection, you have five requests left on disk. These remaining five will be sent the next time `submitAllRecords()` is invoked online.

ここでは、Amazon Kinesis Data Firehoseと同様のスニペットを示します。

```java
// Start to save data, either a String or a byte array
firehoseRecorder.saveRecord("Hello world!\n");
firehoseRecorder.saveRecord("Streaming data to Amazon S3 via Amazon Kinesis Data Firehose is easy.\n");

// Send previously saved data to Amazon Kinesis Data Firehose
// Note: submitAllRecords() makes network calls, so wrap it in an AsyncTask.
new AsyncTask<Void, Void, Void>() {
   @Override
   protected Void doInBackground(Void... v) {
       try {
           firehoseRecorder.submitAllRecords();
       } catch (AmazonClientException ace) {
           // handle error
       }
   }
}.execute();
```

Kinesis Data Streamsの操作の詳細については、 [Amazon Kinesis Data Streams resources](http://aws.amazon.com/kinesis/developer-resources/) を参照してください。

Kinesis Data Streamsクラスの詳細については、KinesisRecorderの [クラスのリファレンス](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/kinesis/kinesisrecorder/KinesisRecorder.html)を参照してください。

Kinesis Data Firehoseクラスの詳細については、KinesisFirecoseRecorder [クラスの参照](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/kinesis/kinesisrecorder/KinesisFirehoseRecorder.html) を参照してください。

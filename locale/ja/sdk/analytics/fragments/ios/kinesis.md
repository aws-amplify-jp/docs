2つのクラス `AWSKinesisRecorder` と `AWSFihoseRecorder` を使用すると、Amazon Kinesis と Amazon Kinesis Firecose をインターフェースしてリアルタイム処理のための分析データをストリーミングできます。

## Amazon Kinesisとは?

[Amazon Kinesis](http://aws.amazon.com/kinesis/) は、大規模なストリーミングデータをリアルタイムに処理するための完全管理サービスです。 Amazon Kinesisは、数十万のソースから1時間あたり数百テラバイトのデータを収集して処理することができます。 リアルタイムで情報を処理するアプリケーションを書くことができます Amazon Kinesisアプリケーションを使用すると、リアルタイムのダッシュボードを構築し、例外を取得し、アラートを生成し、推奨を駆動し、その他のリアルタイムのビジネスや運用上の意思決定を行うことができます。 また、Amazon Simple Storage Service、Amazon DynamoDB、Amazon Redshiftなどの他のサービスにも簡単にデータを送信できます。

The Amazon Kinesis `AWSKinesisRecorder` client lets you store [PutRecord](http://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) requests on disk and then send them all at once. This is useful because many mobile applications that use Amazon Kinesis will create multiple `PutRecord` requests per second. Sending an individual request for each `PutRecord` action could adversely impact battery life. Moreover, the requests could be lost if the device goes offline. Thus, using the high-level Amazon Kinesis client for batching can preserve both battery life and data.

## Amazon Kinesis Firehoseとは何ですか?

[Amazon Kinesis Firecose](http://aws.amazon.com/kinesis/firehose/) は、Amazon Simple Storage Service (Amazon S3) や Amazon Redshift などの宛先にリアルタイムストリーミングデータを配信するための完全管理サービスです。 ファイアオースでは、アプリケーションを書いたり、リソースを管理したりする必要はありません。 ファイアローズにデータを送信するようにデータ生成者を設定し、指定した宛先にデータを自動的に送信します。

Amazon Kinesis Firecose `AWSFihoseRecorder` クライアントは、ディスクに [PutRecords](http://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecords.html) リクエストを保存し、Kinesis Data Firecose`PutRecordBatch` を使用してそれらを送信することができます。

Amazon Kinesis Firehose の詳細については、 [Amazon Kinesis Firecose](http://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html) を参照してください。

## Amazon Kinesis と Amazon Kinesis Firecose の統合

`Podfile` に以下を追加:

```ruby
pod 'AWSKinesis'
```

この手順では、使用するサービスのヘッダーをインポートするように指示します。この例では、次のインポートが必要です。

```swift
import AWSKinesis
```

アプリケーションでAmazon Kinesisを使用するには、正しい権限を設定する必要があります。 次の IAM ポリシーでは、特定の Amazon Kinesis ストリームにレコードを送信することができます。これは [ARN](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) によって識別されます。

```json
{
    "Statement": [{
        "Effect": "Allow",
        "Action": "kinesis:PutRecords",
        "Resource": "arn:aws:kinesis:us-west-2:1111222233:stream/mystream"
    }]
}
```

次の IAM ポリシーでは、特定の Amazon Kinesis Firecose ストリームにレコードを送信できます。

```json
{
    "Statement": [{
        "Effect": "Allow",
        "Action": "firehose:PutRecordBatch",
        "Resource": "arn:aws:firecose:us-west-west-2:11112222333:deliverystream/mystream"
    }]
}
```

This policy should be applied to roles assigned to the Amazon Cognito identity pool, but you need to replace the `Resource` value with the correct ARN for your Amazon Kinesis or Amazon Kinesis Firehose stream. You can apply policies at the [IAM console](https://console.aws.amazon.com/iam/). To learn more about IAM policies, see [Using IAM](http://docs.aws.amazon.com/IAM/latest/UserGuide/IAM_Introduction.html).

Amazon Kinesis 固有のポリシーの詳細については、 [IAM を使用した Amazon Kinesis リソースへのアクセスの制御](http://docs.aws.amazon.com/kinesis/latest/dev/kinesis-using-iam.html) を参照してください。

Amazon Kinesis Firehose ポリシーの詳細については、 [Amazon Kinesis Firehose によるアクセスの制御](http://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html) を参照してください。

## API の操作

資格情報を取得したら、Amazon Kinesisで `AWSKinesisRecorder` を使用できます。 次のスニペットは、Amazon Kinesisサービスクライアントの共有インスタンスを返します。

```swift
let kinesisRecorder = AWSKinesisRecorder.default()
```

Amazon Kinesis Firehose と `AWSFirehoseRecorder` を使用できます。次のスニペットは、Amazon Kinesis Firehose サービス クライアントの共有インスタンスを返します。

```swift
let firehoseRecorder = AWSFirehoseRecorder.default()
```

Kinesisの設定：

`AWSKinesisRecorder` または `AWSFirehoseRecorder` をプロパティから設定できます。

```swift
kinesisRecorder.diskAgeLimit = TimeInterval(30 * 24 * 60 * 60); // 30 days
kinesisRecorder.diskByteLimit = UInt(10 * 1024 * 1024); // 10MB
kinesisRecorder.notificationByteThreshold = UInt(5 * 1024 * 1024); // 5MB
```

The `diskAgeLimit` property sets the expiration for cached requests. When a request exceeds the limit, it's discarded. The default is no age limit. The `diskByteLimit` property holds the limit of the disk cache size in bytes. If the storage limit is exceeded, older requests are discarded. The default value is 5 MB. Setting the value to 0 means that there's no practical limit. The `notificationByteThreshold` property sets the point beyond which Kinesis issues a notification that the byte threshold has been reached. The default value is 0, meaning that by default Amazon Kinesis doesn't post the notification.

Amazon Kinesis `PutRecord` リクエストでローカルストレージが使用されているかを確認するには、 `diskBytesUsed` プロパティを確認してください。

`AWSKinesisRecorder` を作成して設定すると、 `saveRecord()` を使用してレコードをローカルストレージに保存できます。

```swift
let yourData = "Test_data".data(using: .utf8)
kinesisRecorder.saveRecord(
    yourData, 
    streamName: "YourStreamName")
```

In the preceding example, we create an NSData object and save it locally. `YourStreamName` should be a string corresponding to the name of your Kinesis stream. You can create new streams in the [Amazon Kinesis console](https://console.aws.amazon.com/kinesis/).

ここでは、Amazon Kinesis Firehoseについて同様のスニペットを示します。

```swift
let yourData = "Test_data".data(using: .utf8)
firehoseRecorder.saveRecord(
    yourData,
    streamName: "YourStreamName")
```

デバイスに保存されているすべてのレコードを送信するには、 `submitAllRecords` を呼び出します。

```swift
kinesisRecorder.submitAllRecords()
firehoseRecorder.submitAllRecords()
```

`submitAllRecords` はローカルに保存されたすべてのリクエストを Amazon Kinesis サービスに送信します。 正常に送信されたリクエストはデバイスから削除されます。 デバイスがオフラインであるために失敗したリクエストは保持され、後で送信されます。無効なリクエストは削除されます。

Both `saveRecord` and `submitAllRecords` are asynchronous operations, so you should ensure that `saveRecord` is complete before you invoke `submitAllRecords`. The following code sample shows the methods used correctly together.

```swift
// Create an array to store a batch of objects.
var tasks = Array<AWSTask<AnyObject>>()
for i in 0...100 {
    tasks.append(kinesisRecorder!.saveRecord(String(format: "TestString-%02d", i).data(using: .utf8), streamName: "YourStreamName")!)
}

AWSTask(forCompletionOfAllTasks: tasks).continueOnSuccessWith(block: { (task:AWSTask<AnyObject>) -> AWSTask<AnyObject>? in
    return kinesisRecorder?.submitAllRecords()
}).continueWith(block: { (task:AWSTask<AnyObject>) -> Any? in
    if let error = task.error as? NSError {
        print("Error: \(error)")
    }
    return nil
})
```

Amazon Kinesisでの作業の詳細については、 [Amazon Kinesis Developer Resources](http://aws.amazon.com/kinesis/developer-resources/) を参照してください。

To learn more about the Amazon Kinesis classes, see the [class reference for AWSKinesisRecorder](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/Classes/AWSKinesisRecorder.html).

Amazon Kinesis Firecoseクラスの詳細については、AWSFirecoseRecorder の [クラスのリファレンスを参照してください](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/Classes/AWSFirehoseRecorder.html)。
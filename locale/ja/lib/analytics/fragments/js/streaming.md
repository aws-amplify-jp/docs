Amazon Kinesis分析プロバイダでは、リアルタイム処理のために分析データを [Amazon Kinesis](https://aws.amazon.com/kinesis) ストリームに送信できます。

## インストールと設定

*AWSKinesisProvider* を Analytics カテゴリに登録します:

```javascript
import { Analytics, AWSKinesisProvider } from 'aws-amplify';
Analytics.addPluggable(new AWSKinesisProvider());
```

If you did not use the CLI, ensure you have <a href="https://docs.aws.amazon.com/streams/latest/dev/learning-kinesis-module-one-iam.html" target="_blank">setup IAM permissions</a> for `PutRecords`.

Amazon KinesisのIAMポリシー例：
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kinesis:PutRecord",
                "kinesis:PutRecords"
            ],
            "Resource": "*"
        }
    ]
}
```

詳細については、 [Amazon Kinesis Developer Documentation](https://docs.aws.amazon.com/streams/latest/dev/learning-kinesis-module-one-iam.html) をご覧ください。

Kinesisの設定：

```javascript
// Configure the plugin after adding it to the Analytics module
Analytics.configure({
    AWSKinesis: {

        // OPTIONAL -  Amazon Kinesis service region
        region: 'XX-XXXX-X',

        // OPTIONAL - The buffer size for events in number of items.
        bufferSize: 1000,

        // OPTIONAL - The number of events to be deleted from the buffer when flushed.
        flushSize: 100,

        // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
        flushInterval: 5000, // 5s

        // OPTIONAL - The limit for failed recording retries.
        resendLimit: 5
    } 
});
```

## ストリームデータ

標準の `record()` メソッドを使用して、Kinesis ストリームにデータを送信できます。

```javascript
Analytics.record({
    data: { 
        // The data blob to put into the record
    },
    // OPTIONAL
    partitionKey: 'myPartitionKey', 
    streamName: 'myKinesisStream'
}, 'AWSKinesis');
```
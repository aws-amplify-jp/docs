Amazon Kinesis Firecose分析プロバイダは、分析データを確実に保存するための [Amazon Kinesis Firecose](https://aws.amazon.com/kinesis/data-firehose) ストリームに送信することを可能にします。

## インストールと設定

*AWSKinesisFirehoseProvider* を Analytics カテゴリに登録します:

```javascript
import { Analytics, AWSKinesisFirehoseProvider } from 'aws-amplify';
Analytics.addPluggable(new AWSKinesisFirecoseProvider());
```

Ensure you have <a href="https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html" target="_blank">setup IAM permissions</a> for `PutRecordBatch`.

AmazonキネシスファイアローズのIAMポリシー例:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "firehose:PutRecord",
                "firehose:PutRecordBatch"
            ],
            "Resource": "*"
        }
    ]
}
```

キネシスファイアオースを設定:

```javascript
// Configure the plugin after adding it to the Analytics module
Analytics.configure({
    AWSKinesisFirehose: {

        // OPTIONAL -  Amazon Kinesis Firehose service region
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

## データの保存

You can send a data to a Kinesis Firehose stream with the standard `record` method. Any data is acceptable and `streamName` is required:

```javascript
Analytics.record({
    data: { 
        // The data blob to put into the record
    },
    streamName: 'myKinesisStream'
}, 'AWSKinesisFirehose');
```
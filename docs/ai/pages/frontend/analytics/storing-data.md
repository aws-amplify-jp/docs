---
title: "アナリティクスデータの保存"
section: "frontend/analytics"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/storing-data/"
---

Amazon Data Firehose アナリティクスプロバイダーを使用すると、アナリティクスデータを [Amazon Data Firehose](https://aws.amazon.com/firehose/) ストリームに送信して、データを確実に保存できます。

## Firehose ストリームのセットアップ

以下は、[AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/latest/guide/home.html) を利用して [Amazon Data Firehose](https://aws.amazon.com/firehose/) によって支援されるアナリティクスリソースを作成する例です。

まず、Firehose ストリームからのデータを保存するストレージバケットを作成しましょう。

```ts title="amplify/storage/resource.ts"
import { defineStorage } from "@aws-amplify/backend";

// Define the S3 bucket resource
export const storage = defineStorage({
  name: "FirehoseDestinationBucket",
});

```

次に、Firehose リソースを作成しましょう。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { Stack } from "aws-cdk-lib/core";
import {
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth, 
  data,
  storage,
  // additional resources 
});

// Create a new stack for the Firehose resources
const firehoseStack = backend.createStack("firehose-stack");

// Access the S3 bucket resource
const s3Bucket = backend.storage.resources.bucket;

// Create a new IAM role for the Firehose
const firehoseRole = new Role(firehoseStack, "FirehoseRole", {
  assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
});

// Grant the Firehose role read/write permissions to the S3 bucket
s3Bucket.grantReadWrite(firehoseRole);

// Create a new Firehose delivery stream
const myFirehose = new CfnDeliveryStream(firehoseStack, "MyFirehose", {
  deliveryStreamType: "DirectPut",
  s3DestinationConfiguration: {
    bucketArn: s3Bucket.bucketArn,
    roleArn: firehoseRole.roleArn,
  },
  deliveryStreamName: "myFirehose",
});

// Create a new IAM policy to allow users to write to the Firehose
const firehosePolicy = new Policy(firehoseStack, "FirehosePolicy", {
  statements: [
    new PolicyStatement({
      actions: ["firehose:PutRecordBatch"],
      resources: [myFirehose.attrArn],
    }),
  ],
});

// Attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(firehosePolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(firehosePolicy);
```

## インストールと設定

`firehose:PutRecordBatch` の [IAM パーミッション設定](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html)を完了していることを確認してください。

Amazon Data Firehose の IAM ポリシーの例:

```javascript
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "firehose:PutRecordBatch",
    // replace the template fields
    "Resource": "arn:aws:firehose:<your-aws-region>:<your-aws-account-id>:deliverystream/<your-stream-name>"
  }]
}
```

Firehose を設定してください:

```javascript title="src/index.js"
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  Analytics: {
    KinesisFirehose: {
      // REQUIRED -  Amazon Kinesis Firehose service region
      region: 'us-east-1',

      // OPTIONAL - The buffer size for events in number of items.
      bufferSize: 1000,

      // OPTIONAL - The number of events to be deleted from the buffer when flushed.
      flushSize: 100,

      // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
      flushInterval: 5000, // 5s

      // OPTIONAL - The limit for failed recording retries.
      resendLimit: 5
    }
  }
});
```

## データの保存

標準の `record` メソッドを使用して Firehose ストリームにデータを送信できます。任意のデータが受け入れられ、`streamName` は必須です:

```javascript title="src/index.js"
import { record } from 'aws-amplify/analytics/kinesis-firehose';

record({
  data: {
    // The data blob to put into the record
  },
  streamName: 'myFirehose'
});
```

## イベントのフラッシュ
記録されたイベントはバッファに保存され、定期的にリモートサーバーに送信されます *(`flushInterval` オプションで調整できます)*。必要に応じて、'flushEvents' API を使用してバッファからすべてのイベントを手動で削除できます。

```javascript title="src/index.js"
import { flushEvents } from 'aws-amplify/analytics/kinesis-firehose';

flushEvents();
```

<!-- Platform: react-native -->
## 既知の問題

デフォルトの Pinpoint プロバイダーの代わりに、以下の代替サービスプロバイダーをインポートする場合:

- Amazon Kinesis (`aws-amplify/analytics/kinesis`)
- Amazon Data Firehose (`aws-amplify/analytics/kinesis-firehose`)
- Personalize Event (`aws-amplify/analytics/personalize`)

バンドラーの起動時に次のエラーが発生する場合があります:

> Error: Unable to resolve module stream from /path/to/node_modules/@aws-sdk/... これは [既知の問題](https://github.com/aws/aws-sdk-js-v3/issues/4877) です。この問題を解決するには、[問題で説明されている手順](https://github.com/aws/aws-sdk-js-v3/issues/4877#issuecomment-1656007484)に従ってください。
<!-- /Platform -->

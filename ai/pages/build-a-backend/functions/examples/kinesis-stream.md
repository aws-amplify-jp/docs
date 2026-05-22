---
title: "Amazon Kinesis Data Streams"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/"
---

AWS Lambda を使用すると、Amazon Kinesis、Amazon SQS など、様々なイベントソースをシームレスに統合して、リアルタイムイベントに応じて Lambda 関数をトリガーできます。この機能により、ポーリングサービスを必要とせずに、データやシステム状態の変化に対応するレスポンシブなイベント駆動型アプリケーションを構築できます。

このガイドでは、Kinesis データストリームをイベントソースとして Lambda 関数を設定します。ストリームに新しいデータが公開されるたびに Lambda 関数が自動的にトリガーされます。ストリーミングデータの処理、アプリケーションイベントへの対応、またはワークフローの自動化など、様々なユースケースに対応できます。

まず、Lambda 関数に構造化ログ機能を提供する AWS Lambda Powertools Logger と、ハンドラー型を定義するために使用される `aws-lambda` パッケージをインストールします。

```bash title="Terminal" showLineNumbers={false}
npm add @aws-lambda-powertools/logger @types/aws-lambda
```

次に、新しいディレクトリとリソースファイル `amplify/functions/kinesis-function/resource.ts` を作成します。その後、`defineFunction` を使用して関数を定義します:

```ts title="amplify/functions/kinesis-function/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const myKinesisFunction = defineFunction({
  name: "kinesis-function",
});
```

3 番目に、対応するハンドラーファイル `amplify/functions/kinesis-function/handler.ts` を次の内容で作成します:

```ts title="amplify/functions/kinesis-function/handler.ts"
import type {
  KinesisStreamBatchResponse,
  KinesisStreamHandler,
  KinesisStreamRecordPayload,
} from "aws-lambda";
import { Buffer } from "node:buffer";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "kinesis-stream-handler",
});

export const handler: KinesisStreamHandler = async (
  event,
  context
): Promise<KinesisStreamBatchResponse> => {
  for (const record of event.Records) {
    try {
      logger.info(`Processed Kinesis Event - EventID: ${record.eventID}`);
      const recordData = await getRecordDataAsync(record.kinesis);
      logger.info(`Record Data: ${recordData}`);
    } catch (err) {
      logger.error(`An error occurred ${err}`);
      /*
      When processing stream data, if any item fails, returning the failed item's position immediately
      prompts Lambda to retry from this item forward, ensuring continuous processing without skipping data.
      */
      return {
        batchItemFailures: [{ itemIdentifier: record.kinesis.sequenceNumber }],
      };
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);
  return { batchItemFailures: [] };
};

async function getRecordDataAsync(
  payload: KinesisStreamRecordPayload
): Promise<string> {
  const data = Buffer.from(payload.data, "base64").toString("utf-8");
  await Promise.resolve(1); // Placeholder for an async process
  return data;
}
```

最後に、Kinesis ストリームを作成し、`amplify/backend.ts` ファイルでイベントソースとして追加します:

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Stream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { KinesisEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myKinesisFunction } from "./functions/kinesis-function/resource";

const backend = defineBackend({
  auth,
  data,
  myKinesisFunction,
});

const kinesisStack = backend.createStack("kinesis-stack");

const kinesisStream = new Stream(kinesisStack, "KinesisStream", {
  streamName: "myKinesisStream",
  shardCount: 1,
});

const eventSource = new KinesisEventSource(kinesisStream, {
  startingPosition: StartingPosition.LATEST,
  reportBatchItemFailures: true,
});

backend.myKinesisFunction.resources.lambda.addEventSource(eventSource);
```

<!-- Platform: javascript, react-native, angular, nextjs, react, vue -->
フロントエンドから Kinesis ストリームへのストリーミング分析データの例については、[ストリーミング分析データ](/[platform]/frontend/analytics/streaming-data/) ドキュメントを参照してください。
<!-- /Platform -->

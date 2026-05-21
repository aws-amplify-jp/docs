---
title: "DynamoDB Streams"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-09T21:42:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/"
---

AWS Lambda では、Amazon DynamoDB、Amazon SQS など、様々なイベントソースをシームレスに統合して、リアルタイムイベントに応答する Lambda 関数をトリガーできます。この機能により、ポーリングサービスを必要とせず、データやシステム状態の変更に反応するレスポンシブなイベント駆動アプリケーションを構築できます。

このガイドでは、Amazon DynamoDB ストリームをイベントソースとして Lambda 関数を設定します。テーブルに項目が追加、更新、または削除されるたびに Lambda 関数が自動的にトリガーされ、データの変更に反応するリアルタイムアプリケーションを構築できます。この例では、GraphQL API のデータモデルによって作成された `Todo` テーブルを使用します。

開始するには、Lambda 関数に構造化ログ機能を提供する AWS Lambda Powertools Logger と、ハンドラー型を定義するために使用される `aws-lambda` パッケージをインストールします。

```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @aws-lambda-powertools/logger @types/aws-lambda
```

次に、新しいディレクトリとリソースファイル `amplify/functions/dynamoDB-function/resource.ts` を作成します。その後、`defineFunction` で関数を定義します。

```ts title="amplify/functions/dynamoDB-function/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const myDynamoDBFunction = defineFunction({
  name: "dynamoDB-function",
  resourceGroupName: "data",
});
```

次に、対応するハンドラーファイル `amplify/functions/dynamoDB-function/handler.ts` を次の内容で作成します。

```ts title="amplify/functions/dynamoDB-function/handler.ts"
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
```

最後に、`amplify/backend.ts` ファイルでイベントソースとして DynamoDB テーブルを作成します。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

const backend = defineBackend({
  auth,
  data,
  myDynamoDBFunction,
});

const todoTable = backend.data.resources.tables["Todo"];
const policy = new Policy(
  Stack.of(todoTable),
  "MyDynamoDBFunctionStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
  Stack.of(todoTable),
  "MyDynamoDBFunctionTodoEventStreamMapping",
  {
    target: backend.myDynamoDBFunction.resources.lambda,
    eventSourceArn: todoTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

mapping.node.addDependency(policy);
```

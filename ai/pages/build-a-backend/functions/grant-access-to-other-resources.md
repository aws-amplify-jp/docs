---
title: "他のリソースへのアクセスを許可する"
section: "build-a-backend/functions"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-11-01T21:19:44.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/"
---

Amplify Function が他のリソースと連携するために、アクセス権を付与する必要があります。Amplify Function に他のリソースへのアクセスを許可する方法は 2 つあります。

1. [`access` プロパティを使用する](#using-the-access-property)
2. [AWS Cloud Development Kit (CDK) を使用する](#using-cdk)

## `access` プロパティを使用する

`access` プロパティは、Amplify リソースを定義する各 `define*` 関数に見つかるプロパティです。一般的な言語を使用して必要なアクションを指定できます。

<Callout>

Amplify バックエンド内の別のリソースに関数アクセスを許可すると（[ストレージへのアクセス許可など](/[platform]/build-a-backend/storage/#resource-access)）、その関数のアクセス可能な AWS サービスに SDK 呼び出しを行うために環境変数が設定されます。これらの環境変数は型指定されており、`env` オブジェクトの一部として利用可能です。

</Callout>

Data リソースから毎月レポートを生成し、生成されたレポートを Storage に保存する必要がある関数があるとします。

```ts title="amplify/storage/resource.ts"
import { defineStorage } from '@aws-amplify/backend';
import { generateMonthlyReports } from '../functions/generate-monthly-reports/resource';

export const storage = defineStorage({
  name: 'myReports',
  access: (allow) => ({
    'reports/*': [
      allow.resource(generateMonthlyReports).to(['read', 'write', 'delete'])
    ]
  })
});
```

このアクセス定義により、環境変数 `myReports_BUCKET_NAME` が関数に追加されます。この環境変数は `env` オブジェクトでアクセスできます。

以下は、これを使用して S3 にコンテンツをアップロードする方法の例です。

```ts title="amplify/functions/generate-monthly-reports/handler.ts"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$amplify/env/generate-monthly-reports';

const s3Client = new S3Client();

export const handler = async () => {
  const command = new PutObjectCommand({
    Bucket: env.MY_REPORTS_BUCKET_NAME,
    Key: `reports/${new Date().toISOString()}.csv`,
    Body: new Blob([''], { type: 'text/csv;charset=utf-8;' })
  });

  await s3Client.send(command);
};
```

## CDK を使用する

`access` プロパティの機能では対応できない、リソースへのアクセスに関するアクセス許可が必要な場合は、CDK を使用する必要があります。

Function は[_実行ロール_](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)（Function が実行されるときにアクセスできるリソースを指定するポリシーを含む IAM ロール）を使用して作成されます。このロールは [`addToRolePolicy()`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.IFunction.html#addwbrtowbrrolewbrpolicystatement) メソッドを使用して拡張できます。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"
import * as iam from "aws-cdk-lib/aws-iam"
import * as sns from "aws-cdk-lib/aws-sns"
import { weeklyDigest } from "./functions/weekly-digest/resource"

const backend = defineBackend({
  weeklyDigest,
})

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda

const topicStack = backend.createStack("WeeklyDigest")
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest",
})

// highlight-start
const statement = new iam.PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["sns:Publish"],
  resources: [topic.topicArn],
})

weeklyDigestLambda.addToRolePolicy(statement)
  // highlight-end
```

ただし、一部のコンストラクトは `grant*` メソッドを提供して、一般的なポリシーアクションへのアクセスを許可します。上記の例を再度確認すると、`grantPublish` を使用して同じアクセスを許可できます。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"
import * as sns from "aws-cdk-lib/aws-sns"
import { weeklyDigest } from "./functions/weekly-digest/resource"

const backend = defineBackend({
  weeklyDigest,
})

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda

const topicStack = backend.createStack("WeeklyDigest")
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest"
})

// highlight-next-line
topic.grantPublish(weeklyDigestLambda)
```

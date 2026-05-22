---
title: "削除保護とバックアップリソース"
section: "build-a-backend/add-aws-services"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-11-19T20:21:50.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/deletion-backup-resources/"
---

> **Warning:** 削除保護が有効になっているリソースを含む Amplify サンドボックスを削除すると、デプロイプロセスが失敗し、リソースは AWS コンソールで手動削除する必要があります。

[AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/latest/guide/home.html) を使用することで、Amplify が生成したリソースで削除保護とバックアップをサポートされているリソースで有効にすることができます。たとえば、AWS CDK を使用して [DynamoDB テーブルのポイントインタイムリカバリ](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html) を有効にするか、[AWS Backup](https://aws.amazon.com/backup/) を高度なバックアップオプションとして使用できます。

基盤となる CDK コンストラクトプロパティを使用することで、リソース設定を変更できます。これにより、`define*` 関数で提供されるもの以上にバックエンドリソースをカスタマイズできます。

## Auth リソースで削除保護を有効にする

たとえば、Amplify Auth によって作成された Cognito ユーザープールリソースで削除保護を有効にしたい場合などです。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

// highlight-start
const { cfnUserPool } = backend.auth.resources.cfnResources
cfnUserPool.deletionProtection = "ACTIVE";
// highlight-end
```

## Data リソースで削除保護を有効にする

たとえば、GraphQL API によって作成されたすべての DynamoDB テーブルで削除保護を有効にしたい場合などです。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

// highlight-start
const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
for (const table of Object.values(amplifyDynamoDbTables)) {
  table.deletionProtectionEnabled = true;
}
// highlight-end
```

## DynamoDB テーブルでポイントインタイムリカバリを有効にする

たとえば、GraphQL API によって作成されたすべての DynamoDB テーブルでポイントインタイムリカバリを有効にします。デフォルトではポイントインタイムリカバリはバックアップを 35 日間保持します。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

// highlight-start
const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
for (const table of Object.values(amplifyDynamoDbTables)) {
  table.pointInTimeRecoveryEnabled = true;
}
// highlight-end
```

## DynamoDB テーブルのバックアップを有効にする

たとえば、DynamoDB テーブルが デフォルトの 35 日間のポイントインタイムリカバリを超えるバックアップが必要な場合、AWS Backup サービスを使用して DynamoDB テーブルのバックアップを一元化および自動化できます。
以下の例は、すべての DynamoDB テーブルに対して毎日深夜に実行するように設定されたバックアッププランの概要を示しています。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
// highlight-start
import {
  BackupPlan,
  BackupPlanRule,
  BackupResource,
  BackupVault,
} from "aws-cdk-lib/aws-backup";
import { Schedule } from "aws-cdk-lib/aws-events";
import { Duration } from "aws-cdk-lib/core";
// highlight-end
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

// highlight-start
const backupStack = backend.createStack("backup-stack");
const myTables = Object.values(backend.data.resources.tables);

const vault = new BackupVault(backupStack, "BackupVault", {
  backupVaultName: "backup-vault",
});

const plan = new BackupPlan(backupStack, "BackupPlan", {
  backupPlanName: "backup-plan",
  backupVault: vault,
});

plan.addRule(
  new BackupPlanRule({
    deleteAfter: Duration.days(60),
    ruleName: "backup-plan-rule",
    scheduleExpression: Schedule.cron({
      minute: "0",
      hour: "0",
      day: "*",
      month: "*",
      year: "*",
    }),
  })
);

plan.addSelection("BackupPlanSelection", {
  resources: myTables.map((table) => BackupResource.fromDynamoDbTable(table)),
  allowRestores: true,
});
// highlight-end
```

## スタック削除時にリソースを保持する

たとえば、スタック削除時にリソースを保持したい場合は、リソースの `applyRemovalPolicy` プロパティを使用して保持ポリシーを追加できます。

<Callout>

`ampx sandbox delete` はリソース削除ポリシーを無視し、常にすべてのリソースを削除します。

</Callout>

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { RemovalPolicy } from "aws-cdk-lib";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

// highlight-start
// スタック削除時に S3 バケットを保持
backend.storage.resources.bucket.applyRemovalPolicy(RemovalPolicy.RETAIN);

// スタック削除時に Cognito ユーザープールを保持
backend.auth.resources.userPool.applyRemovalPolicy(RemovalPolicy.RETAIN);

// スタック削除時に DynamoDB テーブルを保持
backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"].applyRemovalPolicy(RemovalPolicy.RETAIN);
// highlight-end
```

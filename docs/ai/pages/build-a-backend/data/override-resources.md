---
title: "Amplify生成のAWSリソースを変更する"
section: "build-a-backend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-15T16:14:40.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/override-resources/"
---

Amplify GraphQL APIは、様々な自動生成された基盤となるAWSサービスとリソースを使用します。これらの基盤となるリソースをカスタマイズして、デプロイされたスタックを特定のユースケースに最適化できます。

Amplifyアプリでは、CDK["L2"](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_using)または["L1"](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_l1_using)構築物を使用してすべての基盤となるリソースにアクセスできます。返されたスタックの`.resources`プロパティを使用してL2構築物として生成されたリソースにアクセスするか、`.resources.cfnResources`プロパティを使用してL1構築物として生成されたリソースにアクセスしてください。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

for (const table of Object.values(cfnResources.amplifyDynamoDbTables)) {
  table.pointInTimeRecoveryEnabled = true;
}
```

## Amplify生成のAppSync GraphQL APIリソースのカスタマイズ

すべてのカスタマイズを`backend.data.resources.graphqlApi`または`backend.data.resources.cfnResources.cfnGraphqlApi`に適用してください。例えば、AppSync GraphQL APIのX-Rayトレーシングを有効にするには:

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.cfnGraphqlApi.xrayEnabled = true;
```

## データモデル用のAmplify生成リソースのカスタマイズ

モデル型名を`backend.data.resources.amplifyDynamoDbTables["MODEL_NAME"]`に渡して、その特定のモデル型に対して生成されたリソースを変更してください。例えば、Todo `@model`型のDynamoDBテーブルでタイムトゥリブを有効にするには:

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables["Todo"].timeToLiveAttribute = {
  attributeName: "ttl",
  enabled: true,
};
```

### 例 - DynamoDBテーブルの請求モードを設定する

DynamoDBテーブルの[DynamoDB請求モード](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-billingmode)を「PROVISIONED」または「PAY_PER_REQUEST」に設定してください。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables['Todo'].billingMode = BillingMode.PAY_PER_REQUEST;
```

### 例 - DynamoDBテーブルのプロビジョニング済みスループットを設定する

各モデルテーブルとそのグローバルセカンダリインデックス(GSI)にプロビジョニングされたデフォルト[ProvisionedThroughput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput)をオーバーライドしてください。このオーバーライドは、「DynamoDBBillingMode」が「PROVISIONED」に設定されている場合にのみ有効です。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables["Todo"].provisionedThroughput = {
  readCapacityUnits: 5,
  writeCapacityUnits: 5,
};
```

### 例 - DynamoDBテーブルのポイントインタイムリカバリを有効にする

各モデルテーブルの[DynamoDBポイントインタイムリカバリ](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html)を有効/無効にしてください。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables['Todo'].pointInTimeRecoveryEnabled = true;
```

---
title: "関数のスケジューリング"
section: "build-a-backend/functions"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-02-12T16:04:46.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/"
---

Amplify は、自然言語または [cron 式](https://en.wikipedia.org/wiki/Cron) を使用して、特定の間隔で実行するように関数をスケジュールする機能を提供しています。開始するには、`defineFunction` で `schedule` プロパティを指定してください。

> **Info:** **注意:** `defineFunction` でスケジュールを構成することは、[カスタム関数](/[platform]/build-a-backend/functions/custom-functions/) ではサポートされていません。

```ts title="amplify/jobs/weekly-digest/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const weeklyDigest = defineFunction({
  name: "weekly-digest",
  schedule: "every week",
});
```

関数のスケジュールは [Amazon EventBridge ルール](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html) によって駆動されており、以下のようなユースケースに活用できます。

- 高パフォーマンスの投稿の「フロントページ」を生成する
- 高パフォーマンスの投稿の週刊ダイジェストを生成する
- 倉庫在庫の月次レポートを生成する

ハンドラーは `EventBridgeHandler` 型を使用して型付けできます。

```ts title="amplify/jobs/weekly-digest/handler.ts"
import type { EventBridgeHandler } from "aws-lambda";

export const handler: EventBridgeHandler<"Scheduled Event", null, void> = async (event) => {
  console.log("event", JSON.stringify(event, null, 2))
}
```

> **Info:** **注意**: AWS Lambda 型は以下でインストールできます。
> 
> ```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @types/aws-lambda
```

スケジュールは単一の間隔、または複数の間隔の場合があります。

```ts title="amplify/jobs/generate-report/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const generateReport = defineFunction({
  name: "generate-report",
  schedule: ["every week", "every month", "every year"],
});
```

スケジュールは省略形構文を使用して分または時間で実行するように定義することもできます。

```ts title="amplify/jobs/drink-some-water/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h"
})
```

または複合して複雑なスケジュールを作成することができます。

```ts title="amplify/jobs/remind-me/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me",
  schedule: [
    // every sunday at midnight
    "every week",
    // every tuesday at 5pm
    "0 17 ? * 3 *",
    // every wednesday at 5pm
    "0 17 ? * 4 *",
    // every thursday at 5pm
    "0 17 ? * 5 *",
    // every friday at 5pm
    "0 17 ? * 6 *",
  ]
})
```

## 自然言語を使用する

スケジュールは、毎日使う用語を使用して自然言語で記述できます。Amplify は以下の期間をサポートしています。

- `day` は常に真夜中に開始します
- `week` は常に日曜日の真夜中に開始します
- `month` は常に月の初日の真夜中に開始します
- `year` は常に年の初日の真夜中に開始します
- `m` は分の場合
- `h` は時間の場合

自然言語式の前には「every」を付けます。

```ts title="amplify/jobs/drink-some-water/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h"
})
```

## cron 式を使用する

スケジュールは cron 式を使用して記述できます。

```ts title="amplify/jobs/remind-me/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me-to-take-the-trash-out",
  schedule: [
    // every tuesday at 9am
    "0 9 ? * 3 *",
    // every friday at 9am
    "0 9 ? * 6 *",
  ]
})
```

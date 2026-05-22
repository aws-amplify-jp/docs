---
title: "ロギングを有効にする"
section: "build-a-backend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-13T22:13:21.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/enable-logging/"
---

ロギングを有効にして、Amazon CloudWatch ログを使用して GraphQL API をデバッグできます。GraphQL API のログとモニタリング機能の詳細については、[AWS AppSync のログとモニタリングに関するドキュメント](https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html)を参照してください。

## デフォルトロギング設定を有効にする

デフォルトロギングは、`defineData` の呼び出しで `logging` プロパティを `true` に設定することで有効にできます。例えば、以下のようにします：

```ts title="amplify/data/resource.ts"
export const data = defineData({
  // ...
  logging: true
});
```

`logging: true` を使用すると、以下のデフォルト設定が適用されます：
- `excludeVerboseContent: true`（[AppSync のリクエストレベルログ](https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html#cwl)を参照）
- `fieldLogLevel: 'none'`（[AppSync のフィールドレベルログ](https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html#cwl)を参照）
- `retention: '1 week'`（[Enum RetentionDays](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.RetentionDays.html)を参照）

## ロギング設定をカスタマイズする

[`DataLogConfig`](#datalogconfig-fields) オブジェクトを提供することで、個別の設定値をカスタマイズできます。例えば、以下のようにします：

```ts title="amplify/data/resource.ts"
export const data = defineData({
  // ...
  logging: {
    excludeVerboseContent: false,
    fieldLogLevel: 'all',
    retention: '1 month'
  }
});
```

> **Warning:** **警告**: `excludeVerboseContent` を `false` に設定すると、機密データを含む可能性がある完全なクエリとユーザーパラメータがログに出力されます。CloudWatch ログへのアクセスを、IAM ポリシーを慎重にスコープすることで、実際に必要とするロールまたはユーザー（例えば DevOps または開発者）のみに限定することをお勧めします。

## 設定プロパティ

### `logging`
- `true`: デフォルトロギングを有効にします。
- `DataLogConfig` オブジェクト: 1 つ以上のデフォルトフィールドをオーバーライドします。

### `DataLogConfig` フィールド

- **`excludeVerboseContent?: boolean`**
  - デフォルト値は `true`
  - `false` の場合、ログにリクエストレベルログが含まれる可能性があります。[AppSync のリクエストレベルログ](https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html#cwl)を参照してください。

- **`fieldLogLevel?: DataLogLevel`**
  - デフォルト値は `'none'`
  - [AppSync のフィールドログレベル](https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html#cwl)でサポートされている値：
    - `'none'`
    - `'error'`
    - `'info'`
    - `'debug'`
    - `'all'`

- **`retention?: LogRetention`**
  - ログを保持する日数
  - デフォルト値は `'1 week'`
  - [Enum RetentionDays](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.RetentionDays.html)でサポートされている値：
    - `'1 day'`
    - `'3 days'`
    - `'5 days'`
    - `'1 week'`
    - `'2 weeks'`
    - `'1 month'`
    - `'2 months'`
    - `'3 months'`
    - `'4 months'`
    - `'5 months'`
    - `'6 months'`
    - `'1 year'`
    - `'13 months'`
    - `'18 months'`
    - `'2 years'`
    - `'5 years'`
    - `'10 years'`
    - `'infinite'`

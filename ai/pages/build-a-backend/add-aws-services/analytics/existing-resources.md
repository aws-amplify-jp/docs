---
title: "既存のAWSリソースを使用する"
section: "build-a-backend/add-aws-services/analytics"
platforms: ["swift", "android", "flutter", "javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2025-02-07T19:05:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/analytics/existing-resources/"
---

既存のAmazon PinpointリソースをAmplifyバックエンドまたはフロントエンドアプリケーションで使用するには、`addOutput`メソッドを使用して、バックエンドリソースの出力を`amplify_outputs.json`ファイルに表示します：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"

const backend = defineBackend({})

backend.addOutput({
  analytics: {
    amazon_pinpoint: {
      aws_region: "<your-aws-region>",
      app_id: "<your-pinpoint-app-id>",
    },
  },
})
```

<!-- Platform: javascript, react-native, angular, nextjs, react, vue -->
## クライアントライブラリの直接設定

別の方法として、`Amplify.configure()`を使用してクライアントライブラリを直接設定できます。この手動セットアップにより、アプリケーションで既存のAmazon Pinpointリソースを使用できます。

```ts title="src/main.ts"
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  Analytics: {
    ...amplifyConfig.Analytics,
    Pinpoint: {
      // 必須 - Amazon Pinpoint App Client ID
      appId: 'XXXXXXXXXXabcdefghij1234567890ab',

      // 必須 - AWSサービスリージョン
      region: 'us-east-1',

      // オプション - 一度にバッファリングできるイベント数
      bufferSize: 1000,

      // オプション - バッファからバッチごとにフラッシュされるイベント数
      flushSize: 100,

      // オプション - バッファチェックを実行し、必要に応じてフラッシュするミリ秒単位の間隔
      flushInterval: 5000, // 5s

      // オプション - 失敗した記録の再試行制限
      resendLimit: 5
    }
  }
});
```
<!-- /Platform -->

## IAMポリシーの更新

Amazon Pinpointは`record`および`identifyUser` APIを使用するために、AWS Identity and Access Management (IAM)ポリシーが必要です：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["mobiletargeting:UpdateEndpoint", "mobiletargeting:PutEvents"],
      "Resource": ["arn:aws:mobiletargeting:*:<your-account-id>:apps/<your-pinpoint-app-id>*"]
    }
  ]
}
```

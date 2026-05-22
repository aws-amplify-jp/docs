---
title: "既存のAWSリソースを使用する"
section: "build-a-backend/add-aws-services/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2025-02-07T19:05:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/rest-api/existing-resources/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

既存の Amazon API Gateway リソースは、`Amplify.configure()` を呼び出して API Gateway API 名とオプションを参照することで、Amplify ライブラリで使用できます。`Amplify.configure()` を呼び出す前に、`parseAmplifyConfig` を使用して Amplify 設定を解析する必要があることに注意してください。以下の例は、既存の Amplify アプリケーションに API Gateway リソースを追加で設定する方法を示しています。

```ts
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

// Add existing resource to the existing configuration.
Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: {
      ...amplifyConfig.API?.REST,
      YourAPIName: {
        endpoint:
          'https://abcdefghij1234567890.execute-api.us-east-1.amazonaws.com/stageName',
        region: 'us-east-1' // Optional
      }
    }
  }
});
```

- **YourAPIName**: API のフレンドリー名
  - **endpoint**: API の HTTPS エンドポイント
  - **region**: リソースがプロビジョニングされている AWS リージョン。指定されない場合、リージョンはエンドポイントから推測されます。

AWS リソースをアプリケーションに追加する前に、アプリケーションに Amplify ライブラリがインストールされている必要があることに注意してください。このステップを実行する必要がある場合は、[Amplify ライブラリのインストール](/[platform]/build-a-backend/add-aws-services/rest-api/set-up-rest-api/#install-amplify-libraries)を参照してください。

---
title: "CDKを使用してAmplify生成Lambda リソースを変更する"
section: "build-a-backend/functions"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-16T15:59:30.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/modify-resources-with-cdk/"
---

Amplify Functionsは、[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)の[`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html)コンストラクトを使用しています。バックエンドでリソースを設定した後、CDKを使用して基盤となるリソースを変更、オーバーライド、または拡張できます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { myFunction } from './functions/my-function';

const backend = defineBackend({
  myFunction
})

// CDK構築は以下を経由してアクセスできます
backend.myFunction.resources

// Lambda関数は以下で見つけることができます
backend.myFunction.resources.lambda
```

利用可能なLambdaリソースは、[`IFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.IFunction.html)の表現です。

## IAMポリシーの追加

Functionの実行ロールにIAMポリシーを追加する方法については、[他のリソースへのアクセス権を付与するためのドキュメント](/[platform]/build-a-backend/functions/grant-access-to-other-resources#using-cdk)を参照してください。

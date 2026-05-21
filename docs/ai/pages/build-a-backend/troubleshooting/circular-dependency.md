---
title: "循環依存の問題のトラブルシューティング"
section: "build-a-backend/troubleshooting"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2025-01-06T16:46:31.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/troubleshooting/circular-dependency/"
---

Amplify Gen 2 アプリをデプロイするときに、Amplify Console のバックエンドビルド中またはサンドボックス実行中に `The CloudFormation deployment failed due to circular dependency` というエラーメッセージが表示される場合があります。このエラーは、CloudFormation のネストされたスタック間、または単一の CloudFormation スタック内のリソース間の循環依存が原因で発生します。

## ネストされたスタック間の循環依存エラー

「The CloudFormation deployment failed due to circular dependency found between nested stacks [data1234ABCD, function6789XYZ]」というエラーが表示される場合、`data` のネストされたスタックと `function` のネストされたスタックの間に循環依存があることを意味します。例えば、`function` をクエリハンドラーとして使用していても、その `function` がデータ（または `AppSync`）API にアクセスする必要がある場合は、この問題が発生する可能性があります。解決するには、この `function` を `data` スタック内の他のリソースとグループ化してください。

```ts title="amplify/functions/my-function/resource.ts"
export const queryFunction = defineFunction({
  name: 'query-function',
  resourceGroupName: 'data',
});
```

同様に、`function` を認証トリガーとして使用している場合は、`function` を `auth` スタック内の他のリソースとグループ化して、循環依存を解決できます。

```ts title="amplify/functions/my-function/resource.ts"
export const preSignUpTrigger = defineFunction({
  name: 'pre-sign-up',
  resourceGroupName: 'auth',
});
```

関数の `resourceGroupName` プロパティを使用してこのエラーを解決できない場合は、[Amplify バックエンド GitHub リポジトリで issue を作成してください](https://github.com/aws-amplify/amplify-backend/issues/new/choose)。

### カスタムスタックでの循環依存エラー

[AWS Cloud Development Kit（AWS CDK）](https://aws.amazon.com/cdk/) を使用してリソースを作成し、カスタムスタックに割り当てている場合も、この問題が発生する可能性があります。エラーメッセージは「The CloudFormation deployment failed due to circular dependency found between nested stacks [storage1234ABCD, auth5678XYZ, **MYCustomStack0123AB**]」のようなものです。

これを解決するには、相互作用しようとしているリソースと同じスタック内でリソースを作成してみてください。例えば、`sqs` などのカスタムリソースが `defineStorage` で作成された Amazon S3 リソースと相互作用する必要がある場合は、その `sqs` リソースを Amplify で作成されたスタック内に作成できます。以下のように既存の Amplify で作成されたスタックを参照できます。

```ts title="amplify/backend.ts"
const queue = new sqs.Queue(backend.storage.stack, 'MyCustomQueue');
```

## 同じスタック内のリソース間の循環依存エラー

「The CloudFormation deployment failed due to circular dependency found between resources [resource1, resource2] in a single stack」というエラーが表示される場合は、リソース自体が同じスタック内に循環依存を持つことを意味します。このようなエラーを処理するために、[循環依存エラーの処理に関する AWS ブログ記事](https://aws.amazon.com/blogs/infrastructure-and-automation/handling-circular-dependency-errors-in-aws-cloudformation/) を確認してください。

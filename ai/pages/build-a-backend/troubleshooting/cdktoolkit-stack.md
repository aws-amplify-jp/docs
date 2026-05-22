---
title: "CDKToolkit スタックの問題をトラブルシューティング"
section: "build-a-backend/troubleshooting"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-30T22:19:37.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/troubleshooting/cdktoolkit-stack/"
---

AWS Amplify では、アカウントにリソースをデプロイするために、AWS アカウントとリージョンを_ブートストラップ_する必要があります。Amplify は [AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) を使用してバックエンドリソース設定をスキャフォールドし、ブートストラップ処理によって作成された補足リソースを使用してデプロイを調整します。

> _ブートストラップ_は、AWS 環境を AWS Cloud Development Kit (AWS CDK) で使用するために準備するプロセスです。CDK スタックを AWS 環境にデプロイする前に、環境をまずブートストラップする必要があります。

ブートストラップの詳細については、[AWS CDK のブートストラップ概念に関する AWS ドキュメント](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)を参照してください。

## アカウントのブートストラップエラー

Amplify アプリケーションをデプロイするときに、現在のアカウント ID とリージョンのブートストラップを完了するために Amplify Console にリダイレクトされることがあります。このプロセスでエラーが発生した場合は、次のメッセージが表示されます。

```text title="Amplify Console" showLineNumbers={false}
Error bootstrapping account in region "<your-aws-region>". There is an issue with the CDKToolkit stack which must be resolved manually.
```

これは通常、`CDKToolkit` スタック内の 1 つ以上のリソースの作成または更新に失敗したことを示します。[AWS CloudFormation コンソール](https://us-east-1.console.aws.amazon.com/cloudformation/home)に移動し、`CDKToolkit` スタックを選択して、「Events」タブを選択し、リソースイベントを表示します。ここで、対応する[アセットバケット](https://docs.aws.amazon.com/cdk/v2/guide/assets.html)の問題またはデプロイに使用される IAM ロールの問題を特定できます。

ブラウザベースの [AWS CloudShell](https://aws.amazon.com/cloudshell/) を使用して `CDKToolkit` スタックを手動で更新することで軽減できます。

```bash title="AWS CloudShell" showLineNumbers={false}
cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/$AWS_REGION
```

または、ターミナルから AWS CDK CLI を使用して `bootstrap` を実行します。

```bash title="Terminal" showLineNumbers={false}
npx aws-cdk@latest bootstrap aws://<your-aws-account-id>/<your-aws-region>
```

上記の回避策を適用した後もこの問題が続く場合は、[Amplify Backend の GitHub リポジトリ](https://github.com/aws-amplify/amplify-backend)で問題を報告してください。

## スタック CDKToolkit は既に存在します

Amplify アプリケーションを初めてデプロイしていて、CDK を使用するために AWS アカウントを以前にブートストラップしており、Amplify Console で以下のエラーが発生した場合:

```text title="Amplify Console" showLineNumbers={false}
Build error!
Stack [CDKToolkit] already exists
```

ブラウザベースの [AWS CloudShell](https://aws.amazon.com/cloudshell/) を使用して `CDKToolkit` スタックを手動で更新することで軽減できます。

```bash title="AWS CloudShell" showLineNumbers={false}
cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/$AWS_REGION
```

または、ターミナルから AWS CDK CLI を使用して `bootstrap` を実行します。

```bash title="Terminal" showLineNumbers={false}
npx aws-cdk@latest bootstrap aws://<your-aws-account-id>/<your-aws-region>
```

上記の回避策を適用した後もこの問題が続く場合は、[Amplify Backend の GitHub リポジトリ](https://github.com/aws-amplify/amplify-backend)で問題を報告してください。

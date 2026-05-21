---
title: "CDK constructs"
section: "reference"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-16T15:59:30.000Z"
url: "https://docs.amplify.aws/react/reference/cdk-constructs/"
---

Constructs（[AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) アプリケーションの基本的なビルディングブロック）は、クラウドリソースの設定の複雑さを抽象化するため、アプリケーションコードに集中できます。以下のセクションでは、利用可能な Amplify バックエンド Constructs の概要を説明します。

## Amplify Data

公式の `AmplifyData` Construct は [Construct Hub](https://constructs.dev/packages/@aws-amplify/data-construct/?lang=typescript) で見つけることができます。

<Callout>
このパッケージは、Amplify GraphQL API の動作をラップする Level 3 (L3) CDK Construct を提供します。これにより、Amplify GraphQL ディレクティブをサポートする AppSync API の迅速な開発と反復が可能になります。
</Callout>

データモデリングの詳細については、[データモデリングドキュメント](/[platform]/build-a-backend/data/data-modeling) をご覧ください。

## Amplify Auth

公式の `AmplifyAuth` Construct は [npm registry](https://www.npmjs.com/package/@aws-amplify/auth-construct) で見つけることができます。

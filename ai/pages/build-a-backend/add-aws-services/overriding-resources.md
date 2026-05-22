---
title: "リソースのオーバーライド"
section: "build-a-backend/add-aws-services"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-11T16:03:58.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/overriding-resources/"
---

> **Warning:** オーバーライドを使用することで、Amplify ライブラリまたはクライアント設定が正しく解釈できないバックエンドを作成する可能性があります。常にステージング環境で変更をテストしてください。

リソースを定義する際、基礎となる [AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/latest/guide/home.html) コンストラクトプロパティにアクセスしてリソース設定を変更できます。これにより、`define*` 関数で提供されるもの以上のカスタマイズでバックエンドリソースをカスタマイズできます。

オーバーライドは `amplify/backend.ts` ファイルで `defineBackend` 呼び出しの後に定義されます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

// overrides go here
```

`backend` オブジェクトは `defineBackend` 関数に渡されたコンポーネントごとにオブジェクトを含む `resources` プロパティを公開します。各リソースオブジェクトは、変更可能な基礎となる L1 および L2 AWS CDK コンストラクトを公開します。

たとえば、`defineAuth` によって作成された Cognito ユーザープールにアクセスし、リソースにカスタムの削除ポリシーを設定する方法は以下の通りです。

```ts title="amplify/backend.ts"
import { RemovalPolicy } from 'aws-cdk-lib';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

const backend = defineBackend({
  auth
});

const userPool = backend.auth.resources.userPool;
userPool.applyRemovalPolicy(RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE);
```

`define*` 関数で使用されるほとんどの L1 および L2 AWS CDK コンストラクトはこのようにアクセス可能です。

## 例 - リソース間のアクセス権限を付与

`defineFunction` で作成された関数に、`defineAuth` で作成された Cognito ユーザープールを呼び出すアクセス権限を付与したい場合を考えます。ほとんどの場合、[`defineAuth` の `access` プロパティ](/[platform]/build-a-backend/auth/grant-access-to-auth-resources/)を使用することが推奨されていますが、このプロパティで公開されていない権限については、次のオーバーライドで実現できます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { authAuditorFunction } from './functions/auth-auditor-function/resource';

const backend = defineBackend({
  auth,
  data,
  authAuditorFunction,
});

const userPool = backend.auth.resources.userPool;
const lambdaFunction = backend.authAuditorFunction.resources.lambda;

// grant the lambdaFunction access to list auth events for a particular user
userPool.grant(lambdaFunction, 'cognito:AdminListUserAuthEvents');

// pass the Lambda the UserPool ID so that the Lambda can use it to make SDK calls
backend.authAuditorFunction.addEnvironment('USER_POOL_ID', userPool.userPoolId);
```

## 例 - L1 CDK コンストラクトを変更

AWS CDK コンストラクトで `addPropertyOverride` を使用してプロパティをミューテートすることで、生の CloudFormation すべての方法に到達することができます。`defineAuth` の Cognito ユーザープールのパスワードポリシーを編集するには、次のコードを使用できます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

const backend = defineBackend({
  auth,
});
// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// modify cfnUserPool policies directly
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 10,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true,
    temporaryPasswordValidityDays: 20,
  },
};
```

`auth.resources.cfnResources` の使用に注意してください。このプロパティは、基礎となる CloudFormation プロパティと 1 対 1 にマップする [L1 CDK コンストラクト](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_l1_using)を公開します。

上記の例の `auth.resources.cfnResources.cfnUserPool` プロパティは、[AWS::Cognito::UserPool CloudFormation リソース](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html)に直接マップされます。

これは最初の例の `auth.resources.userPool` とは異なり、これは複数の関連 L1 コンストラクト周辺の便利なインターフェースを提供する [L2 CDK コンストラクト](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_using)です。

アプリバックエンドのさらにカスタマイズが必要な場合は、[カスタムリソース](/[platform]/build-a-backend/add-aws-services/custom-resources)のドキュメントを参照してください。

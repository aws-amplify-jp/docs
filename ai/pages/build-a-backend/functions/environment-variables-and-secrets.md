---
title: "環境変数とシークレット"
section: "build-a-backend/functions"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-22T17:49:49.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/"
---

Amplify Functions は `defineFunction` の `environment` プロパティで環境変数とシークレットを設定できます。

> **Warning:** **注意:** シークレット値を環境変数に保存しないでください。環境変数の値は `.amplify/artifacts` に存在するビルドアーティファクトにプレーンテキストでレンダリングされ、CloudFormation スタックイベントメッセージに送出される場合があります。シークレットを保存するには、[シークレットセクションをスキップしてください](#secrets)

> **Info:** **注意:** `defineFunction` での環境変数とシークレット設定は [カスタム関数](/[platform]/build-a-backend/functions/custom-functions/) ではサポートされていません。

## 環境変数

環境変数は `defineFunction` で `environment` プロパティを使用して設定できます。

```ts title="amplify/functions/say-hello/resource.ts"
import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    NAME: 'World'
  }
});
```

ここで指定された環境変数はすべて、実行時に関数で利用可能になります。

一部の環境変数はすべてのブランチとデプロイメント間で一定です。しかし、多くの環境値はデプロイメント環境によって異なります。[Amplify ホスティングデプロイメント用のブランチ固有の環境変数を設定できます](/[platform]/deploy-and-host/fullstack-branching/secrets-and-vars/)。

ホスティングで「API_ENDPOINT」というブランチ固有の環境変数を作成し、「staging」ブランチと「prod」ブランチで異なる値を持つ場合を想定しましょう。その値を関数で利用できるようにするには、以下を使用して関数に渡します。

```ts title="amplify/functions/say-hello/resource.ts"
export const sayHello = defineFunction({
  environment: {
    NAME: "World",
    API_ENDPOINT: process.env.API_ENDPOINT
  }
});
```

### 環境変数へのアクセス

関数ハンドラー内では、Node ランタイムで提供される通常の `process.env` グローバルオブジェクトを使用して環境変数にアクセスできます。ただし、実行時にどの環境変数が利用可能かを簡単に発見することはできません。Amplify は関数ハンドラーで使用でき、実行時に利用可能なすべての変数のタイピングを提供する `env` シンボルを生成します。次のコードをコピーして使用してください。

```ts title="amplify/functions/say-hello/handler.ts"
// highlight-next-line
import { env } from '$amplify/env/say-hello'; // import は '$amplify/env/<function-name>'

export const handler = async (event) => {
  // env オブジェクトには、関数で利用可能なすべての環境変数のインテリセンスがあります
  return `Hello, ${env.NAME}!`;
};
```

<Accordion title='"env" シンボルを理解し、Amplify プロジェクトを手動で設定する方法' headingLevel='4' eyebrow='詳細情報'>

[AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) の合成終了時に、Amplify は実行時に関数で利用可能な環境変数の名前を収集し、ファイル `.amplify/generated/env/<function-name>.ts` を生成します。

[`create-amplify`](https://www.npmjs.com/package/create-amplify) を使用してプロジェクトを作成した場合、Amplify は既に `env` シンボルを使用するようにプロジェクトを設定しています。

そうでない場合は、プロジェクトを手動で設定する必要があります。`amplify/tsconfig.json` ファイル内で、`paths` コンパイラオプションを追加します。

```json title="amplify/tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "$amplify/*": ["../.amplify/generated/*"]
    }
  }
}
```

</details>

### 生成された env ファイル

関数を環境変数またはシークレットで設定すると、Amplify のバックエンド ツーリングは関数の `name` を使用して `.amplify/generated` にファイルを生成し、環境変数とシークレット、および [Lambda ランタイムで事前定義された環境変数](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime) への参照を含めます。これにより、`process.env` を手動で入力する必要がない、環境変数を操作するためのタイプセーフなエクスペリエンスが提供されます。

> **Info:** **注意:** 生成されたファイルは `ampx sandbox` または `ampx pipeline-deploy` を実行するときにデプロイメント前に作成されます

たとえば、次の定義を持つ関数がある場合:

```ts title="amplify/functions/say-hello/resource.ts"
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  environment: {
    NAME: "World",
  },
});
```

次のデプロイメントを開始すると、Amplify は次の場所にファイルを作成します:

```
.amplify/generated/env/say-hello.ts
```

TypeScript パスエイリアス `$amplify` を使用して、関数のハンドラーにファイルをインポートできます:

```ts title="amplify/functions/say-hello/handler.ts"
import { env } from "$amplify/env/say-hello"

export const handler = async (event) => {
  // env オブジェクトには、関数で利用可能なすべての環境変数のインテリセンスがあります
  return `Hello, ${env.NAME}!`;
};
```

このファイルで問題が発生していますか? [「`Cannot find module $amplify/env/<function-name>`」のトラブルシューティングガイドをご覧ください](/[platform]/build-a-backend/troubleshooting/cannot-find-module-amplify-env/)

## シークレット

関数にシークレット値を提供する必要がある場合があります。たとえば、データベースパスワードや API キーを必要とする場合があります。環境変数は関数設定にプレーンテキストで含まれるため、この目的には使用すべきではありません。代わりに、シークレットアクセスを使用できます。

関数でシークレットを使用する前に、[シークレットを定義](/[platform]/deploy-and-host/fullstack-branching/secrets-and-vars/#set-secrets) する必要があります。シークレットを定義した後、関数設定でそれを参照できます。

```ts title="amplify/functions/say-hello/resource.ts"
import { defineFunction, secret } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    NAME: "World",
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_KEY: secret('MY_API_KEY') // これは、「MY_API_KEY」という名前のシークレットを作成したことを想定しています
  }
});
```

このシークレット値は、実行時に他の環境変数と同じ方法で関数で使用できます。ただし、環境変数の値は関数設定の一部として保存されていないことに気付くでしょう。代わりに、値は関数の実行時にフェッチされ、メモリで提供されます。

```ts title="amplify/functions/say-hello/handler.ts"
import { env } from '$amplify/env/say-hello';

export const handler = async (event) => {
  const request = new Request(env.API_ENDPOINT, {
    headers: {
      // これは「MY_API_KEY」という名前のシークレットの値です
      Authorization: `Bearer ${env.API_KEY}`
    }
  })
  // ...
  return `Hello, ${env.NAME}!`;
};
```

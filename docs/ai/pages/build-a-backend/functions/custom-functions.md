---
title: "カスタム関数"
section: "build-a-backend/functions"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-24T20:19:47.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/custom-functions/"
---

AWS Amplify Gen 2関数は、Amplifyアプリでタスクを実行し、ワークフローをカスタマイズするために使用できるAWS Lambda関数です。関数はNode.js、Python、Go、または[AWS Lambdaがサポートするその他の言語](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)で記述できます。

> **Warning:** **注意:** [フルスタックGitベースの環境](https://docs.amplify.aws/react/how-amplify-works/concepts/#fullstack-git-based-environments)は、デフォルトではDockerを使った関数のバンドリングをサポートしていません。詳細は[Dockerセクションをスキップ](#docker)してください。

> **Info:** **注意:** `defineFunction`の以下のオプションはカスタム関数ではサポートされていません:
> - [環境変数とシークレット](/[platform]/build-a-backend/functions/environment-variables-and-secrets/)
> - [スケジューリング設定](/[platform]/build-a-backend/functions/scheduling-functions/) 
> - [Lambdaレイヤー](/[platform]/build-a-backend/functions/add-lambda-layers/)
> - [関数オプション](/[platform]/build-a-backend/functions/configure-functions/)
> 
> これらのオプションは、CDK Function定義で直接設定する必要があります。ただし、`resourceGroupName`プロパティはサポートされており、`defineFunction`定義内で関連リソースをグループ化するために使用できます。

このガイドでは、Amplify関数を使用してPythonとGo関数を作成する方法を学びます。このガイドに示されている例は、Dockerを使用して関数をビルドしません。代わりに、ホストシステムで実行されるコマンドを使用してビルドするため、使用する言語に必要なツールが必要です。

## Python

開始するには、新しいディレクトリとリソースファイル`amplify/functions/say-hello/resource.ts`を作成します。次に、`defineFunction`を使用して関数を定義します:
```ts title="amplify/functions/say-hello/resource.ts"
import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const sayHelloFunctionHandler = defineFunction(
  (scope) =>
    new Function(scope, "say-hello", {
      handler: "index.handler",
      runtime: Runtime.PYTHON_3_9, // or any other python version
      timeout: Duration.seconds(20), //  default is 3 seconds
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("dummy"), // replace with desired image from AWS ECR Public Gallery
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `python3 -m pip install -r ${path.join(functionDir, "requirements.txt")} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    }),
    {
      resourceGroupName: "auth" // Optional: Groups this function with auth resource
    }
);
```

次に、`amplify/functions/say-hello/index.py`に対応するハンドラーファイルを作成します。これが関数コードの場所です。

```ts title="amplify/functions/say-hello/index.py"
import json

def handler(event, context):
  return {
      "statusCode": 200,
      "body": json.dumps({
          "message": "Hello World",
      }),
  }
```

ハンドラーファイルは「handler」という名前の関数をエクスポートする必要があります。これは関数のエントリーポイントです。関数の記述の詳細については、[Pythonを使用するLambda関数ハンドラーに関するAWSドキュメント](https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html)を参照してください。

Pythonパッケージが必要な場合は、ハンドラーファイルと同じディレクトリに`requirements.txt`ファイルを追加できます。`Code.fromAsset`メソッドの`bundling`オプションがこれらのパッケージをインストールします。
ハンドラーファイルと同じディレクトリに`requirements.txt`ファイルを作成します。このファイルには、インストールするパッケージの名前が含まれている必要があります。例えば:

```txt title="amplify/functions/say-hello/requirements.txt"
request==2.25.1
some-other-package>=1.0.0
```

これでPython関数をデプロイする準備ができました。次はNode.js/TypeScript関数と同じプロセスです。[すべての言語に共通のステップ](#common-steps-for-all-languages)に進んでください。

## Go
開始するには、新しいディレクトリとリソースファイル`amplify/functions/say-hello/resource.ts`を作成します。次に、`defineFunction`を使用して関数を定義します:

```ts title="amplify/functions/say-hello/resource.ts"
import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const sayHelloFunctionHandler = defineFunction(
  (scope) =>
    new Function(scope, "say-hello", {
      handler: "bootstrap",
      runtime: Runtime.PROVIDED_AL2023,
      timeout: Duration.seconds(3), //  default is 3 seconds
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("dummy"),
          local: {
            tryBundle(outputDir: string) {
              execSync(`rsync -rLv ${functionDir}/* ${path.join(outputDir)}`);
              execSync(
                `cd ${path.join(outputDir)} && GOARCH=amd64 GOOS=linux go build -tags lambda.norpc -o ${path.join(outputDir)}/bootstrap ${functionDir}/main.go`
              );
              return true;
            },
          },
        },
      }),
    }),
    {
      resourceGroupName: "auth" // Optional: Groups this function with auth resource
    }
);
```

次に、`amplify/functions/say-hello/main.go`に対応するハンドラーファイルを作成します。これが関数コードの場所です。

```go title="amplify/functions/say-hello/main.go"
package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Arguments Arguments `json:"arguments"`
}

type Arguments struct {
	Title string `json:"phone"`
	Msg   string `json:"msg"`
}

func HandleRequest(ctx context.Context, event Event) (string, error) {
	fmt.Println("Received event: ", event)

	// fmt.Println("Message sent to: ", event.Arguments.Msg)
	// You can use lambda arguments in your code

	return "Hello World!", nil
}

func main() {
	lambda.Start(HandleRequest)
}
```

次に、以下のコマンドを実行してGo関数をビルドする必要があります:
```bash title="terminal" showLineNumbers={false}
go mod init lambda
```
次に、依存関係をインストールするために実行します。

```bash title="terminal" showLineNumbers={false}
go mod tidy
```

これでGolang関数をデプロイする準備ができました。次はNode.js/TypeScript関数と同じプロセスです。

## すべての言語に共通のステップ

使用される言語に関わらず、関数をバックエンドに追加する必要があります。
```ts title="amplify/backend.ts"
// highlight-next-line
import { sayHelloFunctionHandler } from './functions/say-hello/resource';

defineBackend({
  // highlight-next-line
  sayHelloFunctionHandler,
});
```

`npx ampx sandbox`を実行するか、Amplifyにアプリをデプロイすると、関数が含まれます。

関数を呼び出すには、[Amplify Dataリソースでカスタムクエリのハンドラーとして関数を追加する](/[platform]/build-a-backend/data/custom-business-logic/)ことをお勧めします。開始するには、`amplify/data/resource.ts`ファイルを開き、スキーマで新しいクエリを指定します:

```ts title="amplify/data/resource.ts"
import { sayHelloFunctionHandler } from "../functions/say-hello/resource"

const schema = a.schema({
  // highlight-start
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHelloFunctionHandler)),
  // highlight-end
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
})
```

## Docker

カスタム関数は、関数コードをビルドしてバンドルするために[Docker](https://www.docker.com/)が必要な場合があります。`CustomFunctionProviderDockerError`エラーでデプロイが失敗した場合は、カスタム関数がDockerを必要としているが、Dockerデーモンが見つからなかったことを示します。その場合は、ランタイムで動作するDocker インストールを提供する必要があります。

### パーソナルサンドボックス

コンピューターにDockerがインストールされており、Dockerデーモンが実行されていることを確認してください。以下のコマンドを使用してDockerデーモンが実行されているかどうかを確認できます:
```bash title="terminal" showLineNumbers={false}
docker info
```

### フルスタックGitベースの環境

Amplifyは、ブランチデプロイメント中、すぐにDockerデーモンを提供しません。ただし、[Amplify要件を満たし、Dockerインストール含む独自のイメージを提供](https://docs.aws.amazon.com/amplify/latest/userguide/custom-build-image.html)するオプションがあります。

例えば、`aws/codebuild/amazonlinux-x86_64-standard:5.0`イメージ([定義を参照](https://github.com/aws/aws-codebuild-docker-images))はAmplify要件を満たし、Dockerインストールを含みます。

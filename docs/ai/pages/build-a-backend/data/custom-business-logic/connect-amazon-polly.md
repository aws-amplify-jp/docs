---
title: "Amazon Pollyへの接続（テキスト音声変換API）"
section: "build-a-backend/data/custom-business-logic"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-14T20:52:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/"
---

Amazon Pollyは、Amazon Web Services（AWS）が提供するテキスト音声変換（TTS）サービスです。高度なディープラーニング技術を使用して、書き込まれたテキストを自然な音声に変換し、様々な言語と音声を持つアプリケーションを作成できます。

Amazon Pollyを使用すると、アプリケーションに音声インタラクションとアクセシビリティ機能を簡単に追加できます。このサービスは、視覚障害者向けの音声コンテンツの提供、eラーニング体験の強化、インタラクティブ音声応答（IVR）システムの作成など、幅広いユースケースをサポートしています。

Amazon Pollyの主な機能は次のとおりです：

- **複数の音声と言語**: Amazon Pollyは、様々な言語と方言にわたって数十の音声をサポートしており、ユースケースに最適な音声を選択する柔軟性を提供します。

- **高品質なスピーチ**: Amazon Pollyのニューラルおよび標準音声は、自然でリアルな音声品質を提供します。

- **スピーチマークとスピーチ合成マークアップ言語**: スピーチ合成マークアップ言語タグで音声出力をカスタマイズし、スピーチマークで音声タイミング情報を取得します。

- **スケーラブルで費用効果的**: Amazon Pollyの従量課金制価格モデルにより、アプリケーションに音声機能を追加するための費用効果的なソリューションになります。

このセクションでは、AWS AmplifyでAmazon Pollyをアプリケーションに統合する方法を学びます。これにより、強力なテキスト音声変換機能をシームレスに活用できます。

## ステップ1 - プロジェクトをセットアップする

[クイックスタートガイド](/[platform]/start/quickstart/)の指示に従ってプロジェクトをセットアップします。

## ステップ2 - Pollyライブラリをインストールする
AWS SDKを使用してAmazon Pollyサービスを呼び出す新しいAPIエンドポイントを作成します。Amazon Polly SDKをインストールするには、プロジェクトのルートフォルダで次のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-sdk/client-polly
```

## ステップ3 - ストレージをセットアップする

`amplify/storage/resource.ts`というファイルを作成し、以下のコンテンツを追加してストレージリソースを設定します：

```ts title="amplify/storage/resource.ts"
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'predictions_gen2'
});

```

## ステップ4 - IAMロールを設定する

Amazon Pollyサービスにアクセスするには、Lambdaが目的の機能を効果的に利用するために適切なIAMポリシーを設定する必要があります。`amplify/backend.ts`ファイルを以下のコードで更新して、Lambdaのロールポリシーに必要な権限を追加します。

 ```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, convertTextToSpeech } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  convertTextToSpeech,
});

backend.convertTextToSpeech.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["polly:StartSpeechSynthesisTask"],
    resources: ["*"],
  })
);
```
## ステップ5 - 関数ハンドラーを設定する

新しいファイル`amplify/data/convertTextToSpeech.ts`を作成して関数ハンドラーを定義します。この関数はAmazon Pollyを使用してテキストを音声に変換し、合成された音声をS3バケット内のMP3ファイルとして保存します。

```ts title="amplify/data/convertTextToSpeech.ts"
import { Schema } from "./resource";
import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
} from "@aws-sdk/client-polly";
import { env } from "$amplify/env/convertTextToSpeech";

export const handler: Schema["convertTextToSpeech"]["functionHandler"] = async (
  event
) => {
  const client = new PollyClient();
  const task = new StartSpeechSynthesisTaskCommand({
    OutputFormat: "mp3",
    SampleRate: "8000",
    Text: event.arguments.text,
    TextType: "text",
    VoiceId: "Amy",
    OutputS3BucketName: env.PREDICTIONS_GEN_2_BUCKET_NAME,
    OutputS3KeyPrefix: "public/",
  });
  const result = await client.send(task);

  return (
    result.SynthesisTask?.OutputUri?.replace(
      "https://s3.us-east-1.amazonaws.com/" +
        env.PREDICTIONS_GEN_2_BUCKET_NAME +
        "/public/",
      ""
    ) ?? ""
  );
};
```

## ステップ6 - カスタムミューテーションと関数を定義する

`amplify/data/resource.ts`ファイルで、defineFunctionを使用して関数を定義し、a.handler.function()をハンドラーとしてミューテーションで関数を参照します。

```ts title="amplify/data/resource.ts"
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const convertTextToSpeech = defineFunction({
  entry: "./convertTextToSpeech.ts",
});

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
  convertTextToSpeech: a
    .mutation()
    .arguments({
      text: a.string().required(),
    })
    .returns(a.string().required())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(convertTextToSpeech)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for allow.publicApiKey() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

> **Info:** **注**: スキーマが有効であるには、少なくとも1つのクエリが必要です。そうでない場合、デプロイはスキーマエラーで失敗します。Amplify Dataスキーマは、`Todo`モデルと対応するクエリで自動生成されます。次のステップでスキーマに最初のカスタムクエリを追加するまで、`Todo`モデルをスキーマに残しておくことができます。

## ステップ7 - ストレージ権限を更新する

ストレージバケット内の様々なパスへのアクセスを管理するようにストレージ設定をカスタマイズします。ストレージリソースを更新して、`convertTextToSpeech`リソースへのアクセスを提供する必要があります。以下に示すように`amplify/storage/resource.ts`ファイルを修正します。

```ts title="amplify/storage/resource.ts"
import { defineStorage } from "@aws-amplify/backend";
import { convertTextToSpeech } from "../data/resource";

export const storage = defineStorage({
  name: "predictions_gen2",
  access: (allow) => ({
    "public/*": [
      allow.resource(convertTextToSpeech).to(["write"]),
      allow.guest.to(["read", "write"]),
    ],
  }),
});
```

## ステップ8 - フロントエンドを設定する

設定ファイルをインポートしてアプリに読み込みます。Amplify設定ステップをアプリのルートエントリーポイントに追加することをお勧めします。
``` ts title="main.tsx"
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
```
### APIを呼び出す

テキスト入力を使用して再生のためにオーディオバッファを作成するフロントエンドコードの例。

<!-- Platform: react, javascript, nextjs, react-native -->
```ts title="App.tsx"
import "./App.css";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useState } from "react";

const client = generateClient<Schema>();

type PollyReturnType = Schema["convertTextToSpeech"]["returnType"];

function App() {
  const [src, setSrc] = useState("");
  const [file, setFile] = useState<PollyReturnType>("");
  return (
    <div className="flex flex-col">
      <button
        onClick={async () => {
          const { data, errors } = await client.mutations.convertTextToSpeech({
            text: "Hello World!",
          });

          if (!errors && data) {
            setFile(data);
          } else {
            console.log(errors);
          }
        }}
      >
        Synth
      </button>
      <button
        onClick={async () => {
          const res = await getUrl({
            path: "public/" + file,
          });

          setSrc(res.url.toString());
        }}
      >
        Fetch audio
      </button>
      <a href={src}>Get audio file</a>
    </div>
  );
}

export default App;
```
<!-- /Platform -->

<!-- Platform: angular -->
```ts title="app.component.ts"
import type { Schema } from '../../../amplify/data/resource';
import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();

type PollyReturnType = Schema['convertTextToSpeech']['returnType'];

@Component({
  selector: 'app-root',
  template: `
    <div class="flex flex-col">
      <button (click)="synthesize()">Synth</button>
      <button (click)="fetchAudio()">Fetch audio</button>
      <a [href]="src">Get audio file</a>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class App {
  src: string = '';
  file: PollyReturnType = '';

  async synthesize() {
    const { data, errors } = await client.mutations.convertTextToSpeech({
      text: 'Hello World!',
    });

    if (!errors && data) {
      this.file = data;
    } else {
      console.log(errors);
    }
  }

  async fetchAudio() {
    const res = await getUrl({
      path: 'public/' + this.file,
    });

    this.src = res.url.toString();
  }
}
```
<!-- /Platform -->

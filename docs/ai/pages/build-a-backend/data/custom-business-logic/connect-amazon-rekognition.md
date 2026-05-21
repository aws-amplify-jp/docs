---
title: "Amazon Rekognitionに接続して画像分析APIを使用する"
section: "build-a-backend/data/custom-business-logic"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-04-25T18:09:07.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/"
---

**Amazon Rekognition** は、Amazon Web Services（AWS）が提供する高度な機械学習サービスで、開発者がアプリケーションに画像・動画分析機能を組み込むことができます。最先端の機械学習モデルを使用して画像と動画を分析し、オブジェクトとシーン検出、テキスト認識、顔分析など、貴重なインサイトを提供します。

Amazon Rekognitionの主な機能は以下の通りです：

- **オブジェクトとシーン検出**: Amazon Rekognitionは、画像および動画内の数千のオブジェクトとシーンを識別でき、メディアコンテンツに貴重なコンテキストを提供します。

- **テキスト検出と認識**: このサービスは、画像および動画内のテキストを検出および認識でき、テキスト抽出が必要なアプリケーションにとって貴重なツールとなります。

- **顔分析**: Amazon Rekognitionは正確な顔分析を提供し、画像および動画内の顔を検出、分析、比較することができます。

- **顔認識**: 顔認識を使用して個人を認識および検証する機能を持つアプリケーションを構築できます。

- **コンテンツモデレーション**: Amazon Rekognitionは、画像および動画を分析して不適切または不快なコンテンツを特定でき、安全でコンプライアンスに対応したコンテンツを維持するのに役立ちます。

このセクションでは、AWS Amplifyを使用してAmazon Rekognitionをアプリケーションに統合し、その強力な画像分析機能をシームレスに活用する方法について説明します。

## ステップ1 - プロジェクトをセットアップする

[クイックスタートガイド](/[platform]/start/quickstart/)の指示に従ってプロジェクトをセットアップします。

## ステップ2 - Rekognitionライブラリをインストール
AWS SDKを使用してAmazon Rekognitionサービスを呼び出す新しいAPIエンドポイントを作成します。Amazon Rekognition SDKをインストールするには、プロジェクトのルートフォルダで次のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-sdk/client-rekognition
```

## ステップ3 - ストレージをセットアップ

`amplify/storage/resource.ts`という名前のファイルを作成し、ストレージリソースを設定するために以下のコンテンツを追加します：

```ts title="amplify/storage/resource.ts"
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'predictions_gen2'
});

```

## ステップ4 - Amazon Rekognitionをデータソースとして追加

Amazon Rekognitionサービスを使用するには、Amazon RekognitionをHTTPデータソースとして追加し、Lambdaが目的の機能を効果的に利用できるように適切なIAMポリシーを構成し、ストレージへのアクセス許可を付与する必要があります。この場合、ポリシーに`rekognition:DetectText`および`rekognition:DetectLabels`アクションを追加できます。`amplify/backend.ts`ファイルを以下のように更新します。

 ```ts title= "amplify/backend.ts"
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

// Set environment variables for the S3 Bucket name
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  S3_BUCKET_NAME: backend.storage.resources.bucket.bucketName,
};

const rekognitionDataSource = backend.data.addHttpDataSource(
  "RekognitionDataSource",
  `https://rekognition.${backend.data.stack.region}.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: backend.data.stack.region,
      signingServiceName: "rekognition",
    },
  }
);

rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["rekognition:DetectText", "rekognition:DetectLabels"],
    resources: ["*"],
  })
);

backend.storage.resources.bucket.grantReadWrite(
  rekognitionDataSource.grantPrincipal
);

```
## ステップ5 - 関数ハンドラーを構成

`amplify/data/identifyText.js`という新しいファイルを作成して関数ハンドラーを定義します。この関数はAmazon Rekognition DetectTextサービスを使用して画像を分析しテキストを抽出します。

```ts title="amplify/data/identifyText.js"

export function request(ctx) {
  return {
    method: "POST",
    resourcePath: "/",
    params: {
      body: {
        Image: {
          S3Object: {
            Bucket: ctx.env.S3_BUCKET_NAME,
            Name: ctx.arguments.path,
          },
        },
      },
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "RekognitionService.DetectText",
      },
    },
  };
}

export function response(ctx) {
  return JSON.parse(ctx.result.body)
    .TextDetections.filter((item) => item.Type === "LINE")
    .map((item) => item.DetectedText)
    .join("\n")
    .trim();
}

```

## ステップ6 - カスタムクエリを定義

Amazon Rekognitionをデータソースとして追加した後、`a.handler.custom()`修飾子を使用してカスタムクエリで参照できます。これはデータソースの名前とリゾルバーのエントリポイントを取ります。`amplify/data/resource.ts`ファイルで、データソースとして`RekognitionDataSource`を指定し、エントリポイントとして`identifyText.js`を指定します（以下を参照）。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  identifyText: a
    .query()
    .arguments({
      path: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        entry: "./identifyText.js",
        dataSource: "RekognitionDataSource",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```
## ステップ7 - ストレージパーミッションを更新

ストレージ設定をカスタマイズしてストレージバケット内の様々なパスへのアクセスを管理します。`amplify/storage/resource.ts`ファイルを以下のように変更します。

```ts title="amplify/storage/resource.ts"
import { defineStorage } from "@aws-amplify/backend"

export const storage = defineStorage({
  name: "predictions_gen2",
  access: allow => ({
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ]
  })
})
```

## ステップ8 - フロントエンドを構成

構成ファイルをインポートしてアプリに読み込みます。Amplify構成ステップをアプリのルートエントリポイントに追加することをお勧めします。

``` ts title="main.tsx"
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

```
### テキスト認識APIを呼び出す

このコードは、画像をS3バケットにアップロードし、Amazon Rekognitionを使用してアップロードされた画像内のテキストを認識するReactアプリをセットアップします。

<!-- Platform: react, javascript, nextjs, react-native -->
```ts title="App.tsx"
import { type ChangeEvent, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";
import { Schema } from "@/amplify/data/resource";
import "./App.css";

// Generating the client
const client = generateClient<Schema>();

type IdentifyTextReturnType = Schema["identifyText"]["returnType"];

function App() {
  // State to hold the recognized text
  const [path, setPath] = useState<string>("");
  const [textData, setTextData] = useState<IdentifyTextReturnType>();

  // Function to handle file upload to S3 bucket
  const handleTranslate = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      const s3Path = "public/" + file.name;

      try {
        uploadData({
          path: s3Path,
          data: file,
        });

        setPath(s3Path);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to recognize text from the uploaded image
  const recognizeText = async () => {
    // Identifying text in the uploaded image
    const { data } = await client.queries.identifyText({
      path, // File name
    });
    setTextData(data);
  };

  return (
    <div>
      <h1>Amazon Rekognition Text Recognition</h1>
      <div>
        <input type="file" onChange={handleTranslate} />
        <button onClick={recognizeText}>Recognize Text</button>
        <div>
          <h3>Recognized Text:</h3>
          {textData}
        </div>
      </div>
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
import { uploadData } from 'aws-amplify/storage';
import { CommonModule } from '@angular/common';

// Generating the client
const client = generateClient<Schema>();

type IdentifyTextReturnType = Schema['identifyText']['returnType'];

@Component({
  selector: 'app-text-recognition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Amazon Rekognition Text Recognition</h1>
      <div>
        <input type="file" (change)="handleTranslate($event)" />
        <button (click)="recognizeText()">Recognize Text</button>
        <div>
          <h3>Recognized Text:</h3>
          {{ textData }}
        </div>
      </div>
    </div>
  `,
})
export class TodosComponent {
  // Component properties instead of React state
  path: string = '';
  textData?: IdentifyTextReturnType;

  // Function to handle file upload to S3 bucket
  async handleTranslate(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const s3Path = 'public/' + file.name;

      try {
        await uploadData({
          path: s3Path,
          data: file,
        });

        this.path = s3Path;
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Function to recognize text from the uploaded image
  async recognizeText() {
    // Identifying text in the uploaded image
    const { data } = await client.queries.identifyText({
      path: this.path, // File name
    });
    this.textData = data;
  }
}
```
<!-- /Platform -->

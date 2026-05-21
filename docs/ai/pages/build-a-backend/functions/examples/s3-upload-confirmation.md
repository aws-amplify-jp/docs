---
title: "S3 アップロード確認"
section: "build-a-backend/functions/examples"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-12-09T21:42:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/"
---

`defineStorage` と `defineFunction` を使用してファイルのアップロードを確認する関数トリガーを作成できます。

開始するには、異なる種類の Lambda ハンドラー、イベント、およびレスポンスの型を含む `@types/aws-lambda` [パッケージ](https://www.npmjs.com/package/@types/aws-lambda) をインストールしてください。

```bash title="Terminal" showLineNumbers={false}
npm add --save @types/aws-lambda
```

ストレージ定義を以下のようにして onUpload トリガーを定義するように更新してください:

```ts title="amplify/storage/resource.ts"
import { defineFunction, defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'myProjectFiles',
  triggers: {
    onUpload: defineFunction({
      entry: './on-upload-handler.ts'
      resourceGroupName: 'storage',
    })
  }
});
```

次に、`amplify/storage/on-upload-handler.ts` という名前のファイルを作成し、次のコードを使用してオブジェクトがバケットにアップロードされるたびにオブジェクトキーをログに記録します。必要に応じて、この関数にカスタムロジックを追加できます。

```ts title="amplify/storage/on-upload-handler.ts"
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Upload handler invoked for objects [${objectKeys.join(', ')}]`);
};
```

これで、バックエンドをデプロイすると、オブジェクトがバケットにアップロードされるたびにこの関数が呼び出されます。

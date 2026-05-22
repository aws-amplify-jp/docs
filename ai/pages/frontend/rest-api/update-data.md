---
title: "データの更新"
section: "frontend/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/rest-api/update-data/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

## PUTリクエスト

APIエンドポイント経由でアイテムを作成または更新するには：

```ts
import { put } from 'aws-amplify/api';

async function updateItems() {
  try {
    const Item = { name: 'My first Item', message: 'Hello world!' };
    const restOperation = put({
      apiName: 'myRestApi',
      path: 'items/1',
      options: {
        body: Item
      },
    });
    const response = await restOperation.response;
    console.log('PUT call succeeded: ', response);
  } catch (error) {
    console.log('PUT call failed: ', JSON.parse(error.response.body));
  }
}
```

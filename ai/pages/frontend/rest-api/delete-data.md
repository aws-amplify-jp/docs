---
title: "データの削除"
section: "frontend/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/rest-api/delete-data/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

## DELETEリクエスト

APIエンドポイント経由でアイテムを削除するには:

```ts
import { del } from 'aws-amplify/api';

async function deleteItem() {
  try {
    const restOperation = del({
      apiName: 'myRestApi',
      path: 'items/1',
    });
    await restOperation.response;
    console.log('DELETE call succeeded');
  } catch (e) {
    console.log('DELETE call failed: ', JSON.parse(e.response.body));
  }
}
```

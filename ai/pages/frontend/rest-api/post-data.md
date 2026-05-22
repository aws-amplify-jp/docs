---
title: "データをPOST"
section: "frontend/rest-api"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/rest-api/post-data/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

## POSTリクエスト

JSONボディを含むPOSTリクエストを送信します。

```ts
import { post } from 'aws-amplify/api';

async function postItem() {
  try {
    const restOperation = post({
      apiName: 'myRestApi',
      path: 'items',
      options: {
        body: {
          message: 'Mow the lawn'
        }
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
  } catch (error) {
    console.log('POST call failed: ', JSON.parse(error.response.body));
  }
}
```

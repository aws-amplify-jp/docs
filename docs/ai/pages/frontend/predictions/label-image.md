---
title: "画像内のラベルオブジェクト"
section: "frontend/predictions"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/predictions/label-image/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

<Callout informational>

**注:** まず[入門](/[platform]/build-a-backend/add-aws-services/predictions/set-up-predictions/)セクションを完了してください。ここで適切なポリシーアクションを持つIAMロールを設定します

</Callout>

## APIの使用

画像に机や椅子などのラベルが含まれているかを検出します

```javascript
import { Predictions } from '@aws-amplify/predictions';

Predictions.identify({
  labels: {
    source: {
      file
    },
    type: 'LABELS'
  }
})
  .then((response) => {
    const { labels } = response;
    labels.forEach((object) => {
      const { name, boundingBoxes } = object;
    });
  })
  .catch((err) => console.log({ err }));
```

画像内の不適切なコンテンツを検出します

```ts
import { Predictions } from '@aws-amplify/predictions';

const { unsafe } = await Predictions.identify({
  labels: {
    source: {
      file
    },
    type: 'UNSAFE'
  }
})
```

ラベルと不適切なコンテンツの両方を検出します

```ts
import { Predictions } from '@aws-amplify/predictions';

const { labels, unsafe } = await Predictions.identify({
  labels: {
    source: {
      file
    },
    type: 'ALL'
  }
})
```

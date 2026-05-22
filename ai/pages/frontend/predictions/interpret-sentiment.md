---
title: "センチメント分析"
section: "frontend/predictions"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/predictions/interpret-sentiment/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

<Callout informational>

**注記:** 最初に[はじめに](/[platform]/build-a-backend/add-aws-services/predictions/set-up-predictions/)セクションを完了してください。そこでは、正しいポリシーアクションでIAMロールを設定します。

</Callout>

## APIの使用

テキストを分析して、主要フレーズ、センチメント（ポジティブ、ネガティブ、ニュートラル）、または構文（代名詞、動詞など）を見つけます。テキスト内の名前や場所などのエンティティを見つけたり、言語検出を実行したりすることもできます。

```ts
import { Predictions } from '@aws-amplify/predictions';

const result = await Predictions.interpret({
  text: {
    source: {
      text: textToInterpret,
    },
    type: 'ALL'
  }
})
```

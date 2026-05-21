---
title: "言語を翻訳する"
section: "frontend/predictions"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/predictions/translate/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

<Callout informational>

**注意:** 最初に[はじめに](/[platform]/build-a-backend/add-aws-services/predictions/set-up-predictions/)セクションを完了していることを確認してください。そこで、適切なポリシーアクションを持つIAMロールを設定します

</Callout>

## APIの使用

ソース言語からターゲット言語にテキストを翻訳します。

```ts
import { Predictions } from '@aws-amplify/predictions';

const result = await Predictions.convert({
  translateText: {
    source: {
      text: textToTranslate,
      language : "es"
    },
    targetLanguage: "en"
  }
})
```

サポートされている言語の完全なリストを確認するには、[サポートされている言語と言語コード](https://docs.aws.amazon.com/translate/latest/dg/what-is-languages.html)を参照してください。

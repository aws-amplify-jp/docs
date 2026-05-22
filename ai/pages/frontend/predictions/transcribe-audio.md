---
title: "オーディオをテキストに変換"
section: "frontend/predictions"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/predictions/transcribe-audio/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

<Callout informational>

**注：** 最初に[はじめに](/[platform]/build-a-backend/add-aws-services/predictions/set-up-predictions/)セクションを完了してください。ここでは適切なポリシーアクションを持つIAMロールを設定します

</Callout>

## APIの使用

マイクからの録音など、PCMオーディオバイトバッファをテキストに変換できます。

```ts
import { Predictions } from '@aws-amplify/predictions';

const { transcription } = await Predictions.convert({
  transcription: {
    source: {
      bytes
    }
  }
})
```

サポートされているすべての言語と言語固有の機能の完全なリストを表示するには、[サポートされている言語のリスト](https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html)を参照してください。Amplify Predictionsで機能するには、言語データ入力タイプがストリーミングをサポートしている必要があります。

---
title: "AI/ML予測"
section: "build-a-backend/add-aws-services"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/predictions/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

Amplifyはアプリケーションを強化するためにAIおよびMLクラウドサービスを使用するためのソリューションを提供します。サポートされているユースケースの一部:

- [テキストを音声に変換](/[platform]/frontend/predictions/text-to-speech/)
- [音声をテキストに変換](/[platform]/frontend/predictions/transcribe-audio/)
- [テキストをある言語から別の言語に翻訳](/[platform]/frontend/predictions/translate/)
- [画像からテキストを識別](/[platform]/frontend/predictions/identify-text/)
- [画像からエンティティを識別](/[platform]/frontend/predictions/identify-entity/)
- [画像から実世界のオブジェクトを識別](/[platform]/frontend/predictions/identify-entity)
- [テキストを解釈](/[platform]/frontend/predictions/interpret-sentiment)

Predictionsは大きく3つの主要なユースケース（識別、変換、解釈）に整理されており、これらはクライアントAPIおよびCLIワークフローで利用可能です。

- `Identify`は、画像からテキスト（単語、表、本のページ）、エンティティ（顔および/または有名人）を検出します。椅子やデスクなどの実世界のランドマークやオブジェクト（「ラベル」と呼ばれます）を画像から識別することもできます。
- `Convert`により、ソース言語から対象言語へのテキストの翻訳が可能になります。テキスト入力から音声オーディオを生成することもできます。最後に、オーディオ入力を取得し、Webソケットストリームを使用して書き起こすことができます。
- `Interpret`により、テキストを言語、エンティティ（場所、人）、キーフレーズ、センチメント（肯定的、中立的、否定的）、および構文（代名詞、動詞、形容詞）について分析できます。

一般的なユースケースの一部を以下に列挙します。また、接続されたS3バケットから動的な画像インデックスを実行できる高度なワークフローもあります。

Predictionsには、[Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html)、[Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html)、[Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is-transcribe.html)、[Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html)、[Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html)、および[Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html)の組み込みサポートが付属しています。

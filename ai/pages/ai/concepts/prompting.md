---
title: "プロンプティング"
section: "ai/concepts"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-11-22T21:06:49.000Z"
url: "https://docs.amplify.aws/react/ai/concepts/prompting/"
---

LLMプロンプティングとは、Claude や Amazon Titan などの言語モデルに対して、特定の入力またはプロンプトを提供し、目的の出力を生成するプロセスを指します。プロンプトは文、段落、または、ユーザーの意図に合わせたコンテンツを生成するようにモデルをガイドする、より複雑な一連の指示であることもあります。

プロンプトの構造化方法や表現方法は、モデルの応答に大きな影響を与えます。プロンプトを慎重に作成することで、ユーザーは LLM の広範な知識と言語理解機能を活用して、高品質で関連性の高いテキスト、コード、またはその他の種類の出力を生成できます。

効果的なプロンプティングには、モデルの強みと制限を理解し、さまざまなプロンプト形式、スタイル、テクニックを試して、目的の応答を引き出すことが含まれます。これには、特定のキーワードの使用、コンテキストの提供、タスクをステップに分割すること、箇条書きやコードブロックなどの形式要素を組み込むことが含まれます。

モデル API は、単一の文字列を入力として受け取り、出力として文字列を取得するだけではなく、改善されました。新しいモデルにはより構造化された API があり、システムプロンプト、メッセージ履歴、ツール構成を定義します。Amplify AI キットは Bedrock の [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) を使用しており、テキストインテキストアウトのみではなく、構造化された入力と出力を持っています。

## プロンプト構造

* **システムプロンプト:** LLM に対して、そのロールと応答方法に関する高レベルの指示を提供します
* **メッセージ:** モデルが応答するはずの会話履歴です。Amplify AI キットは会話履歴の保存とそれをモデルに提供することを処理します。
* **ツール構成:** モデルが呼び出すことを選択できるツールに関する情報です。Amplify AI キットは、ツール構成の作成、ツールの呼び出し、結果を含むモデルの再プロンプトの処理も行います。

## システムプロンプトをカスタマイズする方法

Amplify AI キットのすべての AI ルートにはシステムプロンプトが必要です。これはすべての LLM へのリクエストで使用されます。

```ts
reviewSummarizer: a.generation({
  aiModel: a.ai.model("Claude 3.5 Haiku"),
  systemPrompt: `
  You are a helpful assistant that summarizes reviews
  for an ecommerce site. 
  `
})
```

## ヒント

**できるだけ詳細にしてください。** できるだけ多くの背景とコンテキストを提供してください。LLM にロールとスコープを与えることは、通常、モデルの応答を焦点を絞るのに役立ちます。

**すべきことと、すべきでないことを明記してください。** LLM は時々冗長になったり、脱線したりすることがあります。「プレースホルダーデータは決して使用しないこと」などの特定のパラメータを指定します。

**複数のルートを使用します。** 必要な数の会話ルートと生成ルートを定義できるため、単一のルートに必要なすべてのコンテキストと機能を適合させる必要はありません。

**すべてをシステムプロンプトに入れる必要はありません。** メッセージ履歴、または単一のユーザーメッセージでも、多くの動的情報を含むことができます。

**プロンプティング戦略はモデルに基づいて異なります。** 常にモデル自体と、使用している特定のモデルで機能する/機能しないことについて確認してください。

## プロンプティングリソース

* [プロンプトとは](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-a-prompt.html)
* [プロンプトエンジニアリングとは](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-prompt-engineering.html)
* [プロンプトの設計](https://docs.aws.amazon.com/bedrock/latest/userguide/design-a-prompt.html)
* [Anthropic プロンプトライブラリ](https://docs.anthropic.com/en/prompt-library/library)

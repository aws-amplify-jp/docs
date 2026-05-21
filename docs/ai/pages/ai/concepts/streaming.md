---
title: "ストリーミング"
section: "ai/concepts"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2024-11-13T23:59:20.000Z"
url: "https://docs.amplify.aws/react/ai/concepts/streaming/"
---

LLM が 100 語以上など大量のテキストを生成する場合、全体の応答が生成されるまでに時間がかかることがあります。全体の応答が返されるのを待つ代わりに、テキストが生成されるのと同時に送信することができます。

Amazon Bedrock などの Foundation Model プロバイダーは、通常、レスポンスをチャンク単位で送信できる HTTP ストリーミング API を備えています。

## Amplify AI kit ストリーミングの仕組み

Amplify AI kit は、他の AI フレームワークのようにバックエンドからフロントエンドへ HTTP ストリーミングを使用しません。代わりに、ストリーミング更新は AWS AppSync への WebSocket 接続を通じてブラウザに送信されます。

Amplify AI kit がプロビジョンする Lambda は、ストリーミング API リクエストで Bedrock を呼び出します。Lambda は HTTP ストリーミング応答からチャンクを受け取り、AppSync に更新を送信します。その後、クライアントがこれにサブスクライブします。

提供されている React フック `useAIConversation` を使用している場合、実はそのことについて心配する必要はありません。なぜなら、それがすべてを処理し、チャンクが受信されるたびに更新される React 状態としての会話メッセージをあなたに提供するからです。

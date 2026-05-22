---
title: "会話履歴"
section: "frontend/ai/conversation"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/ai/conversation/history/"
---

Amplify AI kitは、ユーザーごとに会話履歴を自動的かつ安全に保存するため、過去の会話を簡単に再開できます。

<Callout>

会話履歴を使い始める簡単な方法をお探しの場合、[このサンプルプロジェクト](https://github.com/aws-samples/amplify-ai-examples/tree/main/claude-ai)にはChatGPTまたはClaudeに似たインターフェースがあり、ユーザーは管理できるサイドバーで過去の会話を見ることができます。

</Callout>

Amplifyデータスキーマで会話ルートを定義すると、Amplify AI kitはそれを2つのデータモデルに変換します：`Conversation`と`Message`です。`Conversation`モデルはスキーマで定義された他のデータモデルとほぼ同じように機能します。それらをリストしてフィルタリングできます（オーナーベースの認可を使用するため、ユーザーは自分の会話のみが表示されます）。また、IDで特定の会話を取得できます。会話インスタンスを取得したら、その中にメッセージがある場合はそれらを読み込み、メッセージを送信し、返されるストリームイベントをサブスクライブできます。

## 会話をリストする

ユーザーが持つすべての会話をリストするには、`.list()`メソッドを使用できます。これは他のAmplifyデータモデルと同じように機能します。オプションで`limit`または`nextToken`を渡すことができます。

```ts
const { data: conversations } = await client.conversations.chat.list()
```

`updatedAt`フィールドは新しいメッセージが送信されたときに更新されるため、これを使用して最新のメッセージを持つ会話を確認できます。`.list()`を介して取得された会話は、`updatedAt`によって降順でソートされます。

### ページネーション
`.list()`の結果には`nextToken`プロパティが含まれます。これは後続の会話ページを取得するために使用できます。

```ts
const { data: conversations, nextToken } = await client.conversations.chat.list();

// 次のページを取得
if (nextToken) { 
  const { data: nextPageConversations } = await client.conversations.chat.list({ 
    nextToken 
  });
}
```

会話には`name`と`metadata`フィールドもあり、過去の会話を簡単に見つけて再開するために使用できます。`name`は文字列で、`metadata`はJSONオブジェクトなので、必要な追加情報を保存できます。

## 会話を再開する

会話IDを使用して`.get()`メソッドを呼び出すことで、会話を再開できます。`.create()`と`.get()`の両方が会話インスタンスを返します。

<!-- Platform: javascript,vue,angular -->
```ts
// ユーザーが持つすべての会話をリスト
// Amplify Authでユーザーが認証されていることを確認
const conversationList = await client.conversations.conversation.list();

// 特定の会話を取得
const { data: conversation } = await client.conversations.chat.get({ id: conversationList[0].id });

// 会話内の既存メッセージをリスト
const { data: messages } = await conversation.listMessages();

// これで会話にメッセージを送信できます
conversation.sendMessage({
  content: [
    {text: "hello"}
  ]
})
```
<!-- /Platform -->

<!-- Platform: react,nextjs,react-native -->
```tsx
export function Chat({ id }) {
  const [
    data: { messages }
    handleSendMessage,
  ] = useAIConversation('chat', { id })
}
```
<!-- /Platform -->

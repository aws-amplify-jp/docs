---
title: "ボットと対話する"
section: "frontend/interactions"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/interactions/chatbot/"
---

## ボットにメッセージを送信する
`send()` コマンドでテキストメッセージをチャットボットバックエンドに送信できます。このメソッドはチャットボットの応答を含むプロミスを返します。

```javascript title="src/App.tsx"
import { Interactions } from '@aws-amplify/interactions';

const userInput = "I want to reserve a hotel for tonight";

// Provide a bot name and user input
const response = await Interactions.send({
  botName: "TheBotName",
  message: userInput
});

// Log chatbot response
console.log(response.message);
```

## チャット終了メッセージを表示する

`onComplete()` メソッドを使用して、セッションが正常に終了したときにエラーをキャッチするか、チャットボットの確認を処理する関数を登録できます。

```typescript title="src/App.tsx"
import { Interactions } from '@aws-amplify/interactions';

Interactions.onComplete({
  botName: "TheBotName",
  callback: (error?: Error, completion?: {[key: string]: any}) => {
     if (error) {
        alert('bot conversation failed');
     } else if (completion) {
        console.debug('done: ' + JSON.stringify(completion, null, 2));
        alert('Trip booked. Thank you! What would you like to do next?');
     }
  }
});
```

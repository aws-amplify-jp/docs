---
title: "競合を解決する"
section: "frontend/in-app-messaging"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/in-app-messaging/resolve-conflicts/"
---

イベントが送信され、複数のアプリ内メッセージで設定された条件を満たす稀なケースでは、ライブラリはどのメッセージを返すかを決定する必要があります。そのような競合が発生する場合、In-App Messaging は以下の方法でメッセージを選択します。

1. キャンペーンの有効期限順にメッセージをソートする
2. ソートされたトップメッセージを返す（有効期限に最も近いメッセージ）

ただし、これがあなたの競合解決方法ではない場合もあるため、独自の競合ハンドラーを設定することができます。

```js title="src/index.js"
import { setConflictHandler } from 'aws-amplify/in-app-messaging';

/**
 * 競合解決戦略がどのようなものであれ、ハンドラーは常に
 * アプリ内メッセージの配列を受け入れ、単一のアプリ内メッセージを返す必要があります。
 */
const myConflictHandler = (messages) => {
  // ランダムにメッセージを返す
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

setConflictHandler(myConflictHandler);
```

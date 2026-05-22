---
title: "メッセージをクリア"
section: "frontend/in-app-messaging"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/in-app-messaging/clear-messages/"
---

メッセージがユーザーのデバイスに同期されたら、`clearMessages()` を使用して同期されたメッセージをクリアできます。

```js title="src/index.js"
import { clearMessages } from 'aws-amplify/in-app-messaging';

await clearMessages();
```

<Callout informational>

**注：** アプリに認証機能が実装されている場合は、ユーザーのログイン間で `clearMessages()` を呼び出して、特定のユーザーセグメント向けのメッセージを削除することをお勧めします。これは、アプリケーションが共有デバイスのシナリオで使用されることが予想される場合に特に重要です。

</Callout>

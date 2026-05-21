---
title: "メッセージの同期"
section: "frontend/in-app-messaging"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/in-app-messaging/sync-messages/"
---

メッセージをトリガーするには、インアプリメッセージングキャンペーンからユーザーのデバイスにメッセージを同期する必要があります。これらのメッセージはその後、分析またはインアプリメッセージングイベントでトリガーされます。この同期を実行する時間と頻度を制御できます。

```js title="src/index.js"
import { syncMessages } from 'aws-amplify/in-app-messaging';

await syncMessages();
```

<Callout informational>

**注記:** メッセージを同期すると、常にユーザーのデバイス上に存在する既存のメッセージが上書きされるため、同期が実行されたときに常に最新の状態になります。

</Callout>

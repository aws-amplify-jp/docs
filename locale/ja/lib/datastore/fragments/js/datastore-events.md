```js
// Create listener
const listener = Hub.listen('datastore', async hubData => {
  const  { event, data } = hubData.payload;
  if (event === 'networkStatus') {
    console.log(`User has a network connection: ${data.active}`)
  }
})

// Remove listener
listener();
```

同期プロセス全体が終了するまで待機するには、 `準備ができている` イベントをリッスンします。

```js
// Create listener
const listener = Hub.listen("datastore", async hubData => {
  const  { event, data } = hubData.payload;
  if (event === "ready") {
    // do something here once the data is synced from the cloud
  }
})

// Remove listener
listener();
```

空のDataStoreから起動して同期を開始したときに発生するイベントとペイロードの例を示します。

```js
await DataStore.clear();
await DataStore.start();
```

ログを取得します：

```bash
Event:  {"channel":"datastore","payload":{"event":"storageSubscribed"},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"networkStatus","data":{"active":true}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"outboxStatus","data":{"isEmpty":true}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"subscriptionsEstablished"},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"syncQueriesStarted","data":{"models":["ModelX","ModelY","ModelLala"]}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"modelSynced","data":{"isFullSync":true,"isDeltaSync":false,"counts":{"new":5,"updated":0,"deleted":2}}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"modelSynced","data":{"isFullSync":true,"isDeltaSync":false,"counts":{"new":296,"updated":0,"deleted":2}}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"modelSynced","data":{"isFullSync":true,"isDeltaSync":false,"counts":{"new":8155,"updated":0,"deleted":0}}},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"syncQueriesReady"},"source":"","patternInfo":[]}

Event:  {"channel":"datastore","payload":{"event":"ready"},"source":"","patternInfo":[]}
```

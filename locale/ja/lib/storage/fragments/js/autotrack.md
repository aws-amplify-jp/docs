Storage API を呼び出すときに `{ track: true }` を設定することで、アップロードやダウンロードなどのストレージイベントの自動トラッキングを有効にできます。

<amplify-callout warning> This option is currently only supported in Amplify JavaScript. Enabling this will automatically send Storage Events to Amazon Pinpoint and you will be able to see them within the AWS Pinpoint Console under Custom Events. The event name will be 'Storage' and in *Event Attributes*, you can see details about the event, e.g. *Storage > Method > Put*. </amplify-callout>

### すべてのストレージイベントを追跡

```javascript
Storage.configure({ track: true });
```

### 特定のストレージアクションを追跡

```javascript
Storage.get('welcome.png', { track: true });
```

track プロパティは [React コンポーネント](#analytics-for-s3-components) で直接使用することもできます。
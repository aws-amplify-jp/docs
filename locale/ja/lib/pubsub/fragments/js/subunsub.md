## 購読する
### トピックを購読する

プロバイダからのメッセージの受信を開始するには、次のようにトピックを購読する必要があります。
```javascript
PubSub.subscribe('myTopic').subscribe({
    next: data => console.log('Message received', data),
    error: error => console.error(error),
    close: () => console.log('Done'),
});
```

複数のプロバイダーがアプリケーションに定義されている場合は、以下のプロバイダーを登録したい特定のプロバイダーを含めることができます:
```javascript
PubSub.subscribe('myTopic', { provider: 'AWSIoTProvider' }).subscribe({
    //...
});

PubSub.subscribe('myTopic', { provider: 'MqttOverWSProvider' }).subscribe({
    //...
});
```

<amplify-callout>

**注意:** 特定のプロバイダを含まない場合は、アプリで設定されたすべてのPubSub プロバイダを購読します。

</amplify-callout>

`subscribe()` で次のイベントがトリガーされます

Event | Description `next` | トピックに対してメッセージが正常に受信されるたびにトリガーされます `error` | サブスクリプションの試行が失敗したときにトリガーされます `close` | トピックから退会したときにトリガーされます

### 複数のトピックを購読する

複数のトピックを購読するには、トピック名を含む文字列配列を渡してください。
```javascript
PubSub.subscribe(['myTopic1','myTopic1']).subscribe({
    //...
});
```

## 購読解除

トピックからのメッセージの受信を停止するには、 `unsubscribe()` メソッドを使用します。
```javascript
const sub1 = PubSub.subscribe('myTopicA').subscribe({
    next: data => console.log('Message received', data),
    error: error => console.error(error),
    close: () => console.log('Done'),
});

sub1.unsubscribe();
// You will no longer get messages for 'myTopicA'
```
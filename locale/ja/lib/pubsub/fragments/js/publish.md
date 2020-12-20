トピックにメッセージを送信するには、トピック名とメッセージを含む `publish()` メソッドを使用します。
```javascript
await PubSub.publish('myTopic1', { msg: 'Hello to all subscribers!' });
```

アプリ内で複数のプロバイダーが定義されている場合は、特定のプロバイダーにメッセージを渡すことができます。
```javascript
await PubSub.publish('myTopic1', { msg: 'Hello to all subscribers!' }, { provider: 'AWSIoTProvider' });
```

複数のトピックにメッセージを発行することもできます:
```javascript
await PubSub.publish(['myTopic1','myTopic2'], { msg: 'Hello to all subscribers!' });
```

<amplify-callout>

**注意:** 特定のプロバイダが含まれていない場合は、設定されたすべてのPubSubプロバイダにメッセージを送信します。

</amplify-callout>
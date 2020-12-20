```dart
AmplifyDataStore.events.listenToDataStore((event) {
    if (event["eventName"] == "networkStatus") {
        setState(() {
            networkIsUp = event["active"];
        });
    }
});
```

<amplify-callout>

Flutter DataStore Hub イベントは現在、シリアライズされたマップとして構成されています。イベント名はマップ内の 'eventName' 属性で指定されます。

近日公開:イベントペイロード内でカスタムイベントタイプと自動モデルインスタンス化をサポートします。

</amplify-callout>

<amplify-callout>

Amplify.configure() を呼び出す前に、Hub Listener または Subscriber を設定して、一部の DataStore イベントを逃さないようにします。

</amplify-callout>

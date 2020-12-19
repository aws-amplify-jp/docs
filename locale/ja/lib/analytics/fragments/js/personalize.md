Amazon Personalizeでは、イベントデータ、履歴データ、またはその両方を組み合わせておすすめを作成することができます。 イベントデータを使用して、おすすめを作成することができます。


イベントデータを記録するには、次の手順が必要です。

* [データセットグループ](https://docs.aws.amazon.com/personalize/latest/dg/recording-events.html#event-dataset-group)
* [イベントトラッカー](https://docs.aws.amazon.com/personalize/latest/dg/recording-events.html#event-get-tracker)。

詳細については、 [イベントの記録](https://docs.aws.amazon.com/personalize/latest/dg/recording-events.html) を参照してください。


### インストールと設定

Register the *AmazonPersonalizeProvider* with the Analytics category: You need the tracking ID of your event tracker. For more information, see [Get a Tracking ID](https://docs.aws.amazon.com/personalize/latest/dg/recording-events.html#event-get-tracker).

```javascript
import { Analytics, AmazonPersonalizeProvider } from 'aws-amplify';
Analytics.addPluggable(new AmazonPersonalizeProvider());
```

Amazon Personalizeを設定:

```javascript
// Configure the plugin after adding it to the Analytics module
Analytics.configure({
    AmazonPersonalize: {

        // REQUIRED - The trackingId to track the events 
        trackingId: '<TRACKING_ID>',

        // OPTIONAL -  Amazon Personalize service region
        region: 'XX-XXXX-X',

        // OPTIONAL - The number of events to be deleted from the buffer when flushed.
        flushSize: 10,

        // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
        flushInterval: 5000, // 5s
    }
});
```
### API の操作

You can use the `Identify` event type to track a user identity. This lets you connect a user to their actions and record traits about them. To identify a user, specify a unique identifier for the userId property. Consider the following user interactions when choosing when and how often to call record with the  Identify eventType:

* ユーザーが登録した後。
* ユーザーがログインした後。
* ユーザーが自分の情報を更新する場合 (例えば、新しいアドレスを変更または追加または追加)。
* ログインしたユーザーがアクセス可能なページをロードする際(オプション)。

```javascript
Analytics.record({
        eventType: "Identify",
        properties: {
           "userId": "<USER_ID>"
        }
    }, 'AmazonPersonalize');
```
You can send events to Amazon personalize by calling the `record` operation. If you already use `Identify` tracking end-user data, you can skip the userId, the SDK will fetch the userId based on current browser session. For information about the properties field, see [Put Events](https://docs.aws.amazon.com/personalize/latest/dg/API_UBS_PutEvents.html).

```javascript
Analytics.record({
        eventType: "<EVENT_TYPE>",
        userId: "<USER_ID>", (optional)
        properties: {
          "itemId": "<ITEM_ID>",
          "eventValue": "<EVENT_VALUE>"}
    },
    "AmazonPersonalize");
```
You can track iframe and HTML5 media types by using the MediaAutoTrack event type. MediaAutoTrack tracks all media events of the media DOM element that you bind to. `MediaAutoTracker` will automatically track *Play*, *Pause*, *Ended*, *TimeWatched*, and *Resume* in eventType. The duration of the event compared to the total length of the media is stored as a percentage value in eventValue.

```javascript
Analytics.record({
    eventType: "MediaAutoTrack",
    userId: "<USER_ID>", (optional)
    properties: {
        "domElementId": "MEDIA DOM ELEMENT ID",
        "itemId": "<ITEM_ID>"
    }
}, "AmazonPersonalize");
```

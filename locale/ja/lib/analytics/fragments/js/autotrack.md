Analytics 自動トラッキングを使用すると、セッションの開始/停止、ページビューの変更、クリック、マウスオーバーなどのWebイベントなど、ユーザーの行動を自動的に追跡できます。

## セッショントラッキング

Analytics を使用することで、Web アプリまたは React Native アプリの両方でセッションを追跡できます。 Webセッションは異なる方法で定義することができます。 それをシンプルに保つために、ページが非表示ではなく、ページが非表示であるときに、Webセッションがアクティブであることを定義します。 React Native アプリケーションのセッションは、アプリがフォアグラウンドにあり、アプリケーションがバックグラウンドにある場合には無効になっています。

例:
```javascript
Analytics.autoTrack('session', {
    // REQUIRED, turn on/off the auto tracking
    enable: true,
    // OPTIONAL, the attributes of the event, you can either pass an object or a function 
    // which allows you to define dynamic attributes
    attributes: {
        attr: 'attr'
    },
    // when using function
    // attributes: () => {
    //    const attr = somewhere();
    //    return {
    //        myAttr: attr
    //    }
    // },
    // OPTIONAL, the service provider, by default is the Amazon Pinpoint
    provider: 'AWSPinpoint'
});
```

ページがロードされると、Analytics モジュールはイベントを Amazon Pinpoint Service に送信します。
```javascript
{ 
    eventType: '_session_start', 
    attributes: { 
        attr: 'attr' 
    }
}
```

後方互換性を維持するために、セッションの自動追跡はデフォルトで有効になっています。次によってオフにできます:
```javascript
Analytics.configure({
    // OPTIONAL - セッションイベントの記録を許可します。Default is true.
    autoSessionRecord: false,
});
```
または
```javascript
Analytics.autoTrack('session', {
    enable: false
});

// 注意: session_start イベントをキャンセルするには、Amplify.configure() または Analytics.configure() の前に呼び出す必要があります。
```

## ページビュートラッキング

ウェブアプリで最も頻繁に閲覧されているページ/URLを追跡したい場合は、この機能を使用できます。 ページを訪問すると、URL情報を含むイベントが自動的に送信されます。

オンにするには：
```javascript
Analytics.autoTrack('pageView', {
    // REQUIRED, turn on/off the auto tracking
    enable: true,
    // OPTIONAL, the event name, by default is 'pageView'
    eventName: 'pageView',
    // OPTIONAL, the attributes of the event, you can either pass an object or a function 
    // which allows you to define dynamic attributes
    attributes: {
        attr: 'attr'
    },
    // when using function
    // attributes: () => {
    //    const attr = somewhere();
    //    return {
    //        myAttr: attr
    //    }
    // },
    // OPTIONAL, by default is 'multiPageApp'
    // you need to change it to 'SPA' if your app is a single-page app like React
    type: 'multiPageApp',
    // OPTIONAL, the service provider, by default is the Amazon Pinpoint
    provider: 'AWSPinpoint',
    // OPTIONAL, to get the current page url
    getUrl: () => {
        // the default function
        return window.location.origin + window.location.pathname;
    }
});
```
注意: これはReact Nativeではサポートされていません。

## ページイベントの追跡

ページ上の要素とユーザーのやり取りを追跡したい場合は、この機能を使用できます。 あなたがする必要があるのは、指定されたセレクターをdom要素にアタッチし、自動追跡をオンにするだけです。

オンにするには：
```javascript
Analytics.autoTrack('event', {
    // REQUIRED, turn on/off the auto tracking
    enable: true,
    // OPTIONAL, events you want to track, by default is 'click'
    events: ['click'],
    // OPTIONAL, the prefix of the selectors, by default is 'data-amplify-analytics-'
    // in order to avoid collision with the user agent, according to https://www.w3schools.com/tags/att_global_data.asp
    // always put 'data' as the first prefix
    selectorPrefix: 'data-amplify-analytics-',
    // OPTIONAL, the service provider, by default is the Amazon Pinpoint
    provider: 'AWSPinpoint',
    // OPTIONAL, the default attributes of the event, you can either pass an object or a function 
    // which allows you to define dynamic attributes
    attributes: {
        attr: 'attr'
    }
    // when using function
    // attributes: () => {
    //    const attr = somewhere();
    //    return {
    //        myAttr: attr
    //    }
    // }
});
```

例:
```html<!-- あなたはこのボタンを追跡し、それがクリックされたときにイベントを送信したい--><button
    data-amplify-analytics-on='click'
    data-amplify-analytics-name='click'
    data-amplify-analytics-attrs='attr1:attr1_value,attr2:attr2_value'
/>
```
上のボタンがクリックされると、イベントが自動的に送信されます。これは次のようになります。
```html
<script>
    var sendEvent = function() {
        Analytics.record({
            name: 'click',
            attributes: {
                attr: 'attr', // the default ones
                attr1: attr1_value, // defined in the button component
                attr2: attr2_value, // defined in the button component
            }
        });
    }
</script>
<button onclick="sendEvent()"/>
```

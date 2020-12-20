AmplifyにはHubというローカルイベントシステムがあります。 Publisher-Subscriber パターンの軽量実装であり、アプリケーション内のモジュールとコンポーネント間でデータを共有するために使用されます。 Amplifyは、特定のイベントが発生したときに互いに通信するためにさまざまなカテゴリにハブを使用します。 例えば、ユーザーのサインインやファイルダウンロードの通知などの認証イベント。

## インストール
```javascript
import { Hub } from 'aws-amplify';
// or
import { Hub } from '@aws-amplify/core';
```

## API の操作

### メッセージを聞いています

`Hub.listen(channel: string | RegExp, callback)` is used to listen for messages that have been dispatched. You must provide either a named `channel` or a regular expression, along with a callback. In the case of a regular expression only dispatches which contain a `message` in their payload will be matched against your pattern. You can add multiple listeners to your application for different channels or patterns to listen for, or trap generic events and perform your own filtering.

```javascript
import { Hub } from 'aws-amplify';

class MyClass {
    constructor() {
        Hub.listen('auth', (data) => {
            const { payload } = data;
            this.onAuthEvent(payload);           
            console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
        })
    }

    onAuthEvent(payload) {
        // ... your implementation
    }
}
```

<amplify-callout>

In previous versions of Amplify capturing updates required you to implement an `onHubCapsule` handler function in your class and pass in `this` to the listen method. While still possible, this is no longer considered best practice and we have begun deprecating the method. Please define an explicit callback and pass it into the listen function (e.g. `Hub.listen('auth', this.myCallback)`) or use an anonymous function such as in the above example.

</amplify-callout>

### メッセージを送信中

イベントを別のチャンネルに送信するには、 `ディスパッチ` 機能を使用します。
```javascript
Hub.dispatch(
    'DogsChannel', 
    { 
        event: 'buttonClick', 
        data: {color:'blue'}, 
        message:'' 
});

setTimeout(() => {
  Hub.dispatch(
      'CatsChannel', 
      { 
            event: 'drinkMilk', 
            data: { 
                breed: 'Persian',
                age: 5
            },
            message: `The cat ${cat.name} has finished her milk`
        });
}, 5000)
```
`Hub.dispatch(channel: string, payload: HubPayload)` can be used to dispatch a `HubPayload` to a `channel`. The `channel` is a logical grouping for your organization while the `HubPayload` is a type defined as:
```javascript
export type HubPayload = {
    event: string,
    data?: any,
    message?: string
};
```

The `event` field is recommended to be a small string without spaces such as `signIn` or `hang_up` as it's useful for checking payload groupings. The `data` field is a freeform structure which many times is used for larger JSON objects or custom data types. Finally while `message` is optional, we encourage you to use it as it is required when using a `RegExp` filtering with `Hub.listen()`.

### リスニングを停止する

Hub は `Hub.remove(channel: string | RegExp, listener: callback)`でメッセージのリッスンを停止する方法を提供します。 これは、アプリケーションフローでメッセージを受信する必要がなくなった場合に便利です。 複数のチャンネルで Hub から大量のデータを送信している場合、低電力デバイスでのメモリリークを避けることができます。


### チャンネル
A channel is a logical group name that you use to organize messages and listen on. These are strings and completely up to you as the developer to define for dispatching or listening. However, while you can dispatch to any channel, ***Amplify protects certain channels*** and will flag a warning as sending unexpected payloads could have undesirable side effects (such as impacting authentication flows). The protected channels are currently:

* core
* 認証する
* api
* 分析
* 相互作用
* pubsub
* ストレージ
* xr
* datastore

### 正規表現を再生

Hub のリスナー機能は、さまざまなチャンネル間のデータがどのように見えるかがわからない場合にフィルタリングを実行する強力な方法です。 さらに、それは素晴らしいリアルタイムデバッグ機能でもあります。 たとえば、すべてのメッセージを聴きたい場合は、ワイルドカードを渡すだけです。

```javascript
Hub.listen(/.*/, (data) => {
  console.log('Listening for all messages: ', data.payload.data)
})
```

「グループをキャプチャ」を使用する場合 (例: 括弧の正規表現のグループ化) 配列が `patternInfo` と呼ばれ、コールバックの一部として返されます:

```javascript
Hub.listen(/user(.*)/, (data) => {
  console.log('USER イベントが pattern: ', data.payload.message);
  console.log('patternInfo:', data.patternInfo);
})
```

例えば、特定のフレーズの前後にテキストを抽出したい場合に便利です。

```javascript
Hub.listen(/user ([^ ]+) ([^ ]+) (.*)/, (data) => {
  console.log('A USER event has been found matching the pattern: ', data.payload.message);
  console.log('patternInfo:', data.patternInfo);
})
```

### 要塞管理

Hubは、イベントが1つ以上のリスナーによって閲覧されたときにストアを更新することによって、 [Redux](https://redux.js.org/) や [MobX](https://github.com/mobxjs/mobx) のような状態管理システムの一部として使用できます。 独自のローカルストアを構築することもできます。例えば、React アプリケーションのトップレベルコンポーネントに次のようなものがあるとします。

```javascript
const store = (() => {
  const listeners = [];

  const theStore = {
      subscribe(listener) {
          listeners.push(listener);
      }
  };

  return new Proxy(theStore, {
      set(_obj, _prop, _value) {
          listeners.forEach(l => l());
          return Reflect.set(...arguments);
      }
  });
})();

Hub.listen(/.*/, (data) => {
  console.log('Listening for all messages: ', data.payload.data)
  if (data.payload.message){
    store['message-' + Math.floor(Math.random() * 100)] = data.payload.message
  }
})

class App extends Component {

  addItem = () => {
    Hub.dispatch('MyGroup', {
      data : { a: 1},
      event: 'clicked',
      message: 'A user clicked a button'
    })
    console.log(store);
  }

  render() {
    console.log('store: ', store)
    return (
      <div className="App">
        <button onClick={this.addItem}>Add item</button>
        <DogAlerts store={store}/>
        <DogStatus store={store}/>
      </div>
    );
  }
}
```

This naive sample (which is for example purposes and not production ready) creates a `store` that is updated when events are received by `Hub.listen()` if there is a message present in the payload. We then create these messages with `Hub.dispatch()` upon a button click and pass the store down to two components called `<DogAlerts />` and `<DogStatus />`.  The first is a very simple stateless component that renders the current store value from props:

```javascript
const DogAlerts = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>
}
```

While this is nice functionality, when the button is clicked the component will not be updated. In order to do that you can use a class component (or React Hooks) and call `store.subscribe` as part of the `componentDidMount()` lifecycle method:

```javascript
class DogStatus extends Component {
  componentDidMount(){
    this.props.store.subscribe(()=>{
      this.forceUpdate();
    })
  }

  render(){
    return(<div>
      <pre>Dog Status</pre>
      <pre>{JSON.stringify(this.props, null, 2)}</pre>
    </div>)
  }
}
```

ストアが更新されると、 `<DogStatus />` コンポーネントが画面に再レンダリングされます。

## APIリファレンス

Hub モジュールの完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/amplify-js/api/classes/hubclass.html) を参照してください。

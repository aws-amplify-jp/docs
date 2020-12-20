AWS Amplify *ServiceWorker* class enables registering a service worker in the browser and communicating with it via *postMessage* events, so that you can create rich offline experiences with [Push APIs](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and analytics.

Service Workerを登録した後、ServiceWorker モジュールはリッスンし、状態変更時にメッセージをディスパッチしようとします。 サービスワーカーのライフサイクルに基づいて分析イベントを記録します

<amplify-callout>

postMessage イベントは現在すべてのブラウザでサポートされていません。Service Worker API の詳細や詳細については、 [をご覧ください。](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/).

</amplify-callout>

## インストール

*ServiceWorker* をインポートし、新しいインスタンスをインスタンス化します（異なるスコープで複数のワーカーを持つことができます）：
```javascript
import { ServiceWorker } from 'aws-amplify';
const serviceWorker = new ServiceWorker();
```

## API の操作

### register()

`register` メソッドでブラウザのサービスワーカーを登録できます。

First, you need to create a service worker script **service-worker.js**. Your service worker script includes cache settings for offline access and event handlers for related lifecycle events. [Click to see a sample service worker script](#example-service-worker) for your app.

Worker スクリプトがビルドに含まれていることを確認し、登録時にソースディレクトリからの相対パスを指定してください:

```javascript
// `service-worker.js`でサービスワーカーを登録し、サービスワーカースコープ`/`を使用します。
registeredServiceWorker = await serviceWorker.register('/service-worker.js', '/');
```

この方法では、アプリの Web プッシュ通知を有効にします。 アプリが以前にプッシュ通知を受信するためにプッシュサービスに登録されていない場合。 新しいサブスクリプションは、提供された *公開キー* で作成されます。

```javascript
    serviceWorker.enablePush('BLx__NGvdasMNkjd6VYPdzQJVBkb2qafh')
```

<amplify-callout>

公開鍵を生成し、実際のプッシュ通知を送信するには、Web プッシュサービスプロバイダが必要です。 本番環境以外の環境でプッシュメッセージをテストするには、 [このチュートリアル](https://developers.google.com/web/fundamentals/codelabs/push-notifications/) に従ってください。

</amplify-callout>

### プッシュ通知の処理

サービスワーカーでプッシュ通知を処理するには、スクリプトは `push` イベントのイベントハンドラーを登録する必要があります。

*service-worker.js* ファイルで、以下のイベントリスナを追加します。

```javascript
/**
 * Listen for incoming Push events
 */

addEventListener('push', (event) => {
    var data = {};
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    if (!(self.Notification && self.Notification.permission === 'granted')) 
        return;

    if (event.data) 
        data = event.data.json();

    // Customize the UI for the message box 
    var title = data.title || "Web Push Notification";
    var message = data.message || "New Push Notification Received";
    var icon = "images/notification-icon.png";
    var badge = 'images/notification-badge.png';
    var options = {
        body: message,
        icon: icon,
        badge: badge
    };

    event.waitUntil(self.registration.showNotification(title,options));

});
```

Notifications API の詳細については、 [こちら](https://developer.mozilla.org/en-US/docs/Web/API/notification) をご覧ください。

### send()

`send` method sends a message to your service worker, from your web app. Remember that your app's code and service worker script work in different contexts, and the communication between the two is possible with *send()* method.

これは、サービスワーカーキャッシュのクリーニングなど、アプリからサービスワーカーロジックを制御したい場合に便利です。

```javascript

    registeredServiceWorker.send({
      'message': 'CleanAllCache'
    });

```

Message APIの詳細については、こちら [](https://developer.mozilla.org/en-US/docs/Web/Events/message_(ServiceWorker)) をご覧ください。


#### メッセージを受信中

サービスワーカーでメッセージを受信するには、 **message** イベントのイベントハンドラーを追加する必要があります。

*service-worker.js* ファイルに、次のイベントリスナを追加します。

```javascript
    /**
     * The message will receive messages sent from the application.
     * This can be useful for updating a service worker or messaging
     * other clients (browser restrictions currently exist)
     * https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
     */
    addEventListener('message', (event) => {
        console.log('[Service Worker] Message Event: ', event.data)
    })

```

### ライフサイクルイベントの監視

AWS Amplify [Analytics](~/lib/analytics/getting-started.md) カテゴリ、 *ServiceWorker* モジュールを有効にすると、サービスワーカーの状態の変更とメッセージイベントが自動的に追跡されます。

これらの分析イベントが Amazon Pinpoint コンソールに関連するメトリックであることがわかります。

## APIリファレンス

ServiceWorker モジュールの完全な API ドキュメントについては、私たちの [API リファレンス](https://aws-amplify.github.io/amplify-js/docs/api/classes/serviceworkerclass.html) を参照してください。

## モジュラーインポートの使用

ServiceWorker を使用するだけの場合 `npm install @aws-amplify/core` は、ServiceWorker モジュールを含む Core モジュールのみをインストールします。

次にコードで、Analytics モジュールをインポートできます。
```javascript
import { ServiceWorker } from '@aws-amplify/core';

```

## サービスワーカーの例

```javascript
var appCacheFiles = [
    '/',
    '/index.html'
], 
// The name of the Cache Storage
appCache = 'aws-amplify-v1';

/**
 * The install event is fired when the service worker 
 * is installed.
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */
addEventListener('install', (event) => {
    console.log('[Service Worker] Install Event', event)
    event.waitUntil(
        caches.open(appCache).then(function(cache) {
          return cache.addAll(appCacheFiles);
        })
    );
})

/**
 * The activate vent is fired when the  service worker is activated
 * and added to the home screen.
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */
addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate Event ', event)
})

/**
 * The fetch event is fired for every network request. It is also dependent
 * on the scope of which your service worker was registered.
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */
addEventListener('fetch', function(event) {
    //return fetch(event.request);
  console.log('[Service Worker] Fetch: ', event);
    let url = new URL(event.request.url);
    //url.pathname
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(appCache).then(function(cache) {
          if (event.request.method === 'GET') {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
    );
});
/**
 * The message will receive messages sent from the application.
 * This can be useful for updating a service worker or messaging
 * other clients (browser restrictions currently exist)
 * https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
 */
addEventListener('message', (event) => {
    console.log('[Service Worker] Message Event: ', event.data)
})

/**
 * Listen for incoming Push events
 */
addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    if (!(self.Notification && self.Notification.permission === 'granted'))
        return;

    var data = {};
  if (event.data)
    data = event.data.json();

    var title = data.title || "Web Push Notification";
    var message = data.message || "New Push Notification Received";
    var icon = "images/notification-icon.png";
    var badge = 'images/notification-badge.png';
    var options = {
        body: message,
        icon: icon,
        badge: badge
    };
    event.waitUntil(self.registration.showNotification(title,options));
});

/**
 * Handle a notification click
 */
addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click: ', event);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://aws-amplify.github.io/amplify-js')
    );
});
```

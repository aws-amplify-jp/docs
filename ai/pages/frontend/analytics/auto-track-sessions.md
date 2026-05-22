---
title: "セッションの自動追跡"
section: "frontend/analytics"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/auto-track-sessions/"
---

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
Analytics 自動追跡は、セッションの開始/停止、ページビュー変更、クリックやマウスオーバーなどのウェブイベントなど、ユーザーの行動を自動的に追跡するのに役立ちます。

## セッション追跡

Analytics を使用することで、ウェブアプリまたは React Native アプリの両方でセッションを追跡できます。ウェブセッションはさまざまな方法で定義できます。シンプルに保つため、ページが非表示でない場合はセッションがアクティブで、ページが非表示の場合はセッションがアクティブでないものとします。React Native アプリのセッションは、アプリがフォアグラウンドにあるときはアクティブで、バックグラウンドにあるときはアクティブでありません。

たとえば:

```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  // 必須、自動追跡をオン/オフにする
  enable: true,
  // 必須、イベントタイプ。'event'、'pageView'、または 'session' のいずれか
  type: 'session',
  // オプション、追跡されたイベントの追加オプション
  options: {
    // オプション、イベントの属性
    attributes: {
      customizableField: 'attr'
    }
  }
});
```

デフォルトでは、ページ/アプリがフォアグラウンドに遷移すると、Analytics モジュールは Amazon Pinpoint サービスにイベントを送信します。

```json
{
  "eventType": "_session_start",
  "attributes": {
    "customizableField": "attr"
  }
}
```

この動作は `configureAutoTrack` を呼び出すことで無効にできます:

```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  enable: false,
  type: 'session'
});
```

## ページビュー追跡

この機能を使用して、ウェブアプリで最も頻繁に表示されるページ/URL を追跡します。ページが訪問されたときに、URL 情報を含むイベントを自動的に送信します。

この動作は `configureAutoTrack` を呼び出すことで有効にできます:
```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  // 必須、自動追跡をオン/オフにする
  enable: true,
  // 必須、イベントタイプ。'event'、'pageView'、または 'session' のいずれか
  type: 'pageView',
  // オプション、追跡されたイベントの追加オプション
  options: {
    // オプション、イベントの属性
    attributes: {
      customizableField: 'attr'
    },

    // オプション、イベント名。デフォルトでは、これは 'pageView' です
    eventName: 'pageView',

    // オプション、追跡対象のアプリのタイプ。デフォルトでは、これは 'multiPageApp' です。
    // React のようなシングルページアプリの場合は、これを 'singlePage' に変更する必要があります
    appType: 'multiPageApp',

    // オプション、イベントの URL を指定します。
    urlProvider:  () => {
      // デフォルト関数
      return window.location.origin + window.location.pathname;
    }
  }
});
```

この動作は `configureAutoTrack` を呼び出すことで無効にできます:
```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  enable: false,
  type: 'pageView'
});
```

## ページイベント追跡

ページイベント追跡を使用して、ページ上の特定の要素とのユーザーインタラクションを追跡します。指定されたセレクターを DOM 要素に付加し、自動追跡をオンにします。

この動作は `configureAutoTrack` を呼び出すことで有効にできます:
```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  // 必須、自動追跡をオン/オフにする
  enable: true,
  // 必須、イベントタイプ。'event'、'pageView'、または 'session' のいずれか
  type: 'event',
  // オプション、追跡されたイベントの追加オプション
  options: {
    // オプション、イベントの属性
    attributes: {
      customizableField: 'attr'
    },
    // オプション、追跡したいイベント。デフォルトでは、これは 'click' です
    events: ['click'],

    // オプション、セレクターのプレフィックス。デフォルトでは、これは 'data-amplify-analytics-' です
    // https://www.w3schools.com/tags/att_global_data.asp に従い、常に
    // プレフィックスを 'data' で開始してユーザーエージェントとの衝突を避けます
    selectorPrefix: 'data-amplify-analytics-'
  }
});
```

たとえば:

```html
<!-- このボタンを追跡して、クリックされたときにイベントを送信します -->
<button
  data-amplify-analytics-on="click"
  data-amplify-analytics-name="click"
  data-amplify-analytics-attrs="attr1:attr1_value,attr2:attr2_value"
/>
```

上記のボタンがクリックされると、イベントが自動的に送信されます。これは以下と同等です:

```html
<script>
  import { record } from 'aws-amplify/analytics';
  var sendEvent = function() {
    record({
      name: 'click',
      attributes: {
        attr: 'attr', // デフォルトのもの
        attr1: attr1_value, // ボタンコンポーネントで定義
        attr2: attr2_value // ボタンコンポーネントで定義
      }
    });
  };
</script>
<button onclick="sendEvent()" />
```

この動作は `configureAutoTrack` を呼び出すことで無効にできます:
```javascript title="src/index.js"
import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  enable: false,
  type: 'event'
});
```

<Callout>

**注:** Amplify は位置情報を自動的にキャプチャしません。代わりに、[Analytics を設定](/[platform]/build-a-backend/add-aws-services/analytics/set-up-analytics/#set-up-existing-analytics-backend)するときにデフォルト設定に位置情報を追加することや、[エンドポイントを更新](/[platform]/build-a-backend/add-aws-services/analytics/existing-resources)するときに追加できます。

</Callout>
<!-- /Platform -->

<!-- Platform: swift, android, flutter -->
Amplify analytics プラグインは、アプリケーションが開いたり閉じたりしたときを記録します。このセッション情報は、Amazon Pinpoint の AWS コンソールから表示できます。

1. Amazon Pinpoint コンソールの **Analytics** で、**Events** を選択します。
2. フィルターを有効にして、`Session Start` と `Session Stop` イベントを選択してセッションイベントをフィルタリングできます。
<!-- /Platform -->

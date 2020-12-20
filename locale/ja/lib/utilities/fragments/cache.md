Amplify Cacheモジュールは、JavaScript開発者が優先度と期限切れの設定でデータを保存するための汎用の [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_.28LRU.29) キャッシュを提供します。

これは、有効期限の値を **グローバル** または **キーごと**に設定できるキー/値構造です。 たとえば、次の10分間、APIモジュールからのすべてのJSONレスポンスをキャッシュすることができます。 ユーザー入力値や好みを1ヶ月保存したいのです

## インストール

`aws-amplify` をインストールします。

```bash
npm install aws-amplify
```

## API の操作

まず、ライブラリをインポートします。
```javascript
import { Cache } from 'aws-amply';
```

インポート後、アプリケーション内で適切なメソッドを呼び出すことができます。

### setItem()

```javascript
Cache.setItem(key, value, [options]);
```

You can set *number*, *string*, *boolean*, *array* or *object* values to the cache. You can also specify options along with the call such as the priority or expiration time.

```javascript
// Standard case
Cache.setItem('key', 'value');

// Set item with priority should be between 1 and 5.
Cache. etItem('key', 'value', { priority: 3 });

// 有効期限付きアイテムを設定
const expiration = new Date(2018, 1, 1);
Cache. etItem('key', 'value', { expires: expiration.getTime() });
```

When using `priority` setting, the cached item with the higher number will be expired first. The Cache module decides expiration based on the memory available to the cache. In the following example,`breakfastFoodOrder` will be expired before `mothersBirthday`.


```javascript
Cache.setItem('mothersBirthday', 'July 18th', { priority: 1 });
Cache.setItem('breakfastFoodOrder', 'Pancakes', { priority: 3 });
```

### getItem()

```javascript
Cache.getItem(key[, options]);
```
  キャッシュからアイテムを取得します。アイテムが存在しないか期限切れの場合は null を返します。

```javascript
// Standard case
Cache.getItem('key');

// Get item with callback function.
// The callback function will be called if the item is not in the cache.
// After the callback function returns, the value will be set into cache.
Cache.getItem('key', { callback: callback });
```

### removeItem()

  キャッシュからアイテムを削除します。

```javascript
Cache.removeItem(key);
```

### clear()

キャッシュ内のすべての項目を削除します。

```javascript
Cache.clear();
```

### getAllKeys()

キャッシュで利用可能なすべてのキーを返します。

```javascript
Cache.getAllKeys();
```

### getCacheCurSize()

キャッシュの現在のサイズをバイト単位で返します。

```javascript
const size = Cache.getCacheCurrSize();
```

### configure()

`setItem` 機能のデフォルト設定を設定します。 [Configuration](#configuration) セクションで使用可能なすべてのオプションを表示できます。

```javascript
const config = {
  itemMaxSize: 3000, // 3000 bytes
  defaultPriority: 4
  // ...
};
const myCacheConfig = Cache.configure(config);

// You can modify parameters such as cache size, item default ttl and etc.
// But don't try to modify keyPrefix which is the identifier of Cache.
```

### createInstance()

カスタム構成で Cache の新しいインスタンスを作成します。

```javascript
const config = {
  itemMaxSize: 3000, // 3000 bytes
  storage: window.sessionStorage // switch to sessionStorage
  // ...
};
const newCache = Cache.createInstance(config);
// Please provide a new keyPrefix which is the identifier of Cache.
```

## APIリファレンス

Cacheモジュールの完全なAPIドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/amplify-js/api/classes/cacheobject.html) を参照してください。

## 設定

### 設定パラメータ

Cacheモジュールの設定パラメータのリストは次のとおりです。

| **パラメータ**        | **タイプ**    | **説明**                                                                                                            |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| keyPrefix        | *文字列*      | 新しいインスタンスを作成するときにのみ設定できるキャッシュのID。                                                                                 |
| capacityInBytes  | *数値*       | キャッシュの最大サイズ（バイト数）。デフォルトでは1MBで、最大5MBです。                                                                            |
| itemMaxSize      | *数値*       | Cacheにバイト単位で設定できる個々のアイテムの最大サイズ。デフォルト値は200KBです。                                                                    |
| defaultTTL       | *数値*       | キャッシュアイテムのTTL。デフォルト値は72時間です。                                                                                      |
| defaultPriority  | *数値*       | デフォルトのキャッシュアイテムの優先度。デフォルト値は5で、最も高い優先度は1です。                                                                        |
| warningThreshold | *数値*       | これは、Cacheの現在の容量を合理的なレベルに保つためのものです。デフォルトは0.8で、空間使用量の80%に対する警告を設定します。                                               |
| ストレージ            | *ストレージタイプ* | キャッシュに使用される記憶媒体。 サポートされている値は *LocalStorage*(デフォルト) と Web 開発用 *SessionStorage* 、React Native では *AsyncStorage* です。 |

### アイテムの設定パラメータ

キャッシュ内の項目の設定パラメータのリストは次のとおりです。

| **パラメータ** | **タイプ** | **説明**                                                                                                                          |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 優先度       | *数値*    | キャッシュに保存するアイテムの優先度。優先度が高いほど、有効期限が長くなります。                                                                                        |
| 有効期限      | *数値*    | キャッシュアイテムの有効期限（ミリ秒単位）                                                                                                           |
| callback  | *関数*    | キャッシュミスシナリオを実装するために、getItem() を使用したコールバック関数を提供できます。 指定された関数は、キャッシュキーに一致しない場合にのみ呼び出されます。 そして、関数からの戻り値は、キャッシュのキーの新しい値として割り当てられます。 |

## モジュラーインポートの使用

キャッシュのみを使用する必要がある場合は、以下を行うことができます: `npm install @aws-amplify/cache` これはキャッシュモジュールのみをインストールします。

次にコードで、Cacheモジュールをインポートすることができます:
```javascript
import Cache from '@aws-amplify/cache';

Cache.configure();

```

## クリア

DataStoreからローカルデータを消去するには、 `clear` メソッドを使用します。

```js
import { DataStore } from '@aws-amplify/datastore';

await DataStore.clear();
```

<amplify-callout>

アプリが認証を実装している場合は、サインイン/サインアウト時に `DataStore.clear()` を呼び出して、ユーザー固有のデータを削除することをお勧めします。 この方法は、共有デバイスのシナリオで使用する場合や、セキュリティ/プライバシーの懸念のためにレコードのローカルオンデバイスストレージを削除する必要がある場合に重要です。

</amplify-callout>

## 開始

同期プロセスを手動で開始するには、 `start` メソッドを使用します。

```js
import { DataStore } from '@aws-amplify/datastore';

await DataStore.start();
```

`DataStore.query()` を実行すると、自動的に同期が開始されます。ただし、 `DataStore.start()` でプロセスを明示的に開始できます。
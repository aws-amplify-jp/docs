DataStore にはいくつかのオプション設定があります。 例えば、システムの任意の部分で行われるエラーメッセージのカスタムハンドラを指定する機能などです。 競合解決戦略のいずれかでAWS AppSyncによって変更が拒否された場合に実行されるカスタム競合ハンドラを指定することもできます。

最後に、機器にローカルに保存されるアイテム(モデルごと)上限として同期するレコード数を設定できます。 Delta Sync プロセスの一部として実行されるデフォルトの 24 時間の「ベースクエリ」のオーバーライドであるカスタム間隔を分単位で指定します。

### 例

The code below illustrates a conflict resolution handler for the `Post` model that retries a mutation with the same title, but the most recent remote data for all other fields. The conflict resolution handler discards conflicts for all other models (by returning the `DISCARD` symbol imported from `@aws-amplify/datastore`).

```js
import { DISCARD } from "@aws-amplify/datastore";

DataStore.configure({
  errorHandler: (error) => {
    console.warn("Unrecoverable error", { error });
  },
  conflictHandler: async (data) => {
    // Example conflict handler

    const modelConstructor = data.modelConstructor;
    if (modelConstructor === Post) {
      const remoteModel = data.remoteModel;
      const localModel = data.localModel;
      const newModel = modelConstructor.copyOf(remoteModel, (d) => {
        d.title = localModel.title;
      });
      return newModel;
    }

    return DISCARD;
  },
  maxRecordsToSync: 30000,
  fullSyncInterval: 60, // minutes
});
```

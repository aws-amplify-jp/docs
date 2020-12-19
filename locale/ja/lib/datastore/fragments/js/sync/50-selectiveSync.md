## データのサブセットを選択的に同期

デフォルトでは、DataStoreはクラウドデータソースの内容全体をローカルデバイスにダウンロードします。 保存されるレコードの最大数は、ここ [](https://docs.amplify.aws/lib/datastore/conflict/q/platform/js#example) で設定可能です。

選択的な同期を使用して、データのサブセットのみを保持することができます。

選択同期は、基本およびデルタ同期クエリおよび受信サブスクリプションに述語を適用することによって機能します。

```js
import { DataStore, syncExpression } from 'aws-amplify';
import { Post, Comment } from './models';

DataStore.configure({
  syncExpressions: [
    syncExpression(Post, () => {
      return (c) => c.rating('gt', 5);
    }),
    syncExpression(Comment, () => {
      return (c) => c.status('eq', 'active');
    }),
  ]
});
```

DataStoreが同期を開始したとき `rating > 5` と `status === 'active'` のコメントのみがユーザーのローカルストアに同期されます。

<amplify-callout>

開発者は、モデルごとに単一の `syncExpression` を指定する必要があります。同じモデルの後続の式はすべて無視されます。

</amplify-callout>

### 実行時に式を再評価
Sync expressions get evaluated whenever DataStore starts. In order to have your expressions reevaluated, you can execute `DataStore.clear()` or `DataStore.stop()` followed by `DataStore.start()`.

次の式があり、実行時に適用されるフィルタを変更する場合は、次の操作を行うことができます。
```js
let rating = 5;

DataStore.configure({
  syncExpressions: [
    syncExpression(Post, () => {
      return (c) => c.rating('gt', rating));
    })
  ]
});

async function changeSync() {
  rating = 1;
  await DataStore.stop();
  await DataStore.start();
}
```

Upon calling `DataStore.start()` (or executing a DataStore operation, e.g., `query`, `save`, `delete`, or `observe`), DataStore will reevaluate the `syncExpressions`.

In the above case, the predicate will contain the value `1`, so all Posts with `rating > 1` will get synced down.

覚えておいてください: `DataStore.stop()` はローカルストアの既存のコンテンツを保持します。 `DataStore.clear()` を実行してローカルに保存されたコンテンツをクリアします。

<amplify-callout>

より制約的なフィルタを適用する場合、代わりに `DataStore.clear()` を実行することで、最初にローカルレコードをクリアします。

</amplify-callout>

```js
async function changeSync() {
  rating = 8;
  await DataStore.clear();
  await DataStore.start();
}
```
ローカルストアの内容をクリアし、同期式を再評価し、クラウドからデータを再同期します 指定されたすべての述語を同期クエリに適用します。

同期式に `を戻すこともできます。 LL <code>` は、そのモデルのフィルタリングを削除するために使用されます。これは、デフォルトの同期動作と同じ効果を持ちます。

```js
let rating = null;

DataStore.configure({
  syncExpressions: [
    syncExpression(Post, () => {
      if (rating) {
        return (c) => c.rating('gt', rating));
      }

      return Predicates.ALL;
    })
  ]
});
```
<amplify-callout warning>

`DataStore.configure()` はファイルのルートに一度だけ呼び出されるべきです。

</amplify-callout>

### 非同期式
Promiseを `syncExpression` に渡すことができます。
```js
DataStore.configure({
  syncExpressions: [
    syncExpression(Post, async () => {
      const ratingValue = await getRatingValue();
      return (c) => c.rating('gt', ratingValue);
    })
  ]
});
```
DataStoreは、式を同期に適用する前にPromiseが解決するのを待機します。 非同期式は、同期式と同様に実行時に再評価することもできます (前のセクションを参照)。

### ショートランド
`syncExpression`にロジックを追加する必要がない場合は、以下の略式で、述語を直接返すことができます。
```js
DataStore.configure({
  syncExpressions: [
    syncExpression(Post, (c) => c.rating('gt', 5))
  ]
});
```

### 高度な使用例 - スキャンの代わりにクエリ
You can configure selective sync to retrieve items from DynamoDB with a [query operation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html) against a GSI. By default, the base sync will perform a [scan](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html). Query operations enable a highly efficient and cost-effective data retrieval for customers running DynamoDB at scale. Learn about creating GSIs with the `@key` directive [here](https://docs.amplify.aws/cli/graphql-transformer/key).

そのために、 `syncExpression` はクエリ式にマップする述語を返す必要があります。

例えば、次のスキーマの場合:
```graphql
type User @model
  @key(name: "byLastName", fields: ["lastName", "createdAt"]) {
  id: ID!
  firstName: String!
  lastName: String!
  createdAt: AWSDateTime!
}
```

両方の同期式は、AWS AppSync クエリ操作を介して Amazon DynamoDB からレコードを取得します。

```js
DataStore.configure({
  syncExpressions: [
    syncExpression(User, () => {
      const lastName = await getLastNameForSync();
      return (c) => c.lastName('eq', lastName)
    })
  ]
});

// OR

DataStore.configure({
  syncExpressions: [
    syncExpression(User, () => {
      const lastName = await getLastNameForSync();
      return (c) => c.lastName('eq', lastName).createdAt('gt', '2020-10-10')
    })
  ]
});
```

クエリ式を構築するには、GSIのプライマリキーで述語を返します。 この述語では、 `eq` 演算子のみを使用できます。

`(c) => c.lastName('eq', 'Bobby') 上で定義されたスキーマに対して、` は有効なクエリ式です。

オプションで、この式にソートキーを連鎖させることもできます。 以下のいずれかの演算子を使用します: `eq | ne | le | lt | ge | gt | beginsWith | between`.

E.g., `(c) => c.lastName('eq', 'Bobby').createdAt('gt', '2020-10-10')`.

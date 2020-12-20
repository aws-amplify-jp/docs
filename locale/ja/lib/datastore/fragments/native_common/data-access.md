
<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/importing-datastore-snippet.md"></inline-fragment>

## 作成して更新

DataStore にデータを書き込むには、モデルのインスタンスを `Amplify.DataStore.save()` に渡してください。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/save-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/save-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/save-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/save-snippet.md"></inline-fragment>

`save` メソッドは、新しいレコードを作成するか、ローカルストアにすでに存在するイベントでレコードを更新します。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/update-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/update-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/update-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/update-snippet.md"></inline-fragment>

## 削除

アイテムを削除するには、インスタンスに渡すだけです。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/delete-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/delete-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/delete-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/delete-snippet.md"></inline-fragment>

## クエリデータ

クエリは _ローカルストア_に対して実行されます。 クラウド同期が有効な場合、ローカルストアは DataStore Sync Engine によってバックグラウンドで更新されます。

オブジェクトの任意のフィールド値をマッチさせるなど、より高度なフィルタリングを行うには、クエリ述語を指定できます。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-basic-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-basic-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-basic-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-basic-snippet.md"></inline-fragment>

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-single-item-snippet.md"></inline-fragment>

### 予測

Predicates は、DataStore 内のアイテムを一致させるために使用できるフィルタです。query() に適用されると、返される結果を制限します。 save() に適用されると、データを更新するための前提条件として動作します。 スキーマ内のフィールドに対して、以下の述語を使用することで一致することができます:

**Strings:** `eq | ne | le | lt | ge | gt | contains | beginsWith |`

**数値:** `eq | ne | le | lt | ge | gt |`

**リスト:** `contains | notContains`

例えば、 `Post` のすべてのモデルのリストが必要な場合、 `rating` が 4 より大きい場合があります。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-predicate-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-predicate-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-predicate-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-predicate-snippet.md"></inline-fragment>

[GraphQL 変換条件文](~/cli/graphql-transformer/resolvers.md)で定義されているもののように、複数の条件を使用することもできます。 例えば、[ 4 ](~/cli/graphql-transformer/resolvers.md) より大きく、 `発行済み` の評価を持つすべての投稿を取得します。 `発行済み`:

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-predicate-multiple-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-predicate-multiple-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-predicate-multiple-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-predicate-multiple-snippet.md"></inline-fragment>

あるいは、 `または` 論理演算子を使用することもできます。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-predicate-or-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-predicate-or-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-predicate-or-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-predicate-or-snippet.md"></inline-fragment>

<inline-fragment platform="js" src="~/lib/datastore/fragments/native_common/sort.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/native_common/sort.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/native_common/sort.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/native_common/sort.md"></inline-fragment>

### 改ページ

クエリ結果は、 `ページ` (0 から始まる) 番号とオプションの `制限` (デフォルトは 100) で渡すことでページネーションすることもできます。 最初の100項目のリストを返します:

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-pagination-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-pagination-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-pagination-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-pagination-snippet.md"></inline-fragment>

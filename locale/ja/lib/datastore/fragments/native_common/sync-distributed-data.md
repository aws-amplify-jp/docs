## 分散データ

分散データを扱う場合、ローカルシステムとリモートシステムの状態に注意することが重要です。 DataStoreはそれをできるだけシンプルにしようとしますが、いくつかのシナリオでは考慮が必要になる場合があります。


たとえば、データを更新または削除する場合、ローカルデータの状態がバックエンドと不同期になる可能性があることを考慮する必要があります。 このシナリオは、条件をどのように実装するかに影響を与える可能性があります。


<inline-fragment platform="js" src="~/lib/datastore/fragments/native_common/sync-save-delete-predicate.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/sync/19-sync-save-delete-predicate.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/native_common/sync-save-delete-predicate.md"></inline-fragment>

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/sync/20-savePredicate.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/sync/20-savePredicate.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/sync/20-savePredicate.md"></inline-fragment>

以下の例でわかるように、前述の API での `if/else` 構造と述語を使用して、従来のローカル条件チェックには違いがあります。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/sync/30-savePredicateComparison.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/sync/30-savePredicateComparison.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/sync/30-savePredicateComparison.md"></inline-fragment>

### 競合の検出と解決

複数の場所で同時にデータを更新すると、いくつかの競合が発生する可能性があります。 ほとんどの場合、デフォルトの *Auto-merge* アルゴリズムは競合を解決できるはずです。 しかし、アルゴリズムが解決できないシナリオがあります。 より高度なオプションが利用可能で、次のセクションで詳細に説明されています。

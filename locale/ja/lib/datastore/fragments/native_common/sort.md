### 並べ替え

クエリの結果は 1 つまたは複数のフィールドでソートすることもできます。

例えば、すべての `Post` オブジェクトを `rating` で昇順にソートします。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-sort-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-sort-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-sort-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-sort-snippet.md"></inline-fragment>

`Post` オブジェクトを最初に `rating` で昇順に並べ替え、 `title` で降順に並べ替えるには:

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/data-access/query-sort-multiple-snippet.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/data-access/query-sort-multiple-snippet.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/data-access/query-sort-multiple-snippet.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/data-access/query-sort-multiple-snippet.md"></inline-fragment>
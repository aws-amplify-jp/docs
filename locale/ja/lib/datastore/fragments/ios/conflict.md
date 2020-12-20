DataStore にはいくつかのオプション設定があります。 例えば、システムの任意の部分で行われるエラーメッセージのカスタムハンドラを指定する機能などです。 競合解決戦略のいずれかでAWS AppSyncによって変更が拒否された場合に実行されるカスタム競合ハンドラを指定することもできます。

最後に、機器にローカルに保存されるアイテム(モデルごと)上限として同期するレコード数を設定できます。 Delta Sync プロセスの一部として実行されるデフォルトの 24 時間の「ベースクエリ」のオーバーライドであるカスタム間隔を分単位で指定します。

### 例

以下のコードは、同じタイトルを持つ変異を再試行する `Post` モデルの競合解決ハンドラを示しています。 他のすべての分野の最新のリモートデータです 競合解決ハンドラは他のすべてのモデルの競合を破棄します(` .applyRemote ` を `` に `resolve` 関数に渡すことによって)。

```swift
// custom conflict resolution configuration
let dataStorePlugin = AWSDataStorePlugin(modelRegistration: AmplifyModels(),
                                         configuration: .custom(
    errorHandler: { error in Amplify.Logging.error(error: error) },
    conflictHandler: { (data, resolve) in
        guard let localPost = data.local as? Post,
            let remotePost = data.remote as? Post else {
                resolve(.applyRemote)
                return
        }

        // always favor the title from the local post
        let mergedModel = Post(title: localPost.title,
                               rating: remotePost.rating,
                               status: remotePost.status)
        resolve(.retry(mergedModel))
    },
    // Sync configuration defaults:
    syncInterval: .hours(24),
    syncMaxRecords: 10_000,
    syncPageSize: 1_000
))
```

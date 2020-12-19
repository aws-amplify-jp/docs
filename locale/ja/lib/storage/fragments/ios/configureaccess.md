## 保護されたアクセス

`オプション` オブジェクトを `.protected` アクセスレベルで作成し、キーのアクセスを制限します。

```swift
let dataString = "My Data"
let data = dataString.data(using: .utf8)!
let options = StorageUploadDataRequest.Options(accessLevel: .protected)
Amplify.Storage.uploadData(key: "userProtectedKey", data: data, options: options) { result in
    // handle result
}
```

`.protected` のアクセスレベルを持つファイルをアップロードするとき:
* 所有者はアクセスを読み取り、書き込み、削除することができます
* 他のユーザーのみ読み取りアクセス権を持っています

別のユーザーがファイルを読み込みたい場合は、 `targetIdentityId` パラメータを含める必要があります。

```swift
let options = StorageDownloadDataRequest.Options(accessLevel: .protected,
                                                 targetIdentityId: "OtherUserIdentityId")
Amplify.Storage.downloadData(key: "userProtectedKey", options: options) { result in
    // handle result
}
```

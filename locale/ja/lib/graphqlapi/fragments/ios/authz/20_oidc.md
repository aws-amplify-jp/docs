
アプリに次のコードを追加します。

* `APIAuthProviderFactory` のサブクラスを作成する
```swift
class MyAPIAuthProviderFactory: APIAuthProviderFactory {
    let myAuthProvider = MyOIDCAuthProvider()

    オーバーライドfunc oidcAuthProvider() -> AmplifyOIDCAuthProvider? {
        return myAuthProvider
    }
}
```

* `AmplifyOIDCAuthProvider` に準拠するクラスを実装 :
```swift
class MyOIDCAuthProvider : AmplifyOIDCAuthProvider {
    func getLatestAuthToken() -> Result<String, Error> {
       ....
    }
}
```
* 最後に、 `Amplify.configure()` を呼び出す前に、 `APIAuthProviderFactory` のインスタンスを登録してください。
```swift
try Amplify.add(plugin: AWSAPIPlugin(apiAuthProviderFactory: MyAPIAuthProviderFactory()))
try Amplify.configure()
```
When using a third-party OIDC auth provider, you are required to provide an instance of `APIAuthProviderFactory`. Your factory implementation must be capable of creating objects conforming to the `AmplifyOIDCAuthProvider` protocol. The responsibility of the `AmplifyOIDCAuthProvider` is to return the JWT token that was provided by your OIDC provider. To do this:
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
let dataStorePlugin = AWSDataStorePlugin(modelRegistration: AmplifyModels())
try Amplify.add(plugin: dataStorePlugin)
try Amplify.add(plugin: AWSAPIPlugin(apiAuthProviderFactory: MyAPIProviderFactory()))
try Amplify.configure()
```

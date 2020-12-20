## スキーマの例

次のスキーマは、 `@auth` ディレクティブを使用する `Todo` という名前のモデルの例です。

```graphql
type Todo
    @model
    @auth(rules: [
        { allow: owner, ownerField: "owner", operations: [create, update, delete] },
    ]) {
    id: ID!
    content: String!
    owner: String
}
```

By setting `allow:owner` with `operations` set to `create`, `update` and `delete`, we have effectively set permissions for both the user who created the model (owner) and everyone else (non-owners). For owners this means, they can update and delete their created instances. For non-owners, this means they can read instances that are not owned by them and are restricted from updating or deleting them.

For example, if there are two users, UserA and UserB, where UserA creates a `Todo` instance named `todo123`, UserA can create, update, or delete `todo123`. UserB can read `todo123` but can not update or delete `todo123`.

Amplify DataStore で使用する場合、 `@auth` ディレクティブは以下のフィールドをサポートしています。

  - `"owner" と "groups" で` を許可する
  - `ownerField`
  - `グループ`
  - `操作`

## Amazon CognitoユーザープールでAPIを設定する

スキーマ内で `@auth` ディレクティブを使用して、読み取り/書き込みアクセスを制限します。 所有者を区別するためには認証をアプリに統合する必要があります これを設定するには、次のコマンドを実行します。

```console
増幅アップデートAPI
```

次にプロンプトに従ってください:

```console
? Please select from one of the below mentioned services: 
  `GraphQL`
? Select from the options below 
  `Update auth settings`
? Choose the default authorization type for the API 
  `Amazon Cognito User Pool`
```

終了したら、 `amplify push` を実行して、バックエンドでサービスをプロビジョニングします。

## 設定

Upon successfully running `amplify push` per the last step, `amplifyconfiguration.json` will have a section under "awsAPIPlugins" and "awsCognitoAuthPlugin" with the corresponding API and Auth configurations. Your `amplifyconfiguration.json` may look like this:

```json
{
    "api": {
        "plugins": {
            "awsAPIPlugin": {
                // ...
            }
        }
    },
    "auth": {
        "plugins": {
            "awsCognitoAuthPlugin": {
                // ...
            }
        }
    }
```

設定する前にAmplifyに「AWScognitoAuthPlugin」と「AWSAPIPlugin」を追加します

```swift
Amplify.add(plugin: AWScognitoAuthPlugin())
Amplify.add(plugin: AWSAPIPlugin())
Amplify.configure()
```

## 認証要件

In order to issue an operation (`Datastore.save`, `Datastore.delete`) on a model that has fine grain controls defined, the user must be signed in using `Amplify.Auth.signIn`. A user's sign-in state may vary during the lifecycle of an app, so it is a common practice to check if the user has already been signed in by using `Amplify.Auth.fetchAuthSession` prior to attempting to update/delete a model that uses the @auth directive. The following are examples of how we recommend you handle auth state in your application:

1. User's sign in state is known to be signed out, and the user needs to sign in, prior to making a call to `DataStore.save()`.

```swift
Amplify.Auth.signIn {
    switch $0 {
    case .success(let signInResult):
        if signInResult.isSignedIn {
            // Amplify.DataStore.save
        }
    case .failure(let error):
        print("Sign in error \(error)")
    }
}
```

2. User's sign in state is unknown (for example, app was terminated or transitioned from background to foreground) and you need to check prior to making a call to `Datastore.save()`.

```swift
_ = Amplify.Auth.fetchAuthSession {
    switch $0 {
    case .success(let authSession):
        if authSession.isSignedIn {
            // Amplify.DataStore.save
        }
    case .failure(let error):
        print("failed to get auth session", error)
    }
}
```

3. アプリケーションのライフサイクル中に、Authイベントをリッスンして、ユーザーの状態に基づいて異なるビューを表示します。 詳細については、 [Auth Events](~/lib/auth/auth-events.md) を参照してください。

関連トピックの詳細については:

- [Auth.SignIn](~/lib/auth/signin.md)
- [Auth.fetchAuthSession](~/lib/auth/getting-started.md#check-the-current-auth-session)
- [認証イベント](~/lib/auth/auth-events.md)

## モデル所有者

モデルの所有者を確認するには、 `DataStore.query` を呼び出し、ユーザーのユーザー名を owner フィールドに照らしてください。
```swift
if let currentUser = Amplify.Auth.getCurrentUser() {
    if currentUser.username == todo.owner {
        print("This todo was created by the current user")
    }
}
```

If you attempt to call `DataStore.save` or `DataStore.delete` on a model that is not owned by the user, then a `conditionalSaveFailed` event will be emitted with the `MutationEvent` for you to immediately retrieve the current state of the model.

```swift
_ = Amplify.Hub.listen(to: .dataStore) { payload in
    if payload.eventName == HubPayload.EventName.DataStore.conditionalSaveFailed {
        if let mutationEvent = payload.data as? MutationEvent {
            let modelName = mutationEvent.modelName
            let id = mutationEvent.modelId
            if modelName == YourModel.modelName {
                // Amplify.DataStore.query(YourModel.self, id)
            }
        }
    }
}
```
`AWSMobileClient` は、ユーザー認証エクスペリエンスを作成したい開発者にAPIとBuilding Blockを提供します。
- 認証アクションを実行するための宣言メソッド
- 一般的なタスクを実行するための「ドロップイン」UI
- 自動トークンと資格情報の管理
- 認証ワークフローを実行するための通知による状態の追跡。

**Amazon Cognito**

[Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) は、ユーザ登録、ストレージ、認証、およびアカウント回復を処理するためのフル機能のユーザディレクトリサービスです。 Cognitoユーザプールは、JWTトークンをアプリに返しますが、認証されたAWSサービスを呼び出すための一時的なAWSの資格情報を提供しません。

[Amazon Cognito Federated Identities](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) は、アプリで AWS サービスの使用を許可する方法です。 federated Identity poolを使用すると、AWSサービスに直接アクセスする権限を定義した一時的なAWS資格情報を(IAM Policy経由で)取得できます。 またはAmazon API Gatewayを介してリソースにアクセスすることもできます。

Cognito Federated Identities (Facebook、Googleなどと同様)のアイデンティティプロバイダー(IDP)として機能します。 AWS AmplifyはCognitoユーザプールを使用してユーザ情報を保存し、Federated Identitiesは承認を処理します。 AmplifyはFederated Identityを利用してAWSへのユーザーアクセスを管理します。例えば、ユーザーがS3バケットにファイルをアップロードできるようにします。

> **前提条件:** [Amplify CLI をインストールして構成する](~/cli/start/install.md)

## 仕組み

The AWSMobileClient manages your application session for authentication related tasks. The credentials it pulls in can be used by other AWS services when you call a `.default()` constructor. The Amplify category examples in this documentation use this by default, however [you can also use this with any AWS service via the generated SDK clients](~/sdk/configuration/setup-options.md#direct-aws-service-access).

### 状態追跡

AWSMobileClient は、ユーザの認証状態のオンデマンドクエリを提供します。 例えば、ユーザーがサインインしているかどうかを確認し、適切な画面を表示することができます。 これは、初期化された `AWSMobileClient` の以下のプロパティを介して行われます:

- `.isLoggedIn` プロパティは、最も単純なユースケースの BOOLEAN として定義されています
- `.currentUserState` used for more advanced scenarios, such as determining if the user has Guest credentials, Authenticated with User Pools, has Federated credentials, or has signed out.

This allows you to manage workflows in your application based on the state of the user. The `AWSMobileClient` also offers notifications for user state changes. You can register for these in your application using `.addUserStateListener`.

```swift
AWSMobileClient.default().addUserStateListener(self) { (userState, info) in
            switch (userState) {
            case .guest:
                print("user is in guest mode.")
            case .signedOut:
                print("user signed out")
            case .signedIn:
                print("user is signed in.")
            case .signedOutUserPoolsTokenInvalid:
                print("need to login again.")
            case .signedOutFederatedTokensInvalid:
                print("user logged in via federation, but currently needs new tokens")
            default:
                print("unsupported")
            }
        }
```

### トークンの取得と更新

#### Cognitoユーザープール トークン
AWSMobileClient will return valid JWT tokens from the cache immediately if they have not expired. If they have expired, it will look for a **Refresh** token in the cache. If it is available, and not expired, the token will be used to fetch valid **IdToken** and **AccessTokens** and store them in the cache.

If the refresh tokens have expired and you try to make a call to an AWS resource, such as an AppSync GraphQL request or S3 upload, AWSMobileClient will dispatch a state notification that authentication is required. At this point you can choose to present the user with a login screen, by calling `AWSMobileClient.default().signIn()`, or perform custom business logic. For example:

```swift
AWSMobileClient.default().addUserStateListener(self) { (userState, info) in

            switch (userState) {
            case .signedOut:
                // user clicked signout button and signedout
                print("user signed out")
            case .signedOutUserPoolsTokenInvalid:
                print("need to login again.")
                AWSMobileClient.default().signIn(username: "username", password: "password", completionHandler: { (res, err) in
                    //...
                });
                //Alternatively call .showSignIn()
            default:
                print("unsupported")
            }
}
```

You can register to listen for state changes anywhere in your application with `.addUserStateListener`. If you want to cancel the re-authentication process, for instance if your application is shared among multiple users of the device, or a user clicks "cancel" on the re-login attempt, you can call `releaseSignInWait()` to terminate the call,then call `signOut()`.

#### AWS 資格情報

AWS 資格情報は、AWS IAMを使用するサービスへのリクエストへの署名に使用されます。 また、モバイルクライアントには、Amazon Cognito Federated Identity Poolsが提供しています。 JWT トークンと同様に、AWSMobileClient は有効な AWS 資格情報をキャッシュからすぐに返します。 セッションが認証された場合は、リフレッシュトークンを使用して資格情報がリフレッシュされます。 認証されていないセッションの場合、一時ゲストの資格情報がバックグラウンドで自動的にリフレッシュされます。

### オフラインサポート

AWSMobileClientは、オフラインからオンライン接続に移行するアプリケーションを考慮に入れて最適化されています。 これは、オフライン時にエラーが発生しないように、適切なタイミングで資格情報を更新します。 接続が利用できない場合、AWSMobileClientは自動的にユーザーをサインアウトしません。 セッションからサインアウトするためには、常に明示的な `signOut()` を呼び出す必要があります。

> **注**: 認証情報は Xcode キーチェーンに格納されています。これは暗号化されたコンテナです。 これは、アプリケーションをアンインストール/再インストールした後でも、セッションが認証され、認証情報がキーチェーンに存在する場合でも意味します。 その後、ユーザーは自動的にログインします(ログアウトしていない場合)。

ほとんどの場合、オフラインでサービスリクエストを行い、トークンが有効な場合があります。 AWSMobileClient は、リクエストを直接サービス クライアントに渡します。 したがって、ネットワーク接続を確認することはお客様の責任です。 これとは対照的に、AWS AppSync クライアントはオフライン操作をサポートしており、接続が復元されるとリクエストはキューに入れられ、自動的に送信されます。 [AppSync](~/sdk/api/graphql.md) の詳細については、API ガイドを参照してください。

If you are offline and make a service request, and your tokens are **NOT** valid, the service request will be blocked and notifications for `signedOutUserPoolsTokenInvalid` or `signedOutFederatedTokensInvalid` will be sent. In the case of the AppSync client this can be ignored and the queries will come from cache or mutations enqueued. For all other services, if this happens and you are offline you should not make the service request until you come back online, at which point AWSMobileClient will automatically re-enter the token refresh flow outlined above, and make the service call with the refreshed credentials.

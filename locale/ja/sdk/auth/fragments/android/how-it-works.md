`AWSMobileClient` は、ユーザー認証エクスペリエンスを作成したい開発者にクライアント API とビルディングブロックを提供します。 これには、認証アクションを実行するための宣言型メソッド、一般的なタスクを実行するためのシンプルな「ドロップイン認証」UIが含まれます。 自動トークンと資格情報の管理、およびユーザーが認証したときにアプリケーションでワークフローを実行するための通知による状態の追跡。

**Amazon Cognito**

[Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) is a full-featured user directory service to handle user registration, storage, authentication, and account recovery. Cognito User Pools returns JWT tokens to your app and does not provide temporary AWS credentials for calling authorized AWS Services. [Amazon Cognito Federated Identities](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) on the other hand, is a way to authorize your users to use AWS services. With an identity pool, you can obtain temporary AWS credentials with permissions you define to access other AWS services directly or to access resources through Amazon API Gateway.

Cognitoユーザープールは、Cognito Federated Identitiesのユーザーアイデンティティ(アイデンティティプロバイダ)のソースとして機能します。 その他のソースはOpenID、Facebook、Googleなどです。 AWS Amplifyはユーザプールを使用してユーザ情報と権限を保存します。 また、Federated Identities を使用して、AWS Resources へのユーザアクセスを管理します。たとえば、ユーザが S3 バケットにファイルをアップロードできるようにします。

**前提条件:** [Amplify CLI](~/cli/cli.md)<br> **推奨:** [Getting Startedガイドを完了](~/start/start.md)

## 仕組み

The AWSMobileClient manages your application session for authentication related tasks. The credentials it pulls in can be used by other AWS services when you call a `.getInstance()` constructor. The Amplify category examples in this documentation use this by default, however [you can also use this with any AWS service via the generated SDK clients](~/sdk/configuration/setup-options.md).

### 状態追跡

`AWSMobileClient` は、アプリケーション内のユーザーの「ログイン状態」に対するオンデマンドクエリを提供します。 例えば、ユーザーがサインインしているかどうかを確認し、適切な画面を表示することができます。これはいくつかのメカニズムを介して行われます。

- `isSignedIn` プロパティは、最もシンプルなユースケースの BOOLEAN として定義されています
- `currentUserState` は、ユーザーがゲストの資格情報を持っているかどうかを判断するなど、より高度なシナリオに使用されます。 ユーザープールで認証され、Federated資格情報を持っているか、またはサインアウトしました。

This allows you to write workflows in your application based on the state of the user and what you would like to present on different screens. The `AWSMobileClient` also offers realtime notifications on user state changes which you can register for in your application using `.addUserStateListener()` as in the code below.

```java
AWSMobileClient.getInstance().addUserStateListener(new UserStateListener() {
    @Override
    public void onUserStateChanged(UserStateDetails userStateDetails) {
        switch (userStateDetails.getUserState()){
            case GUEST:
                Log.i("AuthQuickStart", "user is in guest mode");
                break;
            case SIGNED_OUT:
                Log.i("AuthQuickStart", "user is signed out");
                break;
            case SIGNED_IN:
                Log.i("AuthQuickStart", "user is signed in");
                break;
            case SIGNED_OUT_USER_POOLS_TOKENS_INVALID:
                Log.i("AuthQuickStart", "need to login again");
                break;
            case SIGNED_OUT_FEDERATED_TOKENS_INVALID:
                Log.i("AuthQuickStart", "user logged in via federation, but currently needs new tokens");
                break;
            default:
                Log.e("AuthQuickStart", "unsupported");
        }
    }
});
```



### トークンの取得と更新

#### Cognitoユーザープールトークン
The `AWSMobileClient` will return valid JWT tokens from your cache immediately if they have not expired. If they have expired it will look for a **Refresh** token in the cache. If it is available and not expired it will be used to fetch a valid **IdToken** and **AccessToken** and store them in the cache.

If the Refresh tokens have expired and you then make call to any AWS service, such as a AppSync GraphQL request or S3 upload, the `AWSMobileClient` will dispatch a state notification that a re-login is required. At this point you can choose to present the user with a login screen, call `AWSMobileClient.default().signIn()`, or perform custom business logic. For example:

```java
AWSMobileClient.getInstance().addUserStateListener(new UserStateListener() {
    @Override
    public void onUserStateChanged(UserStateDetails userStateDetails) {
        switch (userStateDetails.getUserState()) {
            case SIGNED_OUT:
                // user clicked signout button and signedout
                Log.i("AuthQuickStart", "user signed out");
                break;
            case SIGNED_OUT_USER_POOLS_TOKENS_INVALID:
                Log.i("AuthQuickStart", "need to login again.");
                AWSMobileClient.getInstance().signIn(username, password, null, new Callback<SignInResult>() {
                    //... 
                });
                //Alternatively call .showSignIn()
                break;
            default:
                Log.i("AuthQuickStart", "unsupported");
        }
    }
});
```

You can register to listen for this state change anywhere in your app with `.addUserStateListener()`, such as in `onCreate()` in the above example. If you want to cancel the re-login process, for instance if your application is shared among multiple users of the device or a user clicks "cancel" on the re-login attempt, you can call `releaseSignInWait()` to terminate the call and then call a `signOut()`.

#### AWS 資格情報

AWS 資格情報は、AWS IAMを使用するサービスへのリクエストへの署名に使用され、モバイルクライアントにはAmazon Cognito Identity Poolsが提供します。 JWT トークンと同様に、 `AWSMobileClient` は、有効期限が切れていない場合、すぐにキャッシュから有効な AWS 資格情報を返します。 期限切れの場合は、セッションが認証された場合に連合された JWT トークンを使用して更新されます。 ゲストのシナリオでは、自動的に更新されます。

### オフラインサポート

`AWSMobileClient` is optimized to account for applications transitioning from offline to online connectivity, and refreshing credentials at the appropriate time so that errors do not occur when actions are taken and connectivity is not available. In no cases will the `AWSMobileClient` automatically sign out a user if connectivity is not available. You must always make an explicit `signOut()` call for a user to be signed out of a session.

In most cases if you are offline and make a service request, and your tokens are valid, the `AWSMobileClient` will pass the request directly to the service client. Therefore it is your responsibility to check network connectivity. In the case of the AWS AppSync client it supports offline operations and the request will be enqueued and automatically sent when connectivity is restored, refreshing credentials if necessary. [See the API guide for more information on AppSync](~/sdk/api/graphql.md).

If you are offline and make a service request, and your tokens are **NOT** valid, the service request will be blocked and notifications for `SIGNED_OUT_USER_POOLS_TOKENS_INVALID` or `SIGNED_OUT_FEDERATED_TOKENS_INVALID` will be sent to the listener. In the case of the AppSync client this can be ignored and the queries will come from cache or mutations enqueued with credentials automatically refreshing upon reconnection. For all other services, if this happens and you are offline you should not make the service request until you come back online, at which point the `AWSMobileClient` will automatically re-enter the token refresh flow outlined above and then make the service call with the updated credentials.

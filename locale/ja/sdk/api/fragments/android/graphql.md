AWS AppSync を使用すると、リアルタイムおよびオフラインの機能を備えたデータドリブンなアプリケーションを構築できます。 [AppSync Android SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-android/) を使用すると、AWS AppSync サービスとアプリを統合でき、 [ここ](https://github.com/apollographql/apollo-android)のApolloプロジェクトに基づいています。 SDKは複数の認可モデルをサポートし、データをリアルタイムに更新するためのサブスクリプションハンドシェイクプロトコルを処理します。 また、オフラインサポート機能を内蔵しているため、アプリに簡単に統合できます。

AWS AppSync との連携は、次の手順で行うことができます。

1. クライアント側の設定で API エンドポイントと認証情報を設定します。
2. API スキーマから Java コードを生成します。
3. クエリ、変更、サブスクリプションを実行するためのアプリコードを記述します。

Amplify CLI は、このプロセスを容易にする AppSync のサポートを提供します。 CLI を使用して、AWS AppSync API を設定し、必要なクライアント側の設定ファイルをダウンロードできます。 コマンドラインで簡単なコマンドを実行することで、数分でクライアントサイドコードを生成できます。

### 設定

AWS SDKは、AWSリージョンとサービスエンドポイントを定義する `awsconfiguration.json` と呼ばれる集中化されたファイルを介して構成をサポートします。 あなたはこのファイルを二つの方法のいずれかで取得します。 AppSync コンソールで AppSync API を作成するか、Amplify CLI を使用するかによって異なります。

* If you are creating your API in the console, navigate to the `Getting Started` page, and follow the steps in the `Integrate with your app` section. The `awsconfiguration.json` file you download is already populated for your specific API. Place the file in the `./app/src/main/res/raw` directory of your Android Studio project for code generation.

* If you are creating your API with the Amplify CLI (using `amplify add api`), the `awsconfiguration.json` file is automatically downloaded and updated each time you run `amplify push` to update your cloud resources. The file is placed in the `./app/src/main/res/raw` directory of your Android Studio project.

### コード生成

Android でGraphQL 操作を実行するには、コード生成プロセスを実行する必要があります。 これは、クライアントが定義するGraphQLスキーマとステートメント(クエリ、変更、サブスクリプションなど)の両方を必要とします。 Amplify CLI ツールチェーンを使用すると、スキーマを自動的に引き出し、デフォルトの GraphQL クエリを生成することで、容易になります。 Gradle を使用してコード生成プロセスをキックオフする前に、変更やサブスクリプションを行います。 クライアントの要件が変更された場合、これらのGraphQL文を変更し、Gradleビルドを再び開始して型を再生成することができます。

#### AppSync API コンソールで作成された

Amplify CLI をインストールした後、ターミナルを開き、Android Studio プロジェクトのルートに移動し、以下を実行します。

```bash
amplify init
amplify add codegen --apiId XXXXXX
```

The `XXXXXX` is the unique AppSync API identifier that you can find in the console in the root of your API's integration page. When you run this command you can accept the defaults, which create a `./src/main.graphql` folder structure with your statements. When you add the required Gradle dependencies later, the generated packages are automatically added to your project.

**Note:** It is not necessary to run the command `amplify codegen` after adding an API, as code generation is done by the Gradle build process. However, if you subsequently update your API in the AppSync Console, you will need to re-run `amplify codegen` to update the local `schema.json` and `.graphql` with the modified schema.

#### AppSync API CLIを使用して作成されたAPI

端末で Android Studio のプロジェクト ディレクトリに移動し、以下を実行します。

```bash
amplify init ## プラットフォームとしてAndroidを選択します
amplify add api ## GraphQL, APIキー, "Todoアプリケーションフィールドを持つ単一オブジェクト"
```

サービス タイプのプロンプトが表示されたら、 *GraphQL* を選択します:

```console
?以下のサービスから選択してください（矢印キーを使用）
<unk> GraphQL
  REST
```

The `add api` flow above will ask you some questions, such as if you already have an annotated GraphQL schema. If this is your first time using the CLI select **No** and let it guide you through the default project **"Single object with fields (e.g., “Todo” with ID, name, description)"** as it will be used in the code examples below. Later on, you can always change it.

GraphQL エンドポイントに名前を付け、認証タイプを選択します。

```console
? Please select from one of the below mentioned services GraphQL
? Provide API name: myTodosApi
? Choose an authorization type for the API (Use arrow keys)
❯ API key
  Amazon Cognito User Pool
```

<amplify-callout> AWS AppSync API キーは作成から 7 日後に期限切れになり、API KEY 認証を使用することは開発にのみ推奨されます。 初期設定後にAWS AppSync の認証タイプを変更する。 `$ amplify update api` コマンドを使用し、 `GraphQL` を選択します。 </amplify-callout>

When you update your backend with *push* command, you can go to [AWS AppSync Console](http://console.aws.amazon.com/appsync/home) and see that a new API is added under *APIs* menu item:

```bash
push を増幅する
```

The `amplify push` process will prompt you to enter the codegen process and walk through configuration options. Accept the defaults and it will create a `./src/main.graphql` folder structure with your documents. You also will have an `awsconfiguration.json` file that the AppSync client will use for initialization. At any time you can open the AWS console for your new API directly by running the following command:

```bash
コンソールの api を増幅する
```

プロンプトが表示されたら、 **GraphQL**を選択します。 これにより、AWS AppSync コンソールが開き、クエリ、ミューテーションを実行できます。 またはサーバーでサブスクリプションを行い、クライアントアプリケーションの変更を確認します。

### SDKのインポートと設定

Androidスタジオ・プロジェクトでAppSyncを使用するには、プロジェクトの `build.gradle` をビルドスクリプト内で次の依存関係に変更します。

```groovy
classpath 'com.<unk> s:aws-android-sdk-appsync-gradle-plugin:2.9.+)
```

Next, in the app's build.gradle add in a plugin of `apply plugin: 'com.amazonaws.appsync'` and a dependency of `implementation 'com.amazonaws:aws-android-sdk-appsync:2.9.+'`. For example:


```groovy
apply plugin: 'com.android.application'
apply plugin: 'com.amazonaws.appsync' // REQUIRED

android {
    // Typical items
}
dependencies {
    // REQUIRED: Typical dependencies
    implementation 'com.amazonaws:aws-android-sdk-appsync:2.9.+'
    implementation 'org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.0'
    implementation 'org.eclipse.paho:org.eclipse.paho.android.service:1.1.1'
}
```


Finally, update your AndroidManifest.xml with updates to `<uses-permissions>` for network calls and offline state. Also, add a `<service>` entry under `<application>` for `MqttService` to use subscriptions:

```xml
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>

            <!--other code-->

        <application
            android:allowBackup="true"
            android:icon="@mipmap/ic_launcher"
            android:label="@string/app_name"
            android:roundIcon="@mipmap/ic_launcher_round"
            android:supportsRtl="true"
            android:theme="@style/AppTheme">

            <service android:name="org.eclipse.paho.android.service.MqttService" />

            <!--other code-->
        </application>
```

**プロジェクトをビルドする** 問題がないことを確認します。

### クライアントの初期化

Inside your application code, such as the `onCreate()` lifecycle method of your activity class, you can initialize the AppSync client using an instance of `AWSConfiguration()` in the `AWSAppSyncClient` builder like the following:

```java

    private AWSAppSyncClient mAWSAppSyncClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mAWSAppSyncClient = AWSAppSyncClient.builder()
                .context(getApplicationContext())
                .awsConfiguration(new AWSConfiguration(getApplicationContext()))
                // If you are using complex objects (S3) then uncomment
                //.s3ObjectManager(new S3ObjectManagerImplementation(new AmazonS3Client(AWSMobileClient.getInstance())))
                .build();
    }
```

`AWSConfiguration()` reads configuration information in the `awsconfiguration.json` file. By default, the information in the `Default` section of the json file is used.

### クエリの実行

Now that the client is configured, you can run a GraphQL query. The syntax of the callback is `GraphQLCall.Callback<{NAME}Query.Data>` where `{NAME}` comes from the GraphQL statements that `amplify codegen` created after you ran a Gradle build. You invoke this from an instance of the AppSync client with a similar syntax of `.query({NAME}Query.builder().build())`. For example, if you have a `ListTodos` query, your code will look like the following:

```java
    public void query(){
        mAWSAppSyncClient.query(ListTodosQuery.builder().build())
                .responseFetcher(AppSyncResponseFetchers.CACHE_AND_NETWORK)
                .enqueue(todosCallback);
    }

    private GraphQLCall.Callback<ListTodosQuery.Data> todosCallback = new GraphQLCall.Callback<ListTodosQuery.Data>() {
        @Override
        public void onResponse(@Nonnull Response<ListTodosQuery.Data> response) {
            Log.i("Results", response.data().listTodos().items().toString());
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e("ERROR", e.toString());
        }
    };
```

Optionally, you can change the cache policy on `AppSyncResponseFetchers`, but we recommend leaving `CACHE_AND_NETWORK` because it pulls results from the local cache first before retrieving data over the network. This gives a snappy UX and offline support.

### 突然変異を実行

To add data you need to run a GraphQL mutation. The syntax of the callback is `GraphQLCall.Callback<{NAME}Mutation.Data>` where `{NAME}` comes from the GraphQL statements that `amplify codegen` created after a Gradle build. However, most GraphQL schemas organize mutations with an `input` type for maintainability, which is what the Amplify CLI does as well. Therefore you'll pass this as a parameter called `input` created with a second builder. You invoke this from an instance of the AppSync client with a similar syntax of `.mutate({NAME}Mutation.builder().input({Name}Input).build())` like the following:

```java
    public void mutation(){
        CreateTodoInput createTodoInput = CreateTodoInput.builder()
            .name("Use AppSync")
            .description("Realtime and Offline")
            .build();

        mAWSAppSyncClient.mutate(CreateTodoMutation.builder().input(createTodoInput).build())
            .enqueue(mutationCallback);
    }

    private GraphQLCall.Callback<CreateTodoMutation.Data> mutationCallback = new GraphQLCall.Callback<CreateTodoMutation.Data>() {
        @Override
        public void onResponse(@Nonnull Response<CreateTodoMutation.Data> response) {
            Log.i("Results", "Added Todo");
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e("Error", e.toString());
        }
    };
```

### データの購読

Finally, it's time to set up a subscription to real-time data. The callback is just `AppSyncSubscriptionCall.Callback` and you invoke it with a client `.subscribe()` call and pass in a builder with syntax of `{NAME}Subscription.builder()` where `{NAME}` comes from the GraphQL statements that `amplify codegen` and Gradle build created. Note that the AppSync console and Amplify GraphQL transformer have a common nomenclature that puts the word `On` in front of a subscription as in the following example:

```java
    private AppSyncSubscriptionCall<OnCreateTodoSubscription.Data> subscriptionWatcher;

    private void subscribe() {
        OnCreateTodoSubscription subscription = OnCreateTodoSubscription.builder().build();
        subscriptionWatcher = mAWSAppSyncClient.subscribe(subscription);
        subscriptionWatcher.execute(subCallback);
    }

    private AppSyncSubscriptionCall.Callback<OnCreateTodoSubscription.Data> subCallback = new AppSyncSubscriptionCall.Callback<OnCreateTodoSubscription.Data>() {
        @Override
        public void onResponse(@Nonnull Response<OnCreateTodoSubscription.Data> response) {
            Log.i("Subscription", response.data().toString());
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e("Subscription", e.toString());
        }

        @Override
        public void onCompleted() {
            Log.i("Subscription", "Subscription completed");
        }
    };
```

サブスクリプションは、mutions のような入力型を取ることもできます。その場合、入力に基づいて特定のイベントを購読します。

### バックグラウンドタスク

Android クライアントのすべての GraphQL 操作は、自動的に非同期タスクとして実行され、任意のスレッドから安全に呼び出すことができます。 バックグラウンドスレッドからGraphQL操作を実行する必要がある場合は、以下の例のように、 `Runnable()` で実行できます。

```java
final CountDownLatch mCountDownLatch = new CountDownLatch(1);

new Thread(new Runnable() {
    @Override
    public void run() {
        Looper.prepare();

        //Prepare GraphQL operation...
        AddPostMutation addPostMutation = AddPostMutation.builder().input(createPostInput).build();

        awsAppSyncClient
            .mutate(addPostMutation)
            .enqueue(new GraphQLCall.Callback<AddPostMutation.Data>() {
                @Override
                public void onResponse(@Nonnull final Response<AddPostMutation.Data> response) {
                    addPostMutationResponse = response;
                    mCountDownLatch.countDown();
                    if (Looper.myLooper() != null) {
                        Looper.myLooper().quit();
                    }
                }

                @Override
                public void onFailure(@Nonnull final ApolloException e) {
                    e.printStackTrace();
                    //Set to null to indicate failure
                    addPostMutationResponse = null;
                    mCountDownLatch.countDown();
                    if (Looper.myLooper() != null) {
                        Looper.myLooper().quit();
                    }
                }
            });

        Looper.loop();

    }
}).start();

try {
    mCountDownLatch.await(60, TimeUnit.SECONDS);
} catch (InterruptedException iex) {
    iex.printStackTrace();
}
```

### モックとローカルテスト

Amplifyは、クラウドにプッシュする前に、AWS AppSyncでアプリケーションをテストするためのローカルモックサーバの実行をサポートしています。 詳細は [CLI ツールチェーン ドキュメント](~/cli/usage/mock.md) を参照してください。

### クライアントアーキテクチャ

AppSync クライアントはオフラインシナリオをサポートし、「キャッシュを通じて書き込み」を提供するプログラムモデルを提供します。 これにより、オフライン時にデータをレンダリングしたり、「楽観的な応答」を介して追加/更新したりすることができます。 次の図は、ネットワークGraphQL呼び出しとのAppSyncクライアントインターフェイス、オフラインの変更キュー、Apolloキャッシュ、およびアプリケーションコードを示しています。

![画像](~/images/appsync-architecture.png)


アプリケーション・コードは、GraphQL クエリ、変更、またはサブスクリプションを実行するために、AppSync クライアントと相互作用します。 APIキーを追加するHTTPレイヤーとインターフェースする場合、AppSyncクライアントは自動的に正しい認可メソッドを実行します。 トークン、または、セットアップの構成に応じてリクエストに署名します。 突然変異を行うとき 例えば、アプリに新しいアイテム(ブログ記事など)を追加するなど、AppSyncクライアントは、アプリがオフラインのときにローカルキュー(SQLiteのディスクに永続化)にこれを追加します。 ネットワーク接続が復元されると、変更はシリアルの AppSync に送信され、応答を一つずつ処理することができます。

クエリによって返されるデータは、自動的に Apollo Cache に書き込まれます。 SQLite経由でディスクに永続化される「Store」です。キャッシュは参照構造体を使用してキー値ストアとして構造化されます。 後続のクエリが存在し、個々のアイテムの結果を参照するベースの「ルートクエリ」があります。 アプリケーションコードに参照キー(通常は「id」)を指定します。 "listPosts"クエリと"getPost(id:1)"クエリの結果を格納したキャッシュの例を以下に示します。

| キー                       | 値                                                  |
| ------------------------ | -------------------------------------------------- |
| root_query               | [ROOT_QUERY.listPosts, ROOT_QUERY.getPost(id:1)] |
| ROOT_QUERY.listPosts     | {0, 1, …,N}                                        |
| 投稿:0                     | {author:"Nadia", content:"ABC"}                    |
| 投稿:1                     | {author:"Shaggy", content:"DEF"}                   |
| ...                      | ...                                                |
| 投稿:N                     | {author:"Pancho", content:"XYZ"}                   |
| ROOT_QUERY.getPost(id:1) | ref: $Post:1                                       |

Notice that the cache keys are normalized where the `getPost(id:1)` query references the same element that is part of the `listPosts` query. This happens automatically on Android by using `id` as a common cache key to uniquely identify the objects. You can choose to change the cache key with the `.resolver()` method when creating the `AWSAppSyncClient`:

```java
AWSAppSyncClient.builder()
    .context(context)
    .awsConfiguration(awsConfiguration)
    .resolver(new CacheKeyResolver() {
        @Nonnull
        @Override
        public CacheKey fromFieldRecordSet(@Nonnull ResponseField field, @Nonnull Map<String, Object> recordSet) {
            return (CacheKey) recordSet.get("myKey");   //Use "mykey" instead as your cache key
        }

        @Nonnull
        @Override
        public CacheKey fromFieldArguments(@Nonnull ResponseField field, @Nonnull Operation.Variables variables) {
            return (CacheKey) field.resolveArgument("id", variables);
        }
    })
.build();
```

変更を実行している場合は、たとえオフラインであっても、いつでもこのキャッシュに「楽観的な応答」を書くことができます。 AppSync クライアントを使用して、アップデートにクエリを渡し、キャッシュ外のアイテムを読み込んで接続します。 これは通常、更新するクエリのGraphQL応答タイプに応じて、単一のアイテムまたはアイテムのリストを返します。 この時点でリストに追加し、削除します。 それを適切に更新してディスクに残す店舗への応答を書き戻すこともできます ネットワークに再接続すると、サービスからの応答は、権威ある応答として変更を上書きします。

#### オフラインミューテーション

As outlined in the architecture section, all query results are automatically persisted to disc with the AppSync client. For updating data through mutations when offline you will need to use an "optimistic response" by writing directly to the store. This is done by querying the store directly with `client.query().responseFetcher()` and passing in `AppSyncResponseFetchers.CACHE_ONLY` to pull the records for a specific query that you wish to update.

For example, the below code shows how you would update the `CreateTodoMutation` mutation from earlier by creating a `optimisticWrite(CreateTodoInput createTodoInput)` helper method that has the same input. This adds an item to the cache by first adding query results to a local array with `items.addAll(response.data().listTodos().items())` followed by the individual update using `items.add()`. You commit the record with `client.getStore().write()`. This example uses a locally generated unique identifier which might be enough for your app, however if the AppSync response returns a different value for `ID` (which many times is the case as best practice is generation of IDs at the service layer) then you will need to replace the value locally when a response is received. This can be done in the `onResponse()` method of the top level mutation callback by again querying the store, removing the item and calling `client.getStore().write()`.

```java
    private void optimisticWrite(CreateTodoInput CreateTodoInput){
        final CreateTodoMutation.CreateTodo expected =
                new CreateTodoMutation.CreateTodo(
                        "Pet",                          //GraphQL Type name
                        UUID.randomUUID().toString(),
                        createTodoInput.name(),
                        createTodoInput.description());

        final AWSAppSyncClient client = ClientFactory.appSyncClient();
        final ListTodosQuery listTodosQuery = ListTodosQuery.builder().build();

        client.query(listTodosQuery).responseFetcher(AppSyncResponseFetchers.CACHE_ONLY)
                .enqueue(new GraphQLCall.Callback<ListTodosQuery.Data>() {
                    @Override
                    public void onResponse(@Nonnull Response<ListTodosQuery.Data> response) {
                        //Populate a copy of the query in the cache
                        List<ListTodosQuery.Item> items = new ArrayList<>();
                        if(response.data() != null){
                            items.addAll(response.data().listTodos().items());
                        }

                        //Add the newly created item to the cache copy
                        items.add(new ListTodosQuery.Item(expected.__typename(),
                                expected.id(), expected.name(), expected.description()));

                        //Overwrite the cache with the new results
                        ListTodosQuery.Data data = new ListTodosQuery.Data(new ListTodosQuery.ListTodos(
                                "ModelPetConnection", items, null
                        ));

                            client.getStore().write(listTodosQuery, data).enqueue(null);
                            Log.i(TAG, "Successfully added item to local store");
                    }

                    @Override
                    public void onFailure(@Nonnull ApolloException e) {
                        Log.e(TAG, "Failed to add item ", e);
                    }
                });
    }
```

アプリケーションでの使用は以下のようになります:

```java
CreateTodoInput createTodoInput = CreateTodoInput.builder()
    name("Use AppSync").
    description("Realtime and Offline").
    build();

mAWSAppSyncClient.mutate(CreateTodoMutation.build().input(createTodoInput).build())
    .enqueue(mutationCallback);

optimisticWrite(createTodoInput);
```

You might add similar code in your app for updating or deleting items using an optimistic response, it would look largely similar except that you might overwrite or remove an element from the `response.data().listTodos().items()` array. A recommended best practice would be to create similar overloaded methods for `optimisticWrite(UpdateTodoInput updateTodoInput)` and `optimisticWrite(DeleteTodoInput deleteTodoInput)`.

Offline mutations work by default and are available in memory, as well as through app restarts. The `onResponse` callback in mutations is received when the network is available and will be executed as long as the app wasn't closed. However if the app was closed or crashed, the `persistentMutationsCallback` will be called in the `AWSAppSyncClient` builder which has information about the mutation type and identifier. You should use this in your client initialization routine to protect against any unknown app behaviors such as application errors or user interference:

```java

    private AWSAppSyncClient mAWSAppSyncClient;

    mAWSAppSyncClient = AWSAppSyncClient.builder()
      .context(getApplicationContext())
      .awsConfiguration(new AWSConfiguration(getApplicationContext()))
        .persistentMutationsCallback(new PersistentMutationsCallback() {
          @Override
          public void onResponse(PersistentMutationsResponse response) {
            if (response.getMutationClassName().equals("AddPostMutation")) {
              // perform action here add post mutation
            }
          }

          @Override
          public void onFailure(PersistentMutationsError error) {
            // handle error feedback here
          }
        })
      .build();

```

### 承認モード

For client authorization AppSync supports API Keys, Amazon IAM credentials (we recommend using Amazon Cognito Identity Pools for this option), Amazon Cognito User Pools, and 3rd party OIDC providers. This is inferred from the `awsconfiguration.json` when you call `.awsConfiguration()` on the `AWSAppSyncClient` builder.

#### API キー

API Key is the easiest way to setup and prototype your application with AppSync. It's also a good option if your application is completely public. If your application needs to interact with other AWS services besides AppSync, such as S3, you will need to use IAM credentials provided by Cognito Identity Pools, which also supports "Guest" access. See [the authentication section for more details](~/sdk/auth/getting-started.md). For manual configuration, add the following snippet to your `awsconfiguration.json` file:

```json
{
  "AppSync": {
        "Default": {
            "ApiUrl": "YOUR-GRAPHQL-ENDPOINT",
            "Region": "us-east-1",
            "ApiKey": "YOUR-API-KEY",
            "AuthMode": "API_KEY"
        }
   }
}
```

アプリに次のコードを追加します。

```java
private AWSAppSyncClient mAWSAppSyncClient;

mAWSAppSyncClient = AWSAppSyncClient.builder()
    .context(getApplicationContext())
    .awsConfiguration(new AWSConfiguration(getApplicationContext()))
    .build();
```

#### Cognitoユーザープール

Amazon Cognito User Pools is the most common service to use with AppSync when adding user Sign-Up and Sign-In to your application. If your application needs to interact with other AWS services besides AppSync, such as S3, you will need to use IAM credentials with Cognito Identity Pools. The Amplify CLI can automatically configure this for you when running `amplify add auth` and can also automatically federate User Pools with Identity Pools. This allows you to have both User Pool credentials for AppSync and AWS credentials for S3. You can then use the `AWSMobileClient` for automatic credentials refresh [as outlined in the authentication section](~/sdk/auth/getting-started.md). For manual configuration, add the following snippet to your `awsconfiguration.json` file:

```json
{
  "CognitoUserPool": {
        "Default": {
            "PoolId": "POOL-ID",
            "AppClientId": "APP-CLIENT-ID",
            "Region": "us-east-1"
        }
    },
  "AppSync": {
        "Default": {
            "ApiUrl": "YOUR-GRAPHQL-ENDPOINT",
            "Region": "us-east-1",
            "AuthMode": "AMAZON_COGNITO_USER_POOLS"
        }
   }
}
```

次のコードを `AWSMobileClient` から `cognitoUserPoolsAuthProvider()` に渡すトークンに追加します。

```java
private AWSAppSyncClient mAWSAppSyncClient;

mAWSAppSyncClient = AWSAppSyncClient.builder()
    .context(getApplicationContext())
    .awsConfiguration(new AWSConfiguration(getApplicationContext()))
    .cognitoUserPoolsAuthProvider(new CognitoUserPoolsAuthProvider() {
        @Override
        public String getLatestAuthToken() {
            try {
                return AWSMobileClient.getInstance().getTokens().getIdToken().getTokenString();
            } catch (Exception e){
                Log.e("APPSYNC_ERROR", e.getLocalizedMessage());
                return e.getLocalizedMessage();
            }
        }
    }).build();
```

#### IAM

When using AWS IAM in a mobile application you should leverage Amazon Cognito Identity Pools. The Amplify CLI can automatically configure this for you when running `amplify add auth`. You can then use the `AWSMobileClient` for automatic credentials refresh [as outlined in the authentication section](~/sdk/auth/getting-started.md) For manual configuration, add the following snippet to your `awsconfiguration.json` file:

```json
{
  "CredentialsProvider": {
      "CognitoIdentity": {
          "Default": {
              "PoolId": "YOUR-COGNITO-IDENTITY-POOLID",
              "Region": "us-east-1"
          }
      }
  },
  "AppSync": {
    "Default": {
          "ApiUrl": "YOUR-GRAPHQL-ENDPOINT",
          "Region": "us-east-1",
          "AuthMode": "AWS_IAM"
     }
   }
}
```

次に、 `AWSMobileClient` を `credentialsProvider()` に渡します。

```java         
private AWSAppSyncClient mAWSAppSyncClient;

mAWSAppSyncClient = AWSAppSyncClient.builder()
    .context(context)
    .awsConfiguration(new AWSConfiguration(getApplicationContext()))
    .credentialsProvider(AWSMobileClient.getInstance())
    .build();
```

#### OIDC

サードパーティ製のOIDCプロバイダーを使用している場合は、トークンの更新の詳細を管理する必要があります。 `awsconfiguration.json` ファイルとコードスニペットを以下のように更新します。

```json
{
  "AppSync": {
        "Default": {
            "ApiUrl": "YOUR-GRAPHQL-ENDPOINT",
            "Region": "us-east-1",
            "AuthMode": "OPENID_CONNECT"
        }
   }
}
```

以下のコードをアプリに追加してください(`MyOIDCAuthProvider` は例えば目的です):

```java
private AWSAppSyncClient mAWSAppSyncClient;

mAWSAppSyncClient = AWSAppSyncClient.builder()
    .context(context)
    .awsConfiguration(new AWSConfiguration(getApplicationContext()))
    .oidcAuthProvider(new OidcAuthProvider() {
        @Override
        public String getLatestAuthToken() {
            return MyOIDCAuthProvider();
        }
    })
    .build();

private static String MyOIDCAuthProvider(){
    // Fetch the JWT token string from OIDC Identity provider
    // after the user is successfully signed-in
    return "token";
}
```

#### マルチ認証

This section talks about the capability of AWS AppSync to configure multiple authorization modes for a single AWS AppSync endpoint and region. Follow the [AWS AppSync Multi-Auth](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#using-additional-authorization-modes) to configure multiple authorization modes for your AWS AppSync endpoint.

プライベートおよびパブリックのデータを配信するために、GraphQL API を 1 つ設定できるようになりました。 プライベートデータには、IAM、Cognitoユーザプール、OIDCなどの認証メカニズムを使用して認証されたアクセスが必要です。 パブリックデータは認証されたアクセスを必要とせず、API キーなどの認可メカニズムを介して提供されます。 1 つの GraphQL API を設定して、複数の認証タイプを使用してプライベートデータを配信することもできます。 たとえば、GraphQL API を構成して、OIDC を使用していくつかのスキーマフィールドを承認することができます。 一方、Cognito User Pools や IAM を介して他のスキーマフィールドが表示されます。

As discussed in the above linked documentation, certain fields may be protected by different authorization types. This can lead the same query, mutation, or subscription to have different responses based on the authorization sent with the request; Therefore, it is recommended to use different `AWSAppSyncClient` objects for each authorization type. Instantiation of multiple `AWSAppSyncClient` objects is enabled by passing `true` to the `useClientDatabasePrefix` flag. The `awsconfiguration.json` generated by the AWS AppSync console and Amplify CLI will add an entry called `ClientDatabasePrefix` in the "AppSync" section. This will be used to differentiate the databases used for operations such as queries, mutations, and subscriptions.

**Important Note:** If you are an existing customer of AWS AppSync SDK for Android, the `useClientDatabasePrefix` has a default value of `false`. If you choose to use multiple `AWSAppSyncClient` objects, turning on `useClientDatabasePrefix` will change the location of the databases used by the client. The databases will not be automatically moved. You are responsible for migrating any data within the databases that you wish to keep and deleting the old databases on the device.

以下のスニペットは、 `awsconfiguration.json` 内の新しい値とクライアント・コードの構成を強調します。

**awsconfiguration.json ベースのクライアントインスタンス化**

The `friendly_name` illustrated here is created from Amplify CLI prompt. There are 4 clients in this configuration that connect to the same API except that they use different `AuthMode` and `ClientDatabasePrefix`.

```
{
  "Version": "1.0",
  "AppSync": {
    "Default": {
      "ApiUrl": "https://xyz.us-west-2.amazonaws.com/graphql",
      "Region": "us-west-2",
      "AuthMode": "API_KEY",
      "ApiKey": "da2-xyz",
      "ClientDatabasePrefix": "friendly_name_API_KEY"
    },
    "friendly_name_AWS_IAM": {
      "ApiUrl": "https://xyz.us-west-2.amazonaws.com/graphql",
      "Region": "us-west-2",
      "AuthMode": "AWS_IAM",
      "ClientDatabasePrefix": "friendly_name_AWS_IAM"
    },
    "friendly_name_AMAZON_COGNITO_USER_POOLS": {
      "ApiUrl": "https://xyz.us-west-2.amazonaws.com/graphql",
      "Region": "us-west-2",
      "AuthMode": "AMAZON_COGNITO_USER_POOLS",
      "ClientDatabasePrefix": "friendly_name_AMAZON_COGNITO_USER_POOLS"
    },
    "friendly_name_OPENID_CONNECT": {
      "ApiUrl": "https://xyz.us-west-2.amazonaws.com/graphql",
      "Region": "us-west-2",
      "AuthMode": "OPENID_CONNECT",
      "ClientDatabasePrefix": "friendly_name_OPENID_CONNECT"
    }
  }
}
```

The `useClientDatabasePrefix` is added on the client builder which signals to the builder that the `ClientDatabasePrefix` should be used from the AWSConfiguration object (*awsconfiguration.json*).

```java
AWSAppSyncClient クライアント = AWSAppSyncClient.builder()
                               .context(getApplicationContext())
                               .awsConfiguration(new AWSConfiguration(getApplicationContext()))
                               .useClientDatabasePrefix(true)
                               .build();
```

次のコードは、認証モードに基づいてクライアントを取得するためのクライアントファクトリを作成します: public (API キー) or private (AWS IAM)。

```java
// AppSyncClientMode.java
public enum AppSyncClientMode {
    PUBLIC,
    PRIVATE
}

// ClientFactory.java
public class ClientFactory {

    private static Map<AWSAppSyncClient> CLIENTS;

    public static AWSAppSyncClient getAppSyncClient(AppSyncClientMode choice) {
        return CLIENTS[choice];
    }

    public static void initClients(final Context context) {
        AWSConfiguration awsConfigPublic = new AWSConfiguration(context);
        CLIENTS[PUBLIC] = AWSAppSyncClient.builder()
                                  .context(context)
                                  .awsConfiguration(awsConfigPublic)
                                  .useClientDatabasePrefix(true)
                                  .build();

        AWSConfiguration awsConfigPrivate = new AWSConfiguration(context);
        awsConfigPrivate.setConfiguration("friendly_name_AWS_IAM");
        CLIENTS[PRIVATE] = AWSAppSyncClient.builder()
                                   .context(context)
                                   .awsConfiguration(awsConfigPrivate)
                                   .useClientDatabasePrefix(true)
                                   .credentialsProvider(AWSMobileClient.getInstance())
                                   .build();
    }
}
```

これがそのようになります。

```java
ClientFactory.getAppSyncClient(AppSyncClientMode.PRIVATE).query(fooQuery).execute();
```

以下の例では、 `API_KEY` をデフォルトの認可モードとして使用し、 `AWS_IAM` を追加の認可モードとして使用します。

```
type Post @aws_api_key
          @aws_iam {
    id: ID!
    author: String!
    title: String
    content: String
    url: String @aws_iam
    ups: Int @aws_iam
    downs: Int @aws_iam
    version: Int!
}
```

1. `AWS_IAM[PRIVATE]認可モードを使用して、` `CLIENTS` を使用して投稿を追加します。

2. `AWS_IAM[PRIVATE]許可モードを使用して` `CLIENTS` を使用して投稿をクエリします。

3. `API_KEY[PUBLIC]の認証モードを使用して` `CLIENTS` を介して投稿をクエリします。

```java
apiKeyAppSyncClient.query(GetPostQuery.builder().id(id).build())
        .responseFetcher(responseFetcher)
        .enqueue(new GraphQLCall.Callback<GetPostQuery.Data>() {
            @Override
            public void onResponse(@Nonnull Response<GetPostQuery.Data> response) {
                GetPost post = response.data().getPost();
                post.id();
                post.author();
                post.title();
                post.content();
                post.version();

                post.url(); // Null - because it's not authorized
                post.ups(); // Null - because it's not authorized
                post.downs(); // Null - because it's not authorized

                if (response.hasErrors()) {
                        Log.d(TAG, response.errors().get(0).message()); // "Not Authorized to access url on type Post"
                        Log.d(TAG, response.errors().get(1).message()); // "Not Authorized to access ups on type Post"
                        Log.d(TAG, response.errors().get(2).message()); // "Not Authorized to access downs on type Post"
                }
            }

            @Override
            public void onFailure(@Nonnull ApolloException e) {
                e.printStackTrace();
            }
        });
```

**コードベースのクライアントインスタンス化**

`awsconfiguration.json` を使用する代わりに、 `AWSAppSyncClientBuilder` を使用できます。

```java
// AppSyncClientMode.java
public enum AppSyncClientMode {
    PUBLIC,
    PRIVATE
}

// ClientFactory.java
public class ClientFactory {

    private static Map<AWSAppSyncClient> CLIENTS;

    public static AWSAppSyncClient getAppSyncClient(AppSyncClientMode choice) {
        return CLIENTS[choice];
    }

    public static void initClients(final Context context) {
        AWSConfiguration awsConfigPublic = new AWSConfiguration(context);
        CLIENTS[PUBLIC] = AWSAppSyncClient.builder()
                              .context(context)
                              .apiKey(new BasicAPIKeyAuthProvider(apiKey))
                              .serverUrl(serverUrl)
                              .region(region)
                              .clientDatabasePrefix("API_KEY")
                              .useClientDatabasePrefix(true)
                              .build();

        CLIENTS[PRIVATE] = AWSAppSyncClient.builder()
                               .context(context)
                               .serverUrl(serverUrl)
                               .region(region)
                               .clientDatabasePrefix("AMAZON_COGNITO_USER_POOLS")
                               .useClientDatabasePrefix(true)
                               .cognitoUserPoolsAuthProvider(new CognitoUserPoolsAuthProvider() {
                                            @Override
                                            public String getLatestAuthToken() {
                                                try {
                                                    String idToken = AWSMobileClient.getInstance().getTokens().getIdToken().getTokenString();
                                                    return idToken;
                                                } catch (Exception e) {
                                                    e.printStackTrace();
                                                    return null;
                                                }
                                            }
                                        })
                               .build();
    }
}
```

### キャッシュをクリア

ローカルデバイス上の `AWSAppSyncClient` オブジェクトでキャッシュされたデータを消去します。

```java
try {
    awsAppSyncClient.clearCaches(); // queries, mutations and Delta Sync
} catch (AWSAppSyncClientException e) {
    e.printStackTrace();
}
```

`ClearCacheOptions` に基づいて選択的にキャッシュをクリアします。

```java
try {
    awsAppSyncClient.clearCaches(
        ClearCacheOptions.builder()
            .clearQueries() // clear the query cache
            .clearMutations() // clear the mutations queue
            .clearSubscriptions() // clear the subscriptions metadata stored for Delta Sync
            .build());
} catch (AWSAppSyncClientException e) {
    e.printStackTrace();
}
```

### デルタ同期

DeltaSyncでは、AWS AppSync GraphQLサーバーとの自動同期を実行できます。 クライアントは再接続、指数的なバックオフを実行し、デバイスへのデータ複製を簡素化するためにネットワークエラーが発生したときに再試行します。 これを行うには、GraphQL クエリの結果を取得し、ローカルの Apollo キャッシュでキャッシュします。 DeltaSync APIはApolloキャッシュへの書き込みを管理します。 そして、(React コンポーネントからのような) アプリケーション内のすべてのレンダリングは、読み取り専用のフェッチを介して行う必要があります。

最も基本的なフォームでは、API で単一のクエリを使用してバックエンドから state をクライアントにレプリケートできます。 これは「Base Query」と呼ばれ、DynamoDBテーブルに対応するGraphQL型のリスト操作になります。 コンテンツが頻繁に変更され、デバイスがオフラインとオンラインの間で頻繁に切り替わる大きなテーブルの場合。 ネットワークの再接続ごとにすべての変更を引くと、クライアントのパフォーマンスが低下する可能性があります。 この場合、クライアント API に、キャッシュにマージできる "Delta Query" という2番目のクエリを指定できます。 これを行うと、Base Queryが最初に実行され、データを使用してキャッシュをハイドレートします。 そして、各ネットワークでデルタクエリを再接続し、変更されたデータを取得するために実行されます。 ベースクエリは、「キャッチアップ」メカニズムとして定期的に実行されます。 デフォルトでは、これは24時間ごとですが、多かれ少なかれ頻繁にすることができます。

クライアントが1つのクエリと別のクエリのインクリメンタルアップデートを使用してキャッシュの基本ハイドレーションを分離できるようにすることにより、 クライアントアプリケーションからバックエンドに計算を移動できます。 これは、オンラインとオフラインの状態を定期的に切り替える際に、クライアントにとって大幅に効率的です。 これをAWS AppSync バックエンドで実装することができます。例えば、インデックスでDynamoDB Queryを条件式と一緒に使用するなど、さまざまな方法です。 また、Pipeline Resolversを活用して、レコードを分割してデルタ応答をジャーナルとして動作させることもできます。 [CloudFormationの完全なサンプルは、AppSyncドキュメント](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-delta-sync.html)で入手できます。 このドキュメントの残りの部分は、クライアントの使用状況に焦点を当てます。

GraphQL サブスクリプションでデルタ同期機能を使用することもできます。 ネットワーク接続を切り替えたときだけでなくネット上でも変更を送信する この場合、標準のGraphQLサブスクリプションステートメントである「Subscription Query」と呼ばれる3つ目のクエリを渡すことができます。 デバイスが接続されると、これらは通常どおりに処理され、クライアント API は、リアルタイムのデータを簡単に設定するのに役立ちます。 ただし、デバイスがオフラインからオンラインに切り替わったとき。 高速を考慮して、クライアントは次の順序で同期とメッセージ処理と共に再購読を実行します:

1. 定義されたクエリを購読し、結果を受信キューに保存します
2. 適切なクエリを実行します( `baseRefreshIntervalInSeconds` が経過した場合、それ以外の場合はDelta Queryのみを実行します)
3. 適切なクエリの結果を使用してキャッシュを更新します
4. サブスクリプションキューを削除し、通常通り処理を続ける

Finally, you might have other queries which you wish to represent in your application other than the base cache hydration. For instance a `getItem(id:ID)` or other specific query. If your alternative query corresponds to items which are already in the normalized cache, you can point them at these cache entries with the `cacheUpdates` function which returns an array of queries and their variables. The DeltaSync client will then iterate through the items and populate a query entry for each item on your behalf. If you wish to use additional queries which don't correspond to items in your base query cache, you can always create another instance of the `client.sync()` process.

**使用法**

```java
// Provides the ability to sync using a baseQuery, subscription, deltaQuery, and a refresh interval
Cancelable handle = client.sync(baseQuery, baseQueryCallback, 
              subscription, subscriptionCallback, 
              deltaQuery, deltaQueryCallback, 
              20 * 60 );

//Stop DeltaSync
handle.cancel();
```

**メソッドパラメータ**
* *baseQuery* のベースライン状態を取得するためのベースラインクエリ。 (REQUIRED)
* *baseQueryCallback* コールバックで、baseQuery の結果を処理します。(REQUIRED)
* *サブスクリプション* その場で変更を取得するためのサブスクリプション。
* *subscriptionCallback* サブスクリプションメッセージを処理するコールバック。
* *deltaQuery* キャッチアップクエリ
* *deltaQueryCallback* の結果を処理するコールバック。
* *ベースリフレッシュ間隔秒* (秒単位で指定) 更新されたベースリクエリの状態を取得するために再実行される時間。
* *returnValue* は `キャンセル可能` オブジェクトを返します。 `cancel()` メソッドを呼び出して同期をキャンセルするために後で使用できます。

上記の `baseQuery` と `baseQueryCallback` のみが必要なパラメータであることに注意してください。次のように異なる方法で API を呼び出すことができます。

```java
//基本クエリ
client.sync(baseQuery, baseQueryCallback, baseRefreshIntervalInSeconds) 

//Delta との同期を実行しますが、サブスクリプションはありません。
client.sync(baseQuery, baseQueryCallback, deltaQuery, deltaQueryCallback, 
        baseRefreshIntervalInSeconds) 
```

**例**

以下のセクションでは、Delta Syncを使用したアプリの作成の詳細について説明します。 私たちは、投稿のリストを表示し、デルタ同期機能を使用して同期を保つビューを持つシンプルな投稿アプリを使用します。 `allPosts` と呼ばれる地図オブジェクトを使用して、投稿とリサイクラービューを収集および管理し、UI を強化します。

**Base Query and BaseQuery Callback** In the Adapter object, create the BaseQuery and the BaseQuery Callback. We will use the `listPosts` query from the sample schema as our base query.
```java
//BaseQuery をセットアップする - ListPostsQuery をベースクエリとして使用します。
Query listPostsQuery = ListPostsQuery.build();
```

In the `baseQueryCallback` we will receive and process the results of `listPosts`. We will update the allPosts Map object with the query results and trigger the RecyclerView to refresh the contents of the view. The `listPosts` query cache will be automatically updated by the SDK.

```java
GraphQLCall.Callback listPostsQueryCallback = new GraphQLCall.Callback<ListPostsQuery.Data>() {
            @Override
            public void onResponse(@Nonnull final Response<ListPostsQuery.Data> response) {
                if (response == null  || response.data() == null ||
                        response.data().listPosts() == null ||
                        response.data().listPosts() == null ) {
                    Log.d(TAG, "List Posts returned with no data");
                    return;
                }

                Log.d(TAG, "listPostsQuery returned data. Iterating over the data");
                display.runOnUiThread(new Runnable() {
                   @Override
                   public void run() {
                       for (ListPostsQuery.ListPost p: response.data().listPosts()) {
                           //Populate the allPosts map with the posts returned by the query.
                           //The allPosts map is used by the recycler view.

                           allPosts.put(p.id(), new ListPostsQuery.ListPost("Post",
                                   p.id(), p.author(), p.title(), p.content(),
                                   p.url(),p.ups(),p.downs(),
                                   p.createdDate(),
                                   p.aws_ds()));
                       }
                       //Trigger the view to refresh by calling notifyDataSetChanged method
                       notifyDataSetChanged();
                   }
               });
            }

            @Override
            public void onFailure(@Nonnull ApolloException e) {
                Log.e(TAG, "ListPostsQuery failed with [" + e.getLocalizedMessage() + "]");
            }
        };
```

**サブスクリプションとサブスクリプションコールバック** 次へ 投稿に変更(追加、更新、削除)が発生するたびに通知を受け取るためのサブスクリプションを作成します。

```java
  //Setup Delta Post Subscription to get notified when a change 
  //(add, update, delete) happens on a Post
  OnDeltaPostSubscription onDeltaPostSubscription =
      OnDeltaPostSubscription.builder().build();
```

サブスクリプションコールバックでは、追加することで変更を処理します。 allPosts Mapオブジェクトを削除または更新し、RecyclerViewをトリガーしてビューの内容を更新します。 `listPosts` クエリのクエリキャッシュを更新するためのロジックも追加します。

```java
AppSyncSubscriptionCall.Callback onDeltaPostSubscriptionCallback =
    new AppSyncSubscriptionCall.Callback<OnDeltaPostSubscription.Data>() {
        @Override
        public void onResponse(@Nonnull Response<OnDeltaPostSubscription.Data> response) {
            Log.d(TAG, "Delta on a post received via subscription.");
            if (response == null  || response.data() == null
                    || response.data().onDeltaPost() == null ) {
                Log.d(TAG, "Delta was null!");
                return;
            }

            Log.d(TAG, "Updating post to display");
            final OnDeltaPostSubscription.OnDeltaPost p = response.data().onDeltaPost();

            display.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // Delete the Post if the aws_ds has the DELETE tag
                    if ( DeltaAction.DELETE == p.aws_ds()) {
                        allPosts.remove(p.id());
                    }
                    // Add/Update the post otherwise
                    else {
                        allPosts.put(p.id(), new ListPostsQuery.ListPost("Post",
                                p.id(), p.author(), p.title(), p.content(),
                                p.url(),p.ups(), p.downs(),
                                p.createdDate(),
                                p.aws_ds()));
                    }

                    //Update the baseQuery Cache
                    updateListPostsQueryCache();

                    //Trigger the view to refresh by calling notifyDataSetChanged method
                    notifyDataSetChanged();
                }
            });
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e(TAG, "Error " + e.getLocalizedMessage());
        }

        @Override
        public void onCompleted() {
            Log.d(TAG, "Received onCompleted on subscription");
        }
    };
```

`updateListPostsQueryCache` メソッドは以下に示すように、 `listPosts` クエリのクエリキャッシュを更新します。

```java
    private void updateListPostsQueryCache() {
        List<ListPostsQuery.ListPost> items = new ArrayList<>();
        items.addAll(allPosts.values());

        ListPostsQuery.Data data = new ListPostsQuery.Data(items);
        ClientFactory.getInstance(display.getApplicationContext()).getStore()
                .write(listPostsQuery, data).enqueue(null);
    }
```

**Delta Query and Delta Query Callback** Next we will setup the delta query. We will use the `listPostsDelta` query for the changes made to Posts. The SDK will keep track of when it was last run and will automatically pass in the appropriate value for `lastSync` to get the updates in an optimized manner.

```java
    //差分クエリをセットすると、投稿への変更が加えられます。
    クエリlistPostsDeltaQuery = ListPostPostsDeltaQuery.build();

```

In the `listPostsDeltaQueryCallback`, we will add, update, delete the changed Posts in the allPosts Map object and trigger the RecyclerView to refresh the contents of the view. We will also add the logic to update the query cache for the `listPosts` query.

```java
GraphQLCall.Callback listPostsDeltaQueryCallback = new GraphQLCall.Callback<ListPostsDeltaQuery.Data>() {
            @Override
            public void onResponse(@Nonnull final Response<ListPostsDeltaQuery.Data> response) {
                if (response == null  || response.data() == null || response.data().listPostsDelta() == null ) {
                    Log.d(TAG, "listPostsDelta returned with no data");
                    return;
                }

                //Add to the ListPostsQuery Cache
                Log.d(TAG, "listPostsDelta returned data. Iterating...");
                display.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        for (ListPostsDeltaQuery.ListPostsDeltum p: response.data().listPostsDelta() ) {
                            // Delete the Post if the aws_ds has the DELETE tag
                            if ( DeltaAction.DELETE == p.aws_ds()) {
                                allPosts.remove(p.id());
                                continue;
                            }

                            // Add or Update the post otherwise
                            allPosts.put(p.id(), new ListPostsQuery.ListPost("Post",
                                    p.id(), p.author(), p.title(), p.content(),
                                    p.url(),p.ups(), p.downs(),
                                    p.createdDate(),
                                    p.aws_ds()));
                        }

                        //Update the baseQuery Cache
                        updateListPostsQueryCache();

                        //Trigger the view to refresh by calling notifyDataSetChanged method
                        notifyDataSetChanged();
                    }
                });
            }

            @Override
            public void onFailure(@Nonnull ApolloException e) {
                Log.e(TAG, "listPostsDelta Query failed with [" + e.getLocalizedMessage() + "]");
            }
        };
```

**すべてをまとめよう** これらのピースをすべて揃えたら。 デルタ同期機能を以下のように呼び出して、すべてを結びつけます。

```java
 Cancelable handle = client.sync(listPostsQuery, listPostsQueryCallback, 
                           onCreatePostSubscription, onCreatePostCallback, 
               listPostsDeltaQuery, listPostsDeltaQueryCallback, 
                           20 * 60 );

```

**Delta Sync Lifecycle** 差分同期プロセスは、さまざまな条件に応じて様々な時間に実行されます:
- 上記のように `sync` を呼び出すと、直ちに実行されます。 これが最初の実行となり、baseQuery を実行し、サブスクリプションをセットアップし、delta Query を実行します。
- 実行中のデバイスがオフラインからオンラインに移行したときに実行されます。 デバイスがオフラインになった期間によって異なります ( i. ., > `baseRefreshIntervalInSeconds`), deltaQuery または baseQuery のいずれかが実行されます。
- アプリがバックグラウンドからフォアグラウンドに遷移したときに実行されます。 アプリがバックグラウンドにある期間に応じて、deltaQuery か baseQuery のどちらかが実行されます。 これを有効にするには `AWSAppSyncAppLifecycleObserver` をメインビューの `onCreate` メソッドでProcessLifeCycle 所有者に追加します。

```java
    import android.arch.lifecycleOwner;
    import com.amazonawsmobileconnectors.appsync.AWSAppSyncAppLifecycleObserver;

    ...
    ...

    ProcessLifecycleOwner.get().getLifecycle().
        addObserver(new AWSAppSyncAppLifecycleObserver());
```
- 周期キャッチアップの一部として `baseRefreshIntervalInSeconds` に 1 回実行されます。 

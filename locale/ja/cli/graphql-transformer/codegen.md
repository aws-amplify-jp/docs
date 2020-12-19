---
title: Client code generation
description: Amplifyのコードジェネレーション機能は、iOSとAndroid用のネイティブコードを生成し、FlowとTypeScript用の型を生成します。 GraphQL ステートメント(クエリ、変更、およびサブスクリプション)を生成することもできます。
---

Codegen は、iOS および Android 用のネイティブコードの生成、および Flow と TypeScript 用の型の生成に役立ちます。 また、GraphQL ステートメント(クエリ、変更、およびサブスクリプション)を生成し、コードを手渡す必要がないようにすることもできます。

Codegen `` のワークフローは、AppSync API がクラウドにプッシュされると自動的にトリガーされます。 AppSync APIが作成されたときとcodegenを選択した場合は、コードジェネを設定するように求められます。 変更がクラウドにプッシュされた後に生成されたコードを更新するように求められます。

When a project is configured to generate code with codegen, it stores all the configuration `.graphqlconfig.yml` file in the root folder of your project. When generating types, codegen uses GraphQL statements as input. It will generate only the types that are being used in the GraphQL statements.

## ステートメントの深さ

In the below schema there are connections between `Comment` -> `Post` -> `Blog` -> `Post` -> `Comments`. When generating statements codegen has a default limit of 2 for depth traversal. But if you need to go deeper than 2 levels you can change the max-depth parameter either when setting up your codegen or by passing  `--max-depth` parameter to `codegen`

```graphql
type Blog @model {
  id: ID!
  name: String!
  posts: [Post] @connection(name: "BlogPosts")
}
type Post @model {
  id: ID!
  title: String!
  blog: Blog @connection(name: "BlogPosts")
  comments: [Comment] @connection(name: "PostComments")
}
type Comment @model {
  id: ID!
  content: String
  post: Post @connection(name: "PostComments")
}
```

```graphql
query GetComment($id: ID!) {
  getComment(id: $id) { # depth level 1
    id
    content
    post { # depth level 2
      id
      title
      blog { # depth level 3
        id
        name
        posts { # depth level 4
          items { # depth level 5
            id
            title
          }
          nextToken
        }
      }
      comments { # depth level 3
        items { # depth level 4
          id
          content
          post { # depth level 5
            id
            title
          }
        }
        nextToken
      }
    }
  }
}
```

### 一般的な使い方

### 増幅してコードゲンを追加

```bash
増幅してコードゲンを追加
```

The `amplify add codegen` allows you to add AppSync API created using the AWS console. If you have your API is in a different region then that of your current region, the command asks you to choose the region. If you are adding codegen outside of an initialized amplify project, provide your introspection schema named `schema.json` in the same directory that you make the add codegen call from. __Note__: If you use the --apiId flag to add an externally created AppSync API, such as one created in the AWS console, you will not be able to manage this API from the Amplify CLI with commands such as amplify api update when performing schema updates. You cannot add an external AppSync API when outside of an initialized project.

### 設定コードを増幅する

```bash
設定コードを増幅する
```

`amplify configure codegen` コマンドを使用すると、プロジェクトにコードジェネレーションを追加後に更新できます。 初期化されたプロジェクト以外では、これを使用して、プロジェクトの構成とコードジェネレーションの構成を更新できます。

#### codegenステートメントを増幅する

```bash
codegen ステートメントを増幅する [--nodownload] [--max-depth <int>]
```

The `amplify codegen statements` command  generates GraphQL statements(queries, mutation and subscription) based on your GraphQL schema. This command downloads introspection schema every time it is run, but it can be forced to use previously downloaded introspection schema by passing `--nodownload` flag.

#### コード原型を増幅する

```bash
コード原型を増幅する
```

The `amplify codegen types [--nodownload]` command generates GraphQL `types` for Flow and typescript and Swift class in an iOS project. This command downloads introspection schema every time it is run, but it can be forced to use previously downloaded introspection schema by passing `--nodownload` flag.

#### コードゲンを増幅する

```bash
ampify codegen [--max-depth <int>]
```

The `amplify codegen [--nodownload]` generates GraphQL `statements` and `types`. This command downloads introspection schema every time it is run but it can be forced to use previously downloaded introspection schema by passing `--nodownload` flag. If you are running codegen outside of an initialized amplify project, the introspection schema named `schema.json` must be in the same directory that you run amplify codegen from. This command will not download the introspection schema when outside of an amplify project - it will only use the introspection schema provided.

## ワークフロー

コードジェネレーション機能の設計は、アプリケーション開発のライフサイクルのさまざまな点で実行するメカニズムを提供します。 例えば、アプリケーションのデータ取得要件を更新するだけでなく、API を単独で作成または更新する場合も含まれます。 さらに、スキーマが他のユーザーによって更新または管理されるチームで作業することができます。 最後に、(Xcode などからのように) 自動的に実行されるように、ビルドプロセスにコード生成を含めることもできます。

**フロー 1: API を作成し、自動的にコードを生成します**

```bash
amplify init
increify add api (GraphQLを選択)
push
```

You’ll see questions as before, but now it will also automatically ask you if you want to generate GraphQL statements and do codegen. It will also respect the `./app/src/main` directory for Android projects. After the AppSync deployment finishes the Swift file will be automatically generated (Android you’ll need to kick off a [Gradle Build step](#androiduse)) and you can begin using in your app immediately.

**フロー 2: GraphQL スキーマを変更し、プッシュして自動的にコードを生成**

開発中に、GraphQLスキーマと生成されたコードを反復開発/テストサイクルの一部として更新したい場合があります。 変更 & スキーマを `./amplify/backend/api/<apiname>/schema.graphql` で保存してから実行します。

```bash
push を増幅する
```

API内のコードを更新するように求められるたびに、コード生成を再実行するかどうかも尋ねられます。 新しいスキーマからのGraphQL文の再生成を含む。

**フロー 3: API の変更はありません。GraphQL 文を更新するだけです & コードを生成します**

GraphQLの利点の1つは、クライアントがAPIとは独立してデータ取得要件を定義できることです。 Amplify codegen は選択セットを変更することでこれをサポートします(例: GraphQLステートメントと実行中型生成のための中括弧内のフィールドの追加/削除)。 これにより、アプリケーションが行っているネットワーク要求を詳細に制御できます。 GraphQL ステートメントを変更し(変更されていない限り、 `./graphql` フォルダ内の既定)、ファイルを保存して実行します。

```bash
コード原型を増幅する
```
新しい更新されたSwiftファイルが作成されます(または同じためにAndroid上でGradle Buildを実行します)。 その後、アップデートをアプリケーションコードで使用できます。

**フロー 4: 共有スキーマ、他の場所で変更されました (例: コンソールワークフローまたはチームワークフロー)**

チーム内で作業していて、AWS AppSync コンソールまたは別のシステムからスキーマが更新されたとします。 時代遅れのスキーマからGraphQLステートメントが生成されたため、タイプが古くなっています。 これを解決する最も簡単な方法は、GraphQL文を再生成し、必要に応じて更新し、タイプを再度生成することです。 コンソールまたは別のシステムでスキーマを変更し、次を実行します。

```bash
codegenステートメントを増幅する
コードgenタイプを増幅する
```

スキーマの更新に一致する新たに生成されたGraphQL文とSwiftコードが必要です。 2番目のコマンドを実行すると、型も同様に更新されます。 あるいは、 `増幅コードジェネレーション` だけを実行すると、これらの両方のアクションが実行されます。

**フロー 5: 初期化されたプロジェクトの外側のイントロスペクションスキーマ**

If you would like to generate statements and types without initializing an amplify project, you can do so by providing your introspection schema named `schema.json` in your project directory and adding codegen from the same directory. To download your introspection schema from an AppSync api, in the AppSync console go to the schema editor and under "Export schema" choose `schema.json`.

```bash
増幅してコードゲンを追加
```

コードジェネレーションが追加されると、イントロスペクションスキーマを更新し、プロジェクト情報を再入力せずにステートメントとタイプを再度生成できます。

```bash
コードゲンを増幅する
```

必要に応じて、プロジェクトとコードジェネレーションの構成を更新できます。

```bash
codegen
の設定を増幅する
```

## iOSの使用法

このセクションでは、Swiftで記述されたiOSプロジェクトを取得し、AmplifyとAWS AppSyncを使用したGraphQL APIを追加するために必要な手順を説明します。 初めて使用する場合は、新しい Xcode プロジェクトと単一の View Controller を使用することをお勧めします。

### セットアップ

[Amplify Getting Started](~/start/start.md) を完了した後、端末で Xcode プロジェクト・ディレクトリに移動し、以下を実行します:

```bash
amplify init       ## Select iOS as your platform
amplify add api    ## Select GraphQL, API key, "Single object with fields Todo application"
amplify push       ## Sets up backend and prompts you for codegen, accept the defaults
```

The `add api` flow above will ask you some questions, like if you already have an annotated GraphQL schema. If this is your first time using the CLI select **No** and let it guide you through the default project **"Single object with fields (e.g., “Todo” with ID, name, description)"** as it will be used in the code generation examples below. Later on, you can always change it.

Since you added an API the `amplify push` process will automatically prompt you to enter the codegen process and walk through the configuration options. Accept the defaults and it will create a file named `API.swift` in your root directory (unless you choose to name it differently) as well as a directory called `graphql` with your documents. You also will have an `awsconfiguration.json` file that the AppSync client will use for initialization.

次に、AWS AppSync の SDK の依存性を使用して **Podfile** を変更します。

```ruby
ターゲット 'PostsApp' do
  use_frameworks!
  pod 'AWSAppSync'
end
```

Run `pod install` from your terminal and open up the `*.xcworkspace` Xcode project. Add the `API.swift` and `awsconfiguration.json` files to your project (_File->Add Files to ..->Add_) and then build your project ensuring there are no issues.

### AppSync クライアントを初期化
Inside your application delegate is the best place to initialize the AppSync client. The `AWSAppSyncServiceConfig` represents the configuration information present in awsconfiguration.json file. By default, the information under the `Default` section will be used. You will need to create an `AWSAppSyncClientConfiguration` and `AWSAppSyncClient` like below:

```swift
import AWSAppSync

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var appSyncClient: AWSAppSyncClient?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        do {
            // You can choose your database location if you wish, or use the default
            let cacheConfiguration = try AWSAppSyncCacheConfiguration()

            // AppSync configuration & client initialization
            let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(), cacheConfiguration: cacheConfiguration)
            appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
        } catch {
            print("Error initializing appsync client. \(error)")
        }
        // other methods
        return true
  }
```

Next, in your application code where you wish to use the AppSync client, such in a `Todos` class which is bound to your View Controller, you need to reference this in the `viewDidLoad()` lifecycle method:

```swift
import AWSAppSync

class Todos: UIViewController{
  //Reference AppSync client
  var appSyncClient: AWSAppSyncClient?

  override func viewDidLoad() {
      super.viewDidLoad()
      //Reference AppSync client from App Delegate
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appSyncClient = appDelegate.appSyncClient
  }
}
```

### クエリ
Now that the backend is configured, you can run a GraphQL query. The syntax is `appSyncClient?.fetch(query: <NAME>Query() {(result, error)})` where `<NAME>` comes from the GraphQL statements that `amplify codegen types` created. For example, if you have a `ListTodos` query your code will look like the following:

```swift
//Run a query
appSyncClient?.fetch(query: ListTodosQuery())  { (result, error) in
  if error != nil {
    print(error?.localizedDescription ?? "")
      return
  }
    result?.data?.listTodos?.items!.forEach { print(($0?.name)! + " " + ($0?.description)!) }
}
```

必要に応じて、次のようにクエリのキャッシュポリシーを設定できます。

```swift
appSyncClient?.fetch(query: ListTodosQuery(), cachePolicy: .returnCacheDataAndFetch) { (result, error)
```

`returnCacheDataAndFetch` はネットワーク経由でデータを取得する前に、最初にローカルキャッシュから結果を取得します。 これにより、オフラインのサポートと同様に、スムーズなUXを提供します。

### <unk>
For adding data now you will need to run a GraphQL mutation. The syntax `appSyncClient?.perform(mutation: <NAME>Mutation() {(result, error)})` where `<NAME>` comes from the GraphQL statements that `amplify codegen types` created. However, most GraphQL schemas organize mutations with an `input` type for maintainability, which is what the Amplify CLI does as well. Therefore you'll pass this as a parameter called `input` as in the example below:

```swift
let mutationInput = CreateTodoInput(name: "Use AppSync", description:"Realtime and Offline")

appSyncClient?.perform(mutation: CreateTodoMutation(input: mutationInput)) { (result, error) in
  if let error = error as? AWSAppSyncClientError {
    print("Error occurred: \(error.localizedDescription )")
  }
  if let resultError = result?.errors {
    print("Error saving the item on server: \(resultError)")
    return
  }
}
```

### サブスクリプション
最後に、リアルタイムデータのサブスクリプションを設定します。構文 `appSyncClient?。 ubscribe(subscribe: <code> Subscription() {(result, transaction) error)}) <code> where <NAME>` `<NAME>` は、 `増幅コード生成型` が作成したGraphQL文に由来します。

```swift
// Subscription notifications will only be delivered as long as this is retained
var subscriptionWatcher: Cancellable?

//In your app code
do {
  subscriptionWatcher = try appSyncClient?.subscribe(subscription: OnCreateTodoSubscription(), resultHandler: { (result, transaction, error) in
    if let result = result {
      print(result.data!.onCreateTodo!.name + " " + result.data!.onCreateTodo!.description!)
    } else if let error = error {
      print(error.localizedDescription)
    }
  })
} catch {
  print("Error starting subscription.")
}
```

Subscriptions can also take `input` types like mutations, in which case they will be subscribing to particular events based on the input. Learn more about Subscription arguments in AppSync [here](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html).

### サンプルを完了
**AppDelegate.swift**

```swift
import UIKit
import AWSAppSync

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var appSyncClient: AWSAppSyncClient?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        do {
            // You can choose your database location if you wish, or use the default
            let cacheConfiguration = try AWSAppSyncCacheConfiguration()

            // AppSync configuration & client initialization
            let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(), cacheConfiguration: cacheConfiguration)
            appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
        } catch {
            print("Error initializing appsync client. \(error)")
        }
        return true
    }
}
```

**ViewController.swift**

```swift
import UIKit
import AWSAppSync

class ViewController: UIViewController {

    var appSyncClient: AWSAppSyncClient?

    // Subscription notifications will only be delivered as long as this is retained
    var subscriptionWatcher: Cancellable?

    override func viewDidLoad() {
        super.viewDidLoad()
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appSyncClient = appDelegate.appSyncClient

        // Note: each of these are asynchronous calls. Attempting to query the results of `runMutation` immediately
        // after calling it probably won't work--instead, invoke the query in the mutation's result handler
        runMutation()
        runQuery()
        subscribe()
    }

    func subscribe() {
        do {
            subscriptionWatcher = try appSyncClient?.subscribe(subscription: OnCreateTodoSubscription()) {
                // The subscription watcher's result block retains a strong reference to the result handler block.
                // Make sure to capture `self` weakly if you use it
                // [weak self]
                (result, transaction, error) in
                if let result = result {
                    print(result.data!.onCreateTodo!.name + " " + result.data!.onCreateTodo!.description!)
                    // Update the UI, as in:
                    //    self?.doSomethingInTheUIWithSubscriptionResults(result)
                    // By default, `subscribe` will invoke its subscription callbacks on the main queue, so there
                    // is no need to dispatch to the main queue.
                } else if let error = error {
                    print(error.localizedDescription)
                }
            }
        } catch {
            print("Error starting subscription.")
        }
    }

    func runMutation(){
        let mutationInput = CreateTodoInput(name: "Use AppSync", description:"Realtime and Offline")
        appSyncClient?.perform(mutation: CreateTodoMutation(input: mutationInput)) { (result, error) in
            if let error = error as? AWSAppSyncClientError {
                print("Error occurred: \(error.localizedDescription )")
            }
            if let resultError = result?.errors {
                print("Error saving the item on server: \(resultError)")
                return
            }
            // The server and the local cache are now updated with the results of the mutation
        }
    }

    func runQuery(){
        appSyncClient?.fetch(query: ListTodosQuery()) {(result, error) in
            if error != nil {
                print(error?.localizedDescription ?? "")
                return
            }
            result?.data?.listTodos?.items!.forEach { print(($0?.name)! + " " + ($0?.description)!) }
        }
    }
}
```

## Androidの使用状況

このセクションでは、Java で記述された Android Studio プロジェクトを取得し、AWS AppSync を使用した GraphQL API と一緒にAmplify を追加するために必要な手順を説明します。 初めてご利用の場合は、新しいAndroid Studioプロジェクトと単一のアクティビティクラスから始めることをお勧めします。

### セットアップ
[Amplify Getting Started](~/start/start.md) を完了した後、端末で Android Studio プロジェクトディレクトリに移動し、以下を実行します。

```bash
amplify init       ## Select iOS as your platform
amplify add api    ## Select GraphQL, API key, "Single object with fields Todo application"
amplify push       ## Sets up backend and prompts you for codegen, accept the defaults
```

The `add api` flow above will ask you some questions, like if you already have an annotated GraphQL schema. If this is your first time using the CLI select **No** and let it guide you through the default project **"Single object with fields (e.g., “Todo” with ID, name, description)"** as it will be used in the code generation examples below. Later on, you can always change it.

Since you added an API the `amplify push` process will automatically enter the codegen process and prompt you for configuration. Accept the defaults and it will create a file named `awsconfiguration.json` in the `./app/src/main/res/raw`  directory that the AppSync client will use for initialization. To finish off the build process there are Gradle and permission updates needed.

まず、プロジェクトの `build.gradle`では、ビルドスクリプトに次の依存関係を追加します。
```gradle
classpath 'com.<unk> s:aws-android-sdk-appsync-gradle-plugin:2.6.+)
```

Next, in the app's `build.gradle` add in a plugin of `apply plugin: 'com.amazonaws.appsync'` and a dependency of `implementation 'com.amazonaws:aws-android-sdk-appsync:2.6.+'`. For example:

```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.amazonaws.appsync'
android {
    // Typical items
}
dependencies {
    // Typical dependencies
    implementation 'com.amazonaws:aws-android-sdk-appsync:2.6.+'
    implementation 'org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.0'
    implementation 'org.eclipse.paho:org.eclipse.paho.android.service:1.1.1'
}
```

Finally, update your `AndroidManifest.xml` with updates to `<uses-permissions>`for network calls and offline state. Also add a `<service>` entry under `<application>` for `MqttService` for subscriptions:

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

問題がないようにプロジェクトを構築してください。

### AppSync クライアントを初期化
Inside your application code, such as the `onCreate()` lifecycle method of your activity class, you can initialize the AppSync client using an instance of `AWSConfiguration()` in the `AWSAppSyncClient` builder. This reads configuration information present in the `awsconfiguration.json` file. By default, the information under the Default section will be used.

```java

    private AWSAppSyncClient mAWSAppSyncClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mAWSAppSyncClient = AWSAppSyncClient.builder()
                .context(getApplicationContext())
                .awsConfiguration(new AWSConfiguration(getApplicationContext()))
                .build();
    }
```

### クエリ
Now that the backend is configured, you can run a GraphQL query. The syntax of the callback is `GraphQLCall.Callback<{NAME>Query.Data>` where `{NAME}` comes from the GraphQL statements that `amplify codegen types` created. You will invoke this from an instance of the AppSync client with a similar syntax of `.query(<NAME>Query.builder().build())`. For example, if you have a `ListTodos` query your code will look like the following:

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

必要に応じて、 `AppSyncResponseFetchers` でキャッシュポリシーを変更することができますが、ネットワーク経由でデータを取得する前に、最初にローカルキャッシュから結果を取得するため、 `CACHE_AND_NETWORK` のままにすることをお勧めします。 これにより、オフラインのサポートと同様に、スムーズなUXを提供します。

### <unk>
For adding data now you will need to run a GraphQL mutation. The syntax of the callback is `GraphQLCall.Callback<{NAME}Mutation.Data>` where `{NAME}` comes from the GraphQL statements that `amplify codegen types` created. However, most GraphQL schemas organize mutations with an `input` type for maintainability, which is what the Amplify CLI does as well. Therefore you'll pass this as a parameter called `input` created with a second builder. You will invoke this from an instance of the AppSync client with a similar syntax of `.mutate({NAME}Mutation.builder().input({Name}Input).build())` like so:

```java
public void mutation(){
    CreateTodoInput createTodoInput = CreateTodoInput.builder().
        name("Use AppSync").
        description("Realtime and Offline").
        build();

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

### サブスクリプション
Finally, it's time to set up a subscription to real-time data. The callback is just `AppSyncSubscriptionCall.Callback` and you invoke it with a client `.subscribe()` call and pass in a builder with the syntax of `{NAME}Subscription.builder()` where `{NAME}` comes from the GraphQL statements that `amplify codegen types` created. Note that the Amplify GraphQL transformer has a common nomenclature of putting the word `On` in front of a subscription like the below example:

```java
private AppSyncSubscriptionCall subscriptionWatcher;

    private void subscribe(){
        OnCreateTodoSubscription subscription = OnCreateTodoSubscription.builder().build();
        subscriptionWatcher = mAWSAppSyncClient.subscribe(subscription);
        subscriptionWatcher.execute(subCallback);
    }

    private AppSyncSubscriptionCall.Callback subCallback = new AppSyncSubscriptionCall.Callback() {
        @Override
        public void onResponse(@Nonnull Response response) {
            Log.i("Response", response.data().toString());
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e("Error", e.toString());
        }

        @Override
        public void onCompleted() {
            Log.i("Completed", "Subscription completed");
        }
    };

```

Subscriptions can also take `input` types like mutations, in which case they will be subscribing to particular events based on the input. Learn more about Subscription arguments in AppSync [here](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html).

### サンプル
**MainActivity.java**

```java
import android.util.Log;
import com.amazonaws.mobile.config.AWSConfiguration;
import com.amazonaws.mobileconnectors.appsync.AWSAppSyncClient;
import com.amazonaws.mobileconnectors.appsync.AppSyncSubscriptionCall;
import com.amazonaws.mobileconnectors.appsync.fetcher.AppSyncResponseFetchers;
import com.apollographql.apollo.GraphQLCall;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.exception.ApolloException;
import javax.annotation.Nonnull;
import amazonaws.demo.todo.CreateTodoMutation;
import amazonaws.demo.todo.ListTodosQuery;
import amazonaws.demo.todo.OnCreateTodoSubscription;
import amazonaws.demo.todo.type.CreateTodoInput;

public class MainActivity extends AppCompatActivity {

    private AWSAppSyncClient mAWSAppSyncClient;
    private AppSyncSubscriptionCall subscriptionWatcher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mAWSAppSyncClient = AWSAppSyncClient.builder()
                .context(getApplicationContext())
                .awsConfiguration(new AWSConfiguration(getApplicationContext()))
                .build();
        query();
        mutation();
        subscribe();
    }

    private void subscribe(){
        OnCreateTodoSubscription subscription = OnCreateTodoSubscription.builder().build();
        subscriptionWatcher = mAWSAppSyncClient.subscribe(subscription);
        subscriptionWatcher.execute(subCallback);
    }

    private AppSyncSubscriptionCall.Callback subCallback = new AppSyncSubscriptionCall.Callback() {
        @Override
        public void onResponse(@Nonnull Response response) {
            Log.i("Response", response.data().toString());
        }

        @Override
        public void onFailure(@Nonnull ApolloException e) {
            Log.e("Error", e.toString());
        }

        @Override
        public void onCompleted() {
            Log.i("Completed", "Subscription completed");
        }
    };

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

    public void mutation(){

        CreateTodoInput createTodoInput = CreateTodoInput.builder().
                name("Use AppSync").
                description("Realtime and Offline").
                build();

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
}
```

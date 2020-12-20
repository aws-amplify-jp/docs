AWS AppSync を使用すると、リアルタイムおよびオフラインの機能を備えたデータドリブンなアプリケーションを構築できます。 [AppSync iOS SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-ios/) を使用すると、AWS AppSync サービスとアプリを統合でき、 [ここ](https://github.com/apollographql/apollo-ios)のApolloプロジェクトに基づいています。 SDKは複数の認可モデルをサポートし、データをリアルタイムに更新するためのサブスクリプションハンドシェイクプロトコルを処理します。 また、オフラインサポート機能を内蔵しているため、アプリに簡単に統合できます。

AWS AppSync との連携は、次の手順で行うことができます。

1. クライアント側の設定で API エンドポイントと認証情報を設定します。
2. APIスキーマからSwiftコードを生成します。
3. クエリ、変更、サブスクリプションを実行するためのアプリコードを記述します。

Amplify CLI は、このプロセスを容易にする AppSync のサポートを提供します。 CLI を使用して、AWS AppSync API を設定し、必要なクライアント側の設定ファイルをダウンロードできます。 コマンドラインで簡単なコマンドを実行することで、数分でクライアントサイドコードを生成できます。

### 設定

AWS SDKは、AWSリージョンとサービスエンドポイントを定義する `awsconfiguration.json` と呼ばれる集中化されたファイルを介して構成をサポートします。 あなたはこのファイルを二つの方法のいずれかで取得します。 AppSync コンソールで AppSync API を作成するか、Amplify CLI を使用するかによって異なります。

* If you are creating your API in the console, navigate to the `Getting Started` page, and follow the steps in the `Integrate with your app` section. The `awsconfiguration.json` file you download is already populated for your specific API. Place the file in the root directory of your iOS project, and add it to your Xcode project.

* If you are creating your API with the Amplify CLI (using `amplify add api`), the `awsconfiguration.json` file is automatically downloaded and updated each time you run `amplify push` to update your cloud resources. The file is placed in the root directory of your iOS project, and you need to add it to your Xcode project.


### コード生成

iOSでGraphQL操作を実行するには、コード生成プロセスを実行する必要があります。 これは、クライアントが定義するGraphQLスキーマとステートメント(クエリ、変更、サブスクリプションなど)の両方を必要とします。 Amplify CLI ツールチェーンは、スキーマを自動的に引き出し、デフォルトの GraphQL クエリを生成することで、これを行うのに役立ちます。 コード生成プロセスをキックオフする前に突然変異やサブスクリプションが必要です クライアントの要件が変更された場合、これらのGraphQL文を変更して型を再生成することができます。

#### AppSync API コンソールで作成された

Amplify CLI をインストールした後、ターミナルを開き、Xcode プロジェクトのルートに移動し、以下を実行します。

```bash
amplify init
amplify add codegen --apiId XXXXXX
```

The `XXXXXX` is the unique AppSync API identifier that you can find in the console in the root of your API's integration page. When you run this command you can accept the defaults, which create an `API.swift` file, and a `graphql` folder with your statements, in your root directory.

#### AppSync API CLIを使用して作成されたAPI

端末で Xcode のプロジェクト・ディレクトリに移動し、以下を実行します。

```bash
amplify init ## プラットフォームとしてiOSを選択します
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

The `amplify push` process will prompt you to enter the codegen process and walk through configuration options. Accept the defaults and it will create a file named `API.swift` in your root directory (unless you choose to name it differently) as well as a directory called `graphql` with your documents. You also will have an `awsconfiguration.json` file that the AppSync client will use for initialization. At any time you can open the AWS console for your new API directly by running the following command:

```bash
コンソールの api を増幅する
```

プロンプトが表示されたら、 **GraphQL**を選択します。 これにより、AWS AppSync コンソールが開き、クエリ、ミューテーションを実行できます。 またはサーバーでサブスクリプションを行い、クライアントアプリケーションの変更を確認します。

### SDKのインポートと設定
Xcode プロジェクトで AppSync を使用するには、次のように、AWS AppSync SDK の依存性を持つ Podfile を変更します。

```ruby
ターゲット 'PostsApp' do
    use_frameworks!
    pod 'AWSAppSync'
end
```

Run `pod install` from your terminal and open up the `.xcworkspace` Xcode project. Add the `API.swift` and `awsconfiguration.json` files to your project **(File->Add Files to ..->Add)** and then build your project, ensuring there are no issues.

### クライアントの初期化

次のように `AWSAppSyncClientConfiguration` と `AWSAppSyncClient` を作成して、アプリケーションが委任するAppSyncクライアントを初期化します。

```swift
import AWSAppSync

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

var appSyncClient: AWSAppSyncClient?

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    do {
    // You can choose the directory in which AppSync stores its persistent cache databases
    let cacheConfiguration = try AWSAppSyncCacheConfiguration()

    // AppSync configuration & client initialization
    let appSyncServiceConfig = try AWSAppSyncServiceConfig()
        let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: appSyncServiceConfig,
                                                          cacheConfiguration: cacheConfiguration)
        appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
        // Set id as the cache key for objects. See architecture section for details
        appSyncClient?.apolloClient?.cacheKeyForObject = { $0["id"] }
    } catch {
        print("Error initializing appsync client. \(error)")
    }
    // other methods
    return true
}
```

`AWSAppSyncServiceConfig` は、 `awsconfiguration.json` ファイルにある設定情報を表します。

次に、アプリケーションコードを入力します。 `UIKit` を使用している場合は、 `viewDidLoad()` のような適切なライフサイクルメソッドを参照します。

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

SwiftUI を使用している場合は、共有の AppSync クライアントへの参照を `@State` としてビューに追加できます。 ビューのイニシャライザに割り当ててください:

```swift
// Remember to import AWSAppSync
import AWSAppSync

struct ContentView: View {

    //Add an init method
    @State var appSyncClient: AWSAppSyncClient?

    init() {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appSyncClient = appDelegate.appSyncClient
    }
}
```

### クエリの実行

Now that the client is set up, you can run a GraphQL query. The syntax is `appSyncClient?.fetch(query: <NAME>Query() {(result, error)})` where `<NAME>` comes from the GraphQL statements that `amplify codegen` created. For example, if you have a `ListTodos` query your code will look like the following:

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

必要に応じて、クエリのキャッシュポリシーを次のように設定できます。

```swift
appSyncClient?.fetch(query: ListTodosQuery(), cachePolicy: .returnCacheDataAndFetch) { (result, error)
```
`returnCacheDataAndFetch` はネットワーク経由でデータを取得する前に最初にローカルキャッシュから結果を引き出します。これにより、簡単な UX とオフラインのサポートが可能になります。

#### SwiftUIに関する考慮事項

When using `List` and `ForEach` for SwiftUI the structure needs to conform to `Identifiable`. The code generated for Swift does not make the structure `Identifiable` but as long as you have a unique id associated with the object then you can retroactively mark a field as unique. Here is some example code for `ListTodosQuery()`

```swift
ForEach(listTodosStore.listTodos.identified(by:\.id)){ todo in
    TodoCell(todoDetail: todo)
}

```

### 突然変異を実行

To add data you need to run a GraphQL mutation. The syntax is `appSyncClient?.perform(mutation: <NAME>Mutation() {(result, error)})` where `<NAME>` comes from the GraphQL statements that `amplify codegen` created. However, most GraphQL schemas organize mutations with an `input` type for maintainability, which is what the AppSync console and Amplify CLI do as well. Therefore, you need to pass this as a parameter called `input`, as in the following example:

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

#### 複合オブジェクトの操作

時々、より複雑なデータ(画像やビデオなど)を持つ論理オブジェクトを構造の一部として作成したい場合があります。 たとえば、プロフィール画像を含むPerson型を作成したり、関連画像を含むPost型を作成したりすることができます。 AWS AppSyncを使用してGraphQL型としてモデル化し、 [自動的にS3](~/sdk/storage/graphql-api.md)に保存することができます。

### データの購読

Finally, it's time to set up a subscription to real-time data. The syntax `appSyncClient?.subscribe(subscription: <NAME>Subscription() {(result, transaction, error)})` where `<NAME>` comes from the GraphQL statements that `amplify codegen` created. Note that the AppSync console and Amplify GraphQL transformer have a common nomenclature that puts the word `On` in front of a subscription as in the following example:

```swift
// Set a variable to hold the subscription. E.g., this can be an instance variable on your view controller, or
// a member variable in your AppSync setup code. Once you release this watcher, the subscription may be cancelled,
// and your `resultHandler` will no longer be updated. If you wish to explicitly cancel the subscription, you can
// invoke `subscriptionWatcher.cancel()`
var subscriptionWatcher: Cancellable?

// In your app code
do {
    subscriptionWatcher = try appSyncClient?.subscribe(subscription: OnCreateTodoSubscription()) { result, transaction, error in
        if let onCreateTodo = result?.data?.onCreateTodo,  {
            print(onCreateTodo.name + " " + onCreateTodo.description)
        } else if let error = error {
            print(error.localizedDescription)
        }
    }
} catch {
    print("Error starting subscription: \(error.localizedDescription)")
}
```

変更と同様に、サブスクリプションは入力タイプを取ることもできます。その場合、入力に基づいて特定のイベントを購読します。 サブスクリプション引数の詳細については、 [AWS AppSync サブスクリプション引数](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html#using-subscription-arguments) を参照してください。


### モックとローカルテスト

Amplifyは、クラウドにプッシュする前に、AWS AppSyncでアプリケーションをテストするためのローカルモックサーバの実行をサポートしています。 詳細は [CLI ツールチェーン ドキュメント](~/cli/usage/mock.md) を参照してください。

### クライアントアーキテクチャ

AppSync クライアントはオフラインシナリオをサポートし、「キャッシュを通じて書き込み」を提供するプログラムモデルを提供します。 これにより、オフライン時にデータをレンダリングしたり、「楽観的な応答」を介して追加/更新したりすることができます。 次の図は、ネットワークGraphQLコール、そのオフラインの変更キュー、Apolloキャッシュ、およびアプリケーションコードとのAppSyncクライアントインターフェイスを示しています。

![画像](~/images/appsync-architecture.png)

アプリケーション・コードは、GraphQL クエリ、変更、またはサブスクリプションを実行するために、AppSync クライアントと相互作用します。 APIキーを追加するHTTPレイヤーとインターフェースする場合、AppSyncクライアントは自動的に正しい認可メソッドを実行します。 トークン、または、セットアップの構成に応じてリクエストに署名します。 突然変異を行うとき 例えば、アプリに新しいアイテム(ブログ記事など)を追加するなど、AppSyncクライアントは、アプリがオフラインのときにローカルキュー(SQLiteのディスクに永続化)にこれを追加します。 ネットワーク接続が復元されると、変更はシリアルの AppSync に送信され、応答を一つずつ処理することができます。

クエリによって返されるデータは、自動的に Apollo Cache に書き込まれます。 SQLite経由でディスクに永続化される「Store」です。キャッシュは参照構造体を使用してキー値ストアとして構造化されます。 後続のクエリが存在し、個々のアイテムの結果を参照するベースの「ルートクエリ」があります。 アプリケーションコードに参照キー(通常は「id」)を指定します。 "listPosts"クエリと"getPost(id:1)"クエリの結果を格納したキャッシュの例を以下に示します。

| Key | Value | | ROOT_QUERY | [ROOT_QUERY.listPosts, ROOT_QUERY.getPost(id:1)] | ROOT_QUERY.listPosts | {0, 1, …,N} | | Post:0 |{author:"Nadia", content:"ABC"} | | Post:1 | {author:"Shaggy", content:"DEF"} | | ... | ... | | Post:N | {author:"Pancho", content:"XYZ"} | | ROOT_QUERY.getPost(id:1) |ref: $Post:1 |

キャッシュキーは `getPost(id:1)` クエリが `listPosts` クエリの一部である同じ要素を参照する場合に正規化されることに注意してください。 これは、オブジェクトを一意に識別するための共通キャッシュキーを定義した場合にのみ発生します。 AppDelegate で AppSync クライアントを以下のように設定します。

```swift
//GraphQL タイプが異なる場合、"id" 以外のものを使用する
appSyncClient?.apolloClient?.cacheKeyForObject = { $0["id"] }
```

変更を実行している場合は、たとえオフラインであっても、いつでもこのキャッシュに「楽観的な応答」を書くことができます。 AppSync クライアントを使用して、アップデートにクエリを渡し、キャッシュ外のアイテムを読み込んで接続します。 これは通常、更新するクエリのGraphQL応答タイプに応じて、単一のアイテムまたはアイテムのリストを返します。 この時点でリストに追加し、削除します。 それを適切に更新してディスクに残す店舗への応答を書き戻すこともできます ネットワークに再接続すると、サービスからの応答は、権威ある応答として変更を上書きします。

#### オフラインミューテーション

As outlined in the architecture section, all query results are automatically persisted to disc with the AppSync client. For updating data through mutations when offline you will need to use an "optimistic response" with a transaction. This is done by passing an `optimisticUpdate` in the `appSyncClient?.perform()` mutation method using a `transaction`, where you pass in a query that will be updated in the cache. Inside of this transaction, you can write to the store via `appSyncClient?.store?.withinReadWriteTransaction`.

For example, the below code shows how you would update the `CreateTodoMutation` mutation from earlier by adding a `optimisticUpdate: { (transaction) in do {...} catch {...}` argument with a closure. This adds an item to the cache with `transaction?.update()` using a locally generated unique identifier. This might be enough for your app, however if the AppSync response returns a different value for `ID` (which many times is the case as best practice is generation of IDs at the service layer) then you will need to replace the value locally when a response is received. This can be done in the `resultHandler` by using `appSyncClient?.store?.withinReadWriteTransaction()` and `transaction?.update()` again.

```swift
func optimisticCreateTodo(input: CreateTodoInput, query:ListTodosQuery){
        let createTodoInput = CreateTodoInput(name: input.name, description: input.description)
        let createTodoMutation = CreateTodoMutation(input: createTodoInput)
        let UUID = NSUUID().uuidString

        self.appSyncClient?.perform(mutation: createTodoMutation, optimisticUpdate: { (transaction) in
            do {
                try transaction?.update(query: query) { (data: inout ListTodosQuery.Data) in
                    data.listTodos?.items?.append(ListTodosQuery.Data.ListTodo.Item.init(id: UUID, name: input.name, description: input.description!))
                }
            } catch {
                print("Error updating cache with optimistic response for \(createTodoInput)")
            }
        }, resultHandler: { (result, error) in
            if let result = result {
                print("Added Todo Response from service: \(String(describing: result.data?.createTodo?.name))")
                //Now remove the outdated entry in cache from optimistic write
                let _ = self.appSyncClient?.store?.withinReadWriteTransaction { transaction in
                    try transaction.update(query: ListTodosQuery())
                    { (data: inout ListTodosQuery.Data) in
                        var pos = -1, counter = 0
                        for item in (data.listTodos?.items!)! {
                            if item?.id == UUID {
                                pos = counter
                                continue
                            }; counter += 1
                        }
                        if pos != -1 { data.listTodos?.items?.remove(at: pos) }
                    }
                }
            } else if let error = error {
                print("Error adding Todo: \(error.localizedDescription)")
            }
        })
    }
```

You might add similar code in your app for updating or deleting items using an optimistic response, it would look largely similar except that you might overwrite or remove an element from the `data.listTodos?.items` array.

### 承認モード

クライアント認証の場合、AppSync は API キー、Amazon IAM クレデンシャルをサポートしています (このオプションでは、Amazon Cognito Identity Poolsの使用をお勧めします) Amazon Cognitoユーザープール、サードパーティ製OIDCプロバイダー。 これは `AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig()` を呼び出すときに `awsconfiguration.json` ファイルから推定されます。

#### API キー

API Key is the easiest way to setup and prototype your application with AppSync. It's also a good option if your application is completely public. If your application needs to interact with other AWS services besides AppSync, such as S3, you will need to use IAM credentials provided by Cognito Identity Pools, which also supports "Guest" access. See [the authentication section for more details](~/sdk/auth/how-it-works.md). For manual configuration, add the following snippet to your `awsconfiguration.json` file:

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

```swift
do {
    // Initialize the AWS AppSync configuration
    let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(), 
                                                          cacheConfiguration: AWSAppSyncCacheConfiguration())

    // Initialize the AWS AppSync client
    appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
} catch {
    print("Error initializing appsync client. \(error)")
}
```

#### Cognitoユーザープール

Amazon Cognito User Pools is the most common service to use with AppSync when adding user Sign-Up and Sign-In to your application. If your application needs to interact with other AWS services besides AppSync, such as S3, you will need to use IAM credentials with Cognito Identity Pools. The Amplify CLI can automatically configure this for you when running `amplify add auth` and can also automatically federate User Pools with Identity Pools. This allows you to have both User Pool credentials for AppSync and AWS credentials for S3. You can then use the `AWSMobileClient` for automatic credentials refresh [as outlined in the authentication section](~/sdk/auth/how-it-works.md). For manual configuration, add the following snippet to your `awsconfiguration.json` file:

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

アプリに次のコードを追加します。

```swift                                
    func initializeAppSync() {
        do {
            // You can choose the directory in which AppSync stores its persistent cache databases
        let cacheConfiguration = try AWSAppSyncCacheConfiguration()

            // Initialize the AWS AppSync configuration
            let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(),
                                                                  userPoolsAuthProvider: {
                                                                    class MyCognitoUserPoolsAuthProvider : AWSCognitoUserPoolsAuthProviderAsync {
                                                                        func getLatestAuthToken(_ callback: @escaping (String?, Error?) -> Void) {
                                                                            AWSMobileClient.default().getTokens { (tokens, error) in
                                                                                if error != nil {
                                                                                    callback(nil, error)
                                                                                } else {
                                                                                    callback(tokens?.idToken?.tokenString, nil)
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    return MyCognitoUserPoolsAuthProvider()}(),
                                                                  cacheConfiguration: cacheConfiguration)

            // Initialize the AWS AppSync client
            appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
        } catch {
            print("Error initializing appsync client. \(error)")
        }
    }
```

#### IAM

When using AWS IAM in a mobile application you should leverage Amazon Cognito Identity Pools. The Amplify CLI can automatically configure this for you when running `amplify add auth`. You can then use the `AWSMobileClient` for automatic credentials refresh [as outlined in the authentication section](~/sdk/auth/how-it-works.md) For manual configuration, add the following snippet to your `awsconfiguration.json` file:

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

アプリに次のコードを追加します。

```swift         
do {
    // Initialize the AWS AppSync configuration
    let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(),
                              credentialsProvider: AWSMobileClient.default(),
                              cacheConfiguration: AWSAppSyncCacheConfiguration())

    // Initialize the AWS AppSync client
    appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
} catch {
    print("Error initializing appsync client. \(error)")
}
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

アプリに次のコードを追加します。

```swift
class MyOidcProvider: AWSOIDCAuthProvider {
    func getLatestAuthToken() -> String {
        // Fetch the JWT token string from OIDC Identity provider
        // after the user is successfully signed-in
        return "token"
    }
}

do {
    // Initialize the AWS AppSync configuration
    let appSyncConfig = try AWSAppSyncClientConfiguration(appSyncServiceConfig: AWSAppSyncServiceConfig(),
                                                          oidcAuthProvider: MyOidcProvider(),
                                                          cacheConfiguration: AWSAppSyncCacheConfiguration())

    appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
} catch {
    print("Error initializing appsync client. \(error)")
}
```

#### マルチ認証

This section talks about the capability of AWS AppSync to configure multiple authorization modes for a single AWS AppSync endpoint and region. Follow the [AWS AppSync Multi-Auth](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#using-additional-authorization-modes) to configure multiple authorization modes for your AWS AppSync endpoint.

プライベートおよびパブリックのデータを配信するために、GraphQL API を 1 つ設定できるようになりました。 プライベートデータには、IAM、Cognitoユーザプール、OIDCなどの認証メカニズムを使用して認証されたアクセスが必要です。 パブリックデータは認証されたアクセスを必要とせず、API キーなどの認可メカニズムを介して提供されます。 1 つの GraphQL API を設定して、複数の認証タイプを使用してプライベートデータを配信することもできます。 たとえば、GraphQL API を構成して、OIDC を使用していくつかのスキーマフィールドを承認することができます。 一方、Cognito User Pools や IAM を介して他のスキーマフィールドが表示されます。

As discussed in the above linked documentation, certain fields may be protected by different authorization types. This can lead the same query, mutation, or subscription to have different responses based on the authorization sent with the request; Therefore, it is recommended to use different `AWSAppSyncClient` objects for each authorization type. Instantiation of multiple `AWSAppSyncClient` objects is enabled by passing `true` to the `useClientDatabasePrefix` flag. The `awsconfiguration.json` generated by the AWS AppSync console and Amplify CLI will add an entry called `ClientDatabasePrefix` in the "AppSync" section. This will be used to differentiate the databases used for operations such as queries, mutations, and subscriptions.

**Important Note:** If you are an existing customer of AWS AppSync SDK for Android, the `useClientDatabasePrefix` has a default value of `false`. If you choose to use multiple `AWSAppSyncClient` objects, turning on `useClientDatabasePrefix` will change the location of the databases used by the client. The databases will not be automatically moved. You are responsible for migrating any data within the databases that you wish to keep and deleting the old databases on the device.

以下のスニペットは、 `awsconfiguration.json` 内の新しい値とクライアント・コードの構成を強調します。

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

```swift
let serviceConfig = try AWSAppSyncServiceConfig()
let cacheConfig = AWSAppSyncCacheConfiguration(useClientDatabasePrefix: true,
                                                  appSyncServiceConfig: serviceConfig)
let clientConfig = AWSAppSyncClientConfiguration(appSyncServiceConfig: serviceConfig,
                                                   cacheConfiguration: cacheConfig)

let client = AWSAppSyncClient(appSyncConfig: clientConfig)
```

次のコードは、認証モードに基づいてクライアントを取得するためのクライアントファクトリを作成します: public (`API_KEY`) またはプライベート (`AWS_IAM` ) 。

```swift
public enum AppSyncClientMode {
    case `public`
    case `private`
}

public class ClientFactory {
    static var clients: [AppSyncClientMode:AWSAppSyncClient] = [:]

    class func getAppSyncClient(mode: AppSyncClientMode) -> AWSAppSyncClient? {
        return clients[mode];
    }

    class func initClients() throws {
        let serviceConfigAPIKey = try AWSAppSyncServiceConfig()
        let cacheConfigAPIKey = try AWSAppSyncCacheConfiguration(useClientDatabasePrefix: true,
                                                                    appSyncServiceConfig: serviceConfigAPIKey)
        let clientConfigAPIKey = try AWSAppSyncClientConfiguration(appSyncServiceConfig: serviceConfigAPIKey,
                                                                 cacheConfiguration: cacheConfigAPIKey)
        clients[AppSyncClientMode.public] = try AWSAppSyncClient(appSyncConfig: clientConfigAPIKey)

        let serviceConfigIAM = try AWSAppSyncServiceConfig(forKey: "friendly_name_AWS_IAM")
        let cacheConfigIAM = try AWSAppSyncCacheConfiguration(useClientDatabasePrefix: true,
                                                                 appSyncServiceConfig: serviceConfigIAM)
        let clientConfigIAM = try AWSAppSyncClientConfiguration(appSyncServiceConfig: serviceConfigIAM,
                                                                  cacheConfiguration: cacheConfigIAM)
        clients[AppSyncClientMode.private] = try AWSAppSyncClient(appSyncConfig: clientConfigIAM)
    }
}
```

これがそのようになります。

```swift
ClientFactory.getAppSyncClient(AppSyncClientMode.private)?.fetch(query: ListPostsQuery())  { (result, error) in
            if error != nil {
                print(error?.localizedDescription ?? "")
                return
            }
            self.postList = result?.data?.listPosts
        };
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

1. `AWS_IAM` 認可モードを使用して、 `ClientFactory.getAppSyncClient(AppSyncClientMode.private)` から投稿を追加します。

2. `AWS_IAM` 認可モードを使用して、 `ClientFactory.getAppSyncClient(AppSyncClientMode.private)` で投稿をクエリします。

3. Query the post through `ClientFactory.getAppSyncClient(AppSyncClientMode.public)` using `API_KEY` authorization mode.

```swift
appSyncClient?.fetch(query: GetPostQuery())  { (result, error) in
    if error != nil {
        print(error?.localizedDescription ?? "")
        return
    }
    var post = result?.data?.getPost?
    post.id
    post.author
    post.title
    post.content
    post.version
    post.url // Null - because it's not authorized
    post.ups // Null - because it's not authorized
    post.downs // Null - because it's not authorized

    result?.errors![0].message.contains("Not Authorized to access url on type Post")
}
```

### キャッシュをクリア

ローカルデバイス上の `AWSAppSyncClient` オブジェクトでキャッシュされたデータを消去します。

```swift
appSyncClient.clearCaches(); // クエリ、変更、およびデルタ同期キャッシュをクリアします。
```

キャッシュを選択的にクリア `ClearCacheOptions`.

```swift
// 選択的にキャッシュをクリアし、それらのキャッシュを維持するためのパラメータを省略します
let clearCacheOptions = ClearCacheOptions(clearQueries: true,
                                        clearMutations: true,
                                    clearSubscription: true)
appSyncClient.clearCaches(options: clearCacheOptions)
```

### デルタ同期

DeltaSyncでは、AWS AppSync GraphQLサーバーとの自動同期を実行できます。 クライアントは再接続、指数的なバックオフを実行し、デバイスへのデータ複製を簡素化するためにネットワークエラーが発生したときに再試行します。 これを行うには、GraphQL クエリの結果を取得し、ローカルの Apollo キャッシュでキャッシュします。

最も基本的なフォームでは、API で単一のクエリを使用してバックエンドから state をクライアントにレプリケートできます。 これは「Base Query」と呼ばれ、DynamoDBテーブルに対応するGraphQL型のリスト操作になります。 コンテンツが頻繁に変更され、デバイスがオフラインとオンラインの間で頻繁に切り替わる大きなテーブルの場合。 ネットワークの再接続ごとにすべての変更を引くと、クライアントのパフォーマンスが低下する可能性があります。 この場合、クライアント API に、キャッシュにマージされる「Delta Query」という2番目のクエリを指定できます。 これを行うと、Base Queryが最初に実行され、データを使用してキャッシュをハイドレートします。 そして、各ネットワークでデルタクエリを再接続し、変更されたデータを取得するために実行されます。 ベースクエリは、「キャッチアップ」メカニズムとして定期的に実行されます。 デフォルトでは、これは24時間ごとですが、多かれ少なかれ頻繁にすることができます。

クライアントが1つのクエリと別のクエリのインクリメンタルアップデートを使用してキャッシュの基本ハイドレーションを分離できるようにすることにより、 クライアントアプリケーションからバックエンドに計算を移動できます。 これは、オンラインとオフラインの状態を定期的に切り替える際に、クライアントにとって大幅に効率的です。 これをAWS AppSync バックエンドで実装することができます。例えば、インデックスでDynamoDB Queryを条件式と一緒に使用するなど、さまざまな方法です。 また、Pipeline Resolversを活用して、レコードを分割してデルタ応答をジャーナルとして動作させることもできます。 [CloudFormationの完全なサンプルは、AppSyncドキュメント](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-delta-sync.html)で入手できます。 このドキュメントの残りの部分は、クライアントの使用状況に焦点を当てます。

GraphQL サブスクリプションでデルタ同期機能を使用することもできます。 ネットワーク接続を切り替えたときだけでなくネット上でも変更を送信する この場合、標準のGraphQLサブスクリプションステートメントである「Subscription Query」と呼ばれる3つ目のクエリを渡すことができます。 デバイスが接続されると、これらは通常どおりに処理され、クライアント API は、リアルタイムのデータを簡単に設定するのに役立ちます。 ただし、デバイスがオフラインからオンラインに切り替わったとき。 高速を考慮して、クライアントは次の順序で同期とメッセージ処理と共に再購読を実行します:

1. 定義されたクエリを購読し、結果を受信キューに保存します
2. 適切なクエリを実行します( `baseRefreshIntervalInSeconds` が経過した場合、それ以外の場合はDelta Queryのみを実行します)
3. 適切なクエリの結果を使用してキャッシュを更新します
4. サブスクリプションキューを削除し、通常通り処理を続ける

Finally, you might have other queries which you wish to represent in your application other than the base cache hydration. For instance a `getItem(id:ID)` or other specific query. If your alternative query corresponds to items which are already in the normalized cache, you can point them at these cache entries with the `cacheUpdates` function which returns an array of queries and their variables. The DeltaSync client will then iterate through the items and populate a query entry for each item on your behalf. If you wish to use additional queries which don't correspond to items in your base query cache, you can always create another instance of the `appSyncClient?.sync()` process.

**使用法**

```swift
  // instance variable in your view controller
  var deltaWatcher: Cancellable?

  // Start DeltaSync
  // Provides the ability to sync using a baseQuery, subscription, deltaQuery, and a refresh interval
  let allPostsBaseQuery = ListPostsQuery()
  let allPostsDeltaQuery = ListPostsDeltaQuery()
  let postsSubscription = OnDeltaPostSubscription()

  deltaWatcher = appSyncClient?.sync(baseQuery: allPostsBaseQuery, baseQueryResultHandler: { (result, error) in

  }, subscription: postsSubscription, subscriptionResultHandler: { (result, transaction, error) in

  }, deltaQuery: allPostsDeltaQuery, deltaQueryResultHandler: { (result, transaction, error) in

  })

  //Stop DeltaSync
  deltaWatcher.cancel();
```

**メソッドパラメータ**
* *baseQuery* のベースライン状態を取得するためのベースラインクエリ。 (REQUIRED)
* *baseQueryResultHandler* baseQuery の結果を処理するコールバック。 (REQUIRED)
* *サブスクリプション* その場で変更を取得するためのサブスクリプション。
* *subscriptionResultHandler* サブスクリプションメッセージを処理するコールバック。
* *deltaQuery* キャッチアップクエリ
* *deltaQueryResultHandler* のコールバックは、deltaQuery の結果を処理します。
* *syncConfiguration* ベースクエリが更新されるために再実行される時間（秒単位で指定）。デフォルトは24時間です。
* *returnValue* は、 `キャンセル可能な` オブジェクトを返します。このオブジェクトは、 `cancel()` メソッドを呼び出して同期操作をキャンセルするために後で使用できます。

上記の `baseQuery` と `baseQueryResultHandler` のみが必要なパラメータであることに注意してください。以下のように異なる方法で API を呼び出すことができます。

```swift
//基本クエリ
appSyncClient?.sync(baseQuery: baseQuery, baseQueryResultHandler: baseQueryResultHandler) 

//Delta との同期を実行しますが、
appSyncClient?はありません。 ync(baseQuery: baseQuery, baseQueryResultHandler: baseQueryResultHandler, deltaQuery: deltaQuery, deltaResultHandler: deltaQueryResultHandler)
```

**例**

以下のセクションでは、Delta Syncを使用したアプリの作成の詳細について説明します。 私たちは、投稿のリストを表示し、デルタ同期機能を使用して同期を保つビューを持つシンプルな投稿アプリを使用します。 `postList` と呼ばれる配列を使用して、UIを動かすために投稿とUIViewControllerを収集して管理します。

**同期ハンドラ関数を作成**

ビューコントローラの `viewDidLoad()` メソッドから呼び出される `loadPostsWithSyncFeature` という新しいメソッドを作成します。

```swift
class YourAppViewController: UIViewController {

    var appSyncClient: AWSAppSyncClient?
    var deltaWatcher: Cancellable?

    @IBOutlet weak var tableView: UITableView!
    var postList: [ListPostsQuery.Data.ListPost?]? = [] {
        didSet {
            tableView.reloadData()
        }
    }

    override func viewDidLoad() {
      super.viewDidLoad()

      // Fetch AppSync client from AppDelegate or from the place where it was initialized.
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appSyncClient = appDelegate.appSyncClient

      // Set table view delegate
      self.tableView.dataSource = self
      self.tableView.delegate = self

      // Call the new method which we just added.
      loadPostsWithSyncFeature()
    }

    func loadPostsWithSyncFeature() {
        // Sync operation will be added here.
    }
}
```

**キャッシュに投稿を追加/更新/削除するためのヘルパーを作成**

*キャッシュから投稿を読み込むヘルパー関数:*

```swift
      func loadAllPostsFromCache() {
        appSyncClient?.fetch(query: ListPostsQuery(), cachePolicy: .returnCacheDataDontFetch)  { (result, error) in
            if error != nil {
                print(error?.localizedDescription ?? "")
                return
            }
            self.postList = result?.data?.listPosts
        }
    }
```

*ヘルパー関数 to `Add` or `Update` a post:*

```swift
      func addOrUpdatePostInQuery(id: GraphQLID, title: String, author: String, content: String) {
        // Create a new object for the desired query, where the new object content should reside
        let postToAdd = ListPostsQuery.Data.ListPost(id: id,
                                                     author: author,
                                                     title: title,
                                                    content: content)
        print("App: Processing \(id) for add/ update")
        let _ = appSyncClient?.store?.withinReadWriteTransaction({ (transaction) in
            do {
                // Update the local store with the newly received data
                try transaction.update(query: ListPostsQuery()) { (data: inout ListPostsQuery.Data) in
                    guard let items = data.listPosts else {
                        return
                    }
                    var pos = -1
                    var counter = 0
                    for post in items {
                        if post?.id == id {
                            pos = counter
                            continue
                        }
                        counter += 1
                    }
                    // Post is not present in query, add it.
                    if pos == -1 {
                        print("App: Adding \(id) now.")
                        data.listPosts?.append(postToAdd)
                    } else {
                        // It was an update operation, post will be automatically updated in cache.
                    }
                }
            } catch {
                print("App: Error updating store")
            }
        })
        self.loadAllPostsFromCache()
    }
```

*ヘルパー関数で `投稿を` 削除:*

```swift
      func deletePostFromCache(uniqueId: GraphQLID) {
        // Remove local object from cache.
        print("App: Removing \(uniqueId) from cache.")
        let _ = appSyncClient?.store?.withinReadWriteTransaction({ (transaction) in
            do {
                try transaction.update(query: ListPostsQuery(), { (data: inout ListPostsQuery.Data) in
                    guard let items = data.listPosts else {
                        return
                    }
                    var pos = -1
                    var counter = 0
                    for post in items {
                        if post?.id == uniqueId {
                            pos = counter
                            continue
                        }
                        counter += 1
                    }
                    print("App: \(uniqueId) index: \(pos).")
                    if pos != -1 {
                        print("App: Removing now \(uniqueId)")
                        data.listPosts?.remove(at: pos)
                    }
                })
            } catch {
                print("App: Error updating store")
            }
        })
        self.loadAllPostsFromCache()
    }
```

**新しい同期機能を実装**

次に、すべての変更が UI で更新されていることを確認するために、ヘルパーメソッドの呼び出しで `loadPostsWithSyncFeature` 関数を更新します。

```swift
    func loadPostsWithSyncFeature() {
        let allPostsBaseQuery = ListPostsQuery()
        let allPostsDeltaQuery = ListPostsDeltaQuery()
        let postsSubscription = OnDeltaPostSubscription()

        deltaWatcher = appSyncClient?.sync(baseQuery: allPostsBaseQuery,
                                           baseQueryResultHandler: { (result, error) in
            if error != nil {
                print(error?.localizedDescription ?? "")
                return
            }
            self.postList = result?.data?.listPosts
        }, subscription: postsSubscription,
           subscriptionResultHandler: { (result, transaction, error) in
            if let result = result {
                guard result.data != nil, result.data?.onDeltaPost != nil else {
                    return
                }
                // If the Post is to be deleted from the cache.
                if(result.data?.onDeltaPost?.awsDs == DeltaAction.delete) {
                    self.deletePostFromCache(uniqueId: result.data!.onDeltaPost!.id)
                    return
                }
                // Store a reference to the new object
                let newPost = result.data!.onDeltaPost!
                self.addOrUpdatePostInQuery(id: newPost.id, title: newPost.title, author: newPost.author, content: newPost.content)
            } else if let error = error {
                print(error.localizedDescription)
            }
        }, deltaQuery: allPostsDeltaQuery,
           deltaQueryResultHandler: { (result, transaction, error) in
            if let result = result {
                guard result.data != nil, result.data?.listPostsDelta != nil else {
                    return
                }
                // Store a reference to the new updates
                let deltas = result.data!.listPostsDelta!

                for deltaPost in deltas {
                    print("App: Processing update on Post ID: \(deltaPost!.id)")
                    if deltaPost?.awsDs == DeltaAction.delete {
                        self.deletePostFromCache(uniqueId: deltaPost!.id)
                        continue
                    } else {
                        self.addOrUpdatePostInQuery(id: deltaPost!.id, title: deltaPost!.title, author: deltaPost!.author, content: deltaPost!.content)
                    }
                }
            } else if let error = error {
                print(error.localizedDescription)
            }
            // Set a sync configuration of 5 minutes.
        }, syncConfiguration: SyncConfiguration(baseRefreshIntervalInSeconds: 300))
    }
```

これらすべてのピースが揃ったら、以下のようにDelta Sync機能を呼び出して、すべてのピースを結びつけます。

**デルタ同期のライフサイクル**

差分同期プロセスは、さまざまな条件に対応して、さまざまな時間に実行されます。
- 上記のように `sync` を呼び出すと、直ちに実行されます。 これは最初の実行になり、キャッシュから最初に基本クエリを実行します。 サブスクリプションをセットアップし、ベースまたはデルタクエリを実行します。 初めて実行する場合は、常に基本クエリを実行します。
- 実行中のデバイスがオフラインからオンラインに移行したときに実行されます。 デバイスがオフラインであった期間に応じて、deltaQuery または baseQuery が実行されます。
- アプリがバックグラウンドからフォアグラウンドに遷移したときに実行されます。 アプリがバックグラウンドにある期間に応じて、deltaQuery か baseQuery のどちらかが実行されます。
- 同期設定で指定された時間に基づいて、周期キャッチアップの一部として毎回実行されます。 

---
title: モックとテスト
description: Amplifyプロジェクトのすべての変更をクラウドにプッシュせずに、すばやくテストとデバッグを行う方法を学びます。 API(AWS AppSync)、ストレージ(Amazon DynamoDBおよびAmazon S3)、関数(AWS Lambda)など、特定のカテゴリにローカルモックとテストを使用します。
---  

ローカルモックを使用する前に、AmplifyセットアップのGetting Started セクションを完了することを強くお勧めします。

<docs-internal-link-button href="~/start/start.md"> <span slot="text">🚀 始めましょう</span> </docs-internal-link-button>

In order to quickly test and debug without pushing all changes in your project to the cloud, Amplify supports *Local Mocking and Testing* for certain categories including API (AWS AppSync), Storage (Amazon DynamoDB and Amazon S3), and Functions (AWS Lambda). This includes using directives from the GraphQL Transformer, editing & debug resolvers, hot reloading, JWT mocking of authorization checks, and even performing S3 operations such as uploading and downloading content.

<amplify-callout> Amplifyでローカルモッキングを使用するには、開発ワークステーションにJavaが必要です </amplify-callout>

[サンプルアプリでブログウォークスルー](https://aws.amazon.com/blogs/mobile/amplify-framework-local-mocking/).

## API モック設定
`amplify init` を実行すると、すぐに GraphQL API を追加し、クラウドに最初にプッシュせずにモックを開始できます。 REST API はまだサポートされていません。例えば:

```bash
amplify init
amplify add api # GraphQLを選択し、API キー
を使用してモックAPIを増幅する
```

When you run `amplify mock api` the codegen process will run and create any required GraphQL assets such as queries, mutations, and subscriptions as well as TypeScript or Swift classes for your app. Android requires a build step for Gradle to create required classes after the codegen process completes, as well as an extra [configuration in your AndroidManifest.xml](#android-config).

If you do not wish to test your app locally, you can still use the [local GraphQL console](#graphql-local-console) as well as [edit, debug, and test your VTL resolvers](#graphql-resolver-debugging) locally against the mock endpoint.

スキーマを追加する場合は、最初に API キーを使用してすべてが動作するようにします。 ただし、Cognitoユーザープールで認証することはでき、ローカルテストサーバーはJWTトークンを認証します。 ローカルコンソールで JWT トークンをモックすることもできます(以下に概要を示します)。 ただし、その場合は、まずユーザープールを作成するために、 `プッシュを増幅する` を行う必要があります。

スキーマを定義する際には、GraphQL Transformer からのディレクティブをローカルテストで使用し、スキーマから型に対してローカルコードを生成することができます。 以下のディレクティブは現在ローカルでのテストでサポートされています:

- [@auth](~/cli/graphql-transformer/auth.md)
- [@key](~/cli/graphql-transformer/key.md)
- [@connections](~/cli/graphql-transformer/connection.md)
- [@バージョニング](~/cli/graphql-transformer/versioned.md)
- [@function](~/cli/graphql-transformer/function.md)

> `@searchable` は現時点ではサポートされていないことに注意してください。

## ストレージモックのセットアップ
For S3 storage mocking, after running `amplify init` you must first run through `amplify add auth`, either explicitly or implicitly if adding storage first, and then run an `amplify push`. This is because mocking storage in client libraries requires credentials for initial setup. Note however that S3 authorization rules, such as those placed on a bucket policy, are not checked by local mocking at this time.

一度最初のプッシュを行ったら、モックサーバーを実行して、ローカルエンドポイントをヒットできます。

```bash
amplify init
amplify add storage # これにより認証
push
amplify mock storage
```

To use an iOS application with the local S3 endpoint you will need to [modify your Info.plist file](#ios-config). To use an Android application with the local S3 endpoint you will need an extra [configuration in your AndroidManifest.xml](#android-config).

For DynamoDB storage, setup is automatically done when creating a GraphQL API with no action is needed on your part. Resources for the mocked data, such as the DynamoDB Local database or objects uploaded using the local S3 endpoint, inside your project under `./amplify/mock-data`.

## 機能モック設定
For Lambda function mocking, after running `amplify init` you can add a function to your project with `amplify add function` and either invoke it directly, or use the [@function](~/cli/graphql-transformer/function.md) directive as part of your GraphQL schema to mock the invocation as part of your API.

関数を直接呼び出すには：

```bash
amplify init
increify add function # プロンプトに従ってください
amplify mock function <function_name>
```

これにより、Lambdaのイベントハンドラに渡すイベントペイロードを含むJSONファイルへのパスが要求されます。 デフォルトは `src/event.json`です。毎回パスを入力しないようにするには、
```bash
amplify モック関数 <function_name> --event "<path to event JSON file>"
```

### GraphQLをモックする関数

あるいは、Lambda関数を追加し、 `@function` ディレクティブを使用してGraphQLリゾルバとして添付することもできます。 これを行うには、まずプロジェクトに関数を追加します。

```bash
amplify init
increify add function # Follow prompts
increify add api # GraphQLを選択し、API キーを使用する
```
次に、スキーマ内のクエリまたはフィールドにリゾルバとして関数を追加します。 たとえば、関数 **の quoteOfTheDay** に名前を付けた場合、スキーマは次のようなクエリを持っている可能性があります。

```
type Query {
    getQuote: String @function(name: "quoteOfTheDay-${env}")
}
```
@function ディレクティブの使い方の完全な説明は [こちら](~/cli/graphql-transformer/function.md) をご覧ください。

次に、 `amplifyモックapi`を実行すると、以下のようなGraphQLのクエリを実行するときに、ローカルのGraphQLエンドポイントがこの関数を呼び出します。

```
クエリ {
    getQuote
}
```

## 設定ファイル

When performing operations against the local mock endpoint, the Amplify CLI will automatically update your `aws-exports.js` and `awsconfiguration.json` with the local endpoints, fake values where necessary (e.g. fake API key), and disable SSL with an explicit value (`DangerouslyConnectToHTTPEndpointForTesting`) to indicate the functionality is only for local mocking and testing. This happens automatically when you run `amplify mock` and the server is running. Once you stop the mock server the config files are updated with the correct cloud endpoints for your project and `DangerouslyConnectToHTTPEndpointForTesting` is removed from the config file.

### aws-exports.js の例

```javascript
const awsmobile = {
    "aws_project_region": "us-east-1",
    "aws_appsync_graphqlEndpoint": "http://localhost:20002/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_appsync_apiKey": "da2-fakeApiId123456",
    "aws_appsync_dangerously_connect_to_http_endpoint_for_testing": true,
    "aws_cognito_identity_pool_id": "us-east-1:270445b2-cc92-4d46-a937-e41e49bdb892",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_excPT39ZN",
    "aws_user_pools_web_client_id": "4a950rsq08d2gi68ogdt7sjqub",
    "oauth": {},
    "aws_user_files_s3_bucket": "local-testing-app-2fbf0a32d1896419b88f004c2755d084c-dev",
    "aws_user_files_s3_bucket_region": "us-east-1",
    "aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing": true
};
```

### awsconfiguration.json の例

```json
    "AppSync": {
        "Default": {
            "ApiUrl": "http://localhost:20002/graphql",
            "Region": "us-east-1",
            "AuthMode": "AMAZON_COGNITO_USER_POOLS",
            "ClientDatabasePrefix": "deddd_AMAZON_COGNITO_USER_POOLS",
            "DangerouslyConnectToHTTPEndpointForTesting": true
        }
    },
    "S3TransferUtility": {
        "Default": {
            "Bucket": "local-testing-app-2fbf0a32d1896419b88f004c2755d084c-dev",
            "Region": "us-east-1",
            "DangerouslyConnectToHTTPEndpointForTesting": true
        }
    }
```

## iOSの設定

When running against the local mock S3 server with iOS you must update your `Info.plist` to not require SSL when on a local network. To enable this set `NSAllowsLocalNetworking` to `YES` under `NSAppTransportSecurity`. This will scope the security exception to only run on localhost domains as outlined in [Apple Developer documentation for NSAllowsLocalNetworking](https://developer.apple.com/documentation/bundleresources/information_property_list/nsapptransportsecurity/nsallowslocalnetworking).

## Android の設定

Android **を使用してローカルのモックサーバに対して実行する場合は、追加のビルドバリアントを使用することをお勧めします**。 DebugやReleaseなど、アプリがローカルネットワーク上で実行されている場合にのみ、クリアテキストトラフィックを有効にします。 これにより、リリースビルドバリアントでセキュアでない HTTP トラフィックが許可されないようになります。

例えば、Android Studio プロジェクトで `/src/debug/AndroidManifest.xml` を作成し、このファイルでネットワーク構成ファイルの参照を作成します。 `android:networkSecurityConfig="@xml/network_security_config"`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:networkSecurityConfig="@xml/network_security_config" />
</manifest>
```

次に、ネットワーク構成ファイル `/src/debug/res/xml/network_security_config.xml` を作成し、localhostのIP範囲でのみ実行するように制限します。

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>
```

Then use a [Build Variant](https://developer.android.com/studio/build/build-variants) and run the Debug build and only test this setting with your local mock server. To learn more about this please see the [official Android documentation](https://developer.android.com/studio/build/manifest-merge).

Alternatively, if you are running a non-production application and do not want to use multiple Build Variants, you can set `android:usesClearTextTraffic="true"` in your **AndroidManifest.xml** as in the code snippet below. **This is not a recommended practice. Ensure you remove this once mocking is complete**.

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/AppTheme"
    android:usesClearTextTraffic="true" >

    <!--other code-->
</application>
```

## GraphQL ローカルコンソール

テストを開始するには、JavaScript/Android/iOSアプリケーションを起動する前に、次のコマンドを実行します。

```
$ amplify mock
```

Alternatively, you can run `amplify mock api` to only mock the API category. When prompted, ensure you select **YES** to automatically generate queries, mutations, and subscriptions if you are building a client application.

Once the server starts it will print a URL. Open this URL in your browser (it should be `http://localhost:20002`) and the [OneGraph](https://github.com/OneGraph/graphiql-explorer) GraphQL console will open up in your browser. You can use the explorer on the left to build out a query/mutation or manually type your statements in the main window. Amplify mocking will use DynamoDB Local to persist the records on your system. If you wish, you can view these in Visual Studio code with [SQLite Explorer](https://github.com/AlexCovizzi/vscode-sqlite). Follow the instructions in that repo for connecting to local databases.

When your API is configured to use Cognito User Pools, the local console provides a way to change `Username`, `Groups`, and `email` of the bundled JWT token. These values are used by GraphQL transformers Auth directive. Edit them by clicking **Auth** and saving your changes, then run operations in the console to test your rules.

## GraphQL リゾルバのデバッグ

You can edit VTL templates locally to see if they contain errors, including the line numbers causing problems, before pushing to AppSync. With the local API running navigate to `./amplify/backend/api/APINAME/resolvers` where `APINAME` is the logical name that you used when running `$amplify add api`. You will see a list of resolver templates that the Transformer generated. Modify any of them and save, and they will be immediately loaded into the locally running API service with a message `Mapping template change detected. Reloading.`. If there is an error you will see something such as the following:

```
エラーのリロードに失敗しました: 1行目のパースエラー:
...son($context.result
------------------^
```

If you stop the server locally, for instance to push your changes to the cloud, all of the templates in the `../APINAME/resolvers` directory will be removed except for any that you modified. When you subsequently push to the cloud these local changes will be merged with your AppSync API.

### スキーマを変更してテストする

As you are developing your app, you can always modify the GraphQL schema which lives in `./amplify/backend/api/APINAME/schema.graphql`. You can modify any types using any of the supported directives and save this file, while the local server is still running. The changes will be detected and if your schema is valid they will be hot reloaded into the local API. If there is an error in the schema an error will be printed to the terminal like so:

```
不明なディレクティブ "mode".

GraphQL リクエスト (1:11)
1: type Todo @mode{
             ^
2: id: ID!

    at GraphQLTransform.transform
```

Amplify libraries when configured for these categories can use the local mocked endpoints for testing your application. When a mock endpoint is running the CLI will update your `aws-exports.js` or `awsconfiguration.json` to use the mock server and once stopped they will be updated to use the cloud endpoint once you have run an `amplify push`.

---
title: "アプリコードをAPIに接続する"
section: "frontend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/data/connect-to-API/"
---

このガイドでは、Amplify ライブラリを使用してアプリケーションコードをバックエンド API に接続します。開始する前に、以下が必要です：

- クラウドサンドボックスと Amplify Data リソースが実行中（`npx ampx sandbox`）
- Amplify ライブラリがインストールされたフロントエンドアプリケーション
- [npm がインストール済み](https://docs.npmjs.com/getting-started)

## Amplify ライブラリを設定する

バックエンド（`npx ampx sandbox`）を繰り返し実行すると、**amplify_outputs.json** ファイルが生成されます。このファイルには API のエンドポイント情報と認証設定が含まれています。以下のコードをアプリのエントリーポイントに追加して、Amplify クライアントライブラリを初期化および設定します：

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

## Amplify Data クライアントを生成する

Amplify ライブラリが設定されたら、フロントエンドコードの「Data クライアント」を生成して、バックエンドへの完全に型付けされた API リクエストを実行できます。

> **Info:** **JavaScript のみのフロントエンド（TypeScript ではなく）で Amplify を使用している場合でも、JSDoc コメントで生成されたクライアントに注釈を付けることで、完全に型付けされたデータフェッチエクスペリエンスを実現できます**。以下のコードブロックで **JavaScript** を選択して確認してください。

新しい Data クライアントを生成するには、次のコードを使用します：

#### [TypeScript]
```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const client = generateClient<Schema>();

// これで Data クライアントで CRUDL 操作を実行できるようになります
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};
```

#### [JavaScript]
```js
import { generateClient } from 'aws-amplify/data';

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
const client = generateClient();

// これで Data クライアントで CRUDL 操作を実行できるようになります
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};
```

<!-- /Platform -->

## 認可モードを設定する

**認可モード**は、リクエストをバックエンドでどのように認可するかを決定します。デフォルトでは、Amplify Data は「userPool」認可を使用して、署名されたユーザー認証情報で API リクエストに署名します。データモデルに `allow.publicApiKey()` 認可ルールを使用している場合は、認可モードとして「apiKey」を使用する必要があります。[認可ルールをカスタマイズ](/[platform]/build-a-backend/data/customize-authz)を確認して、どのタイプのリクエストでどの認可モードを選択するかについて詳しく学んでください。**デフォルト認可モード**は、デプロイメント成功時に生成される **amplify_outputs.json** の一部として提供されます。

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
異なる認可モードで異なる Data クライアントを生成するか、リクエスト時に認可モードを渡すことができます。

### クライアントごとに認可モードを設定する

Data クライアントからのすべてのリクエストに同じ認可モードを適用するには、`generateClient` 関数の `authMode` パラメータを指定します。

#### [API キー]

`allow.publicApiKey()` 認可ルールが定義されている場合は、認可モードとして「API キー」を使用します。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const client = generateClient<Schema>({
  authMode: 'apiKey',
});
```

#### [Amazon Cognito ユーザープール]

`allow.authenticated()`、`allow.owner()`、`allow.ownerDefinedIn()`、`allow.groupsDefinedIn()`、または `allow.groups()` などの Amazon Cognito ユーザープールベースの認可ルールを使用している場合は、認可モードとして「userPool」を使用します。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const client = generateClient<Schema>({
  authMode: 'userPool',
});
```

#### [AWS IAM（Amazon Cognito アイデンティティプール役割を含む）]

`allow.guest()` または `allow.authenticated('identityPool')` などの Amazon Cognito アイデンティティプールベースの認可ルールを使用している場合は、認可モードとして「identityPool」を使用します。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const client = generateClient<Schema>({
  authMode: 'identityPool',
});
```

#### [OpenID Connect（OIDC）]
信頼されたアイデンティティプロバイダーにアプリケーションを接続する場合は、認可モードとして「oidc」を使用します。OIDC 認可モードではプライベート、所有者、およびグループ認可を設定できます。詳しくは [OIDC 認可ドキュメント](/[platform]/build-a-backend/data/customize-authz/using-oidc-authorization-provider)を確認してください。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const client = generateClient<Schema>({
  authMode: 'oidc',
});
```

#### [Lambda Authorizer]

`allow.custom()` を使用して独自のカスタム認可ロジックを使用している場合は、「Lambda Authorizer」を使用します。[認可ルールをカスタマイズ](/[platform]/build-a-backend/data/customize-authz)を確認して、AWS Lambda で認可プロトコルを実装する方法について詳しく学んでください。

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // バックエンドリソース定義へのパス

const getAuthToken = () => 'myAuthToken';
const lambdaAuthToken = getAuthToken();

const client = generateClient<Schema>({
  authMode: 'lambda',
  authToken: lambdaAuthToken,
});
```

<!-- /Platform -->

### リクエストレベルで認可モードを設定する

各個別 API リクエストで認可モードを指定することもできます。これは、アプリケーションが通常は 1 つの認可モードを使用し、少数の例外がある場合に便利です。

#### [API キー]

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'apiKey',
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val query = ModelQuery.list(Todo::class.java) as AppSyncGraphQLRequest<PaginatedResult<Todo>>
val apiKeyQuery = query
    .newBuilder()
    .authorizationType(AuthorizationType.API_KEY)
    .build<PaginatedResult<Todo>>()
Amplify.API.query(apiKeyQuery,
    { Log.i("MyAmplifyApp", "Queried with API key ${it.data}")},
    { Log.e("MyAmplifyApp", "Error querying with API Key")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await Amplify.API.query(
    request: .list(
        Todo.self,
        authMode: .apiKey))
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final apiKeyRequest = ModelQueries.list(Todo.classType, authorizationMode: APIAuthorizationType.apiKey);
final apiKeyResponse = await Amplify.API.query(request: apiKeyRequest).response;
```
<!-- /Platform -->

#### [Amazon Cognito ユーザープール]

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'userPool',
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val query = ModelQuery.list(Todo::class.java) as AppSyncGraphQLRequest<PaginatedResult<Todo>>
val userPoolQuery = query
  .newBuilder()
  .authorizationType(AuthorizationType.AMAZON_COGNITO_USER_POOLS)
  .build<PaginatedResult<Todo>>()
Amplify.API.query(userPoolQuery,
  { Log.i("MyAmplifyApp", "Queried with Cognito user pool ${it.data}")},
  { Log.e("MyAmplifyApp", "Error querying with Cognito user pool")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await Amplify.API.query(
    request: .list(
        Todo.self,
        authMode: .amazonCognitoUserPools))
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final userPoolRequest = ModelQueries.list(Todo.classType, authorizationMode: APIAuthorizationType.userPools);
final userPoolResponse = await Amplify.API.query(request: userPoolRequest).response;
```
<!-- /Platform -->

#### [AWS IAM（Amazon Cognito アイデンティティプール役割を含む）]

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'identityPool',
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val query = ModelQuery.list(Todo::class.java) as AppSyncGraphQLRequest<PaginatedResult<Todo>>
val iamQuery = query
    .newBuilder()
    .authorizationType(AuthorizationType.AWS_IAM)
    .build<PaginatedResult<Todo>>()
Amplify.API.query(iamQuery,
    { Log.i("MyAmplifyApp", "Queried with AWS IAM ${it.data}")},
    { Log.e("MyAmplifyApp", "Error querying with AWS IAM")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await Amplify.API.query(
    request: .list(
        Todo.self,
        authMode: .awsIAM))
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final iamRequest = ModelQueries.list(Todo.classType, authorizationMode: APIAuthorizationType.iam);
final iamResponse = await Amplify.API.query(request: iamRequest).response;
```
<!-- /Platform -->

#### [OpenID Connect（OIDC）]

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'oidc',
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val query = ModelQuery.list(Todo::class.java) as AppSyncGraphQLRequest<PaginatedResult<Todo>>
val oidcQuery = query
    .newBuilder()
    .authorizationType(AuthorizationType.OPENID_CONNECT)
    .build<PaginatedResult<Todo>>()
Amplify.API.query(oidcQuery,
    { Log.i("MyAmplifyApp", "Queried with OIDC authorization mode ${it.data}")},
    { Log.e("MyAmplifyApp", "Error querying with OIDC authorization mode")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await Amplify.API.query(
    request: .list(
        Todo.self,
        authMode: .openIDConnect))
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final oidcRequest = ModelQueries.list(Todo.classType, authorizationMode: APIAuthorizationType.oidc);
final oidcResponse = await Amplify.API.query(request: oidcRequest).response;
```
<!-- /Platform -->

#### [Lambda Authorizer]

AWS Lambda 関数を使用して、独自のカスタム API 認可ロジックを実装できます。[認可ルールをカスタマイズ](/[platform]/build-a-backend/data/customize-authz)を確認して、AWS Lambda で認可プロトコルを実装する方法について詳しく学んでください。

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const getAuthToken = () => 'myAuthToken';
const lambdaAuthToken = getAuthToken();

const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'lambda',
  authToken: lambdaAuthToken,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val query = ModelQuery.list(Todo::class.java) as AppSyncGraphQLRequest<PaginatedResult<Todo>>
val lambdaQuery = query
    .newBuilder()
    .authorizationType(AuthorizationType.AWS_LAMBDA)
    .build<PaginatedResult<Todo>>()
Amplify.API.query(lambdaQuery,
    { Log.i("MyAmplifyApp", "Queried with AWS Lambda authorizer ${it.data}")},
    { Log.e("MyAmplifyApp", "Error querying with AWS Lambda authorizer")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await Amplify.API.query(
    request: .list(
        Todo.self,
        authMode: .function))
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final lambdaRequest = ModelQueries.list(Todo.classType, authorizationMode: APIAuthorizationType.function);
final lambdaResponse = await Amplify.API.query(request: lambdaRequest).response;
```
<!-- /Platform -->

## カスタムリクエストヘッダーを設定する

Amplify Data エンドポイントを使用する場合、認可目的またはフロントエンドからバックエンド API へのメタデータを渡すためにリクエストヘッダーを設定する必要があるかもしれません。

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
これは設定に `headers` パラメータを指定して行われます。Data クライアントレベルまたはリクエストレベルのいずれかでヘッダーを定義できます：

#### [Data クライアントごとのカスタムヘッダー]

```ts
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: {
    'My-Custom-Header': 'my value',
  },
});
```

#### [リクエストごとのカスタムヘッダー]

```ts
// すべての CRUDL で同じ方法: .create, .get, .update, .delete, .list, .observeQuery
const { data: blog, errors } = await client.models.Blog.get(
  { id: 'myBlogId' },
  {
    headers: {
      'My-Custom-Header': 'my value',
    },
  }
);
```

上記の例は静的ヘッダーを設定する方法を示していますが、`headers` に非同期関数を指定することでプログラム的にヘッダーを設定することもできます：

#### [Data クライアントごとのカスタムヘッダー]

```ts
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: async (requestOptions) => {
    console.log(requestOptions);
    /* リクエストオプションを使用すると、HTTP メソッド、ヘッダー、リクエスト URI、
       クエリ文字列などのリクエストオプションに基づいてヘッダーをカスタマイズできます。
       これらのオプションは通常、リクエスト署名を作成するために使用されます。
    {
      method: '...',
      headers: { },
      uri: '/',
      queryString: ""
    }
    */
    return {
      'My-Custom-Header': 'my value',
    };
  },
});
```

#### [リクエストごとのカスタムヘッダー]

```ts
// すべての CRUDL で同じ方法: .create, .get, .update, .delete, .list, .observeQuery
const res = await client.models.Blog.get(
  { id: 'myBlogId' },
  {
    headers: async (requestOptions) => {
      console.log(requestOptions);
      /* リクエストオプションを使用すると、HTTP メソッド、ヘッダー、リクエスト URI、
         クエリ文字列などのリクエストオプションに基づいてヘッダーをカスタマイズできます。
         これらのオプションは通常、リクエスト署名を作成するために使用されます。
      {
        method: '...',
        headers: { },
        uri: '/',
        queryString: ""
      }
      */
      return {
        'My-Custom-Header': 'my value',
      };
    },
  }
);
```

<!-- /Platform -->

<!-- Platform: android -->
独自のヘッダーを指定するには、`AWSApiPlugin` のビルダーで `configureClient()` 設定オプションを使用します。**amplify_outputs.json** で設定されているいずれかの API の名前を指定します。以下のようにラムダ式を提供することで、基礎となる OkHttp インスタンスにカスタマイズを適用します。

#### [Java]

```java
AWSApiPlugin plugin = AWSApiPlugin.builder()
    .configureClient(AWSApiPlugin.DEFAULT_GRAPHQL_API, okHttpBuilder -> {
        okHttpBuilder.addInterceptor(chain -> {
            Request originalRequest = chain.request();
            Request updatedRequest = originalRequest.newBuilder()
                .addHeader("customHeader", "someValue")
                .build();
            return chain.proceed(updatedRequest);
        });
    })
    .build();
Amplify.addPlugin(plugin);
```

#### [Kotlin - コールバック]

```kotlin
val plugin = AWSApiPlugin.builder()
    .configureClient(AWSApiPlugin.DEFAULT_GRAPHQL_API) { okHttpBuilder ->
        okHttpBuilder.addInterceptor { chain ->
            val originalRequest = chain.request()
            val updatedRequest = originalRequest.newBuilder()
                .addHeader("customHeader", "someValue")
                .build()
            chain.proceed(updatedRequest)
        }
    }
    .build()
Amplify.addPlugin(plugin)
```

#### [Kotlin - コルーチン]

```kotlin
val plugin = AWSApiPlugin.builder()
    .configureClient(AWSApiPlugin.DEFAULT_GRAPHQL_API) { okHttpBuilder ->
        okHttpBuilder.addInterceptor { chain ->
            val originalRequest = chain.request()
            val updatedRequest = originalRequest.newBuilder()
                .addHeader("customHeader", "someValue")
                .build()
            chain.proceed(updatedRequest)
        }
    }
    .build()
Amplify.addPlugin(plugin)
```

#### [RxJava]

```java
AWSApiPlugin plugin = AWSApiPlugin.builder()
    .configureClient(AWSApiPlugin.DEFAULT_GRAPHQL_API, okHttpBuilder -> {
        okHttpBuilder.addInterceptor(chain -> {
            Request originalRequest = chain.request();
            Request updatedRequest = originalRequest.newBuilder()
                .addHeader("customHeader", "someValue")
                .build();
            return chain.proceed(updatedRequest);
        });
    })
    .build();
RxAmplify.addPlugin(plugin);
```

<!-- /Platform -->

<!-- Platform: swift -->
カスタムヘッダーを送信リクエストに含めるには、`AWSAPIPlugin` に `URLRequestInterceptor` を追加します。

```swift
import Amplify
import AWSAPIPlugin

struct CustomInterceptor: URLRequestInterceptor {
    func intercept(_ request: URLRequest) throws -> URLRequest {
        var request = request
        request.setValue("headerValue", forHTTPHeaderField: "headerKey")
        return request
    }
}
let apiPlugin = AWSAPIPlugin(modelRegistration: AmplifyModels())
try apiPlugin.add(interceptor: CustomInterceptor(), for: AWSAPIPlugin.defaultGraphQLAPI)
try Amplify.add(plugin: apiPlugin)
try Amplify.configure(with: .amplifyOutputs)

```
<!-- /Platform -->

<!-- Platform: flutter -->
GraphQL リクエストの最もシンプルなオプションは、`GraphQLRequest` の `headers` プロパティを使用することです。

```dart
Future<void> queryWithCustomHeaders() async {
  final operation = Amplify.API.query<String>(
    request: GraphQLRequest(
      document: graphQLDocumentString,
      headers: {'customHeader': 'someValue'},
    ),
  );
  final response = await operation.response;
  final data = response.data;
  safePrint('data: $data');
}
```

別のオプションは、API プラグインの `baseHttpClient` プロパティを使用することで、すべての HTTP 呼び出しのヘッダーをカスタマイズしたり、HTTP 機能を変更したりできます。

```dart
// まず、HTTP 機能を拡張するカスタム HTTP クライアント実装を作成します。
class MyHttpRequestInterceptor extends AWSBaseHttpClient {
  @override
  Future<AWSBaseHttpRequest> transformRequest(
    AWSBaseHttpRequest request,
  ) async {
    request.headers.putIfAbsent('customHeader', () => 'someValue');
    return request;
  }
}

// 次に、Amplify を設定するときにこのクライアントのインスタンスを `baseHttpClient` に渡すことができます。
await Amplify.addPlugins([
  AmplifyAPI(baseHttpClient: MyHttpRequestInterceptor()),
]);
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
## 追加の Data エンドポイントを使用する

別の Amplify プロジェクトで管理している、またはその他の方法で管理している追加の Data エンドポイントがある場合、このセクションでは、フロントエンドコードでそのエンドポイントを使用する方法を説明します。

これは `generateClient` 関数の `endpoint` パラメータを指定して行われます。

```ts
import { generateClient } from 'aws-amplify/data';

const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
});
```

この Data エンドポイントが同じ認可設定（例えば、両方のエンドポイントが `amplify_outputs.json` のものと同じユーザープールおよび/またはアイデンティティプールを共有）を共有している場合は、`generateClient` で `authMode` パラメータを指定できます。

```ts
const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
  authMode: 'userPool',
});
```

エンドポイントが API キー認可を使用している場合は、`generateClient` で `apiKey` パラメータを渡すことができます。

```ts
const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
  authMode: 'apiKey',
  apiKey: 'my-api-key',
});
``` 

エンドポイントが異なる認可設定を使用している場合は、[カスタムリクエストヘッダーを設定](#set-custom-request-headers)セクションの指示を使用して、認可ヘッダーを手動で渡すことができます。
<!-- /Platform -->

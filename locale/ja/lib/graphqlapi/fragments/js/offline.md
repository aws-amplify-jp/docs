オフラインシナリオでは、Amplifyは2つのSDKSを提供します。

[Amplify DataStore](~/lib/datastore/getting-started.md) は AWS AppSync を使用しており、オフラインおよび低レイテンシのシナリオをサポートする必要のあるアプリを簡単に構築できます。 DataStore は、分散した作業も行います。 クロスユーザーデータは、追加のコードを書かずに共有および分散データを活用するためのプログラミングモデルを提供することによって、ローカルのみのデータを扱うのと同じくらい簡単です。

[AWS AppSync SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-js/) はオフラインサポートを提供し、アプリを AWS AppSync サービスと統合し、 [ここ](https://github.com/apollographql/apollo-client/) のApollo クライアントと統合することができます。

DataStore でオフラインファーストアプリを構築する方法については、こちらのドキュメント [](~/lib/datastore/getting-started.md) をご覧ください。

## AWS AppSync Client SDK

AppSync クライアント SDK は、オフラインのシナリオを「キャッシュを通じて書き込み」を提供するプログラムモデルでサポートします。 これにより、オフライン時にデータをレンダリングしたり、「楽観的な応答」を介して追加/更新したりすることができます。 次の図は、ネットワークGraphQL呼び出しとのAppSyncクライアントインターフェイス、オフラインの変更キュー、Apolloキャッシュ、およびアプリケーションコードを示しています。

![画像](~/images/appsync-architecture.png)


アプリケーション・コードは、GraphQL クエリ、変更、またはサブスクリプションを実行するために、AppSync クライアントと相互作用します。 APIキーを追加するHTTPレイヤーとインターフェースする場合、AppSyncクライアントは自動的に正しい認可メソッドを実行します。 トークン、または、セットアップの構成に応じてリクエストに署名します。 突然変異を行うとき 例えば、AppSyncクライアントがアプリに新しいアイテム(ブログポストなど)を追加するなど、ローカルキューにこれを追加します (ローカルストレージとディスクに永続化されます)。 アプリがオフラインの場合、AsyncStorage、またはその他のメディアはJavaScriptプラットフォームの構成によって異なります。 ネットワーク接続が復元されると、変更はシリアルの AppSync に送信され、応答を一つずつ処理することができます。

クエリによって返されるデータは、自動的に Apollo Cache に書き込まれます。 設定されたメディアに永続化されます。キャッシュは参照構造を使用してキー値ストアとして構成されます。 後続のクエリが存在し、個々のアイテムの結果を参照するベースの「ルートクエリ」があります。 アプリケーションコードに参照キー(通常は「id」)を指定します。 "listPosts"クエリと"getPost(id:1)"クエリの結果を格納したキャッシュの例を以下に示します。

| キー                       | 値                                                  |
| ------------------------ | -------------------------------------------------- |
| root_query               | [ROOT_QUERY.listPosts, ROOT_QUERY.getPost(id:1)] |
| ROOT_QUERY.listPosts     | {0, 1, …,N}                                        |
| 投稿:0                     | {author:"Nadia", content:"ABC"}                    |
| 投稿:1                     | {author:"Shaggy", content:"DEF"}                   |
| ...                      | ...                                                |
| 投稿:N                     | {author:"Pancho", content:"XYZ"}                   |
| ROOT_QUERY.getPost(id:1) | ref: $Post:1                                       |

Notice that the cache keys are normalized where the `getPost(id:1)` query references the same element that is part of the `listPosts` query. This happens automatically in JavaScript applications by using `id` as a common cache key to uniquely identify the objects. You can choose to change the cache key with the `cacheOptions :{ dataIdFromObject }` method when creating the `AWSAppSyncClient`:

```javascript
const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  cacheOptions: {
    dataIdFromObject: (obj) => `${obj.__typename}:${obj.myKey}`
  }
});
```

変更を実行している場合は、たとえオフラインであっても、いつでもこのキャッシュに「楽観的な応答」を書くことができます。 AppSync クライアントを使用して、アップデートにクエリを渡し、キャッシュ外のアイテムを読み込んで接続します。 これは通常、更新するクエリのGraphQL応答タイプに応じて、単一のアイテムまたはアイテムのリストを返します。 この時点でリストに追加し、削除します。 それを適切に更新してディスクに残す店舗への応答を書き戻すこともできます ネットワークに再接続すると、サービスからの応答は、権威ある応答として変更を上書きします。 [オフライン突然変異](#offline-mutations)のいくつかの例を紹介します。

## 設定オプション

`disableOffline`: オフライン機能を必要としない/必要としない場合。 このオプションは、オフライン中に行われたキャッシュと変更を保持するためにローカルストアの作成をスキップします。

```javascript
const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  disableOffline: true
});
```

`conflictResolver`: When clients make a mutation, either online or offline, they can send a version number with the payload (named `expectedVersion`) for AWS AppSync to check before writing to Amazon DynamoDB. A DynamoDB resolver mapping template can be configured to perform conflict resolution in the cloud, which you can learn about in the [AppSync Resolver Mapping Template Reference for DynamoDB](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-condition-expressions). If the service determines it needs to reject the mutation, data is sent to the client and you can optionally run a "custom conflict resolvers" to perform client-side conflict resolution.

- **mutions**: GraphQL ステートメント
- **mutationName**: GraphQL ステートメントに変更の名前が設定されている場合、任意。
- **変数**: 変異の入力パラメータ
- **data**: DynamoDBの実データのAWS AppSyncからの応答
- **retry**: 突然変異が再試行された回数

`conflictResolver` を `AWSAppSyncClient` オブジェクトに渡した例を以下に示します。

```javascript
const conflictResolver = ({ mutation, mutationName, variables, data, retries }) => {
    switch (mutationName) {
        case 'UpdatePostMutation':
            return {
                ...variables,
                expectedVersion: data.version,
            };
        default:
            return false;
    }
}

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  conflictResolver: conflictResolver
});
```

前の例では、mutationName を論理的にチェックすることができます。 変更の変数を持つオブジェクトを返すと、AWS AppSync が返す正しいバージョンの変更が自動的に再実行されます。

**Note**: We recommend doing this only in rare cases. Usually, we recommend that you let the AWS AppSync service define conflict resolution to prevent race conditions from occurring. If you don't want to retry, simply return `"DISCARD"`.

### オフライン設定

AWS AppSync SDK オフライン機能を使用する場合 (例えば `disableOffline: false`)、 `offlineConfig` キーで設定を提供できます。

- Error handling: (`callback`)
- カスタムストレージエンジン (`storage`)
- 元のストアのキープレフィックス（`keyPrefix`）

### エラー処理

アプリケーションがオフラインのときに変更が行われた場合、プラットフォームストレージエンジンに変更が継続されます。 オンラインに戻ると、GraphQLエンドポイントに送信されます。 APIによってレスポンスが返された場合 SDK は、 `offlineConfig` パラメータに指定されているコールバックを使用して、成功またはエラーを通知します。

```javascript
const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  offlineConfig: {
    callback: (err, succ) => {
      if(err) {
        const { mutation, variables } = err;

        console.warn(`ERROR for ${mutation}`, err);
      } else {
        const { mutation, variables } = succ;

        console.info(`SUCCESS for ${mutation}`, succ);
      }
    },
  },
});
```

**NOTE** If the app was closed and you re-opened it and there were errors this would be represented in the error callback above. However, if you're doing a mutation and the app is still online and the server rejects the write, you will need to handle it with a standard `try/catch`:

```javascript
(async () => {
  const variables = {
    input: {
        name: 'Use AppSync',
        description: 'Realtime and Offline',
    }
  };

  try {
    const result = await client.mutate({
      mutation: gql(createTodo),
      variables: variables
    });
  } catch (e) {
    console.warn('Error sending mutation: ',  e);
    console.warn(variables); // Do something with the data
  }
})();
```

**注意** SDKは自動的に標準ネットワークエラーを再試行します。 しかし、アクセスエラーまたは他の関連のないエラーは、あなたがそれらを処理する必要があります。

### カスタムストレージエンジン

[redux-persist サポートされているエンジン](https://github.com/rt2zz/redux-persist#storage-engines) リストから任意のカスタムストレージエンジンを使用できます。

構成は次のように行われます: (例に示すlocalForage)

```javascript
import * as localForage from "localforage";

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  offlineConfig: {
    storage: localForage,
  },
});
```


### キープレフィクス

The `AWSAppSyncClient` persists its cache data to support offline scenarios. Keys in the persisted cache will be prefixed by the provided `keyPrefix`.

このプレフィックスは、オフラインサポートが有効になっており、アプリ内で複数のクライアントを使用する場合に必要です (e. . [複数認証有効 AppSync API](#aws-appsync-multi-auth) へのアクセス


## オフラインミューテーション

As outlined in the architecture section, all query results are automatically persisted to disk with the AppSync client. For updating data through mutations when offline you will need to use an "optimistic response" by writing directly to the store. This is done by querying the store directly with `cache.readQuery({query: someQuery})` to pull the records for a specific query that you wish to update. You can do this manually with `update` functions or use the `buildMutation` and `buildSubscription` built-in helpers that are part of the AppSync SDK (we strongly recommended using these helpers).

[オフラインヘルパーのドキュメントはこちら](https://github.com/awslabs/aws-mobile-appsync-sdk-js/blob/master/OFFLINE_HELPERS.md)からご覧いただけます。

The `update` functions can be called two or more times when using an `optimisticResponse` depending on the number of mutation you have in your offline queue **and** if you are currently offline. This is because the Apollo client will call the function once for the local optimistic write and a second time for the server response. You can read more about this in the [Apollo documentation for cache updates](https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-after-a-mutation). The AppSync client when offline will automatically resolve the promise for the server response and place your mutation in a queue for later processing. When you come back online, each item in the queue will be executed in serial and its corresponding `update` function will run as well as triggering the optimistic update of the pending items in the queue. This is to ensure that the cache is consistent when rendering the UI. Note that this means that your `update` functions should be *idempotent*.

For example, the below code shows how you would update the `CreateTodoMutation` mutation from earlier by creating a `optimisticWrite(CreateTodoInput createTodoInput)` helper method that has the same input. This adds an item to the cache by first adding query results to a local array with `items.addAll(response.data().listTodos().items())` followed by the individual update using `items.add()`. You commit the record with `client.getStore().write()`. This example uses a locally generated unique identifier which might be enough for your app, however if the AppSync response returns a different value for `ID` (which many times is the case as best practice is generation of IDs at the service layer) then you will need to replace the value locally when a response is received. This can be done in the `onResponse()` method of the top level mutation callback by again querying the store, removing the item and calling `client.getStore().write()`.

### ヘルパーあり

キャッシュにアイテムを追加するために、 `buildMutation` ヘルパーを使用した例:

```javascript
import { buildMutation } from 'aws-appsync';
import { listTodos } from './graphql/queries';
import { createTodo, CreateTodoInput } from './graphql/mutations';

(async () => {
  const result = await client.mutate(buildMutation(client,
    gql(createTodo),
    {
      inputType: gql(CreateTodoInput),
      variables: {
        input: {
          name: 'Use AppSync',
          description: 'Realtime and Offline',
        }
      }
    },
    (_variables) => [ gql(listTodos) ],
    'Todo'));

  console.log(result);
})();
```

### ヘルパーなし

アイテムをキャッシュに追加するために、 `update` 関数を手動で記述する例:

```javascript
import { v4 as uuid } from 'uuid';
import { listTodos } from './graphql/queries';
import { createTodo } from './graphql/mutations';

(async () => {
  const result = await client.mutate({
    mutation: gql(createTodo),
    variables: {
      input: {
        name: 'Use AppSync',
        description: 'Realtime and Offline',
      }
    },
    optimisticResponse: () => ({
      createTodo: {
        __typename: 'Todo', // This type must match the return type of the query below (listTodos)
        id: uuid(),
        name: 'Use AppSync',
        description: 'Realtime and Offline',
      }
    }),
    update: (cache, { data: { createTodo } }) => {
      const query = gql(listTodos);

      // Read query from cache
      const data = cache.readQuery({ query });

      // Add newly created item to the cache copy
      data.listTodos.items = [
        ...data.listTodos.items.filter(item => item.id !== createTodo.id),
        createTodo
      ];

      //Overwrite the cache with the new results
      cache.writeQuery({ query, data });
    }
  });

  console.warn(result);
})();
```

You might add similar code in your app for updating or deleting items using an optimistic response, it would look largely similar except that you might overwrite or remove an element from the `data.listTodos.items` array. 

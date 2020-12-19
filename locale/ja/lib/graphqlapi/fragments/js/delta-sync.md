## デルタ同期

DeltaSyncでは、AWS AppSync GraphQLサーバーとの自動同期を実行できます。 クライアントは再接続、指数的なバックオフを実行し、デバイスへのデータ複製を簡素化するためにネットワークエラーが発生したときに再試行します。 これを行うには、GraphQL クエリの結果を取得し、ローカルの Apollo キャッシュでキャッシュします。 DeltaSync APIはApolloキャッシュへの書き込みを管理します。 そして、(React コンポーネントからのような) アプリケーション内のすべてのレンダリングは、読み取り専用のフェッチを介して行う必要があります。

最も基本的なフォームでは、API で単一のクエリを使用してバックエンドから state をクライアントにレプリケートできます。 これは「Base Query」と呼ばれ、DynamoDBテーブルに対応するGraphQL型のリスト操作になります。 コンテンツが頻繁に変更され、デバイスがオフラインとオンラインの間で頻繁に切り替わる大きなテーブルの場合。 ネットワークの再接続ごとにすべての変更を引くと、クライアントのパフォーマンスが低下する可能性があります。 この場合、クライアント API に、キャッシュにマージされる「Delta Query」という2番目のクエリを指定できます。 これを行うと、Base Queryが最初に実行され、データを使用してキャッシュをハイドレートします。 そして、各ネットワークでデルタクエリを再接続し、変更されたデータを取得するために実行されます。 ベースクエリは、「キャッチアップ」メカニズムとして、通常のベース上でも実行されます。 デフォルトでは、これは24時間ごとですが、多かれ少なかれ頻繁にすることができます。

クライアントが1つのクエリと別のクエリのインクリメンタルアップデートを使用してキャッシュの基本ハイドレーションを分離できるようにすることにより、 クライアントアプリケーションからバックエンドに計算を移動できます。 これは、オンラインとオフラインの状態を定期的に切り替える際に、クライアントにとって大幅に効率的です。 これをAWS AppSync バックエンドで実装することができます。例えば、インデックスでDynamoDB Queryを条件式と一緒に使用するなど、さまざまな方法です。 また、Pipeline Resolversを活用して、レコードを分割してデルタ応答をジャーナルとして動作させることもできます。 [CloudFormationの完全なサンプルは、AppSyncドキュメント](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-delta-sync.html)で入手できます。 このドキュメントの残りの部分は、クライアントの使用状況に焦点を当てます。

GraphQL サブスクリプションでデルタ同期機能を使用することもできます。 ネットワーク接続を切り替えたときだけでなくネット上でも変更を送信する この場合、標準のGraphQLサブスクリプションステートメントである「Subscription Query」と呼ばれる3つ目のクエリを渡すことができます。 デバイスが接続されると、これらは通常どおりに処理され、クライアント API は、リアルタイムのデータを簡単に設定するのに役立ちます。 ただし、デバイスがオフラインからオンラインに切り替わったとき。 高速を考慮して、クライアントは次の順序で同期とメッセージ処理と共に再購読を実行します:

1. 定義されたクエリを購読し、結果を受信キューに保存します
2. 適切なクエリを実行します( `baseRefreshIntervalInSeconds` が経過した場合、それ以外の場合はDelta Queryのみを実行します)
3. 適切なクエリの結果を使用してキャッシュを更新します
4. サブスクリプションキューを削除し、通常通り処理を続ける

Finally, you might have other queries which you wish to represent in your application other than the base cache hydration. For instance a `getItem(id:ID)` or other specific query. If your alternative query corresponds to items which are already in the normalized cache, you can point them at these cache entries with the `cacheUpdates` function which returns an array of queries and their variables. The DeltaSync client will then iterate through the items and populate a query entry for each item on your behalf. If you wish to use additional queries which don't correspond to items in your base query cache, you can always create another instance of the `client.sync()` process.

## 使用法

```typescript
// Start DeltaSync
const subscription = client.sync(options)
/*
Under the covers, this is actually an Observable<T> that the AppSync client automatically subscribes to for you, so the returned object is a "subscription". This means that you can automatically stop the synchronization process like so:
*/
// Stop DeltaSync
subscription.unsubscribe();
```

**`オプション` オブジェクト**

**baseQuery**
  - `query`: A `DocumentNode` for the base data (e.g. as returned by [`gql`](https://github.com/apollographql/graphql-tag#gql))
  - `変数` [optional]: もしあればクエリ変数を持つオブジェクト。
  - `baseRefreshIntervalInSeconds` [optional]: ベースクエリを再実行する秒数。デフォルト値: `600` (24時間)
  - `update` [optional]: キャッシュを更新する関数, 参照: [Apolloの `update` function](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-mutation-options-update)

**サブスクリプションクエリ**
  - `query`: A `DocumentNode` for the subscription (e.g. as returned by [`gql`](https://github.com/apollographql/graphql-tag#gql))
  - `変数` [optional]: もしあればクエリ変数を持つオブジェクト。
  - `update` [optional]: キャッシュを更新する関数, 参照: [Apolloの `update` function](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-mutation-options-update)

**deltaQuery**
  - `クエリ`: デルタの `DocumentNode` (例: [`gql`](https://github.com/apollographql/graphql-tag#gql) によって返される)
  - `変数` [optional]: もしあればクエリ変数を持つオブジェクト。
  - `update` [optional]: キャッシュを更新する関数, 参照: [Apolloの `update` function](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-mutation-options-update)

## buildSyncヘルパー

The quickest way to get started with the DeltaSync feature is by using the `buildSync` helper function. This helper function will build an `options` object with the appropriate `update` functions that will update the cache for you in a similar fashion to the [offline helpers](https://github.com/awslabs/aws-mobile-appsync-sdk-js/blob/master/OFFLINE_HELPERS.md).

The first argument you need to pass is the GraphQL `__typename` for your base query. The second argument is the `options` object from the previous section (without the `update` keys, since those will be generated for you by this helper function).

You can **optionally** pass a `cacheUpdates` parameter to the second argument with the following structure:
- **deltaRecord**: `deltaRecord` を受け取る関数(例: base/delta/subscription queryによって設定されたキャッシュ内の個々のアイテムと、GraphQL クエリの配列を返し、キャッシュに書き込む変数です。

例

```typescript
  client.sync(
    buildSync("Post", {
      baseQuery: {
        query: DeltaSync.BaseQuery
      },
      subscriptionQuery: {
        query: DeltaSync.Subscription
      },
      deltaQuery: {
        query: DeltaSync.DeltaSync
      },
      cacheUpdates: ( deltaRecord  ) => {
        const id = deltaRecord.id;
        return [{ query: DeltaSync.GetItem, variables: { id: id } }];
      }
    })
  )
```

### ヘルパー関数の要件
- `baseQuery` は、入れ子の型ではなくリストを返します。
- Your `deltaQuery` expects a parameter called `lastSync` of type `AWSTimestamp` and returns a list with the same fields as your `baseQuery` (an optionally, an `aws_ds` field with a value of `'DELETE'` for deletions, any other value for insert/update)
- The mutations that trigger the subscription in your `subscriptionQuery` should return a single record with the same fields as the items from your `baseQuery`, (an optionally, an `aws_ds` field with a value of `'DELETE'` for deletions, any other value for insert/update)

### 例

このサンプルのスキーマは以下のとおりです。 [CloudFormationの完全なサンプルは、AppSyncドキュメント](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-delta-sync.html) にあります。

```graphql
input CreatePostInput {
    author: String!
    title: String!
    content: String!
    url: String
    ups: Int
    downs: Int
}

enum DeltaAction {
    DELETE
}

type Mutation {
    createPost(input: CreatePostInput!): Post
    updatePost(input: UpdatePostInput!): Post
    deletePost(id: ID!): Post
}

type Post {
    id: ID!
    author: String!
    title: String!
    content: String!
    url: AWSURL
    ups: Int
    downs: Int
    createdDate: String
    aws_ds: DeltaAction
}

type Query {
    getPost(id: ID!): Post
    listPosts: [Post]
    listPostsDelta(lastSync: AWSTimestamp): [Post]
}

type Subscription {
    onDeltaPost: Post
        @aws_subscribe(mutations: ["createPost","updatePost","deletePost"])
}

input UpdatePostInput {
    id: ID!
    author: String
    title: String
    content: String
    url: String
    ups: Int
    downs: Int
}

schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
}
```

### サンプル クエリ

```graphql
query Base {
  listPosts {
    id
    title
    author
    content
  }
}

query Delta($lastSync: AWSTimestamp!) {
  listPostsDelta(
    lastSync: $lastSync
  ) {
    id
    title
    author
    content
    aws_ds
  }
}

subscription Subscription {
  onDeltaPost {
    id
    title
    author
    content
    aws_ds
  }
}
```


アプリにインポートする `./graphql/DeltaSync.js` ファイルで上記のクエリを定義します。

```javascript
import gql from "graphql-tag";

export const BaseQuery = gql`query Base{
  listPosts {
    id
    title
    author
    content
  }
}`;

export const GetItem = gql`query GetItem($id: ID!){
  getPost(id: $id) {
    id
    title
    author
    content
  }
}`;

export const Subscription = gql`subscription Subscription {
  onDeltaPost {
    id
    title
    author
    content
  }
}`;

export const DeltaSync = gql`query Delta($lastSync: AWSTimestamp!) {
  listPostsDelta(
    lastSync: $lastSync
  ) {
    id
    title
    author
    content
    aws_ds
  }
}`;
```


```typescript
import { AWSAppSyncClient, buildSync } from "aws-appsync";
import * as DeltaSync from "./graphql/DeltaSync";

const client = new AWSAppSyncClient({
  // ...
});

const subscription = client.sync(
  buildSync('Post', {
    baseQuery: { query: DeltaSync.BaseQuery },
    subscriptionQuery: { query: DeltaSync.Subscription },
    deltaQuery: { query: DeltaSync.DeltaSync },
    cacheUpdates : ({id}) => [{query: DeltaSync.getItem, variables: {id}]
  })
);
```

### React の例

[Create React App](https://github.com/facebook/create-react-app) で以下の構造を持つアプリケーションが作成されたとします：

- App.js
  - 上記のように `AWSAppSyncClient` と `client.sync` を設定します
  - `<AllPosts />` と `<SinglePost item={2}>` をレンダリング
- AllPosts.jsx exports `<AllPosts />`
- GetPost.jsx exports `<SinglePost item={id}>`

`App.js`

```typescript
const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey
  }
});

client.hydrated().then(() =>
  client.sync(
    buildSync("Post", {
      baseQuery: {
        query: DeltaSync.BaseQuery
      },
      subscriptionQuery: {
        query: DeltaSync.Subscription
      },
      deltaQuery: {
        query: DeltaSync.DeltaSync
      },
      cacheUpdates: ({ id }) => [
        { query: DeltaSync.GetItem, variables: { id } }
      ]
    })
  )
);

const App = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <div>
        <OnePost id="96d5e889-38ba-4846-84d0-a11d6447d34b" />
        <hr />
        <AllPosts />
      </div>
    </Rehydrated>
  </ApolloProvider>
);
```

`AllPosts.jsx` には以下のようなコードがあります:

```typescript
const AllPosts = ({ postsList }) => (
  <div>
    <pre style={% raw %}{{ textAlign: "left" }}{% endraw %}>
      {JSON.stringify(postsList, null, 2)}
    </pre>
  </div>
);

export default graphql(DeltaSync.BaseQuery, {
  options: {
    fetchPolicy: "cache-only"
  },
  props: ({ data }) => ({
    postsList: data.listPosts || []
  })
})(AllPosts);
```

`GetPost.jsx` には以下のものがあります:

```typescript
const OnePost = ({ post }) => (
  <div>
    <pre style={% raw %}{{ textAlign: "left" }}{% endraw %}>{JSON.stringify(post, null, 2)}</pre>
  </div>
);

export default graphql(DeltaSync.GetItem, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: "cache-only"
  }),
  props: ({ data: { getPost } }) => ({
    post: getPost
  })
})(OnePost);
```

**Note**: The `fetchPolicy` is `cache-only` as all of the network requests are handled automatically by the `client.sync()` operation. You should use this if using different queries in other components as the `client.sync()` API manages the cache lifecycle. If you use another `fetch-policy` such as `cache-and-network` then extra network requests may take place negating the Delta Sync benefits.

## 更新関数の書き込み

`buildSync` ヘルパーを使用したくない場合は、アプリケーションコード内のキャッシュ更新を管理する責任があります。 これは、作成、更新、および適切な削除を管理する必要があるため、複雑なプロセスになる可能性があることに注意してください。 例として、以下のようにデルタレコードを使用してキャッシュを更新します。 ベースクエリの型に一致するように戻された型を更新する必要があることに注意してください。

```javascript
client.sync({
      baseQuery: { query: DeltaSyncQueries.BaseQuery },
      deltaQuery: {
        query: DeltaSyncQueries.DeltaSync,
        update: (cache, { data: { listPostsDelta } }) => {
          const query = DeltaSyncQueries.GetItem;

          listPostsDelta.forEach(deltaRecord => {
            const variables = { id: deltaRecord.id };

            cache.writeQuery({
              query,
              variables,
              data: { getPost: { ...deltaRecord, __typename: 'Post' } }
            });
          });
        }
      }
    });
```

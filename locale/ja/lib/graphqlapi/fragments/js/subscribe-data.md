## AmplifyGraphQLクライアントの使用

サブスクリプションは、特定のイベントが発生したときにサーバーがクライアントにデータを送信できるGraphQL機能です。 サブスクリプションを使用すると、アプリケーションでリアルタイムのデータ統合を有効にできます。

```javascript
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as subscriptions from './graphql/subscriptions';

// Subscribe to creation of Todo
const subscription = API.graphql(
    graphqlOperation(subscriptions.onCreateTodo)
).subscribe({
    next: ({ provider, value }) => console.log({ provider, value })
});

// Stop receiving data updates from the subscription
subscription.unsubscribe();

```

**AWS AppSync** のサブスクリプションを使用する場合 AppSync の設定が API の下にあるのではなく、設定オブジェクトのルートにあることを確認してください。

```javascript
Amplify.configure({
  Auth: {
    identityPoolId: 'xxx',
    region: 'xxx' ,
    cookieStorage: {
      domain: 'xxx',
      path: 'xxx',
      secure: true
    }
  },
  aws_appsync_graphqlEndpoint: 'xxxx',
  aws_appsync_region: 'xxxx',
  aws_appsync_authenticationType: 'xxxx',
  aws_appsync_apiKey: 'xxxx'
});
```

## AWS AppSync SDK の使用

Finally, it's time to set up a subscription to real-time data. The syntax is `client.subscribe({ query: SUBSCRIPTION })` which returns an `Observable` that you can subscribe to with `.subscribe()` as well as `.unsubscribe()` when the data is no longer necessary in your application. For example, if you have a `onCreateTodo` subscription, your code might look like the following:

```javascript
import { onCreateTodo } from './graphql/subscriptions';

let subscription;

(async () => {
  subscription = client.subscribe({ query: gql(onCreateTodo) }).subscribe({
    next: data => {
      console.log(data.data.onCreateTodo);
    },
    error: error => {
      console.warn(error);
    }
  });
})();

// Unsubscribe after 10 secs
setTimeout(() => {
  subscription.unsubscribe();
}, 10000);
```

Note that since `client.subscribe` returns an `Observable`, you can use `filter`, `map`, `forEach` and other stream related functions. When you subscribe, you'll get back a subscription object you can use to unsubscribe.

サブスクリプションは、mutions のような入力型を取ることもできます。その場合、入力に基づいて特定のイベントを購読します。 サブスクリプション引数の詳細については、 [リアルタイムデータ](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html) を参照してください。
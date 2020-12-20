このガイドでは、 `Hub` ユーティリティを使用してさまざまな認証イベントをリッスンする方法を学びます。

Amplify’s Auth category publishes in the auth channel when `signIn`, `signUp`, and `signOut` events happen. You can listen and act upon those event notifications.

```js
import { Hub } from 'aws-amplify';

Hub.listen('auth', (data) => {
  switch (data.payload.event) {
    case 'signIn':
        console.log('user signed in');
        break;
    case 'signUp':
        console.log('user signed up');
        break;
    case 'signOut':
        console.log('user signed out');
        break;
    case 'signIn_failure':
        console.log('user sign in failed');
        break;
    case 'configured':
        console.log('the Auth module is configured');
  }
});
```

`Hub` の仕組みの詳細については、APIドキュメント [をご覧ください。](~/lib/utilities/hub.md)
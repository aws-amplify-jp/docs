---
title: "ゲストアクセス"
section: "build-a-backend/auth/concepts"
platforms: ["javascript", "react-native", "flutter", "swift", "android", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/guest-access/"
---

<!-- Platform: flutter,swift,android -->
Auth プラグインは、デバイスがオンラインになると自動的にゲスト認証情報を取得するように設定できます。これにより、サインインなしに他のカテゴリーを「匿名で」使用できます。この状態では、属性の更新、パスワードの変更、現在のユーザーの取得など、ユーザー固有のメソッドは実行できません。ただし、`fetchAuthSession` メソッドを通じてデバイスに割り当てられた一意の Identity ID を取得できます（[こちらで説明](/[platform]/build-a-backend/auth/concepts/tokens-and-credentials/)）。
<!-- /Platform -->
<!-- Platform: javascript,react-native,angular,nextjs,react,vue -->
Amplify Auth は、デバイスがオンラインになると自動的にゲスト認証情報を取得するように設定できます。これにより、サインインなしに他のカテゴリーを「匿名で」使用できます。この状態では、属性の更新、パスワードの変更、現在のユーザーの取得など、ユーザー固有のメソッドは実行できません。ただし、`fetchAuthSession` メソッドを通じてデバイスに割り当てられた一意の Identity ID を取得できます（[こちらで説明](/[platform]/frontend/auth/manage-user-sessions/)）。
<!-- /Platform -->

Amplify Gen 2 はデフォルトでゲストアクセスを有効にします。これを無効にするには、`backend.ts` ファイルを次の変更で更新できます：

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'

const backend = defineBackend({
  auth,
  data,
});

// highlight-start
const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
// highlight-end
```

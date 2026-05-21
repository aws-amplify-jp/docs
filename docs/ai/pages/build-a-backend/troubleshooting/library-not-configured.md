---
title: "設定エラーのトラブルシューティング"
section: "build-a-backend/troubleshooting"
platforms: ["angular", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/troubleshooting/library-not-configured/"
---

設定の欠落またはNoCredentialsエラーメッセージが表示されており、プロジェクトで`Amplify.configure`を呼び出している場合、Amplify APIは`Amplify.configure`より前に呼び出されている可能性が高いです。これはいくつかの異なる方法で発生する可能性があります。以下はこの問題をトラブルシューティングするために確認できる3つの可能性です。

## チェック1: `Amplify.configure`がプロジェクトのルートで呼び出されていることを確認する

プロジェクトのルートファイルで`Amplify.configure`を呼び出していることを確認してください。アプリのルートファイルはフロントエンドフレームワークによって異なる場合があります。いくつかの一般的なフレームワークの現在のデフォルトは以下の通りです（TypeScriptを使用していない場合、`ts`と`tsx`拡張子は`js`と`jsx`になります）:

* Vue.js: **src/main.ts**
* React: **src/main.tsx**
* Angular: **src/main.ts**
* Next.js Page Router: **pages/_app.tsx** or **src/pages/_app.tsx**
* Nuxt: **app.vue** （または[こちら](/vue/frontend/server-side-rendering/nuxt/)で推奨されているプラグインファイル内）

<Callout>

Next.js App Routerを使用している場合は、ルートレベルの設定に関する[Next.jsドキュメント](/[platform]/frontend/server-side-rendering/#configure-amplify-apis-for-server-side-usage)の提案に従うことができます。ただし、子コンポーネントのいずれかでモジュールレベル（ファイルの先頭）でAPIを呼び出している場合、この問題が発生する可能性があることに注意してください。この場合は[チェック2](/[platform]/build-a-backend/troubleshooting/library-not-configured/#check-2-move-module-level-amplify-api-invocations)に進んでください。

</Callout>

## チェック2: モジュールレベルのAmplify API呼び出しを移動する

Amplify APIがアプリケーションライフサイクルの外で使用されている場合、JavaScriptバンドラーがそのAPI呼び出しを`Amplify.configure`の前に配置するリスクがあります。モジュールレベルの関数呼び出し（ファイルのトップレベルでの呼び出し）は、一般的にインポートされた順序で評価されます。

以下は、設定の欠落またはNoCredentialsエラーメッセージをもたらす可能性が高いコードの例です:

```tsx title="index.ts"
import { Amplify } from 'aws-amplify';
import ComponentX from 'module-fetch-auth';

// fetchAuthSession() in ComponentX executed on import

Amplify.configure();

export default function App() {
  return (
    <div>
        <ComponentX />
    </div>
  );
}
```

```tsx title="module-fetch-auth.tsx"
import { fetchAuthSession } from 'aws-amplify/auth';

fetchAuthSession(); // Will throw "AuthUserPoolException: Auth UserPool not configured."

export default function ComponentX() {
  return (
    <div className="box">
      ...
    </div>
  );
}
```

このエラーは、Next.js Layoutsを使用し、子コンポーネントでAmplify APIをモジュールレベル（ファイル/モジュールの先頭）で呼び出す場合にも発生します。以下はこの問題の例です:

```tsx title="layout.tsx"
import ConfigureAmplifyClientSide from '@/ConfigureAmplifyClientSide';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container py-6">
        <>
          <ConfigureAmplifyClientSide />
          {children}
        </>
      </body>
    </html>
  );
}
```

```tsx title="ConfigureAmplifyClientSide.tsx"
import { Amplify } from "aws-amplify";

Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
```

```tsx title="page.tsx"
import { fetchAuthSession } from "aws-amplify/auth";

// The layout calls configure, but fetchAuthSession ends up executing first
// Will throw "AuthUserPoolException: Auth UserPool not configured."
fetchAuthSession().then((session) => {
  console.log(session);
});

export default function HomePage() {
  return (
    <div className="box">
      ...
    </div>
  );
}
```

これを修正するには、すべてのAmplify API呼び出しをアプリケーションライフサイクル内に移動することをお勧めします。たとえば、**React**を使用している場合、`useEffect`フックを使用してアプリが読み込まれる前に実行すべき関数に対して使用できます:

```tsx title="index.ts"
import { Amplify } from 'aws-amplify';
import ComponentX from 'module-fetch-auth';

Amplify.configure();

export default function App() {
  return (
    <div>
        <ComponentX />
    </div>
  );
}
```

```tsx title="module-fetch-auth.tsx"
import { type AuthSession, fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function ComponentX() {
  const [session, setSession] = useState<AuthSession|undefined>();

  const getSession = async () => {
    try {
      const currentSession = await fetchAuthSession();
      setSession(currentSession);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div className="box">
      ...
    </div>
  );
}
```

## チェック3: マルチページアプリの各ページでAmplifyを設定する

マルチページアプリで作業している場合、アプリケーションの各ページ/ルートで`Amplify.configure()`を呼び出す必要があります。共通のソースファイルで`Amplify.configure`を呼び出し、各ページにインポートすることをお勧めします。

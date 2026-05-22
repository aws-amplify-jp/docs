---
title: "Next.js サーバーランタイム"
section: "frontend/data/connect-from-server-runtime"
platforms: ["android", "angular", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/data/connect-from-server-runtime/nextjs-server-runtime/"
---

このガイドでは、Next.js サーバーサイド ランタイム (SSR) から Amplify Data に接続する方法を説明します。Next.js アプリケーションの場合、Amplify は [App Router (React Server Components、Route Handlers、Server Actions)](https://nextjs.org/docs/app)、[Pages Router (Components、API Routes)](https://nextjs.org/docs/pages)、および [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) に対して第一級のサポートを提供します。

開始する前に、以下が必要です:

- [作成された Next.js アプリケーション](/[platform]/start/quickstart/)
- [Next.js 用 Amplify ライブラリがインストールおよび設定されている](/[platform]/frontend/server-side-rendering/)
- [デプロイされた Amplify Data リソース](/[platform]/build-a-backend/data/set-up-data/)、または [AWS AppSync](https://aws.amazon.com/appsync/) を直接使用

## Next.js サーバーランタイムから Amplify Data に接続する

Amplify Data への接続には、Next.js サーバーランタイムに対して正しいデータクライアントを選択し、データクライアントを生成してから API を呼び出すことが含まれます。

### ステップ 1 - Next.js サーバーランタイム用の正しい Data クライアントを選択する

Amplify は、`cookies` または `NextRequest` と `NextResponse` を使用してユーザートークンを取得するかによって使い分ける、Next.js サーバーランタイム用の 2 つの専用データクライアント (`@aws-amplify/adapter-nextjs/data` から) を提供します:

- `generateServerClientUsingCookies()` 🍪 は、`next/headers` から Next.js の `cookies` 関数で データクライアントを生成します。各 API リクエストは実行時に動的に cookie を再取得します。
- `generateServerClientUsingReqRes()` 🌐 は、トークン汚染を防ぐために `runWithAmplifyServerContext` 関数に提供される `NextRequest` と `NextResponse` を必要とするデータクライアントを生成します。

Next.js Router (App または Pages) に基づいて正しいデータクライアントを選択してから、ユースケースを選択してください:

#### [App Router]

| ユースケース           | 必要なデータクライアント             |
| ---------------------- | --------------------------------------- |
| React Server Component | `generateServerClientUsingCookies()` 🍪 |
| Server Actions         | `generateServerClientUsingCookies()` 🍪 |
| Route Handler          | `generateServerClientUsingCookies()` 🍪 |
| Middleware             | `generateServerClientUsingReqRes()` 🌐  |

#### [Pages Router]

**Pages Router**

| ユースケース               | 必要なデータクライアント       |
| -------------------------- | -------------------------------------- |
| サーバーサイドコンポーネントコード | `generateServerClientUsingReqRes()` 🌐 |
| API Route                  | `generateServerClientUsingReqRes()` 🌐 |
| Middleware                 | `generateServerClientUsingReqRes()` 🌐 |

### ステップ 2 - Next.js サーバーランタイム用の Data クライアントを生成する

#### [generateServerClientUsingCookies() 🍪]

Cookie を使用して Next.js サーバーランタイム用のデータクライアントを生成するには、Amplify 設定と Next.js からの cookies 関数の両方を提供する必要があります。

```ts
import { type Schema } from '@/amplify/data/resource';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import outputs from '@/amplify_outputs.json';
import { cookies } from 'next/headers';

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});
```

<Callout>

Amplify Data のサーバークライアントをユーティリティファイルで生成することをお勧めします。次に、生成されたクライアントを Next.js React Server Components、Server Actions、または Route Handlers にインポートします。

</Callout>

#### [generateServerClientUsingReqRes() 🌐]

`NextRequest` と `NextResponse` を使用して Next.js サーバーランタイム用のデータクライアントを生成するには、Amplify 設定を提供するだけで済みます。個別の API リクエストを行う際には、設定を [`runWithAmplifyServerContext`](/[platform]/frontend/server-side-rendering) 関数に渡して、リクエストとレスポンス変数から cookie を渡す必要があります。

```ts
import { type Schema } from '@/amplify/data/resource';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingReqRes } from '@aws-amplify/adapter-nextjs/data';
import outputs from '@/amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const reqResBasedClient = generateServerClientUsingReqRes<Schema>({
  config: outputs,
});
```

<Callout>

サーバーデータクライアントをユーティリティファイルで生成することをお勧めします。次に、生成されたクライアントを Next.js Middleware、コンポーネントのサーバーランタイムコード、および API Routes にインポートします。

</Callout>

### ステップ 3 - 生成されたサーバーデータクライアントを使用して API を呼び出す

生成されたサーバーデータクライアントで利用可能なクエリまたはミューテーションリクエストを実行できます。ただし、サーバーランタイム内ではサブスクリプションは利用できないことに注意してください。

#### [generateServerClientUsingCookies() 🍪]

Cookie ベースのサーバーデータクライアントを Next.js React Server Component コードにインポートして、API リクエストを実行します。

```ts
import { type Schema } from '@/amplify/data/resource';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import outputs from '@/amplify_outputs.json';
import { cookies } from 'next/headers';

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

const fetchTodos = async () => {
  const { data: todos, errors } = await cookieBasedClient.models.Todo.list();

  if (!errors) {
    return todos;
  }
};
```

#### [generateServerClientUsingReqRes() 🌐]

NextRequest/NextResponse ベースのサーバーデータクライアントを Next.js サーバーランタイムコードにインポートして、`runWithAmplifyServerContext` 関数内で API リクエストを実行します。Amplify サーバーコンテキストの作成の詳細については、[サーバーサイドレンダリング](/[platform]/frontend/server-side-rendering) を参照してください。

たとえば、Next.js Pages Router API ルートでは、`handler` 関数から `req` および `res` パラメータを `runWithAmplifyServerContext` と一緒に使用します:

```ts
import { type Schema } from '@/amplify/data/resource';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  runWithAmplifyServerContext,
  reqResBasedClient,
} from '@/utils/amplifyServerUtils';

type ResponseData = {
  todos: Schema['Todo']['type'][];
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  const todos = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      const { data: todos } = await reqResBasedClient.models.Todo.list(
        contextSpec
      );
      return todos;
    },
  });

  response.status(200).json({ todos });
}
```

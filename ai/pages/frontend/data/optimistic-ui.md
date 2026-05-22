---
title: "オプティミスティックUI"
section: "frontend/data"
platforms: ["angular", "javascript", "nextjs", "react", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/data/optimistic-ui/"
---

<!-- Platform: javascript, angular, nextjs, vue, react -->
Amplify Dataは[TanStack Query](https://tanstack.com/query/latest/docs/react/overview)と一緒に使用して、オプティミスティックUIを実装できます。これにより、CRUD操作がリクエストのラウンドトリップが完了する前に、UIに即座にレンダリングされます。Amplify DataをTanStackと一緒に使用すると、ローディング状態とエラー状態を簡単にレンダリングでき、APIコールが失敗した場合はUIの変更をロールバックできます。

以下の例では、新しく作成されたアイテムをオプティミスティックにレンダリングするリストビューと、更新と削除をオプティミスティックにレンダリングするディテールビューを作成します。

<Callout>

TanStack Queryの詳細、サポートされているブラウザ、高度な使用方法については、[TanStack Query ドキュメント](https://tanstack.com/query/latest/docs/react/overview)を参照してください。
TanStack Queryでオプティミスティック更新を実装する方法に関する完全なガイダンスについては、[TanStack Query オプティミスティックUI ドキュメント](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)を参照してください。
Amplify Dataの詳細については、[API ドキュメント](/[platform]/build-a-backend/data/set-up-data/)を参照してください。

</Callout>

開始するには、Reactフロントエンドを持つ既存のAmplifyプロジェクトで以下のコマンドを実行します:

```bash title="Terminal" showLineNumbers={false}
npm add @tanstack/react-query && \
npm add --save-dev @tanstack/react-query-devtools
```

Dataスキーマを修正して、この「Real Estate Property」の例を使用します:

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  RealEstateProperty: a.model({
    name: a.string().required(),
    address: a.string(),
  }).authorization(allow => [allow.guest()])
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
```

ファイルを保存し、`npx ampx sandbox`を実行してバックエンドのクラウドサンドボックスに変更をデプロイします。このガイドでは、Real Estate Propertyリスティングアプリケーションを構築します。

次に、プロジェクトのルートで、必要なTanStack Queryインポートを追加し、クライアントを作成します:

```ts title="src/main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
// highlight-start
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// highlight-end

Amplify.configure(outputs)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    // highlight-start
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // highlight-end
  </React.StrictMode>,
)
```

<Callout>

TanStack Query Devtoolsは必須ではありませんが、TanStackがどのように機能するかをデバッグして理解するのに便利です。デフォルトでは、React Query Devtoolsは`process.env.NODE_ENV === 'development'`の場合にのみバンドルに含まれるため、本番ビルドから除外するために追加の設定は必要ありません。
TanStack Query Devtoolsの詳細については、[TanStack Query Devtools ドキュメント](https://tanstack.com/query/latest/docs/react/devtools)を参照してください。

</Callout>

<Callout>

完全な動作例（必要なインポートとReactコンポーネント状態管理を含む）については、下の[完全な例](#complete-example)を参照してください。

</Callout>

## Amplify Data APIでTanStack Query クエリキーを使用する方法

TanStack Queryは、指定したクエリキーに基づいてクエリキャッシュを管理します。クエリキーは配列である必要があります。配列には単一の文字列、または複数の文字列とネストされたオブジェクトを含めることができます。クエリキーはシリアライズ可能で、クエリのデータに一意である必要があります。

TanStackを使用してAmplify DataでオプティミスティックUIをレンダリングする場合、APIの操作に応じて異なるクエリキーを使用する必要があります。アイテムのリストを取得する場合は、単一の文字列が使用されます(例: `queryKey: ["realEstateProperties"]`)。このクエリキーは、新しく作成されたアイテムをオプティミスティックにレンダリングする場合にも使用されます。アイテムを更新または削除する場合、クエリキーには削除または更新されるレコードの一意の識別子も含める必要があります(例: `queryKey: ["realEstateProperties", newRealEstateProperty.id"]`)。

クエリキーの詳細については、[TanStack Queryドキュメント](https://tanstack.com/query/v4/docs/react/guides/query-keys)を参照してください。

## レコードのリストをオプティミスティックにレンダリングする

Amplify Data APIから返されたアイテムのリストをオプティミスティックにレンダリングするには、TanStackの`useQuery`フックを使用して、Data APIクエリを`queryFn`パラメータとして渡します。次の例は、APIからすべてのレコードを取得するクエリを作成します。クエリキーとして`realEstateProperties`を使用します。これは、新しく作成されたアイテムをオプティミスティックにレンダリングする場合に使用する同じキーです。

```ts title="src/App.tsx"
// highlight-start
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useQuery } from '@tanstack/react-query'

const client = generateClient<Schema>();
// highlight-end

function App() {
  // highlight-start
  const {
    data: realEstateProperties,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties"],
    queryFn: async () => {
      const response = await client.models.RealEstateProperty.list();

      const allRealEstateProperties = response.data;

      if (!allRealEstateProperties) return null;

      return allRealEstateProperties;
    },
  });
  // highlight-end
  // return ...
}
```

## 新しく作成されたレコードをオプティミスティックにレンダリングする

Amplify Data APIから返された新しく作成されたレコードをオプティミスティックにレンダリングするには、TanStackの`useMutation`フックを使用して、Amplify Data API 変更をラッパーの`mutationFn`パラメータとして渡します。`useQuery`フックで使用されたものと同じクエリキー(`realEstateProperties`)を、新しく作成されたアイテムをオプティミスティックにレンダリングするためのクエリキーとして使用します。
`onMutate`関数を使用してキャッシュを直接更新し、`onError`関数を使用してリクエストが失敗した場合の変更をロールバックします。

```ts
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
// highlight-next-line
import { useQueryClient, useMutation } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  // highlight-next-line
  const queryClient = useQueryClient();

  // highlight-start
  const createMutation = useMutation({
    mutationFn: async (input: { name: string, address: string }) => {
      const { data: newRealEstateProperty } = await client.models.RealEstateProperty.create(input)
      return newRealEstateProperty;
    },
    // mutateが呼び出されたとき:
    onMutate: async (newRealEstateProperty) => {
      // 発信中のrefetchをキャンセルする
      // (オプティミスティック更新を上書きしないようにするため)
      await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

      // 前の値をスナップショット
      const previousRealEstateProperties = queryClient.getQueryData([
        "realEstateProperties",
      ]);

      // オプティミスティックに新しい値に更新
      if (previousRealEstateProperties) {
        queryClient.setQueryData(["realEstateProperties"], (old: Schema["RealEstateProperty"]["type"][]) => [
          ...old,
          newRealEstateProperty,
        ]);
      }

      // スナップショット値を持つコンテキストオブジェクトを返す
      return { previousRealEstateProperties };
    },
    // 変更が失敗した場合、
    // onMutateから返されたコンテキストを使用してロールバック
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error saving record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperties) {
        queryClient.setQueryData(
          ["realEstateProperties"],
          context.previousRealEstateProperties
        );
      }
    },
    // エラーまたは成功後は常にrefetch:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
    },
  });
  // highlight-end
  // return ...
}
```

## TanStack Queryで単一のアイテムをクエリする

単一のアイテムの更新をオプティミスティックにレンダリングするために、まずAPIからアイテムを取得します。`useQuery`フックを使用して、`get`クエリを`queryFn`パラメータとして渡します。クエリキーについては、`realEstateProperties`とレコードの一意の識別子の組み合わせを使用します。

```ts
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQuery } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  const currentRealEstatePropertyId = "SOME_ID"
  // highlight-start
  const {
    data: realEstateProperty,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties", currentRealEstatePropertyId],
    queryFn: async () => {
      if (!currentRealEstatePropertyId) { return }

      const { data: property } = await client.models.RealEstateProperty.get({
        id: currentRealEstatePropertyId,
      });
      return property;
    },
  });
  // highlight-end
}
```

## レコードの更新をオプティミスティックにレンダリングする

単一のレコードに対するAmplify Data更新をオプティミスティックにレンダリングするには、TanStackの`useMutation`フックを使用して、更新変更を`mutationFn`パラメータとして渡します。単一レコード`useQuery`フックで使用されたのと同じクエリキーの組み合わせ(`realEstateProperties`とレコードの`id`)を、更新をオプティミスティックにレンダリングするためのクエリキーとして使用します。
`onMutate`関数を使用してキャッシュを直接更新し、`onError`関数を使用してリクエストが失敗した場合の変更をロールバックします。

<Callout>

`onMutate`関数を使用してキャッシュと直接対話する場合、`newRealEstateProperty`パラメータは更新されているフィールドのみを含みます。`setQueryData`を呼び出す場合、更新されたフィールドのみのオプティミスティック値をUIでレンダリングするのを避けるために、すべてのフィールドの以前の値を新しく更新されたフィールドと一緒に含めてください。

</Callout>

```ts title="src/App.tsx"
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>()

function App() {
  // highlight-next-line
  const queryClient = useQueryClient();

  // highlight-start
   const updateMutation = useMutation({
    mutationFn: async (realEstatePropertyDetails: { id: string, name?: string, address?: string }) => {
      const { data: updatedProperty } = await client.models.RealEstateProperty.update(realEstatePropertyDetails);

      return updatedProperty;
    },
    // mutateが呼び出されたとき:
    onMutate: async (newRealEstateProperty: { id: string, name?: string, address?: string }) => {
      // 発信中のrefetchをキャンセルする
      // (オプティミスティック更新を上書きしないようにするため)
      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties", newRealEstateProperty.id],
      });

      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties"],
      });

      // 前の値をスナップショット
      const previousRealEstateProperty = queryClient.getQueryData([
        "realEstateProperties",
        newRealEstateProperty.id,
      ]);

      // オプティミスティックに新しい値に更新
      if (previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", newRealEstateProperty.id],
          /**
           * `newRealEstateProperty`は最初、レコードの更新された値のみを含みます。
           * UIで更新されたフィールドのみのオプティミスティック値をレンダリング
           * するのを避けるために、すべてのフィールドの以前の値を含めてください:
           */
          { ...previousRealEstateProperty, ...newRealEstateProperty }
        );
      }

      // 前と新しいrealEstatePropertyを含むコンテキストを返す
      return { previousRealEstateProperty, newRealEstateProperty };
    },
    // 変更が失敗した場合、上で返されたコンテキストを使用
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error updating record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", context.newRealEstateProperty.id],
          context.previousRealEstateProperty
        );
      }
    },
    // エラーまたは成功後は常にrefetch:
    onSettled: (newRealEstateProperty) => {
      if (newRealEstateProperty) {
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties"],
        });
      }
    },
  });
  // highlight-end
}
```

## レコードの削除をオプティミスティックにレンダリングする

単一のレコードの削除をオプティミスティックにレンダリングするには、TanStackの`useMutation`フックを使用して、削除変更を`mutationFn`パラメータとして渡します。単一レコード`useQuery`フックで使用されたのと同じクエリキーの組み合わせ(`realEstateProperties`とレコードの`id`)を、更新をオプティミスティックにレンダリングするためのクエリキーとして使用します。
`onMutate`関数を使用してキャッシュを直接更新し、`onError`関数を使用して削除が失敗した場合の変更をロールバックします。

```ts title="src/App.tsx"
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  // highlight-next-line
  const queryClient = useQueryClient();

  // highlight-start
    const deleteMutation = useMutation({
    mutationFn: async (realEstatePropertyDetails: { id: string }) => {
      const { data: deletedProperty } = await client.models.RealEstateProperty.delete(realEstatePropertyDetails);
      return deletedProperty;
    },
    // mutateが呼び出されたとき:
    onMutate: async (newRealEstateProperty) => {
      // 発信中のrefetchをキャンセルする
      // (オプティミスティック更新を上書きしないようにするため)
      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties", newRealEstateProperty.id],
      });

      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties"],
      });

      // 前の値をスナップショット
      const previousRealEstateProperty = queryClient.getQueryData([
        "realEstateProperties",
        newRealEstateProperty.id,
      ]);

      // オプティミスティックに新しい値に更新
      if (previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", newRealEstateProperty.id],
          newRealEstateProperty
        );
      }

      // 前と新しいrealEstatePropertyを含むコンテキストを返す
      return { previousRealEstateProperty, newRealEstateProperty };
    },
    // 変更が失敗した場合、上で返されたコンテキストを使用
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error deleting record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", context.newRealEstateProperty.id],
          context.previousRealEstateProperty
        );
      }
    },
    // エラーまたは成功後は常にrefetch:
    onSettled: (newRealEstateProperty) => {
      if (newRealEstateProperty) {
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties"],
        });
      }
    },
  });
  // highlight-end
}
```

## オプティミスティックレンダリングされたデータのローディング状態とエラー状態

`useQuery`と`useMutation`の両方は、クエリまたは変更の現在の状態を示す`isLoading`と`isError`の状態を返します。これらの状態を使用して、ローディングとエラーインジケータをレンダリングできます。

操作固有のローディング状態に加えて、TanStack Queryは[`useIsFetching`フック](https://www.tanstack.com/query/v4/docs/react/guides/background-fetching-indicators#displaying-global-background-fetching-loading-state)を提供します。このデモの目的のため、[完全な例](#complete-example)では、バックグラウンドでのフェッチを含む*任意の*クエリがフェッチされている場合に、TanStackがバックグラウンドで何をしているかを視覚化するのに役立つグローバルローディングインジケータを表示しています:

```js
function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}
```

TanStack Queryフックの高度な使用方法の詳細については、[TanStackドキュメント](https://tanstack.com/query/latest/docs/react/guides/mutations)を参照してください。

次の例は、TanStackから返された状態を使用して、変更進行中のローディングインジケータとエラーメッセージをレンダリングする方法を示しています。その他の例については、下の[完全な例](#complete-example)を参照してください。

```ts
<>
  {updateMutation.isError &&
  updateMutation.error instanceof Error ? (
    <div>An error occurred: {updateMutation.error.message}</div>
  ) : null}

  {updateMutation.isSuccess ? (
    <div>Real Estate Property updated!</div>
  ) : null}

  <button
    onClick={() =>
      updateMutation.mutate({
        id: realEstateProperty.id,
        address: `${Math.floor(
          1000 + Math.random() * 9000
        )} Main St`,
      })
    }
  >
    Update Address
  </button>
</>
```

## 完全な例

```tsx title="src/main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs)

export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

```tsx title="src/App.tsx"
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'
import { useIsFetching, useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from './main'
import { useState } from 'react'

const client = generateClient<Schema>({
  authMode: 'iam'
})

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}

function App() {
  const [currentRealEstatePropertyId, setCurrentRealEstatePropertyId] =
  useState<string | null>(null);

  const {
    data: realEstateProperties,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties"],
    queryFn: async () => {
      const response = await client.models.RealEstateProperty.list();

      const allRealEstateProperties = response.data;

      if (!allRealEstateProperties) return null;

      return allRealEstateProperties;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: { name: string, address: string }) => {
      const { data: newRealEstateProperty } = await client.models.RealEstateProperty.create(input)
      return newRealEstateProperty;
    },
    // mutateが呼び出されたとき:
    onMutate: async (newRealEstateProperty) => {
      // 発信中のrefetchをキャンセルする
      // (オプティミスティック更新を上書きしないようにするため)
      await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

      // 前の値をスナップショット
      const previousRealEstateProperties = queryClient.getQueryData([
        "realEstateProperties",
      ]);

      // オプティミスティックに新しい値に更新
      if (previousRealEstateProperties) {
        queryClient.setQueryData(["realEstateProperties"], (old: Schema["RealEstateProperty"]["type"][]) => [
          ...old,
          newRealEstateProperty,
        ]);
      }

      // スナップショット値を持つコンテキストオブジェクトを返す
      return { previousRealEstateProperties };
    },
    // 変更が失敗した場合、
    // onMutateから返されたコンテキストを使用してロールバック
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error saving record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperties) {
        queryClient.setQueryData(
          ["realEstateProperties"],
          context.previousRealEstateProperties
        );
      }
    },
    // エラーまたは成功後は常にrefetch:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
    },
  });

  function RealEstatePropertyDetailView() {

    const {
      data: realEstateProperty,
      isLoading,
      isSuccess,
      isError: isErrorQuery,
    } = useQuery({
      queryKey: ["realEstateProperties", currentRealEstatePropertyId],
      queryFn: async () => {
        if (!currentRealEstatePropertyId) { return }

        const { data: property } = await client.models.RealEstateProperty.get({ id: currentRealEstatePropertyId });
        return property
      },
    });

    const updateMutation = useMutation({
      mutationFn: async (realEstatePropertyDetails: { id: string, name?: string, address?: string }) => {
        const { data: updatedProperty } = await client.models.RealEstateProperty.update(realEstatePropertyDetails);

        return updatedProperty;
      },
      // mutateが呼び出されたとき:
      onMutate: async (newRealEstateProperty: { id: string, name?: string, address?: string }) => {
        // 発信中のrefetchをキャンセルする
        // (オプティミスティック更新を上書きしないようにするため)
        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });

        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties"],
        });

        // 前の値をスナップショット
        const previousRealEstateProperty = queryClient.getQueryData([
          "realEstateProperties",
          newRealEstateProperty.id,
        ]);

        // オプティミスティックに新しい値に更新
        if (previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", newRealEstateProperty.id],
            /**
             * `newRealEstateProperty`は最初、レコードの更新された値のみを含みます。
             * UIで更新されたフィールドのみのオプティミスティック値をレンダリング
             * するのを避けるために、すべてのフィールドの以前の値を含めてください:
             */
            { ...previousRealEstateProperty, ...newRealEstateProperty }
          );
        }

        // 前と新しいrealEstatePropertyを含むコンテキストを返す
        return { previousRealEstateProperty, newRealEstateProperty };
      },
      // 変更が失敗した場合、上で返されたコンテキストを使用
      onError: (err, newRealEstateProperty, context) => {
        console.error("Error updating record:", err, newRealEstateProperty);
        if (context?.previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", context.newRealEstateProperty.id],
            context.previousRealEstateProperty
          );
        }
      },
      // エラーまたは成功後は常にrefetch:
      onSettled: (newRealEstateProperty) => {
        if (newRealEstateProperty) {
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties", newRealEstateProperty.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties"],
          });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (realEstatePropertyDetails: { id: string }) => {
        const { data: deletedProperty } = await client.models.RealEstateProperty.delete(realEstatePropertyDetails);
        return deletedProperty;
      },
      // mutateが呼び出されたとき:
      onMutate: async (newRealEstateProperty) => {
        // 発信中のrefetchをキャンセルする
        // (オプティミスティック更新を上書きしないようにするため)
        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });

        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties"],
        });

        // 前の値をスナップショット
        const previousRealEstateProperty = queryClient.getQueryData([
          "realEstateProperties",
          newRealEstateProperty.id,
        ]);

        // オプティミスティックに新しい値に更新
        if (previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", newRealEstateProperty.id],
            newRealEstateProperty
          );
        }

        // 前と新しいrealEstatePropertyを含むコンテキストを返す
        return { previousRealEstateProperty, newRealEstateProperty };
      },
      // 変更が失敗した場合、上で返されたコンテキストを使用
      onError: (err, newRealEstateProperty, context) => {
        console.error("Error deleting record:", err, newRealEstateProperty);
        if (context?.previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", context.newRealEstateProperty.id],
            context.previousRealEstateProperty
          );
        }
      },
      // エラーまたは成功後は常にrefetch:
      onSettled: (newRealEstateProperty) => {
        if (newRealEstateProperty) {
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties", newRealEstateProperty.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties"],
          });
        }
      },
    });

    return (
      <div style={styles.detailViewContainer}>
        <h2>Real Estate Property Detail View</h2>
        {isErrorQuery && <div>{"Problem loading Real Estate Property"}</div>}
        {isLoading && (
          <div style={styles.loadingIndicator}>
            {"Loading Real Estate Property..."}
          </div>
        )}
        {isSuccess && (
          <div>
            <p>{`Name: ${realEstateProperty?.name}`}</p>
            <p>{`Address: ${realEstateProperty?.address}`}</p>
          </div>
        )}
        {realEstateProperty && (
          <div>
            <div>
              {updateMutation.isPending ? (
                "Updating Real Estate Property..."
              ) : (
                <>
                  {updateMutation.isError &&
                    updateMutation.error instanceof Error ? (
                    <div>An error occurred: {updateMutation.error.message}</div>
                  ) : null}

                  {updateMutation.isSuccess ? (
                    <div>Real Estate Property updated!</div>
                  ) : null}

                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: realEstateProperty.id,
                        name: `Updated Home ${Date.now()}`,
                      })
                    }
                  >
                    Update Name
                  </button>
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: realEstateProperty.id,
                        address: `${Math.floor(
                          1000 + Math.random() * 9000
                        )} Main St`,
                      })
                    }
                  >
                    Update Address
                  </button>
                </>
              )}
            </div>

            <div>
              {deleteMutation.isPending ? (
                "Deleting Real Estate Property..."
              ) : (
                <>
                  {deleteMutation.isError &&
                    deleteMutation.error instanceof Error ? (
                    <div>An error occurred: {deleteMutation.error.message}</div>
                  ) : null}

                  {deleteMutation.isSuccess ? (
                    <div>Real Estate Property deleted!</div>
                  ) : null}

                  <button
                    onClick={() =>
                      deleteMutation.mutate({
                        id: realEstateProperty.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <button onClick={() => setCurrentRealEstatePropertyId(null)}>
          Back
        </button>
      </div>
    );

  }
  return (
    <div>
      {!currentRealEstatePropertyId && (
        <div style={styles.appContainer}>
          <h1>Real Estate Properties:</h1>
          <div>
            {createMutation.isPending ? (
              "Adding Real Estate Property..."
            ) : (
              <>
                {createMutation.isError &&
                createMutation.error instanceof Error ? (
                  <div>An error occurred: {createMutation.error.message}</div>
                ) : null}

                {createMutation.isSuccess ? (
                  <div>Real Estate Property added!</div>
                ) : null}

                <button
                  onClick={() => {
                    createMutation.mutate({
                      name: `New Home ${Date.now()}`,
                      address: `${Math.floor(
                        1000 + Math.random() * 9000
                      )} Main St`,
                    });
                  }}
                >
                  Add RealEstateProperty
                </button>
              </>
            )}
          </div>
          <ul style={styles.propertiesList}>
            {isLoading && (
              <div style={styles.loadingIndicator}>
                {"Loading Real Estate Properties..."}
              </div>
            )}
            {isErrorQuery && (
              <div>{"Problem loading Real Estate Properties"}</div>
            )}
            {isSuccess &&
              realEstateProperties?.map((realEstateProperty, idx) => {
                if (!realEstateProperty) return null;
                return (
                  <li
                    style={styles.listItem}
                    key={`${idx}-${realEstateProperty.id}`}
                  >
                    <p>{realEstateProperty.name}</p>
                    <button
                      style={styles.detailViewButton}
                      onClick={() =>
                        setCurrentRealEstatePropertyId(realEstateProperty.id)
                      }
                    >
                      Detail View
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {currentRealEstatePropertyId && <RealEstatePropertyDetailView />}
      <GlobalLoadingIndicator />
    </div>
  );

}

export default App

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  detailViewButton: { marginLeft: "1rem" },
  detailViewContainer: { border: "1px solid black", padding: "3rem" },
  globalLoadingIndicator: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "4px solid blue",
    pointerEvents: "none",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px dotted grey",
    padding: ".5rem",
    margin: ".1rem",
  },
  loadingIndicator: {
    border: "1px solid black",
    padding: "1rem",
    margin: "1rem",
  },
  propertiesList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    width: "50%",
    border: "1px solid black",
    padding: "1rem",
    listStyleType: "none",
  },
} as const;
```
<!-- /Platform -->

<!-- Platform: swift -->
Amplify DataでオプティミスティックUIを実装することで、CRUD操作がリクエストのラウンドトリップが完了する前にUIに即座にレンダリングされ、APIコールが失敗した場合はUIの変更をロールバックできます。

以下の例では、新しく作成されたアイテム、更新、削除をオプティミスティックにレンダリングするリストビューを作成します。Dataスキーマを修正して、この「Real Estate Property」の例を使用します:

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  RealEstateProperty: a.model({
    name: a.string().required(),
    address: a.string(),
  }).authorization(allow => [allow.guest()])
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
```

ファイルを保存し、`npx ampx sandbox`を実行してバックエンドのクラウドサンドボックスに変更をデプロイします。このガイドでは、Real Estate Propertyリスティングアプリケーションを構築します。

バックエンドがプロビジョニングされたら、`npx ampx generate graphql-client-code --format modelgen --model-target swift --out <path_to_swift_project>/AmplifyModels`を実行してアプリ用のSwiftモデル型を生成します。

次に、Amplifyパッケージ(`https://github.com/aws-amplify/amplify-swift.git`)をXcodeプロジェクトに追加し、プロンプトが表示されたときに次のモジュールを選択してインポートします:

- AWSAPIPlugin
- AWSCognitoAuthPlugin
- AWSS3StoragePlugin
- Amplify

<Callout>

完全な動作例については、下の[完全な例](#complete-example)を参照してください。

</Callout>

## Swiftアクターを使用してオプティミスティックUI更新を実行する方法

Swiftアクターは、基になるプロパティへのアクセスをシリアライズします。この例では、アクターがアイテムのリストを保持し、リストにアクセスされるたびにCombineパブリッシャーを通じてUIに公開されます。高レベルでは、アクターのメソッドは以下を実行します:

- 新しいモデルを作成し、リストに追加し、APIリクエストが失敗した場合は新しく追加されたアイテムをリストから削除
- 既存のモデルをリストで更新し、APIリクエストが失敗した場合は更新をリストでリバート
- リストから既存のモデルを削除し、APIリクエストが失敗した場合はアイテムをリストに戻す

アクターオブジェクトを通じてこれらのメソッドを提供することで、基になるリストはシリアルでアクセスされるため、必要に応じて操作全体をロールバックできます。

オプティミスティックUI更新を可能にするアクターオブジェクトを作成するには、新しいファイルを作成して次のコードを追加します。

```swift
import Amplify
import SwiftUI
import Combine

actor RealEstatePropertyList {

    private var properties: [RealEstateProperty?] = [] {
        didSet {
            subject.send(properties.compactMap { $0 })
        }
    }

    private let subject = PassthroughSubject<[RealEstateProperty], Never>()
    var publisher: AnyPublisher<[RealEstateProperty], Never> {
        subject.eraseToAnyPublisher()
    }

    func listProperties() async throws {
        let result = try await Amplify.API.query(request: .list(RealEstateProperty.self))
        guard case .success(let propertyList) = result else {
            print("Failed with error: ", result)
            return
        }
        properties = propertyList.elements
    }
}
```

`listProperties()`メソッドを呼び出すと、Amplify Data APIでクエリが実行され、結果が`properties`プロパティに保存されます。このプロパティが設定されると、リストがサブスクライバーに送信されます。UIで、ビューモデルを作成して更新をサブスクライブします:

```swift
class RealEstatePropertyContainerViewModel: ObservableObject {
    @Published var properties: [RealEstateProperty] = []
    var sink: AnyCancellable?

    var propertyList = RealEstatePropertyList()
    init() {
        Task {
            sink = await propertyList.publisher
                .receive(on: DispatchQueue.main)
                .sink { properties in
                    print("Updating property list")
                    self.properties = properties
            }
        }
    }

    func loadList() {
        Task {
            try? await propertyList.listProperties()
        }
    }
}

struct RealEstatePropertyContainerView: View {
    @StateObject var vm = RealEstatePropertyContainerViewModel()
    @State private var propertyName: String = ""

    var body: some View {
        Text("Hello")
    }
}
```

## 新しく作成されたレコードをオプティミスティックにレンダリングする

Amplify Data APIから返された新しく作成されたレコードをオプティミスティックにレンダリングするには、`actor RealEstatePropertyList`にメソッドを追加します:

```swift
func createProperty(name: String, address: String? = nil) {
    let property = RealEstateProperty(name: name, address: address)
    // オプティミスティックに新しく作成されたプロパティを送信し、UIでレンダリング
    properties.append(property)

    Task {
        do {
            // プロパティレコードを作成
            let result = try await Amplify.API.mutate(request: .create(property))
            guard case .failure(let graphQLResponse) = result else {
                return
            }
            print("Failed with error: ", graphQLResponse)
            // 新しく作成されたプロパティを削除
            if let index = properties.firstIndex(where: { $0?.id == property.id }) {
                properties.remove(at: index)
            }
        } catch {
            print("Failed with error: ", error)
            // 新しく作成されたプロパティを削除
            if let index = properties.firstIndex(where: { $0?.id == property.id }) {
                properties.remove(at: index)
            }
        }
    }
}
```

## レコード更新をオプティミスティックにレンダリングする

単一のアイテムの更新をオプティミスティックにレンダリングするには、以下のようなコードスニペットを使用します:

```swift
func updateProperty(_ property: RealEstateProperty) async {
    guard let index = properties.firstIndex(where: { $0?.id == property.id }) else {
        print("No property to update")
        return
    }

    // オプティミスティックにプロパティを更新し、UIでレンダリング
    let rollbackProperty = properties[index]
    properties[index] = property

    do {
        // プロパティレコードを更新
        let result = try await Amplify.API.mutate(request: .update(property))
        guard case .failure(let graphQLResponse) = result else {
            return
        }
        print("Failed with error: ", graphQLResponse)
        properties[index] = rollbackProperty
    } catch {
        print("Failed with error: ", error)
        properties[index] = rollbackProperty
    }
}
```

## レコード削除をオプティミスティックにレンダリングする

Amplify Data API削除をオプティミスティックにレンダリングするには、以下のようなコードスニペットを使用します:

```swift
func deleteProperty(_ property: RealEstateProperty) async {
  guard let index = properties.firstIndex(where: { $0?.id == property.id }) else {
      print("No property to remove")
      return
  }

  // オプティミスティックにプロパティを削除し、UIでレンダリング
  let rollbackProperty = properties[index]
  properties[index] = nil

  do {
      // プロパティレコードを削除
      let result = try await Amplify.API.mutate(request: .delete(property))
      switch result {
      case .success:
          // 削除を確定
          properties.remove(at: index)
      case .failure(let graphQLResponse):
          print("Failed with error: ", graphQLResponse)
          // 削除を取り消し
          properties[index] = rollbackProperty
      }

  } catch {
      print("Failed with error: ", error)
      // 削除を取り消し
      properties[index] = rollbackProperty
  }
}
```

## 完全な例

#### [Main]

```swift
import SwiftUI
import Amplify
import AWSAPIPlugin

@main
struct OptimisticUIApp: App {

    init() {
        do {
            Amplify.Logging.logLevel = .verbose
            try Amplify.add(plugin: AWSAPIPlugin(modelRegistration: AmplifyModels()))
            try Amplify.configure(with: .amplifyOutputs)
            print("Amplify configured with API, Storage, and Auth plugins!")
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            RealEstatePropertyContainerView()
        }
    }
}

// モデルを拡張してSwiftUIの`ForEach`と互換性を持たせるためにIdentifiableに対応させる。
extension RealEstateProperty: Identifiable { }

struct TappedButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(10)
            .background(configuration.isPressed ? Color.teal.opacity(0.8) : Color.teal)
            .foregroundColor(.white)
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
```

#### [Actor]

```swift
actor RealEstatePropertyList {

    private var properties: [RealEstateProperty?] = [] {
        didSet {
            subject.send(properties.compactMap { $0 })
        }
    }

    private let subject = PassthroughSubject<[RealEstateProperty], Never>()
    var publisher: AnyPublisher<[RealEstateProperty], Never> {
        subject.eraseToAnyPublisher()
    }

    func listProperties() async throws {
        let result = try await Amplify.API.query(request: .list(RealEstateProperty.self))
        guard case .success(let propertyList) = result else {
            print("Failed with error: ", result)
            return
        }
        properties = propertyList.elements
    }

    func createProperty(name: String, address: String? = nil) {
        let property = RealEstateProperty(name: name, address: address)
        // オプティミスティックに新しく作成されたプロパティを送信し、UIでレンダリング
        properties.append(property)

        Task {
            do {
                // プロパティレコードを作成
                let result = try await Amplify.API.mutate(request: .create(property))
                guard case .failure(let graphQLResponse) = result else {
                    return
                }
                print("Failed with error: ", graphQLResponse)
                // 新しく作成されたプロパティを削除
                if let index = properties.firstIndex(where: { $0?.id == property.id }) {
                    properties.remove(at: index)
                }
            } catch {
                print("Failed with error: ", error)
                // 新しく作成されたプロパティを削除
                if let index = properties.firstIndex(where: { $0?.id == property.id }) {
                    properties.remove(at: index)
                }
            }
        }
    }

    func updateProperty(_ property: RealEstateProperty) async {
        guard let index = properties.firstIndex(where: { $0?.id == property.id }) else {
            print("No property to update")
            return
        }

        // オプティミスティックにプロパティを更新し、UIでレンダリング
        let rollbackProperty = properties[index]
        properties[index] = property

        do {
            // プロパティレコードを更新
            let result = try await Amplify.API.mutate(request: .update(property))
            guard case .failure(let graphQLResponse) = result else {
                return
            }
            print("Failed with error: ", graphQLResponse)
            properties[index] = rollbackProperty
        } catch {
            print("Failed with error: ", error)
            properties[index] = rollbackProperty
        }
    }

    func deleteProperty(_ property: RealEstateProperty) async {
        guard let index = properties.firstIndex(where: { $0?.id == property.id }) else {
            print("No property to remove")
            return
        }

        // オプティミスティックにプロパティを削除し、UIでレンダリング
        let rollbackProperty = properties[index]
        properties[index] = nil

        do {
            // プロパティレコードを削除
            let result = try await Amplify.API.mutate(request: .delete(property))
            switch result {
            case .success:
                // 削除を確定
                properties.remove(at: index)
            case .failure(let graphQLResponse):
                print("Failed with error: ", graphQLResponse)
                // 削除を取り消し
                properties[index] = rollbackProperty
            }

        } catch {
            print("Failed with error: ", error)
            // 削除を取り消し
            properties[index] = rollbackProperty
        }
    }
}

```

#### [View]

```swift
class RealEstatePropertyContainerViewModel: ObservableObject {
    @Published var properties: [RealEstateProperty] = []
    var sink: AnyCancellable?

    var propertyList = RealEstatePropertyList()
    init() {
        Task {
            sink = await propertyList.publisher
                .receive(on: DispatchQueue.main)
                .sink { properties in
                    print("Updating property list")
                    self.properties = properties
            }
        }
    }

    func loadList() {
        Task {
            try? await propertyList.listProperties()
        }
    }
    func createPropertyButtonTapped(name: String) {
        Task {
            await propertyList.createProperty(name: name)
        }
    }

    func updatePropertyButtonTapped(_ property: RealEstateProperty) {
        Task {
            await propertyList.updateProperty(property)
        }
    }

    func deletePropertyButtonTapped(_ property: RealEstateProperty) {
        Task {
            await propertyList.deleteProperty(property)
        }
    }
}

struct RealEstatePropertyContainerView: View {
    @StateObject var viewModel = RealEstatePropertyContainerViewModel()
    @State private var propertyName: String = ""

    var body: some View {
        VStack {
            ScrollView {
                LazyVStack(alignment: .leading) {
                    ForEach($viewModel.properties) { $property in
                        HStack {
                            TextField("Update property name", text: $property.name)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .multilineTextAlignment(.center)
                            Button("Update") {
                                viewModel.updatePropertyButtonTapped(property)
                            }
                            Button {
                                viewModel.deletePropertyButtonTapped(property)
                            } label: {
                                Image(systemName: "xmark")
                                    .foregroundColor(.red)
                            }

                        }.padding(.horizontal)
                    }
                }
            }.refreshable {
                viewModel.loadList()
            }
            TextField("New property name", text: $propertyName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .multilineTextAlignment(.center)

            Button("Save") {
                viewModel.createPropertyButtonTapped(name: propertyName)
                self.propertyName = ""
            }
            .buttonStyle(TappedButtonStyle())
        }.task {
            viewModel.loadList()
        }
    }
}

struct RealEstatePropertyContainerView_Previews: PreviewProvider {
    static var previews: some View {
        RealEstatePropertyContainerView()
    }
}
```

<!-- /Platform -->

サーバーでレンダリングされたページをうまく動作させるには、Amplify JS はクライアントのみの環境でどのように使用するかをわずかに変更する必要があります。

## 増幅する

### Enabling SSR

When using the Amplify CLI, the __aws-exports.js__ file gets created and updated automatically for you based upon the resources you have added and configured.

クライアントのみのアプリケーションの場合、 `Amplify.configure(awsExports)` がすべてです。

SSRサポートを有効にするには、 `ssr: true` も提供してください。

```js
import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });
```

`ssr: true`を提供することで Amplifyはクッキーでクライアントの資格情報を保持します。これにより、サーバーへの後続のリクエストがそれらにアクセスできるようになります。

> **Note**: Once [vercel/next.js#16977](https://github.com/vercel/next.js/issues/16977) is resolved, you can hoist `Amplify.configure` into **pages/_app.js**.  Until then, be sure that all **pages/*** run `Amplify.configure({ ...awsExports, ssr: true })`.


### withSSRContext

アプリケーションが `ssr: true`で設定されると、クライアント側の資格情報はクッキーを介してサーバーに渡されます。

`withSSRContext` ユーティリティは、これらのクッキーの資格情報を使用して、単一のリクエスト ( `req` ) にスコープされた`Amplify`のインスタンスを作成します。

ブラウザでレンダリングされたクライアント側のコードの場合、ページは通常どおりトップレベルのインポートを使用し続ける必要があります。

```js
import { Amplify, API } from "aws-amplify";
import awsExports from "../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });

export default function HomePage({ posts = [] }) {
  const [posts, setPosts] = useState(posts);

  useEffect(() => {
    // 👇 Notice how the client correctly uses the top-level `API` import
    API.graphql({ query: listPosts }).then(({ data }) => setPosts(data.listPosts.items));
  }, [])

  return ( ... );
}
```

サーバ上で `withSSRContext({ req?: ServerRequest }) を使用する`:

```js
import { Amplify, API, withSSRContext } from "aws-amplify";

export async function getServerSideProps({ req }) {
  // 👇 Notice how the server uses `API` from `withSSRContext`, instead of the top-level `API`.
  const SSR = withSSRContext({ req })
  const { data } = await SSR.API.graphql({ query: listPosts });

  return {
    props: {
      posts: data.listPosts.items
    }
  }
}
```

Server-side functions that _don't_ have a `req` object (e.g. Next.js' `getStaticProps` & `getStaticPaths`) should still use `withSSRContext()`.

## DataStore

### シリアライズ中

For Next.js, returned `props` from the server have to be valid JSON. Because `DataStore.query(Model)` returns _instances_ of `Model`, we need the `serializeModel` helper to convert it to JSON instead:

```js
import { serializeModel } from '@aws-amplify/datastore/ssr';
import { Amplify, withSSRContext } from "aws-amplify";

...

export async function getServerSideProps({ req }) {
    const SSR = withSSRContext({ req });
    const posts = await SSR.DataStore.query(Post);

    return {
        props: {
      // 👇 This converts Post instances into serialized JSON for the client
      posts: serializeModel(posts),
        },
    };
}
```

### デシリアライズ中

クライアント側のコードがサーバー側の props からのみ読み取り、これらのモデルの更新が行われない場合。 クライアント側のコードを変更する必要はありません

However, if you receive models from the server and need to `DataStore.delete(model)` or `DataStore.save(...)` changes to them, you'll need the `deserializeModel` utility to convert them from server-friendly JSON back into model _instances_:

```js
import { serializeModel } from '@aws-amplify/datastore/ssr';
import { Amplify, withSSRContext } from "aws-amplify";

import { Post } from "../src/models";

export default function HomePage(initialData) {
    // 👇 This converts the serialized JSON back into Post instances
    const [posts, setPosts] = useState(deserializeModel(Post, initialData.posts));

    ...
}
```


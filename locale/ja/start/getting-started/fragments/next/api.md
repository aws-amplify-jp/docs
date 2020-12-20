次へを作成して設定しました。 sアプリでAmplifyプロジェクトを初期化し、機能を追加できます。最初に追加する機能はAPIです。

Amplify CLIは、RESTとGraphQLの2種類のAPIの作成と操作をサポートしています。

この手順で作成するAPIは、AWS AppSync(管理されたGraphQLサービス)を使用したGraphQL APIであり、データベースはAmazon DynamoDB(NoSQLデータベース)になります。

## GraphQL API とデータベースの作成

[GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/designing-a-graphql-api.html) をアプリケーションに追加し、アプリケーションディレクトリのルートから次のコマンドを実行して自動的にデータベースをプロビジョニングします。

```bash
増幅して api を追加
```

以下の明示的な値を選択して、 **IAM** (パブリックリードアクセス用) と **Cognito User Pools** (認証済みアクセス用) を有効にします。

```console
? Please select from one of the below mentioned services:
# GraphQL
? Provide API name:
# nextamplified
? Choose the default authorization type for the API:
# API key
? Enter a description for the API key:
#
? After how many days from now the API key should expire (1-365):
# 7
? Do you want to configure advanced settings for the GraphQL API?
#  Yes, I want to make some additional changes.
? Configure additional auth types?
# Yes
? Choose the additional authorization types you want to configure for the API:
# Amazon Cognito User Pool
? Do you want to use the default authentication and security configuration?
# Default configuration
? How do you want users to be able to sign in?
# Username
? Do you want to configure advanced settings?
# No, I am done.
? Configure conflict detection?
# No
? Do you have an annotated GraphQL schema?
# No
? Choose a schema template:
# Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now?
# Yes
```

CLI がテキストエディタでこの GraphQL スキーマを開く必要があります。

__anplify/backend/api/myapi/schema.graphql__

```graphql
type Post
@model
@auth(rules: [{ allow: owner }, { allow: public, operations: [read] }]) {
  id: ID!
  title: String!
  content: String!
}
```

The schema generated is for a blog app. You'll notice a directive on the `Post` type of `@model`. This directive is part of the [GraphQL transform](~/cli/graphql-transformer/model.md) library of Amplify.

GraphQL Transform ライブラリには、データモデルの定義などを行うためのスキーマで使用できるカスタムディレクティブが用意されています。 認証と認可ルールの設定、サーバレス機能をリゾルバとして設定するなど。

`@model` ディレクティブで装飾された型は、タイプ (ホストテーブル) のデータベーステーブルを足場に置きます。 CRUD (作成、読み取り、更新、削除)およびリスト操作のためのスキーマ、およびすべてを一緒に動作させるために必要な GraphQL リゾルバ。

コマンドラインから __を押して__ を入力し、スキーマを受け入れ、次のステップに進みます。

### API のデプロイ

このバックエンドをデプロイするには、 `push` コマンドを実行します。

```bash
push を増幅する
```

```console
Current Environment: dev

| Category | Resource name         | Operation | Provider plugin   |
| -------- | --------------------- | --------- | ----------------- |
| Auth     | nextamplifiedXXXXXXX  | Create    | awscloudformation |
| Api      | nextamplified         | Create    | awscloudformation |
? Are you sure you want to continue? Y

# You will be walked through the following questions for GraphQL code generation
? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Y
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

APIが稼働しているので、対話を始めることができます。

デプロイした API には、投稿の作成、読み取り、更新、削除、リスティングの操作が含まれます。

次に、Amplifyの状態を確認するために次のコマンドを実行します。

```bash
増幅の状態
```

これにより、現在の環境を含むAmplifyプロジェクトの現在のステータスが得られます。 どのカテゴリーが作成されているかを調べることができます 以下のようになります。

```console
現在の環境: dev

| Resource name | Operation | Provider プラグイン |
| ------------------------------ | ------------------------ |
| 認証 | nextampedXXXXXXXX | 変更なし | awscloudforming |
| Api | nextamplified | No Change | awscloudforming |
```

AppSync コンソールで GraphQL API をいつでも表示するには、次のコマンドを実行します。

```bash
コンソールの api を増幅する
```

Amplifyコンソールでいつでもアプリ全体を表示するには、次のコマンドを実行します。

```bash
増幅コンソール
```

### (オプション) API のテスト

ローカルでテストするには、 `モック` コマンドを実行します。

> 先に進んでフロントエンドを接続したい場合は、 [次のステップ](#connect-frontend-to-api)にジャンプできます。

```bash
amplifyモックapiは
```

*注意:* `はモックAPIを増幅する` にはJavaが必要です。

```console
# If you have not already deployed you API, you will be walked through the following steps for GraphQL code generation
? Choose the code generation language target: javascript (or preferred target)
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
```

これにより、GraphiQL エクスプローラがローカルポート上で開きます。テスト環境では、クエリや変更など、さまざまな操作をローカルで試すことができます。

GraphiQL ツールバーで __Use: User Pool__ を選択し、投稿を作成してみてください:

```graphql
mutation CreatePost {
  createPost(input: {title: "Test Post", content: "post content"}) {
    id
    owner
    title
    updatedAt
    createdAt
    content
  }
}
```

次に、認証を __に更新します。使用: API キー__ を使用して、投稿の一覧に問い合わせてみてください。

```graphql
query ListPosts {
  listPosts {
    items {
      content
      createdA
      id
      owner
      title
    }
  }
}
```

## サーバーサイドレンダリング（SSR）を使用したAPI

このセクションでは、Next.jsアプリケーションから投稿を一覧表示および作成する方法を作成します。 これを行うには fetch & サーバーから最新の投稿をレンダリングし、クライアントに新しい投稿を作成します。

__pages/index.js__ を開き、次のコードで置き換えます。

```jsx
// pages/index.js
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";
import Head from "next/head";
import awsExports from "../src/aws-exports";
import { createPost } from "../src/graphql/mutations";
import { listPosts } from "../src/graphql/queries";
import styles from "../styles/Home.module.css";

Amplify.configure({ ...awsExports, ssr: true });

export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listPosts });

  return {
    props: {
      posts: response.data.listPosts.items,
    },
  };
}

async function handleCreatePost(event) {
  event.preventDefault();

  const form = new FormData(event.target);

  try {
    const { data } = await API.graphql({
      authMode: "AMAZON_COGNITO_USER_POOLS",
      query: createPost,
      variables: {
        input: {
          title: form.get("title"),
          content: form.get("content"),
        },
      },
    });

    window.location.href = `/posts/${data.createPost.id}`;
  } catch ({ errors }) {
    console.error(...errors);
    throw new Error(errors[0].message);
  }
}

export default function Home({ posts = [] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify + Next.js</h1>

        <p className={styles.description}>
          <code className={styles.code}>{posts.length}</code>
          posts
        </p>

        <div className={styles.grid}>
          {posts.map((post) => (
            <a className={styles.card} href={`/posts/${post.id}`} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}

          <div className={styles.card}>
            <h3 className={styles.title}>New Post</h3>

            <AmplifyAuthenticator>
              <form onSubmit={handleCreatePost}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js!"
                    name="content"
                  />
                </fieldset>

                <button>Create Post</button>
                <button onClick={() => Auth.signOut()}>Sign out</button>
              </form>
            </AmplifyAuthenticator>
          </div>
        </div>
      </main>
    </div>
  );
}
```

いくつかのファイルを見てみましょう:

- __Amplify.configure__ – For authenticated requests to work on the server, our client has to be configured with `ssr: true` to make credentials available on subsequent requests.

- __getServerSideProps__ – For each request (`req`) on the server, we create a copy of Amplify (called `SSR` here from `withSSRContext({ req })`) that scopes credentials, data, and storage to _just one_ request. `API.graphql` queries for a list of posts, and returns them as the `posts` prop for the `Home` component.

- __handleCreatePost__ – This function is called when a logged-in user submits our "New Post" form. `API.graphql` is called to create the new post's `title` and `content`. Once created, we redirect to `/posts/${post.id}`. Notice that we explicitly set `authMode` to `AMAZON_COGNITO_USER_POOLS`. This is because our `schema.graphql` explicitly requires an authorized user to create/delete/update our __Post__ model. Based on our configuration when we ran `amplify add api`, this value is defaulting to `API_KEY`.

- __ホーム__ – _getServerSideProps_ が提供する `posts` をレンダリングする `関数型コンポーネント` です。

## SSRのテスト

次に、アプリを起動すると、 `0 0 個の投稿` があるランディングページにログイン画面が表示されます。

```bash
npm run dev
```

アカウントを作成してログインすると、 __New Post__ フォームが表示されます。

新しい投稿を作成するためにフォームを送信してください。次にそのページを作成します！

## Incremental Static Site Generation (SSG) を使用した API

ビルドプロセス中に静的にページを生成することでパフォーマンスが向上します。ただし、動的に作成された投稿は `404`ではありません。

これを解決するには、 __pages/posts/[id].js__ を作成し、次の内容に貼り付けてください:

```jsx
import { Amplify, API, withSSRContext } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import awsExports from "../../src/aws-exports";
import { deletePost } from "../../src/graphql/mutations";
import { getPost, listPosts } from "../../src/graphql/queries";
import styles from "../../styles/Home.module.css";

Amplify.configure({ ...awsExports, ssr: true });

export async function getStaticPaths() {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({ query: listPosts });
  const paths = data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return {
    fallback: true,
    paths,
  };
}

export async function getStaticProps({ params }) {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      post: data.getPost,
    },
  };
}

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    );
  }

  async function handleDelete() {
    try {
      await API.graphql({
        authMode: "AMAZON_COGNITO_USER_POOLS",
        query: deletePost,
        variables: {
          input: { id: post.id },
        },
      });

      window.location.href = "/";
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} – Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{post.title}</h1>

        <p className={styles.description}>{post.content}</p>
      </main>

      <footer className={styles.footer}>
        <button onClick={handleDelete}>💥 Delete post</button>
      </footer>
    </div>
  );
}
```

いくつかのファイルを見てみましょう:

- __Amplify.configure__ – For authenticated requests to work on the server, our client has to be configured with `ssr: true` to make credentials available on subsequent requests.

- __getStaticPaths__ – Because the value of `[id]` isn't known at build-time, we need to provide all possible `paths` for Next.js to render pages for. We do this by querying all posts with `API.graphql`, and mapping each `post` into `{ params: { id: post.id }}`.  These `params` are passed to `getStaticProps` next.  Note that we return `fallback: true`.  If this value were `false`, then any _new_ posts would return a `404` because they didn't exist at build-time. With `true`, static pages are returned quickly, while any new `id`s are looked up once.

- __getStaticProps__ – Because the `Post` components props aren't dynamic per-request, they're provided statically from `getStaticPaths` as `params`.  Here, we use `params.id` to query for that specific post with `API.graphql`.

- __Post__ – `Post` is a functional component that renders the provided prop `post`. Because `fallback: true` was specified above, we have to account for a "loading" state while a new post may be fetched.

- __handleDelete__ – This function is called when the "Delete post" button is clicked. Notice that we explicitly set `authMode` to `AMAZON_COGNITO_USER_POOLS`. This is because our `schema.graphql` explicitly requires an authorized user to create/delete/update our __Post__ model. Based on our configuration when we ran `amplify add api`, this value is defaulting to `API_KEY`.

 For each request (`req`) on the server, we create a copy of Amplify (called `SSR` here from `withSSRContext({ req })`) that scopes credentials, data, and storage to _just one_ request. `API.graphql` queries for a list of posts, and returns them as the `posts` prop for the `Home` component.

- __handleCreatePost__ – This function is called when a logged-in user submits our "New Post" form. `API.graphql` is called to create the new post's `title` and `content`. Once created, we redirect to `/posts/${post.id}`.

- __ホーム__ – _getServerSideProps_ が提供する `posts` をレンダリングする `関数型コンポーネント` です。

## SSGのテスト

サーバーが稼働している場合 (`npm run dev`) ページを更新する（または http://localhost:3000/ に戻って投稿をクリックしてください）。この投稿のページが表示されます！

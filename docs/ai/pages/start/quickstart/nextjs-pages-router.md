---
title: "Next.js Pages Router"
section: "start/quickstart"
platforms: ["nextjs"]
gen: 2
last-updated: "2024-11-12T21:56:50.000Z"
url: "https://docs.amplify.aws/react/start/quickstart/nextjs-pages-router/"
---

## 前提条件

このクイックスタートガイドでは、TypeScript、Next.js **Pages Router with Client Components**、および React を使用してタスクリストアプリケーションを構築する方法を説明します。開始する前に、次のものをインストールしていることを確認してください。

- [Node.js](https://nodejs.org/) v14.x 以降
- [npm](https://www.npmjs.com/) v6.14.4 以降
- [git](https://git-scm.com/) v2.14.1 以降
- これらのテクノロジーが初めての場合は、公式の [React](https://react.dev/learn/tutorial-tic-tac-toe)、[Next.js](https://nextjs.org/docs/pages/getting-started)、および [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) のチュートリアルを先に確認することをお勧めします。

## フルスタックアプリを AWS にデプロイする

スターターの「To-do」アプリケーションを作成しました。これにより、より迅速に開始できます。まず、スターター Next (Pages) テンプレートを使用して、GitHub アカウントにリポジトリを作成します。

### 1. リポジトリを作成する

スターターテンプレートを使用して、GitHub アカウントにリポジトリを作成します。このテンプレートは、Amplify バックエンド機能を備えた `create-next-app` をスキャフォルドします。

<ExternalLinkButton
  size="medium"
  href='https://github.com/new?template_name=amplify-next-pages-template&template_owner=aws-samples&name=amplify-next-pages-template&description=My%20Amplify%20Gen%202%20starter%20application'
>
<IconGithub />
テンプレートからリポジトリを作成
</ExternalLinkButton>

GitHub のフォームを使用してリポジトリの作成を完了します。

### 2. スターターアプリをデプロイする

リポジトリが作成されたので、Amplify でデプロイします。

<ExternalLinkButton
  size="medium"
  variation="primary"
  href='https://console.aws.amazon.com/amplify/create/repo-branch'
>
<IconAmplify />
AWS にデプロイ
</ExternalLinkButton>

**既存のアプリで開始** > **GitHub** を選択します。ポップアップウィンドウを通じて Amplify に GitHub アカウントへのアクセスを許可した後、リポジトリと `main` ブランチを選択してデプロイします。その他の変更は行わず、**保存してデプロイ** までフローをクリックしてください。

### 3. デプロイされたアプリを表示する

<Accordion title='プロジェクト構造について詳しく知る' headingLevel='4' eyebrow='アプリがデプロイされるのを待っている間（約 5 分）'>

このスターターリポジトリのプロジェクト構造を GitHub で開いて見てみましょう。スターターアプリケーションにはタスクリストアプリケーション用の事前に作成されたコードがあります。すべてのタスクリストアイテムのフィードと新しいアイテムを追加する機能を備えたリアルタイムデータベースを提供します。

```text
├── amplify/ # Amplify バックエンド設定を含むフォルダ
│   ├── auth/ # auth バックエンドの定義
│   │   └── resource.tsx
│   ├── data/ # data バックエンドの定義
│   │   └── resource.ts
|   ├── backend.ts
│   └── tsconfig.json
├── src/ # React UI コード
│   ├── App.tsx # Todo をリアルタイムで同期する UI コード
│   ├── index.css # アプリのスタイル設定
│   └── main.tsx # Amplify クライアントライブラリのエントリーポイント
├── package.json
└── tsconfig.json
```
</details>

ビルドが完了したら、「デプロイされた URL を表示」を選択して、新しくデプロイされたブランチにアクセスしてください。ビルドが API、データベース、および認証バックエンドをデプロイしたため、新しいタスク項目を作成できます。

Amplify コンソールで、デプロイメントブランチ（この場合は **main**）をクリックして、左側のメニューで **Data** を選択し、**Data manager** を選択して、データベースに入力されたデータを確認します。

## フロントエンドの更新

タスクリストアイテムの削除フローを作成することで、アプリケーション機能を拡張する方法を学びます。

### 4. ローカル環境をセットアップする

ここで、フロントエンドに機能を追加するためにローカル開発環境をセットアップします。デプロイされたブランチをクリックすると、ビルド履歴とデプロイ済みバックエンドリソースのリストを示す **Deployments** ページに移動します。

ページの下部に、**Deployed backend resources** タブが表示されます。タブをクリックして、**Download amplify_outputs.json file** ボタンをクリックします。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)

リポジトリをローカルにクローンします。

```bash title="Terminal" showLineNumbers={false}
git clone https://github.com/<github-user>/amplify-next-template.git
cd amplify-next-template && npm install
```

ダウンロードした `amplify_outputs.json` ファイルをプロジェクトのルートに移動します。

```text
├── amplify
├── src
├── amplify_outputs.json <== バックエンド出力ファイル
├── package.json
└── tsconfig.json
```

<Accordion title='amplify_outputs.json' headingLevel='4' eyebrow='詳細はこちら'>
**amplify_outputs.json** ファイルには、バックエンドエンドポイント情報、公開されている API キー、認証フロー情報などが含まれています。Amplify クライアントライブラリはこの出力ファイルを使用して Amplify バックエンドに接続します。`main.tsx` ファイル内でこの出力ファイルがどのようにインポートされるかを確認し、Amplify クライアントライブラリの `Amplify.configure(...)` 関数に渡されるかを確認できます。
</details>

### 5. 削除機能を実装する

**pages/index.tsx** ファイルに移動して、新しい `deleteTodo` 機能を追加し、`<li>` 要素の `onClick` ハンドラーに関数を渡します。

```tsx title="pages/index.tsx"
function App() {
  // ...
  // highlight-start
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  // highlight-end

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map(todo => <li
          // highlight-next-line
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          {todo.content}
        </li>)}
      </ul> 
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-pages-router/">このチュートリアルの次のステップを確認してください。</a>
      </div>
    </main>
  )
}
```
<details><summary>amplify/data/resources.ts 全体を表示する</summary>

テキストエディタで `amplify/data/resource.ts` ファイルを開くと、デフォルトで生成されたデータモデルが表示されます。

```ts showLineNumbers title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string()
    })
    .authorization(allow => [allow.owner(), allow.publicApiKey().to(['read'])])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for allow.publicApiKey() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
```

Amplify によって生成されたスキーマはタスクアプリ用です。スキーマはアプリケーションのデータがどのように構成されるかのブループリントです。スキーマ内で、データベーステーブル（上記のコードの `Todo`）に対応するモデルを定義します。最後に、各データインスタンスが持つ属性であるフィールドを定義します。生成されたコードでは、フィールドは `content` です。各フィールドに型が付与されます。上記の例では、`content` フィールドが文字列であることを述べています。
</details>

ローカル開発サーバーを起動して、削除機能をテストしてください：

```bash title="Terminal" showLineNumbers={false}
npm run dev
```

これにより、http://localhost:3000 でローカル開発サーバーが起動します。

### 6. ログイン UI を実装する

スターターアプリケーションは既に **amplify/auth/resource.ts** ファイルで事前に設定された auth バックエンドを持っています。メールとパスワードのログインをサポートするように設定していますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を最速で実行するには、Authenticator UI コンポーネントを使用します。**pages/_app.tsx** ファイルで、Authenticator UI コンポーネントをインポートして `<App>` コンポーネントをラップします。

```tsx title="pages/_app.tsx"
import type { AppProps } from "next/app";
// highlight-start
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
// highlight-end
import "@/styles/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return(
    // highlight-start
    <Authenticator>
      <Component {...pageProps} />;
    </Authenticator>
    // highlight-end
  ) 
}
```
<details><summary>amplify/auth/resources.ts 全体を表示する</summary>

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

/**
 * auth リソースを定義・設定する
 * データと一緒に使用される場合、自動的にデータの auth プロバイダーとして設定されます
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    // ソーシャルプロバイダーを追加
    externalProviders: {
      /**
       * まず、`ampx sandbox secret` を使用してシークレットを作成します
       * その後、`@aws-amplify/backend` から `secret` をインポートします
       * @see https://docs.amplify.aws/gen2/deploy-and-host/sandbox-environments/features/#setting-secrets
       */
      // loginWithAmazon: {
      //   clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
      //   clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
      // }
    }
  },
  /**
   * 多要素認証を有効にする
   * @see https://docs.amplify.aws/gen2/build-a-backend/auth/manage-mfa
   */
  // multifactor: {
  //   mode: 'OPTIONAL',
  //   sms: {
  //     smsMessage: (code) => `Your verification code is ${code}`,
  //   },
  // },
  userAttributes: {
    /** アプリケーションのユーザー向けに追加の属性をリクエストします */
    // profilePicture: {
    //   mutable: true,
    //   required: false,
    // },
  }
});
```
</details>

Authenticator コンポーネントは auth バックエンド設定を自動検出し、auth バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

**pages/index.tsx** ファイルで、ユーザーがアプリケーションをサインアウトできるようにボタンを追加します。Amplify UI ライブラリから [`useAuthenticator`](https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced#access-auth-state) フックをインポートして、Authenticator の状態をフックします。

```tsx title="pages/index.tsx"
import type { Schema } from "@/amplify/data/resource";
// highlight-next-line
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function HomePage() {

  // highlight-start
  const { signOut } = useAuthenticator();
  // highlight-end

  // ...

  return (
    <main>
      {/* ... */}
      // highlight-next-line
      <button onClick={signOut}>サインアウト</button>
    </main>
  );
}
```

localhost 環境でアプリケーションをもう一度試してください。ログイン体験が表示されるようになりました。

これらの変更をクラウドに取得するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "authenticator を追加"
git push
```

Amplify は git コミットに基づいてアプリの最新バージョンを自動的にデプロイします。数分でアプリケーションが再構築されると、ホストされたアプリが削除機能をサポートするように更新されます。

## バックエンドの更新

バックエンドを更新して、ユーザーごとの認可ルールを実装し、各ユーザーが自分のタスクのみにアクセスできるようにします。

### 7. ローカル AWS 認証情報をセットアップする

バックエンドを更新するには、ローカルマシンからバックエンド更新をデプロイするための AWS 認証情報が必要です。

**ステップ 8 に進む** には、ローカルマシンに AWS 認証情報プロファイルがあり、AWS プロファイルが `AmplifyBackendDeployFullAccess` アクセス許可ポリシーを持っている場合。

それ以外の場合は、**[ローカル AWS 認証情報をセットアップ](/[platform]/start/account-setup/)** して、ローカルマシンからバックエンド更新をデプロイするための Amplify アクセス許可を付与します。

### 8. クラウドサンドボックスをデプロイする

本番ブランチに影響を与えずにバックエンドを更新するには、Amplify のクラウドサンドボックスを使用します。この機能は、チーム内の各開発者用の個別のバックエンド環境を提供し、ローカル開発とテストに最適です。

クラウドサンドボックスを開始するには、**新しいターミナルウィンドウ** で次のコマンドを実行します。

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

クラウドサンドボックスが完全にデプロイされると（約 5 分）、`amplify_outputs.json` ファイルが新しい分離された認証とデータバックエンドへの接続情報で更新されます。

> **Info:** `npx ampx sandbox` コマンドは `npm run dev` と同時に実行する必要があります。クラウドサンドボックスはアプリケーションバックエンドの「localhost 相当」と考えることができます。

### 9. ユーザーごとの認可を実装する

スターター内のタスク項目は現在すべてのユーザー間で共有されていますが、ほとんどの場合、データはユーザーごとに隔離されます。

データをユーザーごとに隔離するには、「所有者ベースの認可ルール」を使用できます。所有者ベースの認可ルールをタスク項目に適用しましょう。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    // highlight-next-line
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // これにより、アプリケーション内のデータクライアント（generateClient()）
    // にユーザー認証トークンで API リクエストに署名するように指示します。
    // highlight-next-line
    defaultAuthorizationMode: 'userPool',
  },
});
```

アプリケーションクライアントコードでは、異なるユーザーを区別するためにログイン後にユーザー名をレンダリングすることもできます。**pages/index.tsx** ファイルに移動して、`useAuthenticator` フックから `user` プロパティをレンダリングします。

```tsx title="pages/index.tsx"
// ... imports

function HomePage() {
  // highlight-next-line
  const { user, signOut } = useAuthenticator();

  // ...

  return (
    <main>
      // highlight-next-line
      <h1>{user?.signInDetails?.loginId} のタスク</h1>
      {/* ... */}
    </main>
  )
}
```

これでローカルアプリケーションに戻り、タスク項目のユーザー隔離をテストします。

本番バックエンドではなくクラウドサンドボックスで作業しているため、新しいユーザーに再度サインアップする必要があります。

これらの変更をクラウドに取得するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "ユーザーごとのデータ隔離を追加"
git push
```

Amplify コンソールでビルドが完了すると、`main` バックエンドがクラウドサンドボックス内で行われた変更をサポートするように更新されます。クラウドサンドボックス内のデータは完全に隔離されており、本番データベースを汚染しません。

## 🥳 成功

これで完了です！AWS Amplify でフルスタックアプリケーションを構築しました。Amplify の使用方法の詳細については、[Amplify の仕組みについての概念ガイド](/[platform]/how-amplify-works/concepts/)を参照してください。

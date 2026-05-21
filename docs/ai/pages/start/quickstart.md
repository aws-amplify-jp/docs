---
title: "クイックスタート"
section: "start"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-11-13T16:29:27.000Z"
url: "https://docs.amplify.aws/react/start/quickstart/"
---

<!-- Platform: javascript -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：

1. Vite を使用した Vanilla JavaScript アプリをデプロイする
2. リアルタイムデータ更新を備えたデータベースを構築して接続する
3. 認証と認可ルールを設定する

## プロジェクトの作成

以下のコマンドを使用して vite で新しい Vanilla JavaScript アプリを作成し、アプリのディレクトリ（`amplify-js-app`）とファイルを作成します。

```bash
npm create vite@latest
✔ Project name: amplify-js-app
✔ Select a framework: › Vanilla
✔ Select a variant: › TypeScript
```

npm を初期化し、依存関係と開発用依存関係をインストールします。
```bash
cd amplify-js-app
npm install
npm run dev
```

これにより開発サーバーが起動し、ビルドによって生成された出力を確認できます。[http://localhost:5173](http://localhost:5173) にアクセスすることで実行中のアプリを確認できます。

`index.html` ファイルに以下を追加します：

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
</head>
<body>
    <main>
        <h1>My todos</h1>
        <button id="addTodo">+ new</button>
        <ul id="todoList"></ul>
        <div>
            Try creating a new todo.
            <br>
            <a href="https://docs.amplify.aws/javascript/start/quickstart/">
                Review next step of this tutorial.
            </a>
        </div>
    </main>
    <script type="module" src="src/main.ts"></script>
</body>
</html>
```

`style.css` ファイルに以下を追加します：

```css title="style.css"
body {
  margin: 0;
  background: linear-gradient(180deg, rgb(117, 81, 194), rgb(255, 255, 255));
  display: flex;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  color: white;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

ul {
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  border: 1px solid black;
  gap: 1px;
  background-color: black;
  border-radius: 8px;
  overflow: auto;
}

li {
  background-color: white;
  padding: 8px;
}

li:hover {
  background: #dadbf9;
}

a {
  font-weight: 800;
  text-decoration: none;
}
```

`main.js` のボイラープレートコードを削除して空にします。その後、ブラウザを更新して変更を確認します。

## バックエンドの作成

AWS Amplify を始める最も簡単な方法は、`create-amplify` コマンドを使用して npm 経由で行うことです。ベースプロジェクトディレクトリから実行できます。

```bash title="Terminal" showLineNumbers={false}
npm create amplify@latest
? Where should we create your project? (.) # press enter
```

このコマンドを実行すると、現在のプロジェクトに Amplify バックエンドファイルが以下のファイル構成でscaffold されます：

```text
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── index.html
├── style.css
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

### ローカル AWS 認証情報のセットアップ

バックエンドの更新を行うには、ローカルマシンからバックエンドの更新をデプロイするための AWS 認証情報が必要です。

ローカルマシンに `AmplifyBackendDeployFullAccess` 権限ポリシーを持つ AWS プロファイルと認証情報がすでにある場合は、**ステップ 8 にスキップしてください**。

それ以外の場合は、ローカルマシンからバックエンドの更新をデプロイする Amplify 権限を付与する **[ローカル AWS 認証情報のセットアップ](/[platform]/start/account-setup/)** を行ってください。

### クラウドサンドボックスのデプロイ

バックエンドをデプロイするには、Amplify の開発者ごとのクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。サンドボックス環境でアプリケーションを実行するには、以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

サンドボックス環境がデプロイされると、GraphQL API、データベース、および認証サービスが作成されます。デプロイされたすべてのリソースは `amplify_outputs.json` で利用できるようになります。

## フロントエンドをバックエンドに接続する

初期のscaffoldには、`amplify/data/resource.ts` ファイルに定義された事前設定済みのデータバックエンドがすでにあります。デフォルトの例では、`content` フィールドを持つ Todo モデルが作成されます。main.js ファイルを更新して、新しい To-do アイテムを作成します。

```typescript title="src/main.ts"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import './style.css';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

document.addEventListener("DOMContentLoaded", function () {
    const todos: Array<Schema["Todo"]["type"]> = [];
    const todoList = document.getElementById("todoList") as HTMLUListElement;
    const addTodoButton = document.getElementById("addTodo") as HTMLButtonElement;

    addTodoButton.addEventListener("click", createTodo);

    function updateUI() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.content ?? '';
            todoList.appendChild(li);
        });
    }

    function createTodo() {
      console.log('createTodo');
      const content = window.prompt("Todo content");
      if (content) {
          client.models.Todo.create({ content }).then(response => {
              if (response.data && !response.errors) {
                  todos.push(response.data);
                  updateUI();
              } else {
                  console.error('Error creating todo:', response.errors);
                  alert('Failed to create todo.');
              }
          }).catch(error => {
              console.error('Network or other error:', error);
              alert('Failed to create todo due to a network or other error.');
          });
      }
  }

    client.models.Todo.observeQuery().subscribe({
        next: (data) => {
            todos.splice(0, todos.length, ...data.items);
            updateUI();
        }
    });
});
```
<!-- /Platform -->

<!-- Platform: react -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：

1. React と Vite のアプリをデプロイする
2. リアルタイムデータ更新を備えたデータベースを構築して接続する
3. 認証と認可ルールを設定する

## フルスタックアプリを AWS にデプロイする

より素早く始めるための "To-do" スターターアプリケーションを用意しました。まず、スターター React テンプレートを使用して GitHub アカウントにリポジトリを作成します。

### 1. リポジトリの作成

スターターテンプレートを使用して GitHub アカウントにリポジトリを作成します。このテンプレートは Amplify バックエンド機能を備えた `create-vite-app` をscaffold します。

<ExternalLinkButton
  size="medium"
  href='https://github.com/new?template_name=amplify-vite-react-template&template_owner=aws-samples&name=amplify-vite-react-template&description=My%20Amplify%20Gen%202%20starter%20application'
>
<IconGithub />
テンプレートからリポジトリを作成
</ExternalLinkButton>

GitHub のフォームを使用してリポジトリの作成を完了します。

### 2. スターターアプリのデプロイ

リポジトリが作成されたので、Amplify でデプロイします。

<ExternalLinkButton
  size="medium"
  variation="primary"
  href='https://console.aws.amazon.com/amplify/create/repo-branch'
>
<IconAmplify />
AWS にデプロイ
</ExternalLinkButton>

**GitHub** を選択します。ポップアップウィンドウで Amplify に GitHub アカウントへのアクセスを許可した後、リポジトリと `main` ブランチを選択してデプロイします。他の変更は行わず、フローを進めて **Save and deploy** をクリックします。

### 3. デプロイされたアプリの確認

<Accordion title='プロジェクト構造について学ぶ' headingLevel='4' eyebrow='アプリのデプロイを待つ間（約5分）'>

GitHub でスターターリポジトリを開いて、プロジェクト構造を見てみましょう。スターターアプリケーションには To-do リストアプリのコードがあらかじめ記述されています。すべての To-do リストアイテムのリアルタイムデータベースフィードと新しいアイテムを追加する機能が提供されます。

```text
├── amplify/ # Folder containing your Amplify backend configuration
│   ├── auth/ # Definition for your auth backend
│   │   └── resource.tsx
│   ├── data/ # Definition for your data backend
│   │   └── resource.ts
|   ├── backend.ts
│   └── tsconfig.json
├── src/ # React UI code
│   ├── App.tsx # UI code to sync todos in real-time
│   ├── index.css # Styling for your app
│   └── main.tsx # Entrypoint of the Amplify client library
├── package.json
└── tsconfig.json
```
</details>

ビルドが完了したら、「Visit deployed URL」を選択して新しくデプロイされたブランチにアクセスします。ビルドで API、データベース、および認証バックエンドがデプロイされているため、新しい To-do アイテムを作成できます。

Amplify コンソールで、デプロイブランチ（この場合は **main**）をクリック > 左側メニューの **Data** を選択 > **Data manager** でデータベースに入力されたデータを確認します。

## フロントエンドの更新

To-do リストアイテムの削除フローを作成してアプリの機能を強化する方法を学びましょう。

### 4. ローカル環境のセットアップ

フロントエンドに機能を追加するために、ローカル開発環境をセットアップしましょう。デプロイされたブランチをクリックすると、ビルド履歴とデプロイされたバックエンドリソースのリストが表示される **Deployments** ページに移動します。

ページ下部に **Deployed backend resources** タブがあります。タブをクリックし、**Download amplify_outputs.json file** ボタンをクリックします。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)

リポジトリをローカルにクローンします。

```bash title="Terminal" showLineNumbers={false}
git clone https://github.com/<github-user>/amplify-vite-react-template.git
cd amplify-vite-react-template && npm install
```

上でダウンロードした `amplify_outputs.json` ファイルをプロジェクトのルートに移動します。

```text
├── amplify
├── src
├── amplify_outputs.json <== backend outputs file
├── package.json
└── tsconfig.json
```

<Accordion title='amplify_outputs.json' headingLevel='4' eyebrow='詳細を見る'>
**amplify_outputs.json** ファイルにはバックエンドエンドポイント情報、公開可能な API キー、認証フロー情報などが含まれています。Amplify クライアントライブラリはこの outputs ファイルを使用して Amplify バックエンドに接続します。`main.tsx` ファイル内で outputs ファイルがどのようにインポートされ、Amplify クライアントライブラリの `Amplify.configure(...)` 関数に渡されているかを確認できます。
</details>

### 5. 削除機能の実装

**src/App.tsx** ファイルに新しい `deleteTodo` 機能を追加し、`<li>` 要素の `onClick` ハンドラに関数を渡します。

```tsx title="src/App.tsx"
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
        <a href="https://docs.amplify.aws/react/start/quickstart/">Review next step of this tutorial.</a>
      </div>
    </main>
  )
}
```

ローカル開発サーバーを起動して削除機能を試してみましょう：

```bash title="Terminal" showLineNumbers={false}
npm run dev
```

これにより http://localhost:5173 でローカル開発サーバーが起動します。

### 6. ログイン UI の実装

スターターアプリケーションには、**amplify/auth/resource.ts** ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。**src/main.tsx** ファイルで、Authenticator UI コンポーネントをインポートし、`<App>` コンポーネントをラップします。

```tsx title="src/main.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
// highlight-next-line
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import App from './App.tsx';
import outputs from '../amplify_outputs.json';
import './index.css';
// highlight-next-line
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // highlight-start
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
  // highlight-end
);
```

Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

`src/App.tsx` ファイルに、ユーザーがアプリケーションからサインアウトできるボタンを追加します。Amplify UI ライブラリの [`useAuthenticator`](https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced#access-auth-state) フックをインポートして、Authenticator の状態にフックします。

```tsx title="src/App.tsx"
import type { Schema } from '../amplify/data/resource';
// highlight-next-line
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

function App() {
  // highlight-next-line
  const { signOut } = useAuthenticator();

  // ...

  return (
    <main>
      {/* ... */}
      // highlight-next-line
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
```

localhost 環境でアプリケーションを再度試してみましょう。ログイン体験が表示されるはずです。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added authenticator"
git push
```

Amplify は git コミットに基づいてアプリの最新バージョンを自動的にデプロイします。数分後、アプリケーションがリビルドされると、ホストされているアプリが削除機能をサポートするように更新されます。

## バックエンドの更新

各ユーザーが自分の To-do のみにアクセスできるよう、ユーザーごとの認可ルールを実装するためにバックエンドを更新しましょう。

### 7. ローカル AWS 認証情報のセットアップ

バックエンドの更新を行うには、ローカルマシンからバックエンドの更新をデプロイするための AWS 認証情報が必要です。

ローカルマシンに `AmplifyBackendDeployFullAccess` 権限ポリシーを持つ AWS プロファイルと認証情報がすでにある場合は、**ステップ 8 にスキップしてください**。

それ以外の場合は、ローカルマシンからバックエンドの更新をデプロイする Amplify 権限を付与する **[ローカル AWS 認証情報のセットアップ](/[platform]/start/account-setup/)** を行ってください。

### 8. クラウドサンドボックスのデプロイ

本番ブランチに影響を与えずにバックエンドを更新するには、Amplify のクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。

クラウドサンドボックスを起動するには、**新しいターミナルウィンドウ**で以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

クラウドサンドボックスが完全にデプロイされると（約5分）、新しく分離された認証とデータバックエンドへの接続情報で `amplify_outputs.json` ファイルが更新されます。

> **Info:** `npx ampx sandbox` コマンドは `npm run dev` と並行して実行する必要があります。クラウドサンドボックスは「アプリバックエンドの localhost 相当」と考えることができます。

### 9. ユーザーごとの認可の実装

スターターの To-do アイテムは現在すべてのユーザー間で共有されていますが、ほとんどの場合、データはユーザーごとに分離することが望まれます。

ユーザーごとにデータを分離するには、「オーナーベースの認可ルール」を使用できます。To-do アイテムにオーナーベースの認可ルールを適用しましょう：

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
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token.
    // highlight-next-line
    defaultAuthorizationMode: 'userPool',
  },
});
```

アプリケーションのクライアントコードで、ログイン後に異なるユーザーを区別するためにユーザー名もレンダリングしましょう。**src/App.tsx** ファイルに移動し、`useAuthenticator` フックから `user` プロパティをレンダリングします。

```tsx title="src/App.tsx"
// ... imports

function App() {
  // highlight-next-line
  const { user, signOut } = useAuthenticator();

  // ...

  return (
    <main>
      // highlight-next-line
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      {/* ... */}
    </main>
  )
}
```

ローカルアプリケーションに戻って、To-do アイテムのユーザー分離をテストしてみましょう。

本番バックエンドではなくクラウドサンドボックスで作業しているため、新しいユーザーを再度サインアップする必要があります。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added per-user data isolation"
git push
```

Amplify コンソールでビルドが完了すると、`main` バックエンドがクラウドサンドボックス内で行われた変更をサポートするように更新されます。クラウドサンドボックス内のデータは完全に分離されており、本番データベースを汚染しません。
<!-- /Platform -->

<!-- Platform: nextjs -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：

1. Next.js アプリをデプロイする
2. リアルタイムデータ更新を備えたデータベースを構築して接続する
3. 認証と認可ルールを設定する

2 つのクイックスタートガイドをご用意しています：

<!-- /Platform -->

<!-- Platform: vue -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：

1. Vue.js アプリをデプロイする
2. リアルタイムデータ更新を備えたデータベースを構築して接続する
3. 認証と認可ルールを設定する

## フルスタックアプリを AWS にデプロイする

より素早く始めるための "To-do" スターターアプリケーションを用意しました。まず、スターター Vue テンプレートを使用して GitHub アカウントにリポジトリを作成します。

### 1. リポジトリの作成

スターターテンプレートを使用して GitHub アカウントにリポジトリを作成します。このテンプレートは Amplify バックエンド機能を備えた `create-vite-app` をscaffold します。

<ExternalLinkButton
  size="medium"
  href='https://github.com/new?template_name=amplify-vue-template&template_owner=aws-samples&name=amplify-vue-template&description=My%20Amplify%20Gen%202%20starter%20application'
>
<IconGithub />
テンプレートからリポジトリを作成
</ExternalLinkButton>

GitHub のフォームを使用してリポジトリの作成を完了します。

### 2. スターターアプリのデプロイ

リポジトリが作成されたので、Amplify でデプロイします。

<ExternalLinkButton
  size="medium"
  variation="primary"
  href='https://console.aws.amazon.com/amplify/create/repo-branch'
>
<IconAmplify />
AWS にデプロイ
</ExternalLinkButton>

**GitHub** を選択します。ポップアップウィンドウで Amplify に GitHub アカウントへのアクセスを許可した後、リポジトリと `main` ブランチを選択してデプロイします。他の変更は行わず、フローを進めて **Save and deploy** をクリックします。

### 3. デプロイされたアプリの確認

<Accordion title='プロジェクト構造について学ぶ' headingLevel='4' eyebrow='アプリのデプロイを待つ間（約5分）'>

GitHub でスターターリポジトリを開いて、プロジェクト構造を見てみましょう。スターターアプリケーションには To-do リストアプリのコードがあらかじめ記述されています。すべての To-do リストアイテムのリアルタイムデータベースフィードと新しいアイテムを追加する機能が提供されます。

```text
├── amplify/ # Folder containing your Amplify backend configuration
│   ├── auth/ # Definition for your auth backend
│   │   └── resource.tsx
│   ├── data/ # Definition for your data backend
│   │   └── resource.ts
|   ├── backend.ts
│   └── tsconfig.json
├── src/ # Vue code
│   ├── assets/ # Styling for your app
│   ├── components/ # UI code to sync todos in real-time
│   ├── App.vue # UI layout
│   └── main.tsx # Entrypoint of the Amplify client library
├── package.json
└── tsconfig.json
```
</details>

ビルドが完了したら、「Visit deployed URL」を選択して新しくデプロイされたブランチにアクセスします。ビルドで API、データベース、および認証バックエンドがデプロイされているため、新しい To-do アイテムを作成できます。

Amplify コンソールで、デプロイブランチ（この場合は **main**）をクリック > 左側メニューの **Data** を選択 > **Data manager** でデータベースに入力されたデータを確認します。

## フロントエンドの更新

To-do リストアイテムの削除フローを作成してアプリの機能を強化する方法を学びましょう。

### 4. ローカル環境のセットアップ

フロントエンドに機能を追加するために、ローカル開発環境をセットアップしましょう。デプロイされたブランチをクリックすると、ビルド履歴とデプロイされたバックエンドリソースのリストが表示される **Deployments** ページに移動します。

ページ下部に **Deployed backend resources** タブがあります。タブをクリックし、**Download amplify_outputs.json file** ボタンをクリックします。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)

リポジトリをローカルにクローンします。

```bash title="Terminal" showLineNumbers={false}
git clone https://github.com/<github-user>/amplify-vue-template.git
cd amplify-vue-template && npm install
```

上でダウンロードした `amplify_outputs.json` ファイルをプロジェクトのルートに移動します。

```text
├── amplify
├── src
├── amplify_outputs.json <== backend outputs file
├── package.json
└── tsconfig.json
```

<Accordion title='amplify_outputs.json' headingLevel='4' eyebrow='詳細を見る'>
**amplify_outputs.json** ファイルにはバックエンドエンドポイント情報、公開可能な API キー、認証フロー情報などが含まれています。Amplify クライアントライブラリはこの outputs ファイルを使用して Amplify バックエンドに接続します。`main.tsx` ファイル内で outputs ファイルがどのようにインポートされ、Amplify クライアントライブラリの `Amplify.configure(...)` 関数に渡されているかを確認できます。
</details>

### 5. 削除機能の実装

**components/Todos.vue** ファイルに新しい `deleteTodo` 機能を追加し、`<li>` 要素の `onClick` ハンドラに関数を渡します。

```tsx title="components/Todos.vue"
function App() {
  // ...
  // highlight-start
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  // highlight-end

  <template>
  <main>
    <h1>My todos</h1>
    <button @click="createTodo">+ new</button>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        // highlight-start
        @click="deleteTodo(todo.id)"
        // highlight-end
      >
        {{ todo.content }}
      </li>
    </ul>
    <div>
      🥳 App successfully hosted. Try creating a new todo.
      <br />
      <a href="https://docs.amplify.aws/vue/start/quickstart/">
        Review next steps of this tutorial.
      </a>
    </div>
  </main>
</template>
}
```

ローカル開発サーバーを起動して削除機能を試してみましょう：

```bash title="Terminal" showLineNumbers={false}
npm run dev
```

これにより http://localhost:5173 でローカル開発サーバーが起動します。

### 6. ログイン UI の実装

スターターアプリケーションには、**amplify/auth/resource.ts** ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。

```terminal showLineNumbers={false}
npm add @aws-amplify/ui-vue
```
**src/App.vue** ファイルで、Authenticator UI コンポーネントをインポートし、`<main>` テンプレートをラップします。

```tsx title="src/App.vue"
<script>
// highlight-start
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
// highlight-end
// ... other imports
</script>

<template>
  <main>
    // highlight-start
    <authenticator>
      <template v-slot="{ signOut }">
        <Todos />
        <button @click="signOut">Sign Out</button>
      </template>
    </authenticator>
    // highlight-end
  </main>
</template>
```

Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

localhost 環境でアプリケーションを再度試してみましょう。ログイン体験が表示されるはずです。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added authenticator"
git push
```

Amplify は git コミットに基づいてアプリの最新バージョンを自動的にデプロイします。数分後、アプリケーションがリビルドされると、ホストされているアプリが削除機能をサポートするように更新されます。

## バックエンドの更新

各ユーザーが自分の To-do のみにアクセスできるよう、ユーザーごとの認可ルールを実装するためにバックエンドを更新しましょう。

### 7. ローカル AWS 認証情報のセットアップ

バックエンドの更新を行うには、ローカルマシンからバックエンドの更新をデプロイするための AWS 認証情報が必要です。

ローカルマシンに `AmplifyBackendDeployFullAccess` 権限ポリシーを持つ AWS プロファイルと認証情報がすでにある場合は、**ステップ 8 にスキップしてください**。

それ以外の場合は、ローカルマシンからバックエンドの更新をデプロイする Amplify 権限を付与する **[ローカル AWS 認証情報のセットアップ](/[platform]/start/account-setup/)** を行ってください。

### 8. クラウドサンドボックスのデプロイ

本番ブランチに影響を与えずにバックエンドを更新するには、Amplify のクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。

クラウドサンドボックスを起動するには、**新しいターミナルウィンドウ**で以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

クラウドサンドボックスが完全にデプロイされると（約5分）、新しく分離された認証とデータバックエンドへの接続情報で `amplify_outputs.json` ファイルが更新されます。

> **Info:** `npx ampx sandbox` コマンドは `npm run dev` と並行して実行する必要があります。クラウドサンドボックスは「アプリバックエンドの localhost 相当」と考えることができます。

### 9. ユーザーごとの認可の実装

スターターの To-do アイテムは現在すべてのユーザー間で共有されていますが、ほとんどの場合、データはユーザーごとに分離することが望まれます。

ユーザーごとにデータを分離するには、「オーナーベースの認可ルール」を使用できます。To-do アイテムにオーナーベースの認可ルールを適用しましょう：

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
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token.
    // highlight-next-line
    defaultAuthorizationMode: 'userPool',
  },
});
```

アプリケーションのクライアントコードで、ログイン後に異なるユーザーを区別するためにユーザー名もレンダリングしましょう。

```tsx title="src/App.vue"
<script>
// highlight-start
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
// highlight-end
// ... other imports
</script>

<template>
  <main>
    <authenticator>
    // highlight-start
      <template v-slot="{ user, signOut }">
        <h1>Hello {{user?.signInDetails?.loginId}}'s todos</h1>
    // highlight-end
        <Todos />
        <button @click="signOut">Sign Out</button>
      </template>
    </authenticator>
  </main>
</template>
```

ローカルアプリケーションに戻って、To-do アイテムのユーザー分離をテストしてみましょう。

本番バックエンドではなくクラウドサンドボックスで作業しているため、新しいユーザーを再度サインアップする必要があります。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added per-user data isolation"
git push
```

Amplify コンソールでビルドが完了すると、`main` バックエンドがクラウドサンドボックス内で行われた変更をサポートするように更新されます。クラウドサンドボックス内のデータは完全に分離されており、本番データベースを汚染しません。
<!-- /Platform -->

<!-- Platform: angular -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：

1. Angular アプリをデプロイする
2. リアルタイムデータ更新を備えたデータベースを構築して接続する
3. 認証と認可ルールを設定する

## フルスタックアプリを AWS にデプロイする

より素早く始めるための "To-do" スターターアプリケーションを用意しました。まず、スターター Angular テンプレートを使用して GitHub アカウントにリポジトリを作成します。

### 1. リポジトリの作成

スターターテンプレートを使用して GitHub アカウントにリポジトリを作成します。このテンプレートは Amplify バックエンド機能を備えたスターター Angular アプリケーションをscaffold します。

<ExternalLinkButton
  size="medium"
  href='https://github.com/new?template_name=amplify-angular-template&template_owner=aws-samples&name=amplify-angular-template&description=My%20Amplify%20Gen%202%20starter%20application'
>
<IconGithub />
テンプレートからリポジトリを作成
</ExternalLinkButton>

GitHub のフォームを使用してリポジトリの作成を完了します。

### 2. スターターアプリのデプロイ

リポジトリが作成されたので、Amplify でデプロイします。

<ExternalLinkButton
  size="medium"
  variation="primary"
  href='https://console.aws.amazon.com/amplify/create/repo-branch'
>
<IconAmplify />
AWS にデプロイ
</ExternalLinkButton>

**GitHub** を選択します。ポップアップウィンドウで Amplify に GitHub アカウントへのアクセスを許可した後、リポジトリと `main` ブランチを選択してデプロイします。他の変更は行わず、フローを進めて **Save and deploy** をクリックします。

### 3. デプロイされたアプリの確認

<Accordion title='プロジェクト構造について学ぶ' headingLevel='4' eyebrow='アプリのデプロイを待つ間（約5分）'>

GitHub でスターターリポジトリを開いて、プロジェクト構造を見てみましょう。スターターアプリケーションには To-do リストアプリのコードがあらかじめ記述されています。すべての To-do リストアイテムのリアルタイムデータベースフィードと新しいアイテムを追加する機能が提供されます。

```text
├── amplify/ # Folder containing your Amplify backend configuration
│   ├── auth/ # Definition for your auth backend
│   │   └── resource.tsx
│   ├── data/ # Definition for your data backend
│   │   └── resource.ts
|   ├── backend.ts
│   └── tsconfig.json
├── src/app/ # Angular UI code
│   ├── todos/ # UI code to sync todos in real-time
│   ├── app.component.css # Styling for your app
│   └── app.component.ts # Entrypoint of the Amplify client library
├── package.json
└── tsconfig.json
```
</details>

ビルドが完了したら、「Visit deployed URL」を選択して新しくデプロイされたブランチにアクセスします。ビルドで API、データベース、および認証バックエンドがデプロイされているため、新しい To-do アイテムを作成できます。

Amplify コンソールで、デプロイブランチ（この場合は **main**）をクリック > 左側メニューの **Data** を選択 > **Data manager** でデータベースに入力されたデータを確認します。

## フロントエンドの更新

To-do リストアイテムの削除フローを作成してアプリの機能を強化する方法を学びましょう。

### 4. ローカル環境のセットアップ

フロントエンドに機能を追加するために、ローカル開発環境をセットアップしましょう。デプロイされたブランチをクリックすると、ビルド履歴とデプロイされたバックエンドリソースのリストが表示される **Deployments** ページに移動します。

ページ下部に **Deployed backend resources** タブがあります。タブをクリックし、**Download amplify_outputs.json file** ボタンをクリックします。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)

リポジトリをローカルにクローンします。

```bash title="Terminal" showLineNumbers={false}
git clone https://github.com/<github-user>/amplify-angular-template.git
cd amplify-angular-template && npm install
```

上でダウンロードした `amplify_outputs.json` ファイルをプロジェクトのルートに移動します。

```text
├── amplify
├── src
├── amplify_outputs.json <== backend outputs file
├── package.json
└── tsconfig.json
```

<Accordion title='amplify_outputs.json' headingLevel='4' eyebrow='詳細を見る'>
**amplify_outputs.json** ファイルにはバックエンドエンドポイント情報、公開可能な API キー、認証フロー情報などが含まれています。Amplify クライアントライブラリはこの outputs ファイルを使用して Amplify バックエンドに接続します。`app.component.ts` ファイル内で outputs ファイルがどのようにインポートされ、Amplify クライアントライブラリの `Amplify.configure(...)` 関数に渡されているかを確認できます。
</details>

### 5. 削除機能の実装

**src/app/todos/todos.component.ts** ファイルに新しい `deleteTodo` 関数を追加します。

```tsx title="src/todos/todos.component.ts"
export class TodosComponent implements OnInit {
  // ...
  // highlight-start
  deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  // highlight-end
}
```

UI から `deleteTodo` 関数を呼び出します。

```html title="src/app/todos/todos.component.html"
...
  <ul>
    <li *ngFor="let todo of todos;" (click)="deleteTodo(todo.id)">
        {{ todo.content }}
    </li>
  </ul>
...
```

ローカル開発サーバーを起動して削除機能を試してみましょう：

```bash title="Terminal" showLineNumbers={false}
npm run start
```

これにより http://localhost:4200 でローカル開発サーバーが起動します。

### 6. ログイン UI の実装

スターターアプリケーションには、**amplify/auth/resource.ts** ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。

```terminal showLineNumbers={false}
npm add @aws-amplify/ui-angular
```

**src/app/app.component.ts** ファイルで、`AmplifyAuthenticatorModule` をインポートします。

```ts title="src/app/app.component.ts"
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
// highlight-next-line
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // highlight-next-line
  imports: [RouterOutlet, TodosComponent, AmplifyAuthenticatorModule],
})
export class AppComponent {
  title = 'amplify-angular-template';
  // highlight-start
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }
  // highlight-end
}
```
アプリケーションの UI を更新し、スタイルを追加します。

```html title="src/app/app.component.html"
<amplify-authenticator>
  <ng-template
    amplifySlot="authenticated"
    let-user="user"
    let-signOut="signOut"
  >
    <app-todos></app-todos>
    <button (click)="signOut()">Sign Out</button>
  </ng-template>
</amplify-authenticator>
```

```json title="angular.json"
...
    "styles": [
      "node_modules/@aws-amplify/ui-angular/theme.css",
      "src/styles.css"
    ],
...
```
Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

localhost 環境でアプリケーションを再度試してみましょう。ログイン体験が表示されるはずです。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added authenticator"
git push
```

Amplify は git コミットに基づいてアプリの最新バージョンを自動的にデプロイします。数分後、アプリケーションがリビルドされると、ホストされているアプリが削除機能をサポートするように更新されます。

## バックエンドの更新

各ユーザーが自分の To-do のみにアクセスできるよう、ユーザーごとの認可ルールを実装するためにバックエンドを更新しましょう。

### 7. ローカル AWS 認証情報のセットアップ

バックエンドの更新を行うには、ローカルマシンからバックエンドの更新をデプロイするための AWS 認証情報が必要です。

ローカルマシンに `AmplifyBackendDeployFullAccess` 権限ポリシーを持つ AWS プロファイルと認証情報がすでにある場合は、**ステップ 8 にスキップしてください**。

それ以外の場合は、ローカルマシンからバックエンドの更新をデプロイする Amplify 権限を付与する **[ローカル AWS 認証情報のセットアップ](/[platform]/start/account-setup/)** を行ってください。

### 8. クラウドサンドボックスのデプロイ

本番ブランチに影響を与えずにバックエンドを更新するには、Amplify のクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。

クラウドサンドボックスを起動するには、**新しいターミナルウィンドウ**で以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

クラウドサンドボックスが完全にデプロイされると（約5分）、新しく分離された認証とデータバックエンドへの接続情報で `amplify_outputs.json` ファイルが更新されます。

> **Info:** `npx ampx sandbox` コマンドは `npm run dev` と並行して実行する必要があります。クラウドサンドボックスは「アプリバックエンドの localhost 相当」と考えることができます。

### 9. ユーザーごとの認可の実装

スターターの To-do アイテムは現在すべてのユーザー間で共有されていますが、ほとんどの場合、データはユーザーごとに分離することが望まれます。

ユーザーごとにデータを分離するには、「オーナーベースの認可ルール」を使用できます。To-do アイテムにオーナーベースの認可ルールを適用しましょう：

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  })
  // highlight-next-line
  .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token.
    // highlight-next-line
    defaultAuthorizationMode: 'userPool',
  },
});
```

アプリケーションのクライアントコードで、ログイン後に異なるユーザーを区別するためにユーザー名もレンダリングしましょう。

```html title="src/app/app.component.html"
<amplify-authenticator>
  <ng-template
    amplifySlot="authenticated"
    let-user="user"
    let-signOut="signOut"
  >
  <h1>Hello {{user?.signInDetails?.loginId}}'s todos</h1>
    <app-todos></app-todos>
    <button (click)="signOut()">Sign Out</button>
  </ng-template>
</amplify-authenticator>
```

ローカルアプリケーションに戻って、To-do アイテムのユーザー分離をテストしてみましょう。

本番バックエンドではなくクラウドサンドボックスで作業しているため、新しいユーザーを再度サインアップする必要があります。

これらの変更をクラウドに反映するには、git にコミットして変更をアップストリームにプッシュします。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added per-user data isolation"
git push
```

Amplify コンソールでビルドが完了すると、`main` バックエンドがクラウドサンドボックス内で行われた変更をサポートするように更新されます。クラウドサンドボックス内のデータは完全に分離されており、本番データベースを汚染しません。
<!-- /Platform -->

<!-- Platform: flutter -->
## 前提条件

始める前に、以下がインストールされていることを確認してください：

- [Node.js](https://nodejs.org/) v18.17 以降
- [npm](https://www.npmjs.com/) v9 以降
- [git](https://git-scm.com/) v2.14.1 以降
- [AWS アカウントの作成](https://portal.aws.amazon.com/billing/signup)も必要です。AWS Amplify は [AWS 無料利用枠](https://aws.amazon.com/amplify/pricing/)の一部であることに注意してください。
- Amplify で使用するための AWS アカウントの設定 [手順](/[platform]/start/account-setup/)。
- 安定版の [Flutter](https://docs.flutter.dev/get-started/install)。

> **Info:** [公式ドキュメント](https://flutter.dev/docs/get-started/install)に従ってマシンに Flutter をインストールし、エディタの設定については[エディタドキュメント](https://docs.flutter.dev/get-started/editor)を確認してください。

Flutter をインストールしたら、以下のコマンドを使用して新しい Flutter プロジェクトを作成できます：

> **Info:** このクイックスタートガイドでは、Web 向けにアプリケーションをビルドします。ただし、他のプラットフォームでアプリケーションを実行する場合は、必要なセットアップ[ガイド](/[platform]/start/platform-setup/)に従ってください。

```bash title="Terminal" showLineNumbers={false}
flutter create my_amplify_app
```

## バックエンドの作成

AWS Amplify を始める最も簡単な方法は、`create-amplify` コマンドを使用して npm 経由で行うことです。ベースプロジェクトディレクトリから実行できます。まず、以下のコマンドでベースプロジェクトディレクトリに移動します：

```bash title="Terminal" showLineNumbers={false}
cd my_amplify_app
```

その後、以下を実行して Amplify プロジェクトを作成します：

```bash title="Terminal" showLineNumbers={false}
npm create amplify@latest -y
```

このコマンドを実行すると、現在のプロジェクトに Amplify バックエンドファイルが以下のファイル構成でscaffold されます：

```text
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

バックエンドをデプロイするには、Amplify の開発者ごとのクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。サンドボックス環境でアプリケーションを実行するには、以下のコマンドを実行します：

<!-- Platform: android, javascript, react-native, angular, nextjs, react, react-native, vue, swift -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox

```
<!-- /Platform -->
<!-- Platform: flutter -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-format dart --outputs-out-dir lib
```
<!-- /Platform -->

## 認証の追加

初期のscaffoldには、`amplify/auth/resource.ts` ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。

Authenticator を使用するには、プロジェクトに以下の依存関係を追加する必要があります：

```yaml title="pubspec.yaml"
dependencies:
  amplify_flutter: ^2.0.0
  amplify_auth_cognito: ^2.0.0
  amplify_authenticator: ^2.0.0
```

以下を追加します：

- `amplify_flutter` でアプリケーションを Amplify リソースに接続します。
- `amplify_auth_cognito` でアプリケーションを Amplify Cognito リソースに接続します。
- `amplify_authenticator` で Amplify UI コンポーネントを使用します。

依存関係を追加したら、以下のコマンドを実行して依存関係をインストールします：

```bash title="Terminal" showLineNumbers={false}
flutter pub get
```

最後に、Amplify UI コンポーネントを使用するように main.dart ファイルを更新します：

```dart title="main.dart"
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    await _configureAmplify();
    runApp(const MyApp());
  } on AmplifyException catch (e) {
    runApp(Text("Error configuring Amplify: ${e.message}"));
  }
}

Future<void> _configureAmplify() async {
  try {
    await Amplify.addPlugin(AmplifyAuthCognito());
    await Amplify.configure(amplifyConfig);
    safePrint('Successfully configured');
  } on Exception catch (e) {
    safePrint('Error configuring Amplify: $e');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return Authenticator(
      child: MaterialApp(
        builder: Authenticator.builder(),
        home: const Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SignOutButton(),
                Text('TODO Application'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

ローカル環境でアプリケーションを再度実行してみましょう。ログイン体験が表示されるはずです。

## データの追加

初期のscaffoldには、`amplify/data/resource.ts` ファイルに事前設定済みのデータバックエンドがすでに定義されています。デフォルトの例では、`content` フィールドを持つ Todo モデルが作成されます。

以下を追加するように変更しましょう：
- ブール型の `isDone` フィールド。
- Auth リソースを通じて認証されたオーナーが自分のレコードを「作成」、「読み取り」、「更新」、「削除」できる認可ルール。
- `defaultAuthorizationMode` を更新して、ユーザー認証トークンで API リクエストに署名します。

```typescript
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```
次に、To-do アイテムを作成、一覧表示、削除するための UI を実装しましょう。

Amplify はバックエンド API と対話するためのコードを自動的に生成できます。ターミナルでコマンドを実行して、`lib/models` 以下に Data スキーマから dart モデルクラスを生成します：

```bash title="Terminal" showLineNumbers={false}
npx ampx generate graphql-client-code --format modelgen --model-target dart --out lib/models
```

完了したら、プロジェクトに API 依存関係を追加します。`amplify_api` を追加してアプリケーションを Amplify API に接続します。

```yaml title="pubspec.yaml"
dependencies:
  amplify_api: ^2.0.0
```

依存関係を追加したら、`main.dart` ファイルの `_configureAmplify` メソッドを更新して Amplify API を使用するようにします：

```dart title="main.dart"
Future<void> _configureAmplify() async {
  try {
    await Amplify.addPlugins(
      [
        AmplifyAuthCognito(),
        AmplifyAPI(
          options: APIPluginOptions(
            modelProvider: ModelProvider.instance,
          ),
        ),
      ],
    );
    await Amplify.configure(amplifyConfig);
    safePrint('Successfully configured');
  } on Exception catch (e) {
    safePrint('Error configuring Amplify: $e');
  }
}
```

次に `TodoScreen` という新しいウィジェットを作成し、**main.dart** ファイルの末尾に以下のコードを追加します：

```dart title="main.dart"

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        label: const Text('Add Random Todo'),
        onPressed: () async {
          final newTodo = Todo(
            id: uuid(),
            content: "Random Todo ${DateTime.now().toIso8601String()}",
            isDone: false,
          );
          final request = ModelMutations.create(newTodo);
          final response = await Amplify.API.mutate(request: request).response;
          if (response.hasErrors) {
            safePrint('Creating Todo failed.');
          } else {
            safePrint('Creating Todo successful.');
          }
        },
      ),
      body: const Placeholder(),
    );
  }
}
```

これにより、ユーザーがフローティングアクションボタンをクリックするたびにランダムな Todo が作成されます。`ModelMutations.create` メソッドを使用して新しい Todo を作成していることがわかります。

**main.dart** ファイルの `MyApp` ウィジェットを以下のように更新します：

```dart title="main.dart"
class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return Authenticator(
      child: MaterialApp(
        builder: Authenticator.builder(),
        home: const SafeArea(
          child: Scaffold(
            body: Column(
              children: [
                SignOutButton(),
                Expanded(child: TodoScreen()),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

次に `_TodoScreenState` に `_todos` リストを追加して API からの結果を追加し、更新関数を呼び出します：

```dart title="main.dart"
List<Todo> _todos = [];

@override
void initState() {
  super.initState();
  _refreshTodos();
}
```

そして `_refreshTodos` という新しい関数を作成します：

```dart title="main.dart"
Future<void> _refreshTodos() async {
  try {
    final request = ModelQueries.list(Todo.classType);
    final response = await Amplify.API.query(request: request).response;

    final todos = response.data?.items;
    if (response.hasErrors) {
      safePrint('errors: ${response.errors}');
      return;
    }
    setState(() {
      _todos = todos!.whereType<Todo>().toList();
    });
  } on ApiException catch (e) {
    safePrint('Query failed: $e');
  }
}
```

`build` 関数を以下のように更新します：

```dart title="main.dart"
@override
Widget build(BuildContext context) {
  return Scaffold(
    floatingActionButton: FloatingActionButton.extended(
      label: const Text('Add Random Todo'),
      onPressed: () async {
        final newTodo = Todo(
          id: uuid(),
          content: "Random Todo ${DateTime.now().toIso8601String()}",
          isDone: false,
        );
        final request = ModelMutations.create(newTodo);
        final response = await Amplify.API.mutate(request: request).response;
        if (response.hasErrors) {
          safePrint('Creating Todo failed.');
        } else {
          safePrint('Creating Todo successful.');
        }
        _refreshTodos();
      },
    ),
    body: _todos.isEmpty == true
        ? const Center(
            child: Text(
              "The list is empty.\nAdd some items by clicking the floating action button.",
              textAlign: TextAlign.center,
            ),
          )
        : ListView.builder(
            itemCount: _todos.length,
            itemBuilder: (context, index) {
              final todo = _todos[index];
              return Dismissible(
                key: UniqueKey(),
                confirmDismiss: (direction) async {
                  return false;
                },
                child: CheckboxListTile.adaptive(
                  value: todo.isDone,
                  title: Text(todo.content!),
                  onChanged: (isChecked) async {},
                ),
              );
            },
          ),
  );
}
```

次に更新と削除機能を追加しましょう。

更新については、`CheckboxListTile.adaptive` ウィジェットの `onChanged` メソッドに以下のコードを追加します：

```dart title="main.dart"
final request = ModelMutations.update(
  todo.copyWith(isDone: isChecked!),
);
final response =
    await Amplify.API.mutate(request: request).response;
if (response.hasErrors) {
  safePrint('Updating Todo failed. ${response.errors}');
} else {
  safePrint('Updating Todo successful.');
  await _refreshTodos();
}
```

これにより、`ModelMutations.update` メソッドを呼び出して、todo アイテムのコピー/更新バージョンで Todo を更新します。これでチェックボックスも更新されます。

削除機能については、`Dismissible` ウィジェットの `confirmDismiss` メソッドに以下のコードを追加します：

```dart title="main.dart"
if (direction == DismissDirection.endToStart) {
  final request = ModelMutations.delete(todo);
  final response =
      await Amplify.API.mutate(request: request).response;
  if (response.hasErrors) {
    safePrint('Updating Todo failed. ${response.errors}');
  } else {
    safePrint('Updating Todo successful.');
    await _refreshTodos();
    return true;
  }
}
return false;
```

これにより、ユーザーがアイテムを右から左にスワイプすると Todo アイテムが削除されます。アプリケーションを実行すると、以下のフローが表示されるはずです。

プロジェクトのクリーンアップのためにサンドボックス環境を終了できます。

### クラウドへの変更の公開

クラウドへの変更の公開にはリモート git リポジトリが必要です。Amplify はフルスタックブランチデプロイメントを提供しており、フィーチャーブランチからインフラストラクチャとアプリケーションコードの変更を自動的にデプロイできます。詳細については、[フルスタックブランチデプロイメントガイド](/[platform]/deploy-and-host/fullstack-branching/branch-deployments)をご覧ください。
<!-- /Platform -->

<!-- Platform: swift -->
## 前提条件

始める前に、以下がインストールされていることを確認してください：

- [Node.js](https://nodejs.org/) v18.17 以降
- [npm](https://www.npmjs.com/) v9 以降
- [git](https://git-scm.com/) v2.14.1 以降
- [AWS アカウントの作成](https://portal.aws.amazon.com/billing/signup)も必要です。AWS Amplify は [AWS 無料利用枠](https://aws.amazon.com/amplify/pricing/)の一部であることに注意してください。
- Amplify で使用するための AWS アカウントの設定 [手順](/[platform]/start/account-setup/)。
- マシンに [Xcode と Developer Tooling](https://developer.apple.com/xcode/) がインストールされている必要があります。

<Accordion title='XCode プロジェクトを作成する' headingLevel='4' eyebrow='新規に始める場合'>
Xcode を開き、**Create New Project...** を選択します。

![Shows the Xcode starter video to start project](/images/lib/getting-started/ios/set-up-swift-1.png)

次のステップで **iOS** の **App** テンプレートを選択します。次へをクリックします。

![Shows the template of apps for iOS](/images/lib/getting-started/ios/set-up-swift-2.png)

次の手順は：

- _Product Name_（例：MyAmplifyApp）を追加する
- _Team_（例：None）を選択する
- _Organization Identifier_（例：com.example）を選択する
- _Interface_ として **SwiftUI** を選択する
- **Next** を押す

![Shows the project details dialog](/images/lib/getting-started/ios/set-up-swift-3.png)

これでプロジェクトが作成されます。

![Shows the base project for SwiftUI](/images/lib/getting-started/ios/set-up-swift-4.png)
</details>

## バックエンドの作成

AWS Amplify を始める最も簡単な方法は、`create-amplify` コマンドを使用して npm 経由で行うことです。ベースプロジェクトディレクトリから実行できます。

```bash title="Terminal" showLineNumbers={false}
cd my_amplify_app
npm create amplify@latest
? Where should we create your project? (.) # press enter
```

このコマンドを実行すると、現在のプロジェクトに Amplify バックエンドファイルが以下のファイル構成でscaffold されます：

```text
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

バックエンドをデプロイするには、Amplify の開発者ごとのクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。サンドボックス環境でアプリケーションを実行するには、以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

サンドボックス環境がデプロイされると、`amplify_outputs.json` が作成されます。ただし、Xcode はそれらを認識できません。ファイルを認識させるには、生成されたファイルをプロジェクトにドラッグアンドドロップする必要があります。

## 認証の追加

初期のscaffoldには、`amplify/auth/resource`.ts ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。

Authenticator を使用するには、Xcode でプロジェクトを開き、**File > Add Packages...** を選択して以下の依存関係を追加します：

![Shows the Amplify library for Swift](/images/lib/getting-started/ios/set-up-swift-5.png)

- Amplify Library for Swift: GitHub URL（https://github.com/aws-amplify/amplify-swift）を入力し、**Up to Next Major Version** を選択して **Add Package Dependencies...** をクリックし、以下のライブラリを選択します：

  - Amplify
  - AWSCognitoAuthPlugin

![Shows the Amplify library for Swift](/images/lib/getting-started/ios/set-up-swift-6.png)

- Amplify UI Swift - Authenticator: GitHub URL（https://github.com/aws-amplify/amplify-ui-swift-authenticator）を入力し、**Up to Next Major Version** を選択して **Add Package Dependencies...** をクリックし、以下のライブラリを選択します：
  - Authenticator

![Shows the Amplify library for Swift](/images/lib/getting-started/ios/set-up-swift-7.png)

`MyAmplifyAppApp` クラスを以下のコードで更新します：

```swift
import Amplify
import Authenticator
import AWSCognitoAuthPlugin
import SwiftUI

@main
struct MyApp: App {
    init() {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure(with: .amplifyOutputs)
        } catch {
            print("Unable to configure Amplify \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

`ContentView` を以下のコードで更新します：
```swift
import Amplify
import Authenticator

struct ContentView: View {
    var body: some View {
        Authenticator { state in
            VStack {
                Button("Sign out") {
                    Task {
                        await state.signOut()
                    }
                }
            }
        }
    }
}
```

Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

ローカル環境でアプリケーションを再度実行してみましょう。ログイン体験が表示されるはずです。

<Video with="40%" src="/images/gen2/getting-started/ios/ios-getting-started-1.mp4" description="Video - Authentication Demo" />

## データの追加

初期のscaffoldには、`amplify/data/resource.ts` ファイルに事前設定済みのデータバックエンドがすでに定義されています。デフォルトの例では、`content` フィールドを持つ Todo モデルが作成されます。

以下を追加するように変更しましょう：
- ブール型の `isDone` フィールド。
- Auth リソースを通じて認証されたオーナーが自分のレコードを「作成」、「読み取り」、「更新」、「削除」できる認可ルール。
- `defaultAuthorizationMode` を更新して、ユーザー認証トークンで API リクエストに署名します。

```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().required()
    })
    .authorization((allow) => [allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
```
次に、To-do アイテムを作成、一覧表示、削除するための UI を実装しましょう。

Amplify はバックエンド API と対話するためのコードを自動的に生成できます。以下のコマンドで Data スキーマからモデルクラスを生成します：

```bash title="Terminal" showLineNumbers={false}
npx ampx generate graphql-client-code --format modelgen --model-target swift
```

生成されたファイルをプロジェクトに移動します。ファイルをプロジェクトにドラッグアンドドロップすることで行えます。

![Shows the drag and drop phase](/images/lib/getting-started/ios/set-up-swift-8.png)

完了したら、API 依存関係をプロジェクトに追加します。**File > Add Package Dependencies...** を選択して `AWSAPIPlugin` を追加します。

![Shows the Amplify API library for Swift selected](/images/lib/getting-started/ios/set-up-swift-9.png)

依存関係を追加したら、`MyAmplifyAppApp.swift` ファイルの `import` 部分を以下のコードで更新します：

```swift title="MyAmplifyAppApp.swift"
import Amplify
import AWSCognitoAuthPlugin
import AWSAPIPlugin
```

次に、`MyAmplifyAppApp.swift` ファイルの `init()` 部分を以下のコードで更新します：

```swift title="MyAmplifyAppApp.swift"
init() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSAPIPlugin(modelRegistration: AmplifyModels()))
        try Amplify.configure(with: .amplifyOutputs)
    } catch {
        print("Unable to configure Amplify \(error)")
    }
}
```

`TodoViewModel.swift` という新しいファイルを作成し、以下のコードで `createTodo` 関数を追加します：

```swift title="TodoViewModel.swift"
import Amplify
import SwiftUI

@MainActor
class TodoViewModel: ObservableObject {
    func createTodo() async {
        let creationTime = Temporal.DateTime.now()
        let todo = Todo(
            content: "Random Todo \(creationTime.iso8601String)",
            isDone: false,
            createdAt: creationTime,
            updatedAt: creationTime
        )
        do {
            let result = try await Amplify.API.mutate(request: .create(todo))
            switch result {
            case .success(let todo):
                print("Successfully created todo: \(todo)")
                todos.append(todo)
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        } catch let error as APIError {
            print("Failed to create todo: ", error)
        } catch {
            print("Unexpected error: \(error)")
        }
    }
}

```

上記のコードは現在の時刻でランダムな Todo を作成します。

次に、`TodoViewModel.swift` の `listTodos` 関数を更新して To-do アイテムをリスト表示します：

```swift title="TodoViewModel.swift"
@MainActor
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []

    func createTodo() {
        /// ...
    }

    func listTodos() async {
        let request = GraphQLRequest<Todo>.list(Todo.self)
        do {
            let result = try await Amplify.API.query(request: request)
            switch result {
            case .success(let todos):
                print("Successfully retrieved list of todos: \(todos)")
                self.todos = todos.elements
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        } catch let error as APIError {
            print("Failed to query list of todos: ", error)
        } catch {
            print("Unexpected error: \(error)")
        }
    }
}
```

これにより取得した todos の値が Published オブジェクトに代入されます。

次に、todos を監視するように UI コードを更新しましょう。`ContentView.swift` ファイルの `VStack` を以下のコードで更新します：

```swift title="ContentView.swift"
struct ContentView: View {

    // Create an observable object instance.
    @StateObject var vm = TodoViewModel()

    var body: some View {
        Authenticator { state in
            VStack {
                Button("Sign out") {
                    Task {
                        await state.signOut()
                    }
                }
                Button(action: {
                    Task { await vm.createTodo() }
                }) {
                    HStack {
                        Text("Add a New Todo")
                        Image(systemName: "plus")
                    }
                }
                .accessibilityLabel("New Todo")
            }
        }
    }
}
```

> **Info:** Swift の実装全体で async/await パターンが使用されており、簡単に使用するために Task 構造体を活用しています。Task 構造体の詳細については、[ドキュメント](https://developer.apple.com/documentation/swift/task)を確認してください。

このコードは Todo を作成し、Todo が作成されるたびに Todo リストを更新します。

次のステップは todos の更新と削除です。そのために、`TodoViewModel.swift` ファイルに以下のコードで `updateTodo` と `deleteTodo` 関数を作成します：

```swift title="TodoViewModel.swift"
@MainActor
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []

    func createTodo() {
        // ...
    }

    func listTodos() {
        // ...
    }

    func deleteTodos(indexSet: IndexSet) async {
        for index in indexSet {
            do {
                let todo = todos[index]
                let result = try await Amplify.API.mutate(request: .delete(todo))
                switch result {
                case .success(let todo):
                    print("Successfully deleted todo: \(todo)")
                    todos.remove(at: index)
                case .failure(let error):
                    print("Got failed result with \(error.errorDescription)")
                }
            } catch let error as APIError {
                print("Failed to deleted todo: ", error)
            } catch {
                print("Unexpected error: \(error)")
            }
        }
    }

    func updateTodo(todo: Todo) async {
        do {
            let result = try await Amplify.API.mutate(request: .update(todo))
            switch result {
            case .success(let todo):
                print("Successfully updated todo: \(todo)")
            case .failure(let error):
                print("Got failed result with \(error.errorDescription)")
            }
        } catch let error as APIError {
            print("Failed to updated todo: ", error)
        } catch {
            print("Unexpected error: \(error)")
        }
    }
}

```

`ContentView.swift` ファイルの `List` を更新して、View が表示されたときに todos を取得し、ユーザーが todo を左スワイプしたときに `deleteTodos(indexSet:)` を呼び出すようにします。

```swift title="ContentView.swift"
struct ContentView: View {
    @StateObject var vm = TodoViewModel()

    var body: some View {
        Authenticator { state in
            VStack {
                // ... Sign out Button
                List {
                    ForEach($vm.todos, id: \.id) { todo in
                        TodoRow(vm: vm, todo: todo)
                    }
                    .onDelete { indexSet in
                        Task { await vm.deleteTodos(indexSet: indexSet) }
                    }
                }
                .task {
                    await vm.listTodos()
                }
                // ... Add new Todo button
            }
        }
    }
}
```

最後に、以下のコードで `TodoRow.swift` という新しいファイルを作成します：

```swift title="TodoRow.swift"
import SwiftUI

struct TodoRow: View {
    @ObservedObject var vm: TodoViewModel
    @Binding var todo: Todo

    var body: some View {
        Toggle(isOn: $todo.isDone) {
            Text(todo.content ?? "")
        }
        .toggleStyle(.switch)
        .onChange(of: todo.isDone) { _, newValue in
            var updatedTodo = todo
            updatedTodo.isDone = newValue
            Task { await vm.updateTodo(todo: updatedTodo) }
        }
    }
}

#Preview {
    @State var todo = Todo(content: "Hello Todo World 20240706T15:23:42.256Z", isDone: false)
    return TodoRow(vm: TodoViewModel(), todo: $todo)
}
```

これにより、todo の `isDone` を更新するトグルと、todo を削除するスワイプが UI に表示されます。アプリケーションを実行すると、以下のフローが表示されるはずです。

<Video width="40%" src="/images/gen2/getting-started/ios/ios-getting-started-3.mp4" description="Video - Delete Demo" />

プロジェクトのクリーンアップのためにサンドボックス環境を終了できます。

## クラウドへの変更の公開

クラウドへの変更の公開にはリモート git リポジトリが必要です。Amplify はフルスタックブランチデプロイメントを提供しており、フィーチャーブランチからインフラストラクチャとアプリケーションコードの変更を自動的にデプロイできます。詳細については、[フルスタックブランチデプロイメントガイド](/[platform]/deploy-and-host/fullstack-branching/branch-deployments)をご覧ください。
<!-- /Platform -->

<!-- Platform: android -->
👋 AWS Amplify へようこそ！このクイックスタートガイドでは、以下を行います：
1. Amplify バックエンドのデータベースと認証を AWS にデプロイする
2. Android アプリからバックエンドに接続する
3. バックエンドの更新を行う

## Amplify バックエンドを AWS にデプロイする

より素早く始めるために、スターターの "To-do" Amplify バックエンドを用意しました。まず、スターターテンプレートを使用して GitHub アカウントにリポジトリを作成します。

### 1. リポジトリの作成

スターターテンプレートを使用して GitHub アカウントにリポジトリを作成します。このテンプレートは Auth と Data 機能を備えた Amplify バックエンドをscaffold します。
<ExternalLinkButton
  size="medium"
  href='https://github.com/new?template_name=amplify-backend-template&template_owner=aws-samples&name=amplify-backend-template&description=My%20Amplify%20Gen%202%20starter%20application'
>
<IconGithub />
テンプレートからリポジトリを作成
</ExternalLinkButton>

### 2. スターターのデプロイ

リポジトリが作成されたので、Amplify の CI/CD パイプラインにデプロイします。

<ExternalLinkButton
  size="medium"
  variation="primary"
  href='https://us-east-1.console.aws.amazon.com/amplify/create/repo-branch'
>
<IconAmplify />
AWS にデプロイ
</ExternalLinkButton>

**GitHub** を選択し、スターターリポジトリを選択して「Save and Deploy」をクリックします。

### 3. デプロイされたバックエンドの確認

<Accordion title='プロジェクト構造について学ぶ' headingLevel='4' eyebrow='アプリのデプロイを待つ間（約5分）'>

このスターターリポジトリのプロジェクト構造を見てみましょう。スターターアプリケーションには、すべての To-do アイテムのリアルタイムデータベースフィードと新しいアイテムを追加する機能を提供するコードがあらかじめ記述されています。

```text
├── amplify/ # Folder containing your Amplify backend configuration
│   ├── auth/ # Definition for your auth backend
│   │   └── resource.ts
│   ├── data/ # Definition for your data backend
│   │   └── resource.ts
|   ├── backend.ts
│   └── package.json
```
</details>

ビルドが完了したら、ブランチ名を選択してデプロイメントの **Deployed backend resources** セクションを確認して、新しくデプロイされたブランチにアクセスします。

## アプリの更新

To-do リストアイテムの削除フローを作成してアプリの機能を強化する方法を学びましょう。

### 4. ローカル環境のセットアップ

<Accordion title='Android プロジェクトのセットアップ' headingLevel='4' eyebrow='既存の Android アプリがない場合'>

**Android Studio を開きます**。**+ Create New Project** を選択します。

![Shows the Android studio welcome window](/images/lib/getting-started/android/set-up-android-studio-welcome.png)

**Select a Project Template** で **Empty Activity** または **Empty Compose Activity** を選択します。**Next** を押します。

![Shows Android studio new project window](/images/lib/getting-started/android/set-up-android-studio-select-project-template.png)

- **Name** フィールドに _MyAmplifyApp_ と入力する
- **Language** ドロップダウンメニューから _Java_ または _Kotlin_ を選択する
- **Minimum SDK** ドロップダウンメニューから _API 24: Android 7.0 (Nougat)_ を選択する
- **Finish** を押す

![Shows Android studio configure project window](/images/lib/getting-started/android/set-up-android-studio-configure-your-project.png)

</details>

**Deployed backend resources** で、**Download outputs file** を選択して、デプロイされたすべてのバックエンドリソースの識別子を含む `amplify_outputs.json` ファイルをダウンロードします。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)

上でダウンロードした `amplify_outputs.json` ファイルを Android プロジェクトの `app/src/main/res/raw` に移動します。これでこのバックエンドに接続できるようになります。

<Accordion title='amplify_outputs.json' headingLevel='4' eyebrow='詳細を見る'>
**amplify_outputs.json** ファイルにはバックエンドエンドポイント情報、公開可能な API キー、認証フロー情報などが含まれています。Amplify クライアントライブラリはこの outputs ファイルを使用して Amplify バックエンドに接続します。
</details>

### 5. 依存関係のインストール

Amplify は一部の最新の Java API を使用しており、古いバージョンの Android 向けに脱糖処理を追加する必要があります。`app/build.gradle.kts` に以下の行を追加します：
```kotlin title="app/build.gradle.kts"
android {
    compileOptions {
        // Support for modern Java features
        isCoreLibraryDesugaringEnabled = true
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:ANDROID_DESUGAR_VERSION")
}
```

### 6. ログイン UI の実装

デプロイされたバックエンドアプリケーションには、`amplify/auth/resource.ts` ファイルに事前設定済みの認証バックエンドがすでに定義されています。

ログイン体験を素早く起動する最も簡単な方法は、Authenticator UI コンポーネントを使用することです。Authenticator UI コンポーネントを使用するには、`app/build.gradle.kts` ファイルに以下の依存関係を追加する必要があります：

> **Warning:** compileSdk のバージョンが 34 以上であることを確認してください。

```kotlin title="app/build.gradle.kts"
dependencies {
    implementation("com.amplifyframework.ui:authenticator:ANDROID_AUTHENTICATOR_VERSION")
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:ANDROID_DESUGAR_VERSION")
}
```

その後、`Application` を拡張する `MyAmplifyApp` クラスを作成し、以下のコードを追加します：

```kotlin title="MyAmplifyApp.kt"
import android.app.Application
import android.util.Log
import com.amplifyframework.AmplifyException
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.core.configuration.AmplifyOutputs

class MyAmplifyApp: Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(AmplifyOutputs(R.raw.amplify_outputs), applicationContext)
            Log.i("MyAmplifyApp", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
        }
    }
}
```

次に `AndroidManifest.xml` ファイルでこのクラスを呼び出します：

```xml title="AndroidManifest.xml"
<application
    android:name=".MyAmplifyApp"
    ...
</application>
```

Android Authenticator コンポーネントを使用するように `MainActivity.kt` を更新します。

```kotlin title="MainActivity.kt"
import android.os.Bundle
..
//highlight-start
import com.amplifyframework.ui.authenticator.ui.Authenticator
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import com.amplifyframework.core.Amplify
//highlight-end

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAmplifyAppTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                )
                //highlight-start
                {
                    Authenticator { state ->
                        Column {
                            Text(
                                text = "Hello ${state.user.username}!",
                            )
                            Button(onClick = {
                                Amplify.Auth.signOut {  }
                            }) {
                                Text(text = "Sign Out")
                            }
                        }
                    }
                }
                //highlight-end
            }
        }
    }
}
```

Android エミュレーターでアプリケーションを実行すると、認証フローが動作しているのが確認できるはずです。

<Video width="40%" src="/images/gen2/getting-started/android/android-getting-started-1.mp4" description="Video - Authentication Demo" />

### 7. データの読み書き

初期のscaffoldには、`amplify/data/resource.ts` ファイルに事前設定済みのデータバックエンドがすでに定義されています。デフォルトの例では、`content` フィールドを持つ Todo モデルが作成されます。

Amplify はバックエンド API と対話するためのコードを自動的に生成できます。以下のコマンドで Data スキーマからモデルクラスを生成します：

<Accordion title='App ID をお探しですか？' headingLevel='4' eyebrow='Amplify コンソールで App ID を見つける'>
以下のコマンドで APP-ID を Amplify アプリ ID に置き換えてください。Amplify コンソールで確認できます。
![image](images/gen2/getting-started/appid.png)
</details>

```bash title="Terminal" showLineNumbers={false}
cd my-android-app
npx @aws-amplify/backend-cli generate graphql-client-code --format modelgen --model-target java --out app/src/main/java --app-id <your-amplify-app-id> --branch main
```

完了したら、プロジェクトに以下の依存関係を追加します：

```kotlin title="build.gradle.kts"
dependencies {
    // Amplify API dependencies
    // highlight-start
    implementation("com.amplifyframework:aws-api:ANDROID_VERSION")
    // highlight-end
    // ... other dependencies
}
```

依存関係を追加したら、`MyAmplifyApp` クラスを開き、`configure` 呼び出しの前に以下の行を追加します：

```kotlin title="MyAmplifyApp.kt"

// highlight-next-line
import com.amplifyframework.api.aws.AWSApiPlugin

..
// highlight-next-line
Amplify.addPlugin(AWSApiPlugin())
```

新しい To-do アイテムを作成するために `MainActivity` クラスを以下のコードで更新します。`onClick` 関数は新しい Todo アイテムを作成します。

```kt title="MainActivity"

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAmplifyAppTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Authenticator { state ->
                        Column {
                            Text(
                                text = "Hello ${state.user.username}!",
                            )
                            // highlight-start
                            Button(onClick = {
                                val todo = Todo.builder()
                                    .content("My first todo")
                                    .build()

                                Amplify.API.mutate(
                                    ModelMutation.create(todo),
                                    { Log.i("MyAmplifyApp", "Added Todo with id: ${it.data.id}")},
                                    { Log.e("MyAmplifyApp", "Create failed", it)},
                                )
                            }) {
                                Text(text = "Create Todo")
                            }
                            // highlight-end
                            Button(onClick = {
                                Amplify.Auth.signOut {  }
                            }) {
                                Text(text = "Sign Out")
                            }
                        }
                    }
                }
            }
        }
    }
}
```

次に、追加されたアイテムを表示するロジックを追加します。

```kt title="MainActivity.kt"
@Composable
fun TodoList() {
    var todoList by remember { mutableStateOf(emptyList<Todo>()) }

    LaunchedEffect(Unit) {
        // API request to list all Todos
        Amplify.API.query(
            ModelQuery.list(Todo::class.java),
            { todoList = it.data.items.toList() },
            { Log.e("MyAmplifyApp", "Failed to query.", it) }
        )
    }

    LazyColumn {
        items(todoList) { todo ->
            Row {
                // Render your activity item here
                Text(text = todo.content)
            }
        }
    }
}
```

`onCreate()` 関数から `TodoList()` を呼び出します：

```kt title="MainActivity.kt"
setContent {
    MyAmplifyAppTheme {
        // A surface container using the 'background' color from the theme
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Authenticator { state ->
                Column {
                    Text(
                        text = "Hello ${state.user.username}!",
                    )
                    ....
                    //highlight-next-line
                    TodoList()
```

### 8. リアルタイムデータの有効化

アプリケーションをビルドして再実行すると、前のビルドで作成された Todo が表示されるはずです。しかし、「create Todo」ボタンをクリックしても、アプリを再起動するまで下のリストに新しい Todo が追加されないことに気づくでしょう。これを解決するために、Todo リストにリアルタイム更新を追加しましょう。

リアルタイム更新を追加するには、Amplify Data のサブスクリプション機能を使用できます。アプリケーションの `onCreate`、`onUpdate`、`onDelete` イベントをサブスクライブできます。この例では、新しい Todo が追加されるたびにリストに追加しましょう。

```kt title="MainActivity.kt"
@Composable
fun TodoList() {
    var todoList by remember { mutableStateOf(emptyList<Todo>()) }

    LaunchedEffect(Unit) {
        Amplify.API.query(
            ModelQuery.list(Todo::class.java),
            { todoList = it.data.items.toList() },
            { Log.e("MyAmplifyApp", "Failed to query.", it) }
        )
        // highlight-start
        Amplify.API.subscribe(
            ModelSubscription.onCreate(Todo::class.java),
            { Log.i("ApiQuickStart", "Subscription established") },
            {
                Log.i("ApiQuickStart", "Todo create subscription received: ${it.data}")
                todoList = todoList + it.data
            },
            { Log.e("ApiQuickStart", "Subscription failed", it) },
            { Log.i("ApiQuickStart", "Subscription completed") }
        )
        // highlight-end
    }

    LazyColumn {
        items(todoList) { todo ->
            Row {
                // Render your activity item here
                Text(text = todo.content)
            }
        }
    }
}
```

## バックエンドの更新

各ユーザーが自分の To-do のみにアクセスできるよう、ユーザーごとの認可ルールを実装するためにバックエンドを更新しましょう。

### 9. ユーザーごとの認可の実装

まず、デプロイされたリポジトリをクローンします。

```bash title="Terminal" showLineNumbers={false}
git clone https://github.com/<github-user>/amplify-backend-template.git
cd amplify-backend-template
npm install
```
バックエンドの To-do モデルはすべてのユーザー間でデータを共有するように設定されていますが、ほとんどの場合、データはユーザーごとに分離することが望まれます。

ユーザーごとにデータを分離するには、「オーナーベースの認可ルール」を使用できます。To-do アイテムにオーナーベースの認可ルールを適用しましょう：

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
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token.
    // highlight-next-line
    defaultAuthorizationMode: 'userPool',
  },
});
```
この変更を git リポジトリにコミットします。Amplify の CI/CD システムが自動的に変更を検出してビルドとデプロイを行います。

```bash title="Terminal" showLineNumbers={false}
git commit -am "added per-user data isolation"
git push
```
### 10. アプリでのテスト

Android アプリケーションに戻って、To-do アイテムのユーザー分離をテストしてみましょう。Android Studio ターミナルで以下のコマンドを再実行して最新の `amplify_outputs.json` とモデルファイルを取得します。

<Accordion title='App ID をお探しですか？' headingLevel='4' eyebrow='Amplify コンソールで App ID を見つける'>
以下のコマンドで APP-ID を Amplify アプリ ID に置き換えてください。Amplify コンソールで確認できます。

![image](images/gen2/getting-started/appid.png)
</details>

```bash showLineNumbers={false}
npx @aws-amplify/backend-cli generate graphql-client-code --format modelgen --model-target java --out app/src/main/java --app-id <your-amplify-app-id> --branch main
```

最新の outputs 情報で `amplify_outputs` ファイルも更新します。

```bash showLineNumbers={false}
npx @aws-amplify/backend-cli generate outputs --out-dir app/src/main/res/raw --app-id <your-amplify-app-id> --branch main
```
<!-- /Platform -->

<!-- Platform: react-native -->
## 前提条件

始める前に、以下がインストールされていることを確認してください：

- [Node.js](https://nodejs.org/) v18.17 以降
- [npm](https://www.npmjs.com/) v9 以降
- [git](https://git-scm.com/) v2.14.1 以降
- [AWS アカウントの作成](https://portal.aws.amazon.com/billing/signup)も必要です。AWS Amplify は [AWS 無料利用枠](https://aws.amazon.com/amplify/pricing/)の一部であることに注意してください。
- Amplify で使用するための AWS アカウントの設定 [手順](/[platform]/start/account-setup/)。

このクイックスタートガイドでは、[Expo](https://expo.dev/) の TypeScript テンプレートを使用して Android または iOS 向けの Todo アプリケーションを構築する方法を説明します。

> **Warning:** **警告:** React Native for Web はまだ公式にサポートされていませんが、公式サポートに向けて取り組んでいます。[GitHub の issue #13918](https://github.com/aws-amplify/amplify-js/issues/13918) で進捗を追跡しています。

<Callout>

Amplify は Expo SDK では利用できないネイティブモジュールが必要になりました。そのため、Expo Go はサポートされなくなりましたが、Expo は引き続き使用できます。[Amplify v6 での Expo Go サポート終了について詳しく](/gen1/react-native/build-a-backend/troubleshooting/migrate-from-javascript-v5-to-v6/)。

</Callout>

```bash title="Terminal" showLineNumbers={false}
npx create-expo-app my_amplify_app -t expo-template-blank-typescript
cd my_amplify_app
```

> **Warning:** ネイティブライブラリとプラットフォーム依存関係を呼び出すには、対象プラットフォームのフォルダを生成するために prebuild コマンドを実行する必要があります。
> 
> ```bash title="Terminal" showLineNumbers={false}
npx expo prebuild
```

## バックエンドの作成

AWS Amplify を始める最も簡単な方法は、`create-amplify` コマンドを使用して npm 経由で行うことです。ベースプロジェクトディレクトリから実行できます。

```bash title="Terminal" showLineNumbers={false}
cd my_amplify_app
npm create amplify@latest
? Where should we create your project? (.) # press enter
```

このコマンドを実行すると、現在のプロジェクトに Amplify バックエンドファイルが以下のファイル構成でscaffold されます：

```text
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

バックエンドをデプロイするには、Amplify の開発者ごとのクラウドサンドボックスを使用します。この機能はチームの各開発者に個別のバックエンド環境を提供し、ローカル開発とテストに最適です。サンドボックス環境でアプリケーションを実行するには、以下のコマンドを実行します：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```

### 認証の追加

初期のscaffoldには、`amplify/auth/resource`.ts ファイルに事前設定済みの認証バックエンドがすでに定義されています。メールアドレスとパスワードによるログインをサポートするように設定されていますが、Google、Amazon、Sign In With Apple、Facebook など、さまざまなログインメカニズムをサポートするように拡張できます。

ログイン体験を素早く起動する最も簡単な方法は、Amplify UI ライブラリで利用可能な Authenticator UI コンポーネントを使用することです。

Authenticator を使用するには、プロジェクトに以下の依存関係を追加する必要があります：

```bash title="Terminal" showLineNumbers={false}
npm add \
  @aws-amplify/ui-react-native \
  @aws-amplify/react-native \
  aws-amplify \
  @react-native-community/netinfo \
  @react-native-async-storage/async-storage \
  react-native-safe-area-context@^4.2.5 \
  react-native-get-random-values \
  react-native-url-polyfill
```

iOS をターゲットにする場合は、以下を実行して iOS の cocoapods をインストールします：

```bash title="Terminal" showLineNumbers={false}
npx pod-install
```

次に、`App.tsx` ファイルを以下のように更新します：

```typescript
import React from "react";
import { Button, View, StyleSheet } from "react-native";

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";

import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default App;
```

Authenticator コンポーネントは認証バックエンドの設定を自動検出し、認証バックエンドの認証フローに基づいて正しい UI 状態をレンダリングします。

ローカル環境でアプリケーションを再度実行してみましょう。ログイン体験が表示されるはずです。

## データの追加

初期のscaffoldには、`amplify/data/resource.ts` ファイルに事前設定済みのデータバックエンドがすでに定義されています。デフォルトの例では、`content` フィールドを持つ Todo モデルが作成されます。

以下を追加するように変更しましょう：
- ブール型の `isDone` フィールド。
- Auth リソースを通じて認証されたオーナーが自分のレコードを「作成」、「読み取り」、「更新」、「削除」できる認可ルール。
- `defaultAuthorizationMode` を更新して、ユーザー認証トークンで API リクエストに署名します。

```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
```

次に、To-do アイテムを作成、一覧表示、削除するための UI を実装しましょう。`src` フォルダを作成し、その中に `TodoList.tsx` という新しいファイルを作成します。このページには Todo アイテムの作成、読み取り、更新、削除に関する情報が含まれます。

以下のコードをファイルにコピーして貼り付けます：

```typescript
import { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
const client = generateClient<Schema>();

const TodoList = () => {
  const dateTimeNow = new Date();
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [errors, setErrors] = useState<GraphQLError>();

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
    try {
      await client.models.Todo.create({
        content: `${dateTimeNow.getUTCMilliseconds()}`,
      });
    } catch (error: unknown) {
      if (error instanceof GraphQLError) {
        setErrors(error);
      } else {
        throw error;
      }
    }
  };

  if (errors) {
    return <Text>{errors.message}</Text>;
  }

  const renderItem = ({ item }: { item: Schema["Todo"]["type"] }) => (
    <TodoItem {...item} />
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.listItemSeparator} />
        )}
        ListEmptyComponent={() => <Text>The todo list is empty.</Text>}
        style={styles.listContainer}
      ></FlatList>
      <Button onPress={createTodo} title="Create Todo" />
    </View>
  );
};

const TodoItem = (todo: Schema["Todo"]["type"]) => (
  <View style={styles.todoItemContainer} key={todo.id}>
    <Text
      style={{
        ...styles.todoItemText,
        textDecorationLine: todo.isDone ? "line-through" : "none",
        textDecorationColor: todo.isDone ? "red" : "black",
      }}
    >
      {todo.content}
    </Text>
    <Button
      onPress={async () => {
        await client.models.Todo.delete(todo);
      }}
      title="Delete"
    />
    <Button
      onPress={() => {
        client.models.Todo.update({
          id: todo.id,
          isDone: !todo.isDone,
        });
      }}
      title={todo.isDone ? "Undo" : "Done"}
    />
  </View>
);

const styles = StyleSheet.create({
  todoItemContainer: { flexDirection: "row", alignItems: "center", padding: 8 },
  todoItemText: { flex: 1, textAlign: "center" },
  listContainer: { flex: 1, alignSelf: "stretch", padding:8 },
  listItemSeparator: { backgroundColor: "lightgrey", height: 2 },
});

export default TodoList;
```

上記のコードでは、ランダムな Todo アイテムを作成してリストに表示できます。完了としてマークしたり、リストを更新したり、その操作を元に戻したりすることができます。アイテムを削除することもできます。リスト内の各変更はサブスクリプションで監視され、すぐに画面に表示されます。

コードをより詳しく見てみると：
- `generateClient` はモデルのために必要なファイルとフォルダを生成します。
- `TodoList` コンポーネントにはサブスクリプション、作成操作、作成されたアイテムを保持するリストが含まれます。
- `TodoItem` には各 Todo アイテムに関する情報が含まれます。

最後に、`App.tsx` の `App` コンポーネントを以下のように更新します：

```typescript
const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SafeAreaView style={styles.container}>
          <SignOutButton />
          <TodoList />
        </SafeAreaView>
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  signOutButton: {
    alignSelf: "flex-end",
  },
});
```

アプリケーションを実行すると、以下の動作が確認できるはずです：

プロジェクトのクリーンアップのためにサンドボックス環境を終了できます。

### クラウドへの変更の公開

クラウドへの変更の公開にはリモート git リポジトリが必要です。Amplify はフルスタックブランチデプロイメントを提供しており、フィーチャーブランチからインフラストラクチャとアプリケーションコードの変更を自動的にデプロイできます。詳細については、[フルスタックブランチデプロイメントガイド](/[platform]/deploy-and-host/fullstack-branching/branch-deployments)をご覧ください。
<!-- /Platform -->

<!-- Platform: javascript, react-native, angular, react, vue, android, swift, flutter -->
## 🥳 成功

以上です！AWS Amplify でフルスタックアプリの構築に成功しました。Amplify の使い方についてさらに詳しく学びたい場合は、[Amplify の仕組み](/[platform]/how-amplify-works/concepts/)の概念ガイドをご覧ください。
<!-- /Platform -->

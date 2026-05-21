---
title: "手動インストール"
section: "start"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-28T20:46:05.000Z"
url: "https://docs.amplify.aws/react/start/manual-installation/"
---

AWS Amplify を始めるには、[クイックスタート](/[platform]/start/quickstart)スターターテンプレートの使用をお勧めします。ただし、まったく新しいディレクトリまたは既存のフロントエンドアプリから始める場合もあります。その場合は、[npm](https://npmjs.com) で [`create-amplify`](https://www.npmjs.com/package/create-amplify) を使用することをお勧めします。

```bash title="Terminal" showLineNumbers={false}
npm create amplify@latest
```

```console title="Terminal" showLineNumbers={false}
? Where should we create your project? (.) # press enter
```

このコマンドを実行すると、現在のプロジェクトに以下のファイルを含む軽量な Amplify プロジェクトがスキャフォールドされます。

```text
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   ├── tsconfig.json
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

必要に応じて、`create-amplify` やスターターテンプレートを使用せずに AWS Amplify を手動でインストールできます。このガイドでは、プロジェクトを初期化し、依存関係をインストールし、最初のバックエンドを作成する方法について説明します。

## 手動セットアップ

まず、選択したフロントエンドフレームワークがまだ持っていない場合は、`npm init -y` でプロジェクトの `package.json` を作成します。次に、バックエンドを構築するための Amplify 依存関係をインストールします。

```bash title="Terminal" showLineNumbers={false}
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript
```

> **Info:** **注**: TypeScript は必須ではありませんが、最適なエクスペリエンスのために推奨されます。

次に、バックエンドのエントリーポイント `amplify/backend.ts` を以下のコードで作成します。

```ts
import { defineBackend } from '@aws-amplify/backend';

defineBackend({});
```

これで `npx ampx sandbox` を実行して、最初のバックエンドを作成できます!

> **Warning:** Amplify Gen 2 では、バックエンドを [ECMAScript modules (ESM)](https://nodejs.org/api/esm.html) で使用するように構成する必要があります。`ampx sandbox` 中に以下のエラーが発生した場合は、`package.json` を `"type": "module"` で変更することを検討してください。
> 
> ```text
The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("@aws-amplify/backend")' call instead.
```
> 
> または、Amplify バックエンドディレクトリ `amplify/package.json` にローカルファイルを作成できます。
> 
> ```json
{
  "type": "module"
}
```

`define*` 関数を使用してリソースを _定義_ できます。たとえば、認証を定義できます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true
  }
});
```

またはデータリソースを定義できます。

```ts title="amplify/data/resource.ts"
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema
});
```

新たに定義されたこれらのリソースは、その後バックエンド定義にインポートされて設定されます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  data
});
```

## 既存プロジェクトのアップグレード

既存のフロントエンドアプリをアップグレードすることもできます。既存の Amplify code-first DX (Gen 2) アプリをアップグレードするには、Node.js パッケージマネージャー (例: `npm`) を使用して関連するバックエンドパッケージを更新します。

```bash title="Terminal" showLineNumbers={false}
npm update @aws-amplify/backend @aws-amplify/backend-cli
```

## 次のステップ

以下の次のステップをお勧めします。

- [認証定義の詳細を学ぶ](/[platform]/build-a-backend/auth)
- [データ定義の詳細を学ぶ](/[platform]/build-a-backend/data)
- [クラウド サンドボックスを始める](/[platform]/deploy-and-host/sandbox-environments)
- [最初のアプリをデプロイしてホストする](/[platform]/deploy-and-host/fullstack-branching)

---
title: "Amplify で Amazon Q Developer を使用する"
section: "develop-with-ai"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-04-10T19:18:13.000Z"
url: "https://docs.amplify.aws/react/develop-with-ai/q-developer/"
---

[Amazon Q Developer](https://aws.amazon.com/q/developer/) は、生成 AI を搭載した会話型アシスタントです。AWS アプリケーションの理解、構築、拡張、運用をサポートします。AWS アーキテクチャ、AWS リソース、ベストプラクティス、ドキュメント、サポートなど、さまざまなトピックについて質問できます。Amazon Q は継続的に機能を更新しており、質問に対してコンテキストに最も関連性の高いアクショナブルな回答を提供します。統合開発環境 (IDE) で使用する場合、Amazon Q はソフトウェア開発支援を提供します。Amazon Q はコードについてのチャット、インラインコード補完の提供、新規コードの生成、コードのセキュリティ脆弱性スキャン、言語更新、デバッグ、最適化などのコード改善と升級を行えます。

IDE の Q Developer は、[インラインコード提案](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/inline-suggestions.html) をリアルタイムで提供します。コードを記述すると、Amazon Q は既存のコードとコメントに基づいて自動的に提案を生成します。1 行のコードまたはコメントの入力を開始すると、Amazon Q は現在および以前の入力に基づいて提案を行います。Amazon Q 拡張機能をダウンロードすると、インラインの提案が自動的に有効になります。

## Q Developer のセットアップ

Amazon Q は Visual Studio Code の拡張機能として、また JetBrains のプラグインとして利用可能です。Amazon Q は AWS Toolkit for Visual Studio でも利用できます。詳細については、[Amazon Q Developer のインストール](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE-setup.html) を参照してください。

## Amplify プロジェクトで Q Developer を使用 - インラインコード提案

Amplify はバックエンドディレクトリに 2 つのフォルダ `auth` と `data` を生成します。これらには、各リソースの TypeScript AWS CDK 定義が含まれています。Amazon Q Developer のインラインコード提案機能を利用して、API のスキーマを構築します。

**ステップ 1:** `amplify/data/resource.ts` を開き、提供されている Todo のデフォルトスキーマをコメントアウトします。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// ...

// const schema = a.schema({
//   Todo: a
//     .model({
//       content: a.string(),
//     })
//     .authorization(allow => [allow.publicApiKey()]),
// });

// ...
```

**ステップ 2:** コメントアウトされたスキーマの下の新しい行に、自然言語を使用してスキーマを生成するコメントを入力します。例えば、`generate a restaurant model with the following fields: id, name, description, address, image, rating, style. Rating can be a float value. Authorization should allow public.` と入力します。`Enter` キーを押して新しい行に移動し、Amazon Q Developer がインラインコード提案を生成するまで待機します。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// ...

// const schema = a.schema({
//   Todo: a
//     .model({
//       content: a.string(),
//     })
//     .authorization(allow => [allow.publicApiKey()]),
// });

// highlight-start
// generate a restaurant model with the following fields: id, name, description, address, image, rating, style. Rating can be a float value. Authorization should allow public.
// highlight-end

// ...
```

**ステップ 3:** Amazon Q Developer が生成したインラインコード提案を選択します。インラインコード提案機能はスキーマ定義をサポートし、出力の上にマウスを置くと他のオプションから選択できます。

<Callout informational>

**注:** VS Code で Option+C キーボードショートカットを使用して Amazon Q Developer を手動で呼び出すことで、インラインコード提案機能をトリガーできます。その他のコマンドについては、Amazon Q 拡張機能の「コマンド」タブを参照してください。

</Callout>

**ステップ 4:** スキーマに必要な変更を加えて、`amplify/data/resource.ts` ファイルを保存します。これにより、サンドボックスのデプロイがトリガーされ、新しいデータモデルがデプロイされます。

## Amplify プロジェクトで Q Developer を使用 - ワークスペース

Amazon Q の質問に `@workspace` を追加すると、ワークスペースコードの最も関連性の高い部分が自動的に含まれます。定期的に更新されるインデックスが使用されます。`@workspace` 機能の詳細については、[Amazon Q Developer - Workspace Context](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/workspace-context.html) を参照してください。

以下のファイルは、`@workspace` コマンドと共にコンテキストとして含めることができる詳細なガイドを提供し、AWS Amplify Gen 2 コード生成の Amazon Q の精度を向上させます。

下記のステップに従い、Amplify プロジェクトで `@workspace` を使用するために、ファイルをダウンロードしてください。

- <a href="/images/gen2/q-developer/general.md" download>general.md</a>
- <a href="/images/gen2/q-developer/authentication.md" download>authentication.md</a>
- <a href="/images/gen2/q-developer/modeling-relationships.md" download>modeling-relationships.md</a>
- <a href="/images/gen2/q-developer/modeling-schema.md" download>modeling-schema.md</a>

**ステップ 1:** プロジェクトのルートにフォルダを作成し、`context` などのわかりやすい名前を付けます。上記のダウンロードされたファイルをこのフォルダに追加します。

**ステップ 2:** IDE で Amazon Q Developer Chat を開き、`@workspace` と入力してワークスペースインデックスを有効にします。プロジェクトディレクトリのインデックスを設定するために Amazon Q のプロンプトに従います。

**ステップ 3:** インデックスが正常に作成された後、Amazon Q への質問でマークダウンファイルコンテンツを参照してください。例:

```bash title="Terminal" 

@workspace follow AMPLIFYRULES to develop a data model schema for a freelance marketplace using Amplify Gen 2. Include models for freelancers, clients, projects, bids, and reviews. Use Amplify Gen 2 to fetch a list of projects

```

```bash title="Terminal" 

@workspace follow AMPLIFYRULES to design a data schema for an event management application using Amplify Gen 2. Include models for users, events, and tickets. Show me how to use Amplify Gen 2 to fetch a list of events.

```

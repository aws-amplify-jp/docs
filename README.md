# AWS Amplify Docs 日本語版

AWS Amplify 公式ドキュメントを日本語化して配信するためのリポジトリです。

このリポジトリは、翻訳済みの差分と生成済み静的ファイルを持つ wrapper です。本家ドキュメントのソースコードは Git submodule として `upstream/` に取得します。

## ディレクトリ構成

```text
.
├── docs/       # 生成済みの静的サイト
├── scripts/    # 翻訳・ビルド補助スクリプト
├── src/        # 日本語化したページ・コンポーネントの差分
└── upstream/   # 本家 aws-amplify/docs の submodule
```

## 前提

- Git
- Node.js 20 以上 22 未満
- Corepack / Yarn
- Python 3

`upstream` は本家リポジトリの前提に合わせて Node.js 20 系を使ってください。

## 初回セットアップ

```sh
git clone git@github.com:aws-amplify-jp/docs.git
cd docs
git submodule update --init --recursive
```

HTTPS で clone する場合:

```sh
git clone https://github.com/aws-amplify-jp/docs.git
cd docs
git submodule update --init --recursive
```

`upstream/` に本家 `aws-amplify/docs` のコードが入っていれば取得完了です。

```sh
git submodule status --recursive
ls upstream
```

## 生成済みサイトをローカルで確認する

このリポジトリには `docs/` に生成済みの静的サイトが入っています。

重要: `docs/index.html` は `/docs/_next/...` のようなパスでアセットを参照します。そのため `docs/` ディレクトリ単体ではなく、リポジトリ root を静的配信して `/docs/` にアクセスします。

```sh
cd docs
python3 -m http.server 4173 --bind 127.0.0.1
```

ブラウザで開く URL:

```text
http://127.0.0.1:4173/docs/
```

ポートが使用中の場合:

```sh
lsof -nP -iTCP:4173 -sTCP:LISTEN
```

別ポートで起動する場合:

```sh
python3 -m http.server 5173 --bind 127.0.0.1
```

この場合は `http://127.0.0.1:5173/docs/` を開きます。

## upstream の依存関係をインストールする

`upstream` の Next.js アプリをビルドする場合は、先に依存関係を入れます。

```sh
corepack enable
npm run submodule:install
```

直接実行する場合:

```sh
cd upstream
yarn install
```

## 翻訳を実行する

翻訳スクリプトは `upstream/src/pages` の MDX を読み、`src/pages` に出力します。

`.env.example` を参考に `.env` を作成し、Anthropic API key を設定します。

```sh
cp .env.example .env
```

```env
ANTHROPIC_API_KEY=your-api-key-here
```

翻訳 API の概算費用を確認する場合:

```sh
npm run submodule:translate:dry
```

この dry-run は翻訳ファイルを書き込まず、推定 input/output tokens と `Est. cost (Haiku)` を出力します。実際の費用は使用モデルやキャッシュ状況で変わるため、あくまで目安として確認してください。

翻訳を実行する場合:

```sh
npm run submodule:translate
```

特定ファイルだけ翻訳したい場合:

```sh
node --env-file=.env scripts/translate.mjs --file upstream/src/pages/[path]/index.mdx
```

## 日本語版をビルドする

`src/pages` と `src/components` の差分を `upstream` に反映し、`upstream` の Next.js build を実行します。

```sh
npm run submodule:build
```

このコマンドでは次を行います。

1. `src/pages/` を `upstream/src/pages/` にコピー
2. `src/components/` を `upstream/src/components/` にコピー
3. `upstream/next.config.mjs` をローカル配信用に patch
4. `upstream` で `yarn build`

ビルド結果はリポジトリ root の `docs/` に出力されます。

## upstream を更新する

本家の最新変更を取り込む場合:

```sh
npm run submodule:update
```

更新後は必要に応じて翻訳・ビルドを実行してください。

```sh
npm run submodule:translate:dry
npm run submodule:translate
npm run submodule:build
```

## よくあるトラブル

### `Address already in use`

指定ポートを別プロセスが使っています。

```sh
lsof -nP -iTCP:4173 -sTCP:LISTEN
```

不要なプロセスであれば停止するか、別ポートで起動してください。

### CSS や JavaScript が 404 になる

`docs/` ディレクトリを直接配信している可能性があります。リポジトリ root でサーバーを起動し、`/docs/` にアクセスしてください。

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

```text
http://127.0.0.1:4173/docs/
```

### `upstream/` が空

submodule が未取得です。

```sh
git submodule update --init --recursive
```

### `yarn` が見つからない

Corepack を有効化してください。

```sh
corepack enable
```

## 主な npm scripts

| コマンド | 内容 |
| --- | --- |
| `npm run submodule:init` | `upstream` submodule を取得 |
| `npm run submodule:update` | `upstream` を本家の最新に更新 |
| `npm run submodule:install` | `upstream` の依存関係を install |
| `npm run submodule:translate:dry` | 翻訳 API の概算費用を確認 |
| `npm run submodule:translate` | 翻訳を実行 |
| `npm run submodule:build` | 日本語差分を反映して静的サイトを build |
| `npm run serve` | 生成済み `docs/` を静的配信 |

`npm run serve` は `docs/` ディレクトリを直接配信します。アセットパス確認まで含めたローカル確認では、上記の Python サーバー手順を推奨します。

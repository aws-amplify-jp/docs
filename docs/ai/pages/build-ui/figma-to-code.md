---
title: "Figma-to-React"
section: "build-ui"
platforms: ["javascript", "nextjs", "react"]
gen: 2
last-updated: "2024-11-01T21:19:44.000Z"
url: "https://docs.amplify.aws/react/build-ui/figma-to-code/"
---

[Amplify UI Figmaファイル](https://www.figma.com/community/file/1047600760128127424)と[Amplify UI Builderプラグイン](https://www.figma.com/community/plugin/1040722185526429545)を使用してReactコードを生成できます。

## ステップ1: Amplify UI Figmaファイルを複製する

![「Figmaで開く」をクリックしてAWS Amplify UIキットを複製します](/images/console/ui-figma-file.png)

このファイルには、以下のページが含まれています:

- **README**: READMEページでは、Figmaファイルを使用して新しいコンポーネント、テーマプリミティブを作成し、レイアウトとスタイルをカスタマイズする方法について説明しています。
- **Theme**: テーマページには、Amplify UIがプリミティブをスタイルするために使用するテーマ値とデザイントークンが表示されます。プリミティブをテーマ化する場合は、[AWS Amplify UI Builder Figmaプラグイン](https://www.figma.com/community/plugin/1040722185526429545)を使用してテーマに変更を加えます。テーマページ自体に加えた変更は、生成されたコードには反映されません。
- **Primitives**: プリミティブは、アラート、ボタン、バッジなどのビルディングブロックコンポーネントです。これらのプリミティブは、[Amplify UIプリミティブ](https://ui.docs.amplify.aws/react/components)に対応し、すべてのプリミティブプロパティを含むコードにエクスポートされます。このページは読み取り専用です。このページのプリミティブに加えた変更は、生成されるコードには反映されません。
- **My components**: このページには、プリミティブを使用して構築されたすべてのカスタムコンポーネントが含まれています。Amplifyは、ニュースフィード、ソーシャルメディア、マーケティングヒーローコンポーネントなど、数十のコンポーネントを提供して、すぐに開始できるようにしています。これらをニーズに合わせてカスタマイズするか、独自のコンポーネントを構築します。
- **Examples**: これはデモンストレーション専用で、設計者が当社のコンポーネントを使用してページ全体を構築する方法を示しています。

コード品質を最適化するためにコンポーネントを作成する方法を学ぶには、FigmaファイルのREADMEに従ってください。

## ステップ2: Amplify UI Builder Figmaプラグインを実行する

Figmaファイルを複製した後、Amplify UI Builder Figmaプラグインを開発モードまたは非開発モードで実行して、Amplify UI Reactコードを生成します。

### 開発モード

1. Figmaファイルで開発モードをオンにします。
2. **Plugins**タブをクリックします。
3. **AWS Amplify UI Builder**プラグインを選択します。
4. ファイル内の任意のレイヤーを選択してReactコードを取得し、生成されたコードのライブプレビューを表示します。

### 非開発モード

1. **Plugins**タブをクリックします。
2. **AWS Amplify UI Builder**プラグインを選択します。
3. **Download component code**を選択して、コンポーネントのReactコードをダウンロードします。

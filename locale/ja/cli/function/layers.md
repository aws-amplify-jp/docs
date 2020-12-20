---
title: レイヤーを使用してコード & アセットを再利用する
description: Amplify CLIのLambdaレイヤー機能を使用して、コード & アセットを関数間で再利用します。
---

Lambdaレイヤーを使用すると、Lambda関数の共通コード & アセットを集中した場所に取り込むことができます。Lambdaレイヤーを使用すると、次のことができます。
1. _*あなたのコード & 資産を再利用する**: あなたのLambda 関数はこれらのレイヤーを活用して、共有コード & アセットを関数間で再利用できます。
2. _*関数の展開を加速**: ラムダ関数の反復処理は、通常、大部分の静的コンテンツを含むレイヤーから独立して更新できるため、大幅に高速化される。

> **既知の制限**: `amplify mock`を使って、レイヤーを使った機能をローカルでモックできない。 開発環境を作成し、AWS Lambdaコンソール内の機能をテストすることをお勧めします。

![ラムダ層アーキテクチャ図](~/images/layers-architecture.gif)

一般的なワークフローは以下の手順に分類されます:
1. Lambda レイヤーを作成
2. 共有コード & アセットをレイヤーに追加
3. Lambda レイヤーを関数に追加する
4. レイヤー & 関数をデプロイします

## Lambda レイヤーを作成

レイヤーを作成するには、Amplifyプロジェクトで次のコマンドを実行します。

```bash
anmpify add関数
```

追加する機能として `ラムダレイヤー` を選択してください

```console
? どの機能を追加するか選択してください:
> Lambda layer(共有コード & 関数間で使用されるリソース)
```

```console 
?Lambda レイヤーの名前を入力してください: (レイヤー名)
? 最大2つの互換性のあるランタイムを選択してください:
o JS Node
o Python
```

次に、 **レイヤー名**を指定し、 **サポートされているランタイム**を選択するワークフローをガイドします。 現在、Amplify CLIはNodeJSを、Pythonランタイムはレイヤーをサポートしています。

```console
? The current AWS account will always have access to this layer.
  Optionally, configure who else can access this layer. (Hit <Enter> to skip)
 ◯ Specific AWS accounts
 ◯ Specific AWS organization
 ◯ Public (everyone on AWS can use this layer)
```

その後、 **レイヤーの権限**の設定を求められます。

**現在のAWSアカウントは常にこのレイヤー**へのアクセス権を持ちます。 さらに、お客様は次のようにアクセス権を設定できます:
- **具体的なAWSアカウント**: AWSアカウントへのアクセスを提供するために、カンマ区切りのAWSアカウントIDのリストを提供します。
- **Specific AWS organizations**: provide a comma-separated list of AWS Organization IDs to provide access to them. *AWS Organization IDs start with `o-`.*
- **公開**: このレイヤーは誰でも AWS でもこのレイヤーを参照できます。

```console
Next steps:
Install your libraries in the following folder:
[NodeJS]: amplify/backend/function/<lambda-layer-name>/lib/nodejs/node_modules/...
[Python]: amplify/backend/function/<lambda-layer-name>/lib/python/lib/python3.8/site-packages/...

Include any files you want to share across runtimes in this folder:
amplify/backend/function/<lambda-layer-name>/opt/

"amplify function update <function-name>" - configure a function with this Lambda layer
"amplify push" builds all of your local backend resources and provisions them in the cloud
```

Lambdaレイヤーは、権限の設定後に使用する準備が整いました。


## 共有コード & アセットを追加

レイヤーの設定が完了しました `amplify/backend/function/` に `レイヤー名`が追加された新しいフォルダが表示されます。 互換性のあるランタイムのフォルダ構造はすべて自動生成されます。


### 共有コードを追加

<amplify-block-switcher>

<amplify-block name="NodeJS">

A `nodejs` folder is auto-generated for you. In there you'll find an empty `package.json` file and a `node_modules` folder. If you want to offload other node_modules you can either:
1. `cd` into the `nodejs` folder and run `npm install <required packaged>`
2. 既存の関数の `node_modules` コンテンツをレイヤーの `node_modules` フォルダーに移動します

レイヤーの `node_modules` フォルダーにある任意のノードモジュールは、ノードモジュールが関数の `node_modules` フォルダー内にあるかのように関数からアクセスできます。

*Lambda layerのNodeJS関数を活用するには、関数のコードを更新する必要もありません。*

</amplify-block>

<amplify-block name="Python">

A `python` folder is auto-generated for you. In there you'll find a skeleton folder structure to add your Python packages to. Add your packages to `lib/python3.8/site-packages` folder and then you can use it from within your Python function same as any other `import`.

</amplify-block>

</amplify-block-switcher>

### 共有アセットを追加

Any assets like large images or other files that you want to share across various functions can be placed in the `amplify/backend/function/<layer-name>/opt/` folder. Your function's code can import any assets by looking for files in the `/opt/` path.

### Lambda レイヤーバージョン

Every time `amplify push` or `amplify update function` is run, Amplify CLI checks if a layer's content has changed and automatically creates a new *layer version*. Layer versions are immutable and functions always use a specific layer version. Therefore when you want your function to leverage new changes from your layer, you have to:
1. `増幅機能` を実行する
2. `関数` の機能を選択します
3. ガイド付きワークフローに従って、最新の *レイヤーバージョン*を設定してください

In order to speed up deployments when vast amount of node_modules exist, Amplify CLI scans only for changes within each module's `package.json` file. If you don't see Amplify CLI detect your latest changes, verify that at least of your node module's `package.json` content has changed.

## 関数にレイヤーを追加

You can either create a new function and add Lambda layers by running `amplify add function` or add layers to an existing function using `amplify update function`. Select `Lambda function` when prompted and you'll be presented the following question during the guided flow:

```console
? Do you want to configure Lambda layers for this function? Yes
? Provide existing layers or select layers in this project to access from this function (pick up to 5): (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ Provide existing Lambda Layer ARNs
 ◯ myamplifylayer1
 ◯ myamplifylayer2
```

AWSに既存のレイヤーを追加するには、ARNを参照するか、以下にリストされているAmplifyプロジェクトからレイヤーを選択します。

Amplifyプロジェクトからレイヤーを追加すると、レイヤーのバージョンを選択することもできます。 Amplify CLI は、レイヤーのフォルダー内容の変更を認識することにより、Lambda レイヤーを自動的にバージョン化します。最大のレイヤーバージョン番号は最新の変更を表します。
```console
? myamplifylayer1のバージョンを選択してください:
*> 8*
  5
  3
  2
  1
```

レイヤーに重複するコンテンツがあることを考えると、レイヤーの順序が重要になります。必要に応じて次のステップでレイヤーの順序を調整できます。

```console
?レイヤーの順序を変更します:
(レイヤーが競合している場合、リストの以前のレイヤーの内容を上書きします):
- レイヤー2
- レイヤー3
- レイヤー6
- <ARN1>
- <ARN2>
```

これで、機能にレイヤーを追加できました。

## Lambda レイヤーをデプロイする & Lambda レイヤーを使用した関数

レイヤーと機能の変更が完了したら、 `push`を実行することでデプロイできます。

レイヤーのコンテンツが更新され、関連する権限がある場合 Amplify CLI は、新しいバージョンに権限を転送するかどうかを尋ねます。

```console
Content changes in Lambda layer <layer-name> detected:
Note: You need to run "amplify update function" to configure your functions with the latest layer version.
What permissions do you want to grant to this new layer version?
> The same permission as the latest layer version
> Only accessible by the current account. You can always edit this later with: amplify update function
```


<!-- When a layer's content has been modified, Amplify CLI prompts you if the functions dependent on the layer should update to the latest layer version.

```console
You've updated Lambda layers: layer1, layer2...
Do you want functions using the layers to upgrade to the latest version? (y/N)
``` -->
**注**: レイヤーの内容を更新する場合。 また、このレイヤーを使用する機能を最新バージョンに更新する必要があります。
また、機能で使用されているレイヤーバージョンを手動で設定することもできます。 `増幅機能` を実行し、 `機能` の中でガイド付きワークフローに従います。
## レイヤーの内容を更新
Any file changes within a layer's folder are automatically tracked by Amplify CLI. If there are changes available, the Amplify CLI will create a new layer version with the changes. Functions that depend on the layer will NOT automatically update to use the new layer version. You can run `amplify update function`, select `Lambda Function` and follow the walkthrough to update the layer version used by a function.
## レイヤー設定を更新
レイヤー名、ランタイムなど、任意のレイヤーの設定を更新できます。 または `amplifyの更新機能` を実行し、 `Lambda layer`を選択することによって権限を与えます。
次に、設定を更新するレイヤーを選択するように求められます。
## レイヤーを削除
Lambda レイヤーを削除するには、 `amplify 関数 remove` コマンドを実行し、 `Lambda layers`を選択します。 次に、削除するレイヤーを選択するように求められます。
> 警告: レイヤーを削除すると、それを使用するように機能を設定できなくなります。 しかし、レイヤーをすでに使用しているすべての関数は引き続きアクセスできます。

```console
? Choose the resource you would want to remove (Use arrow keys)
> function123 (function)
> function123521 (function)
> layer1223 (layer)
*>** layer1895 **(**layer**)*
> When you delete a layer version, you can no longer configure functions to use it.
> However, any function that already uses the layer version continues to have access to it.
? Are you sure you want to delete the resource? This action deletes all files related to this resource from the backend directory. (N/y)
```

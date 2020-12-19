---
title: ノードバージョンの更新
description: NodeJS 8.10 から NodeJS 10.x へのアップグレード
---

## Node.js 8.10 から Node.js 10.x
AWS Lambda [ランタイムサポートポリシー](https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html)によると、AWS Lambdaは2020年1月6日にNode.jsランタイムNode.js 8.10を廃止しました。

Amplify CLI コードベースが更新され、この変更が反映されました。Amplify CLI は Node.js 8.10 を Node に置き換えます。 s 10 あなたのために作成されるLambda 関数の中で、Amplify CLI バージョン4を使用する場合。 0.0以上で新しいawsリソースを作成するには、これはあなたに関係ありません。

ただし、Amplify CLI の以前のバージョンを使用して以下のカテゴリで AWS リソースを作成した場合。 AWS LambdaでNodeJSランタイムアップグレードの問題を回避するには、プロジェクトのアーティファクトを手動で更新する必要があります。
- 認証する
- 関数
- 相互作用

以下のマニュアルを変更する前に、必ずプロジェクト全体をバックアップしてください。

以下の手動で変更を行ったら、 `anmpify push` を実行して、クラウドのAWS Lambda機能を更新します。

### 認証する
Authカテゴリを使用すると、追加/更新認証コマンドを使用してPostAuthenticationやPostConfirmationなど、コグニトのLambdaトリガーを追加/設定できます。 Lambda トリガーは `amplify/function/<prefix><TriggerName>/src` ディレクトリの下に、関数カテゴリの一部として保存されます。

Lambda Triggersのインデックスファイルでは、 `amplify/function/<prefix><TriggerName>/src/index.js` にあります。

置換
```js
//...
const { handler } = require(`${modules[i]}`);
//...
```
と
```js
//...
const { handler } = require(`./${modules[i]}`);
//...
```

### 関数
If you use NodeJS [`require`](https://nodejs.org/dist/latest-v12.x/docs/api/modules.html#modules_require_id) to import local modules, relative path is needed to specify the local module's location. However, we have noticed that you can just use the module name to require them with `nodejs8.10` runtime on AWS Lambda Functions. But with the `nodejs10.x` runtime, it is not allowed anymore. AWS Lambda Function will throw an error complaining that it can not find the module, and you have to provide the relative path instead of just the module name to require a local module. So, if you added resources in the `function` category, and you did not specify relative path to require local modules, you need to update the code base just like the above section for the auth triggers.

### 相互作用
`<project-root>/amplify/backend/interactions/<resource-name>/src/index.js` ファイル内

置換
```js
const response = require('cfn-response');
//...
```
と
```js
const response = require('./cfn-response');
//...
```

### ランタイム文字列の置換
With the latest version of the Amplify CLI (> 4.7.0), when you execute any `amplify` command on a project initialized by CLI version prior to 4.7.0, it will prompt for your confirmation to automatically upgrade your NodeJS Lambda runtime versions, from `nodejs8.10` to `nodejs10.x` in all the CloudFormation template files under the `amplify/backend` folder. If you do not confirm, you will need to manually carry out such replacements. You can go to each category subdirectory, then each resource subdirectory under it, and locate the template file (it could be either `.yml` or `.json` file), the template file has `template` in its name. Then do a global string replacement of `nodejs8.10` to `nodejs10.x` in the file.

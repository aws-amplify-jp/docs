---
title: ビルドオプション
description: 関数がデプロイされる前にスクリプトを実行するには、Amplifyの関数カテゴリのビルドオプションを使用します。 をクリックすると、Babel を使用した Typescript または ES6 が、AWS Lambda のノードランタイムでサポートされている形式に移調されます。
---

In some cases, it might be necessary to execute a script before a function is deployed, e.g. to transpile Typescript or ES6 with Babel or with `tsc` into a format that is supported by the AWS Lambda's node runtime. `amplify push` will look for a `script` definition in the project root's `package.json` with the name `amplify:<resource_name>` and run it right after `npm install` is canned in the function resource's `src` directory.

**例: TSCによるTypescriptコードの入れ替え**

`tsc` コマンドがグローバルにインストールされていることを確認してください。 `npm install -g typescript` またはローカルで `npm install --save-dev typescript` を実行してください。

Let's say, a function resource has been created with `amplify function add` and it is called `generateReport`. The ES6 source code for this function is located in `amplify/backend/function/generateReport/lib` and the resource's `src` directory only contains the auto-generated `package.json` for this function. In order to run Babel, you have to add the following script definition to your project root's `package.json`:

```json
{
  "scripts": {
    "amplify:generateReport": "cd anplify/backend/function/generateReport && tsc -p ./tsconfig.json && cd -"
  },
}
```

`amplify/backend/function/generateReport` に移動し、 `tsconfig.json` を作成し、以下を追加します。

<!-- // spell-checker: disable -->
```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "lib": ["dom", "esnext"],
    "module": "commonjs",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./src",
    "baseUrl": "./",
    "rootDir": "./lib",
    "paths": {
      "src": ["./lib"]
    }
  }
}
```

<!-- // spell-checker: enable -->

**注意:** TypeScript ファイルで `aws-sdk` を使用している場合に注意することが重要です。 以下を指定してインポートしようとすると、タイムアウトが発生します。
```js
import AWS from 'aws-sdk';
```
以下に変更します：
```js
import * as AWS from 'aws-sdk';
```

Once you run `amplify push`, the `amplify:generateReport` script will be executed, either by `yarn` or by `npm` depending on the existence of a `yarn.lock` file in the project root directory.

**例: Babel で ES6 コードを入れ替えする**

Let's say, a function resource has been created with `amplify function add` and it is called `generateReport`. The ES6 source code for this function is located in `amplify/backend/function/generateReport/lib` and the resource's `src` directory only contains the auto-generated `package.json` for this function. In order to run Babel, you have to add the following script definition and dev dependencies to your project root's `package.json`:

```json
{
  "scripts": {
    "amplify:generateReport": "cd amplify/backend/function/generateReport && babel lib -d src && cd -"
  },
  "devDependencies": {
    "@babel/cli": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
  }
}
```

Babel needs to be configured properly so that the transpiled code can be run on AWS Lambda. This can be done by adding a `.babelrc` file to the resource folder (`amplify/backend/function/generateReport/.babelrc` in this case):

```json
{
  "presets": [
    [
      "env",
      {
        "exclude": ["transform-regenerator"],
        "targets": {
          "node": "10.18"
        }
      }
    ]
  ],
  "plugins": [
    "transform-async-to-generator",
    "transform-exponentiation-operator",
    "transform-object-rest-spread"
  ]
}
```

Once you run `amplify push`, the `amplify:generateReport` script will be executed, either by `yarn` or by `npm` depending on the existence of a `yarn.lock` file in the project root directory.

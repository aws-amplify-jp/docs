---
title: 新しいプラグインを作成中
description: プラグインを使用すると、既存の Amplify CLI に追加のコマンドと機能を追加できます。プラグインパッケージの作成、公開、使用方法について学びます。
---  

The Amplify CLI provides the command `amplify plugin init` (with alias `amplify plugin new`) for the development of plugins. This command first collects requirements, and then creates the skeleton of the plugin package for you to start the development. The newly created plugin is added to your local Amplify CLI plugin platform, so you can conveniently test its functionalities while it is being developed. It can be easily removed form the local plugin platform with the `amplify plugin remove` command, and added back with the `amplify plugin add` command.

### ステップ 1: Amplify CLI のインストール

<amplify-block-switcher>

<amplify-block name="NPM">

```bash
npm install -g @aws-amplify/cli
```

</amplify-block>

<amplify-block name="cURL (Mac and Linux)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
```

</amplify-block>

<amplify-block name="cURL (Windows)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
```

</amplify-block>

</amplify-block-switcher>

### ステップ 2: プラグインを初期化

```bash
anplify plugin init
```

プラグイン名を入力し、プラグインの種類、およびイベントサブスクリプションを選択するように求められます。 CLIは次に、あなたのためのプラグインパッケージを作成し、ローカルAmplifyのCLIプラグインプラットフォームに追加します。

### ステップ 3: プラグインをテストする

新しく作成されたプラグインパッケージは既にローカルAmplifyのCLIに追加されているため、すぐにテストを開始できます。 デフォルトのプラグイン名を使用するように選択したとしましょう: `my-amplify-plugin`

```console
$ amplify my-amplify-plugin help
help command to be implemented.
```

デフォルトのヘルプメッセージが印刷されていることがわかります。 この時点で、プラグインパッケージには2つのサブコマンドしかありません。 `help` and `version`, with dummy implementations. 他のコマンドを実行しようとすると、Amplify CLI プラグインプラットフォームがトリガーされ、新しいスキャンが実行されます。 コマンドが見つからないとデフォルトのヘルプメッセージが出力されます

ここからプラグインパッケージの開発を始めることができます。パッケージ構造の詳細については、以下を参照してください。

### ステップ 4: NPM に公開

After the completion of one development cycle and you are ready to release your plugin to the public, you can publish it to the NPM: [https://docs.npmjs.com/getting-started/publishing-npm-packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)

### ステップ 5: インストールして使用

プラグインがNPMに公開されると、他の開発者がインストールして使用できます。

```bash
npm install -g my-amplify-plugin
増幅プラグイン add my-amplify-plugin
amplify my-amplify-plugin help
```

## プラグインパッケージ構造

以下はプラグインパッケージディレクトリ構造です。

```md
 |_my-amplify-plugin/
    |_commands/
    |   |_ help.js
    |   |_ version.js
    |
    |_event-handlers
    |   |_handle-PostInit.js
    |   |_handle-PostPush.js
    |   |_handle-PreInit.js
    |   |_handle-PrePush.js
    |
    |_amplify-plugin.json
    |_index.js
    |_package.json
```

### anplify-plugin.json

`amplify-plugin.json` ファイルはプラグインのマニフェストファイルで、プラグインの名前、型、コマンド、およびイベントハンドラを指定します。 Amplify CLI は、プラグインパッケージを検証し、プラグインプラットフォームに追加するためにそれを使用します。

util プラグインの `増幅プラグイン init` コマンドによって最初に生成されたファイルの内容は次のとおりです。

```json
 {
    "name": "my-amplify-plugin",
    "type": "util",
    "commands": [
        "version",
        "help"
    ],
    "eventHandlers": [
        "PreInit",
        "PostInit",
        "PrePush",
        "PostPush"
    ]
}
```

### index.js

The `"main"` file specified in the `package.json` is the Amplify CLI's entry to invoke the plugin's functionalities specified in the manifest file `amplify-plugin.json`.

util プラグインの `増幅プラグイン init` コマンドによって最初に生成されたファイルの内容は次のとおりです。

```js
const path = require('path');

async function executeAmplifyCommand(context) {
  const commandsDirPath = path.normalize(path.join(__dirname, 'commands'));
  const commandPath = path.join(commandsDirPath, context.input.command);
  const commandModule = require(commandPath);
  await commandModule.run(context);
}

async function handleAmplifyEvent(context, args) {
  const eventHandlersDirPath = path.normalize(path.join(__dirname, 'event-handlers'));
  const eventHandlerPath = path.join(eventHandlersDirPath, `handle-${args.event}`);
  const eventHandlerModule = require(eventHandlerPath);
  await eventHandlerModule.run(context, args);
}

module.exports = {
  executeAmplifyCommand,
  handleAmplifyEvent,
};
```

### コマンド

`コマンド` フォルダには、マニフェストファイル `amplify-plugin.json` で指定された `コマンド` を実装するファイルが含まれています。

### event-handlers

`event-handlers` フォルダには、マニフェストファイル `amplify-plugin.json` で指定された `eventHandlers` を実装するファイルが含まれています。

<inline-fragment src="~/cli/plugins/fragments/custom-transformer.md"></inline-fragment>
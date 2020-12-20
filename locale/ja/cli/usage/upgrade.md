---
title: CLI のアップグレード
description: npm install -g @aws-amplify/cli を実行して、Amplify CLI を最新の状態に保ちます。
---  

Amplify CLI チームは継続的に新機能をプッシュします。 機能強化とセキュリティの改善、そしてあなたまたはあなたのチームが使用しているAmplify CLIバージョンを最新バージョンに更新することをお勧めします。 npm で Amplify CLI の最新リリースを追跡できます - https://www.npmjs.com/package/@aws-amplify/cli

以下の手順に従って、CLI の最新バージョンに更新してください。

1. 端末に次のコマンドを入力します:
    ```bash
    npm install -g @aws-amplify/cli
    ```
2. CLI に次のコマンドを入力して、最新の CLI バージョンのインストールに成功したことを確認します。
    ```bash
    amplify -v
    ```
    そして、Amplify CLIのインストール済みバージョンを確認します。CLIの最新バージョンはこちらから - https://www.npmjs.com/package/@aws-amplify/cli
3. 次のコマンド `cd <Project-Filepath>`を使用して、Amplifyプロジェクトフォルダに移動します。 有効なAmplifyプロジェクトフォルダであるかどうかを確認するには、CLIに次のコマンドを入力します。
    ```bash
    増幅の状態
    ```
    有効なAmplifyプロジェクトフォルダである場合 AmplifyはAWSクラウドにデプロイしたプロジェクトフォルダ内のリソースの一覧を表示します。
4. 更新されたセキュリティ設定でバックエンドリソースを更新するか、CLIに次のコマンドを入力して改善します:
    ```bash
    push --force を増幅する
    ```
    確認のプロンプトが表示されたら、Enterキーを押すか、Yキーを入力します。設定の更新が適用されたことを検証するには、次の結果を探します。
    ```console
    ✔すべてのリソースがクラウドで更新されます 
    ```
5. 複数のAWS Amplifyプロジェクトフォルダがある場合は、各プロジェクトフォルダについてステップ **#3** と **#4** を繰り返してください。
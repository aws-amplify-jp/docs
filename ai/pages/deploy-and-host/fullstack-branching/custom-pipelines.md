---
title: "カスタムパイプライン"
section: "deploy-and-host/fullstack-branching"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-08-02T20:32:56.000Z"
url: "https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/"
---

Amplify CI/CD でビルドすると、ゼロコンフィグセットアップ、フルスタックプレビュー、一元的なシークレット管理などのメリットが得られますが、Amplify Gen 2 ではカスタムパイプライン (AWS CodePipeline、Amazon CodeCatalyst、GitHub Actions など) にフルスタック CI/CD を簡単に統合できます。

## バックエンド デプロイメントのセットアップ

次の手順に従ってバックエンド デプロイメントをセットアップできます。

1.  Git リポジトリからフルスタック Gen 2 ブランチを接続して、Amplify アプリを作成します。これはワンタイム セットアップです。以降のデプロイメントでは、カスタム パイプラインを使用します。

2.  ブランチの自動ビルドを無効にします。これにより、ブランチへのコードコミットがビルドをトリガーしなくなります。

3. Amplify ビルド仕様ファイルを更新して、`npx ampx generate outputs --branch $AWS_BRANCH --app-id $AWS_APP_ID` を追加し、`pipeline-deploy` スクリプトをコメントアウトします。`ampx pipeline-deploy` はバックエンドの更新をデプロイするスクリプトを実行し、`ampx generate outputs` は指定された環境の最新の `amplify_outputs.json` をフェッチします。

![custom-ci](/images/gen2/fullstack-branching/custom-ci.png)

4. パイプラインプロバイダーに移動し、ビルド設定を更新して以下を含めます。
    * `npm ci` を実行します。
    * `export CI=1` を実行して、デプロイメント スクリプトが CI 環境であることを伝えます。
    * `npx ampx pipeline-deploy --branch BRANCH_NAME --app-id AMPLIFY_APP_ID` を実行します。`BRANCH_NAME` はデプロイ対象のブランチを指し、`AMPLIFY_APP_ID` は Amplify App ID です。バックエンド アプリケーションの `App ID` を確認するには、Amplify コンソールに移動して **backend-app** を選択します。Overview ページで、`App ID` がプロジェクト名の下に表示されます。

以下の例は、Amazon CodeCatalyst を使用する際のビルド仕様のセットアップ方法を示しています。

```yaml
Actions:
  Build_82:
    # アクションを識別します。この値は変更しないでください。
    Identifier: aws/build@v1.0.0
    # アクションへの入力として渡すソースおよび/またはアーティファクトを指定します。
    Inputs:
      # オプション
      Sources:
        - WorkflowSource # これはアクションがソースとしてこのワークフローを必要とすることを指定します
      Variables:
        - Name: BRANCH_NAME
          Value: main
        - Name: AMPLIFY_APP_ID
          Value: #####
    Configuration:
      # 必須 - ステップはシェルコマンドを実行する順序付き命令です
      Steps:
        - Run: export CI=1
        - Run: npm ci
        - Run: npx ampx pipeline-deploy --branch $BRANCH_NAME --app-id $AMPLIFY_APP_ID
```
5. ブランチに `git push` をトリガーします。ビルドログに AWS CloudFormation デプロイメントが進行中であることが表示されるはずです。

## フロントエンド デプロイメントのセットアップ

フルスタック CI/CD セットアップを完了する場合は、バックエンドに加えてフロントエンドをビルド、デプロイ、ホストする必要があります。

1. Amplify コンソールを使用して、[incoming webhook](https://docs.aws.amazon.com/amplify/latest/userguide/webhooks.html) を作成します。

2. フロントエンドアプリに移動し、**Hosting > Build settings** で **Create webhook** を選択します。webhook に **name** を指定し、incoming webhook リクエストでビルドする **target branch** を選択します。

![Amplify コンソールの Build settings ページのスクリーンショット、incoming webhooks 機能を表示](/images/gen2/fullstack-branching/multirepo5.png)

3. 次に、webhook を選択し、フロントエンドアプリのビルドをトリガーするために使用される `curl` コマンドをコピーします。

![Amplify コンソールの Incoming webhooks ページのスクリーンショット、新しく作成された webhook を表示](/images/gen2/fullstack-branching/multirepo6.png)

4. ここで、カスタムパイプラインのビルド設定を更新して、`pipeline-deploy` が成功した後にフロントエンドビルドをトリガーする `curl` コマンドを含めます。上記と同じ Amazon CodeCatalyst の例を使用すると、このステップは以下を含みます。

``` yaml
    Configuration:
      # 必須 - ステップはシェルコマンドを実行する順序付き命令です
      Steps:
        - Run: export CI=1
        - Run: npm ci
        - Run: npx ampx pipeline-deploy --branch $BRANCH_NAME --app-id $AMPLIFY_APP_ID
        - Run: if [ $BRANCH_NAME = "main" ]; then curl -X POST -d {}
            "https://webhooks.amplify.us-west-2.amazonaws.com/prod/webhooks?id=WEBHOOK-ID&token=TOKEN&operation=startbuild"
            -H "Content-Type:application/json"; fi
```

4. これにより、Amplify アプリケーションでビルドがトリガーされます。Amplify CI は最初にブランチの `amplify_outputs.json` を生成し、その後フロントエンドをビルド、デプロイ、ホストします。

---
title: "ブランチ間でリソースを共有する"
section: "deploy-and-host/fullstack-branching"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-07-08T18:10:40.000Z"
url: "https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/share-resources/"
---

場合によっては、すべてのブランチに対して新しいリソースをデプロイしたくないことがあります。例えば、すべての `feature` ブランチが `dev` ブランチによってデプロイされたバックエンドリソースをポイントして、シードデータ、ユーザー、グループを再利用することができます。

![メインと開発環境。各環境は独自のバックエンドリソースを持ちます。開発環境では、2つのフィーチャーブランチが同じバックエンドリソースを共有しています。](/images/gen2/fullstack-branching/share-resources.png)

アプリケーションのビルド設定を更新して、ブランチ間でリソースを共有できます。Amplify コンソールから **App overview** ページに移動し、**Hosting** の下の **Build settings** を選択して、アプリケーションのビルド仕様 YAML ファイルを表示します。

![Amplify コンソールの Build settings ページのビルド仕様 YAML ファイル。](/images/gen2/fullstack-branching/build-settings.png)

`backend` フェーズのビルド設定を更新して `npx ampx generate outputs --branch dev app-id $AWS_APP_ID` を実行し、`main` または `dev` 以外のすべてのブランチの `amplify_outputs.json` ファイルを生成します。この更新後、新しくデプロイされたブランチはビルドの一部としてバックエンドリソースをデプロイしなくなり、代わりに `dev` ブランチからデプロイされたバックエンドリソースを使用します。
`backend` フェーズのビルド設定を更新して `npx ampx generate outputs --branch dev app-id $AWS_APP_ID` を実行し、`main` または `dev` 以外のすべてのブランチの `amplify_outputs.json` ファイルを生成します。この更新後、新しくデプロイされたブランチはビルドの一部としてバックエンドリソースをデプロイしなくなり、代わりに `dev` ブランチからデプロイされたバックエンドリソースを使用します。

```yaml title="amplify.yml"
version: 1
backend:
    phases:
        build:
            commands:
                - 'npm ci --cache .npm --prefer-offline'
                - 'echo $AWS_BRANCH'
                - |
                  case "${AWS_BRANCH}" in
                      main)
                          echo "Deploying main branch..."
                          npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                          ;;
                      dev)
                          echo "Deploying dev branch..."
                          npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                          ;;
                      pr-*)
                          echo "Deploying pull request branch..."
                          npx ampx generate outputs --branch previews --app-id $AWS_APP_ID
                          ;;
                      *)
                          echo "Deploying to staging branch..."
                          npx ampx generate outputs --branch dev --app-id $AWS_APP_ID
                          ;;
                  esac
frontend:
    phases:
        build:
            commands:
                - 'npm run build'
    artifacts:
        baseDirectory: .next
        files:
            - '**/*'
    cache:
        paths:
            - .next/cache/**/*
            - .npm/**/*
            - node_modules/**/*
```

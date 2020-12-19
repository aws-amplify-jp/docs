---
title: 複数のフロント
description: '同じAmplifyバックエンドを複数のフロントエンドで共有する方法を学びましょう (例: React と Android アプリ)。'
---

Use the `amplify pull` command to share the same Amplify backend across multiple frontends (e.g, a React and Android app). Users have an option to pull the entire backend definition (infrastructure templates and metadata) or only the metadata (e.g. the `aws-exports.js` or `amplifyconfiguration.json` file) required to connect to the backend. If you’re building a mobile and web app in separate repositories, the recommended workflow is to keep the backend definition (the amplify folder) in only one of the repositories and pull the metadata (the `aws-exports` or `amplifyconfiguration.json` file) in the second repository to connect to the same backend.

## ワークフロー

このワークフローは、バックエンドを 2 つ(またはそれ以上) フロントエンドで共有するために必要な手順を概説します。 このシナリオは、Android と React アプリケーションを構築するチーム向けのシナリオです。

![画像](~/images/multiple-frontends.png)

1. React アプリケーションのバックエンドを初期化します。 これにより、Amplifyコンソールからアクセス可能なAmplifyプロジェクトとバックエンド環境が作成されます( `amplifyコンソール`を実行)。

    ```console
        $ cd my-react-app
        $ amplify init
        ? Enter a name for the project: ecommerce
        ? Choose the type of app that you're building: react
        $ amplify add api
        $ amplify push
    ```
    2. フロントエンドの変更を行い、コードを Git にコミットします。 Git リポジトリに、インフラストラクチャの定義を含む `増幅` フォルダが保存されます。

    3. Reference the backend from your Android app using the `amplify pull` command. Choose 'No' when asked if you want to modify or add new categories to your backend. This will put the `amplifyconfiguration` to your src folder only. Choosing 'Yes' will work, however your backend definition will now be stored in two separate repositories leading to unintended consequences with multiple sources of truth.

    ```console
      cd my-android-app
      amplify pull
        ? Which app are you working on?
          > ecommerce
            mysecretproject
        ? Choose the type of app that you're building: #android
        ? Do you plan on modifying this backend?: #n
      Successfully pulled backend environment dev from the cloud.
      Run 'amplify pull' to sync upstream changes.
    ```

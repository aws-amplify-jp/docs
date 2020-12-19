---
title: 既存の Cognito ユーザプールとアイデンティティプールを使用する
description: Amplify CLI を既存の Amazon Cognito User Pool と Identity Pool リソースを認証 & 他のAmplifyカテゴリの認証メカニズムとして使用するように設定します。 (API、ストレージなど)
---

Import existing Amazon Cognito resources into your Amplify project. Get started by running `amplify import auth` command to search for & import an existing Cognito User Pool & Identity Pool in your account.

```sh
implifyインポート認証を増幅する
```

`implify import auth` コマンドは以下のようになります。
* Amplifyライブラリ設定ファイル(aws-exports.js、anplifyconfiguration.json)に、選択したAmazon Cognitoリソース情報を自動的に入力します。
* 認証 & 認証メカニズムとして指定された既存のCognitoリソースを提供します (API、ストレージなど)
* Lambda関数が選択されたCognitoリソースにアクセスできるようにします。

インポートプロセスを完了するために、 `anmpify push` を実行し、このバックエンドの変更をクラウドにデプロイしてください。

この機能は、以下のような場合に特に便利です:
* 既存のユーザーベースの Amplify カテゴリ (API、ストレージ、機能など) を有効にします。
* アプリケーションスタックに Amplify を徐々に採用します。
* Amplifyで作業中にCognitoリソースを独自に管理します。

## 既存の Cognito ユーザプールをインポート

Select the "Cognito User Pool only" option when you've run `amplify import auth`. In order to successfully import your User Pool, your User Pools require at least two app clients with the following conditions:
- *少なくとも 1 つの "Webアプリクライアント"*: クライアントの秘密がないアプリ クライアント ****
- *At least one "Native app client*": an app client **with** a client secret

`amplify push` を実行してインポート手順を完了します。

## 既存のアイデンティティプールをインポート

Select the "Cognito User Pool and Identity Pool" option when you've run `amplify import auth`. In order to successfully import your Identity Pool, it must have both of the User Pool app clients fulfilling [these requirements](#import-an-existing-cognito-user-pool) associated as an authentication provider.

あなたのアイデンティティプールが必要:
- アイデンティティプールと信頼関係を持つ認証済みロール
- **** Amplifyカテゴリにゲストユーザーアクセスを使用する場合は、任意のformat@@2 認証されていないロール。 (例:S3バケットまたはREST APIエンドポイントのゲストアクセス)

これらのロールは通常、「認証されていない」アクセスを有効にする新しいIdentity Poolを作成し、認証プロバイダとしてCognitoユーザプールを持つ場合に自動的に設定されます。

Amplify CLI will update the policies attached to the roles to ensure Amplify categories function correctly. For example, enabling Storage for authenticated & guest users will add private, protected, public, read and upload permissions for the S3 bucket to the unauthenticated & authenticated role.

`amplify push` を実行してインポート手順を完了します。

## マルチ環境のサポート

`amplify env add`を使用して新しい環境を作成するとき。 Amplify CLI は、デフォルトで、Amplify プロジェクト以外でアプリケーションの Cognito リソースを管理していると仮定します。 別のCognitoリソースをインポートするか、アプリの認証カテゴリに同じCognitoリソースを維持するかを尋ねられます。

If you want to have Amplify manage your auth resources in a new environment, run `amplify remove auth` to unlink the imported Cognito resource and `amplify add auth` to create new Amplify-managed auth resources in the new environment.

## 既存の Cognito ユーザープールまたはアイデンティティプールのリンクを解除する

既存のCognitoリソースのリンクを解除するには、 `remove auth`を増幅してください。 Amplifyプロジェクトから参照されているCognitoリソースのリンクを解除します。Cognitoリソース自体は削除されません。

`amplify push` を実行して、リンク解除の手順を完了します。

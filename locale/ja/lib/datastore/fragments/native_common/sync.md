
アプリケーションに満足したら、プロジェクトからバックエンドをプロビジョニングすることで、クラウドと同期を開始できます。 DataStoreはリモートバックエンドに接続し、データプロトコルとしてGraphQLを使用してローカルに保存されたすべてのデータを自動的に同期することができます。

<amplify-callout>

**ベストプラクティス:** 最初はクラウド同期を有効にせずに開発することをお勧めします。これにより、プロビジョニングされたバックエンドを更新することなく、アプリケーションが形になるため、スキーマを変更することができます。 データスキーマの安定性に満足したら、 以下に示すようにクラウド同期をセットアップし、ローカルに保存されたデータは自動的にクラウドに同期されます。

</amplify-callout>

## クラウド同期のセットアップ

オフラインデータとオンラインデータの同期は難しい場合があります。 DataStoreの目標は、アプリケーションコードからその負担を軽減し、ローカルとリモートの間のすべてのデータの一貫性と調整を処理することです。 開発者は自分のアプリケーションロジックに焦点を当てています ここまでは、オフラインで動作し、データ永続化フレームワークから期待されるすべての機能を備えたローカルデータストアを設定することに焦点を当てました。

次のステップは、ローカルに保存されたデータが [AWS AppSync](https://aws.amazon.com/appsync/) を搭載したクラウドバックエンドと同期されていることを確認することです。

<inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/sync/10-installPlugin.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/sync/10-installPlugin.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/sync/10-installPlugin.md"></inline-fragment>

### バックエンドをクラウドにプッシュする

これで、 [はじめに](~/lib/datastore/getting-started.md) ガイドで説明されているように、競合検出を有効にしたバックエンドを作成する必要があります。

**Check the status of the backend** to verify if it is already provisioned in the cloud.

```console
増幅の状態
```

このようなテーブルが見えるはずです。

```plain
| Category | リソース名 | Operation | Provider プラグイン |
| ----------------- | ---------------- | ----------------------------- |
| api | amplifyDatasource | No Change | awscloudforming |
```

<amplify-callout>

**Troubleshooting:** if `amplify status` gives you an error saying *"You are not working inside a valid Amplify project"*, make sure you run `amplify init` before the next step.

</amplify-callout>

`Operation` が `Create` or `Update` と表示される場合、 **バックエンドをクラウドにプッシュ** する必要があります。

```console
push を増幅する
```

<amplify-callout warning>

**AWS credentials needed.** At this point an AWS account is required. If you have never run `amplify configure` before, do it so and follow the steps to configure Amplify with your AWS account. Details can be found in the [Configure the Amplify CLI](~/cli/start/install.md#configure-the-amplify-cli) guide.

</amplify-callout>

## 既存のバックエンド

DataStore can connect to an existing AWS AppSync backend that has been deployed from another project, no matter the platform it was originally created in. In these workflows it is best to work with the CLI directly by running an `amplify pull` command from your terminal and then generating models afterwards, using the process described in the [Getting started](~/lib/datastore/getting-started.md#idiomatic-persistence-models) guide.

このワークフローの詳細については、 [複数のFrontendsドキュメント](~/cli/teams/multi-frontend.md) を参照してください。

<inline-fragment platform="js" src="~/lib/datastore/fragments/native_common/sync-distributed-data.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/native_common/sync-distributed-data.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/native_common/sync-distributed-data.md"></inline-fragment>

## ローカルデータを消去

`Amplify.DataStore.clear()` provides a way for you to clear all local data if needed. This is a destructive operation but the **remote data will remain intact**. When the next sync happens, data will be pulled into the local storage again and reconstruct the local data.

`clear()` の一般的な用途の一つは、同じデバイスを共有する異なるユーザーを管理すること、あるいは開発時のユーティリティとしても使用されます。

<amplify-callout warning>

**Note:** In case multiple users share the same device and your schema defines user-specific data, make sure you call `Amplify.DataStore.clear()` when switching users. Visit [Auth events](~/lib/auth/auth-events.md) for all authentication related events.

</amplify-callout>

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/sync/40-clear.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/sync/40-clear.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/sync/40-clear.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/sync/40-clear.md"></inline-fragment>

これは単純でありながら効果的な例です。 ただし、 実際のシナリオでは、異なるユーザーが `signedIn` の場合にのみ、 `clear()` を呼び出して、同じユーザーの繰り返しサインインに対するデータベースのクリアを避けることをお勧めします。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/sync/50-selectiveSync.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/sync/50-selectiveSync.md"></inline-fragment>

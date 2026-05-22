---
title: "アプリのアンインストール"
section: "frontend/analytics"
platforms: ["android", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/app-uninstall/"
---

<!-- Platform: android -->
AnalyticsやAuthなどの一部のAmplifyカテゴリは、ローカルデバイスにデータを永続化します。このアプリケーションデータは、ユーザーがデバイスからアプリケーションをアンインストールすると削除されます。

[Android Auto Backup for Apps](https://developer.android.com/guide/topics/data/autobackup)サービスが有効になっている場合、このサービスはアプリケーションデータを復元しようとします。

Amplify Authは、認証データを永続化する際に[EncryptedSharedPreferences](https://developer.android.com/reference/androidx/security/crypto/EncryptedSharedPreferences)を使用します。アプリケーションがアンインストールされると、EncryptedSharedPreferencesファイルの作成に使用される[Android Keystore](https://developer.android.com/training/articles/keystore)キーが削除されます。アプリケーションを再インストールすると、Android Keystoreからのキー削除により、これらの復元されたファイルは読み取り可能ではなくなります。

EncryptedSharedPreferencesのこの制限により、アプリケーションの再インストール時に認証情報を復元することはできません。ユーザーは再度認証する必要があります。
<!-- /Platform -->

<!-- Platform: swift -->
Analytics、Auth、DataStoreなどの一部のAmplifyカテゴリは、ローカルデバイスにデータを永続化します。そのデータの一部は、ユーザーがデバイスからアプリをアンインストールすると自動的に削除されます。

Amplifyは認証情報をローカル[システムキーチェーン](https://developer.apple.com/documentation/security/keychain_services)に保存します。これは、アプリがアンインストールされたときにデータが削除されるかどうかについて、特定の動作を保証しません。

この認証情報をいつクリアするかを決定することはSDKが汎用的な方法では実行できないため、アプリ開発者はサインアウトしてデータをクリアするタイミングを決定する必要があります。これを実現するための1つの戦略は、[UserDefaults](https://developer.apple.com/documentation/foundation/userdefaults)を使用してアプリが初めて起動されているかどうかを検出し、アプリが以前に起動されていない場合は[`Auth.signOut()`](/[platform]/frontend/auth/sign-out/)を呼び出すことです。
<!-- /Platform -->

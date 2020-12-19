---
title: 概要
description: Amplify CLI は、ログインオプションのシンプルで高度な構成を含む、さまざまな認証および承認ワークフローの設定をサポートしています。 さまざまなライフサイクルイベント中に Lambda 関数をトリガーし、必要に応じてアプリケーションに公開できる管理アクションを実行します。
---


Amplify CLI は、ログインオプションのシンプルで高度な構成を含む、さまざまな認証および承認ワークフローの設定をサポートしています。 さまざまなライフサイクルイベント中に Lambda 関数をトリガーし、必要に応じてアプリケーションに公開できる管理アクションを実行します。

## ソーシャルプロバイダなしで認証を設定する

最も簡単な方法は、最も一般的なユースケースや選択肢に最適化されたデフォルトの設定を活用することです。

```bash
amplify add auth ##"amplify update auth" がすでに設定されている場合、認証を追加
```

```console
デフォルトの認証とセキュリティ設定を使用しますか？ 
<unk> Default configuration 
  Default configuration with Social Provider (Federation) 
  Manual configuration 
  詳細を知りたい。
```

## ソーシャルプロバイダで認証を設定する

ユーザープールが機能すると、Facebook、Google、Amazonでログインなどのより多くの設定を有効にできます。 *手動設定* を選択することで、より詳細な設定を行うこともできます。

```bash
amplify add auth ##"amplify update auth" がすでに設定されている場合、認証を追加
```

ソーシャルプロバイダ(Federation)でデフォルト設定を選択します。

```console
デフォルトの認証とセキュリティ設定を使用しますか？
  デフォルト設定
<unk> ソーシャルプロバイダ(Federation)によるデフォルト設定
  手動設定
  詳細を知りたい。
```

各ソーシャルプロバイダの追加については、 [ドキュメントの Librariesセクション](https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-your-auth-provider) に詳細が記載されています。

## 既存の Cognito ユーザプールとアイデンティティプールを再利用する

Amplify CLI に新しい認証リソースのセットを作成させる代わりに、既存の Cognito リソースをインポートすることもできます。 これらのリソースは、Amplifyライブラリ構成ファイルを自動生成するために使用できます。 他のカテゴリの認証依存性として使用され、Lambda関数内からのアクセス許可を提供しました。

`を実行する import auth` を増幅するか、既存の Cognito リソース [をインポートする方法については](~/cli/auth/import.md) ガイドを参照してください。
---
title: 方向
description: Amplify CLI は、カスタムインデックス、認可ルール、関数トリガーなどの追加機能をスキーマに強化するために GraphQL ディレクティブを提供します。
---

Amplify CLI は、カスタムインデックス、認可ルール、関数トリガーなどの追加機能をスキーマに強化するために GraphQL ディレクティブを提供します。

## Amplify-provided ディレクティブ

- [`@model`: Amazon DynamoDBにバックアップされたAPIでトップレベルのオブジェクトタイプを定義します。](~/cli/graphql-transformer/model.md)
- [`@key`: @model 型のカスタムインデックス構造を設定](~/cli/graphql-transformer/key.md)
- [`@auth`: @model タイプとフィールドの認証ルールを定義します。](~/cli/graphql-transformer/auth.md)
- [`@connection`: @model 型間の 1:1, 1:M と N:M の関係を定義する](~/cli/graphql-transformer/connection.md)
- [`@function`: フィールドの Lambda 関数リゾルバを設定する](~/cli/graphql-transformer/function.md)
- [`@http`: フィールドの HTTP リゾルバを設定](~/cli/graphql-transformer/http.md)
- [`@予測`: Amazon Rekognition、Amazon Translate、Amazon PollyなどのAI/MLサービスのオーケストレーションをクエリする](~/cli/graphql-transformer/predictions.md)
- [`@searchable`: Elasticsearch にストリーミングすることで、データを検索可能にします。](~/cli/graphql-transformer/searchable.md)
- [`@versioned`: @model タイプのバージョン管理と競合解決戦略を定義する](~/cli/graphql-transformer/versioned.md)

## サードパーティのディレクティブ
- [`@ttl`: AWS Amplify APIの古いエントリを自動削除するためにDynamoDBのライブまでの時間を有効にする](https://github.com/flogy/graphql-ttl-transformer)

> あなた自身の変圧器 & ディレクティブを作成しますか？ [あなた自身の変圧器 & ディレクティブを作成する方法](~/cli/plugins/authoring.md#authoring-custom-graphql-transformers--directives)のガイドをご覧ください。
---
title: 生成されたリソースにタグを適用する
description: Amplify生成されたAWSリソースをCLIでタグ付けして整理する方法を学びます。
---

タグは、リソースの管理、検索、フィルタリングを容易にするキーと値のペアで構成されるラベルです。一般的なユースケースには以下のものがあります:
* リソース組織
* コスト割り当て
* オペレーションサポート
* アクセスコントロール
* セキュリティリスク管理

タグの動作についてはこちら [](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)をご覧ください。また、タグ付けのベストプラクティスについてはこちら [](https://d1.awsstatic.com/whitepapers/aws-tagging-best-practices.pdf) をご覧ください。

## 新しいプロジェクトでタグを設定する

`amplify init`を実行すると、 `tags.json` ファイルが `anplify/backend/` ディレクトリ内に自動的に生成され、定義済みのタグが含まれます。

ファイルの構造は次のとおりです。
```json
[
  {
    "Key": "user:Stack",
    "Value": "{project-env}"
  },
  {
    "Key": "user:Application",
    "Value": "{project-name}"
  }
]
```
**Note:** For projects created before CLI version 4.28.0. Creating a `tags.json` file under `amplify/backend/` directory with the desired tags will ensure tags being applied to existing resources after invoking `amplify push`.

## 定義済み変数の使用

定義済みのタグにより、現在のプロジェクトに関する情報をより具体的に扱うことができます。 あなたに正しいと感じるものに応じてタグを組み立てる機会を与えているのです

定義済みの2つのタグは以下のとおりです。

* {project-env} - プロジェクト環境（例：prod、env、etc）
* {project-name} - 現在のプロジェクト名を参照 (例: mytestプロジェクト)


これらのタグ変数を使用することができる多くの異なるケースがあります。 これは、それらをどのように組み合わせて使用することができ、出力がどのようになるかの例です。

```json
[{
    "Key": "myawesomekey",
    "Value": "myvalue-{project-name}-{project-env}"
}]
```

プッシュされると、リソースは次のように変換されます:
```json
[{
    "Key": "myawesomekey",
    "Value": "myvalue-myamplifyproject-dev"
}]
```

タグの値は必須ではないため、空にすることができます。
```json
[{
    "Key": "MY_TAG_KEY",
    "Value": ""
}]
```

## タグの追加と更新

`タグに追加タグを追加または更新できます。 son <code> ファイル自体を編集して、` フォルダ内の `amplify/` ファイル。 ファイルはJSON形式でなければならず、この構造に従う必要があります。

```json
[{
    "Key": “MY_TAG_KEY”,
    "Value": “MY_TAG_VALUE"
}]
```

AmplifyプロジェクトからAWSリソースを更新するには、 `amplify push`を実行します。

## 制限

* `anplify/backend/tags.json` ファイルには、最大 50 個のタグしか追加できません。
* タグキーと値は大文字と小文字を区別します。
* 重複タグキーは許可されていません。

<amplify-callout>

タグ付け規則に関する制限および制限の詳細については、 [このリンク](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) をご覧ください。

</amplify-callout>

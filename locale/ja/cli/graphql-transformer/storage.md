---
title: GraphQL変換とストレージ
description: GraphQLトランスフォーム、Amplify CLI、Amplify Libraryを使用すると、Amazon S3を使用した複雑なオブジェクトサポートをアプリケーションに簡単に追加できます。
---

GraphQLトランスフォーム、Amplify CLI、Amplify Libraryを使用すると、Amazon S3を使用した複雑なオブジェクトサポートをアプリケーションに簡単に追加できます。

### 基本

S3オブジェクトのサポートを追加する手順は以下のとおりです。

**`増幅してストレージを追加する`を介してファイルを保持するAmazon S3バケットを作成します。**

**Amazon Cognito でユーザープールを作成する `増幅して auth` を追加します。**

**`amplify add api` を使用して GraphQL API を作成し、次の種類の定義を追加します。**

```
type S3Object {
  bucket: String!
  region: String!
  key: String!
}
```

**いくつかの `@model` 型から S3Object 型を参照する。**

```
type Picture @model @auth(rules: [{allow: owner}]) {
  id: ID!
  name: String
  owner: String

  # Reference the S3Object type from a field.
  file: S3Object
}
```

GraphQL Transform は関連する入力タイプの作成を処理し、Amazon DynamoDB の S3 オブジェクトへのポインタを格納します。 AppSync の SDK と Amplify ライブラリのハンドルは、ファイルを S3 に透過的にアップロードします。

**クライアントアプリから S3 オブジェクトを使用して変更を実行します。**

```
mutation ($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    name
    visibility
    owner
    createdAt
    file {
      region
      bucket
      key
    }
  }
}
```

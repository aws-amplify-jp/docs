---
title: バージョン管理と競合解像度
description: '@versioned ディレクティブはオブジェクトのバージョン管理と競合の解決を型に追加します。'
---

## @バージョニング

The `@versioned` directive adds object versioning and conflict resolution to a type. Do not use this directive when leveraging DataStore as the conflict detection and resolution features are automatically handled inside AppSync and are incompatible with the `@versioned` directive.

### 定義

```graphql
OBJECTの@versioned(versionField: String = "version", versionInput: String = "expectedVersion")
```

### 使用法

`@versioned` を、 `@model` とともに注釈付けられた型に追加して、オブジェクトのバージョン管理と型の競合検出を可能にします。

```graphql
type Post @model @versioned {
  id: ID!
  title: String!
  version: Int!   # <- If not provided, it is added for you.
}
```

**投稿を自動的に作成すると、バージョンが 1 に設定されます。**

```graphql
mutation Create {
  createPost(input:{
    title:"Conflict detection in the cloud!"
  }) {
    id
    title
    version  # will be 1
  }
}
```

**ポストを更新するには、オブジェクトの最後の保存バージョンである「expectedVersion」を渡す必要があります。**

> 注意: オブジェクトを更新する場合、バージョン番号は自動的に増分されます。

```graphql
mutation Update($postId: ID!) {
  updatePost(
    input:{
      id: $postId,
      title: "Conflict detection in the cloud is great!",
      expectedVersion: 1
    }
  ) {
    id
    title
    version # will be 2
  }
}
```

**ポストを削除するには、オブジェクトの最後の保存バージョンである「expectedVersion」を渡す必要があります。**

```graphql
matterDelete($postId: ID!) {
  deletePost(
    input: {
      id: $postId,
      expectedVersion: 2
    }
  ) {
    id
    title
    version
  }
}
```

Update and delete operations will fail if the **expectedVersion** does not match the version stored in DynamoDB. You may change the default name of the version field on the type as well as the name of the input field via the **versionField** and **versionInput** arguments on the `@versioned` directive.

### 生成

`@versioned` ディレクティブはリゾルバのマッピングテンプレートを操作し、バージョン管理されたオブジェクトに `version` フィールドを保存します。

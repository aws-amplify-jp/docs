---
title: 承認を持つモデル
description: より細かい粒子認可アクセスチェックを使用してモデルをDataStoreが処理する方法の詳細については、こちらをご覧ください。
---

In order to configure fine grain authorization controls with Datastore, use the `@auth` directive to specify ownership and permissible operations (create, update, delete, read) on a specific type. More information can be found on the @auth directive in the [GraphQL Transformer documentation](~/cli/graphql-transformer/auth.md).

<amplify-callout>

**注意:** この API は開発中であり、リリースされていません。

</amplify-callout>

<inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/auth-model.md"></inline-fragment>

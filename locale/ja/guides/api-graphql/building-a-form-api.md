---
title: GraphQL を使用したフォーム API のビルド
description: GraphQL でページネーションを実装する方法
---

このガイドでは、Amplifyを使用してフォームAPIを構築し、対話する方法を学びます。

私たちが作成するAPIは、基本的なコンタクトフォーム用です。 フォームは、ユーザーが自分の名前と電話番号を入力し、連絡先のリストをクエリすることができます。

### はじめに

始めるには、新しいAmplifyプロジェクトを作成します。

```sh
amplify init

# 環境名とデフォルトのテキストエディタを選択します。
# 残りの質問に対してデフォルトの回答を行い、このプロジェクトで使用するAWSプロファイルを選択します。
```

次に、GraphQL API を作成します。

```sh
amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: contactapi
? Choose the default authorization type for the API API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365
? Do you want to configure advanced settings for the GraphQL API: No, I am done.
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields
? Do you want to edit the schema now? Yes
```

The CLI should open the GraphQL schema, located at __amplify/backend/api/contactapi/schema.graphql__, in your text editor. Update the schema with the following and save the file:

```graphql
type Contact @model(mutations: {
  create: "createContact"
}) {
  id: ID!
  name: String!
  phone: String!
}
```

<amplify-callout>

In the above schema, we've overriding the default mutations and are specifying that only the `createContact` mutation be allowed to be created. By this this, the API does not allow users to update or delete contacts. For more fine grained authorization rules, check out the [@auth directive](~/cli/graphql-transformer/auth.md).

</amplify-callout>

次に、APIをデプロイします。

```sh
amplify push --y
```

### APIの操作

新しい連絡先を作成するには、 `createContact` の変更を使用できます。

```graphql
<unk> createContact {
  createContact(input: {
    name: "Chris"
    phone: "+1-555-555555"
  }) {
    id
    name
    phone
  }
}
```

連絡先のリストをクエリするには、 `listContacts` クエリを使用できます。

```graphql
query listContacts {
  listContacts {
    items {
      id
      name
      phone
    }
  }
}
```

<inline-fragment platform="js" src="~/guides/api-graphql/fragments/js/building-a-form-api.md"></inline-fragment>

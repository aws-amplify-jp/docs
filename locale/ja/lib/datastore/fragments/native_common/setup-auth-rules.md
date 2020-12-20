Amplifyは、作成する個人またはグループにアクセスできるようにする機能を提供します。 `@auth` ディレクティブを指定することで、型のデータの読み取り、更新、削除を行うことができます。

Amplifyライブラリでサポートされている認可シナリオの概要を以下に示します。 各シナリオには、アプリケーションのニーズに合わせて調整できるオプションがあります。

* [**Owner Based Authorization**](#owner-based-authorization): モデルインスタンスのアクセスを "owner" に制限し、それらの所有者に対する認可ルールを定義する。 Backed by Cognito User Pool.
* [**Static Group Authorization**](#static-group-authorization): モデルインスタンスの特定のユーザーグループへのアクセスを制限し、そのグループの認可ルールを定義する。 Cognitoユーザープールによるバックエンド。
* [**Owner and Static Group Combined**](#owner-and-static-group-combined): *Owner Based Authorization* と *Static Group Authorization* を組み合わせて、所有権とアクセスを制御します。
* [**公開承認**](#public-authorization): モデルインスタンスへの公開アクセスを許可する。APIキーまたはIAMによってバックアップされる。
* [**プライベート認証**](#private-authorization): サインインしたすべてのユーザーがモデルインスタンスにアクセスできるようにします。
* [**OIDC プロバイダー**](#owner-based-authorization-with-oidc-provider): サードパーティーの OIDC プロバイダーを使用して、 *オーナーベースの承認* を達成します。
* [**OIDC プロバイダー**](#static-group-authorization-with-oidc-provider): カスタム *groupClaim* を使用して、サードパーティの OIDC プロバイダーを使用して、 `静的グループの承認` を達成します。

## 一般的に使用されている `@auth` ルールパターン

### 所有者による承認

以下は、所有者による承認のための一般的なパターンです。 これらの例をチューニングする方法の詳細については、 [CLI ドキュメントを参照してください owner based authorization](~/cli/graphql-transformer/auth.md#owner-authorization).

* 変更の作成/読み取り/更新/削除は所有者には非公開です。
```graphql
type YourModel @model @auth(rules: [{ allow: owner }]) {
  ...
}
```

* オーナーは & 削除することができます。他のユーザーは更新や読むことができます。
```graphql
type YourModel @model @auth(rules: [{ allow: owner,
                                   operations: [create, delete]}]) {
  ...
}
```

### 静的グループ認証
以下は一般的に静的グループ承認のパターンです。 これらの例をチューニングする方法の詳細については、静的グループ承認に関する [CLI ドキュメント](~/cli/graphql-transformer/auth.md#static-group-authorization) を参照してください。

* 「管理者」グループに所属するユーザーは、CRUD (作成、読み取り、更新、および削除)、他のユーザーは何もアクセスできません。
```graphql
type YourModel @model @auth(rules: [{ allow: groups,
                                      groups: ["Admin"] }]) {
  ...
}
```

* 「管理者」グループに属するユーザーはCRUD、他のユーザーは問い合わせおよび更新できます。
```graphql
type YourModel @model @auth(rules: [{ allow: groups,
                                       groups: ["Admin"],
                                   operations: [create, delete] }]) {
  ...
}
```

### オーナーとスタティックグループの結合
オーナーと静的グループの承認を組み合わせるために、以下のパターンが一般的に使用されます。 これらの例をチューニングする方法の詳細については、静的グループ承認に関する [CLI ドキュメント](~/cli/graphql-transformer/auth.md#static-group-authorization) を参照してください。

* Users have their own data, but users who belong to the `Admin` group have access to their data and anyone else in that group.  Users in the `Admin` group have the ability to make mutation on behalf of users not in the `Admin` group
```graphql
type YourModel @model @auth(rules: [{ allow: owner },
                                      { allow: groups: ["Admin"]}]) {
  ...
}
```

### パブリック認証
以下は一般的に公開CRUD認証のパターンです。 これらの例をチューニングする方法の詳細については、静的グループ承認に関する [CLI ドキュメント](~/cli/graphql-transformer/auth.md#static-group-authorization#public-authorization) を参照してください。

* 認証プロバイダはAPIキーで、すべてのデータはパブリックCRUD
```graphql
type YourModel @model @auth(rules: [{ allow: public }]) {
  ...
}
```

* 認証プロバイダはIAMであり、すべてのデータはパブリックCRUD
```graphql
type YourModel @model @auth(rules: [{ allow: public, provider: iam }]) {
  ...
}
```

### プライベート認証
以下は私的承認のための一般的なパターンである。 これらの例をチューニングする方法の詳細については、静的グループ承認に関する [CLI ドキュメント](~/cli/graphql-transformer/auth.md#static-group-authorization#private-authorization) を参照してください。

* Cognitoユーザープール認証済みユーザーは、誰が作成したかにかかわらず、すべての投稿をCRUDすることができます。ゲストユーザーはアクセス権を持っていません。
```graphql
type YourModel @model @auth(rules: [{ allow: private }]) {
  ...
}
```
* IAM 認証されたユーザーは、誰が作成したかにかかわらず、すべての投稿をCRUD することができます。ゲストユーザーにはアクセス権がありません。
```graphql
type YourModel @model @auth(rules: [{ allow: private, provider: iam }]) {
  ...
}
```

### OIDCプロバイダーによるオーナーベースの承認
以下は、サードパーティ製のOIDCプロバイダー(Facebook、Googleなど)を使用した所有者による認証のために一般的に使用されるパターンです。 これらの例をチューニングする方法の詳細については、静的グループ承認に関する [CLI ドキュメント](~/cli/graphql-transformer/auth.md#authorization-using-an-oidc-provider) を参照してください。

* サードパーティ製のOIDCプロバイダを使用して、所有者に基づく承認を達成します。
```graphql
type YourModel @model @auth(rules: [{ allow: owner,
                                     provider: oidc,
                                identityClaim: "sub" }]) {
  ...
}
```

<inline-fragment platform="android" src="~/lib/datastore/fragments/android/setup-auth-rules/owner_based_auth_oidc.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/setup-auth-rules/owner_based_auth_oidc.md"></inline-fragment>

### OIDCプロバイダーによる静的グループ認証
The following are commonly used patterns for using `groupClaims` to achieve group based authorization using a 3rd party OIDC provider. For more information on how to tune these examples, please see the [CLI documentation on static group authorization](~/cli/graphql-transformer/auth.md#custom-claims).

* `groupClaim` のカスタム値を使用して、サードパーティ製の OIDC プロバイダによる静的なグループ承認を実現します。
```graphql
type YourModel @model @auth(rules: [{ allow: groups
                                     provider: oidc
                                       groups: ["Admin"]
                                   groupClaim: "https://myapp.com/curs/groups"
                                      }]) {
  ...
}
```

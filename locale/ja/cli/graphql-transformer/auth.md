---
title: 認証ルールのセットアップ
description: データへのアクセスを制御するために、GraphQLスキーマに許可ルールを追加します。
---

## @auth

Authorization is required for applications to interact with your GraphQL API. **API Keys** are best used for public APIs (or parts of your schema which you wish to be public) or prototyping, and you must specify the expiration time before deploying. **IAM** authorization uses [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) to make request with policies attached to Roles. OIDC tokens provided by **Amazon Cognito User Pools** or 3rd party OpenID Connect providers can also be used for authorization, and simply enabling this provides a simple access control requiring users to authenticate to be granted top level access to API actions. You can set finer grained access controls using `@auth` on your schema which leverages authorization metadata provided as part of these tokens or set on the database items themselves.

`@auth` object types that are annotated with `@auth` are protected by a set of authorization rules giving you additional controls than the top level authorization on an API. You may use the `@auth` directive on object type definitions and field definitions in your project's schema.

When using the `@auth` directive on object type definitions that are also annotated with `@model`, all resolvers that return objects of that type will be protected. When using the `@auth` directive on a field definition, a resolver will be added to the field that authorize access based on attributes found in the parent type.

### 定義

```graphql
# When applied to a type, augments the application with
# owner and group-based authorization rules.
directive @auth(rules: [AuthRule!]!) on OBJECT | FIELD_DEFINITION
input AuthRule {
  allow: AuthStrategy!
  provider: AuthProvider
  ownerField: String # defaults to "owner" when using owner auth
  identityClaim: String # defaults to "username" when using owner auth
  groupClaim: String # defaults to "cognito:groups" when using Group auth
  groups: [String]  # Required when using Static Group auth
  groupsField: String # defaults to "groups" when using Dynamic Group auth
  operations: [ModelOperation] # Required for finer control

  # The following arguments are deprecated. It is encouraged to use the 'operations' argument.
  queries: [ModelQuery]
  mutations: [ModelMutation]
}
enum AuthStrategy { owner groups private public }
enum AuthProvider { apiKey iam oidc userPools }
enum ModelOperation { create update delete read }

# The following objects are deprecated. It is encouraged to use ModelOperations.
enum ModelQuery { get list }
enum ModelMutation { create update delete }
```

> 注意: 演算引数は、「クエリ」と「変異」の引数を置き換えるために追加されました。 「クエリ」と「変異」の引数は引き続き機能しますが、「操作」に移行することをお勧めします。 両方が与えられている場合、'operations' 引数は 'queries' よりも優先されます。

### 所有者の権限

デフォルトで、 `所有者` の承認を有効にすると、任意のサインインしたユーザーがレコードを作成できます。

```graphql
# The simplest case
type Post @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  title: String!
}

# The long form way
type Post
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "owner", operations: [create, update, delete, read] },
    ])
{
  id: ID!
  title: String!
  owner: String
}
```

<amplify-callout>

オーナー認証を有効にするには、 **Amazon Cognito User Pools** の認証タイプをアプリで有効にする必要があります。

</amplify-callout>

オーナー権限は、ユーザーがオブジェクトに対してアクセスまたは操作できるかどうかを指定します。 これを行うには 各オブジェクトは所有者情報を格納し、リゾルバ実行中に様々な方法で検証される `ownerField` (デフォルトでは `owner` がオブジェクトに追加されます) を取得します。

`operations` 引数を使用して、有効にする操作を次のように指定できます。

- **read**: ユーザーが API に対してクエリ (`get` and `list` operations) を実行できるようにします。
- **create**: `ownerField` としてログインしたユーザーの身元を自動的に注入します。
- **update**: 保存されている `ownerField` が署名されているユーザと同じであることをチェックする条件付き更新を追加。
- **delete**: 保存されている `ownerField` が署名されているユーザーと同じであることをチェックする条件付き更新を追加します。

`create` の操作ルールが明示的に指定されているか、またはデフォルトから推定されていることを確認して、所有者の身元がレコードで保存されていることを確認しなければなりません。

```graphql
# owner identity inferred from defaults on every object
type Post @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  title: String!
}

# owner identity specified explicitly on every object
type Post @model @auth(rules: [{ allow: owner, operations: [create] }]) {
  id: ID!
  title: String!
}

# owner identity not stored on objects
type Post @model @auth(rules: [{ allow: owner, operations: [read] }]) {
  id: ID!
  title: String!
}
```

<amplify-callout>

`@auth` ルールの一部として操作を指定すると、リストに含まれていない操作はデフォルトでは保護されません。

</amplify-callout>


いくつかの例を見てみましょう。

```graphql
type Todo @model
  @auth(rules: [{ allow: owner }]) {
  id: ID!
  updatedAt: AWSDateTime!
  content: String!
}
```

In this schema, only the owner of the object has the authorization to perform read (`getTodo` and `listTodos`), update (`updateTodo`), and delete (`deleteTodo`) operations on the owner created object. This prevents the object from being updated or deleted by users other than the creator of the object.

ユーザーがどの操作を実行することが許可されている表を示します。 **owner** はオブジェクトを作成したユーザーを指します。 **other** は他のすべての認証済みユーザーを参照します。

|     | getTodo | listTodos | createTodo | updateTodo | deleteTodo |
|:--- |:-------:|:---------:|:----------:|:----------:|:----------:|
| 所有者 |    ✅    |     ✅     |     ✅      |     ✅      |     ✅      |
| その他 |    ❌    |     ❌     |     ✅      |     ❌      |     ❌      |

次に、オブジェクトの所有者のみが更新または削除できるようにスキーマを変更したいとします。 認証されたユーザがオブジェクトを読むことを許可します。

```graphql
type Todo @model
  @auth(rules: [{ allow: owner, operations: [create, delete, update] }]) {
  id: ID!
  updatedAt: AWSDateTime!
  content: String!
}
```

In this schema, only the owner of the object has the authorization to perform update (`updateTodo`) and delete (`deleteTodo`) operations on the owner created object, but anyone can read them (`getTodo`, `listTodos`). This prevents the object from being updated or deleted by users other than the creator of the object while allowing all authenticated users of the app to read them.

ユーザーがどの操作を実行することが許可されている表を示します。 **owner** はオブジェクトを作成したユーザーを指します。 **other** は他のすべての認証済みユーザーを参照します。

|     | getTodo | listTodos | createTodo | updateTodo | deleteTodo |
|:--- |:-------:|:---------:|:----------:|:----------:|:----------:|
| 所有者 |    ✅    |     ✅     |     ✅      |     ✅      |     ✅      |
| その他 |    ✅    |     ✅     |     ✅      |     ❌      |     ❌      |

次に、オブジェクトの所有者のみが削除できるようにスキーマを変更したいとします。 誰でも作成、読み、更新ができます

```graphql
type Todo @model
  @auth(rules: [{ allow: owner, operations: [create, delete] }]) {
  id: ID!
  updatedAt: AWSDateTime!
  content: String!
}
```

In this schema, only the owner of the object has the authorization to perform delete operations on the owner created object, but anyone can read or update them. This is because `read` and `update` aren't specified as owner-only actions, so all users are able to perform them. Since `delete` is specified as an owner only action, only the object's creator can delete the object.

ユーザーがどの操作を実行することが許可されている表を示します。 **owner** はオブジェクトを作成したユーザーを指します。 **other** は他のすべての認証済みユーザーを参照します。

|     | getTodo | listTodos | createTodo | updateTodo | deleteTodo |
|:--- |:-------:|:---------:|:----------:|:----------:|:----------:|
| 所有者 |    ✅    |     ✅     |     ✅      |     ✅      |     ✅      |
| その他 |    ✅    |     ✅     |     ✅      |     ✅      |     ❌      |


### 複数の承認ルール

単一の `@model` 型に複数の所有ルールを適用することもできます。

For example, imagine you have a type **Draft** that stores unfinished posts for a blog. You might want to allow the **Draft's** owner to `create`, `update`, `delete`, and `read` **Draft** objects. However, you might also want the **Draft's editors** to be able to update and read **Draft** objects.

このユースケースを許可するには、次のタイプの定義を使用できます。

```graphql
type Draft @model
  @auth(rules: [
    # Defaults to use the "owner" field.
    { allow: owner },

    # Authorize the update mutation and both queries.
    { allow: owner, ownerField: "editors", operations: [update, read] }
  ]) {
  id: ID!
  title: String!
  content: String
  owner: String
  editors: [String]
}
```

### 突然変異を伴う所有者

The ownership authorization rule will automatically fill ownership fields unless told explicitly not to do so. To show how this works, lets look at how the create mutation would work for the **Draft** type above:

```graphql
mutterCreateDraft {
  createDraft(input: { title: "A new draft" }) {
    id
    title
    owner
    editors
  }
}
```

この変更を呼び出すと、私は `someuser@my-domain.com`としてログインしていると仮定します。結果は次のようになります。

```json
{
    "data": {
        "createDraft": {
            "id": "...",
            "title": "A new draft",
            "owner": "someuser@my-domain.com",
            "editors": ["someuser@my-domain.com"]
        }
    }
}
```

The `Mutation.createDraft` resolver is smart enough to match your auth rules to attributes and will fill them in be default. If you do not want the value to be automatically set all you need to do is include a value for it in your input.

例えば、リゾルバが **owner** を自動的に設定しますが、 **エディタ**ではない場合、次のように実行します。

```graphql
mutation CreateDraft {
  createDraft(
    input: {
      title: "A new draft",
      editors: []
    }
  ) {
    id
    title
    owner
    editors
  }
}
```

これは以下のように戻ります:

```json
{
    "data": {
        "createDraft": {
            "id": "...",
            "title": "A new draft",
            "owner": "someuser@my-domain.com",
            "editors": []
        }
    }
}
```

カスタム **エディター**のリストを指定するには、次を実行できます。

```graphql
mutation CreateDraft {
  createDraft(
    input: {
      title: "A new draft",
      editors: ["editor1@my-domain.com", "editor2@my-domain.com"]
    }
  ) {
    id
    title
    owner
    editors
  }
}
```

これは以下のように戻ります:

```json
{
    "data": {
        "createDraft": {
            "id": "...",
            "title": "A new draft",
            "owner": "someuser@my-domain.com",
            "editors": ["editor1@my-domain.com", "editor2@my-domain.com"]
        }
    }
}
```

**owner** に同じ変更を試みることはできますが、作成しようとしているオブジェクトの所有者ではなくなったため、 **不正な** 例外がスローされます。

```graphql
mutation CreateDraft {
  createDraft(
    input: {
      title: "A new draft",
      editors: [],
      owner: null
    }
  ) {
    id
    title
    owner
    editors
  }
}
```

### 静的グループの承認

Static group authorization allows you to protect `@model` types by restricting access to a known set of groups. For example, you can allow all **Admin** users to create, update, delete, get, and list Salary objects.

```graphql
type Salary @model @auth(rules: [{ allow: groups, groups: ["Admin"] }]) {
  id: ID!
  wage: int
  currency: String
}
```

When calling the GraphQL API, if the user credential (as specified by the resolver's `$ctx.identity`) is not enrolled in the *Admin* group, the operation will fail.

To enable advanced authorization use cases, you can layer auth rules to provide specialized functionality. To show how you might do that, let's expand the **Draft** example you started in the **Owner Authorization** section above. When you last left off, a **Draft** object could be updated and read by both its owner and any of its editors and could be created and deleted only by its owner. Let's change it so that now any member of the "Admin" group can also create, update, delete, and read a **Draft** object.

```graphql
type Draft @model
  @auth(rules: [
    # Defaults to use the "owner" field.
    { allow: owner },

    # Authorize the update mutation and both queries.
    { allow: owner, ownerField: "editors", operations: [update] },

    # Admin users can access any operation.
    { allow: groups, groups: ["Admin"] }
  ]) {
  id: ID!
  title: String!
  content: String
  owner: String
  editors: [String]!
}
```

### 動的グループ認証

```graphql
# Dynamic group authorization with multiple groups
type Post @model @auth(rules: [{ allow: groups, groupsField: "groups" }]) {
  id: ID!
  title: String
  groups: [String]
}

# Dynamic group authorization with a single group
type Post @model @auth(rules: [{ allow: groups, groupsField: "group" }]) {
  id: ID!
  title: String
  group: String
}
```

With dynamic group authorization, each record contains an attribute specifying what groups should be able to access it. Use the *groupsField* argument to specify which attribute in the underlying data store holds this group information. To specify that a single group should have access, use a field of type `String`. To specify that multiple groups should have access, use a field of type `[String]`.

Just as with the other auth rules, you can layer dynamic group rules on top of other rules. Let's again expand the **Draft** example from the **Owner Authorization** and **Static Group Authorization** sections above. When you last left off editors could update and read objects, owners had full access, and members of the admin group had full access to **Draft** objects. Now you have a new requirement where each record should be able to specify an optional list of groups that can read the draft. This would allow you to share an individual document with an external team, for example.

```graphql
type Draft @model
  @auth(rules: [
    # Defaults to use the "owner" field.
    { allow: owner },

    # Authorize the update mutation and both queries.
    { allow: owner, ownerField: "editors", operations: [update] },

    # Admin users can access any operation.
    { allow: groups, groups: ["Admin"] }

    # Each record may specify which groups may read them.
    { allow: groups, groupsField: "groupsCanAccess", operations: [read] }
  ]) {
  id: ID!
  title: String!
  content: String
  owner: String
  editors: [String]!
  groupsCanAccess: [String]!
}
```

この設定では、"BizDev" グループで読み込めるオブジェクトを作成できます。

```graphql
mutation CreateDraft {
  createDraft(input: {
    title: "A new draft",
    editors: [],
    groupsCanAccess: ["BizDev"]
  }) {
    id
    groupsCanAccess
  }
}
```

そして、「マーケティング」グループによって読むことができる別のドラフト:

```graphql
mutation CreateDraft {
  createDraft(input: {
    title: "Another draft",
    editors: [],
    groupsCanAccess: ["Marketing"]
  }) {
    id
    groupsCanAccess
  }
}
```

### `パブリック` 認証

```graphql
# 最もシンプルなケース
type Post @model @auth(rules: [{ allow: public }]) {
  id: ID!
  title: String!
}
```

The `public` authorization specifies that everyone will be allowed to access the API, behind the scenes the API will be protected with an API Key. To be able to use `public` the API must have API Key configured. For local execution, this key resides in the file `aws-exports.js` for the JavaScript library and `amplifyconfiguration.json` for Android and iOS under the key `aws_appsync_apiKey`.

```graphql
# プロバイダがオーバーライドするパブリック認証
type Post @model @auth(rules: [{ allow: public, provider: iam }]) {
  id: ID!
  title: String!
}
```

@auth ディレクティブにより指定された認証モードのデフォルトプロバイダを上書きすることができます。 上記のサンプルでは、Cognito Identity Poolsから「認証されていないロール」を使用してパブリックアクセスできるプロバイダとして指定されています。 APIキーの代わりに。 増幅と組み合わせて使用すると、CLI がスコープダウンIAM ポリシーを自動的に生成し、「認証されていない」ロールに追加します。

### `プライベート` 認証

```graphql
# 最もシンプルなケース
type Post @model @auth(rules: [{ allow: private }]) {
  id: ID!
  title: String!
}
```

The `private` authorization specifies that everyone will be allowed to access the API with a valid JWT token from the configured Cognito User Pool. To be able to use `private` the API must have Cognito User Pool configured.

```graphql
# プロバイダがオーバーライドするプライベート認証
type Post @model @auth(rules: [{ allow: private, provider: iam }]) {
  id: ID!
  title: String!
}
```

@auth ディレクティブにより指定された認証モードのデフォルトプロバイダを上書きすることができます。 上記のサンプルでは、Cognito Identity Poolsからプライベートアクセスに「認証ロール」を使用できるプロバイダとして指定されています。 増幅と組み合わせて使用すると、認証された役割に対して、CLI がスコープダウンの IAM ポリシーを自動的に生成します。

### `oidc` プロバイダを使用した承認

```graphql
# owner authorization with provider override
type Profile @model @auth(rules: [{ allow: owner, provider: oidc, identityClaim: "sub" }]) {
  id: ID!
  displayNAme: String!
}
```

By using a configured `oidc` provider for the API, it is possible to authenticate the users against it. In the sample above, `oidc` is specified as the provider for the `owner` authorization on the type. The field `identityClaim: "sub"` specifies that the `"sub"` claim from your JWT token is used to provider ownership instead of the default `username` claim, which is used by the Amazon Cognito JWT.


### 複数の認証タイプを結合する

Amplify GraphQL API には、プライマリ **デフォルトの** 認証タイプがあり、オプションで追加の二次認証タイプがあります。 GraphQL スキーマのオブジェクトとフィールドには、アプリケーションで構成されている認証タイプに基づいて異なる認証プロバイダが割り当てられたルールがあります。

複数の認証ルールの最も一般的なシナリオの1つは、パブリックアクセスとプライベートアクセスを組み合わせることです。 例えば、blogs は一般的に投稿を見るための公開アクセスを許可しますが、投稿の作成者のみがその投稿を更新または削除できます。

パブリックアクセスとプライベートアクセスを組み合わせる方法を見てみましょう。

```graphql
type Post @model
  @auth (
    rules: [
      # allow all authenticated users ability to create posts
      # allow owners ability to update and delete their posts
      { allow: owner },

      # allow all authenticated users to read posts
      { allow: private, operations: [read] },

      # allow all guest users (not authenticated) to read posts
      { allow: public, operations: [read] }
    ]
  ) {
  id: ID!
  title: String
  owner: String
}
```

<amplify-callout>

上記のスキーマは、 **Amazon Cognito User Pools** と **API キー** の認証タイプの組み合わせを想定しています

</amplify-callout>

Let's take a look at another example. Here the `Post` model is protected by Cognito User Pools by default and the `owner` can perform any operation on the `Post` type. You can also call `getPosts` and `listPosts` from an AWS Lambda function if it is configured with the appropriate IAM policies in its execution role.

```graphql
type Post @model
  @auth (
    rules: [
      { allow: owner },
      { allow: private, provider: iam, operations: [read] }
    ]
  ) {
  id: ID!
  title: String
  owner: String
}
```

<amplify-callout>

上記のスキーマは、 **Amazon Cognito User Pools** と **IAM** の認証タイプの組み合わせを想定しています。

</amplify-callout>

### 許可された認証モードとプロバイダの組み合わせ

次の表に許可モードとプロバイダの組み合わせを示します。

|          | 所有者 | グループ | 公開 | 非公開 |
|:-------- |:---:|:----:|:--:|:---:|
| userPool |  ✅  |  ✅   |    |  ✅  |
| oidc     |  ✅  |  ✅   |    |     |
| apiKey   |     |      | ✅  |     |
| iam      |     |      | ✅  |  ✅  |

`グループ` は Cognito ユーザー・プールを活用していますが、プロバイダの割り当てが不要/可能であることに注意してください。

### カスタムの請求

`@auth` supports using custom claims if you do not wish to use the default `username` or `cognito:groups` claims from your JWT token which are populated by Amazon Cognito. This can be helpful if you are using tokens from a 3rd party OIDC system or if you wish to populate a claim with a list of groups from an external system, such as when using a [Pre Token Generation Lambda Trigger](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html) which reads from a database. To use custom claims specify `identityClaim` or `groupClaim` as appropriate like in the example below:

```graphql
type Post
@model
@auth(rules: [
    { allow: owner, identityClaim: "user_id" },
    { allow: groups, groups: ["Moderator"], groupClaim: "user_groups" }
])
{
  id: ID!
  owner: String
  postname: String
  content: String
}
```

In this example the object owner will check against a `user_id` claim. Similarly if the `user_groups` claim contains a "Moderator" string then access will be granted.

<amplify-callout>

メモ `identityField` は `identityClaim` で非推奨になっています。

</amplify-callout>

### サブスクリプションを承認中

<amplify-callout warning>

Prior to version 2.0 of the CLI, `@auth` rules did not apply to subscriptions. Instead you were required to either turn them off or use [Custom Resolvers](~/cli/graphql-transformer/resolvers.md#custom-resolvers) to manually add authorization checks. In the latest versions `@auth` protections have been added to subscriptions, however this can introduce different behavior into existing applications: First, `owner` is now a required argument for Owner-based authorization, as shown below. Second, the selection set will set `null` on fields when mutations are invoked if per-field `@auth` is set on that field. [Read more here](#per-field-with-subscriptions). If you wish to keep the previous behavior set `level: public` on your model as defined below.

</amplify-callout>

When `@auth` is used subscriptions have a few subtle behavior differences than queries and mutations based on their event based nature. When protecting a model using the owner auth strategy, each subscription request will **require** that the user is passed as an argument to the subscription request. If the user field is not passed, the subscription connection will fail. In the case where it is passed, the user will only get notified of updates to records for which they are the owner.

<amplify-callout warning> サブスクリプションフィルタリングは、変異から渡されたデータを使用してフィルタリングを行います。 変更が所有者ベースの作者の選択セットに `owner` フィールドを含まない場合、 その変更に対してサブスクリプションメッセージは発行されません。 </amplify-callout>

または、静的グループ認証戦略を使用してモデルを保護する場合。 サブスクリプション要求は、ユーザーが許可されたグループにいる場合にのみ成功します。 さらに、ユーザーは許可されたグループにいる場合にのみレコードの更新通知を受け取ります。 注: サブスクリプションリクエストでユーザーを引数として渡す必要はありません。 リゾルバは代わりにJWTトークンの内容を確認しますので。

<amplify-callout> ダイナミックグループはサブスクリプションに影響を与えません。更新を通知することはありません。 </amplify-callout>

例えば、次のスキーマがあるとします。

```
type Post @model
@auth(rules: [{allow: owner}])
{
  id: ID!
  owner: String
  postname: String
  content: String
}
```

これは、サブスクリプションが次のように表示されなければ失敗することを意味します:

```graphql
subscription OnCreatePost {
  onCreatePost(owner: “Bob”){
    postname
    content
  }
}
```

Note that if your type doesn’t already have an `owner` field the Transformer will automatically add this for you. Passing in the current user can be done dynamically in your code by using [Auth.currentAuthenticatedUser()](~/lib/auth/manageusers.md/q/platform/js#retrieve-current-authenticated-user) in JavaScript, [AWSMobileClient.default().username](~/sdk/auth/working-with-api.md/q/platform/ios#utility-properties) in iOS, or [AWSMobileClient.getInstance().getUsername()](~/sdk/auth/working-with-api.md/q/platform/android#utility-properties) in Android.

以下を定義した場合、グループの場合は、次のようにします。

```graphql
type Post @model
@auth(rules: [{ allow: groups, groups: ["Admin"] }])
{
  id: ID!
  owner: String
  postname: String
  content: String
}
```

その後、引数を渡す必要はありません。 リゾルバはサブスクリプション時にJWTトークンの内容を確認し、「管理者」グループにいることを確認します。

最後に、owner と group authorization の両方を使用する場合、username 引数は省略可能になります。これは次のことを意味します:

- ユーザーをパスしないが、許可されたグループのメンバーである場合、サブスクリプションは追加されたレコードを通知します。
- ユーザーをパスしないが、許可されたグループのメンバーではない場合、サブスクリプションは接続に失敗します。
- オーナーでありながらグループのメンバーではないユーザーを渡した場合。 サブスクリプションは、あなたが所有者であることを追加したレコードを通知します。
- 所有者ではなく、グループのメンバーではないユーザーを渡した場合。 あなたが所有している記録がないため、サブスクリプションはあなたに何も通知しません


`@model` で `公開` または `オフ` のいずれかを指定することで、サブスクリプションの承認チェックを無効にするか、サブスクリプションを完全にオフにすることができます:

```
@model (subscription: { level: public })
```

### フィールドレベルの承認

`@auth` ディレクティブは特定のフィールドへのアクセスをルールごとに制限するよう指定します 。 これが便利ないくつかの状況を以下に示します:

**親モデルとは異なる権限を持つフィールドへのアクセスを保護**

You might want to have a user model where some fields, like *username*, are a part of the public profile and the *ssn* field is visible to owners.

```graphql
type User @model {
  id: ID!
  username: String
  ssn: String @auth(rules: [{ allow: owner, ownerField: "username" }])
}
```

**ソースオブジェクトの属性に基づいて `@connection` リゾルバへのアクセスを保護**

このスキーマは、Userモデルの属性 に基づいて、ユーザーに接続されたPostオブジェクトへのアクセスを保護します。 @model `でクエリ: null` を指定することにより、トップレベルのクエリをオフにできます。 `@model` クエリがモデルに到達するために `@connection` リゾルバ を通過しなければならないようにアクセスを制限する宣言。

```graphql
type User @model {
  id: ID!
  username: String
  posts: [Post]
    @connection(name: "UserPosts")
    @auth(rules: [{ allow: owner, ownerField: "username" }])
}
type Post @model(queries: null) { ... }
```

**特定のフィールドが親モデルとは異なるアクセスルールを持つように変更を保護します。**

When used on field definitions, `@auth` directives protect all operations by default. To protect read operations, a resolver is added to the protected field that implements authorization logic. To protect mutation operations, logic is added to existing mutations that will be run if the mutation's input contains the protected field. For example, here is a model where owners and admins can read employee salaries but only admins may create or update them.

```graphql
type Employee @model {
  id: ID!
  email: String
  username: String

  # Owners & members of the "Admin" group may read employee salaries.
  # Only members of the "Admin" group may create an employee with a salary
  # or update a salary.
  salary: String
    @auth(rules: [
      { allow: owner, ownerField: "username", operations: [read] },
      { allow: groups, groups: ["Admin"], operations: [create, update, read] }
    ])
}
```

**Note** The `delete` operation, when used in @auth directives on field definitions, translates to protecting the update mutation such that the field cannot be set to null unless authorized.

**注**: フィールドの @auth ルールの一部として操作を指定する場合 操作リストに含まれていない操作はデフォルトでは保護されません。 たとえば、次のスキーマがあるとします。

```graphql
type Todo
  @model
{
  id: ID!
  owner: String
  updatedAt: AWSDateTime!
  content: String! @auth(rules: [{ allow: owner, operations: [update] }])
}
```

このスキーマでは、オブジェクトの所有者だけが `content` フィールドで更新操作を実行する権限を持っています。 しかし、これは他の所有者(オブジェクトの作成者または所有者以外のユーザー)が、他のユーザーが所有するオブジェクトの他のフィールドを更新することを妨げるものではありません。 フィールドの更新操作を防止したい場合は、そのフィールドへのアクセスを制限するために明示的に認証ルールを追加する必要があります。 次のように保護したいフィールドに @auth ルールを明示的に指定する方法があります。

```graphql
type Todo
  @model
{
  id: ID!
  owner: String
  updatedAt: AWSDateTime! @auth(rules: [{ allow: owner, operations: [update] }]) // or @auth(rules: [{ allow: groups, groups: ["Admins"] }])
  content: String! @auth(rules: [{ allow: owner, operations: [update] }])
}
```
フィールドに次のような明示的な拒否ルールを指定することもできます:

```graphql
type Todo
  @model
{
  id: ID!
  owner: String
  updatedAt: AWSDateTime! @auth(rules: [{ allow: groups, groups: ["ForbiddenGroup"], operations: [] }])
  content: String! @auth(rules: [{ allow: owner, operations: [update] }])
}
```

タイプの最上位の @auth ルールを項目レベルの auth ルールと組み合わせることもできます。例えば、次のスキーマを見てみましょう。

```graphql
type Todo
  @model @auth(rules: [{ allow: groups, groups: ["Admin"], operations:[update] }])
{
  id: ID!
  owner: String
  updatedAt: AWSDateTime!
  content: String! @auth(rules: [{ allow: owner, operations: [update] }])
}
```
In the above schema users in the `Admin` group have the authorization to create, read, delete and update (except the `content` field in the object of another owner) for the type Todo. An `owner` of an object, has the authorization to create Todo types and read all the objects of type Todo. In addition an `owner` can perform an update operation on the Todo object, only when the `content` field is present as a part of the input. Any other user - who isn't an owner of an object isn't authorized to update that object.

#### サブスクリプションを持つ項目ごと

フィールド `@auth` ごとに設定すると、Transformer は機密データがサブスクリプション上で送信されないように、 `null` に設定することで、これらのフィールドの変更のレスポンスを変更します。 例えば、以下のスキーマを参照してください。

```graphql
type Employee @model
  @auth(rules: [
      { allow: owner },
      { allow: groups, groups: ["Admins"] }
  ]) {
    id: ID!
    name: String!
    address: String!
    ssn: String @auth(rules: [{allow: owner}])
}
```

購読者は「管理者」グループのメンバーであり、新しいアイテムの通知を受け取る必要があります。 しかしながら、彼らは `ssn` フィールドを得るべきではありません。 以下の変異を実行する場合:

```graphql
mutter{
  createEmployee(input: {
    name: "Nadia"
    address: "123 First Ave"
    ssn: "392-95-2716"
  }){
    name
    address
    ssn
  }
}
```

The mutation will run successfully, however `ssn` will return null in the GraphQL response. This prevents anyone in the "Admins" group who is subscribed to updates from receiving the private information. Subscribers would still receive the `name` and `address`. The data is still written and this can be verified by running a query.

#### 生成

`@auth` ディレクティブはコンパイル時に、関連するリゾルバマッピングテンプレートに認可スニペットを追加します。異なる操作では、異なる承認メソッドが使用されます。

**オーナーの承認**

```graphql
type Post @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  title: String!
}
```

生成されたリゾルバは以下のように保護されます:

- `Mutation.createX`: Verify the requesting user has a valid credential and automatically set the **owner** attribute to equal `$ctx.identity.username`.
- `Mutation.updateX`: Update the condition expression so that the DynamoDB `UpdateItem` operation only succeeds if the record's **owner** attribute equals the caller's `$ctx.identity.username`.
- `Mutation.deleteX`: Update the condition expression so that the DynamoDB `DeleteItem` operation only succeeds if the record's **owner** attribute equals the caller's `$ctx.identity.username`.
- `Query.getX`: In the response mapping template verify that the result's **owner** attribute is the same as the `$ctx.identity.username`. If it is not return null.
- `Query.listX`: In the response mapping template filter the result's **items** such that only items with an **owner** attribute that is the same as the `$ctx.identity.username` are returned.
- `@connection` resolvers: In the response mapping template filter the result's **items** such that only items with an **owner** attribute that is the same as the `$ctx.identity.username` are returned. This is not enabled when using the `queries` argument.

### 静的グループの承認

```graphql
type Post @model @auth(rules: [{ allow: groups, groups: ["Admin"] }]) {
  id: ID!
  title: String!
  groups: String
}
```

静的グループ認証は他のリゾルバよりも簡単です。生成されたリゾルバは次のように保護されます。

- `Mutation.createX`: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail.
- `Mutation.updateX`: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail.
- `Mutation.deleteX`: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail.
- `Query.getX`: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail.
- `Query.listX`: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail.
- `@connection` resolvers: Verify the requesting user has a valid credential and that `$ctx.identity.claims.get("cognito:groups")` contains the **Admin** group. If it does not, fail. This is not enabled when using the `queries` argument.

### 動的グループ認証

```graphql
type Post @model @auth(rules: [{ allow: groups, groupsField: "groups" }]) {
  id: ID!
  title: String!
  groups: String
}
```

生成されたリゾルバは以下のように保護されます:

- `Mutation.createX`: Verify the requesting user has a valid credential and that it contains a claim to at least one group passed to the query in the `$ctx.args.input.groups` argument.
- `Mutation.updateX`: Update the condition expression so that the DynamoDB `UpdateItem` operation only succeeds if the record's **groups** attribute contains at least one of the caller's claimed groups via `$ctx.identity.claims.get("cognito:groups")`.
- `Mutation.deleteX`: Update the condition expression so that the DynamoDB `DeleteItem` operation only succeeds if the record's **groups** attribute contains at least one of the caller's claimed groups via `$ctx.identity.claims.get("cognito:groups")`
- `Query.getX`: In the response mapping template verify that the result's **groups** attribute contains at least one of the caller's claimed groups via `$ctx.identity.claims.get("cognito:groups")`.
- `Query.listX`: In the response mapping template filter the result's **items** such that only items with a **groups** attribute that contains at least one of the caller's claimed groups via `$ctx.identity.claims.get("cognito:groups")`.
- `@connection` resolver: In the response mapping template filter the result's **items** such that only items with a **groups** attribute that contains at least one of the caller's claimed groups via `$ctx.identity.claims.get("cognito:groups")`. This is not enabled when using the `queries` argument.

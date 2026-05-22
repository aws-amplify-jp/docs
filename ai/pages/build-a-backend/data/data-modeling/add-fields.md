---
title: "データモデルにフィールドを追加"
section: "build-a-backend/data/data-modeling"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-04-07T19:23:58.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/"
---

Amplify Dataは、AWS AppSyncのすべてのスカラー型をフィールド型として サポートしています。次のスカラー型が利用可能です:

|フィールド型|説明|TypeScript検証|GraphQLスカラー型|
|-|-|-|-|
|`a.id()`|オブジェクトの一意識別子。このスカラーはStringのようにシリアル化されますが、人間が読める形式ではありません。作成操作で指定されない場合、UUIDが生成されます。|`string`|ID|
|`a.string()`|UTF-8文字シーケンス。|`string`|String|
|`a.integer()`|-(2^31)から2^31-1の間の整数値。|`number`ただしクエリ/ミューテーション時に最も近い整数値に丸められます|Int|
|`a.float()`|IEEE 754浮動小数点値。|`number`|Float|
|`a.boolean()`|ブール値、真または偽。|`boolean`|Boolean|
|`a.date()`|拡張ISO 8601日付文字列(`YYYY-MM-DD`形式)。|`string`|AWSDate|
|`a.time()`|拡張ISO 8601時刻文字列(`hh:mm:ss.sss`形式)。|`string`|AWSTime|
|`a.datetime()`|拡張ISO 8601日時文字列(`YYYY-MM-DDThh:mm:ss.sssZ`形式)。|`string`|AWSDateTime|
|`a.timestamp()`|1970-01-01-T00:00Zの前後の秒数を表す整数値。|`number`|AWSTimestamp|
|`a.email()`|RFC 822で定義されている`local-part@domain-part`形式のメールアドレス。|`string`(local-partとdomain-part型の強制)|AWSEmail|
|`a.json()`|JSON文字列。すべての有効なJSON構造は、リテラル入力文字列ではなく、リゾルバーコード内のマップ、リスト、またはスカラー値として自動的に解析および読み込まれます。引用符なしの文字列またはその他の無効なJSONは検証エラーを発生させます。|`any`|AWSJSON|
|`a.phone()`|電話番号。この値は文字列として保存されます。電話番号には、数字グループを分割するためにスペースまたはハイフンが含まれます。国コードのない電話番号は、北米番号指定計画に準拠するUS/北米の番号と見なされます。|`string`検証はサービス側でのみ実行|AWSPhone|
|`a.url()`|RFC 1738で定義されているURL。例えば、https://www.amazon.com/dp/B000NZW3KC/ または mailto:example@example.com。URLはスキーマ(http、mailto)を含む必要があり、パス部分に2つの前方スラッシュ(//)を含めることはできません。|`string`ただしスキーマ部分に型の強制|AWSURL|
|`a.ipAddress()`|有効なIPv4またはIPv6アドレス。IPv4アドレスはクワッド記法(123.12.34.56)で予想されます。IPv6アドレスは括弧なしのコロン区切り形式(1a2b:3c4b:1234:4567)で予想されます。オプションのCIDRサフィックス(123.45.67.89/16)を含めて、サブネットマスクを示すことができます。|`string`(IPv4およびIPv6パターンの型強制付き)|AWSIPAddress|

## カスタムフィールド型を指定する

組み込み型がアプリケーションのニーズを満たさない場合があります。その場合は、カスタム型を指定できます。カスタム型をインラインで定義することも、スキーマでカスタム型を明示的に定義することもできます。

**インライン定義:**「location」フィールドは、化合語の各単語の最初の文字が大文字になるPascalCase命名規則を使用する新しい非モデル型になります。別のスキーマレベル定義(モデル、カスタム型、列挙型)と競合がある場合、値を別の項目として分別し、「ref」を使用する必要があることを警告するType エラーが表示されます。

```ts
a.schema({
  Post: a.model({
    location: a.customType({
      lat: a.float(),
      long: a.float(),
    }),
    content: a.string(),
  }),
}).authorization((allow) => allow.publicApiKey());
```

**明示的定義:**スキーマで「Location」を`a.customType()`として指定します。カスタム型を使用するには、それぞれのフィールド定義で`a.ref()`を通じて参照します。

```ts
a.schema({
  Location: a.customType({
      lat: a.float(),
      long: a.float(),
  }),

  Post: a.model({
    location: a.ref('Location'),
    content: a.string(),
  }),

  User: a.model({
    lastKnownLocation: a.ref('Location'),
  }),
}).authorization((allow) => allow.publicApiKey());
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, flutter -->
クライアント側でlocationフィールドを設定または読み取るには、ネストされたオブジェクトを展開することができ、型システムは許可される値を自動推論します。

```ts
const { data: newPost, errors } = await client.models.Post.create({
  location: {
    lat: 48.837006,
    long: 8.28245,
  },
});

console.log(newPost?.location?.lat, newPost?.location?.long);
```
<!-- /Platform -->

<!-- Platform: swift -->
クライアント側でlocationフィールドを設定または読み取るには、location値を使用してPostオブジェクトを作成できます。

```swift
let post = Post(
    location: .init(
        lat: 48.837006,
        long: 8.28245))
let createdPost = try await Amplify.API.mutate(request: .create(post)).get()
print("\(createdPost)")
```
<!-- /Platform -->

## 列挙型フィールドを指定する

列挙型は、カスタム型と同様の開発者体験があります:短縮形と長形のアプローチです。

短縮形アプローチ

```ts
a.schema({
  Post: a.model({
    privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
    content: a.string(),
  }),
}).authorization((allow) => allow.publicApiKey());
```

長形アプローチ

```ts
a.schema({
  PrivacySetting: a.enum([
    'PRIVATE',
    'FRIENDS_ONLY',
    'PUBLIC'
  ]),

  Post: a.model({
    content: a.string(),
    privacySetting: a.ref('PrivacySetting'),
  }),

  Video: a.model({
    privacySetting: a.ref('PrivacySetting'),
  }),
}).authorization((allow) => allow.publicApiKey());
```

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, flutter -->
クライアント側で新しい項目を作成するとき、列挙型も型が強制されます:
```ts
client.models.Post.create({
  content: 'hello',
  // 機能します - 値は自動補完されます
  privacySetting: 'PRIVATE',

  // 機能しません - 型エラー
  privacySetting: 'NOT_PUBLIC',
});
```
<!-- /Platform -->

<!-- Platform: swift -->
クライアント側で列挙型値を使用して新しい項目を作成します:

```swift
let post = Post(
    content: "hello",
    privacySetting: .private)
let createdPost = try await Amplify.API.mutate(request: .create(post)).get()
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
### クライアント側で列挙型値をリストする

`client.enums.<ENUM_NAME>.values()` APIを使用して、クライアント側で利用可能な列挙型値をリストできます。例えば、これにより、ドロップダウンUI内で利用可能な列挙型値を表示できます。

```ts
const availableSettings = client.enums.PrivacySetting.values()
// availableSettingsは["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]を返します
```
<!-- /Platform -->

## フィールドを必須にマーク

デフォルトでは、フィールドはオプションです。フィールドを必須にするには、`.required()`修飾子を使用します。

```ts
const schema = a.schema({
  Todo: a.model({
    content: a.string().required(),
  }),
}).authorization((allow) => allow.publicApiKey());
```

## フィールドを配列にマーク

`.array()`修飾子を使用して、任意のフィールドを配列に変更できます。

```ts
const schema = a.schema({
  Todo: a.model({
    content: a.string().required(),
    notes: a.string().array(),
  }),
}).authorization((allow) => allow.publicApiKey());
```

## フィールドのデフォルト値を割り当てる

`.default(...)`修飾子を使用して、オプションの[スカラー型フィールド](https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html)のデフォルト値を指定できます。`.default(...)`修飾子は、カスタム型、配列、または関係には使用できません。

```ts
const schema = a.schema({
  Todo: a.model({
    content: a.string().default('My new Todo'),
  }),
}).authorization((allow) => allow.publicApiKey());
```
<Callout>
**注:**`.default(...)`修飾子を必須フィールドに適用することはできません。
</Callout>

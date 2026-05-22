---
title: "データモデルをカスタマイズする"
section: "build-a-backend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-07-12T17:02:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/data-modeling/"
---

## データモデリング機能

すべてのデータモデルはデータスキーマ（`a.schema()`）の一部として定義されます。様々なフィールド、カスタム識別子、認可ルール、またはリレーションシップを使用してデータモデルを拡張できます。すべてのデータモデル（`a.model()`）は自動的に作成、読み取り、更新、削除のAPI操作とリアルタイムサブスクリプションイベントを提供します。以下は、データモデルに追加できる多くの機能の簡単なツアーです。

```ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a
  .schema({
    Customer: a
      .model({
        customerId: a.id().required(),
        // fields can be of various scalar types,
        // such as string, boolean, float, integers etc.
        name: a.string(),
        // fields can be of custom types
        location: a.customType({
          // fields can be required or optional
          lat: a.float().required(),
          long: a.float().required(),
        }),
        // fields can be enums
        engagementStage: a.enum(["PROSPECT", "INTERESTED", "PURCHASED"]),
        collectionId: a.id(),
        collection: a.belongsTo("Collection", "collectionId")
        // Use custom identifiers. By default, it uses an `id: a.id()` field
      })
      .identifier(["customerId"]),
    Collection: a
      .model({
        customers: a.hasMany("Customer", "collectionId"), // setup relationships between types
        tags: a.string().array(), // fields can be arrays
        representativeId: a.id().required(),
        // customize secondary indexes to optimize your query performance
      })
      .secondaryIndexes((index) => [index("representativeId")]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

## Gen 1 スキーマサポート

Gen 1 から移行する場合、GraphQL スキーマ定義言語（SDL）を引き続き使用してスキーマを定義できます。ただし、プロジェクトで TypeScript ファーストのスキーマビルダーエクスペリエンスを使用することを強くお勧めします。これは型安全性を提供し、今後 Amplify で作業するための推奨方法です。

<Callout>

**注意:** Gen 1 GraphQL SDL で利用可能な一部の機能は Gen 2 では利用できません。Gen 2 でサポートされている機能については、[機能マトリックス](/[platform]/start/migrate-to-gen2/#gen-1-vs-gen-2-feature-matrix)を参照してください。

</Callout>

```ts title="amplify/data/resource.ts"
import { defineData } from '@aws-amplify/backend';

const schema = /* GraphQL */`
  type Todo @model @auth(rules: [{ allow: owner }]) {
    content: String
    isDone: Boolean
  }
`;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```


## スキーマを更新

スキーマを編集し、 `コード化モデル` を増幅します。

```graphql
enum PostStatus {
  ACTIVE
  INACTIVE
  STAGED # new enum value
}

type Post @model {
  id: ID!
  title: String!
  rating: Int!
  status: PostStatus!
}
```

これにより、変更が評価され、元のデバイス上のストレージ構造に影響を与える変更が検出された場合、バージョン管理されたハッシュが作成されます。 例えば、追加/削除されるタイプ、またはフィールドが必要/オプションになります。 DataStoreは起動時にこのバージョンを評価し、変更がある場合は、デバイス上の **ローカルアイテムが削除され、クラウドと同期している場合はAppSyncからの完全な同期が行われます**。

## ローカル移行

デバイス上のローカルマイグレーション(開発者によって制御されたマイグレーション)は現在サポートされていません。そのため、スキーマが変更されるとローカルデータは失われます。

クラウドと同期している場合、AppSync バックエンドの **データの構造とアイテムは、このプロセスの一部として** には触れられません。

<amplify-callout warning>

**Troubleshooting:** due to a limitation in DynamoDB, you can only add one `@key` at a time. Make sure you run `amplify push` in between changes when cloud sync is enabled.

</amplify-callout>

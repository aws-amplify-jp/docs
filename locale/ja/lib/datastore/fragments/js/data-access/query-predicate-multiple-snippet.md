複数の条件を使用する場合、暗黙の `と` が [GraphQL 変換条件文](~/cli/graphql-transformer/resolvers.md)をミラーするように定義されています。 例えば、複数の条件付き:

```js
const posts = await DataStore.query(Post, c =>
  c.rating("gt", 4).status("eq", PostStatus.PUBSHED)
);
```

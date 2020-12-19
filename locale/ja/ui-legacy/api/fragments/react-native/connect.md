APIカテゴリは、Amplify GraphQLクライアントを使用してGraphQLデータを操作するためのReact Nativeコンポーネントを提供します。

The `<Connect/>` component is used to execute a GraphQL query or mutation. You can execute GraphQL queries by passing your queries in `query` or `mutation` attributes

## サブスクリプション

サブスクリプションの場合、 `サブスクリプション` および `onSubscriptionMsg` 属性を使用してサブスクリプションを有効にできます。

## <unk>

For mutations, a `mutation` function needs to be provided with the `Connect` component. A `mutation` returns a promise that resolves with the result of the GraphQL mutation.

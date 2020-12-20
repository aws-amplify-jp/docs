## JavaScript アプリケーションからのクエリ

`listTodos` クエリは CLI によって自動的に作成されている必要がありますが、参照目的では以下のようになります。

```js
const listTodos = `
  query listTodos($limit: Int) {
    listTodos(limit: $limit) {
      items {
        id
        title
        description
      }
      nextToken
    }
  }
`
```

JavaScriptアプリケーションからのクエリで `制限` を渡すには 制限値を変数として設定することで、次のコードを使用できます。

```js
import { API } from 'aws-amplify';

async function fetchTodos() {
  const todoData = await API.graphql({
    query: listTodos,
    variables: {
      limit: 2
    }
  })
  console.log({ todoData })
}
```

API リクエストから返されるデータは、次のようになります(項目が多い配列が作成されている場合)。

```graphql
{
  "data" {
    "listTodos" {
      "items": [{ id: "001", title: "Todo 1", description: "My first todo" }],
      "nextToken": "<token-id>"
    }
  }
}
```

JavaScriptアプリケーションからクエリに `nextToken` を設定するには、次のコードを使用します。

```js
import { API } from 'aws-amplify';

async function fetchTodos() {
  const todoData = await API.graphql({
    query: listTodos,
    variables: {
      limit: 2,
      nextToken: "<token-id>"
    }
  })
  console.log({ todoData })
}
```
これで、APIとのやり取りを開始できます。

```js
// get request
const items = await API.get('myapi', '/items')

// post with data
const data = { body: { items: ['some', 'new', 'items'] } }
await API.post('myapi', '/items', data)
```
複数の API を設定した場合は、API の名前を操作のターゲットとして指定できます。

```swift
let request = GraphQLRequest(apiName: "[FRIENDLY-NAME-API-WITH-API-KEY]", ...)
Amplify.API.mutate(request: request, listener: ...)
```
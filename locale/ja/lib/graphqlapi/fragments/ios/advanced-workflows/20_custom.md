```swift
extension GraphQLRequest {
    static func getWithoutDescription(byId id: String) -> GraphQLRequest<Todo> {
        let operationName = "getTodo"
        let document = """
        query getTodo($id: ID!) {
          \(operationName)(id: $id) {
            id
            name
          }
        }
        """
        return GraphQLRequest<Todo>(document: document,
                                    variables: ["id": id],
                                    responseType: Todo.self,
                                    decodePath: operationName)
    }
}
```
decode パスは `responseType`にデシリアライズするレスポンスのどの部分を指定します。 「data.getTodo」でオブジェクトをデシリアライズする操作名をTodoモデルに正常に指定する必要があります。

次に、Todo ID で Todo をクエリします
```swift
Amplify.API.query(request: .getWithoutDescription(byId: "[UNIQUE_ID]")) { 
  // result を処理する
```  
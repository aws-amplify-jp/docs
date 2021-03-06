## APIリクエストをキャンセル

返されたpromiseへの参照を保持することにより、APIカテゴリを介して行われたクエリや変更リクエストをキャンセルすることができます。

```javascript
const promise = API.graphql(graphqlOperation(...));

try {
    await promise;
} catch (error) {
    console.log(error); 
    // If the error is because the request was cancelled we can confirm here.
    if(API.isCancel(error)) {
        console.log(error.message); // "my message for cancellation"
        // handle user cancellation logic
    }
}

...

// To cancel the above request
API.cancel(promise, "my message for cancellation");
```

`API.graphql()` から返された promiseが変更されていないことを確認する必要があります。 通常非同期関数は、他のプロミスに戻される Promise をラップします。例えば、次のようには動作しません。

```javascript
async function makeAPICall() {
    return API.graphql(graphqlOperation(... ); 
 }
}
const promise = makeAPICall();


// 次の要求はキャンセルされません。
API.cancel(promise, "my error message");
```

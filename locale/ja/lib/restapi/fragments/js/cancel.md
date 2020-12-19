## APIリクエストをキャンセル

返されたpromiseへの参照を保持することで、APIカテゴリを通じて行われたリクエストをキャンセルできます。

```javascript
const promise = API.get(myApiName, myPath, myInit);

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

`API.get()` または他のAPI呼び出しから返されたpromiseが変更されていないことを確認する必要があります。 通常非同期関数は、他のプロミスに戻される Promise をラップします。例えば、次のようには動作しません。

```javascript
async function makeAPICall() {
    return API. et(myApiName, myPath, myInit); 
 }
}
const promise = makeAPICall();


// 以下はリクエストをキャンセルしません。
API.cancel(promise, "my error message");
```

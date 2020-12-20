GET リクエストを作成するには、まず RestOptions オブジェクトを作成し、Amplify.API.get api を使用してリクエストを発行します。

```kotlin
fun getItems() {
    val options = RestOptions.builder()
        .addPath("/items")
        .build()

    Amplify.API.get(options,
        { Log.i("MyAmplifyApp", "GET succeeded: $it") },
        { Log.e("MyAmplifyApp", "GET failed.", it) }
    )
}
```

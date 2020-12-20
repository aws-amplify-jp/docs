素晴らしい！Web UIでサインインを開始する準備ができました。今のところ、MainActivityの `onCreate` メソッドにこのメソッドを追加してください。

<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.Auth.signInWithWebUI(
    this,
    result -> Log.i("AuthQuickStart", result.toString()),
    error -> Log.e("AuthQuickStart", error.toString())
);
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.Auth.signInWithWebUI(
    this,
    { result -> Log.i("AuthQuickStart", result.toString()) },
    { error -> Log.e("AuthQuickStart", error.toString()) }
)
```

</amplify-block> <amplify-block name="RxJava">

```java
RxAmplify.Auth.signInWithWebUI(this)
    .subscribe(
        result -> Log.i("AuthQuickStart", result.toString()),
        error -> Log.e("AuthQuickStart", error.toString())
);
```

</amplify-block> </amplify-block-switcher>


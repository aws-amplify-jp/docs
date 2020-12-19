<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.Auth.confirmSignIn(
    "SMS経由で受信した確認コード",
    result -> Log.i("AuthQuickstart", result.toString()),
    error -> Log.e("AuthQuickstart", error.toString())
);
```

</amplify-block> <amplify-block name="Kotlin">

 ```kotlin
Amplify.Auth.confirmSignIn(
    "confirmation code received via SMS",
    { result: AuthSignInResult -> Log.i("AuthQuickstart", result.toString()) },
    { error: AuthException -> Log.e("AuthQuickstart", error.toString()) }
)
```

</amplify-block> <amplify-block name="RxJava">

```java
RxAmplify.Auth.confirmSignIn("SMS経由で受信した確認コード")
    .subscribe(
        result -> Log.i("AuthQuickstart", result.toString()),
        error -> Log.e("AuthQuickstart", error.toString())
);
```

</amplify-block> </amplify-block-switcher>

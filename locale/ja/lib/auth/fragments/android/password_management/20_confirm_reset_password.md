<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.Auth.confirmResetPassword(
   "NewPassword123",
   "受け取った確認コード",
   () -> Log.i("AuthQuickstart", "New password confirmed"),
   error -> Log.e("AuthQuickstart", error.toString())
);
```

 </amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.Auth.confirmResetPassword(
   "NewPassword123",
   "受け取った確認コード",
   { Log.i("AuthQuickstart", "新しいパスワード確認") },
   { error -> Log.e("AuthQuickstart", error.toString()) }
)
```
 </amplify-block> </amplify-block-switcher>
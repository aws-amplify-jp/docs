<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.DataStore.save(post, Post.TITLE.beginsWith("[Amplify]"),
    update -> Log.i("MyAmplifyApp", "Post updated successfully!"),
    failure -> Log.e("MyAmplifyApp", "Could not update post, maybe the title has been changed?", failure)
);
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.DataStore.save(post, Post.TITLE.beginsWith(" "[Amplify]"),
    { Log.i("MyAmplifyApp", "Post updated!") },
    { Log. ("MyAmplifyApp", "投稿を更新できませんでした。タイトルが変更されましたか？", それ) }
)
```

</amplify-block> <amplify-block name="RxJava">

```java
RxAmplify.DataStore.save(post, Post.TITLE.beginsWith("[Amplify]"))
    .subscribe(
        update -> Log.i("MyAmplifyApp", "Post updated successfully!"),
        failure -> Log.e("MyAmplifyApp", "Could not update post, maybe the title has been changed?", failure)
    );
```

</amplify-block> </amplify-block-switcher>


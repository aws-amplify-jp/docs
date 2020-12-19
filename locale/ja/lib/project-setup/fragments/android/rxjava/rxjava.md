
Android向けAmplifyライブラリには、以下のようにコールバックを介して結果を返すAPIが付属しています。

```java
Post post = Post.builder()
    .title("My First Post")
    .build();

Amplify.DataStore.save(post,
    saved -> Log.i("MyAmplifyApp", "Saved a post."),
    failure -> Log.e("MyAmplifyApp", "Save failed.", failure)
);
```

Amplifyは非同期およびイベントベースのプログラムのためのクロスプラットフォームライブラリである [Reactive Extensions](http://reactivex.io/)を公開するAPIも提供しています。

```java
Post post = Post.builder()
    .title("My First Post")
    .build();

RxAmplify.DataStore.save(post)
    .subscribe(
        () -> Log.i("MyAmplifyApp", "Saved a post."),
        failure -> Log.e("MyAmplifyApp", "Save failed.", failure)
    );
```

これは単一の呼び出しではあまり節約されませんが、非同期呼び出しをチェーンするときに大きな可読性の利点を提供します。 標準の RxJava 演算子を使用して、読み取り可能なチャンクに複雑な機能を構成することができます。

Consider a relational model where the creation of a `Post` also requires the creation of a `User` for the editor, and a `PostEditor` object to link the two together:

```java
Post post = Post.builder()
    .title("My First Post")
    .build();

User editor = User.builder()
    .username("Nadia")
    .build();

PostEditor postEditor = PostEditor.builder()
    .post(post)
    .editor(editor)
    .build();
```

コールバックを使用して、以下のオブジェクトを保存できます。

```java
Amplify.DataStore.save(post,
    savedPost -> {
        Log.i("MyAmplifyApp", "Post saved.");
        Amplify.DataStore.save(editor,
            savedEditor -> {
                Log.i("MyAmplifyApp", "Editor saved.");
                Amplify.DataStore.save(postEditor,
                    saved -> Log.i("MyAmplifyApp", "PostEditor saved."),
                    failure -> Log.e("MyAmplifyApp", "PostEditor not saved.", failure)
                );
            },
            failure -> Log.e("MyAmplifyApp", "Editor not saved.", failure)
        );
    },
    failure -> Log.e("MyAmplifyApp", "Post not saved.", failure)
);
```

AmplifyのRxJavaインターフェースを使用すると、以下の操作をマージできます。

```java
Completable.mergeArray(
    RxAmplify.DataStore.save(post),
    RxAmplify.DataStore.save(editor)
).andThen(
    RxAmplify.DataStore.save(postEditor)
).subscribe(
    () -> Log.i("MyAmplifyApp", "Post, Editor, and PostEditor saved."),
    failure -> Log.e("MyAmplifyApp", "Item not saved.", failure)
);
```

これらの依存する呼び出しをコールバックでネストするのと比較すると、これははるかに読みやすいパターンを提供します。

## インストール

AmplifyのRxJavaバインディングはAmplifyに含まれています。これらを使用するには、アプリケーションのgradleファイルに依存性を追加します。

**Gradle Scripts**の下で **build.gradle (Module: [YourApplicationName])** を開きます。

`依存関係` に次の行を追加する

```groovy
dependencies {
    // `dependencies` に以下の行を追加
    implementation 'com.amplifyframework:rxbindings:1.6.4'
}
```

## 使用法

Amplifyは、RxJava機能を公開する直感的なインターフェースを提供するために、対応するコールバックAPIシグネチャを除く結果コールバックを使用します。 APIの大部分は、RxJava `Single`、 `Observable`、または `Complettable` を返します。

### 特別なケース

API の中には、API の購読や、ストレージからオブジェクトのアップロードやダウンロードなどの操作をキャンセルできるものもあります。

#### `API.subscribe()`

The `API.subscribe()` method exposes two `Observable` streams for subscription data and connection state accessible via `observeConnectionState()` and `observeSubscriptionData()` on the operation respectively.

```java
RxSubscriptionOperation<? extends GraphQLResponse<?>> subscription =
      RxAmplify.API.subscribe(request);

subscription
      .observeConnectionState()
      .subscribe(
        connectionStateEvent -> Log.i("StatusObserver", String.valueOf(connectionStateEvent))
      );

subscription
      .observeSubscriptionData()
      .subscribe(
          data -> Log.i("SubscriptionObserver", data),
          exception -> Log.e("SubscriptionObserver", "Subscription failed.", exception),
          () -> Log.i("SubscriptionObserver", "Subscription completed.")
      );
```

#### `ストレージ` アップロード & ダウンロード操作

Similarly, `Storage.download()` and `Storage.upload()` return an operation which provide two `Observable` objects for download/upload progress and for the result of the operation.

```java
// Download
RxProgressAwareSingleOperation<StorageDownloadFileResult> download =
      RxAmplify.Storage.downloadFile(remoteKey, localFile);

download
      .observeProgress()
      .subscribe(
        progress -> Log.i("ProgressObserver", progress.toString())
      );

download
      .observeResult()
      .subscribe(
        result -> Log.i("ResultObserver", result.getFile().getPath()),
        exception -> Log.e("ResultObserver", "", exception)
      );

// Upload
RxProgressAwareSingleOperation<StorageUploadFileResult> upload =
      RxAmplify.Storage.uploadFile(remoteKey, localFile);

upload
      .observeProgress()
      .subscribe(
        progress -> Log.i("ProgressObserver", progress.toString())
      );

upload
      .observeResult()
      .subscribe(
        result -> Log.i("ResultObserver", result.getKey()),
        exception -> Log.e("ResultObserver", "", exception)
      );
```

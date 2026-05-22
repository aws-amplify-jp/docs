---
title: "ファイルを削除する"
section: "frontend/storage"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/storage/remove-files/"
---

`remove` API を使用してストレージバケットからファイルを削除できます。ファイルが ID で保護されている場合、そのファイルを削除できるのはそのファイルを所有するユーザーのみです。

<!-- Platform: react, angular, javascript, vue, nextjs, react-native -->
## 単一ファイルを削除する

Amplify Backend に割り当てられたバケット名を `bucket` オプションで指定して、特定のバケットから削除操作を実行することもできます。

```javascript
import { remove } from 'aws-amplify/storage';

try {
  await remove({ 
    path: 'album/2024/1.jpg',
    // または、path: ({identityId}) => `album/${identityId}/1.jpg`
    bucket: 'assignedNameInAmplifyBackend', // Amplify Backend で割り当てられた名前を使用してターゲットバケットを指定
  });
} catch (error) {
  console.log('Error ', error);
}
```

または、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。

```javascript
import { remove } from 'aws-amplify/storage';

try {
  await remove({ 
    path: 'album/2024/1.jpg',
    // または、コンソールからバケット名と関連リージョンを指定
    bucket: {
      bucketName: 'bucket-name-from-console',
      region: 'us-east-2'
    }

  });
} catch (error) {
  console.log('Error ', error);
}
```
<!-- /Platform -->

<!-- Platform: react, angular, javascript, vue, nextjs -->
## フォルダを削除する

フォルダパスを指定することで、フォルダ全体とその内容を削除できます。remove API は自動的にフォルダを検出し、含まれるすべてのファイルのバッチ削除を実行します。

```javascript
import { remove } from 'aws-amplify/storage';

try {
  await remove({
    path: 'album/2024/'
  });
} catch (error) {
  console.error(error);
}
```

### 進行状況トラッキング付きフォルダ削除

大きなフォルダの場合、削除の進行状況を追跡し、エラーを処理できます。

```javascript
import { remove } from 'aws-amplify/storage';

try {
  const result = await remove({ 
    path: 'large-folder/',
    options: {
      onProgress: (fileBatch) => {
        console.log(fileBatch);
      }
    }
  });
  
  console.log('Success', result);
} catch (error) {
  console.log('Error during folder deletion:', error);
}
```

### キャンセル可能なフォルダ削除

フォルダ削除操作をキャンセルできます。これはユーザーが開始したキャンセルやページから移動する際に役立ちます。

`await` なしで `remove()` を呼び出すと、`result` プロパティと `cancel()` メソッドを持つキャンセル可能な操作オブジェクトが返されます。これは直接結果を返しますがキャンセルできない `await remove()` とは異なります。

```javascript
import { remove } from 'aws-amplify/storage';

let deleteOperation;

// ユーザーが削除ボタンをクリックしたときに削除を開始
function handleDeleteFolder() {
  // remove() は { result: Promise, cancel: Function } を返す
  deleteOperation = remove({ 
    path: 'user-uploads/large-dataset/',
    options: {
      onProgress: (fileBatch) => {
        updateProgressBar(fileBatch.deleted?.length || 0);
      }
    }
  });

  // .result プロパティを通じて Promise にアクセス
  deleteOperation.result.then(result => {
    console.log('Success', result);
  }).catch(error => {
    if (error.name === 'CanceledError') {
      console.log('Deletion cancelled by user');
    } else {
      console.log('Error:', error);
    }
  });
}

// ユーザーがキャンセルをクリックするか、移動する際にキャンセル
function handleCancel() {
  if (deleteOperation) {
    deleteOperation.cancel();
  }
}
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Storage.remove(
    StoragePath.fromString("public/myUploadedFileName.txt"),
    result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
    error -> Log.e("MyAmplifyApp", "Remove failure", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"),
    { Log.i("MyAmplifyApp", "Successfully removed: ${it.path}") },
    { Log.e("MyAmplifyApp", "Remove failure", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"))
    Log.i("MyAmplifyApp", "Successfully removed: ${result.path}")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Remove failure", error)
}
```

#### [RxJava]

```java
RxAmplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"))
        .subscribe(
            result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
            error -> Log.e("MyAmplifyApp", "Remove failure", error)
        );
```

## 指定されたバケットからファイルを削除する

`bucket` オプションを指定して、特定のバケットから削除操作を実行することもできます。Amplify Backend で割り当てられたターゲットバケットの名前を表す文字列を渡すことができます。

#### [Java]

```java
StorageBucket secondBucket = StorageBucket.fromOutputs("secondBucket");
StorageRemoveOptions options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build();

Amplify.Storage.remove(
    StoragePath.fromString("public/myUploadedFileName.txt"), 
    options,
    result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
    error -> Log.e("MyAmplifyApp", "Remove failure", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val secondBucket = StorageBucket.fromOutputs("secondBucket")
val options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build()

Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options,
    { Log.i("MyAmplifyApp", "Successfully removed: ${it.path}") },
    { Log.e("MyAmplifyApp", "Remove failure", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val secondBucket = StorageBucket.fromOutputs("secondBucket")
val options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build()

try {
    val result = Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options)
    Log.i("MyAmplifyApp", "Successfully removed: ${result.path}")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Remove failure", error)
}
```

#### [RxJava]

```java     
StorageBucket secondBucket = StorageBucket.fromOutputs("secondBucket");
StorageRemoveOptions options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build(); 
RxAmplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options)
        .subscribe(
            result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
            error -> Log.e("MyAmplifyApp", "Remove failure", error)
        );
```

または、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。

#### [Java]

```java
BucketInfo bucketInfo = new BucketInfo("second-bucket-name-from-console", "us-east-2");
StorageBucket secondBucket = StorageBucket.fromBucketInfo(bucketInfo);
StorageRemoveOptions options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build(); 

Amplify.Storage.remove(
    StoragePath.fromString("public/myUploadedFileName.txt"),
    options,
    result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
    error -> Log.e("MyAmplifyApp", "Remove failure", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val bucketInfo = BucketInfo("second-bucket-name-from-console", "us-east-2")
val secondBucket = StorageBucket.fromBucketInfo(bucketInfo)
val options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build()

Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options,
    { Log.i("MyAmplifyApp", "Successfully removed: ${it.path}") },
    { Log.e("MyAmplifyApp", "Remove failure", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val bucketInfo = BucketInfo("second-bucket-name-from-console", "us-east-2")
val secondBucket = StorageBucket.fromBucketInfo(bucketInfo)
val options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build()

try {
    val result = Amplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options)
    Log.i("MyAmplifyApp", "Successfully removed: ${result.path}")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Remove failure", error)
}
```

#### [RxJava]

```java
BucketInfo bucketInfo = new BucketInfo("second-bucket-name-from-console", "us-east-2");
StorageBucket secondBucket = StorageBucket.fromBucketInfo(bucketInfo);
StorageRemoveOptions options = StorageRemoveOptions.builder()
    .bucket(secondBucket)
    .build(); 

RxAmplify.Storage.remove(StoragePath.fromString("public/myUploadedFileName.txt"), options)
        .subscribe(
            result -> Log.i("MyAmplifyApp", "Successfully removed: " + result.getPath()),
            error -> Log.e("MyAmplifyApp", "Remove failure", error)
        );
```

<!-- /Platform -->

<!-- Platform: swift -->

#### [Async/Await]

```swift
let removedObject = try await Amplify.Storage.remove(
    path: .fromString("public/example/path")
)
print("Deleted \(removedObject)")
```

#### [Combine]

```swift
let sink = Amplify.Publisher.create {
    try await Amplify.Storage.remove(
        path: .fromString("public/example/path")
    )
}.sink {
    if case let .failure(error) = $0 {
        print("Failed: \(error)")
    }
}
receiveValue: { removedObject in
    print("Deleted \(removedObject)")
}
```

## 指定されたバケットからファイルを削除する

`bucket` オプションを指定して、特定のバケットから削除操作を実行できます。

#### [From Outputs]
`.fromOutputs(name:)` を使用して、Amplify Backend のターゲットバケットの割り当てられた名前を表す文字列を指定できます。

```swift
let removedObject = try await Amplify.Storage.remove(
    path: .fromString("public/example/path"),
    options: .init(
        bucket: .fromOutputs(name: "secondBucket")
    )
)
```

#### [From Bucket Info]
`.fromBucketInfo(_:)` を使用してバケット名とリージョンを直接指定することもできます。

```swift
let removedObject = try await Amplify.Storage.remove(
    path: .fromString("public/example/path"),
    options: .init(
        bucket: .fromBucketInfo(.init(
            bucketName: "another-bucket-name",
            region: "another-bucket-region")
        )    
    )
)
```

<!-- /Platform -->

<!-- Platform: flutter -->
`bucket` オプションを指定して、特定のバケットから `remove` 操作を実行することもできます。Amplify Backend で定義された名前を表す `StorageBucket` オブジェクトを渡すことができます。

```dart
final result = await Amplify.Storage.remove(
  path: const StoragePath.fromString('path/to/file.txt'),
  options: StorageRemoveOptions(
    // highlight-start
    // Amplify Backend で割り当てられた名前を使用してターゲットバケットを指定
    bucket: StorageBucket.fromOutputs('secondBucket'),
    // highlight-end
  ),
).result;
```

または、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。

```dart
final result = await Amplify.Storage.remove(
  path: const StoragePath.fromString('path/to/file.txt'),
  options: StorageRemoveOption(
    // highlight-start
    // または、コンソールからバケット名と関連リージョンを指定
   bucket: StorageBucket.fromBucketInfo(
        BucketInfo(
          bucketName: 'second-bucket-name-from-console',
          region: 'us-east-2',
        ),
      ),
      // highlight-end
  ),
).result;
```

## 複数のファイルを削除する

`Amplify.Storage.removeMany` を使用して複数のファイルを削除できます。同時に削除するファイルのバッチは同じアクセスレベルを持つ必要があります。また、バケットを指定することもできます：

```dart
Future<void> remove() async {
  try {
    final result = await Amplify.Storage.removeMany(
      paths: [
        const StoragePath.fromString('public/file-1.txt'),
        const StoragePath.fromString('public/file-2.txt'),
      ],
      // このオプションが指定されない場合、Amplify Backend のデフォルトバケットが使用されます
      options: StorageRemoveManyOptions(
        bucket: StorageBucket.fromOutputs('secondBucket'),
        /* または、コンソールからバケット名と関連リージョンを指定
        bucket: StorageBucket.fromBucketInfo(
          BucketInfo(
            bucketName: 'second-bucket-name-from-console',
            region: 'us-east-2',
          ),
        ),
        */
      ),
    ).result;
    safePrint('Removed files: ${result.removedItems}');
  } on StorageException catch (e) {
    safePrint(e.message);
  }
}
```
<!-- /Platform -->

<!-- Platform: react, angular, javascript, vue, nextjs, react-native -->
## さらなる `remove` オプション

オプション | 型 | デフォルト | 説明 |
| -- | :--: | :--: | ----------- |
| bucket | string \| <br />\{ bucketName: string;<br/> region: string; \} | Amplify 設定のデフォルトバケットとリージョン | Amplify Backend で割り当てられたターゲットバケットの名前を表す文字列、またはコンソールからバケット名とリージョンを指定するオブジェクト。<br/><br/>[追加のストレージバケットの設定](/[platform]/build-a-backend/storage/set-up-storage/#configure-additional-storage-buckets)で詳細を確認してください |
| expectedBucketOwner | string | オプション | リクエストされたバケットを所有するアカウント ID。 |
| onProgress | (fileBatch: \{<br/>deleted?: \{path: string\}[];<br/>failed?: \{path: string; code: string; message: string\}[];<br/>\}) => void | オプション | フォルダ削除の進行状況を追跡するためのコールバック関数。フォルダ削除操作中に各バッチのファイルが処理された後に呼び出されます。 |
<!-- /Platform -->

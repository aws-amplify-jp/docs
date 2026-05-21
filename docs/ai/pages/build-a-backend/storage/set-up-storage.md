---
title: "ストレージの設定"
section: "build-a-backend/storage"
platforms: ["angular", "javascript", "nextjs", "react", "vue", "swift", "android", "flutter", "react-native"]
gen: 2
last-updated: "2026-04-22T14:02:04.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/storage/set-up-storage/"
---

このガイドでは、Amplify アプリでストレージを設定する方法を学びます。バックエンドリソースを設定し、ファイルの一覧表示、アップロード、ダウンロードを有効にします。

まだ Amplify アプリを作成していない場合は、[クイックスタートガイド](/[platform]/start/quickstart/)をご覧ください。

Amplify Storage は、Amazon Simple Storage Service（Amazon S3）の上に構築されたファイルストレージおよび管理機能をフロントエンド Web およびモバイルアプリにシームレスに統合します。コアファイル操作用の直感的な API と UI コンポーネントを提供し、開発者がクラウドサービスの複雑さに対処することなく、スケーラブルで安全なファイルストレージソリューションを構築できるようにします。

## ストレージバックエンドの構築

最初に、`amplify/storage/resource.ts` ファイルを作成します。このファイルは、ストレージバックエンドを設定する場所です。`defineStorage` 関数を使用してストレージをインスタンス化し、ストレージバケットの `name` を指定します。この `name` はバックエンド設定でバケットを識別するためのフレンドリー名です。Amplify は UUID を使用してアプリの一意の識別子を生成します。name 属性はアプリで使用するためのものです。

```ts title="amplify/storage/resource.ts"
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTeamDrive'
});
```

バックエンド定義を含む `amplify/backend.ts` ファイルにストレージ定義をインポートします。`defineBackend` にストレージを追加します。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
// highlight-next-line
import { storage } from './storage/resource';

defineBackend({
  auth,
  // highlight-next-line
  storage
});
```

`npx ampx sandbox` を実行するか、Amplify にアプリをデプロイすると、ファイルが保存される Amazon S3 バケットが設定されます。ストレージ内のファイルをアプリケーションでアクセスする前に、ストレージアクセスルールを設定する必要があります。

これらの変更をデプロイするには、変更を git にコミットし、変更をアップストリームにプッシュします。Amplify の CI/CD システムが自動的に変更を検出し、ビルドとデプロイを実行します。

```bash title="Terminal" showLineNumbers={false}
git commit -am "add storage backend"
git push
```

### ファイルパスアクセスの定義

デフォルトでは、ユーザーやその他のプロジェクトリソースはストレージバケット内のファイルにアクセスできません。アクセスは `defineStorage` 内の `access` コールバックを使用して明示的に許可する必要があります。

アクセスコールバックはオブジェクトを返します。このオブジェクトの各キーはファイルパスであり、各値はそのパスに適用されるアクセスルールの配列です。

以下の例は、一般的な写真共有アプリのファイルストレージ構造を設定する方法を示しています。ここでは、

1. ゲストはすべてのプロフィール画像を表示でき、プロフィール画像をアップロードしたユーザーのみが置き換えまたは削除できます。ユーザーはこの場合、Identity Pool ID（identityID）で識別されます。
2. すべてのユーザーが画像を送信できる一般的なプールもあります。

[ファイルパスへのアクセスのカスタマイズについて詳しく学ぶ](/[platform]/build-a-backend/storage/authorization/)。

```ts title="amplify/storage/resource.ts"
export const storage = defineStorage({
  name: 'amplifyTeamDrive',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});
```

### 追加のストレージバケットを設定する

Amplify Storage は、複数のストレージリソースを自動的にプロビジョニングおよび管理するようにバックエンドを設定する柔軟性を提供します。

同じ `defineStorage` 関数を使用して追加のストレージバケットを定義し、ストレージバケットを識別するための一意の説明的な `name` を指定できます。この `name` をストレージ API に渡して、アクションを実行するバケットを指定できます。定義したストレージバケット間でこの `name` 属性が一意であることを確認して、正しいバケットを確実に識別し、競合を防いでください。

追加のストレージバケットが定義されている場合、そのうちの 1 つを `isDefault` フラグでデフォルトとしてマークする必要があります。

```ts title="amplify/storage/resource.ts"
export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true, // デフォルトストレージバケットを識別（必須）
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})
```

バックエンド定義に追加のストレージリソースを追加します。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { firstBucket, secondBucket } from './storage/resource';

defineBackend({
  auth,
  firstBucket,
  // highlight-next-line
  secondBucket
});
```

<!-- Platform: react, angular, javascript, vue, nextjs, react-native -->
### ストレージバケットクライアントの使用

追加のストレージバケットは、Amplify Storage API に `bucket` オプションを渡すことでアプリケーションコードから参照できます。Amplify Backend で割り当てられたターゲットバケットの名前を指定できます。

```ts
import { downloadData } from 'aws-amplify/storage';

try {
  const result = downloadData({
    path: "album/2024/1.jpg",
    options: {
      // highlight-start
      // Amplify Backend で割り当てられた名前を使用してターゲットバケットを指定する
      bucket: "secondBucket"
      // highlight-end
    }
  }).result;
} catch (error) {
  console.log(`Error: ${error}`)
}
```
または、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。各 Amplify Storage API ページで追加の使用例を確認してください。

```ts
import { downloadData } from 'aws-amplify/storage';

try {
  const result = downloadData({
    path: 'album/2024/1.jpg',
    options: {
      // highlight-start
      // または、コンソールからバケット名と関連するリージョンを指定する
      bucket: {
        bucketName: 'second-bucket-name-from-console',
        region: 'us-east-2'
      }
      // highlight-end
    }
  }).result;
} catch (error) {
  console.log(`Error: ${error}`);
}

```
<!-- /Platform -->

<!-- Platform: android -->
### ストレージバケットクライアントの使用

追加のストレージバケットは、Amplify Storage API に `bucket` オプションを渡すことでアプリケーションコードから参照できます。Amplify Backend で割り当てられたターゲットバケットの名前を指定できます。

#### [Java]

```java
StorageBucket secondBucket = StorageBucket.fromOutputs("secondBucket");
StorageDownloadFileOptions options = StorageDownloadFileOptions.builder().bucket(secondBucket).build();
Amplify.Storage.downloadFile(
        StoragePath.fromString("public/example"),
        new File(getApplicationContext().getFilesDir() + "/download.txt"),
        options,
        result -> Log.i("MyAmplifyApp", "Successfully downloaded: " + result.getFile().getName()),
        error -> Log.e("MyAmplifyApp",  "Download Failure", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val secondBucket = StorageBucket.fromOutputs("secondBucket")
val options = StorageDownloadFileOptions.builder().bucket(secondBucket).build()
val file = File("${applicationContext.filesDir}/download.txt")
Amplify.Storage.downloadFile(StoragePath.fromString("public/example"), file, option,
    { Log.i("MyAmplifyApp", "Successfully downloaded: ${it.file.name}") },
    { Log.e("MyAmplifyApp",  "Download Failure", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val secondBucket = StorageBucket.fromOutputs("secondBucket")
val options = StorageDownloadFileOptions.builder().bucket(secondBucket).build()
val file = File("${applicationContext.filesDir}/download.txt")
val download = Amplify.Storage.downloadFile(StoragePath.fromString("public/example"), file, options)
try {
    val fileName = download.result().file.name
    Log.i("MyAmplifyApp", "Successfully downloaded: $fileName")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Download Failure", error)
}
```

#### [RxJava]

```java      
StorageBucket secondBucket = StorageBucket.fromOutputs("secondBucket");
StorageDownloadFileOptions options = StorageDownloadFileOptions.builder().bucket(secondBucket).build();
RxProgressAwareSingleOperation<StorageDownloadFileResult> download =
        RxAmplify.Storage.downloadFile(
            StoragePath.fromString("public/example"),
            new File(getApplicationContext().getFilesDir() + "/download.txt"),
            options
        );

download
    .observeResult()
    .subscribe(
        result -> Log.i("MyAmplifyApp", "Successfully downloaded: " + result.getFile().getName()),
        error -> Log.e("MyAmplifyApp",  "Download Failure", error)
    );
```

また、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。各 Amplify Storage API ページで追加の使用例を確認してください。

#### [Java]

```java
BucketInfo bucketInfo = new BucketInfo("second-bucket-name-from-console", "us-east-2");
StorageBucket secondBucket = StorageBucket.fromBucketInfo(bucketInfo);
StorageDownloadFileOptions options = StorageDownloadFileOptions.builder().bucket(secondBucket).build();
Amplify.Storage.downloadFile(
        StoragePath.fromString("public/example"),
        new File(getApplicationContext().getFilesDir() + "/download.txt"),
        options,
        result -> Log.i("MyAmplifyApp", "Successfully downloaded: " + result.getFile().getName()),
        error -> Log.e("MyAmplifyApp",  "Download Failure", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val bucketInfo = BucketInfo("second-bucket-name-from-console", "us-east-2")
val secondBucket = StorageBucket.fromBucketInfo(bucketInfo)
val options = StorageDownloadFileOptions.builder().bucket(secondBucket).build()
val file = File("${applicationContext.filesDir}/download.txt")
Amplify.Storage.downloadFile(StoragePath.fromString("public/example"), file, options,
    { Log.i("MyAmplifyApp", "Successfully downloaded: ${it.file.name}") },
    { Log.e("MyAmplifyApp",  "Download Failure", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val bucketInfo = BucketInfo("second-bucket-name-from-console", "us-east-2")
val secondBucket = StorageBucket.fromBucketInfo(bucketInfo)
val options = StorageDownloadFileOptions.builder().bucket(secondBucket).build()
val file = File("${applicationContext.filesDir}/download.txt")
val download = Amplify.Storage.downloadFile(StoragePath.fromString("public/example"), file, options)
try {
    val fileName = download.result().file.name
    Log.i("MyAmplifyApp", "Successfully downloaded: $fileName")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Download Failure", error)
}
```

#### [RxJava]

```java
BucketInfo bucketInfo = new BucketInfo("second-bucket-name-from-console", "us-east-2");
StorageBucket secondBucket = StorageBucket.fromBucketInfo(bucketInfo);
StorageDownloadFileOptions options = StorageDownloadFileOptions.builder().bucket(secondBucket).build();
RxProgressAwareSingleOperation<StorageDownloadFileResult> download =
        RxAmplify.Storage.downloadFile(
            StoragePath.fromString("public/example"),
            new File(getApplicationContext().getFilesDir() + "/download.txt"),
            options,
        );

download
    .observeResult()
    .subscribe(
        result -> Log.i("MyAmplifyApp", "Successfully downloaded: " + result.getFile().getName()),
        error -> Log.e("MyAmplifyApp",  "Download Failure", error)
    );
```

<!-- /Platform -->

<!-- Platform: swift -->
### ストレージバケットクライアントの使用

追加のストレージバケットは、Amplify Storage API に `bucket` オプションを渡すことでアプリケーションコードから参照できます。Amplify Backend で割り当てられたターゲットバケットの名前を指定できます。

```swift
let downloadTask = Amplify.Storage.downloadData(
    path: .fromString("public/example/path"),
    options: .init(
        bucket: .fromOutputs(name: "secondBucket")
    )
)
```

または、コンソールからバケット名とリージョンを直接指定することもできます。各 Amplify Storage API ページで追加の使用例を確認してください。

```swift
let downloadTask = Amplify.Storage.downloadData(
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
### ストレージバケットクライアントの使用

追加のストレージバケットは、Amplify Storage API に `bucket` オプションを渡すことでアプリケーションコードから参照できます。Amplify Backend で割り当てられたターゲットバケットの名前を指定できます。

```dart
import 'package:amplify_flutter/amplify_flutter.dart';

try {
  final result = await Amplify.Storage.downloadData(
    path: const StoragePath.fromString('album/2024/1.jpg'),
    options: StorageDownloadDataOptions(
      // highlight-start
      // Amplify Backend で割り当てられた名前を使用してターゲットバケットを指定する
      bucket: StorageBucket.fromOutputs('secondBucket'),
      // highlight-end
    ),
  ).result;
} on Exception catch (e) {
    print('Error: $e');
}
```
または、コンソールからバケット名とリージョンを指定してオブジェクトを渡すこともできます。各 Amplify Storage API ページで追加の使用例を確認してください。

```dart
import 'package:amplify_flutter/amplify_flutter.dart';

try {
  final result = await Amplify.Storage.downloadData(
    path: const StoragePath.fromString('album/2024/1.jpg'),
    options: const StorageDownloadDataOptions(
      // highlight-start
      // または、コンソールからバケット名と関連するリージョンを指定する
      bucket: StorageBucket.fromBucketInfo(
        BucketInfo(
          bucketName: 'second-bucket-name-from-console',
          region: 'us-east-2',
        ),
      ),
      // highlight-end
    ),
  ).result;
} on Exception catch (e) {
  print('Error: $e');
}
```
<!-- /Platform -->

## ストレージ削除動作の設定

デフォルトでは、ストレージリソースを削除するか Amplify アプリを削除するときに、Amplify は S3 バケットとそのすべてのオブジェクトを削除します。バケットとそのデータを保持するには、`keepOnDelete` を `true` に設定します。

```ts title="amplify/storage/resource.ts"
export const storage = defineStorage({
  name: 'myProjectFiles',
  // リソースが削除されたときにバケットを保持する
  keepOnDelete: true,
});
```

| 設定 | 動作 |
| --- | --- |
| `keepOnDelete: false`（デフォルト） | バケットとそのすべてのオブジェクトは削除時に削除されます。 |
| `keepOnDelete: true` | バケットは削除時に保持されます。不要になった場合は手動で削除する必要があります。 |

> **Warning:** 保持されたバケットは引き続き S3 ストレージコストが発生します。予期しない請求を避けるため、不要になったら [AWS S3 コンソール](https://console.aws.amazon.com/s3/)または AWS CLI（`your-bucket-name` を置き換える：`aws s3 rb s3://your-bucket-name --force`）を使用して保持されたバケットを手動で削除してください。

> **Info:** `npx ampx sandbox` を使用する場合、`keepOnDelete` 設定に関係なくバケットは常に削除されます。これは開発中のリソース蓄積を防ぎます。`keepOnDelete` 設定は、デプロイされた環境（接続された Git ブランチ）でのみ有効になります。

## アプリコードをストレージバックエンドに接続する

Amplify Storage ライブラリは、定義したバックエンドリソースに接続するクライアント API を提供します。

<!-- Platform: react, angular, javascript, vue, nextjs, react-native -->
### プロジェクトで Amplify を設定する

設定ファイルをアプリにインポートしてロードします。Amplify 設定ステップをアプリのルートエントリポイントに追加することをお勧めします。たとえば、React の `index.js` または Angular の `main.ts` です。

```javascript
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```
<Callout warning="true">

アプリケーションのライフサイクルの早期に `Amplify.configure` を呼び出すようにしてください。他の Amplify JavaScript API の前に `Amplify.configure` が呼び出されていない場合、設定不足またはエラーが発生します。

</Callout>
<!-- /Platform -->

<!-- Platform: swift -->
### 前提条件

Amplify ライブラリが統合されたアプリケーションと、以下のいずれかの最小ターゲット：
- **iOS 13.0** （**Xcode 14.1** 以上使用）
- **macOS 10.15** （**Xcode 14.1** 以上使用）
- **tvOS 13.0** （**Xcode 14.3** 以上使用）
- **watchOS 9.0** （**Xcode 14.3** 以上使用）
- **visionOS 1.0** （**Xcode 15 beta 2** 以上使用。プレビューサポート -詳細は以下を参照してください。）

完全な例については、[プロジェクト設定チュートリアル](/[platform]/start/quickstart/)に従ってください。

<Callout>

visionOS サポートは現在**プレビュー**段階であり、最新の[Amplify リリース](https://github.com/aws-amplify/amplify-swift/releases)を使用することで使用できます。新しい Xcode と visionOS バージョンがリリースされると、サポートはベストエフォートで必要な修正とともに更新されます。

</Callout>

### Swift Package Manager 経由で Amplify ライブラリをインストールする

1. アプリケーションに Amplify Libraries for Swift をインストールするには、Xcode でプロジェクトを開き、**ファイル > パッケージを追加** を選択します。

2. Amplify Library for Swift GitHub リポジトリ URL（`https://github.com/aws-amplify/amplify-swift`）を検索バーに入力し、**パッケージを追加** をクリックします。

  <Callout>

  注：**依存関係ルール**ドロップダウンから**次のメジャーバージョン**を選択する必要があります。

  </Callout>

3. 最後に、**AWSS3StoragePlugin**、**AWSCognitoAuthPlugin**、**Amplify** を選択します。次に、**パッケージを追加** をクリックします。

### プロジェクトで Amplify を設定する

`Amplify.add(plugin:)` を呼び出して Amplify Storage カテゴリを初期化します。初期化を完了するには `Amplify.configure()` を呼び出します。

#### [SwiftUI]

`App` シーンの上部に以下のインポートを追加し、`init` で Amplify を設定します。
```swift
import Amplify
import AWSCognitoAuthPlugin
import AWSS3StoragePlugin

@main
struct MyAmplifyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }

    init() {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.add(plugin: AWSS3StoragePlugin())
            try Amplify.configure(with: .amplifyOutputs)
            print("Amplify configured with Auth and Storage plugins")
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
    }
}
```

#### [UIKit]

`AppDelegate.swift` ファイルの上部に以下のインポートを追加します。

```swift
import Amplify
import AWSCognitoAuthPlugin
import AWSS3StoragePlugin
```

`application:didFinishLaunchingWithOptions` メソッドに以下のコードを追加します。

```swift
func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSS3StoragePlugin())
        try Amplify.configure(with: .amplifyOutputs)
        print("Amplify configured with Auth and Storage plugins")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }

    return true
}
```

このアプリケーションをビルドして実行すると、コンソールウィンドウに以下が表示されます。

```console
Amplify configured with Auth and Storage plugins
```
<!-- /Platform -->

<!-- Platform: android -->
### 前提条件

* Android API レベル 24（Android 7.0）以上を対象とする Android アプリケーション
    * Android プロジェクトの作成の完全な例については、[クイックスタートガイド](/[platform]/start/quickstart/)に従ってください。

### Amplify ライブラリをインストールする

**Gradle Scripts** を展開し、**build.gradle (Module: app)** を開きます。[クイックスタートガイド](/[platform]/start/quickstart/)の手順に従って Amplify をすでに設定しているはずです。

以下のライブラリを `dependencies` ブロックに追加します。
```kotlin title="app/build.gradle.kts"
android {
    compileOptions {
        // 最新の Java 機能のサポート
        isCoreLibraryDesugaringEnabled = true
    }
}

dependencies {
    // Amplify API 依存関係
    // highlight-start
    implementation("com.amplifyframework:aws-storage-s3:ANDROID_VERSION")
    implementation("com.amplifyframework:aws-auth-cognito:ANDROID_VERSION")    
    // highlight-end
    // ... その他の依存関係
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:ANDROID_DESUGAR_VERSION")
}
```

`aws-auth-cognito` は Amazon S3 への認証を提供するために使用されます。

**今すぐ同期** をクリックします。

### プロジェクトで Amplify を設定する

`Amplify.addPlugin()` を呼び出して Amplify Storage を初期化します。初期化を完了するには、`Amplify.configure()` を呼び出します。

アプリケーションクラスの `onCreate()` メソッドに以下のコードを追加します。

> **Warning:** `Amplify.configure` 関数を呼び出す前に、コンソールから `amplify_outputs.json` ファイルをダウンロードするか、以下のコマンドで生成してください。
> 
> ```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main --out-dir app/src/main/res/raw
```
> 
> 次に、生成またはダウンロードしたファイルが Android プロジェクトの適切なリソースディレクトリ（例：`app/src/main/res/raw`）にあることを確認してください。そうしないと、アプリケーションをコンパイルできません。

#### [Java]

```java
import android.util.Log;
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin;
import com.amplifyframework.core.Amplify;
import com.amplifyframework.core.configuration.AmplifyOutputs;
import com.amplifyframework.storage.s3.AWSS3StoragePlugin;
```

```java
Amplify.addPlugin(new AWSCognitoAuthPlugin());
Amplify.addPlugin(new AWSS3StoragePlugin());
```

クラスは次のようになります。

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // これらの行を追加して、AWSCognitoAuthPlugin と AWSS3StoragePlugin プラグインを追加します
            Amplify.addPlugin(new AWSCognitoAuthPlugin());
            Amplify.addPlugin(new AWSS3StoragePlugin());
            Amplify.configure(AmplifyOutputs.fromResource(R.raw.amplify_outputs), getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

#### [Kotlin]

```kotlin
import android.util.Log
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.core.configuration.AmplifyOutputs
import com.amplifyframework.storage.s3.AWSS3StoragePlugin
```

```kotlin
Amplify.addPlugin(AWSCognitoAuthPlugin())
Amplify.addPlugin(AWSS3StoragePlugin())
```

クラスは次のようになります。

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // これらの行を追加して、AWSCognitoAuthPlugin と AWSS3StoragePlugin プラグインを追加します
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.addPlugin(AWSS3StoragePlugin())
            Amplify.configure(AmplifyOutputs(R.raw.amplify_outputs), applicationContext)
            Log.i("MyAmplifyApp", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
        }
    }
}
```

#### [RxJava]

```java
import android.util.Log;
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin;
import com.amplifyframework.core.configuration.AmplifyOutputs;
import com.amplifyframework.rx.RxAmplify;
import com.amplifyframework.storage.s3.AWSS3StoragePlugin;
```

```java
RxAmplify.addPlugin(new AWSCognitoAuthPlugin());
RxAmplify.addPlugin(new AWSS3StoragePlugin());
```

クラスは次のようになります。

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // これらの行を追加して、AWSCognitoAuthPlugin と AWSS3StoragePlugin プラグインを追加します
            RxAmplify.addPlugin(new AWSCognitoAuthPlugin());
            RxAmplify.addPlugin(new AWSS3StoragePlugin());
            RxAmplify.configure(AmplifyOutputs.fromResource(R.raw.amplify_outputs), getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

ストレージカテゴリは認証を必要とするため、ストレージカテゴリの機能を使用する前に、[ゲストアクセス](/[platform]/build-a-backend/auth/concepts/guest-access/)を設定するか、[ユーザーをサインインさせる](/[platform]/frontend/auth/sign-in)必要があります。
<!-- /Platform -->

<!-- Platform: flutter -->
### 前提条件

Amplify Flutter は、iOS（13.0）、Android（API レベル 24）、macOS（10.15）の最小ターゲットプラットフォームが必要です。Web、Windows、または Linux をターゲットとする場合は、[Flutter のサポートされているデプロイメント プラットフォーム](https://docs.flutter.dev/reference/supported-platforms)を参照してください。

### Amplify ライブラリをインストールする

以下の依存関係を **app** の `pubspec.yaml` に追加します。これは、上記の**前提条件**で追加したその他の依存関係とともにあります。

```yaml
dependencies:
  flutter:
    sdk: flutter

  amplify_auth_cognito: ^2.0.0
  amplify_flutter: ^2.0.0
  amplify_storage_s3: ^2.0.0
```

### プロジェクトで Amplify を設定する

Amplify Auth および Storage カテゴリを初期化するには、各プラグインに対して `Amplify.addPlugin()` を呼び出すか、すべてのプラグインを `Amplify.addPlugins()` に渡します。初期化を完了するには、`Amplify.configure()` を呼び出します。

コードは次のようになります。

```dart
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_storage_s3/amplify_storage_s3.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> _configureAmplify() async {
  try {
    final auth = AmplifyAuthCognito();
    final storage = AmplifyStorageS3();
    await Amplify.addPlugins([auth, storage]);

    // アプリケーション内で初期化されたカテゴリを使用するために Amplify.configure を呼び出す
    await Amplify.configure(amplifyConfig);
  } on Exception catch (e) {
    safePrint('An error occurred configuring Amplify: $e');
  }
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await _configureAmplify();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  // ...
}
```
<!-- /Platform -->

### 最初のファイルをアップロードする

次に、`picture-submissions/` パスに写真をアップロードしましょう。

<!-- Platform: react, react-native -->
```jsx
import React from 'react';
import { uploadData } from 'aws-amplify/storage';

function App() {
  const [file, setFile] = React.useState();

  const handleChange = (event) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }
    uploadData({
      path: `picture-submissions/${file.name}`,
      data: file,
    });
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleClick}>Upload</button>
    </div>
  );
}
```
<!-- /Platform -->

<!-- Platform: javascript, angular, vue, nextjs -->
```javascript
import { uploadData } from "aws-amplify/storage";

const file = document.getElementById("file");
const upload = document.getElementById("upload");

upload.addEventListener("click", () => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file.files[0]);

  fileReader.onload = async (event) => {
    console.log("Complete File read successfully!", event.target.result);
    try {
      await uploadData({
        data: event.target.result,
        path: `picture-submissions/${file.files[0].name}`
      });
    } catch (e) {
      console.log("error", e);
    }
  };
});
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
import Amplify
import SwiftUI
import PhotosUI

struct ContentView: View {
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var image: Image?

    var body: some View {
        NavigationStack {
            VStack {
                image?
                    .resizable()
                    .scaledToFit()
            }
            .padding()
            PhotosPicker(
                selection: $selectedPhoto
            ) {
                Text("Select a photo to upload")
            }
            .task(id: selectedPhoto) {
                if let imageData = try? await selectedPhoto?.loadTransferable(type: Data.self) {
                    if let uiImage = UIImage(data: imageData) {
                        image = Image(uiImage: uiImage)
                    }
                    let uploadTask = Amplify.Storage.uploadData(
                        path: .fromString("picture-submissions/myPhoto.png"),
                        data: imageData
                    )
                }
            }
        }
    }
}
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
private void uploadFile() {
    File exampleFile = new File(getApplicationContext().getFilesDir(), "myPhoto.png");

    try {
        BufferedWriter writer = new BufferedWriter(new FileWriter(exampleFile));
        writer.append("Example file contents");
        writer.close();
    } catch (Exception exception) {
        Log.e("MyAmplifyApp", "Upload failed", exception);
    }

    Amplify.Storage.uploadFile(
            StoragePath.fromString("picture-submissions/myPhoto.png"),
            exampleFile,
            result -> Log.i("MyAmplifyApp", "Successfully uploaded: " + result.getPath()),
            storageFailure -> Log.e("MyAmplifyApp", "Upload failed", storageFailure)
    );
}
```

#### [Kotlin - Callbacks]

```kotlin
private fun uploadFile() {
    val exampleFile = File(applicationContext.filesDir, "myPhoto.png")
    exampleFile.writeText("Example file contents")

    Amplify.Storage.uploadFile(StoragePath.fromString("picture-submissions/myPhoto.png"), exampleFile,
        { Log.i("MyAmplifyApp", "Successfully uploaded: ${it.path}") },
        { Log.e("MyAmplifyApp", "Upload failed", it) }
    )
}
```

#### [Kotlin - Coroutines]

```kotlin
private suspend fun uploadFile() {
    val exampleFile = File(applicationContext.filesDir, "myPhoto.png")
    exampleFile.writeText("Example file contents")

    val upload = Amplify.Storage.uploadFile(StoragePath.fromString("picture-submissions/myPhoto.png"), exampleFile)
    try {
        val result = upload.result()
        Log.i("MyAmplifyApp", "Successfully uploaded: ${result.path}")
    } catch (error: StorageException) {
        Log.e("MyAmplifyApp", "Upload failed", error)
    }
}
```

#### [RxJava]

```java
private void uploadFile() {
    File exampleFile = new File(getApplicationContext().getFilesDir(), "myPhoto.png");

    try {
        BufferedWriter writer = new BufferedWriter(new FileWriter(exampleFile));
        writer.append("Example file contents");
        writer.close();
    } catch (Exception exception) {
        Log.e("MyAmplifyApp", "Upload failed", exception);
    }

    RxProgressAwareSingleOperation<StorageUploadFileResult> rxUploadOperation =
            RxAmplify.Storage.uploadFile(StoragePath.fromString("picture-submissions/myPhoto.png"), exampleFile);

    rxUploadOperation
            .observeResult()
            .subscribe(
                result -> Log.i("MyAmplifyApp", "Successfully uploaded: " + result.getPath()),
                error -> Log.e("MyAmplifyApp", "Upload failed", error)
            );
}
```

<!-- /Platform -->

<!-- Platform: flutter -->
<Callout>

注：`AWSFilePlatform` を使用するには、`flutter pub add aws_common` を実行して [aws_common](https://pub.dev/packages/aws_common) パッケージを Flutter プロジェクトに追加してください。

</Callout>

#### [All Platforms]

```dart
import 'package:amplify_flutter/amplify_flutter.dart';

Future<void> uploadFile() async {
  try {
    final result = await Amplify.Storage.uploadFile(
      localFile: AWSFile.fromPath('/path/to/local/myPhoto.png'),
      path: const StoragePath.fromString('picture-submissions/myPhoto.png'),
    ).result;
    safePrint('Uploaded file: ${result.uploadedItem.path}');
  } on StorageException catch (e) {
    safePrint(e.message);
  }
}
```

<Block name= "Mobile & Desktop">

```dart
import 'dart:io' show File;

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:aws_common/vm.dart';

Future<void> uploadFile(File file) async {
  try {
    final result = await Amplify.Storage.uploadFile(
      localFile: AWSFilePlatform.fromFile(file),
      path: const StoragePath.fromString('picture-submissions/myPhoto.png'),
    ).result;
    safePrint('Uploaded file: ${result.uploadedItem.path}');
  } on StorageException catch (e) {
    safePrint(e.message);
  }
}
```

#### [Web]

```dart
import 'dart:html' show File;

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:aws_common/web.dart';

Future<void> uploadFile(File file) async {
  final awsFile = AWSFilePlatform.fromFile(file);
  try {
    final result = await Amplify.Storage.uploadFile(
      localFile: awsFile,
      path: const StoragePath.fromString('picture-submissions/myPhoto.png'),
    ).result;
    safePrint('Uploaded file: ${result.uploadedItem.path}');
  } on StorageException catch (e) {
    safePrint(e.message);
  }
}
```

<!-- /Platform -->

## Amplify コンソールでのファイル管理

ストレージバックエンドをデプロイし、プロジェクトをクライアント API に接続した後、[Amplify コンソール](https://console.aws.amazon.com/amplify)でファイルとフォルダを管理できます。コンソールの Storage タブでアップロード、ダウンロード、コピーなどのオンデマンドアクションを実行できます。詳細については、[Amplify コンソールでのファイル管理](/[platform]/build-a-backend/storage/manage-with-amplify-console/)ガイドを参照してください。

## まとめ

おめでとうございます！Amplify Storage の設定ガイドを完了しました。このガイドでは、バックエンドリソースを設定して接続し、ファイルパスとアクセス定義をカスタマイズし、アプリケーションをバックエンドに接続してファイルのアップロードとダウンロードなどの機能を実装しました。

### 次のステップ

Amplify アプリでストレージの設定が完了したので、ファイル管理機能をアプリに追加できます。以下のガイドを使用してアップロード機能とダウンロード機能を実装するか、左側のナビゲーションからさらに多くの機能にアクセスできます。

- [ファイルをアップロード](/[platform]/frontend/storage/upload-files/)
- [ファイルをダウンロード](/[platform]/frontend/storage/download-files/)

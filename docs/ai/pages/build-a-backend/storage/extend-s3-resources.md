---
title: "S3 リソースを拡張する"
section: "build-a-backend/storage"
platforms: ["angular", "javascript", "nextjs", "react", "vue", "swift", "android", "flutter", "react-native"]
gen: 2
last-updated: "2024-05-21T17:56:46.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/storage/extend-s3-resources/"
---

## Amplify で生成された S3 リソースの場合

Amplify Storage は、ストレージ機能を提供するために Amazon S3 リソースを生成します。AWS Cloud Developer Kit (AWS CDK) を使用して、基盤となる Amazon S3 リソースにアクセスして、バックエンド設定をさらにカスタマイズできます。

### 例 - Transfer Acceleration を有効にする

以下は、バケットで Transfer Acceleration を有効にする方法の例です（[CDK ドキュメント](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.CfnBucket.AccelerateConfigurationProperty.html)）。バケットで Transfer Acceleration を有効にするには、次のように L2 CDK コンストラクトから L1 CDK コンストラクトをアンラップする必要があります。

```tsx
// highlight-next-line
import * as s3 from 'aws-cdk-lib/aws-s3';
import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';

const backend = defineBackend({
  storage
});

// highlight-start
const s3Bucket = backend.storage.resources.bucket;

const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;

cfnBucket.accelerateConfiguration = {
  accelerationStatus: "Enabled" // 'Suspended' if you want to disable transfer acceleration
}
// highlight-end
```
<!-- Platform: android -->
### 高速化された S3 エンドポイントを使用してファイルをアップロードする

`AWSS3StorageUploadFileOptions` で `useAccelerateEndpoint` パラメータを `true` に設定することで、高速化された S3 エンドポイントに切り替えます。

#### [Java]

```java
AWSS3StorageUploadFileOptions awsS3StorageUploadFileOptions =
              AWSS3StorageUploadFileOptions.builder().setUseAccelerateEndpoint(true).build();
 Amplify.Storage.uploadFile(
   StoragePath.fromString("public/example"),
   file
   awsS3StorageUploadFileOptions,
   result -> Log.i("MyAmplifyApp", "Successfully uploaded: " + result.getPath()),
   storageFailure -> Log.e("MyAmplifyApp", "Upload failed", storageFailure)
);
```

#### [Kotlin - Callbacks]

```kotlin
val awsS3StorageUploadFileOptions = AWSS3StorageUploadFileOptions.builder().
                                                  setUseAccelerateEndpoint(true).
                                                  build()
 Amplify.Storage.uploadFile(
   StoragePath.fromString("public/example"),
   file
   awsS3StorageUploadFileOptions,
   { Log.i("MyAmplifyApp", "Successfully uploaded: " + it.getPath()) },
   { Log.e("MyAmplifyApp", "Upload failed", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val awsS3StorageUploadFileOptions = AWSS3StorageUploadFileOptions.builder().
                                                    setUseAccelerateEndpoint(true).
                                                    build()
val upload = Amplify.Storage.uploadFile(StoragePath.fromString("public/example"), file, awsS3StorageUploadFileOptions)
try {
    val result = upload.result()
    Log.i("MyAmplifyApp", "Successfully uploaded: ${result.path}")
} catch (error: StorageException) {
    Log.e("MyAmplifyApp", "Upload failed", error)
}

```

#### [RxJava]

```java
AWSS3StorageUploadFileOptions awsS3StorageUploadFileOptions =
            AWSS3StorageUploadFileOptions.builder().setUseAccelerateEndpoint(true).build();
RxProgressAwareSingleOperation<StorageUploadFileResult> rxUploadOperation =
            RxAmplify.Storage.uploadFile(StoragePath.fromString("public/example"), file, awsS3StorageUploadFileOptions);
rxUploadOperation
            .observeResult()
            .subscribe(
                result -> Log.i("MyAmplifyApp", "Successfully uploaded: " + result.getPath()),
                error -> Log.e("MyAmplifyApp", "Upload failed", error)
            );

```

<!-- /Platform -->

<!-- Platform: swift -->
### 高速化された S3 エンドポイントを使用してファイルをアップロードする

次の Storage API のいずれかに対応する `pluginOptions` で `"useAccelerateEndpoint"` を `true` に設定することで、転送高速化を使用できます。
- `getUrl(key:options:)`
- `downloadData(key:options:)`
- `downloadFile(key:local:options:)`
- `uploadData(key:data:options:)`
- `uploadFile(key:local:options:)`

例えば、転送高速化を使用してファイルをアップロードする場合：

```swift
let uploadTask = Amplify.Storage.uploadFile(
    key: aKey,
    local: aLocalFile,
    options: .init(
        pluginOptions: [
            "useAccelerateEndpoint": true
        ]
    )
)

let data = try await uploadTask.value
```
<!-- /Platform -->

<!-- Platform: flutter -->
### 高速化された S3 エンドポイントを使用してファイルをアップロードする

次の API を呼び出す際に転送高速化を使用できます。

* `getUrl`
* `downloadData`
* `downloadFile`
* `uploadData`
* `uploadFile`

対応する Storage S3 プラグインオプションで `useAccelerateEndpoint` を `true` に設定して、高速化された S3 エンドポイントを操作に適用します。例えば、転送高速化を使用してファイルをアップロードする場合：

```dart
import 'package:amplify_storage_s3/amplify_storage_s3.dart';

Future<void> uploadFileUsingAcceleration(String filePath, String key) async {
  final localFile = AWSFile.fromPath(filePath);
  try {
    final uploadFileOperation = Amplify.Storage.uploadFile(
      localFile: localFile,
      key: key,
      options: const StorageUploadFileOptions(
        pluginOptions: S3UploadFilePluginOptions(
          useAccelerateEndpoint: true,
        ),
      ),
    );

    final result = await uploadFileOperation.result;
    safePrint('Uploaded file: ${result.uploadedItem.key}');
  } on StorageException catch (error) {
    safePrint('Something went wrong uploading file: ${error.message}');
  }
}
```
<!-- /Platform -->

詳細は [CDK のエスケープハッチ](https://docs.aws.amazon.com/cdk/v2/guide/cfn_layer.html#develop-customize-escape) をご覧ください。

<!-- Platform: react, angular, javascript, vue, nextjs, react-native, flutter -->
## 手動で設定した S3 リソースの場合

<!-- Platform: flutter -->
Web ターゲットに対して構築している場合は、このガイドに従ってください。
<!-- /Platform -->

> **Warning:** アプリから S3 バケットに呼び出しを行うには、S3 バケットの CORS ポリシーを設定する必要があります。このコールアウトは、S3 バケットの手動設定の場合のみです。

以下の手順で CORS ポリシーを設定します。

1. [Amazon S3 コンソール](https://s3.console.aws.amazon.com/s3/home?region=us-east-1)に移動し、プロジェクトの `userfiles` バケットをクリックします。通常、バケットは [Bucket Name][Id]-dev という名前です。![Amazon S3 コンソールに移動](/images/storage/CORS1.png)
2. バケットの **Permissions** タブをクリックします。![バケットの **Permissions** タブをクリック](/images/storage/CORS2.png)
3. **Cross-origin resource sharing (CORS)** セクションの編集ボタンをクリックします。![**Cross-origin resource sharing (CORS)** セクションの編集ボタンをクリック](/images/storage/CORS3.png)
4. 変更を加えて、**Save Changes** をクリックします。`ExposeHeaders` に `x-amz-meta-XXXX` 形式で必要なメタデータを追加できます。![Save Changes をクリック](/images/storage/CORS4.png)

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2",
      "ETag",
      "x-amz-meta-foo"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

<Callout>

**注：** AllowedOrigin を個別のドメインに更新することで、バケットへのアクセスを制限できます。

</Callout>
<!-- /Platform -->

---
title: "ファイルのコピー"
section: "frontend/storage"
platforms: ["angular", "flutter", "javascript", "nextjs", "react", "react-native", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/storage/copy-files/"
---

<Callout>

**注:** 1回の操作でコピーできるファイルは最大5GBまでです

</Callout>

copy APIを使用して、ストレージバケット内の既存ファイルを別のパスにコピーできます。

<!-- Platform: angular,javascript,nextjs,react,vue, react-native -->
`copy`メソッドは既存ファイルを指定されたパスに複製し、正常に完了時にオブジェクト`{path: 'destPath'}`を返します。

```javascript
import { copy } from 'aws-amplify/storage';

const copyFile = async () => {
  try {
    const response = await copy({
      source: {
        path: `album/2024/${encodeURIComponent('#1.jpg')}`,
        // または、path: ({identityId}) => `album/${identityId}/${encodeURIComponent('#1.jpg')`
      },
      destination: {
        path: 'shared/2024/#1.jpg',
        // または、path: ({identityId}) => `shared/${identityId}/#1.jpg`
      },
    });
  } catch (error) {
    console.error('Error', err);
  }
};
```
<Callout>

`source`パスに特殊文字がある場合、操作が失敗する可能性があります。特殊文字を含むsourceパスはURIエンコードする必要があります。`destination`パスはエンコードする**必要がありません**。

</Callout>

<Callout>

ID間のコピーは、destinationパスに他の認証済みユーザーの書き込みを許可する適切なアクセスルールがある場合にのみ許可されます。

</Callout>

## バケットを指定するか、バケット/リージョン間でコピーする

`bucket`オプションを指定することで、特定のバケットへの`copy`操作を実行することもできます。このオプションは、Amplify Backendで割り当てられたバケットの名前を表す文字列、またはコンソールから指定されたバケット名とリージョンを指定するオブジェクトのいずれかです。

```javascript
import { copy } from 'aws-amplify/storage';

const copyFile = async () => {
  try {
    const response = await copy({
      source: {
        path: 'album/2024/1.jpg',
        // Amplify Backendで割り当てられた名前またはコンソールのバケット名と関連リージョンを使用して
        // ターゲットバケットを指定する
        bucket: 'assignedNameInAmplifyBackend',
        expectedBucketOwner: '123456789012'
      },
      destination: {
        path: 'shared/2024/1.jpg',
        // Amplify Backendで割り当てられた名前またはコンソールのバケット名と関連リージョンを使用して
        // ターゲットバケットを指定する
        bucket: {
          bucketName: 'generated-second-bucket-name',
          region: 'us-east-2'
        },
        expectedBucketOwner: '123456789013'
      }
    });
  } catch (error) {
    console.error('Error', error);
  }
};
```

<Callout>
デフォルト以外のバケットにコピーするか、そこからコピーするには、sourceとdestinationの両方で`bucket`を明示的に定義する必要があります。
</Callout>

## `source`および`destination`オプション

オプション | 型 | デフォルト | 説明 |
| -- | :--: | :--: | ----------- |
| path | string \| <br/>(\{ identityId \}) => string | 必須 | ファイルをコピーまたはコピー元にするソースおよびdestinationバケット内のパスを表す文字列またはコールバック。<br /> **`source`のパスの各セグメントはURIエンコードする必要があります。** |
| bucket | string \| <br />\{ bucketName: string;<br/> region: string; \} | Amplify設定のデフォルトバケットとリージョン | Amplify Backendで割り当てられたターゲットバケットの名前を表す文字列、またはコンソールから指定されたバケット名とリージョンを指定するオブジェクト。<br/><br/>[追加のストレージバケットを設定する](/[platform]/build-a-backend/storage/set-up-storage/#configure-additional-storage-buckets)で詳細を確認してください。 |
| eTag | string | オプション | コピー**ソースオブジェクト**のエンティティタグ(ETag)値。ETagが指定されたタグと一致する場合のみオブジェクトをコピーします。 |
| notModifiedSince | Date | オプション | **ソースオブジェクト**が指定された時刻以降に変更されていない場合、コピーします。<br /><br/> **これは`eTag`が指定されていない場合のみ評価されます**|
| expectedBucketOwner | string | オプション | `source.expectedBucketOwner`: ソースバケットを所有するアカウントID。<br /><br /> `destination.expectedBucketOwner`: destinationバケットを所有するアカウントID。 |
<!-- /Platform -->

<!-- Platform: flutter -->
コピー操作を開始するユーザーは、コピーソースファイルに対して読み取り権限を持つ必要があります。

```dart
Future<void> copy() async {
  try {
    final result = await Amplify.Storage.copy(
      source: const StoragePath.fromString('album/2024/1.jpg'),
      destination: const StoragePath.fromString('shared/2024/1.jpg'),
    ).result;
    safePrint('Copied file: ${result.copiedItem.path}');
  } on StorageException catch (e) {
    safePrint(e);
  }
}
```
## バケットを指定するか、バケット/リージョン間でコピーする

`CopyBuckets`オプションを指定することで、特定のバケットへの`copy`操作を実行することもできます。
このオプションは、Amplify Backendで指定された名前から、またはコンソールのバケット名とリージョンから構築できる2つの`StorageBucket`パラメータを持つオブジェクトです。

```dart
final mainBucket = StorageBucket.fromOutputs(
  'mainBucket',
);
final bucket2 = StorageBucket.fromBucketInfo(
  BucketInfo(
    bucketName: 'second-bucket-name-from-console',
    region: 'us-east-2',
  ),
),
try {
  final result = await Amplify.Storage.copy(
    source: const StoragePath.fromString('album/2024/1.jpg'),
    destination: const StoragePath.fromString('shared/2024/1.jpg'),
    options: StorageCopyOptions(
      buckets: CopyBuckets(
        source: bucket1,
        destination: bucket2,
      ),
    ),
  ).result;
  safePrint('Copied file: ${result.copiedItem.path}');
} on StorageException catch (e) {
  print('Error: $e');
}
```

<Callout>
デフォルト以外のバケットにコピーするか、そこからコピーするには、sourceおよび/またはdestinationパスがそのバケットに存在する必要があります
</Callout>

## `copy`オプション

オプション | 型 | 説明 |
| -- | -- | ----------- |
| getProperties | boolean | 操作完了後にAmplify.Storage.getProperties()を使用してコピーされたオブジェクトのプロパティを取得するかどうか。trueに設定すると、返されたアイテムにはメタデータやコンテンツタイプなどの追加情報が含まれます。 |
| buckets | CopyBuckets | 2つの`StorageBucket`パラメータを受け入れるオブジェクト。同じバケットにコピーするには、`targetBucket`が`StorageBucket`である`CopyBuckets.sameBucket(targetBucket)`メソッドを使用します。[追加のストレージバケットを設定する](/[platform]/build-a-backend/storage/set-up-storage/#configure-additional-storage-buckets)で詳細を確認してください |

オプション付き`copy`の例:

```dart
final result = Amplify.Storage.copy(
  source: const StoragePath.fromString('album/2024/1.jpg'),
  destination: const StoragePath.fromString('shared/2024/1.jpg'),
  options: const StorageCopyOptions(
    pluginOptions: S3CopyPluginOptions(
      getProperties: true,
    ),
    buckets: CopyBuckets.sameBucket(
      StorageBucket.fromOutputs('secondBucket'),
    ),
  ),
);
```
<!-- /Platform -->

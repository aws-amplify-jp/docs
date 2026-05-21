---
title: "Kinesis Data Streamsクライアント"
section: "frontend/analytics"
platforms: ["swift", "android", "flutter"]
gen: 2
last-updated: "2026-04-06T15:34:36.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/kinesis/"
---

`AmplifyKinesisClient`は、[Amazon Kinesis Data Streams](https://aws.amazon.com/kinesis/data-streams/)にデータをストリーミングするための独立型クライアントです。以下の機能を提供します:

- オフラインサポートのためのローカル永続化
- 失敗したレコードの自動再試行
- 自動バッチ処理(リクエストあたり最大500レコードまたは10MB)
- インターバルベースの自動フラッシング(デフォルト: 30秒ごと)
- キャッシュされたレコードを保持しながら新しいレコードを無視する有効/無効の切り替え

<Callout>

これはAmplify Analyticsカテゴリプラグインとは別の独立型クライアントです。`PutRecords`を使用してKinesis Data Streams APIと直接通信します。

</Callout>

<Callout>

このクライアントを使用する前に、バックエンドが必要なIAM権限で構成されていることを確認してください。[Kinesis Data Streamsのセットアップ](/[platform]/build-a-backend/add-aws-services/analytics/kinesis/)を参照してください。

</Callout>

## はじめに

### インストール

<!-- Platform: android -->
モジュールの`build.gradle.kts`に依存関係を追加します:

```kotlin
dependencies {
    implementation("com.amplifyframework:aws-kinesis:LATEST_VERSION")
}
```
<!-- /Platform -->

<!-- Platform: swift -->
Swift Package Managerを使用して`AmplifyKinesisClient`をプロジェクトに追加します。Xcodeで**File > Add Package Dependencies**に移動し、Amplify Swift SDKのリポジトリURLを入力します。
<!-- /Platform -->

<!-- Platform: flutter -->
`pubspec.yaml`に依存関係を追加します:

```yaml
dependencies:
  amplify_kinesis: ^2.11.0
```
<!-- /Platform -->

### クライアントの初期化

<!-- Platform: android -->
```kotlin
import com.amplifyframework.kinesis.AmplifyKinesisClient

val kinesis = AmplifyKinesisClient(
    context = applicationContext,
    region = "us-east-1",
    credentialsProvider = credentialsProvider
)
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
import AmplifyKinesisClient

let kinesis = try AmplifyKinesisClient(
    region: "us-east-1",
    credentialsProvider: credentialsProvider
)
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
import 'package:amplify_kinesis/amplify_kinesis.dart';

final kinesis = await AmplifyKinesisClient.create(
    region: 'us-east-1',
    credentialsProvider: credentialsProvider,
);
```
<!-- /Platform -->

### 構成オプション

オプションオブジェクトを渡すことでクライアントの動作をカスタマイズできます:

<!-- Platform: android -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ(バイト単位)。 |
| `maxRetries` | 5 | レコードが破棄される前の最大再試行回数。 |
| `flushStrategy` | `FlushStrategy.Interval(30.seconds)` | 自動フラッシュインターバル。手動のみのフラッシングの場合は`FlushStrategy.None`を使用します。 |
| `configureClient` | `null` | 基盤となるAWS SDK `KinesisClient`をカスタマイズするためのエスケープハッチ。 |
<!-- /Platform -->

<!-- Platform: swift -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ(バイト単位)。 |
| `maxRetries` | 5 | レコードが破棄される前の最大再試行回数。 |
| `flushStrategy` | `.interval(30)` | 自動フラッシュインターバル(秒単位)。手動のみのフラッシングの場合は`.none`を使用します。 |
| `configureClient` | `nil` | 基盤となる`KinesisClientConfiguration`をカスタマイズするためのクロージャ。 |
<!-- /Platform -->

<!-- Platform: flutter -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ(バイト単位)。 |
| `maxRetries` | 5 | レコードが破棄される前の最大再試行回数。 |
| `flushStrategy` | `FlushInterval(interval: Duration(seconds: 30))` | 自動フラッシュインターバル。手動のみのフラッシングの場合は`FlushNone()`を使用します。 |
<!-- /Platform -->

<!-- Platform: android -->
```kotlin
import com.amplifyframework.kinesis.AmplifyKinesisClient
import com.amplifyframework.kinesis.AmplifyKinesisClientOptions
import com.amplifyframework.recordcache.FlushStrategy
import kotlin.time.Duration.Companion.seconds

val kinesis = AmplifyKinesisClient(
    context = applicationContext,
    region = "us-east-1",
    credentialsProvider = credentialsProvider,
    options = AmplifyKinesisClientOptions {
        cacheMaxBytes = 10L * 1024 * 1024  // 10 MB
        maxRetries = 3
        flushStrategy = FlushStrategy.Interval(60.seconds)
        configureClient {
            retryStrategy { maxAttempts = 10 }
        }
    }
)
```

自動フラッシングを無効にするには:

```kotlin
options = AmplifyKinesisClientOptions {
    flushStrategy = FlushStrategy.None
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let kinesis = try AmplifyKinesisClient(
    region: "us-east-1",
    credentialsProvider: credentialsProvider,
    options: .init(
        cacheMaxBytes: 10 * 1_024 * 1_024,  // 10 MB
        maxRetries: 3,
        flushStrategy: .interval(60),
        configureClient: { config in
            // 基盤となるKinesisClientConfigurationをカスタマイズする
        }
    )
)
```

自動フラッシングを無効にするには:

```swift
options: .init(flushStrategy: .none)
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final kinesis = await AmplifyKinesisClient.create(
    region: 'us-east-1',
    credentialsProvider: credentialsProvider,
    options: AmplifyKinesisClientOptions(
        cacheMaxBytes: 10 * 1024 * 1024,  // 10 MB
        maxRetries: 3,
        flushStrategy: FlushInterval(interval: Duration(seconds: 60)),
    ),
);
```

自動フラッシングを無効にするには:

```dart
options: AmplifyKinesisClientOptions(
    flushStrategy: FlushNone(),
),
```
<!-- /Platform -->

## 使用方法

### データの記録

`record()`を使用してデータをローカルキャッシュに永続化します。レコードは次のフラッシュサイクル(自動または手動)中にKinesisに送信されます。

<!-- Platform: android -->
```kotlin
val result = kinesis.record(
    data = "Hello Kinesis".toByteArray(),
    partitionKey = "partition-1",
    streamName = "my-stream"
)
when (result) {
    is Result.Success -> { /* 正常に記録されました */ }
    is Result.Failure -> { /* エラーを処理します */ }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await kinesis.record(
    data: "Hello Kinesis".data(using: .utf8)!,
    partitionKey: "partition-1",
    streamName: "my-stream"
)
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final result = await kinesis.record(
    data: Uint8List.fromList(utf8.encode('Hello Kinesis')),
    partitionKey: 'partition-1',
    streamName: 'my-stream',
);
switch (result) {
    case Ok(): print('記録されました');
    case Error(:final error): print('エラー: $error');
}
```
<!-- /Platform -->

クライアントが無効な状態で送信されたレコードは無視されます。

### レコードのフラッシュ

クライアントは設定されたインターバル(デフォルト: 30秒)でキャッシュされたレコードを自動的にフラッシュします。手動でフラッシュをトリガーすることもできます:

<!-- Platform: android -->
```kotlin
when (val result = kinesis.flush()) {
    is Result.Success -> println("${result.data.recordsFlushed}件のレコードをフラッシュしました")
    is Result.Failure -> println("フラッシュエラー: ${result.error}")
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let flushResult = try await kinesis.flush()
print("\(flushResult.recordsFlushed)件のレコードをフラッシュしました")
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
switch (await kinesis.flush()) {
    case Ok(:final value):
        print('${value.recordsFlushed}件のレコードをフラッシュしました');
    case Error(:final error):
        print('フラッシュに失敗しました: $error');
}
```
<!-- /Platform -->

各フラッシュはストリームあたり最大1バッチを送信します(最大500レコードまたは10MB)。残りのレコードは後続のフラッシュサイクルで取得されます。フラッシュが既に進行中の場合、呼び出しは`flushInProgress: true`で即座に戻ります。

手動フラッシュはクライアントが無効な場合でも機能し、コレクションを再度有効にすることなくキャッシュされたレコードをドレインできます。

### キャッシュのクリア

ローカルストレージからキャッシュされたすべてのレコードを削除します:

<!-- Platform: android -->
```kotlin
kinesis.clearCache()
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let cleared = try await kinesis.clearCache()
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
await kinesis.clearCache();
```
<!-- /Platform -->

### 有効化と無効化

実行時にレコードコレクションと自動フラッシングを切り替えることができます。無効な場合、新しいレコードは無視されますが、既にキャッシュされたレコードはストレージに残ります。

<!-- Platform: android -->
```kotlin
kinesis.disable()
// レコードは無視され、自動フラッシュは一時停止されます

kinesis.enable()
// コレクションと自動フラッシュが再開されます
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
await kinesis.disable()
// レコードは無視され、自動フラッシュは一時停止されます

await kinesis.enable()
// コレクションと自動フラッシュが再開されます
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
kinesis.disable();
// レコードは無視され、自動フラッシュは一時停止されます

kinesis.enable();
// コレクションと自動フラッシュが再開されます
```
<!-- /Platform -->

<!-- Platform: flutter -->
### クライアントのクローズ

クライアントの使用が終わったら、そのリソースを解放します。クローズ後、クライアントは再利用できません。

```dart
await kinesis.close();
```
<!-- /Platform -->

## 詳細

### エスケープハッチ

このクライアントのAPIがカバーしていない操作のために、基盤となるAWS SDK `KinesisClient`にアクセスします:

<!-- Platform: android -->
```kotlin
val sdkClient = kinesis.kinesisClient
// sdkClientを直接Kinesis APIコールに使用します
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let sdkClient = kinesis.getKinesisClient()
// sdkClientを直接Kinesis APIコールに使用します
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final sdkClient = kinesis.kinesisClient;
// sdkClientを直接Kinesis APIコールに使用します
```
<!-- /Platform -->

### エラーハンドリング

すべての操作はシールされた例外階層を通じてエラーをサーフェスします:

<!-- Platform: android -->
| エラータイプ | 説明 |
|---|---|
| `AmplifyKinesisValidationException` | レコード入力の検証に失敗しました(オーバーサイズレコード、無効なパーティションキー)。 |
| `AmplifyKinesisLimitExceededException` | ローカルキャッシュが満杯です。`flush()`または`clearCache()`を呼び出してスペースを解放します。 |
| `AmplifyKinesisStorageException` | ローカルデータベースエラー。 |
| `AmplifyKinesisUnknownException` | 予期しない、または分類されていないエラー。 |

操作は`Result<T, AmplifyKinesisException>`を返します:

```kotlin
when (val result = kinesis.record(...)) {
    is Result.Success -> { /* 成功 */ }
    is Result.Failure -> when (result.error) {
        is AmplifyKinesisValidationException -> { /* 無効な入力 */ }
        is AmplifyKinesisLimitExceededException -> { /* キャッシュ満杯 */ }
        is AmplifyKinesisStorageException -> { /* データベースエラー */ }
        is AmplifyKinesisUnknownException -> { /* 予期しないエラー */ }
    }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
| エラータイプ | 説明 |
|---|---|
| `KinesisError.validation` | レコード入力の検証に失敗しました(オーバーサイズレコード、無効なパーティションキー)。 |
| `KinesisError.cacheLimitExceeded` | ローカルキャッシュが満杯です。`flush()`または`clearCache()`を呼び出してスペースを解放します。 |
| `KinesisError.cache` | ローカルデータベースエラー。 |
| `KinesisError.unknown` | 予期しない、または分類されていないエラー。 |

操作は`KinesisError`をスローします:

```swift
do {
    try await kinesis.record(
        data: payload,
        partitionKey: "key",
        streamName: "stream"
    )
} catch let error as KinesisError {
    switch error {
    case .validation(let desc, _, _):
        print("検証エラー: \(desc)")
    case .cacheLimitExceeded:
        print("キャッシュ満杯")
    case .cache(let desc, _, _):
        print("ストレージエラー: \(desc)")
    case .unknown(let desc, _, _):
        print("不明なエラー: \(desc)")
    }
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
| エラータイプ | 説明 |
|---|---|
| `KinesisValidationException` | レコード入力の検証に失敗しました(オーバーサイズレコード、無効なパーティションキー)。 |
| `KinesisLimitExceededException` | ローカルキャッシュが満杯です。`flush()`または`clearCache()`を呼び出してスペースを解放します。 |
| `KinesisStorageException` | ローカルデータベースエラー。 |
| `KinesisUnknownException` | 予期しない、または分類されていないエラー。 |
| `ClientClosedException` | クライアントがクローズされており、使用できません。 |

操作は`AmplifyKinesisException`サブタイプで`Result<T>`を返します:

```dart
switch (await kinesis.record(...)) {
    case Ok(): break;
    case Error(:final error):
        switch (error) {
            case KinesisValidationException(): // 無効な入力
            case KinesisLimitExceededException(): // キャッシュ満杯
            case KinesisStorageException(): // データベースエラー
            case KinesisUnknownException(): // 予期しないエラー
            case ClientClosedException(): // クライアントがクローズされました
        }
}
```
<!-- /Platform -->

### 再試行動作

- すべての`PutRecords`エラーコード(`ProvisionedThroughputExceededException`、`InternalFailure`)は再試行可能として扱われます。
- 各失敗したレコードの再試行カウントは試行ごとにインクリメントされます。
- `maxRetries`(デフォルト: 5)を超えたレコードはキャッシュから永久に削除されます。
- SDKレベルのKinesisエラーはログに記録され、ストリームごとにスキップされるため、他のストリームはまだフラッシュできます。
- 非SDKエラー(ネットワーク障害、ストレージエラー)はフラッシュ全体を中止します。

### Kinesisサービスの制限

クライアントはサービスに送信する前にこれらの制限を強制します:

| 制限 | 値 |
|---|---|
| `PutRecords`リクエストあたりの最大レコード数 | 500 |
| 最大単一レコードサイズ | 10 MB |
| `PutRecords`リクエストあたりの最大合計ペイロード | 10 MB |
| 最大パーティションキー長 | 256文字 |

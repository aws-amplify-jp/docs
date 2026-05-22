---
title: "Amazon Data Firehose クライアント"
section: "frontend/analytics"
platforms: ["android", "flutter", "swift"]
gen: 2
last-updated: "2026-05-11T17:44:11.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/firehose/"
---

`AmplifyFirehoseClient` は [Amazon Data Firehose](https://aws.amazon.com/firehose/) デリバリーストリームへのデータストリーミング用スタンドアロンクライアントです。以下の機能を提供します:

- オフラインサポート用のローカル永続化
- 失敗したレコードの自動リトライ
- 自動バッチ処理（リクエストごとに最大 500 レコードまたは 4 MB）
- インターバルベースの自動フラッシュ（デフォルト: 30 秒ごと）
- キャッシュ済みレコードを保持しながら新しいレコードを静かにドロップする有効/無効の切り替え

<Callout>

これはスタンドアロンクライアントであり、Amplify Analytics カテゴリプラグインとは別です。`PutRecordBatch` を使用して Firehose API と直接通信します。

</Callout>

<Callout>

このクライアントを使用する前に、バックエンドが必要な IAM 権限で設定されていることを確認してください。[Amazon Data Firehose の設定](/[platform]/build-a-backend/add-aws-services/analytics/firehose/) を参照してください。

</Callout>

## はじめに

### インストール

<!-- Platform: android -->
モジュールの `build.gradle.kts` に依存関係を追加します:

```kotlin
dependencies {
    implementation("com.amplifyframework:aws-kinesis:LATEST_VERSION")
}
```
<!-- /Platform -->

<!-- Platform: swift -->
Swift Package Manager を使用してプロジェクトに `AmplifyFirehoseClient` を追加します。Xcode で **File > Add Package Dependencies** に移動し、Amplify Swift SDK のリポジトリ URL を入力します。
<!-- /Platform -->

<!-- Platform: flutter -->
`pubspec.yaml` に依存関係を追加します:

```yaml
dependencies:
  amplify_firehose: ^2.11.0
```
<!-- /Platform -->

### クライアントの初期化

<!-- Platform: android -->
```kotlin
import com.amplifyframework.firehose.AmplifyFirehoseClient

val firehose = AmplifyFirehoseClient(
    context = applicationContext,
    region = "us-east-1",
    credentialsProvider = credentialsProvider
)
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
import AmplifyFirehoseClient

let firehose = try AmplifyFirehoseClient(
    region: "us-east-1",
    credentialsProvider: credentialsProvider
)
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
import 'package:amplify_firehose/amplify_firehose.dart';

final firehose = await AmplifyFirehoseClient.create(
  region: 'us-east-1',
  credentialsProvider: credentialsProvider,
);
```

Flutter クライアントは `path_provider` を使用してローカルストレージパスを自動的に解決します。ウェブ上では IndexedDB をインメモリフォールバック付きで使用します。
<!-- /Platform -->

### 設定オプション

オプションオブジェクトを渡してクライアントの動作をカスタマイズできます:

<!-- Platform: android -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ（バイト単位）。 |
| `maxRetries` | 5 | レコードを破棄する前の最大リトライ回数。 |
| `flushStrategy` | `FlushStrategy.Interval(30.seconds)` | 自動フラッシュインターバル。手動のみのフラッシュには `FlushStrategy.None` を使用します。 |
| `configureClient` | `null` | 基礎となる AWS SDK `FirehoseClient` をカスタマイズするためのエスケープハッチ。 |
<!-- /Platform -->

<!-- Platform: swift -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ（バイト単位）。 |
| `maxRetries` | 5 | レコードを破棄する前の最大リトライ回数。 |
| `flushStrategy` | `.interval(30)` | 自動フラッシュインターバル（秒単位）。手動のみのフラッシュには `.none` を使用します。 |
| `configureClient` | `nil` | 基礎となる `FirehoseClientConfiguration` をカスタマイズするためのクロージャ。 |
<!-- /Platform -->

<!-- Platform: android -->
```kotlin
import com.amplifyframework.firehose.AmplifyFirehoseClient
import com.amplifyframework.firehose.AmplifyFirehoseClientOptions
import com.amplifyframework.recordcache.FlushStrategy
import kotlin.time.Duration.Companion.seconds

val firehose = AmplifyFirehoseClient(
    context = applicationContext,
    region = "us-east-1",
    credentialsProvider = credentialsProvider,
    options = AmplifyFirehoseClientOptions {
        cacheMaxBytes = 10L * 1024 * 1024  // 10 MB
        maxRetries = 5
        flushStrategy = FlushStrategy.Interval(30.seconds)
        configureClient {
            retryStrategy { maxAttempts = 10 }
        }
    }
)
```

自動フラッシュを無効にするには:

```kotlin
options = AmplifyFirehoseClientOptions {
    flushStrategy = FlushStrategy.None
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let firehose = try AmplifyFirehoseClient(
    region: "us-east-1",
    credentialsProvider: credentialsProvider,
    options: .init(
        cacheMaxBytes: 10 * 1_024 * 1_024,  // 10 MB
        maxRetries: 5,
        flushStrategy: .interval(30),
        configureClient: { config in
            // 基礎となる FirehoseClientConfiguration をカスタマイズ
        }
    )
)
```

自動フラッシュを無効にするには:

```swift
options: .init(flushStrategy: .none)
```
<!-- /Platform -->

<!-- Platform: flutter -->
| オプション | デフォルト | 説明 |
|---|---|---|
| `cacheMaxBytes` | 5 MB | ローカルレコードキャッシュの最大サイズ（バイト単位）。 |
| `maxRetries` | 5 | レコードを破棄する前の最大リトライ回数。 |
| `flushStrategy` | `FlushInterval(interval: Duration(seconds: 30))` | 自動フラッシュインターバル。手動のみのフラッシュには `FlushNone()` を使用します。 |

```dart
import 'package:amplify_firehose/amplify_firehose.dart';

final firehose = await AmplifyFirehoseClient.create(
  region: 'us-east-1',
  credentialsProvider: credentialsProvider,
  options: const AmplifyFirehoseClientOptions(
    cacheMaxBytes: 10 * 1024 * 1024, // 10 MB
    maxRetries: 5,
    flushStrategy: FlushInterval(
      interval: Duration(seconds: 30),
    ),
  ),
);
```

自動フラッシュを無効にするには:

```dart
options: const AmplifyFirehoseClientOptions(
  flushStrategy: FlushNone(),
)
```
<!-- /Platform -->

## 使い方

### レコードデータ

`record()` を使用してデータをローカルキャッシュに永続化します。レコードは次のフラッシュサイクル（自動または手動）中に Firehose に送信されます。

<!-- Platform: android -->
```kotlin
val result = firehose.record(
    data = "Hello Firehose".toByteArray(),
    streamName = "my-delivery-stream"
)
when (result) {
    is Result.Success -> { /* 正常に記録されました */ }
    is Result.Failure -> { /* エラーを処理します */ }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let result = try await firehose.record(
    data: "Hello Firehose".data(using: .utf8)!,
    streamName: "my-delivery-stream"
)
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
import 'dart:convert';
import 'dart:typed_data';

final result = await firehose.record(
  data: Uint8List.fromList(utf8.encode('Hello Firehose')),
  streamName: 'my-delivery-stream',
);
switch (result) {
  case Ok():
    // 正常に記録されました
  case Error(:final error):
    // エラーを処理します
}
```
<!-- /Platform -->

クライアントが無効な状態で送信されたレコードは静かにドロップされます。

### レコードをフラッシュ

クライアントは設定されたインターバル（デフォルト: 30 秒）でキャッシュされたレコードを自動的にフラッシュします。手動フラッシュをトリガーすることもできます:

<!-- Platform: android -->
```kotlin
when (val result = firehose.flush()) {
    is Result.Success -> println("${result.data.recordsFlushed} レコードをフラッシュしました")
    is Result.Failure -> println("フラッシュエラー: ${result.error}")
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let flushResult = try await firehose.flush()
print("フラッシュされたレコード: \(flushResult.recordsFlushed)")
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
switch (await firehose.flush()) {
  case Ok(:final value):
    print('フラッシュされたレコード: ${value.recordsFlushed}');
  case Error(:final error):
    print('フラッシュエラー: $error');
}
```
<!-- /Platform -->

各フラッシュはストリームごとに最大 1 バッチを送信します（最大 500 レコードまたは 4 MB）。残りのレコードは次のフラッシュサイクルで処理されます。フラッシュが既に進行中の場合、呼び出しは `flushInProgress: true` で即座に戻ります。

手動フラッシュはクライアントが無効な場合でも機能するため、収集を再度有効にすることなくキャッシュされたレコードをドレインできます。

### キャッシュをクリア

ローカルストレージからキャッシュされたすべてのレコードを削除します:

<!-- Platform: android -->
```kotlin
firehose.clearCache()
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let cleared = try await firehose.clearCache()
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final result = await firehose.clearCache();
```
<!-- /Platform -->

### 有効化と無効化

実行時にレコード収集と自動フラッシュを切り替えられます。無効にされた場合、新しいレコードは静かにドロップされますが、既存のキャッシュされたレコードはストレージに残ります。

<!-- Platform: android -->
```kotlin
firehose.disable()
// レコードはドロップされ、自動フラッシュは一時停止されます

firehose.enable()
// 収集と自動フラッシュが再開されます
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
await firehose.disable()
// レコードはドロップされ、自動フラッシュは一時停止されます

await firehose.enable()
// 収集と自動フラッシュが再開されます
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
firehose.disable();
// レコードはドロップされ、自動フラッシュは一時停止されます

firehose.enable();
// 収集と自動フラッシュが再開されます
```
<!-- /Platform -->

### クライアントをクローズ

クライアントでの操作が完了したら、リソースを解放するためにクローズします:

<!-- Platform: flutter -->
```dart
await firehose.close();
```
<!-- /Platform -->

クローズ後、すべての操作はエラーを返します。必要に応じて新しいクライアントインスタンスを作成してください。

## 高度な使用方法

### エスケープハッチ

このクライアントの API でカバーされていない操作について、基礎となる AWS SDK `FirehoseClient` にアクセスします:

<!-- Platform: android -->
```kotlin
val sdkClient = firehose.firehoseClient
// sdkClient を使用して Firehose API を直接呼び出します
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
let sdkClient = firehose.getFirehoseClient()
// sdkClient を使用して Firehose API を直接呼び出します
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final sdkClient = firehose.firehoseClient;
// sdkClient を使用して Firehose API を直接呼び出します
```
<!-- /Platform -->

### エラーハンドリング

すべての操作は、シール化された例外階層を通じてエラーを表示します:

<!-- Platform: android -->
| エラータイプ | 説明 |
|---|---|
| `AmplifyFirehoseValidationException` | レコード入力の検証に失敗しました（オーバーサイズのレコード）。 |
| `AmplifyFirehoseLimitExceededException` | ローカルキャッシュが満杯です。`flush()` または `clearCache()` を呼び出してスペースを解放してください。 |
| `AmplifyFirehoseStorageException` | ローカルデータベースエラー。 |
| `AmplifyFirehoseUnknownException` | 予期しないまたは分類されていないエラー。 |

操作は `Result<T, AmplifyFirehoseException>` を返します:

```kotlin
when (val result = firehose.record(...)) {
    is Result.Success -> { /* 成功 */ }
    is Result.Failure -> when (result.error) {
        is AmplifyFirehoseValidationException -> { /* 無効な入力 */ }
        is AmplifyFirehoseLimitExceededException -> { /* キャッシュがいっぱい */ }
        is AmplifyFirehoseStorageException -> { /* データベースエラー */ }
        is AmplifyFirehoseUnknownException -> { /* 予期しないエラー */ }
    }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
| エラータイプ | 説明 |
|---|---|
| `FirehoseError.validation` | レコード入力の検証に失敗しました（オーバーサイズのレコード）。 |
| `FirehoseError.cacheLimitExceeded` | ローカルキャッシュが満杯です。`flush()` または `clearCache()` を呼び出してスペースを解放してください。 |
| `FirehoseError.cache` | ローカルデータベースエラー。 |
| `FirehoseError.unknown` | 予期しないまたは分類されていないエラー。 |

操作は `FirehoseError` をスロー します:

```swift
do {
    try await firehose.record(
        data: payload,
        streamName: "stream"
    )
} catch let error as FirehoseError {
    switch error {
    case .validation(let desc, _, _):
        print("検証エラー: \(desc)")
    case .cacheLimitExceeded:
        print("キャッシュがいっぱい")
    case .cache(let desc, _, _):
        print("ストレージエラー: \(desc)")
    case .unknown(let desc, _, _):
        print("予期しないエラー: \(desc)")
    }
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
| エラータイプ | 説明 |
|---|---|
| `FirehoseValidationException` | レコード入力の検証に失敗しました（オーバーサイズのレコード）。 |
| `FirehoseLimitExceededException` | ローカルキャッシュが満杯です。`flush()` または `clearCache()` を呼び出してスペースを解放してください。 |
| `FirehoseStorageException` | ローカルデータベースエラー。 |
| `FirehoseClientClosedException` | クローズされたクライアントで操作が試行されました。 |
| `FirehoseUnknownException` | 予期しないまたは分類されていないエラー。 |

操作は `Result<T>` を返し、パターンマッチングできます:

```dart
final result = await firehose.record(
  data: payload,
  streamName: 'stream',
);
switch (result) {
  case Ok():
    // 成功
  case Error(:final error):
    switch (error) {
      case FirehoseValidationException():
        print('検証エラー: ${error.message}');
      case FirehoseLimitExceededException():
        print('キャッシュがいっぱい');
      case FirehoseStorageException():
        print('ストレージエラー: ${error.message}');
      case FirehoseClientClosedException():
        print('クライアントがクローズされています');
      case FirehoseUnknownException():
        print('予期しないエラー: ${error.message}');
    }
}
```
<!-- /Platform -->

### リトライ動作

- すべての `PutRecordBatch` エラーコード（`ServiceUnavailableException`、`InternalFailure`）は再試行可能として扱われます。
- 各失敗したレコードの再試行カウントは各試行後に増加します。
- `maxRetries`（デフォルト: 5）を超えるレコードはキャッシュから永久に削除されます。
- SDK レベルの Firehose エラーはログに記録され、ストリームごとにスキップされるため、他のストリームでもフラッシュできます。
- SDK 以外のエラー（ネットワーク障害、ストレージエラー）はフラッシュ全体を中止します。

### Firehose サービスリミット

クライアントはサービスに送信する前にこれらの制限を強制します:

| リミット | 値 |
|---|---|
| `PutRecordBatch` リクエストごとの最大レコード数 | 500 |
| 最大単一レコードサイズ | 1,000 KiB |
| `PutRecordBatch` リクエストごとの最大合計ペイロード | 4 MB |

---
title: DataStoreイベント
description: DataStoreイベントを再生中
---

DataStoreは定期的にAmplifyのハブに状態通知を公開します。 Hub に登録すると、DataStore の内部状態に関する洞察を得ることができます。イベントが公開されたとき:
* お使いのデバイスはネットワーク接続を失ったり復旧したりします。
* データはクラウドと同期されています。
* 同期されていない保留中の新しい変更があります。

次の9つのDataStoreイベントが定義されています:

## networkStatus

DataStoreが起動し、ネットワークの状態が変更されるたびにディスパッチされます

HubPayload `NetworkStatusEvent` には以下が含まれています:
- `active` (Bool): Cloudに接続できるネットワークにDataStoreがある場合は true、false、それ以外の場合は

## 登録が完了しました

DataStoreがすべてのモデルへのサブスクリプションの確立を終了するとディスパッチが適用されます

HubPayload: N/A

## syncQueriesStarted

DataStoreが最初の同期クエリを実行しようとしているときにディスパッチされます

HubPayload `syncQueriesStartedEvent` には以下が含まれています:
- `モデル` ([String]): 各モデルの `名前の配列`

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/datastore-events-model-synced.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/native_common/datastore-events.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/native_common/datastore-events.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/native_common/datastore-events.md"></inline-fragment>

## syncQueriesReady

すべてのモデルがクラウドから同期されたときに送信されました

HubPayload: N/A

## 準備完了

DataStore全体が準備ができたときにディスパッチされ、この時点ですべてのデータが利用可能です

HubPayload: N/A

## outboxMutationEnqueued

ローカルの変更がクラウドとの同期のために新たにステージングされたときにディスパッチを適用しました

HubPayload `outboxMutationEvent` には以下が含まれています:
- `modelName` (String): クラウドへの公開を待っているモデルの名前
- `要素`:
    - `モデル` (モデル): 公開されるモデルインスタンス

## outboxMutationProcessed

ローカルの変更がクラウドとの同期が完了し、ローカルで更新されたときにディスパッチされます

HubPayload `outboxMutationEvent` には以下が含まれています:
- `modelName` (String): 処理が完了したモデルの名前
- `要素`:
    - `モデル` (モデル): 処理されたモデルインスタンス
    - `_version` (Int): モデルインスタンスのバージョン
    - `_lastChangedAt` (Int): モデルインスタンスの最後の変更時間 (unix time)
    - `_deleted` (Bool): クラウドでモデルインスタンスが削除された場合は true

## outboxStatus

配送日時:
- データストアの開始
- 局所的な突然変異がアウトボックスにキューイングされるたびに
- 局所変異が処理されるたびに

HubPayload `OutboxStatusEvent` には以下が含まれています:
- `isEmpty` (Boole): クラウドへのアップロード待ちのローカル変更がないことを示す真偽値。

## 使用法
ネットワークの状態がアクティブかどうかを確認するには、次のリスナーを設定できます。

<inline-fragment platform="js" src="~/lib/datastore/fragments/js/datastore-events.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/datastore/fragments/android/datastore-events.md"></inline-fragment> <inline-fragment platform="ios" src="~/lib/datastore/fragments/ios/datastore-events.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/datastore/fragments/flutter/datastore-events.md"></inline-fragment>

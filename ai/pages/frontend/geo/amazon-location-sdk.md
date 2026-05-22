---
title: "Amazon Location Service SDKを使用する"
section: "frontend/geo"
platforms: ["android", "angular", "javascript", "nextjs", "react", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/geo/amazon-location-sdk/"
---

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
Amplify Geoは[Amazon Location Service](https://aws.amazon.com/location/)を使用した一般的なユースケースのソリューションを提供していますが、Amplify Geoが現在サポートしていない機能については、[Amazon Location Service SDK](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-location)に直接アクセスできます。

このガイドに従って、Amplify認証資格情報を使用してAmazon Location Service用の`aws-sdk`を開始します。

## 概要

このチュートリアルでは、以下の内容を取り上げます。

- Amplify認証でAmazon Location Service SDK呼び出し用のAWS SDK JavaScript v3パッケージをセットアップする。
- Amazon Location Service SDKを使用するコード例。

## SDK依存関係のインストール

クライアントでSDKを使用するための最初のステップは、次のコマンドで必要な依存関係をインストールすることです。

```bash title="Terminal" showLineNumbers={false}
npm add @aws-sdk/client-location
```

## アプリをAmazon Location Serviceに接続する

以下の手順では、アプリをAmazon Location Service APIに接続します。

**アプリをAmazon Location Serviceに接続するには**

React Appで`src/App.js`ファイルを開き、次の関数を呼び出してAmazon Location Serviceクライアントを初期化します。

```javascript
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  LocationClient,
  AssociateTrackerConsumerCommand
} from '@aws-sdk/client-location';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

const createClient = async () => {
  const session = await fetchAuthSession();
  const client = new LocationClient({
    credentials: session.credentials,
    region: amplifyconfig.aws_project_region
  });
  return client;
};
```

これでアプリがAmazon Location Serviceに正常に接続されました。

## Amazon Location Service APIを使用する

Amazon Location Service APIにアクセスするには、[Amplify Geo Mapのドキュメント](/[platform]/build-a-backend/add-aws-services/geo/set-up-geo/)または[Amazon Location Serviceコンソール](https://console.aws.amazon.com/location/home#/create)の指示に従ってリソースをプロビジョニングし、アプリを設定していることを確認してください。

サポートされている機能の完全なリストについては、[Amazon Location APIリファレンスドキュメント](https://docs.aws.amazon.com/location/index.html)を参照できます。

### 例: デバイス位置の取得

この例では、[Amazon Location Serviceコンソール](https://console.aws.amazon.com/location/tracking/home#/create)を使用してTrackerリソースをあらかじめプロビジョニングしておく必要があります。

次のコードは、Amazon Location Service APIを使用してデバイス位置を更新し、作成したTrackerを使用してデバイス位置を取得する方法を詳しく説明しています。

```javascript
// UpdateDevicePosition API
const params = {
  TrackerName: 'trackerId',
  Updates: [
    {
      DeviceId: 'deviceId',
      Position: [-122.431297, 37.773972],
      SampleTime: new Date()
    }
  ]
};
const command = new BatchUpdateDevicePositionCommand(params);
client.send(command, (err, data) => {
  if (err) console.error(err);
  if (data) console.log(data);
});

// GetDevicePosition API
const client = await createClient();
const params = {
  TrackerName: 'trackerId',
  DeviceId: 'deviceId'
};
const command = new GetDevicePositionCommand(params);
client.send(command, (err, data) => {
  if (err) console.error(err);
  if (data) console.log(data);
});
```
<!-- /Platform -->

<!-- Platform: android -->
Amplify Geoカテゴリで使用されるAWSサービスで利用可能でない機能が必要な場合は、エスケープハッチが提供されているため、そのサービスへの参照を取得できます。

注: CDKを使用してGeoリソースをプロビジョニングした場合、IAMポリシーはライブラリで必要なアクションのみを許可するようにスコープされます。
エスケープハッチのユースケースに応じて、[認可パーミッションを調整](/[platform]/build-a-backend/add-aws-services/geo/existing-resources/)してください。

#### [Java]

<Callout>

ブロッキングインターフェースまたはフューチャーベースの同等の非同期インターフェースを使用してKotlinクライアントをJavaから使用する方法について、[こちら](https://github.com/awslabs/smithy-kotlin/blob/main/docs/design/kotlin-smithy-sdk.md#java-interop)で詳しく学びます。

</Callout>

```java
import android.util.Log;

import androidx.annotation.NonNull;

import com.amplifyframework.core.Amplify;
import com.amplifyframework.geo.location.AWSLocationGeoPlugin;

import aws.sdk.kotlin.services.location.LocationClient;
import aws.sdk.kotlin.services.location.model.ListMapsRequest;
import aws.sdk.kotlin.services.location.model.ListMapsResponse;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlinx.coroutines.GlobalScope;
```

```java
// プラグインへの参照を取得
AWSLocationGeoPlugin geoPlugin = (AWSLocationGeoPlugin)
        Amplify.Geo.getPlugin("awsLocationGeoPlugin");
LocationClient locationClient = geoPlugin.getEscapeHatch();

// クライアントを使用してLocation Mapsエンドポイントに新しいリクエストを直接送信
ListMapsRequest request = ListMapsRequest.Companion.invoke(requestBuilder -> Unit.INSTANCE);
locationClient.listMaps(request, new Continuation<ListMapsResponse>() {
    @NonNull
    @Override
    public CoroutineContext getContext() {
        return GlobalScope.INSTANCE.getCoroutineContext();
    }

    @Override
    public void resumeWith(@NonNull Object resultOrException) {
        Log.i("MyAmplifyApp", resultOrException.toString());
    }
});
```

#### [Kotlin]

```kotlin
import android.util.Log
import aws.sdk.kotlin.services.location.LocationClient
import aws.sdk.kotlin.services.location.model.ListMapsRequest
import com.amplifyframework.core.Amplify
```

```kotlin
// Amazon Location Serviceクライアントへの参照を取得
val geoPlugin = Amplify.Geo.getPlugin("awsLocationGeoPlugin")
val locationClient = geoPlugin.escapeHatch as LocationClient

// クライアントを使用してLocation Mapsエンドポイントに新しいリクエストを直接送信
val request = ListMapsRequest {  }
val response = locationClient.listMaps(request)
Log.i("MyAmplifyApp", response.entries.toString())
```

## ドキュメントリソース

* [コンソールを通じたAmazon Location Serviceリソースの管理方法](https://docs.aws.amazon.com/location/latest/developerguide/welcome.html)

**マップ**
* [アプリケーションでAmazon Location Mapsを使用する](https://docs.aws.amazon.com/location/latest/developerguide/using-maps.html)
* [Amazon Location Maps APIリファレンス](https://docs.aws.amazon.com/location-maps/latest/APIReference/API_Operations.html)

**場所**
* [Amazon Locationを使用した場所と位置情報データの検索](https://docs.aws.amazon.com/location/latest/developerguide/searching-for-places.html)
* [Amazon Location Places APIリファレンス](https://docs.aws.amazon.com/location-places/latest/APIReference/API_Operations.html)

**デバイストラッキング**
* [Trackerリソースの管理](https://docs.aws.amazon.com/location/latest/developerguide/managing-trackers.html)
* [Amazon Location Trackers APIリファレンス](https://docs.aws.amazon.com/location-trackers/latest/APIReference/API_Operations.html)
<!-- /Platform -->

<!-- Platform: swift -->
Amplify Geoカテゴリで使用されるAWSLocationフレームワークで利用可能でない機能が必要な場合は、エスケープハッチが提供されているため、それを直接参照できます。

注: Geoリソースをプロビジョニングした場合、IAMポリシーはライブラリで必要なアクションのみを許可するようにスコープされます。エスケープハッチのユースケースに応じて、[認可パーミッションを調整](/[platform]/build-a-backend/add-aws-services/geo/existing-resources/)してください。

```swift
import AWSLocation
```

その後、エスケープハッチを取得し、`AWSLocation`のメソッドを直接呼び出します。

```swift
do {
    // AWSLocationGeoPluginを取得
    let plugin = try Amplify.Geo.getPlugin(for: "awsLocationGeoPlugin")
    guard let locationPlugin = plugin as? AWSLocationGeoPlugin else {
        return
    }

    // AWSLocationへの参照を取得
    let awsLocation = locationPlugin.getEscapeHatch()

    // リクエストを作成
    var request = ListMapsInput()
    request.maxResults = 5
    let response = try await awsLocation.listMaps(input: request)
    // レスポンスを処理 ...
} catch {
    print("エスケープハッチの取得中にエラーが発生しました \(error)")
}
```

## ドキュメントリソース

- [コンソールを通じたAmazon Location Serviceリソースの管理方法](https://docs.aws.amazon.com/location/latest/developerguide/welcome.html)

**マップ**

- [アプリケーションでAmazon Location Mapsを使用する](https://docs.aws.amazon.com/location/latest/developerguide/using-maps.html)
- [Amazon Location Maps APIリファレンス](https://docs.aws.amazon.com/location-maps/latest/APIReference/API_Operations.html)

**場所**

- [Amazon Locationを使用した場所と位置情報データの検索](https://docs.aws.amazon.com/location/latest/developerguide/searching-for-places.html)
- [Amazon Location Places APIリファレンス](https://docs.aws.amazon.com/location-places/latest/APIReference/API_Operations.html)

**デバイストラッキング**

- [Trackerリソースの管理](https://docs.aws.amazon.com/location/latest/developerguide/managing-trackers.html)
- [Amazon Location Trackers APIリファレンス](https://docs.aws.amazon.com/location-trackers/latest/APIReference/API_Operations.html)
<!-- /Platform -->

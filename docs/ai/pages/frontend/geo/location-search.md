---
title: "場所検索を使用する"
section: "frontend/geo"
platforms: ["android", "angular", "javascript", "nextjs", "react", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/geo/location-search/"
---

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
## マップに場所検索機能を追加する

まず、[場所検索を設定](/[platform]/build-a-backend/add-aws-services/geo/configure-location-search/)または[既存のAmazon Location Serviceリソースを使用](/[platform]/build-a-backend/add-aws-services/geo/existing-resources/)の指示に従って検索インデックスリソースをプロビジョニングして、アプリを設定してください。また、アプリケーションで[マップの表示](/[platform]/frontend/geo/maps)をすでに設定していることを確認してください。

<Callout>

**注:** Reactの場合、[Amplify UI Location Searchコンポーネント](https://ui.docs.amplify.aws/react/connected-components/geo#location-search)を使用して、検索結果を生成して表示できます。

</Callout>

マップに場所検索UIコンポーネントを追加するには、[maplibre-gl-geocoder](https://github.com/maplibre/maplibre-gl-geocoder)ライブラリを使用できます。`maplibre-gl-js-amplify`パッケージを使用すると、`maplibre-gl-geocoder`とAmplify Geoを簡単に統合できます。これは、ユーティリティ関数`createAmplifyGeocoder()`をエクスポートして、いくつかの事前定義された設定を備えた`maplibre-gl-geocoder`のインスタンスを返し、UIコンポーネントをカスタマイズするための[すべてのオプション](https://maplibre.org/maplibre-gl-geocoder/types/MaplibreGeocoderOptions.html)をサポートします。

次のコマンドで必要な依存関係をインストールしてください:

```bash title="Terminal" showLineNumbers={false} 
npm add @maplibre/maplibre-gl-geocoder maplibre-gl@1 maplibre-gl-js-amplify
```

> **注:** `maplibre-gl-js-amplify`バージョン4.0.0以上がインストールされていることを確認してください。

まず、場所検索UIコンポーネントを追加したいマップを作成してください。[マップの作成と表示](/[platform]/frontend/geo/maps)に関するガイドを参照してください。

次に、`createAmplifyGeocoder()`を使用して`MaplibreGeocoder`の新しいインスタンスを取得し、場所検索UIコンポーネントをマップに追加します。

> **注:** パッケージバンドラー(webpack、rollupなど)がCSSファイルを処理するように設定されていることを確認してください。webpackのドキュメントは[こちら](https://webpack.js.org/loaders/css-loader/)で確認できます。

```javascript
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling

async function initializeMap() {
    const el = document.createElement("div");
    el.setAttribute("id", "map");
    document.body.appendChild(el);

    const map = await createMap({
        container: "map",
        center: [-123.1187, 49.2819], // [Longitude, Latitude]
        zoom: 11,
    })

    map.addControl(createAmplifyGeocoder());
}

initializeMap();
```

![マップの右上隅に検索ボックスが表示されています](/images/geocoder-search-box-map.png)

### マップの外に場所検索ボックスを表示する

[maplibre-gl-geocoder](https://github.com/maplibre/maplibre-gl-geocoder)を使用して、場所検索UIコンポーネントをマップの外を含めアプリケーションの任意の場所に表示することもできます。

これを行うには、関数`onAdd()`を使用してhtml要素を抽出し、マップの`addControl()`関数を使用する代わりに、DOMの任意の場所にそれを添付します。

```javascript
const geocoder = createAmplifyGeocoder();
document.getElementById("search").appendChild(geocoder.onAdd());
```

![複数のスターバックスの場所を表示する検索ボックス](/images/geocoder-search-box.png)

### 検索アイコンをカスタマイズする

[maplibre-gl-geocoder](https://github.com/maplibre/maplibre-gl-geocoder)で使用される検索アイコンをカスタマイズして、好きな画像を使用できます。[MapLibreマーカー](https://maplibre.org/maplibre-gl-js/docs/API/#markers-and-controls)は、カスタム画像を渡す際に[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)が必要です。

次の例では、既存のSVGアイコンを`createAmplifyGeocoder`に渡す前にHTMLElementに配置します。これにより、[maplibre-gl-geocoder](https://github.com/maplibre/maplibre-gl-geocoder)が作成されます。

```javascript
import myIcon from "./myIcon.svg" // relative path to your custom icon

const icon = new Image(100, 100);
icon.src = myIcon;

const geocoder = createAmplifyGeocoder({ showResultMarkers: { element: icon } });
map.addControl(geocoder);
```

![複数のポインターを持つマップ上の検索ボックス](/images/geocoder-custom-images.png)

## 場所ベースの検索機能

Amplify Geoを使用すると、テキスト、住所、または地理座標で場所を検索できます。

### テキスト、住所、ビジネス名、都市などで検索する

`Geo.searchByText()` APIを使用すると、住所、名前、都市、地域などの自由形式のテキストで場所またはポイントオブインタレストを検索できます。

```javascript
import { Geo } from "@aws-amplify/geo"

Geo.searchByText("Amazon Go Store")
```

以下を提供することで、検索結果をさらにカスタマイズできます:
- `countries` - 検索結果を指定された国に制限します([ISO Alpha-3国コード](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)で指定)
- `maxResults` - 最大結果セットを制限します
- `biasPosition` - 検索の開始場所として機能します
- `searchAreaConstraints` - 検索内の領域を制限します
- `searchIndexName` - デフォルトとは異なるLocation Serviceの検索インデックスリソースを使用します

 **注:** `biasPosition`と`searchAreaConstraints`パラメータの両方を同時に提供するとエラーが返されます。

```javascript
const searchOptionsWithBiasPosition = {
  countries: string[], // Alpha-3 country codes
  maxResults: number, // 50 is the max and the default
  biasPosition: [
    longitude // number
    latitude // number,
  ], // Coordinates point to act as the center of the search
  searchIndexName: string, // the string name of the search index
}

const searchOptionsWithSearchAreaConstraints = {
  countries: ["USA"], // Alpha-3 country codes
  maxResults: 25, // 50 is the max and the default
  searchAreaConstraints: [SWLongitude, SWLatitude, NELongitude, NELatitude], // Bounding box to search inside of
  searchIndexName: string, // the string name of the search index
}

Geo.searchByText('Amazon Go Stores', searchOptionsWithBiasPosition)
```

これは検索制約にマッチする場所とその座標を返します。以下の例で示すように、場所は追加のメタデータを持つことがあります。

```javascript
// returns
[
  {
    geometry: {
      point:
        [
          -122.34014899999994, // Longitude point
          47.61609000000004 // Latitude point
        ],
    },
    addressNumber: "2131" // optional string for the address number alone
    country: "USA" // optional Alpha-3 country code
    label: "Amazon Go, 2131 7th Ave, Seattle, WA, 98121, USA" // Optional string
    municipality: "Seattle" // Optional string
    neighborhood: undefined // Optional string
    postalCode: "98121" // Optional string
    region: "Washington" // Optional string
    street: "7th Ave" // Optional string
    subRegion: "King County" // Optional string
  }
]
```

### 座標で検索する

`Geo.searchByCoordinates()` APIは逆ジオコーダーで、座標点を取得し、マップのその点で見つかるものについての情報を返します。返されるオブジェクトは、上記の`searchByText()` APIと同じ形です。

```javascript
import { Geo } from "@aws-amplify/geo";

Geo.searchByCoordinates([longitudePoint, latitudePoint])
```

`maxResults`パラメータで結果セットを制限することも、`searchIndexName`パラメータでデフォルトの検索インデックスをオーバーライドすることもできます。

```javascript
const searchOptionsWithBiasPosition = {
  maxResults: number, // 50 is the max and the default
  searchIndexName: string, // the string name of the search index
}

Geo.searchByCoordinates([-122.3399573, 47.616179], searchOptionsWithBiasPosition)
```

### 提案を検索する

`Geo.searchForSuggestions()` APIを使用すると、場所、住所、都市、地域などの自由形式のテキストで提案を検索できます。

```javascript
import { Geo } from "@aws-amplify/geo";

Geo.searchForSuggestions("Amazon Go Store")
```

`Geo.searchByText()` APIと同様に、以下を提供することで検索結果をさらにカスタマイズできます:
- `countries` - 検索結果を指定された国に制限します([ISO Alpha-3国コード](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)で指定)
- `maxResults` - 最大結果セットを制限します
- `biasPosition` - 検索の開始場所として機能します
- `searchAreaConstraints` - 検索内の領域を制限します
- `searchIndexName` - デフォルトとは異なるLocation Serviceの検索インデックスリソースを使用します

 **注:** `biasPosition`と`searchAreaConstraints`パラメータの両方を同時に提供するとエラーが返されます。

```javascript
const searchOptionsWithBiasPosition = {
  countries: string[], // Alpha-3 country codes
  maxResults: number, // 50 is the max and the default
  biasPosition: [
    longitude // number
    latitude // number,
  ], // Coordinates point to act as the center of the search
  searchIndexName: string, // the string name of the search index
}

const searchOptionsWithSearchAreaConstraints = {
  countries: ["USA"], // Alpha-3 country codes
  maxResults: 25, // 50 is the max and the default
  searchAreaConstraints: [SWLongitude, SWLatitude, NELongitude, NELatitude], // Bounding box to search inside of
  searchIndexName: string, // the string name of the search index
}

Geo.searchForSuggestions('Amazon Go', searchOptionsWithBiasPosition)
```
これは検索制約にマッチする提案(場所とそれぞれの`placeId`が利用可能な場合)のリストを返します。

```javascript
// returns
[
  {
    text: "Amazon Go, 2131 7th Ave, Seattle, WA, 98121, USA",
    placeId: "8fd9d4c6-2527-4190-a7df-0dae352c9dc6"
  },
  {
    text: "Amazon Go, 1906 Terry Ave, Seattle, WA, 98101, USA",
    placeId: "5d04d071-dea2-4d86-bfce-86bd6a8f4787"
  }
]
```

以下のように提案リストで`placeId`が利用できない場合は、``searchByText``を使用して選択した場所をテキストで検索してください。

```javascript
Geo.searchForSuggestions("Amazon", { MaxResults: 5 })

// returns
[
  {
    text: "Amazon Go",
  },
  {
    text: "Amazon 4-star",
  }
]

Geo.searchByText('Amazon Go', { MaxResults: 5 })
```

これは検索テキストにマッチする場所とその座標を返します。

### PlaceIdで検索する

`Geo.searchByPlaceId()` APIを使用すると、プロバイダーが返した場所の一意の不透明トークンである`placeId`で場所を検索できます。

```javascript
import { Geo } from "@aws-amplify/geo";

Geo.searchByPlaceId(placeId)
```
`searchIndexName`パラメータでデフォルトの検索インデックスをオーバーライドすることもできます。

```javascript
const searchByPlaceIdOptions = {
  searchIndexName: string, // the string name of the search index
}

Geo.searchByPlaceId("8fd9d4c6-2527-4190-a7df-0dae352c9dc6", searchByPlaceIdOptions)
```

これは以下の例で示すようにメタデータを含む場所を返します。

```javascript
// returns
{
  geometry: {
    point:
      [
        -122.34014899999994, // Longitude point
        47.61609000000004 // Latitude point
      ],
  },
  addressNumber: "2131" // optional string for the address number alone
  country: "USA" // optional Alpha-3 country code
  label: "Amazon Go, 2131 7th Ave, Seattle, WA, 98121, USA" // Optional string
  municipality: "Seattle" // Optional string
  neighborhood: undefined // Optional string
  postalCode: "98121" // Optional string
  region: "Washington" // Optional string
  street: "7th Ave" // Optional string
  subRegion: "King County" // Optional string
}
```
<!-- /Platform -->

<!-- Platform: swift, android -->
## マップに場所検索機能を追加する

まず、[場所検索を設定](/[platform]/build-a-backend/add-aws-services/geo/configure-location-search/)または[既存のAmazon Location Serviceリソースを使用](/[platform]/build-a-backend/add-aws-services/geo/existing-resources/)の指示に従って検索インデックスリソースをプロビジョニングして、アプリを設定してください。また、アプリケーションで[マップの表示](/[platform]/frontend/geo/maps/)をすでに設定していることを確認してください。

<!-- Platform: android -->
`AmplifyMapView`は組み込みの場所検索、検索フィールド、および場所マーカーを提供します。マップページの[AmplifyMapViewセクション](/[platform]/frontend/geo/maps/#amplifymapview)に従って`AmplifyMapView`をセットアップしてください。
<!-- /Platform -->

<!-- Platform: swift -->
`AMLMapView`に場所検索UIコンポーネントを追加するには、目的のレイアウトでViewに`AMLSearchBar`を追加します。検索時に、`Geo.Place`は`AmplifyMapLibre.createFeatures(places)`を使用して`MGLPointFeature`に変換されます。最後に、それらの変換された`MGLPointFeature`を`mapState.features`に割り当てます。別の方法として、`AMLSearchBar`を含む他の事前設定されたUIコンポーネントを含む`AMLMapCompositeView`を直接活用することもできます。

```swift
import SwiftUI
import AmplifyMapLibreUI
import AmplifyMapLibreAdapter
import Amplify

struct MyMapView: View {

    @StateObject private var mapState = AMLMapViewState()
    @State private var searchText = ""
    @State private var displayState: AMLSearchBar.DisplayState = .map

    var body: some View {
        ZStack(alignment: .top) {
            AMLMapView(mapState: mapState)
                .edgesIgnoringSafeArea(.all)

            AMLSearchBar(
                text: $searchText,
                displayState: $displayState,
                onEditing: { },
                onCommit: search,
                onCancel: { mapState.features = [] }
            )
            .padding()
        }
    }

    private func search() {
        let searchArea = Geo.SearchArea.near(mapState.center)
        let searchOptions = Geo.SearchForTextOptions(area: searchArea)
        Task {
            do {
                let places = try await Amplify.Geo.search(for: searchText, options: searchOptions)
                await MainActor.run {
                    self.mapState.features = AmplifyMapLibre.createFeatures(places)
                }
            } catch let error as Geo.Error {
                print("Failed to search: \(error)")
            } catch {
                print("Unexpected error: \(error)")
            }
        }
    }
}
```

![検索バーが表示されている領域のマップビュー](/images/ios-geocoder-search-box-map.png)

### フィーチャーアイコンをカスタマイズする

`AMLMapView`または`AMLMapCompositeView`に表示されるフィーチャー画像をカスタマイズするには、`featureImage()`ビュー修飾子を活用できます。

```swift
var body: some View {
    AMLMapView(mapState: mapState)
        .featureImage {
            let image = UIImage(
                systemName: "paperplane.circle.fill",
                withConfiguration: UIImage.SymbolConfiguration(
                    font: .systemFont(ofSize: 22, weight: .medium)
                )
            )!
            return image
            }
        .edgesIgnoringSafeArea(.all)
}
```

![AMLMapViewのfeatureImageビュー修飾子](/images/ios-geocoder-custom-images.png)
<!-- /Platform -->

## 場所ベースの検索機能

Amplify Geoを使用すると、テキスト、住所、または地理座標で場所を検索できます。

<!-- Platform: android -->
### テキストで検索する

`Amplify.Geo.searchByText()` APIを使用すると、住所、名前、都市、地域などの自由形式のテキストで場所またはポイントオブインタレストを検索できます。

#### [Java]

```java
String searchQuery = "Amazon Go";
Amplify.Geo.searchByText(searchQuery,
    result -> {
        for (final Place place : result.getPlaces()) {
            Log.i("MyAmplifyApp", place.toString());
        }
    },
    error -> Log.e("MyAmplifyApp", "Failed to search for " + searchQuery, error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val searchQuery = "Amazon Go"
Amplify.Geo.searchByText(searchQuery,
    {
        for (place in it.places) {
            Log.i("MyAmplifyApp", place.toString())
        }
    },
    { Log.e("MyAmplifyApp", "Failed to search for $searchQuery", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val searchQuery = "Amazon Go"
try {
    val result = Amplify.Geo.searchByText(searchQuery)
    for (place in result.places) {
        Log.i("MyAmplifyApp", place.toString())
    }
} catch (error: GeoException) { 
    Log.e("MyAmplifyApp", "Failed to search for $searchQuery", it)
}
```

#### [RxJava]

```java
String searchQuery = "Amazon Go";
RxAmplify.Geo.searchByText(searchQuery).subscribe(
    result -> {
        for (final Place place : result.getPlaces()) {
            Log.i("MyAmplifyApp", place.toString());
        }
    },
    error -> Log.e("MyAmplifyApp", "Failed to search for " + searchQuery, error)
);
```

`GeoSearchByTextOptions`内で以下のパラメータを指定して検索結果を制限できます:
- `countries` - 検索結果を指定された国に制限します。[ISO Alpha-3国コード](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)に従っています。(デフォルトは"USA")
- `maxResults` - 最大結果セットを制限します(デフォルトは50)
- `searchArea`
  - `near` - 検索の開始場所として機能します
  - `within` - 検索内の領域を制限します

#### [Java]

```java
Coordinates position = new Coordinates(47.6153, -122.3384);
GeoSearchByTextOptions options = GeoSearchByTextOptions.builder()
    .maxResults(10)
    .searchArea(SearchArea.near(position))
    .countries(Collections.singletonList(CountryCode.USA))
    .build();
```

#### [Kotlin - Callbacks]

```kotlin
val position = Coordinates(47.6153, -122.3384)
val options = GeoSearchByTextOptions.builder()
    .maxResults(10)
    .searchArea(SearchArea.near(position))
    .countries(listOf(CountryCode.USA))
    .build()
```

#### [Kotlin - Coroutines]

```kotlin
val position = Coordinates(47.6153, -122.3384)
val options = GeoSearchByTextOptions.builder()
    .maxResults(10)
    .searchArea(SearchArea.near(position))
    .countries(listOf(CountryCode.USA))
    .build()
```

#### [RxJava]

```java
Coordinates position = new Coordinates(47.6153, -122.3384);
GeoSearchByTextOptions options = GeoSearchByTextOptions.builder()
    .maxResults(10)
    .searchArea(SearchArea.near(position))
    .countries(Collections.singletonList(CountryCode.USA))
    .build();
```

<!-- /Platform -->

<!-- Platform: swift -->
### テキストを検索する

`Amplify.Geo.search(for text:)` APIを使用すると、住所、名前、都市、地域などの自由形式のテキストで場所またはポイントオブインタレストを検索できます。

```swift
do {
    let places = try await Amplify.Geo.search(for: "coffee shops")
    dump(places)
} catch {
    print(error)
}
```

`Geo.SearchForTextOptions`内で以下のパラメータを指定して検索を改善できます

- `area`
  - `.near` - 検索の開始場所として機能します。
  - `.within` - 検索内の領域を制限します。
- `countries` - 検索結果を指定された国に制限します。
- `maxResults` - 最大結果セットを制限します(デフォルトは50)。

```swift
let coordinates = Geo.Coordinates(latitude: 47.62246, longitude: -122.336775)
let options = Geo.SearchForTextOptions(area: .near(coordinates), countries: [.usa, .can], maxResults: 25)

do {
    let places = try await Amplify.Geo.search(for: "coffee shops", options: options)
    dump(places)
} catch let error as Geo.Error {
    print("Failed to search: \(error)"
} catch {
    print("Unexpected error: \(error)")
}
```
<!-- /Platform -->

<!-- Platform: android -->
### 座標で検索する

`Amplify.Geo.searchByCoordinates()` APIは逆ジオコーダーで、座標点を取得し、マップのその点で見つかるものについての情報を返します。
返されるオブジェクトは`Amplify.Geo.searchByText()` APIと同じ形です。

#### [Java]

```java
Coordinates position = new Coordinates(47.6153, -122.3384);
Amplify.Geo.searchByCoordinates(position,
    result -> {
        for (final Place place : result.getPlaces()) {
            Log.i("MyAmplifyApp", place.toString());
        }
    },
    error -> Log.e("MyAmplifyApp", "Failed to reverse geocode " + position, error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val position = Coordinates(47.6153, -122.3384)
Amplify.Geo.searchByCoordinates(position,
    {
        for (place in it.places) {
            Log.i("MyAmplifyApp", place.toString())
        }
    },
    { Log.e("MyAmplifyApp", "Failed to reverse geocode $position", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val position = Coordinates(47.6153, -122.3384)
try {
    val result = Amplify.Geo.searchByCoordinates(position)
    for (place in result.places) {
        Log.i("MyAmplifyApp", place.toString())
    }
} catch (error: GeoException) {
    Log.e("MyAmplifyApp", "Failed to reverse geocode $position", error)
}
```

#### [RxJava]

```java
Coordinates position = new Coordinates(47.6153, -122.3384);
RxAmplify.Geo.searchByCoordinates(position).subscribe(
    result -> {
        for (final Place place : result.getPlaces()) {
            Log.i("MyAmplifyApp", place.toString());
        }
    },
    error -> Log.e("MyAmplifyApp", "Failed to reverse geocode " + position, error)
);
```

`GeoSearchByCoordinatesOptions`内で以下のパラメータを指定して検索結果を制限できます:
- `maxResults` - 最大結果セットを制限します(デフォルトは50)

#### [Java]

```java
GeoSearchByCoordinatesOptions options = GeoSearchByCoordinatesOptions.builder()
    .maxResults(1)
    .build();
```

#### [Kotlin - Callbacks]

```kotlin
val options = GeoSearchByCoordinatesOptions.builder()
    .maxResults(1)
    .build()
```

#### [Kotlin - Coroutines]

```kotlin
val options = GeoSearchByCoordinatesOptions.builder()
    .maxResults(1)
    .build()
```

#### [RxJava]

```java
GeoSearchByCoordinatesOptions options = GeoSearchByCoordinatesOptions.builder()
    .maxResults(1)
    .build();
```

<!-- /Platform -->

<!-- Platform: swift -->
### 座標を検索する

`Amplify.Geo.search(for coordinates:)` APIは逆ジオコーダーで、座標点を取得し、マップのその点で見つかるものについての情報を返します。

```swift
do {
    let places = try await Amplify.Geo.search(for: coordinates)
    dump(places)
} catch let error as Geo.Error {
    print("Failed to search: \(error)")
} catch {
    print("Unexpected error: \(error)")
}
```

`Geo.SearchForCoordinatesOptions`内で以下のパラメータを指定して検索を改善できます
- `maxResults` - 最大結果セットを制限します(デフォルトは50)

```swift
let options = Geo.SearchForCoordinatesOptions(maxResults: 25)
```
<!-- /Platform -->
<!-- /Platform -->

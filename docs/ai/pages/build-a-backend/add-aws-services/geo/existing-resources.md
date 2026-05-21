---
title: "既存の Amazon Location リソースを使用する"
section: "build-a-backend/add-aws-services/geo"
platforms: ["javascript", "swift", "android", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/geo/existing-resources/"
---

既存の Amazon Location Services リソースを Amplify バックエンドまたはフロントエンドアプリケーションで使用するには、`addOutput` メソッドを使用して、バックエンドリソースの出力を `amplify_outputs.json` ファイルに表示します:

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"

const backend = defineBackend({})

backend.addOutput({
  geo: {
    aws_region: "<your-aws-region>",
    maps: {
      items: {
        "<your-friendly-map-name>": {
          name: "<your-map-name>",
          style: "<your-map-style>",
        },
      },
      default: "<your-friendly-map-name>",
    },
  },
})
```

## 認可権限

Amplify Geo で既存の Amazon Location Service リソース（マップとプレイスインデックスなど）を使用するには、Cognito を通じて、ロールに適切な認可権限があることを確認する必要があります。

**注:** Amazon Location Service で使用する [Amazon Cognito アイデンティティプールの作成に関するガイド](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html)

Cognito によって 2 つのロールが作成されます。サインインしたユーザーレベルのアクセスを付与する「認証済みロール」と、リソースへの認証なしでのアクセスを許可する「認証なしロール」です。適切なリソースとロール (Auth または Unauth) に対して、次のポリシーをアタッチします。`{region}`、`{account-id}`、`{enter Map/PlaceIndex name}` を正しい項目に置き換えます。特定のアクションは認証なしアクセスでは実行できないことに注意してください。Unauth ロールで許可されるアクションのリストは、[Amazon Location Service へのアクセス権の付与ガイド](https://docs.aws.amazon.com/location/latest/developerguide/how-to-access.html)を参照してください。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetTiles",
      "Effect": "Allow",
      "Action": [
        "geo:GetMapTile",
        "geo:GetMapSprites",
        "geo:GetMapGlyphs",
        "geo:GetMapStyleDescriptor"
      ],
      "Resource": "arn:aws:geo:<your-geo-region>:<your-account-id>:map/<your-map-name>"
    },
    {
      "Sid": "Search",
      "Effect": "Allow",
      "Action": [
        "geo:SearchPlaceIndexForPosition",
        "geo:SearchPlaceIndexForText"
      ],
      "Resource": "arn:aws:geo:<your-geo-region>:<your-account-id>:place-index/<your-index-name>"
    },
    {
      "Sid": "Geofence",
      "Effect": "Allow",
      "Action": [
        "geo:GetGeofence",
        "geo:PutGeofence",
        "geo:BatchPutGeofence",
        "geo:BatchDeleteGeofence",
        "geo:ListGeofences",
      ],
      "Resource": "arn:aws:geo:<your-geo-region>:<your-account-id>:geofence-collection/<your-collection-name>"
    }
  ]
}
```

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
## クライアントライブラリを直接設定する

まず生成された `amplify_outputs.json` をインポートして解析できます。その後、次のように Amplify Geo を手動で設定できます:

```js
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  Geo: {
    LocationService: {
      maps: {
        items: {
          <your-map-name>: {
            // 必須 - Amazon Location Service マップリソース名
            style: 'VectorEsriStreets' // 必須 - マップリソースのスタイルを表す文字列
          }
        },
        default: '<your-preferred-default-map>' // 必須 - デフォルトとして設定する Amazon Location Service マップリソース名
      },
      search_indices: {
        items: ['<your-geo-index>'], // 必須 - Amazon Location Service プレイスインデックス名
        default: '<your-default-index>' // 必須 - デフォルトとして設定する Amazon Location Service プレイスインデックス名
      },
      geofenceCollections: {
        items: ['<your-geo-collection>'], // 必須 - Amazon Location Service ジオフェンスコレクション名
        default: '<your-default-collection>' // 必須 - デフォルトとして設定する Amazon Location Service ジオフェンスコレクション名
      },
      region: '<your-geo-region>' // 必須 - Amazon Location Service リージョン
    }
  }
});
```

これでアプリに[マップを表示](/[platform]/frontend/geo/maps/)するか、[位置情報検索を追加](/[platform]/frontend/geo/location-search/)することができます。
<!-- /Platform -->

---
title: "ロケーション検索の設定"
section: "build-a-backend/add-aws-services/geo"
platforms: ["android", "angular", "javascript", "nextjs", "react", "swift", "vue"]
gen: 2
last-updated: "2024-05-14T13:33:42.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/geo/configure-location-search/"
---

Amplifyの`geo`カテゴリは、アプリで「プレイスインデックス」リソースを使用して、場所、住所、座標で検索できるようにします。

## 新しいロケーション検索インデックスのセットアップ

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
// highlight-next-line
import { CfnMap, CfnPlaceIndex } from "aws-cdk-lib/aws-location";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  // additional resources
});

const geoStack = backend.createStack("geo-stack");

// create a location services map
const map = new CfnMap(geoStack, "Map", {
  mapName: "myMap",
  description: "Map",
  configuration: {
    style: "VectorEsriNavigation",
  },
  pricingPlan: "RequestBasedUsage",
  tags: [
    {
      key: "name",
      value: "myMap",
    },
  ],
});

// create an IAM policy to allow interacting with geo resource
const myGeoPolicy = new Policy(geoStack, "GeoPolicy", {
  policyName: "myGeoPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "geo:GetMapTile",
        "geo:GetMapSprites",
        "geo:GetMapGlyphs",
        "geo:GetMapStyleDescriptor",
      ],
      resources: [map.attrArn],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);

// highlight-start
// create a location services place index
const myIndex = new CfnPlaceIndex(geoStack, "PlaceIndex", {
  dataSource: "Here",
  dataSourceConfiguration: {
    intendedUse: "SingleUse",
  },
  indexName: "myPlaceIndex",
  pricingPlan: "RequestBasedUsage",
  tags: [
    {
      key: "name",
      value: "myPlaceIndex",
    },
  ],
});

// create a policy to allow access to the place index
const myIndexPolicy = new Policy(geoStack, "IndexPolicy", {
  policyName: "myIndexPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "geo:SearchPlaceIndexForPosition",
        "geo:SearchPlaceIndexForText",
        "geo:SearchPlaceIndexForSuggestions",
        "geo:GetPlace",
      ],
      resources: [myIndex.attrArn],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myIndexPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(myIndexPolicy);
// highlight-end

// patch the place index resource to the expected output configuration
backend.addOutput({
  geo: {
    aws_region: geoStack.region,
    maps: {
      items: {
        [map.mapName]: {
          style: "VectorEsriNavigation",
        },
      },
      default: map.mapName,
    },
// highlight-start
    search_indices: {
      default: myIndex.indexName,
      items: [myIndex.indexName],
    },
// highlight-end
  },
});
```

## ロケーション検索インデックスの料金プラン
検索インデックスの料金プランは`RequestBasedUsage`に設定されます。
料金プランの詳細については、[ロケーションサービス料金](https://aws.amazon.com/location/pricing/)および[ロケーションサービス利用規約](https://aws.amazon.com/service-terms/)（82.5セクション）を確認することをお勧めします。

## 詳細設定
ロケーション検索インデックスのデータプロバイダーと結果の保存場所をオプションで設定できます。

### ロケーション検索データプロバイダー
ジオコーディング、リバースジオコーディング、および検索のソースとしてデータプロバイダーを選択できます。
各プロバイダーは、異なる方法でデータを収集および管理しており、世界のさまざまな地域で異なる専門知識を持つ場合があります。
利用可能な地理空間データのデータプロバイダーが表示されます。データプロバイダーの詳細については、[ロケーションサービスドキュメンテーション](https://docs.aws.amazon.com/location/latest/developerguide/what-is-data-provider.html)を参照してください。

- Here – HERE Technologiesの詳細については、[Hereガイド](https://docs.aws.amazon.com/location/latest/developerguide/HERE.html)を参照してください。
- Esri – Esriの詳細については、[Esriガイド](https://docs.aws.amazon.com/location/latest/developerguide/esri.html)を参照してください。

<Callout>

**注：** アプリケーションが配送車両や従業員など、ビジネスで使用する資産を追跡またはルーティングしている場合、ジオロケーションプロバイダーとして`HERE`のみを使用できます。
詳細については、[AWSサービス利用規約](https://aws.amazon.com/service-terms/)のセクション82を参照してください。

</Callout>

### ロケーション検索結果の保存場所
検索操作の結果がコーラーによってどのように保存されるかを指定できます。

- SingleUse - 結果が保存されないことを指定します。
- Storage - 結果がキャッシュまたはデータベースに保存できることを指定します。

詳細については、[このロケーションサービスドキュメント](https://docs.aws.amazon.com/location-places/latest/APIReference/API_DataSourceConfiguration.html#locationplaces-Type-DataSourceConfiguration-IntendedUse)を参照してください。

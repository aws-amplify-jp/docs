---
title: 設定可能なパラメータ
description: GraphQL Transform用の追加設定可能なパラメータは、CloudFormationテンプレート自体に渡すことができます。 これにより、SDL定義にあまりにも多くの実装詳細を漏らすことなく、エスケープハッチが提供されます。
---

GraphQL Transform ロジックのほとんどの動作は、GraphQL SDL 定義のディレクティブに引数を渡すことによって設定されます。 ただし、CloudFormationテンプレート自体にパラメータを渡すことによって、他の特定のものが構成されます。 これにより、SDLの定義にあまりにも多くの実装の詳細を漏らすことなく、エスケープハッチが提供されます。 これらのパラメータに `パラメータを追加することで、値を渡すことができます。 son<code>` ファイルは、プロジェクトの増幅ディレクトリにあります。

## AppSyncApiName

**生成された AppSync API の名前を上書きする**

```
{
  "AppSyncApiName": "AppSyncAPI"
}
```

## CreateAPIKey

`CreateAPIKey` は `1` または `0` のいずれかの値をとります。

API キーの有効期限を処理するなどのシナリオで API キーを回転させるメカニズムを提供します。

API キーを回転させる必要がある場合は、次の 2 つの手順に従ってください。
- Delete the existing API key by setting `CreateAPIKey` to `0` in the `amplify/backend/api/<apiName>/parameters.json` file and execute `amplify push`.
- Create a new API key by setting `CreateAPIKey` to `1` in the `amplify/backend/api/<apiName>/parameters.json` file and execute `amplify push`.

**既存の API キーを削除します**

```
{
  "CreateAPIKey": 0
}
```

**新しいAPIキーを作成**

```
{
  "CreateAPIKey": 1
}
```

## APIKeyExpirationEpoch

**次の `増幅プッシュ`から1週間後にAPIキーをリセットします。**

```
{
  "APIKeyExpirationEpoch": 0
}
```

**API キーを作成しない**

```
{
  "APIKeyExpirationEpoch": -1
}
```

**カスタム API キーの有効期限を設定します**

```
{
  "APIKeyExpirationEpoch": 1544745428
}
```

> 指定された値は、Epoch からの有効期限です。

## DynamoDBBillingMode

**API の DynamoDB 課金モードを設定します。"PROVISIONED" または "PAY_PER_REQUEST" のいずれかです。**

```
{
  "DynamoDBBillingMode": "PAY_PER_REQUEST"
}
```

## DynamoDBModelTableReadIOPS

**各@modelテーブルに対してプロビジョニングされたデフォルトの読み取りIOPSを上書きする**

**「DynamoDBBillingMode」が「規定」に設定されている場合にのみ有効です**

```
{
  "DynamoDBModelTableReadIOPS": 5
}
```

## DynamoDBModelTableWriteIOPS

**各@modelテーブルにプロビジョニングされたIOPSのデフォルト書き込みを上書きする**

**「DynamoDBBillingMode」が「規定」に設定されている場合にのみ有効です**

```
{
  "DynamoDBModelTableWriteIOPS": 5
}
```

## ElasticSearchStreamingFunctionName

**AWS Lambda 検索可能なストリーミング機能の名前を上書きする**

```
{
  "ElasticSearchStreamingFunctionName": "CustomFunctionName"
}
```

## ElasticSearchInstanceCount

**@searchableによって作成されたElasticsearchドメインに起動したインスタンス数を上書きする**

```
{
  "ElasticSearchInstanceCount": 1
}
```

## ElasticSearchInstanceType

**@searchableによって作成されたElasticsearchドメインに起動されたインスタンスの種類を上書きする**

```
{
  "ElasticSearchInstanceType": "t2.small.elasticsearch"
}
```

## ElasticSearchEBSVolumeGB

**@searchableによって作成されたElasticsearchドメイン内の各インスタンスに割り当てられたディスク容量を上書きする**

```
{
  "ElasticSearchEBSVolumeGB": 10
}
```


**注: @auth ディレクティブを使用するには、Amazon Cognito ユーザプールを使用するように API を設定する必要があります。**

```graphql
type Task
  @model
  @auth(rules: [
      {allow: groups, groups: ["Managers"], operations: [create, update, delete]},
      {allow: groups, groups: ["Employees"], operations: [read, list]}
    ])
{
  id: ID!
  title: String!
  description: String
  status: String
}
type PrivateNote
  @model
  @auth(rules: [{allow: owner}])
{
  id: ID!
  content: String!
}
```

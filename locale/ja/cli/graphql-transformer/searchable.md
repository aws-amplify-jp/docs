---
title: データを検索可能にする
description: '@searchable ディレクティブは @model オブジェクト型のデータを Amazon Elasticsearch Service にストリーミングし、その情報を検索する検索リゾルバを設定します。'
---

## @searchable

`@searchable` ディレクティブは、 `@model` オブジェクトのデータを Amazon Elasticsearch Service にストリーミングし、その情報を検索する検索リゾルバを設定します。

> **Migration warning**: You might observe duplicate records on search operations, if you deployed your GraphQL schema using CLI version older than 4.14.1 and have thereafter updated your schema & deployed the changes with a CLI version between 4.14.1 - 4.16.1. Please use this Python [script](https://github.com/aws-amplify/amplify-cli/blob/master/packages/graphql-elasticsearch-transformer/scripts/ddb_to_es.py) to remove the duplicate records from your Elasticsearch cluster. [This script](https://github.com/aws-amplify/amplify-cli/blob/master/packages/graphql-elasticsearch-transformer/scripts/ddb_to_es.py) indexes data from your DynamoDB Table to your Elasticsearch Cluster. View an example of how to call the script with the following parameters [here](https://aws-amplify.github.io/docs/cli-toolchain/graphql#example-of-calling-the-script).

> **Billing warning**: `@searchable` incurs an additional cost depending on instance size. For more information refer to [ElasticSearch service pricing](https://aws.amazon.com/elasticsearch-service/pricing/)

### 定義

```graphql
# DynamoDBからElasticsearchへデータをストリーミングし、検索機能を公開します。
OBJECTの@searchable(queries: SearchableQueryMap)
input SearchableQueryMap { search: String }
```

### 使用法

次のスキーマを指定すると、Postのインデックスが作成されます。 `@searchable` の型が他にある場合、ディレクティブはインデックスを作成します。 Amazon DynamoDBの投稿は、AWS Lambda経由でAmazon ElasticSearchのポストインデックスに自動的にストリーミングされ、searchQueryField リゾルバを接続します。

```graphql
type Post @model @searchable {
  id: ID!
  title: String!
  createdAt: String!
  updatedAt: String!
  upvotes: Int
}
```

DynamoDBにオブジェクトを作成し、通常の createPost `変異を使用してlambda` に自動的にストリーミングされます。

```graphql
mutation CreatePost {
  createPost(input: { title: "Stream me to Elasticsearch!" }) {
    id
    title
    createdAt
    updatedAt
    upvotes
  }
}
```

そして、 `一致する` クエリを使用して投稿を検索します。

```graphql
query SearchPosts {
  searchPosts(filter: { title: { match: "Stream" }}) {
    items {
      id
      title
    }
  }
}
```

スキーマには、Post タイプで指定したフィールドのデータ型に基づいて、複数の `SearchableTypes` が生成されます。

The `filter` parameter in the search query has a searchable type field that corresponds to the field listed in the Post type. For example, the `title` field of the `filter` object, has the following properties (containing the operators that are applicable to the `string` type):

* `eq` - Elasticsearchキーワードタイプを使用して正確な用語に一致します。
* `ne` - これは `eq` の逆演算です。
* `matchPhrase` - Elasticsearchの [Match Phrase Query](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-match-query-phrase.html) を使用して検索クエリ内のドキュメントをフィルタリングします。
* `matchPhrasePrefix` - これは Elasticsearch の [Match Phrase Prefix Query](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-match-query-phrase-prefix.html) を使用して、検索クエリ内のドキュメントをフィルタリングします。
* `multiMatch` - Elasticsearch [Multi Match Query](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-multi-match-query.html) に相当します。
* `exists` - Elasticsearch [存在するクエリ](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-exists-query.html) に相当します。
* `wildcard` - Elasticsearch [ワイルドカードクエリ](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-wildcard-query.html) に相当します。
* `regexp` - Elasticsearch [Regexp Query](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/query-dsl-regexp-query.html) に相当します。

`sort` パラメータは、検索結果の順序を指定するために使用できます。 は昇順 ( ` asc ` ) または降順 (`desc`) が指定されていない場合は昇順 (`desc`) にできます。

`limit` パラメータは、返される検索結果の数を制御します。指定されていない場合は、デフォルト値は 100 です。

たとえば、次の `ワイルドカード` クエリを使用して、ワイルドカード式を使用して投稿を検索できます。

```graphql
query SearchPosts {
  searchPost(filter: { title: { wildcard: "S*Elasticsearch!" }}) {
    items {
      id
      title
    }
  }
}
```

上記のクエリは、 `タイトル` が `S` で始まり、 `Elasticsearch!` で終わるすべてのドキュメントを返します。

Moreover you can use the `filter` parameter to pass a nested `and`/`or`/`not` condition. By default, every operation in the filter properties is *AND* ed. You can use the `or` or `not` properties in the `filter` parameter of the search query to override this behavior. Each of these operators (`and`, `or`, `not` properties in the filter object) accepts an array of searchable types which are in turn joined by the corresponding operator. For example, consider the following search query:

```graphql
query SearchPosts {
  searchPost(filter: {
    title: { wildcard: "S*" }
    or: [
      { createdAt: { eq: "08/20/2018" } },
      { updatedAt: { eq: "08/20/2018" } }
    ]
  }) {
    items {
      id
      title
    }
  }
}
```

Assuming you used the `createPost` mutation to create new posts with `title`, `createdAt` and `updatedAt` values, the above search query will return you a list of all `Posts`, whose `title` starts with `S` _and_ have `createdAt` _or_ `updatedAt` value as `08/20/2018`.

以下は、現在サポートされているGraphQLタイプごとの検索可能な操作の完全なリストです。

| GraphQLタイプ | 検索可能な操作                                                                                               |
| ----------:|:----------------------------------------------------------------------------------------------------- |
|        文字列 | `ne`, `eq`, `match`, `matchPhrase`, `matchPhrasePrefix`, `multiMatch`, `exists`, `wildcard`, `regexp` |
|        int | `ne`, `gt`, `lt`, `gte`, `lte`, `eq`, `range`                                                         |
|      Float | `ne`, `gt`, `lt`, `gte`, `lte`, `eq`, `range`                                                         |
|    Boolean | `eq`, `ne`                                                                                            |

### 既知の制限

- `@searchable` は DataStore と互換性がありませんが、API カテゴリで使用できます。
- `@searchable` is not compatible with Amazon ElasticSearch t2.micro instance as it only works with ElasticSearch version 1.5 and 2.3 and Amplify CLI only supports instances with ElasticSearch version >= 6.x.
- `@searchable` は @connection ディレクティブと互換性がありません
- Support for adding the `@searchable` directive does not yet provide automatic indexing for any existing data to Elasticsearch. View the feature request [here](https://github.com/aws-amplify/amplify-cli/issues/98).

### DynamoDBテーブルからElasticsearchのインデックスを埋めてください

The following Python [script](https://github.com/aws-amplify/amplify-cli/blob/master/packages/graphql-elasticsearch-transformer/scripts/ddb_to_es.py) creates an event stream of your DynamoDB records and sends them to your Elasticsearch Index. This will help you backfill your data should you choose to add `@searchable` to your @model types at a later time.

**スクリプトを呼び出す例**:

```bash
python3 ddb_to_ess y \
  --rn 'us-west-2' \ # テーブルとelasticsearchドメインが存在する領域を使用する
  --tn 'Post-XXXX-dev' \ # テーブル名
  --lf 'arn:aws:lambda:us-west-2:123456789xxx:function:DdbToEsFn-<api__id>-dev' \ # Lambda function ARN
  --esarn:aws:dynamodb:us-west-2:123456789xxx:table/Post<api__id>-dev/stream9-20-03T00:00:00:00:00:00 50' # Event source ARN
```

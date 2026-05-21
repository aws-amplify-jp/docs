---
title: "既存のMySQL・PostgreSQLデータベースをアプリに接続する"
section: "build-a-backend/data/connect-to-existing-data-sources"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-14T20:52:33.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/"
---

Amplifyのネイティブ統合は、MySQL・Postgresデータベースに対応しており、AWSのVPC内でホストされているか、サードパーティのホストされたデータベースプロバイダの外部でホストされているかに関わらず、どのようなデータベースでも対応します。

開始するには、次のデータベース情報を使用して接続文字列を作成する必要があります：

- データベース**ホスト名**
- データベース**ポート**
- データベース**ユーザー名**
- データベース**ユーザーパスワード**
- データベース**名**

## ステップ1 - データベース接続のシークレットを設定する

まず、すべてのデータベース接続情報をシークレットとして指定します。Amplifyサンドボックスのシークレット機能を使用して設定するか、Amplifyコンソールに移動して共有環境のシークレットを設定できます：

```bash showLineNumbers={false}
npx ampx sandbox secret set SQL_CONNECTION_STRING
```

#### [MySQL]
**MySQLの接続文字列形式**
```console showLineNumbers={false}
mysql://user:password@hostname:port/db-name
```

#### [PostgreSQL]
**PostgreSQLの接続文字列形式**
```console showLineNumbers={false}
postgres://user:password@hostname:port/db-name
```

## ステップ2 - データベーススキーマのTypeScript表現を生成する

次のコマンドを実行して、データベース接続情報でデータスキーマを生成します。**プライマリキーが指定されているすべてのデータベーステーブル**に対して、`a.model()`表現を推測します。

```bash
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --out amplify/data/schema.sql.ts
```

<Accordion eyebrow="情報" title="VPC内にあるデータベースに接続する">

RDSデータベースがVPC内に存在する場合、`公的にアクセス可能`に設定する必要があります。これは、インスタンスがインターネット上のすべてのIPアドレスからアクセス可能である必要があることを意味しませんが、このフラグはローカルマシンが**インバウンドルール**経由で接続できるようにするために必要です。VPC内または VPN経由でVPCに接続されている必要があります。

**データベーススキーマのTypeScript表現を生成するには：**

データベースがVPCで保護されている場合、ローカルIPアドレスからのデータベースポートについて**インバウンドルール**を追加する必要があります。`npx ampx generate schema-from-database`コマンドは、ローカルワークステーションからデータベースに接続してスキーマ情報を読み取ります。

RDS Proxyに接続している場合、`generate schema-from-database`コマンドを実行するマシンは、プロキシ自体と同じVPC内にあるか、VPN経由で接続する必要があります。データベースポートの**インバウンドルール**を開くだけでは不十分です。

**実行時にデータベースに接続するには：**
接続情報を指定する場合、指定したホスト名を、プロジェクトと同じ地域のアカウント内のRDSインスタンス、クラスタ、プロキシのリストと比較します。一致するものが見つかった場合、データベースのVPC設定を自動的に検出し、SQL Lambda関数をプロビジョニングしてデータベースに接続し、スキーマを取得します。

データベースインスタンス、クラスタ、またはプロキシがインストールされているVPCセキュリティグループには、以下のTCPポートのトラフィックを許可する**インバウンドルール**が必要です：

1. 指定されたデータベースポート（例：MySQLデータベースの場合3306、Postgresデータベースの場合5432）。
2. ポート443（HTTPS）：Lambda関数がAWS Systems Managerに接続して設定パラメータを取得できるようにします。

最後に、セキュリティグループには、セキュリティグループ自体からこれらの同じポートのトラフィックを許可する**アウトバウンドルール**が必要です。

</details>

<Accordion eyebrow="情報" title="暗黙的なフィールドの処理（id、createdAt、updatedAt）">

`a.model()`経由で新しいDynamoDBベースのデータモデルを作成する場合、`id`、`createdAt`、`updatedAt`などの暗黙的なフィールドセットがデフォルトで追加されます。既存のSQLデータベースに接続する場合、これらのフィールドは基盤となるデータソースの一部ではないため、暗黙的に追加されません。`createdAt`と`updatedAt`が基盤となるデータベーステーブルの有効な列である場合、Amplify Dataは作成・更新ミューテーション時にそれぞれの値でこれらのフィールドを自動的に値を入力します。

</details>

<details><summary>改善された接続のためのRDS Proxy</summary>

クラスタの前にRDS Proxyを追加して、データベース接続を管理することを検討してください。

Amplify GraphQL APIをAmazon RDSなどのリレーショナルデータベースで使用する場合、アプリケーションからの各クエリはデータベースへの個別の接続を開く必要があります。

多くのクエリが同時に発生している場合、データベースの接続制限を超える可能性があり、「接続が多すぎます」などのエラーが発生します。これを回避するために、AmplifyはGraphQL APIをデータベースに接続する際にRDS Proxyを使用できます。

RDS Proxyはデータベースの前に位置する仲介役として機能します。各アプリケーションクエリがデータベースへの直接接続を開く代わりに、プロキシ経由で接続します。プロキシはこれらの接続を管理・プールして、データベースに負荷がかかるのを防ぎます。これはAPIの可用性を向上させ、接続制限に達することなく、より多くのクエリを同時に実行できるようになります。

ただし、トレードオフとしてレイテンシが増加します。クエリはプロキシプール内で利用可能な接続を待つため、わずかに時間がかかる可能性があります。RDS Proxyの使用に関連する追加コストもあります。詳細については、[RDS Proxyの価格ページ](https://aws.amazon.com/rds/proxy/pricing/)を参照してください。

</details>

<details><summary>カスタムSSL証明書を使用してデータベースに接続する</summary>

Amplifyは[AWS Lambda](https://aws.amazon.com/lambda)を使用してNode.jsランタイムで関数を作成し、AppSync APIをSQLデータベースに接続します。Lambda関数はSecure Socket Layer（SSL）またはTransport Layer Security（TLS）を使用してデータベースに接続し、転送中のデータを保護します。Amplifyはアマゾンのデータベースに対して正しいルート認証局（CA）証明書を自動的に使用します。また、Node.jsランタイムには、非RDSデータベースに接続するための[よく知られた証明書プロバイダ](https://github.com/nodejs/node/issues/4175)からのルートCAが含まれています。

ただし、データベースがカスタムまたは自己署名されたSSL証明書を使用している場合、4KB以下のPEM符号化公開CA証明書をAmplifyプロジェクトにシークレットとしてアップロードでき、データベースからスキーマを生成する際にそのシークレットを指定できます：

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox secret set CUSTOM_SSL_CERT < /path/to/custom/ssl/public-ca-cert.pem
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --ssl-cert-secret CUSTOM_SSL_CERT --out amplify/data/schema.sql.ts
```

Lambda関数は指定されたルートCAを使用してデータベースへの接続を検証します。

アプリを本番環境にデプロイする場合、[PEM符号化公開CA証明書をシークレットとして追加](/[platform]/deploy-and-host/fullstack-branching/secrets-and-vars/#set-secrets)する必要があります。サンドボックス環境で使用した同じシークレット名で証明書を追加してください。たとえば、上記で`CUSTOM_SSL_CERT`を使用しました。値の改行と`------BEGIN CERTIFICATE------`および`------END CERTIFICATE------`デリミタを保持してください。最後に、値全体のサイズが4KBを超えないようにしてください。

</details>

これにより、データベースのタイプを反映した新しい**schema.sql.ts**が作成されます。**schema.sql.tsファイルを直接編集しないでください**。スキーマを**amplify/data/resource.ts**ファイルにインポートして、追加の変更をそこで適用します。これにより、SQLデータベースのTypeScriptスキーマ表現を継続的に再生成でき、帯域外で適用した追加の変更を失うことはありません。

```ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
// highlight-start
import { schema as generatedSqlSchema } from './schema.sql';

// グローバル認可ルールを追加する
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())
// highlight-end

// リレーショナルデータベースソースはAmplifyで管理されるDynamoDBテーブルと共存できます。
const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization(allow => [allow.guest()])
});

// a.combine()演算子を使用して、DynamoDBでサポートされているモデルと
// PostgresまたはMySQLデータベースでサポートされているモデルを統合します。
// highlight-next-line
const combinedSchema = a.combine([schema, sqlSchema]);

// 両方のスキーマからのタイプを考慮してクライアント型を更新することを忘れないでください。
// highlight-next-line
export type Schema = ClientSchema<typeof combinedSchema>;

export const data = defineData({
  // データ定義を更新して、DynamoDBでサポートされているスキーマだけでなく
  // 統合スキーマを使用するようにします
  // highlight-next-line
  schema: combinedSchema
});
```

## ステップ3 - きめ細かい認可ルール

`.setAuthorization()`修飾子を使用して、SQLでサポートされているデータモデルのモデルレベルおよびフィールドレベルの認可ルールを設定します。詳細な認可ルール設定については、[認可ルールをカスタマイズする](/[platform]/build-a-backend/data/customize-authz)を確認してください。

```ts
// スキーマに認可ルールを追加する
// highlight-start
const sqlSchema = generatedSqlSchema.setAuthorization((models) => [
  // モデルレベルの認可ルール
  models.event.authorization((allow) => [allow.publicApiKey()]),
  // フィールドレベルの認可ルール
  models.event.fields.id.authorization(allow => [allow.publicApiKey(), allow.guest()]),
  models.event.fields.created_at.authorization(allow => [allow.publicApiKey(), allow.guest()])
]);
// highlight-end
```

## ステップ4 - クラウドサンドボックスを使用してデータリソースをデプロイする

最後に、クラウドサンドボックスでデータリソースを検証できます：

```bash
npx ampx sandbox
```

クライアント側では、SQLでサポートされているデータモデルを作成、読み取り、更新、削除、購読できます：

```ts
const { data: events } = await client.models.event.list()
```

## ステップ5 - 本番環境でのデータベース接続の設定

アプリを本番環境にデプロイする場合、[データベース接続文字列をシークレットとして追加](/[platform]/deploy-and-host/fullstack-branching/secrets-and-vars/#set-secrets)する必要があります。サンドボックス環境で使用した同じシークレット名で適切なデータベース接続文字列を追加してください。たとえば、上記で`SQL_CONNECTION_STRING`を使用しました。

<Video autoPlay={true} muted={true} loop={true} width="100%" playsInline={true} description="ビデオ - 本番環境でのデータベース接続の設定" src="/images/gen2/secrets-and-vars/secrets.mp4">
</Video>

## 生成されたモデルとフィールドを名前変更する

APIの使いやすさを向上させるために、生成されたフィールドまたはタイプの名前を変更して、ユースケースをより適切に対応させたい場合があります。`renameModels()`修飾子を使用して、自動推測されたデータモデルの名前を変更します。

```ts
// フロントエンドコードをより使いやすくするためにモデルまたはフィールドを名前変更する
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())
// highlight-start
  .renameModels(() => [
    //⌄⌄⌄⌄⌄ テーブル名に基づく既存のモデル名
    ['event', 'Event']
    //        ^^^^^^ 名前変更されたデータモデル名
  ])
  // highlight-end
```

## テーブル間のリレーションシップを追加する

```ts
const sqlSchema = generatedSqlSchema
  .authorization(allow => allow.guest())
// highlight-start
  .setRelationships((models) => [
    models.Note.relationships({
      comments: a.hasMany("Comment", "note_id"),
    }),
    models.Comment.relationships({
      note: a.belongsTo("Note", "note_id")
    })
  ]);
// highlight-end
```

## 自動生成されたSQLデータスキーマにカスタムクエリ、ミューテーション、サブスクリプションを追加する

`.addToSchema(...)`を使用して、自動生成されたSQLデータスキーマに追加のクエリ、ミューテーション、サブスクリプションを追加します。

> **Info:** 注：`a.model()`経由で追加のデータモデルを追加することはできません。それらは`npx ampx generate schema-from-database`経由で排他的に生成される必要があります。

### インラインSQLステートメントをクエリまたはミューテーションハンドラーとして使用する

```ts
// カスタムミューテーションまたはクエリを追加してSQLステートメントを実行する
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())
// highlight-start
  .addToSchema({
    listEventsWithDecodedLatLong: a.query()
      // スキーマに追加されたカスタムタイプを参照する
      .returns(a.ref("EventWithDecodedCoord").array())
      .handler(a.handler.inlineSql(
          `SELECT
            id,
            name,
            address,
            ST_X(geom) AS longitude,
            ST_Y(geom) AS latitude
          FROM locations;`
      ))
      .authorization(allow => [allow.guest()]),

      // カスタムクエリ・ミューテーションの終了型のある結果を提供するための
      // カスタムタイプを定義する
      EventWithDecodedCoord: a.customType({
        id: a.integer(),
        name: a.string(),
        address: a.string(),
        longitude: a.float(),
        latitude: a.float(),
      })
  })
// highlight-end
```

### 既存のSQLファイルをクエリまたはミューテーションハンドラーとして参照する

異なるSQLハンドラーを別の`.sql`ファイルに定義して、カスタムクエリ・ミューテーションで参照できます。

まず、**amplify/data/resource.ts**ファイルでカスタムクエリまたはミューテーションを設定します：
```ts
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())
  .addToSchema({
    createNewLocationWithLongLat: a.mutation()
      .arguments({
        lat: a.float().required(),
        long: a.float().required(),
        name: a.string().required(),
        address: a.string().required()
      })
      .returns(a.json().array())
      .authorization(allow => allow.authenticated())
      // highlight-next-line
      .handler(a.handler.sqlReference('./createNewLocationWithLongLat.sql'))
  })
```

次に、リクエストを処理するための対応するSQLファイルを追加します：

#### [MySQL]
```sql title="createNewLocationWithLongLat.sql"
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_GEOMFROMTEXT(CONCAT('POINT (', :long, ' ', :lat, ')'), 4326));
```

#### [PostgreSQL]
```sql title="createNewLocationWithLongLat.sql"
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_SetSRID(ST_MakePoint(:long, :lat), 4326))
```

> **Info:** SQLステートメントから行データを返すことが予想されるカスタムクエリとミューテーションの戻り値の型は、対応するモデルの配列である必要があります。これは、単一の行が予想されるカスタム`get`クエリの場合にも当てはまります。
> 
> **例**
> 
> ```ts
getPostBySlug: a
  .query()
  .arguments({
    slug: a.string().required(),
  })
  // highlight-start
  .returns(a.ref("Post").array())
  // highlight-end
  .handler(
    a.handler.inlineSql(`
    SELECT id, title, slug, content, created_at, updated_at
    FROM posts
    WHERE slug = :slug;
    `)
  )
```

## どのように動作しますか？

Amplifyは、AWS Lambda関数を使用して、データベースからデータをクエリするなどの機能を有効にします。正しく動作するには、これらのLambda関数が共通ロジックと依存関係にアクセスする必要があります。

Amplifyはこの共有コードをLambda Layersの形式で提供します。Lambda Layersは、Lambda関数が参照できる再利用可能なランタイムコードのパッケージと考えることができます。

Amplify APIをデプロイする場合、2つのLambda関数が作成されます：

### SQL Lambda

これにより、APIからデータベースに対してデータをクエリおよび書き込みできます。

<Callout>
  **注：**データベースがVPC内にある場合、このLambda関数はデータベースと同じVPC内にデプロイされます。AWS Lambda関数での Amazon Virtual Private Cloud（VPC）またはVPCピアリングの使用により、[Amazon Elastic Compute Cloud（EC2）オンデマンド価格ページ](https://aws.amazon.com/ec2/pricing/on-demand/)で説明されているように追加料金が発生します。
</Callout>

### Updater Lambda

SQL Lambdaのテンプレートを管理することで、SQL Lambdaを自動的に最新の状態に保ちます。

AWS Amplifyサービスアカウント内に存在するSQL接続ロジックを含むLambda Layerは、SQL Lambdaによって呼び出されるときにAWSアカウント内で実行されます。これにより、Amplifyサービスチームは、SQL接続ロジックの継続的なメンテナンスとセキュリティの向上を所有できます。

これにより、AmplifyチームはレイヤーへのアクセスなしでSQLレイヤーをメンテナンスおよび強化できます。レイヤーの更新が必要な場合、Updater Lambdaはamplifyから信号を受信し、SQL Lambdaを最新のレイヤーで自動的に更新します。

### 自動生成スキーマのSQLデータ型からフィールド型へのマッピング

> **Warning:** **注：**MySQLは、日時またはタイムスタンプフィールドのタイムゾーンオフセットをサポートしていません。代わりに、これらの値をオフセットのない`datetime`に変換します。MySQLとは異なり、PostgreSQLはオフセット付きの日時またはタイムスタンプ値をサポートしています。

| SQL                | マップされたフィールド型      |
|--------------------|--------------|
| **String**         |              |
| char               | a.string()       |
| varchar            | a.string()       |
| tinytext           | a.string()       |
| text               | a.string()       |
| mediumtext         | a.string()       |
| longtext           | a.string()       |
| **Geometry**       |              |
| geometry           | a.string()       |
| point              | a.string()       |
| linestring         | a.string()       |
| geometryCollection | a.string()       |
| **Numeric**        |              |
| smallint           | a.integer()          |
| mediumint          | a.integer()          |
| int                | a.integer()          |
| integer            | a.integer()          |
| bigint             | a.integer()          |
| tinyint            | a.integer()          |
| float              | a.float()        |
| double             | a.float()        |
| decimal            | a.float()        |
| dec                | a.float()        |
| numeric            | a.float()        |
| **Date and Time**  |              |
| date               | a.date()      |
| datetime           | a.datetime()   |
| timestamp          | a.datetime()   |
| time               | a.time()       |
| year               | a.integer()          |
| **Binary**         |              |
| binary             | a.string()        |
| varbinary          | a.string()        |
| tinyblob           | a.string()        |
| blob               | a.string()        |
| mediumblob         | a.string()        |
| longblob           | a.string()        |
| **Others**         |              |
| bool               | a.boolean()       |
| boolean            | a.boolean()       |
| bit                | a.integer()          |
| json               | a.json()       |
| enum               | a.enum()          |

## トラブルシューティング

### デバッグモード

基盤となるAPI応答から汎用エラーの代わりに実際のSQLエラーを返すには、Amplifyで生成されたSQL Lambda関数で環境変数`DEBUG_MODE`を`true`に設定できます。このLambda関数は、AWS Lambdaコンソールで`<stack-name>-<api-name>-SQLLambdaFunction<hash>`の命名規則で見つけることができます。

### `npx ampx generate schema-from-database`を実行しても、SQLテーブルが生成されません

これは、テーブルが指定されたプライマリキーを持っていないため、おそらくです。`npx ampx generate schema-from-database`がテーブル構造を推測し、作成、読み取り、更新、および削除APIを作成するには、プライマリキーが必要です。

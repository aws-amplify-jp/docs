
## AWS AppSync

Amplify Frameworkは、GraphQLを使用したマネージドサービスであるAWS AppSyncを使用して、アプリケーションが必要なデータを簡単に取得できるようにします。 AppSyncを使用すると、リアルタイムアップデートを必要とするアプリケーションを含むスケーラブルなアプリケーションを構築できます。 AWSラムダを使用すると、NoSQLデータストア、リレーショナルデータベース、HTTP API、カスタムデータソースなどのさまざまなデータソースを使用できます。

モバイルおよびWebアプリの場合、AppSyncはデバイスがオフラインになったときにローカルデータアクセスをサポートするSDKを提供します。 データ同期をカスタマイズ可能な競合解像度で行うことができます

### API カテゴリ

APIカテゴリは、GraphQLとRESTエンドポイントの両方にHTTPリクエストを行うためのソリューションを提供します。 これには、すべてのAWS APIリクエストに自動的に署名する [AWS Signature Version 4](http://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) signer クラスと、API キーを使用するメソッドが含まれています。 Amazon Cognitoユーザープール、またはサードパーティ製OIDCプロバイダー。

AWS Amplify APIモジュールはAWS AppSyncまたは他のGraphQLバックエンドをサポートしています。

<amplify-callout>

GraphQL の詳細については、 [GraphQL ウェブサイト](http://graphql.org/learn/) を参照してください。

</amplify-callout>

## AWS AppSync の使用

AWS AppSync を使用すると、リアルタイムおよびオフラインの機能を備えたデータドリブンなアプリケーションを構築できます。 [AWS AppSync](https://aws.amazon.com/appsync/) の詳細については、 [AWS AppSync Developer Guide](https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html) を参照してください。

Amplify Frameworkには、AppSync用の3つのSDKオプションがあります。

__[Amplify GraphQL client](~/lib/graphqlapi/query-data.md)__ - a light weight option if you're looking for a simple way to leverage GraphQL features and do not need the offline capabilities or caching. If you need those features, please look at [Amplify DataStore](~/lib/datastore/getting-started.md).

__[DataStore](~/lib/datastore/getting-started.md)__ - オフラインおよび低レイテンシのシナリオをサポートする必要のあるアプリを簡単に構築できます。 DataStore は、分散した作業も行います。 クロスユーザーデータは、追加のコードを書かずに共有および分散データを活用するためのプログラミングモデルを提供することによって、ローカルのみのデータを扱うのと同じくらい簡単です。

__[AWS AppSync SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-js/)__ - オフラインサポートを提供し、AWS AppSync サービスとアプリを統合し、 [ここ](https://github.com/apollographql/apollo-client/) で見つかったアポロクライアントと統合することができます。

AWS AppSync との連携は、次の手順で行うことができます。

1. クライアント側の設定で API エンドポイントと認証情報を設定します。
2. API スキーマから TypeScript/JavaScript コードを生成します。(任意)
3. クエリ、変更、サブスクリプションを実行するためのアプリコードを記述します。

Amplify CLI は、このプロセスを容易にする AppSync のサポートを提供します。 CLI を使用して、AWS AppSync API を設定し、必要なクライアント側の設定ファイルをダウンロードできます。 コマンドラインで簡単なコマンドを実行することで、数分でクライアントサイドコードを生成できます。
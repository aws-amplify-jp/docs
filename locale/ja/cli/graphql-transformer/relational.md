---
title: リレーショナルデータベース
description: Amplify CLI は現在、us-east-1 リージョンで実行されているサーバーレスの Amazon Aurora MySQL 5.6 データベースのインポートをサポートしています。 Amazon Aurora Serverless データベースの作成方法を学び、GraphQL データソースとしてこのデータベースをインポートしてテストします。
---

Amplify CLI は現在、us-east-1 リージョンで実行されているサーバーレスの Amazon Aurora MySQL 5.6 データベースのインポートをサポートしています。 次の手順では、Amazon Aurora Serverless データベースの作成、GraphQL データソースとしてインポートしてテストする方法を示します。

**まず、GraphQL API を使用してAmplifyプロジェクトを持っていない場合は、これらの簡単なコマンドを使用して作成します。**

```bash
増幅する init
増幅する api を追加
```

**AWS RDSコンソールに移動し、「データベースを作成」をクリックします。**

**データベース作成方法に「標準作成」を選択します**

![データベース作成](~/images/database-creation.png)

**エンジンオプションは以下のオプションを維持します。**

![エンジンオプション](~/images/database-engine-option.png)

**データベース機能で「Serverless」を選択します**

![データベース機能](~/images/database-features.png)

**設定で以下の情報を入力してください**

![データベース設定](~/images/database-setting.png)


**以下のように容量設定を選択してください**

![データベース容量](~/images/database-capacity.png)


**VPCセキュリティグループが設定されていない場合は、「追加の接続構成」を展開し、「データAPI」と「新規作成」を有効にします。**

![データベース接続](~/images/database-connectivity.png)


**"Additional Configuration" を展開し、MarketPlace として "Initial Database Name" を入力します**

![データベースの追加設定](~/images/database-additional-configuration.png)

**「データベースを作成」をクリックすると、クラスターを選択し、以前に設定された資格情報を入力するように求められるダイアログが開きます。**

![データベース接続 ](~/images/connect-to-database.png)


**接続後、データベースといくつかのテーブルを作成します。**


![データベースの詳細](~/images/query-editor.png)

```sql
USE MarketPlace;
CREATE TABLE Customers (
  id int(11) NOT NULL PRIMARY KEY,
  name varchar(50) NOT NULL,
  phone varchar(50) NOT NULL,
  email varchar(50) NOT NULL
);
CREATE TABLE Orders (
  id int(11) NOT NULL PRIMARY KEY,
  customerId int(11) NOT NULL,
  orderDate datetime DEFAULT CURRENT_TIMESTAMP,
  KEY `customerId` (`customerId`),
  CONSTRAINT `customer_orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`)
);
```


**コマンドラインに戻り、増幅プロジェクトのルートから `api add-graphql-datasource` を実行します。**


![GraphQLデータソースの追加](~/images/add-graphql-datasource.png)

**`増幅プッシュ`でプロジェクトをAWSにプッシュします。**

Run `amplify push` to push your project to AWS. You can then open the AppSync console with `amplify api console`, to try interacting with your RDS database via your GraphQL API.

**GraphQLからSQLデータベースとやりとりする**

サーバーレスのAmazon Aurora MySQLデータベースで動作するようにAPIが設定されました。 変更を実行して、 [AppSync コンソール](https://console.aws.amazon.com/appsync/home) から顧客を作成し、 [RDS コンソール](https://console.aws.amazon.com/rds/home) から問い合わせて二重確認してみてください。

顧客を作成:

```
mutation CreateCustomer {
  createCustomers(createCustomersInput: {
    id: 1,
    name: "Hello",
    phone: "111-222-3333",
    email: "customer1@mydomain.com"
  }) {
    id
    name
    phone
    email
  }
}
```

![GraphQL結果](~/images/graphql-results.png)

次に、RDS コンソールを開き、シンプルな select ステートメントを実行して、新しい顧客を確認します。

```sql
MarketPlaceを使用する;
SELECT * FROM Customers;
```

![SQLの結果](~/images/sql-results.png)

### これはどのように動作しますか?

The `add-graphql-datasource` will add a custom stack to your project that provides a basic set of functionality for working with an existing data source. You can find the new stack in the `stacks/` directory, a set of new resolvers in the `resolvers/` directory, and will also find a few additions to your `schema.graphql`. You may edit details in the custom stack and/or resolver files without worry. You may run `add-graphql-datasource` again to update your project with changes in the database but be careful as these will overwrite any existing templates in the `stacks/` or `resolvers/` directories. When using multiple environment with the Amplify CLI, you will be asked to configure the data source once per environment.

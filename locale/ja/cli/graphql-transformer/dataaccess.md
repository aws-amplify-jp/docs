---
title: データアクセスパターン
description: GraphQL、AWS Amplify、GraphQL Transform ライブラリを使用して、これらの 17 の一般的なデータベースアクセスパターンをサポートする方法を学びます。
---

In the [DynamoDB documentation for modeling relational data in a NoSQL database](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql.html), there is an in depth example of 17 access patterns from the [First Steps for Modeling Relational Data in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql.html) page.

|    | 私たちの組織で最も一般的な/インポートのアクセスパターン    |
| -- | ------------------------------- |
| 1  | 従業員IDで従業員情報を検索                  |
| 2  | 従業員名で従業員情報を問い合わせます              |
| 3  | 従業員の電話番号を検索                     |
| 4  | 顧客の電話番号を検索                      |
| 5  | 指定された日付範囲内で特定の顧客の注文を取得する        |
| 6  | 指定された日付範囲内のすべての注文をすべての顧客に表示     |
| 7  | 最近雇ったすべての従業員を見る                 |
| 8  | 特定の倉庫で働くすべての従業員を見つける            |
| 9  | 特定の商品をすべて注文する                   |
| 10 | すべての倉庫で特定の製品の現在の在庫を取得します        |
| 11 | アカウント担当者でお客様を取得                 |
| 12 | アカウント担当者と日付で注文する                |
| 13 | 特定の商品をすべて注文する                   |
| 14 | 与えられた役職名を持つすべての従業員を取得           |
| 15 | 商品と倉庫で在庫を取得する                   |
| 16 | 合計商品在庫数を取得する                    |
| 17 | 注文合計と販売期間でランク付けされたアカウント担当者を取得する |

この例では、GraphQL、AWS Amplify、GraphQL Transform ライブラリを使用して、これらのデータアクセスパターンをサポートする方法を学習します。 この例には以下のタイプがあります。

- 倉庫
- 商品
- 棚卸し
- 従業員数
- AccountRepresentative
- 顧客

[次のスキーマ](https://gist.github.com/dabit3/e0af16db09b6e206292d1c5cfc0d0a07) は、これらのアクセスパターンをサポートするために必要なキーと接続を導入します:


```graphql
type Order @model
  @key(name: "byCustomerByStatusByDate", fields: ["customerID", "status", "date"])
  @key(name: "byCustomerByDate", fields: ["customerID", "date"])
  @key(name: "byRepresentativebyDate", fields: ["accountRepresentativeID", "date"])
  @key(name: "byProduct", fields: ["productID", "id"])
{
  id: ID!
  customerID: ID!
  accountRepresentativeID: ID!
  productID: ID!
  status: String!
  amount: Int!
  date: String!
}

type Customer @model
  @key(name: "byRepresentative", fields: ["accountRepresentativeID", "id"]) {
  id: ID!
  name: String!
  phoneNumber: String
  accountRepresentativeID: ID!
  ordersByDate: [Order] @connection(keyName: "byCustomerByDate", fields: ["id"])
  ordersByStatusDate: [Order] @connection(keyName: "byCustomerByStatusByDate", fields: ["id"])
}

type Employee @model
  @key(name: "newHire", fields: ["newHire", "id"], queryField: "employeesNewHire")
  @key(name: "newHireByStartDate", fields: ["newHire", "startDate"], queryField: "employeesNewHireByStartDate")
  @key(name: "byName", fields: ["name", "id"], queryField: "employeeByName")
  @key(name: "byTitle", fields: ["jobTitle", "id"], queryField: "employeesByJobTitle")
  @key(name: "byWarehouse", fields: ["warehouseID", "id"]) {
  id: ID!
  name: String!
  startDate: String!
  phoneNumber: String!
  warehouseID: ID!
  jobTitle: String!
  newHire: String! # We have to use String type, because Boolean types cannot be sort keys
}

type Warehouse @model {
  id: ID!
  employees: [Employee] @connection(keyName: "byWarehouse", fields: ["id"])
}

type AccountRepresentative @model
  @key(name: "bySalesPeriodByOrderTotal", fields: ["salesPeriod", "orderTotal"], queryField: "repsByPeriodAndTotal") {
  id: ID!
  customers: [Customer] @connection(keyName: "byRepresentative", fields: ["id"])
  orders: [Order] @connection(keyName: "byRepresentativebyDate", fields: ["id"])
  orderTotal: Int
  salesPeriod: String
}

type Inventory @model
  @key(name: "byWarehouseID", fields: ["warehouseID"], queryField: "itemsByWarehouseID")
  @key(fields: ["productID", "warehouseID"]) {
  productID: ID!
  warehouseID: ID!
  inventoryAmount: Int!
}

type Product @model {
  id: ID!
  name: String!
  orders: [Order] @connection(keyName: "byProduct", fields: ["id"])
  inventories: [Inventory] @connection(fields: ["id"])
}
```

スキーマが作成されたので、対して動作するデータベース内のアイテムを作成しましょう:

```graphql
# first
mutation createWarehouse {
  createWarehouse(input: {id: "1"}) {
    id
  }
}

# second
mutation createEmployee {
  createEmployee(input: {
    id: "amanda"
    name: "Amanda",
    startDate: "2018-05-22",
    phoneNumber: "6015555555",
    warehouseID: "1",
    jobTitle: "Manager",
    newHire: "true"}
  ) {
    id
    jobTitle
    name
    newHire
    phoneNumber
    startDate
    warehouseID
  }
}

# third
mutation createAccountRepresentative {
  createAccountRepresentative(input: {
    id: "dabit"
    orderTotal: 400000
    salesPeriod: "January 2019"
  }) {
    id
    orderTotal
    salesPeriod
  }
}

# fourth
mutation createCustomer {
  createCustomer(input: {
    id: "jennifer_thomas"
    accountRepresentativeID: "dabit"
    name: "Jennifer Thomas"
    phoneNumber: "+16015555555"
  }) {
    id
    name
    accountRepresentativeID
    phoneNumber
  }
}

# fifth
mutation createProduct {
  createProduct(input: {
    id: "yeezyboost"
    name: "Yeezy Boost"
  }) {
    id
    name
  }
}

# sixth
mutation createInventory {
  createInventory(input: {
    productID: "yeezyboost"
    warehouseID: "1"
    inventoryAmount: 300
  }) {
    productID
    inventoryAmount
    warehouseID
  }
}

# seventh
mutation createOrder {
  createOrder(input: {
    amount: 300
    date: "2018-07-12"
    status: "pending"
    accountRepresentativeID: "dabit"
    customerID: "jennifer_thomas"
    productID: "yeezyboost"
  }) {
    id
    customerID
    accountRepresentativeID
    amount
    date
    customerID
    productID
  }
}
```

## 1. 従業員IDで従業員の詳細を調べます。
これは、従業員IDを使用して従業員モデルをクエリするだけで行うことができます。 この作業を行うには、 `@key` または `@connection` が必要ありません。

```graphql
query getEmployee($id: ID!) {
  getEmployee(id: $id) {
    id
    name
    phoneNumber
    startDate
    jobTitle
  }
}
```

## 2. 従業員名で従業員の詳細を問い合わせます:
`@key` `byName` の `Employee` 型は、インデックスが作成され、クエリが name 項目と一致するため、このアクセスパターンを実現可能にします。 このクエリを使用できます:

```graphql
query employeeByName($name: String!) {
  employeeByName(name: $name) {
    items {
      id
      name
      phoneNumber
      startDate
      jobTitle
    }
  }
}
```

## 3. 従業員の電話番号を検索:
以前のいずれかのクエリは、IDまたは名前がある限り、従業員の電話番号を見つけるのに役立ちます。

## 4. お客様の電話番号を検索:
上記のクエリと似ていますが、Customerモデルでは顧客の電話番号が表示されます。

```graphql
query getCustomer($customerID: ID!) {
  getCustomer(id: $customerID) {
    phoneNumber
  }
}
```

## 5. 指定された日付範囲内で特定の顧客の注文を取得:
顧客のすべての注文を照会できる1対多のリレーションがあります。

このリレーションシップは、 `@key` 名 `byCustomerByDate` を、顧客モデルの注文欄の接続によって照会される注文モデルに設定することによって作成されます。

A sort key with the date is used. What this means is that the GraphQL resolver can use predicates like `Between` to efficiently search the date range rather than scanning all records in the database and then filtering them out.

クエリは、日付範囲内の顧客に注文を取得する必要があります：

```graphql
query getCustomerWithOrdersByDate($customerID: ID!) {
  getCustomer(id: $customerID) {
    ordersByDate(date: {
      between: [ "2018-01-22", "2020-10-11" ]
    }) {
      items {
        id
        amount
        productID
      }
    }
  }
}
```

## 6. 指定された日付範囲内にすべてのオープン注文をすべての顧客に表示:
`@key` `byCustomerByStatusByDate` を使用すると、このアクセス パターンで動作するクエリを実行できます。

In this example, a composite sort key (combination of two or more keys) with the `status` and `date` is used. What this means is that the unique identifier of a record in the database is created by concatenating these two fields (status and date) together, and then the GraphQL resolver can use predicates like `Between` or `Contains` to efficiently search the unique identifier for matches rather than scanning all records in the database and then filtering them out.

```graphql
query getCustomerWithOrdersByStatusDate($customerID: ID!) {
  getCustomer(id: $customerID) {
    ordersByStatusDate (statusDate: {
      between: [
        { status: "pending" date:  "2018-01-22" },
        { status: "pending", date: "2020-10-11"}
      ]}) {
        items {
            id
            amount
            date
        }
    }
  }
}
```

## 7. すべての従業員が最近雇われたのを参照してください:
Having `@key(name: "newHire", fields: ["newHire", "id"])` on the `Employee` model allows one to query by whether an employee has been hired recently.

```graphql
query employeeNewHire {
  employeeNewHire(newHire: "true") {
    items {
      id
      name
      phoneNumber
      startDate
      jobTitle
    }
  }
}
```

`employeeNewHireByStartDate` クエリを使用することで、開始日までに結果をクエリして返すこともできます。

```graphql
query employeeNewHireByDate {
  employeeNewHireByDate(newHire: "true") {
    items {
      id
      name
      phoneNumber
      startDate
      jobTitle
    }
  }
}
```

## 8. 指定された倉庫で働くすべての従業員を見つけます:
This needs a one to many relationship from warehouses to employees. As can be seen from the @connection in the `Warehouse` model, this connection uses the `byWarehouse` key on the `Employee` model. The relevant query would look like this:

```graphql
query getWarehouse($warehouseID: ID!) {
  getWarehouse(id: $warehouseID) {
    id
    employees{
      items {
        id
        name
        startDate
        phoneNumber
        jobTitle
      }
    }
  }
}
```

## 9. すべての商品を注文する:
このアクセスパターンは、商品から注文までの1対多のリレーションを使用します。このクエリを使用すると、特定の商品のすべての注文を取得できます:

```graphql
query getProductOrders($productID: ID!) {
  getProduct(id: $productID) {
    id
    orders {
      items {
        id
        status
        amount
        date
      }
    }
  }
}
```

## 10. すべての倉庫で製品の現在の在庫を取得します:

すべての倉庫で製品の在庫を取得するために必要なクエリは次のとおりです。

```graphql
query getProductInventoryInfo($productID: ID!) {
  getProduct(id: $productID) {
    id
    inventories {
      items {
        warehouseID
        inventoryAmount
      }
    }
  }
}
```

## 11. アカウント担当者による顧客獲得:
これにより、アカウント担当者と顧客間の1対多の接続が使用されます。

必要なクエリは次のようになります:

```graphql
query getCustomersForAccountRepresentative($representativeId: ID!) {
  getAccountRepresentative(id: $representativeId) {
    customers {
      items {
        id
        name
        phoneNumber
      }
    }
  }
}
```

## 12. アカウント担当者と日付で注文を取得:


AccountRepresentative モデルで見られるように、この接続は、 `注文` モデルの `byRepresentativeDate` 欄を使用して必要な接続を作成します。 必要なクエリは次のようになります:

```graphql
query getOrdersForAccountRepresentative($representativeId: ID!) {
  getAccountRepresentative(id: $representativeId) {
    id
    orders(date: {
      between: [
         "2010-01-22", "2020-10-11"
      ]
    }) {
        items {
          id
          status
          amount
          date
        }
    }
  }
}
```

## 13.すべての商品を特定の商品で注文する：
これは9番と同じです。

## 14. すべての従業員に与えられた役職名を割り当てます:
`byTitle` `@key` を使用すると、このアクセスパターンは非常に簡単になります。

```graphql
query employeeByJobTitle{
  employeeByJobTitle(jobTitle: "Manager") {
    items {
      id
      name
      phoneNumber
      jobTitle
    }
  }
}
```

## 15. 倉庫別に在庫を手に入れる:
このモデルは、独自のパーティションキーとソートキーを持つことができるため、インベントリを別のモデルで保持することは特に有用であり、このアクセスパターンに必要とされるようにインベントリ自身を照会することができます。

このモデルのクエリは次のようになります。

```graphql
query inventoryByProductAndWarehouse($productID: ID!, $warehouseID: ID!) {
  getInventory(productID: $productID, warehouseID: $warehouseID) {
    productID
    warehouseID
    inventoryAmount
  }
}

```

`byWarehouseID` キーによって作成された `itemsByWarehouseID` クエリを使用して、個々の倉庫からすべてのインベントリを取得することもできます。

```graphql
query byWarehouseId($warehouseID: ID!) {
  itemsByWarehouseID(warehouseID: $warehouseID) {
    items {
      inventoryAmount
      productID
    }
  }
}
```

## 16.商品の総在庫数を取得:
これがどのように行われるかは、使用事例によって異なります。 すべての倉庫内のすべての在庫リストを欲しい場合は、在庫モデルで在庫リストを実行するだけです。

```graphql
query listInventorys {
  listInventorys {
    items {
      productID
      warehouseID
      inventoryAmount
    }
  }
}
```

## 17. 注文総額と販売期間でランク付けされた営業担当者を取得します:
The sales period is either a date range or maybe even a month or week. Therefore we can set the sales period as a string and query using the combination of `salesPeriod` and `orderTotal`. We can also set the `sortDirection` in order to get the return values from largest to smallest:

```graphql
query repsByPeriodAndTotal {
  repsByPeriodAndTotal(
    sortDirection: DESC,
    salesPeriod: "January 2019",
    orderTotal: {
      ge: 1000
    }) {
    items {
      id
      orderTotal
    }
  }
}
```

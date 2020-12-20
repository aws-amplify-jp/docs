---
title: 関連
description: 管理者 UI で始めましょう
---

<amplify-callout warning>

データモデル [の例](~/console/data/data-model.md#data-modeling-example) をクローンしてフォローする

</amplify-callout>

## 1対1の関係のモデルデータ

 このシナリオでは、書店はそれが販売する本を追跡するためにISBN番号のリストを維持しています。 各本にはISBN番号が1つしかなく、ISBN番号が1つの書籍に割り当てられています。 これは、ISBN番号と書籍の1対1(1:1)のデータ関係の例です。 以下の手順を使用して、 *Book* と *ISBN* のデータ型と、Admin UI での関連性をモデル化します。

1. In the cloned schema, define the one to one data relationship between `ISBN` and `Book`, as each book has a single ISBN number and each ISBN number is associated with a single book. On the ISBN type, choose **Add a relationship**.
1. In the **Add relationship** window, in the **Select related model** menu, choose `Book`. For the relationship type, choose **One ISBN to one Book**. For **Relationship name**, enter `Book`. Choose **Save**. The relationship should look like the following.

![GSA](~/images/console/3_createOnetooneRelationship.png)

When you return to the **Data modeling** page, the `ISBN` model will be updated with the relationship information. Now repeat the same steps for the `Book` model - define a 1:1 relationship from Book to ISBN.

## 1対多の関係のモデルデータ

今、出版社のためのデータモデルを作成しましょう. 本屋の各本は、1つの出版社を持っています. しかしながら, 各出版社は、多くの本を公開することができます. これは、私たちの例でモデル化できる出版者と本の間の1対多の関係(1:n)を表しています。

1. 複製されたスキーマで、 `Publisher` モデルを選択します。
1. `Publisher` モデルの場合、 **Add a relation** を選択します。
1. In the **Add relationship** window, in the **Select related model** menu, choose `Book`. For the relationship type, choose **One Publisher to many Book**. For **Relationship name**, enter `books`. Choose **Save**. The relationship should look like the following.

![GSA](~/images/console/5_onetomanyCardinality.png)

## 多対多の関係のモデルデータ

著者のための最終的なデータモデルを私たちの例に追加しましょう。本は一人の著者または複数の著者を持つことができます。 したがって、本屋の本は多くの著者によって書かれることができ、各著者は多くの本を書くことができます。 これは、本と著者の間の多くから多くのデータ関係(m:n)であり、この例ではモデル化できます。

1. 複製されたスキーマで、 `Author` モデルを選択します。
4. `著者` モデルの場合は、 **関係の追加** を選択します。
5. In the **Add relationship** window, choose `Book` from the **Select related model** menu. For the relationship type, choose **Many Author to many Book**. For **Relationship name**, enter a meaningful name, such as `Book`. Choose **Save**. The relationship should look like the following.

![GSA](~/images/console/6_manytomanyCardinality.png)


## テストデータモデルは期待通りに動作します

データのモデリングとデータリレーションシップの定義が終わったら、Amplifyバックエンド環境にモデルを保存してデプロイできます。

1. **データモデリング** ページの右上隅にある **デプロイ** を選択します。

2. If you are working in the sandbox, on the **Deploy to AWS** page, either choose **Create an AWS account** or **Login to deploy AWS Account** and proceed with the deployment process.

3. AWS アカウントのAdmin UIで作業している場合は、ページの右上隅にデプロイメント状況が表示されます。

4. Navigate to the **Content** tab and create data in the tables. You should be able to create and link records from different models. For more information, see [Manage content](~/console/data/content-management.md).

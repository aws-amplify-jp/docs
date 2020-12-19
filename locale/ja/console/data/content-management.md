---
title: コンテンツ管理
description: 管理者 UI で始めましょう
---

<amplify-callout warning>

コンテンツ管理エクスペリエンスは現在プレビュー中です。データの保存や更新中に問題が発生する可能性があります。

</amplify-callout>

Admin UI **Content** 管理ビューは、アプリケーションのバックエンドデータの表形式ビューを提供します。 この機能を使用して、モデルをテストしたり、テクニカルチームメンバーと非テクニカルチームメンバーの両方に、管理者ビューを構築する代わりにアプリケーションのデータをリアルタイムで作成および更新する機能を提供することができます。

![cms](~/images/console/cms.png)

The [Data modeling](~/console/data/data-model.md) topic guides you through several examples for creating data models and setting the relationships between them. The following content management procedures, reference the *Book* and *Author* tables that were created in the data modeling example in order to demonstrate how to perform operations on your data.

## データを作成するには
1. アプリのAdmin UIを開きます。
2. **管理** メニューで **コンテンツ** を選択します。
3. On the **Content** page, select the table to update from the **Select table** menu. For this example, select the *Author* table.
4. **作成者** を選択します。
5. In the **Add Author** window, specify your custom values for the fields in the table. For this example, enter *Martha* for the *firstName* field and enter *Riviera* for the *lastName* field.
6. **著者保存** を選択します。

## データを編集する
1. アプリのAdmin UIを開きます。
2. **管理** メニューで **コンテンツ** を選択します。
3. On the **Content** page, select the table to update from the **Select table** menu. For this example, select the *Author* table that we used in the previous procedure.
4. レコードのリストから更新するレコードを選択します。この例では、 *Martha Riviera*を選択します。 作者の姓のスペルが間違っており、修正する必要があると仮定します。
5. **アクション** メニューで、 **** を編集を選択します。
6. In the **Edit Author** window, change the spelling of the author's last name. Enter *Rivera* in the *lastName* field, then choose **Save author**.

## データを作成してリンクするには
テーブルに新しいインスタンスを作成する場合 データモデル間の関係に基づいて別のテーブルのインスタンスにリンクすることもできます。

1. アプリのAdmin UIを開きます。
2. **管理** メニューで **コンテンツ** を選択します。
3. On the **Content** page, select the table to update from the **Select table** menu. For this example, select the *Book* table, to add a new instance of a book.
4. **Create book**. For *title*, enter *All About Dogs*.
5. Let's link this book to the *Martha Rivera* author instance that we edited in the previous procedure. Choose **Link to an existing Author**, then choose *Martha Rivera* from the list of *Author* instances. Note that you have the option to link to an an author because a relationship was defined between the *Book* and *Author* tables during the data modeling process.
6. View the details for the *All About Dogs* instance in the *Book* table, and *Martha Rivera* is listed as an author.

## データを削除する
1. アプリのAdmin UIを開きます。
2. **管理** メニューで **コンテンツ** を選択します。
3. On the **Content** page, select the table to update from the **Select table** menu. For this example, select the *Author* table that we used in the previous procedure.
4. From the list of records in the table, select the record to delete. For this example, select *Martha Rivera*. On the **Actions** menu, then choose **Delete**.
5. **Delete item** 確認ウィンドウで、 **Delete** を選択します。

## マークダウンでデータを作成または編集
また、マークダウンエディタでデータを編集およびマークダウンとして保存することもできます。 これは特に、ブログ、ニュース、マーケティング、コンテンツ重視のアプリで、アプリのUIを適切にスタイル付けしたい場合に便利です。 マークダウンエディタは、データ インスタンスの **** **編集** ウィンドウにいるときにマークダウンの format@@4 を選択することで使用できます。

![cms](~/images/console/cms.png)
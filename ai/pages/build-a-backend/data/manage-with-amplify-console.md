---
title: "Amplify コンソールでデータを管理"
section: "build-a-backend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-08-06T19:20:15.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/manage-with-amplify-console/"
---

Amplify コンソールの **Data manager** ページは、アプリケーションのバックエンド GraphQL API データを管理するためのユーザーフレンドリーなインターフェースを提供します。アプリケーションデータのリアルタイムな作成と更新を可能にし、別のアドミンビューを構築する必要がなくなります。

まだ **data** リソースを作成していない場合は、[データセットアップガイド](/[platform]/build-a-backend/data/set-up-data/)をご覧ください。

## Data manager にアクセス

データリソースをデプロイした後、Amplify コンソール上でマネージャーにアクセスできます。

1. [Amplify コンソール](https://console.aws.amazon.com/amplify/home)にログインし、アプリを選択します。
2. アクセスするブランチを選択します。
3. 左のナビゲーションバーから **Data** を選択します。
4. その後、**Data manager** を選択します。

### レコードを作成するには

1. **Data manager** ページで、**Select table** ドロップダウンからテーブルを選択します。この例では、*Todo* テーブルを使用しています。
2. **Create Todo** を選択します。
3. **Add Todo** ペインで、テーブル内のフィールドにカスタム値を指定します。例えば、*Content* フィールドに *my first todo* と入力し、*Is done* フィールドをトグルします。
4. **Submit** を選択します。

### レコードを更新するには

1. **Data manager** ページで、**Select table** ドロップダウンからテーブルを選択します。
2. レコードのリストから、更新するレコードを選択します。
3. **Edit Todo** ペインで、レコードに変更を加えて、**Submit** を選択します。

### レコードを削除するには

1. **Data manager** ページで、**Select table** ドロップダウンからテーブルを選択します。
2. レコードのリストから、削除するレコードの左側のチェックボックスを選択します。
3. **Actions** ドロップダウンを選択して、**delete item(s)** を選択します。

### レコードをシードするには

1. **Data manager** ページで、**Select table** ドロップダウンからテーブルを選択します。
2. **Actions** ドロップダウンを選択して、**Auto-generate data** を選択します。
3. **Auto-generate data** ペインで、生成するデータの行数と生成されるデータの制約を指定します。
4. その後、**Generate data** を選択します

一度に最大 100 レコードを生成できます。

> **Warning:** 以下のフィールド型を持つテーブルではシードデータを生成できません: AWSPhone、Enum、Custom Type、または Relationship

### レコードをダウンロードするには

1. **Data manager** ページで、**Select table** ドロップダウンからテーブルを選択します。
2. **Actions** ドロップダウンを選択します。
3. ここには、データをダウンロードするための 2 つのオプションがあります。
    - **Download selected items (.csv)** を選択して、選択した行のデータのみをダウンロードします。
    - **Download all items (.csv)** を選択して、現在選択されているテーブルのすべての行レコードをダウンロードします。
4. ダウンロードオプションを選択すると、データが CSV ファイルとしてすぐにダウンロードを開始します。

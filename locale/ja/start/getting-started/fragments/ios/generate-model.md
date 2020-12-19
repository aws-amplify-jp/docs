With the basic setup complete, next you will model the data your application will store. Amplify DataStore will use this model to persist data to your local device that will be synchronized to a backend API without writing any additional code. These models are specified as [GraphQL](http://graphql.org/) schemas. If you'd like, first [learn more](~/cli/graphql-transformer/overview.md) about GraphQL schemas and data modeling.

1. In Xcode, make sure the project navigator is displayed. You can use **Cmd+1** to switch to this view. **Open the schema file** located at **Todo** > **AmplifyConfig** > **schema.graphql**. In your project folder, this file is located at `"amplify/backend/api/amplifyDatasource/schema.graphql"`.

    ファイルの内容を以下のスキーマに置き換えます:

    ```graphql
    enum Priority {
      LOW
      NORMAL
      HIGH
    }

    type Todo @model {
      id: ID!
      name: String!
      priority: Priority
      description: String
    }
    ```

    このスキーマは、4つのプロパティを持つ `Todo` という名前のモデルを作成します。

    - **ID** Todo アイテムの自動生成識別子フィールド
    - **名前** Todoアイテムのタイトルである任意でない文字列フィールド
    - **priority** an optional enumeration type field that indicates the importance of a Todo item; the value of priority can be only *LOW*, *NORMAL*, or *HIGH*
    - **説明** Todo アイテムの詳細情報を保持する任意の文字列フィールド。

1. 次に、これらのモデルのクラスを生成し、Xcode プロジェクトに追加します。 **コマンド** を実行します。
  ```bash
  コードジェネレーションモデルを増幅 && 増幅アプリ
  ```

1. 生成されたモデルがプロジェクトに追加されました。 新しく生成されたファイルをコンパイルするには、 **build (`Cmd+b`)** する必要があります。

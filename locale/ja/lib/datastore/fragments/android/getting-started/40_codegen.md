If you have chosen you use the `amplify-tools-gradle-plugin` Gradle plugin, we will now use it to generate the models from the schema defined in `schema.graphql` and automatically add the new files to the project. If you have chosen to use the Amplify CLI instead, please skip this section, and follow the [Code generation: Amplify CLI](#code-generation-amplify-cli) section.

1. **実行/設定メニューでモデル生成を選択します**
2. **緑色の矢印**をクリックして、modelgenのタスクを実行します。 タスクを実行すると、Amplifyツールスクリプトが呼び出され、モデルファイルが生成され、自動的にプロジェクトに追加されます。

タスクが完了すると、 `app/src/main/java/com/anplifyframework/datastore/generated/model`に新しいディレクトリを追加する必要があります。以下のファイルを含める必要があります。

  - `AmplifyModelProvider.java`
  - `Todo.java`

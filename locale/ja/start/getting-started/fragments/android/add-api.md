DataStoreがローカルでデータを永続化するようになったので、次のステップでクラウドに接続します。 いくつかのコマンドを使用すると、AWS AppSync APIを作成し、DataStoreにデータを同期させるように設定します。

1. Amplifyを設定してクラウドリソースを管理します。このステップでは、Amplifyのアカウントに新しいAWSユーザーを設定します。 端末ウィンドウを開きます。Android Studio で外部端末または統合端末を使用できます。端末では、次を実行します。

    ```bash
    増幅の設定
    ```

   このコマンドはAWS管理コンソールへのWebブラウザを開き、新しいIAMユーザーの作成をガイドします。 これを設定するには、 [CLI インストールガイド](~/cli/start/install.md) を参照してください。

1. 次に、新しいAPIをAWSにプッシュします。Android Studioで、ツールバーのGradle Taskドロップダウンをクリックし、 **anplifyPush**を選択します。

  ![](~/images/lib/getting-started/android/set-up-android-studio-run-task-dropdown-amplifyPush.png)

1. タスクを実行します。これを行うには、 **再生ボタン** を押すか、 **Control-R** を押します。

1. API経由でDataStoreがバックエンドと同期できるように、初期化コードを変更します。 `MainActivity`を開き、 `onCreate`に追加したすべてのコードを削除します。以下に置き換えてください:

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
  try {
      Amplify.addPlugin(new AWSApiPlugin());
      Amplify.addPlugin(new AWSDataStorePlugin());
      Amplify.configure(getApplicationContext());

      Log.i("Tutorial", "Initialized Amplify");
  } catch (AmplifyException failure) {
      Log.e("Tutorial", "Could not initialize Amplify", failure);
  }

  Amplify.DataStore.observe(Todo.class,
          started -> Log.i("Tutorial", "Observation began."),
          change -> Log.i("Tutorial", change.item().toString()),
          failure -> Log.e("Tutorial", "Observation failed.", failure),
          () -> Log.i("Tutorial", "Observation complete.")
  );
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  try {
      Amplify.addPlugin(AWSApiPlugin())
      Amplify.addPlugin(AWSDataStorePlugin())
      Amplify.configure(applicationContext)
      Log.i("Tutorial", "Initialized Amplify")
  } catch (failure: AmplifyException) {
      Log.e("Tutorial", "Could not initialize Amplify", failure)
  }

  Amplify.DataStore.observe(Todo::class.java,
          { Log.i("Tutorial", "Observation began.") },
          { Log.i("Tutorial", it.item().toString()) },
          { Log.e("Tutorial", "Observation failed.", it) },
          { Log.i("Tutorial", "Observation complete.") }
  )
  ```

  </amplify-block> </amplify-block-switcher>

1. In the Gradle Task dropdown menu in the toolbar, select **app** and run the application. This will synchronize the existing local Todo items to the cloud. `DataStore.observe` will log a message when new items are synchronized locally.

1. 端末ウィンドウを開きます。Android Studio で外部端末または統合端末を使用できます。端末では、次を実行します。

   ```bash
   コンソールの api を増幅する
   ```

   ```console
   ?以下のサービスから選択してください: (矢印キーを使用)
      `GraphQL`
   ```

1. AWS Appsync サービスが AWS 管理コンソールで開きます。 **クエリ** ウィンドウで、左ペインに次のクエリを貼り付けます。

    ```graphql
    query GetTodos {
        listTodos {
            items {
                id
                name
                priority
                description
            }
        }
}
    ```

1. **再生ボタン** を押してクエリを実行します。これにより、右側のペインに同期されたすべてのTodosが返されます。

    ![](~/images/lib/getting-started/android/set-up-appsync-query.png)

1. 同期は双方向に発生します。以下の変更をコピーして貼り付けることで、AWS AppSync に項目を作成します。

    ```graphql
    mutation CreateTodo {
        createTodo(
            input: {
                name: "Tidy up the office"
                description: "Organize books, vacuum, take out the trash"
                priority: NORMAL
            }
        ) {
            id
            name
            description
            priority
            _version
            _lastChangedAt
        }
    }
```

    ![](~/images/lib/getting-started/android/set-up-appsync-create.png)

1. 実行中のアプリケーションのログで、 **チュートリアル**をフィルタリングします。ローカルストレージと同期する項目が表示されます:

    ```console
    com.example.todo I/Tutorial: Todo {id=b9fa0d33-873e-46f3-baa3-3148f6f47d44, name=Tidy up the office, priority=NORMAL, description=Organize books, vacuum, take out the trash}
    ```

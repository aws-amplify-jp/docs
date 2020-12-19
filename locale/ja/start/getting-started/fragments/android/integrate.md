次に、生成されたモデルを使用してデータを読み書きします。このセクションでは、DataStore を初期化し、Todo アイテムを作成してクエリします。

## AmplifyとDataStoreの設定

最初にDataStoreプラグインを追加し、アプリケーションクラスを作成し、 `onCreate()` メソッドをオーバーライドしてAmplifyを設定します。

1. Navigate to **Todo** > **app** > **src** > **main** > **java/kotlin** > **com** > **example.todo**

1. **MainActivity** を開く

1. Amplifyを初期化するには、 `onCreate` に次のコードを追加してください。

  <amplify-block-switcher> <amplify-block name="Java">

    ```java
    try {
        Amplify.addPlugin(new AWSDataStorePlugin());
        Amplify.configure(getApplicationContext());

        Log.i("Tutorial", "Initialized Amplify");
    } catch (AmplifyException e) {
        Log.e("Tutorial", "Could not initialize Amplify", e);
    }
    ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  try {
      Amplify.addPlugin(AWSDataStorePlugin())
      Amplify.configure(applicationContext)
      Log.i("Tutorial", "Initialized Amplify")
  } catch (failure: AmplifyException) {
      Log.e("Tutorial", "Could not initialize Amplify", failure)
}
  ```

  </amplify-block> </amplify-block-switcher>

1. ツールバーの **アプリ**を選択し、アプリケーションを実行します。 logcat には、成功を示すログ行が表示されます。

    ```console
    com.example.todo I/Tutorial: Initialized Ampliify
    ```

    To make this easier to find, select the **Verbose** logging level, and enter the string **Tutorial** into the search field (denoted by the magnifying glass icon):

    ![](~/images/lib/getting-started/android/set-up-android-studio-logcat-setup.gif)

## Todoを作成

次に、Todo を作成して DataStore に保存します。

1. `MainActivity` を開き、 `onCreate()` メソッドの一番下に次のコードを追加します。

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
  Todo item = Todo.builder()
          .name("Build Android application")
          .description("Build an Android application using Amplify")
          .build();
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  val item: Todo = Todo.builder()
        .name("Build Android application")
        .description("Build an Android application using Amplify")
        .build()
  ```

  </amplify-block> </amplify-block-switcher>

  このコードは、2 つのプロパティを持つ Todo アイテムを作成します。名前と説明です。これは、DataStore にまだ保存されていないプレーンオブジェクトです。

1. その下にコードを追加して、項目を DataStore に保存します。

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
    Amplify.DataStore.save(
            item,
            success -> Log.i("Tutorial", "Saved item: " + success.item().getName()),
            error -> Log.e("Tutorial", "Could not save item to DataStore", error)
    );
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  Amplify.DataStore.save(
          item,
          { success -> Log.i("Tutorial", "Saved item: " + success.item().name) },
          { error -> Log.e("Tutorial", "Could not save item to DataStore", error) }
  )
  ```

  </amplify-block> </amplify-block-switcher>

1. アプリケーションを実行します。logcat では、項目が正常に保存されたことを示すものが表示されます。

  ```console
  com.example.todo I/Tutorial: Initialized Amplify
  com.example.todo I/Tutorial: Saved item: Build application
  ```

1. 追加の項目を保存するには、項目を新しいTodoに置き換えてください。名前と説明を変更し、優先順位を追加してください:

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
  Todo item = Todo.builder()
          .name("Finish quaretly taxes")
          .priority(Priority.HIGH)
          .description("Taxes are due for the quaretic next week")
          .build();
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  val item = Todo.builder()
        .name("Finish quaretly taxes")
        .priority(Priority.HIGH)
        .description("Taxes are due for the quaretic next week")
        .build()
  ```

  </amplify-block> </amplify-block-switcher>

1. アプリケーションを実行します。logcat では、項目が正常に保存されたことを示すものが表示されます。

  ```console
  com.example.todo I/Tutorial: Initialized Amplify
  com.example.todo I/Tutorial: Saved item: Finish 四半期税
  ```

## Query Todos

DataStoreにデータがあるので、クエリを実行してレコードを取得できます。

1. Edit your `onCreate` method to remove the item creation and save. Your `onCreate()` should only include the code required to initialize Amplify and not calls to `Todo.builder()` or `Amplify.DataStore.save()`.

1. 初期化コードの下に、以下を追加します。

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
  Amplify.DataStore.query(
          Todo.class,
          todos -> {
              while (todos.hasNext()) {
                  Todo todo = todos.next();

                  Log.i("Tutorial", "==== Todo ====");
                  Log.i("Tutorial", "Name: " + todo.getName());

                  if (todo.getPriority() != null) {
                      Log.i("Tutorial", "Priority: " + todo.getPriority().toString());
                  }

                  if (todo.getDescription() != null) {
                      Log.i("Tutorial", "Description: " + todo.getDescription());
                  }
              }
          },
          failure -> Log.e("Tutorial", "Could not query DataStore", failure)
  );
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

  ```kotlin
  Amplify.DataStore.query(
        Todo::class.java,
        { todos ->
            while (todos.hasNext()) {
                val todo = todos.next()
                val name = todo.name;
                val priority: Priority? = todo.priority
                val description: String? = todo.description

                Log.i("Tutorial", "==== Todo ====")
                Log.i("Tutorial", "Name: $name")

                if (priority != null) {
                    Log.i("Tutorial", "Priority: $priority")
                }

                if (description != null) {
                    Log.i("Tutorial", "Description: $description")
                }
            }
        },
        { failure -> Log.e("Tutorial", "Could not query DataStore", failure) }
  )
  ```

  </amplify-block> </amplify-block-switcher>

1. アプリケーションを実行します。logcatでは、返された両方のアイテムが表示されます。

  ```console
  com.example.todo I/Tutorial: Initialized Amplify
  com.example.todo I/Tutorial: ==== Todo ====
  com.example.todo I/Tutorial: Name: Build application
  com.example.todo I/Tutorial: Description: Build an Android Application using Amplify
  com.example.todo I/Tutorial: ==== Todo ====
  com.example.todo I/Tutorial: Name: Finish quarterly taxes
  com.example.todo I/Tutorial: Description: Taxes are due for the quarter next week
  com.example.todo I/Tutorial: Priority: HIGH
  ```

1. クエリには、述語フィルタを含めることもできます。これらは特定の条件に一致する特定のオブジェクトをクエリします。

  次の述語がサポートされています:

  **文字列**

  `eq` `ne` `le` `lt` `ge` `gt` `contains` `notContains` `beginsWith` `between`

  **数値**

  `eq` `ne` `le` `lt` `ge` `gt` `between`

  **リスト**

  `には` `が含まれており、` は含まれていません

  述語を使用するには、クエリに追加の引数を渡します。例えば、すべての優先度の高い項目に対する次のコードクエリです。

  <amplify-block-switcher> <amplify-block name="Java">

  ```java
  Amplify.DataStore.query(
          Todo.class,
          Where.matches(
              Todo.PRIORITY.eq(Priority.HIGH)
          ),
          todos -> {
              while (todos.hasNext()) {
                  Todo todo = todos.next();

                  Log.i("Tutorial", "==== Todo ====");
                  Log.i("Tutorial", "Name: " + todo.getName());

                  if (todo.getPriority() != null) {
                      Log.i("Tutorial", "Priority: " + todo.getPriority().toString());
                  }

                  if (todo.getDescription() != null) {
                      Log.i("Tutorial", "Description: " + todo.getDescription());
                  }
              }
          },
          failure -> Log.e("Tutorial", "Could not query DataStore", failure)
  );
  ```

  </amplify-block>

  <amplify-block name="Kotlin">

    ```kotlin
    Amplify.DataStore.query(
        Todo::class.java,
        Where.matches(
            Todo.PRIORITY.eq(Priority.HIGH)
        ),
        { todos ->
            while (todos.hasNext()) {
                val todo = todos.next()
                val name = todo.name;
                val priority: Priority? = todo.priority
                val description: String? = todo.description

                Log.i("Tutorial", "==== Todo ====")
                Log.i("Tutorial", "Name: $name")

                if (priority != null) {
                    Log.i("Tutorial", "Priority: $priority")
                }

                if (description != null) {
                    Log.i("Tutorial", "Description: $description")
                }
            }
        },
        { failure -> Log.e("Tutorial", "Could not query DataStore", failure) }
    )
    ```

  </amplify-block> </amplify-block-switcher>

  上記のコードでは、述語パラメータを 2 番目の引数に追加することに注意してください。

1. アプリケーションを実行します。logcatでは、返される優先度の高い項目だけが表示されます。

  ```console
  com.example.todo I/Tutorial: Initialized Amplify
  com.example.todo I/Tutorial: ==== Todo ====
  com.example.todo I/Tutorial: Name: Finish quarterly taxes
  com.example.todo I/Tutorial: Description: Taxes are due for the quarter next week
  com.example.todo I/Tutorial: Priority: HIGH
  ```

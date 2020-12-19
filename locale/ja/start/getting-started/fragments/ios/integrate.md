次に生成されたモデルを使用して、データの作成、更新、クエリ、および削除を行います。このセクションでは、DataStore を初期化し、Todo アイテムを操作します。

## AmplifyとDataStoreの設定

まず、DataStoreプラグインを追加し、Amplifyを設定します。

1. Open the main file of the application - `AppDelegate.swift` or `TodoApp.swift` depending on the Life Cycle previously chosen - and **add the following** import statements at the top of the file:
  ```swift
  import Amplify
  import AmplifyPlugins
  ```

1. 同じファイルで、 **Amplify を設定するための関数** を作成します。
  ```swift
  func configureAmplify() {
      let dataStorePlugin = AWSDataStorePlugin(modelRegistration: AmplifyModels())
      do {
          try Amplify.add(plugin: dataStorePlugin)
          try Amplify.configure()
          print("Initialized Amplify");
      } catch {
          // simplified error handling for the tutorial
          print("Could not initialize Amplify: \(error)")
      }
  }
  ```

1. **では、アプリケーションの開始点で `configureAmplify()` 関数** を呼び出します。 <amplify-block-switcher> <amplify-block name="SwiftUI App">

    ```swift
    @main
    struct TodoApp: App {
        // デフォルトの初期化子を追加し、Amplify
        public init() {
            configureAmplify()
        }
}
    ```

    </amplify-block> <amplify-block name="UIKit App Delegate">

    ```swift
    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {
        func application(_: UIApplication,
                         didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?
        ) -> Bool {
            configureAmplify()
            return true
        }
        // ...
    }
    ```

    </amplify-block> </amplify-block-switcher>

1. **** アプリケーションをビルドして実行します。Xcode コンソールウィンドウで、成功を示すログ行が表示されます。

    ```console
    Amplifyを初期化しました
    ```

    Optionally, if you'd like to adjust the log level, you can do this by updating the `Amplify.Logging.logLevel` variable. For example, you can add the following line of code to the `configureAmplify()` function:
    ```swift
    Amplify.Logging.logLevel = .info
    ```

    ログレベルを `.info`に設定すると、アプリケーションを再構築して再実行すると、追加のログステートメントがレンダリングされます。
    ```console
    [Amplify] 設定
    Amplify
    [AWSDataStorePlugin] syncEngineに適したAPIプラグインが見つかりません。syncEngineは起動しません。
    ```

## Todoを作成

次に、Todo を作成して DataStore に保存します。

1. `ContentView.swift` を開き、 **ファイルの先頭に次の** import 文を追加します:
  ```swift
  import Amplify
  import AmplifyPlugins
  ```

1. 同じファイル (`ContentView.swift`), **body view**  を更新して、 `performOnAppear()` と呼ばれる関数を呼び出します。

  ```swift
    var body: some View {
        Text("Hello, World!")
            .onAppear {
                self.performOnAppear()
        }
}
  ```

1. 同じファイル (`ContentView.swift`), **** と呼ばれる関数 `performOnAppear()`:

  ```swift
  func performOnAppear() {
      let item = Todo(name: "Build iOS Application",
                      description: "Build an iOS application using Amplify")
}
  ```
  このコードは、2 つのプロパティを持つ Todo アイテムを作成します。名前と説明です。これは、DataStore にまだ保存されていないプレーンオブジェクトです。

1. 項目の作成の下に、 **コード** を追加して、項目をDataStoreに保存します。

  ```swift
  Amplify.DataStore.save(item) { result in
      switch(result) {
      case .success(let savedItem):
          print("Saved item: \(savedItem.name)")
      case .failure(let error):
          print("Could not save item to datastore: \(error)")
      }    
  }
  ```
1. `ContentView.swift` ファイルを先行して更新した後、コードは次のようになります:

```swift
import SwiftUI
import Amplify
import AmplifyPlugins

struct ContentView: View {

    var body: some View {
        Text("Hello, World!")
            .onAppear {
                self.performOnAppear()
        }
    }

    func performOnAppear() {
       let item = Todo(name: "Build iOS Application",
                       description: "Build an iOS application using Amplify")

        Amplify.DataStore.save(item) { result in
           switch(result) {
           case .success(let savedItem):
               print("Saved item: \(savedItem.name)")
           case .failure(let error):
               print("Could not save item to datastore: \(error)")
           }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

1. **** アプリケーションをビルドして実行します。コンソール出力には、項目が正常に保存されたことを示すものが表示されます。

  ```console
  初期化されたAmplify
  保存された項目: iOS アプリケーションをビルド
  ```

1. **追加の項目を保存するには、** を新しいタスクに置き換えます。名前と説明を変更し、優先順位を追加しましょう。

  ```swift
  let item = Todo(name: "四半期ごとの税金を終了する",
                  priority: .high,
                  description: "税金は来週四半期の税金に相当する")
  ```

1. **** アプリケーションをビルドして実行します。コンソール出力には、項目が正常に保存されたことを示すものが表示されます。

  ```console
  初期化されたAmplify
  保存されたアイテム: 四半期ごとの税金を完了する
  ```

## Query Todos

DataStoreにデータがあるので、クエリを実行してレコードを取得できます。

1. Edit your `performOnAppear()` method to remove the item creation and save operations, and replace them with the following code.  Your entire `performOnAppear` function should look like this:

  ```swift
  func performOnAppear() {
      Amplify.DataStore.query(Todo.self) { result in
          switch(result) {
          case .success(let todos):
              for todo in todos {
                  print("==== Todo ====")
                  print("Name: \(todo.name)")
                  if let priority = todo.priority {
                      print("Priority: \(priority)")
                  }
                  if let description = todo.description {
                      print("Description: \(description)")
                  }
              }
          case .failure(let error):
              print("Could not query DataStore: \(error)")
          }
      }
  }
  ```

1. **** アプリケーションをビルドして実行します。コンソールの出力には、以下のように返された項目が表示されます。

  ```console
  初期化された Amplify
  ==== Todo ====
  名前: Amplify を使用して iOS アプリケーションを構築する
  ==== Todo ====
  名前: 四半期ごとの税金を終了する
  説明: 税金は来週四半期ごとに支払われます
  優先順位: 高い
  ```

1. クエリには、述語フィルタを含めることもできます。これらは特定の条件に一致する特定のオブジェクトをクエリします。

  次の述語がサポートされています:

  **文字列**

  `eq` `ne` `le` `lt` `ge` `gt` `contains` `notContains` `beginsWith` `between`

  **数値**

  `eq` `ne` `le` `lt` `ge` `gt` `between`

  **リスト**

  `には` `が含まれており、` は含まれていません

  述語を使用するには、クエリに追加の引数を渡します。例えば、次のコードを使用して、すべての優先度の高い項目を表示できます。

  ```swift
  Amplify.DataStore.query(Todo.self,
                          where: Todo.keys.priority.eq(Priority.high)) { result in
      switch(result) {
      case .success(let todos):
          for todo in todos {
              print("==== Todo ====")
              print("Name: \(todo.name)")
              if let description = todo.description {
                  print("Description: \(description)")
              }
              if let priority = todo.priority {
                  print("Priority: \(priority)")
              }
          }
      case .failure(let error):
          print("Could not query DataStore: \(error)")
      }
  }
  ```
  上記のコードでは、述語パラメータを 2 番目の引数に追加することに注意してください。

1. アプリケーションを実行します。コンソール出力では、返される優先度の高い項目だけが表示されます。

  ```console
  初期化された Amplify
  ==== Todo ====
  名前: 四半期ごとの税金を終了します。
  説明: 税金は来週四半期の予定です。
  優先順位: 高い
  ```

## Todoを更新

レコードの内容を変更することができます。 以下では、レコードをクエリし、コピーを作成し、変更してDataStoreに保存します。
1. `performOnAppear()` メソッドを編集してデータストアに関連するものを削除し、 **以下の** を追加します。

    ```swift
    Amplify.DataStore.query(Todo.self,
                            where: Todo.keys.name.eq("Finish quarterly taxes")) { result in
        switch(result) {
        case .success(let todos):
            guard todos.count == 1, var updatedTodo = todos.first else {
                print("Did not find exactly one todo, bailing")
                return
            }
            updatedTodo.name = "File quarterly taxes"
            Amplify.DataStore.save(updatedTodo) { result in
                switch(result) {
                case .success(let savedTodo):
                    print("Updated item: \(savedTodo.name)")
                case .failure(let error):
                    print("Could not update data in Datastore: \(error)")
                }
            }
        case .failure(let error):
            print("Could not query DataStore: \(error)")
        }
    }
    ```

1. **** アプリケーションをビルドして実行します。コンソール出力には、アイテムが正常に更新されたことを示すものが表示されます:

    ```console
    Initialized Amplify
    Updated item: ファイル四半期税
    ```

## Todo を削除する

CRUD操作を削除するには、レコードをクエリしてDataStoreから削除します。

1. `performOnAppear()` メソッドを編集してデータストアに関連するものを削除し、 **以下の** を追加します。

    ```swift
    Amplify.DataStore.query(Todo.self,
                            where: Todo.keys.name.eq("File quarterly taxes")) { result in
        switch(result) {
        case .success(let todos):
            guard todos.count == 1, let toDeleteTodo = todos.first else {
                print("Did not find exactly one todo, bailing")
                return
            }
            Amplify.DataStore.delete(toDeleteTodo) { result in
                switch(result) {
                case .success:
                    print("Deleted item: \(toDeleteTodo.name)")
                case .failure(let error):
                    print("Could not update data in Datastore: \(error)")
                }
            }
        case .failure(let error):
            print("Could not query DataStore: \(error)")
        }
  }
  ```

1. **** アプリケーションをビルドして実行します。コンソール出力には、項目が正常に削除されたことを示すものが表示されます。
  ```console
  Initialized Amplify
  Deleted item: File 四半期税
  ```

## ほぼ完了しました

We just reached a *very cool* checkpoint. We have a fully featured CRUD application that saves and retrieves data in the local device, which means the app **works without an AWS account and even without internet connection**.

次に、AWSに接続し、クラウドで利用可能なデータを確認します。

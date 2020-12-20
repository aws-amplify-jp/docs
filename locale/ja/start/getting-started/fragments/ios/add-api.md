## バックエンドを提供する

DataStoreがローカルでデータを永続化するようになったので、次のステップでクラウドに接続します。 いくつかのコマンドを使用すると、AWS AppSync APIを作成し、DataStoreにデータを同期させるように設定します。

1. あなたの代わりにクラウドリソースを管理するためにAmplifyを設定します。ターミナルウィンドウを開き、 `configure configure`を実行します。 この手順では、Amplifyのアカウントに新しいAWSユーザーを設定します。

    ```bash
    増幅の設定
    ```

   このコマンドはAWS管理コンソールへのWebブラウザを開き、新しいIAMユーザーの作成をガイドします。 これを設定するには、 [CLI インストールガイド](~/cli/start/install.md) を参照してください。

1. Amplifyバックエンドを初期化します。これを行うには、 **コマンド** を実行します。

    ```bash
    initを増幅する
    ```

1. 次に、新しいバックエンドをクラウドにプッシュします。これを行うには、 **コマンド** を実行します。

    ```bash
    push を増幅する
    ```

    <amplify-callout>

    **注意:** このコマンドはAWSアカウントに必要なすべてのクラウドリソースを生成し、完了するまでに時間がかかる場合がありますので、ゆっくり座ってリラックスしてください。

    </amplify-callout>

## クラウド同期を有効にする

In order to enable cloud syncing you need to **configure your application to use the Amplify API category**. Open the `AppDelegate.swift` file and **update the amplify initialization code** to add the API plugin. The `application(_,didFinishLaunchingWithOptions:)` function should now call `Amplify.add(plugin:)` with a reference to an `AWSAPIPlugin` instance:

```swift
let models = AmplifyModels()
let apiPlugin = AWSAPIPlugin(modelRegistration: models)
let dataStorePlugin = AWSDataStorePlugin(modelRegistration: models)
do {
    try Amplify.add(plugin: apiPlugin)
    try Amplify.add(plugin: dataStorePlugin)
    try Amplify.configure()
    print("Initialized Amplify");
} catch {
    print("Could not initialize Amplify: \(error)")
}
```

これでアプリケーションを実行すると、データがクラウドバックエンドに自動的に同期されます! 🎉

## サブスクリプションを追加

ここでは、 `Todo` モデルの更新を受け取るために、サブスクリプションをアプリケーションに追加する方法を説明します。

1. `ContentView.swift` を開き、 **ファイルの先頭に次の** import 文を追加します:
  ```swift
  import Combine
  ```

1. 同じファイル (`ContentView.swift)`, **構造体にメンバー変数** を追加:
  ```swift
  @State var todoSubscription: AnyCancellable?
  ```

1. 同じファイル (`ContentView.swift`), **構造体に次の** コードを追加:
  ```swift
  func subscribeTodos() {
      self.todoSubscription
          = Amplify.DataStore.publisher(for: Todo.self)
              .sink(receiveCompletion: { completion in
                  print("Subscription has been completed: \(completion)")
              }, receiveValue: { mutationEvent in
                  print("Subscription got this value: \(mutationEvent)")

                  do {
                    let todo = try mutationEvent.decodeModel(as: Todo.self)

                    switch mutationEvent.mutationType {
                    case "create":
                      print("Created: \(todo)")
                    case "update":
                      print("Updated: \(todo)")
                    case "delete":
                      print("Deleted: \(todo)")
                    default:
                      break
                    }

                  } catch {
                    print("Model could not be decoded: \(error)")
                  }
              })
  }
  ```

1. Finally, in the same file (`ContentView.swift`), remove any existing code you may have in the `performOnAppear()` function, and replace it with code **calling the subscribeTodos() function**. Your `performOnAppear()` function may look like this:
  ```swift
  func performOnAppear() {
      subscribeTodos()
}
  ```

1. **** アプリケーションをビルドして実行します。 コンソールの出力で Todoモデルへの変異がある場合はいつでも更新を受け取るためにWebSocket接続を行っていることがわかります。

APIに接続するのは初めてなので、DataStoreは以前にオフラインで行われた変更を同期します。 ガイドに従っている場合 "Build iOS Application"のIDを持つバックエンドと同期される1つの変異があるはずです。

## コンソールを使用して変更をクエリする

このセクションでは、appsyncコンソールを使用して変更を行い、websocketサブスクリプション上で変更を受け取るようにします。

1. プロジェクトのディレクトリでターミナルウィンドウを開きます。 **コマンドを実行します:**
  ```bash
  コンソールの api を増幅する
  ```

  プロンプトが表示されたら、 **GraphQL**を選択します。 これによりAWS AppSync コンソールが開きます。
   ```Console
   ?以下のサービスのいずれかから選択してください: (矢印キーを使用)
      GraphQL 
   ```

1. 次のクエリを左ペインにコピー&ペーストします。

    ```graphql
    query GetTodos {
        listTodos {
            items {
                id
                name
                description
                _deleted
            }
        }
}
    ```

1. **再生ボタン** を押してクエリを実行します。これにより、右側のペインに同期されたすべてのTodosが返されます。

    ![](~/images/lib/getting-started/ios/set-up-ios-appsync-query.png)

## 突然変異を作成

1. 同期は双方向に発生します。以下の変更をコピーして貼り付けることで、AWS AppSync に項目を作成します。

    ```graphql
    mutation CreateTodo {
        createTodo(
            input: {
            name: "Tidy up the office",
            description: "Organize books, vacuum, take out the trash",
            priority: NORMAL
            }
        ) {
            id,
            name,
            description,
            priority,
            _version,
            _lastChangedAt,
        }
    }
    ```

    ![](~/images/lib/getting-started/ios/set-up-ios-appsync-create.png)

1. アプリのコンソール出力には、以下が表示されます。

  ```console
  Subscription got this value: MutationEvent(id: "58220B03-6A42-4EB8-9C07-36019783B1BD", modelId: "0a0acfab-1014-4f25-959e-646a97b7013c", modelName: "Todo", json: "{\"id\":\"id\"0a0acfab-1014-4f25-959e-646a97b7013c\","name\":\"Tidy up the office\", "priority\":\"NORMAL\",\"description\":\"Organize book, vacuum, take out the trash\"}", mutationType: "create", createdAt: 2020-05-14 23:31:04 +0000, version: Optional(1), inProcess: false, graphQLFilterJSON: nil)
  ```

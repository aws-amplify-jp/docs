Amplifyフレームワークと統合するには、次の手順を実行します。

1. クライアント側の設定で API エンドポイントと認証情報を設定します。
2. API スキーマからSwift Model クラスを生成します。
3. クエリ、変更、サブスクリプションを実行するためのアプリコードを記述します。

## バックエンドの設定

**前提条件**
* 少なくともiOS 11.0を対象としたiOSプロジェクト。
* Amplify CLI をインストールおよび設定

<amplify-block-switcher>

<amplify-block name="NPM">

```bash
npm install -g @aws-amplify/cli
```

</amplify-block>

<amplify-block name="cURL (Mac and Linux)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
```

</amplify-block>

<amplify-block name="cURL (Windows)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
```

</amplify-block>

</amplify-block-switcher>

```bash
増幅の設定
```

**歩数**

プロジェクトディレクトリに移動し、APIカテゴリのAppSyncバックエンドを完全に機能させるために、以下のコマンドを実行します。

以下のように、 `amplify init` コマンドを実行します。

```bash
initを増幅する
```

```console
? Enter a name for the project AmplifAPI
? Enter a name for the environment dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building ios
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use default
```

コマンド `amplify add api`を使用して API を追加します。以下に例を示します。

```console
? Please select from one of the below mentioned services: `GraphQL`
? Provide API name: `apiName`
? Choose the default authorization type for the API `API key`
? Enter a description for the API key: 
? After how many days from now the API key should expire (1-365): `30`
? Do you want to configure advanced settings for the GraphQL API `No, I am done.`
? Do you have an annotated GraphQL schema? `No`
? Do you want a guided schema creation? `Yes`
? What best describes your project: `Single object with fields (e.g., “Todo” with ID, name, description)`
? Do you want to edit the schema now? `Yes`
```

このスキーマを使用します：
```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```
`amplify push` コマンドでバックエンドを提供します。以下に例を示します。

```console
? 続行してもよろしいですか? `はい`
? 新しく作成したGraphQL API `いいえ` 用のコードを生成しますか?
```

The example above creates a backend with the Todo schema. You can open the AWS Console for AppSync with `amplify console api` to interact directly with the GraphQL service.  When your backend is successfully updated, there should be two newly created files: `amplifyconfiguration.json` and `awsconfiguration.json` in your project folder.

## Amplifyライブラリとツールのインストール

これが新しいプロジェクトの場合。 `pod init` を実行して `Podfile` を作成し、CocoaPods を使用して依存関係を管理します。 ポッドファイルに以下を追加します:

```ruby
target :'YOUR-APP-NAME' do
    use_frameworks!
    pod 'AmplifyPlugins/AWSAPIPlugin'
    pod 'anply-tools'
end
```

既存の Xcode プロジェクトを閉じます。

CocoaPods 経由で依存関係をインストール
```bash
pod install --repo-update
```

CocoaPods によって作成された `.xcworkspace` ファイルを開く

```bash
<YOURAPP>.xcworkspace を開く
```

プロジェクトをビルドすると、 `amplify` フォルダ、 `amplifyxc.config`、 `awsconfiguration.json`、および `amplifyconfiguration.json` が表示されます。

## Amplifyを初期化

AmplifyとAWSAPIPluginを初期化します。

`AppDelegate.swift` ファイルの先頭に以下のインポートを追加します
```swift
import Amplify
import AmplifyPlugins
```

AppDelegate の `application:didFinishLaunchingWithOptions` メソッドにフォローコードを追加します
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let apiPlugin = AWSAPIPlugin(modelRegistration: AmplifyModels())
    do {
        try Amplify.add(plugin: apiPlugin)
        try Amplify.configure()
        print("Amplify initialized")
    } catch {
        print("Failed to configure Amplify \(error)")
    }
    return true
}
```
## 設定ファイルを追加

3. 左側のパネルのトップレベルプロジェクトをクリックします。
4. プロジェクトとターゲットが含まれている左側のパネルのターゲットの下にあるアプリをクリックします。
5. ビルドフェーズをクリックします
6. コピーバンドルリソースを展開します
7. + ボタンをクリックし、 `awsconfiguration.json` と `amplifyconfiguration.json` を選択して追加します。
8. アプリをビルドして実行 (`Cmd+R`) し、Amplifyが初期化されていることを確認します。

## コードジェネレータの実行

1. `amplifyxc.config`では、モデル生成を有効にしてファイルを保存します。
    ```ruby
    modelgen=true
    ```
2. Build your project with **Product > Build** (`Cmd+b`). This will generate the Model files to be used with `Amplify.API` to query, mutate, and subscribe to you AppSync service. After build completes, the model files will be generated under `amplify/generated/models`. When you edit the schema under `amplify/backend/api/<APINAME>/schema.graphql` and build, it will regenerate the Model files.

3. Alternatively, you can run `amplify codegen models` using Amplify CLI. Make sure you set `modelgen=false` if you are using the CLI instead of Amplify Tools.

4. Drag the entire `models` directory over to your project. If you Build the project, the model files will be regenerated under the `amplify` folder.

5. 各モデル ファイルを選択し、[Target Membership] の下でアプリを選択し、アプリをビルドする際にターゲットに追加されるようにします。

6. AppDelegate メソッドでAmplifyを初期化する前にモデルを登録します。
    ```
    ModelRegistry.register(modelType: Todo.self)
    ```
次のセクションに移動する前に、ビルドして実行していることを確認してください (`Cmd+R`) 。

## APIリファレンス

API の完全な API ドキュメントについては、 [API リファレンス](https://aws-amplify.github.io/amplify-ios/docs/Classes/AmplifyAPICategory.html) を参照してください。

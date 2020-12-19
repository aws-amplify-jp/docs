
👋 ようこそ! このチュートリアルでは、以下を行います。

- Amplifyで設定されたiOSアプリを設定する
- データモデルを作成し、DataStoreをAmplify
- クラウドバックエンドに同期するためにローカルデータを接続します

## 前提条件

- [Node.js](https://nodejs.org/en/) バージョン 10 以降をインストールする
- [Xcode](https://developer.apple.com/xcode/downloads/) バージョン 11.4 以降をインストール
- [Cocoapods](https://cocoapods.org/) をインストール
- [Amplify CLI](~/cli/cli.md) バージョン 4.22.0 以降を実行してインストールします。

    ```bash
    npm install -g @aws-amplify/cli amplify-app
    ```

## アプリケーションの設定

### 新しいiOSアプリを作成

1. **Xcodeを開きます。** メニューバーから **"File -> New -> Project..."**

1. **Single View App**を選択し、 **Next** ボタンを選択します。 ![](~/images/lib/getting-started/ios/set-up-ios-select-project-template.png)

1. プロジェクトの以下の内容を入力してください:
  * 商品名: **Todo**
  * インターフェイス: **SwiftUI**
  * ライフサイクル: **SwiftUI App** (Xcode 12 が使用されている場合のみ)
  * 言語: **Swift**
  * **次へ** ボタンを選択します

  ![](~/images/lib/getting-started/ios/set-up-ios-studio-configure-your-project.png)

1. **次へ**を選択した後、 **プロジェクトを保存する場所を選択し、**を選択し、 **** を選択します。

  Amplifyなしで空のiOSプロジェクトがあるはずです。

### Amplifyをアプリケーションに追加

iOS用AmplifyはCocoapodsを通じてPodとして配布されます。このセクションではCocoapodsを設定し、必要なAmplifyパッケージを追加します。

1. Before starting this step, **close Xcode**. Now **open a terminal window** and **change to the directory for your Todo project**. For example, if you created your project in the folder `~/Developer`, you can type the following:
  ```bash
  cd ~/Developer/Todo
  ```

1. Amplifyアプリを作成するには、先にインストールした `anplify-app` CLIを使用する必要があります。 **コマンド** を実行します。
  ```bash
  anplify-app --platform ios
  ```

1. Cocoapods パッケージマネージャでプロジェクトを初期化するには、 **コマンド** を実行します。
  ```bash
  pod init
  ```

  これを行うと、 `Podfile`という名前の新しく作成されたファイルが表示されます。 このファイルは、プロジェクトが依存するパッケージを記述するために使用されます。

1. Open `Podfile` in the file editing tool of your choice, and replace the contents of the file so that your `Podfile` looks like the following:
  ```ruby
  ターゲット 'Todo' do
    use_frameworks!

    pod 'Amplify'
    pod 'AmplifyPlugins/AWSAPIPlugin'
    pod 'AmplifyPlugins/AWSDataStorePlugin'

  end
  ```

1. プロジェクトに Amplify ポッドをダウンロードしてインストールするには、 **コマンド** を実行します。
  ```bash
  pod install --repo-update
  ```

1. After running the previous command, you should see the file named `Todo.xcworkspace` in your project directory. You are required to use this file from now on instead of the `.xcodeproj` file. To open your newly generated `Todo.xcworkspace` in Xcode, **run the command**:
  ```bash
  xed .
  ```

Amplify でビルドを開始する準備ができました! 🎉

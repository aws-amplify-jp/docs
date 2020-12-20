
👋 ようこそ! このチュートリアルでは、以下を行います。

- Amplifyで設定されたAndroidアプリを設定する
- データモデルを作成し、DataStoreをAmplify
- クラウドバックエンドに同期するためにローカルデータを接続します

## 前提条件

- [Android Studio](https://developer.android.com/studio/index.html#downloads) バージョン 4.0 以降をインストール
- [Android SDK](https://developer.android.com/studio/releases/platforms) API レベル 29 (Android 10) をインストールします
- [Amplify CLI](~/cli/cli.md) バージョン 4.21.0 以降を実行してインストールします。

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

## アプリケーションの設定

### 新しいAndroidアプリケーションを作成します

1. **Android Studio**を開きます。 **+ 新しい Android Studio プロジェクトを開始する** を選択します。

    ![](~/images/lib/getting-started/android/set-up-android-studio-welcome.png)

1. **プロジェクトテンプレート**を選択し、 **空のアクティビティ**を選択します。 **次へ**を押します。

    ![](~/images/lib/getting-started/android/set-up-android-studio-select-project-template.png)

1. 次に、プロジェクトを構成します。

    - *名前* フィールドに **Todo** を入力します
    - *言語* ドロップダウンメニューから *Java* または **Kotlin** を選択します
    - *API 21: Android 5.0 (Lollipop)* を **Minimum SDK** ドロップダウンメニューから選択します
    - **Finish** を押します

  ![](~/images/lib/getting-started/android/set-up-android-studio-configure-your-project-todo.png)

Android Studio will open your project with a tab opened to either *MainActivity.java* or *MainActivity.kt* depending upon if you created a Java or Kotlin project respectively.

![](~/images/lib/getting-started/android/set-up-android-studio-successful-setup.png)

### Amplifyをアプリケーションに追加

Amplify for Android は Apache Maven パッケージとして配布されています。このセクションでは、パッケージやその他の必要なディレクティブをビルドの設定に追加します。

1. プロジェクトファイルビューアで **Gradle スクリプト** を展開し、 **build.gradle (プロジェクト: Todo)** を開きます。

  プロジェクト レベル `build.gradle` ファイルに次の追加を行います。
  - `依存関係` ブロックに `classpath 'com.amplify-tools-gradle-plugin:1.0.2'` 行を追加します。
  - `の行を追加する plugin: 'com.amplifyframework.amplifytools'` をファイルの末尾に追加する。

  あなたのファイルは次のようになります:

  ```groovy
  buildscript {
      repositories {
          google()
          jcenter()
      }

      dependencies {
          classpath 'com.android.tools.build:gradle:4.0.1'

          // Add this line into `dependencies` in `buildscript`
          classpath 'com.amplifyframework:amplify-tools-gradle-plugin:1.0.2'
      }
  }

  allprojects {
      repositories {
          google()
          jcenter()
      }
  }

  // Add this line at the end of the file
  apply plugin: 'com.amplifyframework.amplifytools'
  ```

2. **Gradle Scripts**の下で **build.gradle (Module: app)** を開きます。

   次の行を使用して、ファイル内の `依存関係` ブロックを更新します。

   ```groovy
   dependencies {
       implementation 'com.amplifyframework:aws-api:1.6.4'
       implementation 'com.amplifyframework:aws-datastore:1.6.4'
}
   ```

3. Run **Gradle Sync**

    Android Studio では、プロジェクトを新しい構成と同期させる必要があります。 これを行うには、ファイルエディタの上の通知バーにある **Sync Now** をクリックします。

    ![](~/images/lib/getting-started/android/set-up-android-studio-sync-gradle.png)

    完了すると、画面下部の *ビルド* タブの出力に *CONFIGURE SUCCESSFUL* が表示されます。

    ![](~/images/lib/getting-started/android/set-up-android-studio-configure-successful.png)

Amplify でビルドを開始する準備ができました! 🎉

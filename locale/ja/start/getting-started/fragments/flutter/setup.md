
👋 ようこそ! このチュートリアルでは、以下を行います。

- Flutter開発環境のセットアップ
- Amplify Flutter Libraryの依存関係を追加
- 分析イベントを記録する基本的なアプリを作成
- Amplify CLIを使用してAWSバックエンドリソースをセットアップする

## 前提条件

- [Flutter のインストール](https://flutter.dev/docs/get-started/install) バージョン 1.20.0 以上

- [IDE のセットアップ](https://flutter.dev/docs/get-started/editor?tab=androidstudio)

    このチュートリアルでは、AndroidStudio を使用してアプリを開発していることを前提としています。

- [Amplify CLI](~/cli/cli.md) を以下を実行してインストールします。

    ```bash
    npm install -g @aws-amplify/cli
    ```

- AWS アカウントにサインアップ

    AWSアカウントをまだお持ちでない場合は、このチュートリアルの手順に従って作成する必要があります。

    [AWS アカウントを作成](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start)

    > 先行料金やAWSアカウントを作成し、サインアップすることでAWSFree Tierに即座にアクセスすることができます。


## アプリケーションの設定

### 新しいFlutterアプリケーションを作成

1. Flutter CLI を使用して新しいプロジェクトを作成:

    ```bash
    フラッターがTODOを作る
    ```

1. または、 **Android Studio**を使用して、 **+ Flutter プロジェクトを開始する** を選択します。

    ![](~/images/lib/getting-started/flutter/set-up-android-studio-welcome.png)

1. **プロジェクトテンプレート**を選択し、 **Flutter Application**を選択します。 **次へ** を押します。

    ![](~/images/lib/getting-started/flutter/set-up-android-studio-select-project-template.png)


1. 次に、プロジェクトを構成します。

    - *名前* フィールドに **タスク** を入力します
    - Flutter SDK パスがマシンにインストールされている場所に正しく設定されていることを確認してください
    - 次の ****を押します。次の画面で、 **完了** を押します。

  ![](~/images/lib/getting-started/flutter/set-up-android-studio-configure-your-project.png)

Android Studioは *main.dart*のタブを開いてプロジェクトを開きます。

1. 最後に、PodfileをiOSプラットフォーム11.0以上に変更します。 プロジェクト内で `ios/Podfile` を開き、2 行目を `platform :ios, '11.0' に変更します。

空のFlutterプロジェクトがあり、次のステップでAmplifyを追加します。

### Amplifyをアプリケーションに追加

Flutter の Amplify は **pub.dev** を介して配布されます。


1. **app**の `pubspec.yaml` を開き、"sdk:flutter" という行の下に次の 3 つの依存関係を追加します。

```yaml
依存関係:
  flutter:
    sdk: flutter

  amplify_core: '<1.0.0'
  amplify_auth_cognito: '<1.0.0'
  anplify_analytics_pinpoint: '<1.0.0'
```

1. **Flutter Pub Get** を実行する

    Android Studio では、プロジェクトを新しい構成と同期させる必要があります。 これを行うには、ファイルエディタの上部にある通知バーの **Flutter** をクリックします。

    ![](~/images/lib/getting-started/flutter/set-up-android-studio-pub-get.png)

    あるいは、ターミナルウィンドウを開いてプロジェクトのルートディレクトリ(pubspec.yamlがある場所)にCDを開き、以下を実行することもできます。

    ```bash
    フラッターパブは 
    ```

    When complete, you will see *Process finished with exit code 0* in the output of the *Messages* tab at the bottom of your screen.

    ![](~/images/lib/getting-started/flutter/set-up-android-studio-configure-successful.png)

Amplify でビルドを開始する準備ができました! 🎉

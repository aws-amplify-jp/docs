Flutter の Amplify は **pub.dev** を介して配布されます。

**app**の `pubspec.yaml` を開き、"sdk:flutter" という行の下に次の 3 つの依存関係を追加します。

```yaml
依存関係:
  flutter:
    sdk: flutter

  amplify_core: '<1.0.0'
  amplify_auth_cognito: '<1.0.0'
  anplify_analytics_pinpoint: '<1.0.0'
```

**Flutter Pub Get** を実行する

Android Studio では、プロジェクトを新しい構成と同期させる必要があります。 これを行うには、ファイルエディタの上部にある通知バーの **Flutter** をクリックします。

![](~/images/lib/getting-started/flutter/set-up-android-studio-pub-get.png)

あるいは、ターミナルウィンドウを開いてプロジェクトのルートディレクトリ(pubspec.yamlがある場所)にCDを開き、以下を実行することもできます。

```bash
フラッターパブは 
```

When complete, you will see *Process finished with exit code 0* in the output of the *Messages* tab at the bottom of your screen.

![](~/images/lib/getting-started/flutter/set-up-android-studio-configure-successful.png)
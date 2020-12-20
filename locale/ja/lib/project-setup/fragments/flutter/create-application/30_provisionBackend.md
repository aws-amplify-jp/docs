バックエンドでリソースのプロビジョニングを開始するには、ディレクトリをプロジェクトディレクトリに変更し、 `amplify init` を実行します。

```bash
# in future, make sure you have Amplify CLI v4.28 and above for Flutter support
# npm install -g @aws-amplify/cli@4.26.1-flutter-preview.0 for now
amplify init
```

プロンプトが表示されたら以下を入力します:

```console
? Enter a name for the environment
    `dev`
? Choose your default editor:
    `IntelliJ IDEA`
? Choose the type of app that you're building: 
    'flutter'
⚠️  Flutter project support in the Amplify CLI is in DEVELOPER PREVIEW.
Only the following categories are supported:
 * Auth
 * Analytics
 * Storage
? Where do you want to store your configuration file? 
    ./lib/
? Do you want to use an AWS profile?
    `Yes`
? Please choose the profile you want to use
    `default`
```

`amplify init`を正常に実行すると、 `./lib/` `amplifyconfiguration.dart` と呼ばれる設定ファイルが作成されます。

このファイルはアプリケーションにバンドルされ、Amplifyライブラリが実行時にプロビジョニングされたバックエンドリソースにアクセスする方法を知ることができます。

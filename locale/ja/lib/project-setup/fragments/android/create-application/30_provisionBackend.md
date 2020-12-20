バックエンドでリソースのプロビジョニングを開始するには、ディレクトリをプロジェクトディレクトリに変更し、 `amplify init` を実行します。

```bash
initを増幅する
```

プロンプトが表示されたら以下を入力します:

```console
? Enter a name for the environment
    `dev`
? Choose your default editor:
    `IntelliJ IDEA`
? Do you want to use an AWS profile?
    `Yes`
? Please choose the profile you want to use
    `default`
```

`amplify init`の実行に成功すると、 `./app/src/main/res/raw/` `anplifyconfiguration.json` と呼ばれる設定ファイルが作成されます。

このファイルはアプリケーションにバンドルされ、Amplifyライブラリが実行時にプロビジョニングされたバックエンドリソースにアクセスする方法を知ることができます。
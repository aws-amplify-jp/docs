### Amplify CLI で AWS Cloud Resources をセットアップ

Amplify CLI を使用して、アプリに電源を供給するAWS Cloud Resourcesを設定します。

1. まず、増幅クリップをインストールします。端末の実行内で:

    ```bash
    npm install -g @aws-amplify/cli
    ```

2. Amplify CLI を実行して初期化します。

    ```bash
    initを増幅する
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

3. Amplifyを設定してクラウドリソースを管理します。このステップでは、Amplifyのアカウントに新しいAWSユーザーを設定します。 端末ウィンドウを開きます。Android Studio で外部端末または統合端末を使用できます。端末では、次を実行します。

    ```bash
    増幅の設定
    ```

    このコマンドはAWS管理コンソールへのWebブラウザを開き、新しいIAMユーザーの作成をガイドします。 これを設定するには、 [CLI インストールガイド](~/cli/start/install.md) を参照してください。

4. ターミナルに以下を入力して Analytics を追加します。

    ```
    anmpify add analytics
    ```

    すべてのデフォルト値を受け入れるだけです。

    ```
    ? Select an Analytics provider (Use arrow keys)
        `Amazon Pinpoint`
    ? Provide your pinpoint resource name: 
        `yourPinpointResourceName`
    ? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started) 
        `Yes`
    ```

5. すべての変更を保存し、AWS リソースを作成するには、次のコマンドを最後に実行します。

    ``` 
    push を増幅する 
    ```

    これらの手順を実行すると、プロジェクトのlibディレクトリに `anplifyconfiguration.dart` ファイルが表示されます。 このファイルを慎重に保護しましょう! アプリケーションがバックエンドのAWSリソースとの安全な通信を確立するために使用する機密情報が含まれています。 紛失または破損している場合は、Amplify CLI で上記の手順をもう一度繰り返すことで、いつでも再生成できます。

この時点で、アプリを実行する準備が整いました。 Android Studioに戻り、上部のバーで緑色の再生ボタンをクリックしてデプロイします。

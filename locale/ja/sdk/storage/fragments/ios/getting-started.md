### 概要

アプリケーションを有効にして、目的に合った権限モデルを使用してクラウドストレージからユーザーファイルを保存および取得します。 Amplify CLI は、 [Amazon Simple Storage Service](http://docs.aws.amazon.com/AmazonS3/latest/dev/) を使用してクラウドストレージバケットをデプロイおよび設定します。

### ストレージアクセス

CLIは、パブリック、保護、プライベートの3つの異なるアクセスレベルをストレージバケットに設定します。 `を増幅してストレージを追加するとき`、 CLIは、Amazon Cognito Identity Pools IAMロールを使用してバケットに適切なIAMポリシーを設定します。 CRUD (Create, Read, Update) を追加するオプションがあります。 `と`)権限も、認証およびゲストユーザーにこれらのレベルに基づいて異なる権限が付与されるようにします。

If you had previously enabled user sign-in by running `amplify add auth` in your project, the policies will be connected to an `Authenticated Role` within Cognito Identity Pools which has scoped permissions to the objects in the S3 bucket prefixed by a user's Cognito Identity ID. If you haven't configured user sign-in, then an `Unauthenticated Role` will be assigned for each unique user/device combination, which will still have scoped permissions to owned objects.

* **公開**: アプリのすべてのユーザーがアクセスできます。ファイルは、S3バケットに `公開/` プレフィックスで保存されます。
* **Protected**: すべての認証済みユーザー、所有者のみが書き込み可能です。ファイルは `protected/{cognito_user_identity_id}/` 接頭辞で保存されます。
* **プライベート**: 所有者のみアクセスできます。ファイルは `private/{cognito_user_identity_id}/` プレフィックスで保存されます。

> The `cognito_user_identity_id` corresponds to the owner's unique Amazon Cognito Identity ID. See [Authentication](~/sdk/auth/working-with-api.md#utility-properties) for more information on how to get the `cognito_user_identity_id` for a signed in user.

### バックエンドを設定

1. 先に進む前に [はじめに](~/start/start.md) ステップを完了してください。

2. Amplify CLI を使用してアプリケーションにストレージを追加します。

    In a terminal window, navigate to your project root folder (the folder that contains your app's `.xcodeproj` file), and add the SDK to your app.

    ```bash
    cd ./YOUR_PROJECT_FOLDER
    add storage
    ```

3.  ストレージサービスとして `コンテンツ` を選択します。

    ```console
    <unk> コンテンツ (画像、オーディオ、ビデオなど)
    ```

4. CLI は、認証を有効にするオプションを表示します (以前に有効にしていない場合) アクセス権限を持つユーザーを決定するために（認証ユーザとゲストユーザの両方に対して `` と `読み取り/書き込み` を選択します）。

5. `増幅ステータス`を実行して、ストレージと認証が設定されていることを確認してください:

    ```console
    $ amplify status
    | Resource name | Operation | Provider プラグイン|
    | ---------------------------- | --------------- |
    | Auth | cognito2e202b09 | Create | awscloudforming |
    | Storage | sabc0123de | Create | awscloudforming |
    ```

6. バックエンドの実行を作成するには:

    ```bash
    push を増幅する
    ```

    The CLI will create the `awsconfiguration.json` file in your project directory. In the Finder, drag `awsconfiguration.json` into Xcode under the top Project Navigator folder (the folder name should match your Xcode project name). When the `Options` dialog box appears, do the following:

* 必要に応じて `項目をコピー` チェックボックスをクリアします。
* `グループの作成`を選択し、 `終了` を選択します。

##### Lambda Triggers
AmplifyのCLIは、Lambdaの関連付けをサポートしています。Amazon S3およびDynamoDBイベントのトリガー。 CLI が管理する DynamoDB テーブルで作成または更新操作の後に Lambda 関数を呼び出したい場合に便利です。 [続きを読む](~/cli/usage/lambda-triggers.md#s3-lambda-triggers)

### バックエンドに接続

次の手順を使用して、アプリにストレージサービスを追加します。

1. AWS Mobile SDKをインストールするには、 `AWSS3` の依存関係を `Podfile` に追加します。

    ```ruby
    platform :ios, '9.0'

    target :'YOUR-APP-NAME' do
        use_frameworks!

        pod 'AWSS3'

        # other pods . . .
        pod 'AWSMobileClient'
    end
    ```

続行する前に `pod install --repo-update` を実行します。

2. 次のインポートをユーザーファイルストレージ操作を実行するクラスに追加します。

    ```swift
    import AWSS3
    ```

### モックとローカルテスト

Amplifyは、S3を使用してアプリケーションをテストするためのローカルモックサーバの実行をサポートしています。詳細については、 [CLI Toolchain documentation](~/cli/usage/mock.md) を参照してください。

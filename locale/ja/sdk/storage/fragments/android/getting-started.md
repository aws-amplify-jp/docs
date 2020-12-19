アプリケーションを有効にして、目的に合った権限モデルを使用してクラウドストレージからユーザーファイルを保存および取得します。 CLI は、 [Amazon Simple Storage Service (Amazon S3)](http://docs.aws.amazon.com/AmazonS3/latest/dev/) を使用してクラウドストレージバケットをデプロイおよび構成します。

**_メモ_**

This guide specifically uses `TransferUtility`, which is a high-level wrapper over `AmazonS3Client`. [`TransferUtility`](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/s3/transferutility/TransferUtility.html) is a tool that simplifies asynchronous _transfer_ management (i.e. upload and download), and it may not contain all of the features available in Amazon S3 service. To access low-level features such as bucket manipulation and object deletion, please refer to the documentation for [`AmazonS3Client`](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/services/s3/AmazonS3Client.html).

## ストレージアクセス

CLIは、パブリック、保護、プライベートの3つの異なるアクセスレベルをストレージバケットに設定します。 `を増幅してストレージを追加するとき`、 CLIはCognito Identity Pool Roleを使用してバケットに適切なIAMポリシーを設定します。 CRUD (作成/更新、読み取り/削除) ベースのアクセス許可を追加することもできます。 これらのレベル内で認証およびゲストユーザーに限定された権限が付与されるようにします。

If you had previously enabled user sign-in by running `amplify add auth` in your project, the policies will be connected to an `Authenticated Role` of the Identity Pool which has scoped permission to the objects in the bucket for each user identity. If you haven't configured user sign-in, then an `Unauthenticated Role` will be assigned for each unique user/device combination, which still has scoped permissions to just their objects.

* 公開: アプリのすべてのユーザーがアクセスできます。ファイルは、S3バケットの `公開/` パスの下に保存されます。
* 保護: すべてのユーザーが読み取ることができますが、作成ユーザーによってのみ書き込み可能です。 ファイルは `protected/{user_identity_id}/` の下に保存されます。ここで、 `user_identity_id` は、そのユーザーの固有の Amazon Cognito ID に対応します。
* プライベート: 個々のユーザーのみアクセスできます。 ファイルは `private/{user_identity_id}/` の下に保存されます。ここで、 `user_identity_id` は、そのユーザーの固有の Amazon Cognito ID に対応します。

署名されたユーザについては [認証](~/sdk/auth/getting-started.md) を参照してください。 `user_identity_id` を取得する方法については、 format@@4 を参照してください。
## バックエンドを設定

1. 先に進む前に [はじめに](~/start/start.md) ステップを完了してください。

2. CLI を使用して、クラウド対応のバックエンドとアプリにストレージを追加します。

    ターミナルウィンドウで、プロジェクトフォルダ(通常はプロジェクトレベルbuild.gradleを含むフォルダ)に移動し、SDKをアプリケーションに追加します。

    ```bash
    cd ./YOUR_PROJECT_FOLDER
    add storage
    ```

3. ストレージサービスとして `コンテンツ` を選択します。

    ```console
    <unk> コンテンツ (画像、オーディオ、ビデオなど)
    ```

4. フレンドリーな名前とバケット名の組み合わせは、グローバルに一意でなければなりません。 別の S3 ユーザーがこれらの両方に同じ値を指定した場合、以下の増幅ステップは失敗します。

5. The CLI walks you through the options to enable Auth (if not enabled previously), to name your S3 bucket, and to decide who should have access (select `Auth and guest users` and toggle all to select `create/update, read, and delete` access for both auth and guest users).

6. ストレージと認証が設定されていることを確認します。

    ```console
      $ amplify status
      | Resource name | Operation | Provider プラグイン|
      | ---------------------------- | --------------- |
      | Auth | cognito2e202b09 | Create | awscloudforming |
      | Storage | sabc0123de | Create | awscloudforming |
      ```
7. バックエンドの実行を作成するには:

    ```bash
    push を増幅する
    ```

    CLIはプロジェクトの `res/raw` ディレクトリにawsconfiguration.jsonファイルを作成します。

### Lambda Triggers
Amazon S3 & Amazon DynamoDBをプロバイダとして使用してストレージカテゴリのトリガを有効にする場合。 CLI は、Lambda トリガーを S3 および DynamoDB イベントに関連付けることをサポートします。 例えば、 これは、Amplify CLI によって管理されている DynamoDB テーブルでの作成または更新操作の後に Lambda 関数を呼び出したいユースケースに役立ちます。 format@@0 続きを読む [](~/cli/usage/lambda-triggers.md#s3-lambda-triggers)

## バックエンドに接続

次の手順を使用して、アプリケーションにファイルストレージサービスを追加します。

1. 以下を `app/build.gradle` に追加します(Module:app):

    ```groovy
    dependencies {
      implementation 'com.<unk> s:aws-android-sdk-s3:2.15.+'
      implementation ('com.<unk> s:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
      implementation ('com.<unk> s:aws-android-sdk-auth-userpools:2.15.+@aar') { transitive = true }
}
    ```
    `Gradle Sync` を実行して、AWS Mobile SDK コンポーネントをアプリケーションにダウンロードします。

2. `AndroidManifest.xml` に以下を追加:

    ```xml
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <service android:name="com.amazonaws.mobileconnectors.s3.transferutility.TransferService" android:enabled="true" />
    ```

3. **For Android Q (API 29)**: API 29 enforces scoped storage access for Android apps. To gain access to legacy external storage, enable the following application property inside `AndroidManifest.xml`:

    ```xml
    <manifest ...>
      <application android:requestLegacyExternalStorage="true" ...>
        ...
      </application>
    </manifest>
    ```

## モックとローカルテスト

Amplifyは、S3を使用してアプリケーションをテストするためのローカルモックサーバの実行をサポートしています。詳細については、 [CLI Toolchain documentation](~/cli/usage/mock.md) を参照してください。

## 転送ユーティリティと Amazon Cognito に関する注意

Transfer UtilityはAmazon S3のあらかじめ署名されたURLを生成し、バックグラウンド転送を可能にするためにそれらを使用します。 Amazon Cognito Identityを使用すると、最大60分まで有効なAWSの一時的な認証情報が届きます。 60分以上続くS3事前署名付きURLを生成することはできません。 この制限により、転送ユーティリティは50分間の転送タイムアウトを強制します(AWSの一時的な認証情報の再生を減らすための10分間のバッファ)。 50分後、転送に失敗しました。

アプリが50分以上かかる送金を行う場合は、 [TransferUtility](http://docs.aws.amazon.com/AWSAndroidSDK/latest/javadoc/com/amazonaws/services/s3/AmazonS3Client.html) の代わりに [AmazonS3Client](http://docs.aws.amazon.com/AWSAndroidSDK/latest/javadoc/com/amazonaws/mobileconnectors/s3/transferutility/TransferUtility.html)を使用してください。

## 追加リソース

* [Amazon S3 入門ガイド](http://docs.aws.amazon.com/AmazonS3/latest/gsg/GetStartedWithS3.html)
* [Amazon S3 APIリファレンス](http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
* [Amazon S3 開発者ガイド](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)
* [アイデンティティとアクセス管理コンソール](https://console.aws.amazon.com/iam/home)
* [Amazon S3 バケットへのアクセスを許可する](http://blogs.aws.amazon.com/security/post/Tx3VRSWZ6B3SHAV/Writing-IAM-Policies-How-to-grant-access-to-an-Amazon-S3-bucket)
* [顧客から提供された暗号化キーを使用したデータの保護](https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html)

## サンプルアプリ

TransferUtility機能を示すサンプルアプリについては、 [S3 TransferUtility Sample](https://github.com/awslabs/aws-sdk-android-samples/tree/master/S3TransferUtilitySample) を参照してください。

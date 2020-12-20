Amplifyストレージカテゴリは、アプリのユーザーコンテンツを公開、保護、またはプライベートストレージバケットで管理するためのインターフェイスを提供します。 ストレージカテゴリには、Amazon Simple Storage Service (S3) のデフォルトの組み込みサポートが含まれています。 Amplify CLI は、アプリケーション用のストレージ バケットの作成と設定を支援します。 Amplify AWS S3 Storage プラグインは [Amazon S3](https://aws.amazon.com/s3)を利用しています。

## 目標
Amplifyストレージを使用してアプリケーションを設定し、簡単なアップロードファイル例を参照してください。

## 前提条件

<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/storage/fragments/android/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/getting-started/10_preReq.md"></inline-fragment>

## バックエンドストレージを提供

バックエンドでストレージ リソースのプロビジョニングを開始するには、プロジェクト ディレクトリに移動し、 **コマンド** を実行します。

```bash
増幅してストレージを追加
```

プロンプトが表示されたら以下を入力します:
```console
? Please select from one of the below mentioned services:
    `Content (Images, audio, video, etc.)`
? You need to add auth (Amazon Cognito) to your project in order to add storage for user files. Do you want to add auth now?
    `Yes`
? Do you want to use the default authentication and security configuration?
    `Default configuration`
? How do you want users to be able to sign in?
    `Username`
? Do you want to configure advanced settings?
    `No, I am done.`
? Please provide a friendly name for your resource that will be used to label this category in the project:
    `S3friendlyName`
? Please provide bucket name:
    `storagebucketname`
? Who should have access:
    `Auth and guest users`
? What kind of access do you want for Authenticated users?
    `create/update, read, delete`
? What kind of access do you want for Guest users?
    `create/update, read, delete`
? Do you want to add a Lambda Trigger for your S3 Bucket?
    `No`
```

クラウドに変更をプッシュするには、 **コマンド** を実行します。

```bash
push を増幅する
```

Upon completion, your config file (either `amplifyconfiguration.dart` for Flutter or `amplifyconfiguration.json` for JavaScript) should be updated to reference provisioned backend storage resources. Note that these files should already be a part of your project if you followed the [Project setup walkthrough](~/lib/project-setup/create-application.md).

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/storage/fragments/android/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/getting-started/20_installLib.md"></inline-fragment>

## Amplifyストレージを初期化

<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/getting-started/30_initStorage.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/storage/fragments/android/getting-started/30_initStorage.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/getting-started/30_initStorage.md"></inline-fragment>

## バケットにデータをアップロードしています

データオブジェクトから S3 にアップロードするには、アップロードするキーとデータオブジェクトを指定します。

<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/getting-started/40_upload.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/storage/fragments/android/getting-started/40_upload.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/getting-started/40_upload.md"></inline-fragment>

Upon successfully executing this code, you should see a new folder in your bucket, called `public`. It should contain a file called `ExampleKey`, whose contents is `Example file contents`.

## 次のステップ

おめでとうございます！ファイルを s3 バケットにアップロードしました。以下のリンクを参照して、Amplify Storage の使用例をご覧ください。

* [ファイルアクセスレベルの設定](~/lib/storage/configureaccess.md)
* [ファイルをダウンロード](~/lib/storage/download.md)
* [リストファイル](~/lib/storage/list.md)
* [ファイルを削除](~/lib/storage/remove.md)
* [Lambda Triggers の使用](~/lib/storage/triggers.md)
* [脱出ハッチ](~/lib/storage/escapehatch.md)

既存のAmazon S3バケットは、 `anplifyconfiguration.json` ファイルで参照することで、Amplifyライブラリと一緒に使用できます。

```json
{
    "storage": {
        "plugins": {
            "awsS3StoragePlugin": {
                  "bucket": "[BUCKET NAME]",
                  "region": "[REGION]"
            }
        }
    }
}
```

- **bucket**: ストレージに使用する Bucket の名前
- **region**: Bucket がプロビジョニングされている AWS リージョン(例: *us-east-1*)

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。 
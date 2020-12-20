既存のAmazon S3バケットは、 `anplifyconfiguration.dart` ファイルで参照することで、Amplifyライブラリと一緒に使用できます。

```dart
const amplifyconfig = ''' {
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "storage": {
    "plugins": {
      "awsS3StoragePlugin": {
        "bucket": "[BUCKET NAME]",
        "region": "[REGION]"
      }
    }
  }
}''';
```

- **bucket**: ストレージに使用する Bucket の名前
- **region**: Bucket がプロビジョニングされている AWS リージョン(例: *us-east-1*)
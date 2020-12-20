**アプリ**の `pubspec.yaml` に以下の依存関係を追加する **前提条件**:

```yaml
依存関係:
  flutter:
    sdk: flutter
  amplify_storage_s3: '<1.0.0'
  # reminder: anplify_auth_cognito もインストールする必要があります
```

プロジェクトにインポートすることを忘れないでください：

```dart
// main.dart
// リマインダー: import 'package:anplify_auth_cognito/anply_auth_cognito.dart';
import 'package:anply_storage_s3/anply_storage_s3.dart';
```

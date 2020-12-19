Flutterプロジェクト・ディレクトリで **pubspec.yaml** を開きます。

> プロジェクトの設定の手順に従って、Amplifyを既に構成しています。

依存関係ブロックにこれらのライブラリを追加して、Analytics を追加します。

```yaml 
dependencies:

  # Should already be added during Project Setup walkthrough 
  amplify_core:
    path: '<1.0.0'

  # Add these lines in `dependencies` 
  amplify_analytics_pinpoint:
    path: '<1.0.0'
```
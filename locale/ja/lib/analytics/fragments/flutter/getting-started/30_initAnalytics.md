AuthとAnalyticsプラグインと他のプラグインを追加するには、 *前提条件* セクションの説明に従って追加してください。

```dart
AmplifyAuthCognito authPlugin = AmplifyAuthCognito();
AmplifyAnalyticsPinpoint analyticsPlugin = AmplifyAnalyticsPinpoint();

anplyInstance.addPlugin(
    authPlugins: [authPlugin], analyticsPlugins: [analyticsPlugin]);
```

プロジェクト設定で生成された anplifyconfiguration.dart ファイルが含まれていることを確認し、Amplify.configure に送信します。

```dart 
import 'amplifyconfiguration.dart';

Amplify.configure( amplifyConfig )
```

あなたのクラスは次のようになります：

```dart
import 'amplifyconfiguration.dart';

class MyAmplifyApp extends StatefulWidget {

    @override
    void initState() {
        super.initState(); 

        AmplifyAuthCognito authPlugin = AmplifyAuthCognito();
        AmplifyAnalyticsPinpoint analyticsPlugin = AmplifyAnalyticsPinpoint();

        amplifyInstance.addPlugin(
            authPlugins: [authPlugin], analyticsPlugins: [analyticsPlugin]);

        Amplify.configure( amplifyConfig ); 
    }
}
```
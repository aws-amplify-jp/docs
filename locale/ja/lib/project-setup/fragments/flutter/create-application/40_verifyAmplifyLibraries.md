
Amplify Flutter Libraryのメソッドを使用する前に、必要なすべてのプラグインを追加し、一度アプリで configure を呼び出すことが重要です。 以下の手順で、フラッターアプリのルートレベルにAmplify Flutterを設定できます。

main.dartの上部に必要なダーツの依存関係をインポートします。

```dart
// Amplify Flutter Packages
import 'package:amplify_core/amply_core.dart';
import 'package:anplify_analytics_pinpoints/anply_analytics_pinpoints_pinpoints.dart';
import 'package:anplify_auth_cognito.dart';

// Generated in previous step 
import 'amplifyconfiguration.dart'; 
```

アプリケーションのルートステートフル・ウィジェットに次のコードを追加します。 空白の Flutter アプリの場合、これは `クラス _MyHomePageState が状態<MyHomePage>` を拡張する必要があります。

```dart

class _MyHomePageState extends State<MyHomePage> {

  bool _amplifyConfigured = false;
  Amplify amplifyInstance = Amplify();

  @override
  initState() {
    super.initState(); 
    _configureAmplify(); 
  }

  void _configureAmplify() async {

    // Add Pinpoint and Cognito Plugins, or any other plugins you want to use
    AmplifyAnalyticsPinpoint analyticsPlugin = AmplifyAnalyticsPinpoint();
    AmplifyAuthCognito authPlugin = AmplifyAuthCognito();
    amplifyInstance.addPlugin(
      authPlugins: [authPlugin], 
      analyticsPlugins: [analyticsPlugin]
    );

    // Once Plugins are added, configure Amplify
    await amplifyInstance.configure(amplifyconfig);
    try {
      setState(() {
        _amplifyConfigured = true;
      });
    } catch (e) {
      print(e);
    }

  }

  // customize the rest of your Widget below as you wish...

```

`addPlugin` へのすべての呼び出しは `amplify.configure` が呼ばれる前に行われることに注意してください。

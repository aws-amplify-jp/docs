このチュートリアルでは、 **Analytics** の基本機能を統合します。

まず、アプリの *main.dart* ファイルの内容を削除し、このスターターボイラープレート UI コードに貼り付けます。

```dart
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter/material.dart';
import 'package:amplify_core/amplify_core.dart';
import 'package:amplify_analytics_pinpoint/amplify_analytics_pinpoint.dart';
import 'amplifyconfiguration.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _amplifyConfigured = false;

  // Instantiate Amplify
  Amplify amplifyInstance = Amplify();

  @override
  void initState() {
    super.initState();
    _configureAmplify(); 
  }

  void _configureAmplify() async {
  }

  void _recordEvent() async {
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('Amplify Core example app'),
          ),
          body: ListView(padding: EdgeInsets.all(10.0), children: <Widget>[
            Center( 
              child: Column (
                children: [
                  const Padding(padding: EdgeInsets.all(5.0)),
                  Text(
                    _amplifyConfigured ? "configured" : "not configured"
                  ),                  
                  RaisedButton(
                    onPressed: _amplifyConfigured ? _recordEvent : null,
                    child: const Text('record event')
                  )
                ]
              ),
            )
          ])
      )
    );
  }
}
```


## Amplifyフラッタライブラリの初期化
Amplify Flutter Libraryのメソッドを使用する前に、必要なすべてのプラグインを追加し、configure を呼び出すことが重要です。 これらの init メソッドは、フラッターアプリのルートレベルで一度だけ呼び出される必要があります。

*_configureAmplify* メソッドに以下を追加します。

```dart
void _configureAmplify() async {
  if (!mounted) return;

  // Add Pinpoint and Cognito Plugins
  AmplifyAnalyticsPinpoint analyticsPlugin = AmplifyAnalyticsPinpoint();
  AmplifyAuthCognito authPlugin = AmplifyAuthCognito();
  amplifyInstance.addPlugin(authPlugins: [authPlugin]);
  amplifyInstance.addPlugin(analyticsPlugins: [analyticsPlugin]);

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
```

`addPlugin` へのすべての呼び出しは `amplify.configure` が呼ばれる前に行われることに注意してください。

`amplify.configure` は一度だけ呼び出すべきです。複数回呼び出すとエラーが発生します。

## Analytics で簡単なイベントを記録する

モジュールが初期化されたので、 *_recordEvent* メソッドを変更して Amazon Pinpoint にイベントを送信します。

```dart
// Send an event to Pinpoint
void _recordEvent() async {
  AnalyticsEvent event = AnalyticsEvent("test");
  event.properties.addBoolProperty("boolKey", true);
  event.properties.addDoubleProperty("doubleKey", 10.0);
  event.properties.addIntProperty("intKey", 10);
  event.properties.addStringProperty("stringKey", "stringValue");
  Amplify.Analytics.recordEvent(event: event);
}
```

この時点で、ほぼアプリを実行する準備ができています。 次のセクションでは、Amplify CLI を使用してバックエンドの AWS リソースを設定します。
To initialize the Amplify DataStore, use the `Amplify.addPlugin()` method to add the AWS DataStore Plugin. We also need to import the codegen dart file `ModelProvider.dart`

```dart
import 'codegen/ModelProvider.dart';

// Add this in your app initialization
AmplifyDataStore datastorePlugin =
    AmplifyDataStore(modelProvider: ModelProvider.instance);
anplyInstance.addPlugin(dataStorePlugins: [datastorePlugin]);
```

次に、 `configure()` を呼び出してAmplifyフレームワークの設定を完了します。

コードは次のようになります。

```dart
import 'package:amplify_core/amplify_core.dart';
import 'package:amplify_datastore/amplify_datastore.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

import 'amplifyconfiguration.dart';
import 'codegen/ModelProvider.dart';

class MyAmplifyApp extends StatefulWidget {

    Amplify amplifyInstance = Amplify();

    @override
    void initState() {
        super.initState(); 

        AmplifyDataStore datastorePlugin =
            AmplifyDataStore(modelProvider: ModelProvider.instance);

        amplifyInstance.addPlugin(dataStorePlugins: [datastorePlugin]);

        amplifyInstance.configure(amplifyConfig); 
    }
}
```

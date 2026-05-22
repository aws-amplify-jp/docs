---
title: "Amplify Analytics のセットアップ"
section: "build-a-backend/add-aws-services/analytics"
platforms: ["javascript", "react-native", "swift", "android", "flutter", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/analytics/set-up-analytics/"
---

Amplify を使用すると、アプリのアナリティクスデータを収集できます。Analytics を使用するには、AWS Cloud Development Kit (AWS CDK) を使用して [Amazon Kinesis](https://aws.amazon.com/kinesis/) または [Amazon Pinpoint](https://aws.amazon.com/pinpoint/) を有効にする必要があります。Analytics カテゴリは [Amazon Cognito ID プール](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html)を使用してアプリのユーザーを_識別_します。Cognito により、アプリの認証済みユーザーと未認証ユーザーからデータを受け取ることができます。

<!-- Platform: swift -->
## 前提条件

Amplify ライブラリが統合されたアプリケーションと、以下のいずれかの最小ターゲット:
- **iOS 13.0** (使用: **Xcode 14.1** 以降)
- **macOS 10.15** (使用: **Xcode 14.1** 以降)
- **tvOS 13.0** (使用: **Xcode 14.3** 以降)
- **watchOS 9.0** (使用: **Xcode 14.3** 以降)
- **visionOS 1.0** (使用: **Xcode 15** 以降) (プレビューサポート - 詳細は以下を参照)

<Callout>

visionOS サポートは現在**プレビュー**中であり、最新の [Amplify リリース](https://github.com/aws-amplify/amplify-swift/releases)を使用することで利用できます。
新しい Xcode および visionOS バージョンがリリースされると、必要に応じて、ベストエフォート方式でサポートが更新されます。

</Callout>
<!-- /Platform -->

<!-- Platform: android -->
## 前提条件

* Android API レベル 24 (Android 7.0) 以上をターゲットとする Android アプリケーション
<!-- /Platform -->

<!-- Platform: flutter -->
Amplify Flutter には、iOS (13.0)、Android (API レベル 24)、および macOS (10.15) の最小ターゲットプラットフォームが必要です。Web、Windows、または Linux をターゲットとする場合は、[Flutter のサポートされている展開プラットフォーム](https://docs.flutter.dev/reference/supported-platforms)を参照してください。
<!-- /Platform -->
## Analytics バックエンドのセットアップ

[AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) を使用して、[Amazon Pinpoint](https://aws.amazon.com/pinpoint/) を搭載するアナリティクスリソースを作成します。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend"
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnApp } from "aws-cdk-lib/aws-pinpoint";
import { Stack } from "aws-cdk-lib/core";

const backend = defineBackend({
  auth,
  data,
  // additional resources
});

const analyticsStack = backend.createStack("analytics-stack");

// create a Pinpoint app
const pinpoint = new CfnApp(analyticsStack, "Pinpoint", {
  name: "myPinpointApp",
});

// create an IAM policy to allow interacting with Pinpoint
const pinpointPolicy = new Policy(analyticsStack, "PinpointPolicy", {
  policyName: "PinpointPolicy",
  statements: [
    new PolicyStatement({
      actions: ["mobiletargeting:UpdateEndpoint", "mobiletargeting:PutEvents"],
      resources: [pinpoint.attrArn + "/*"],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);

// patch the custom Pinpoint resource to the expected output configuration
backend.addOutput({
  analytics: {
    amazon_pinpoint: {
      app_id: pinpoint.ref,
      aws_region: Stack.of(pinpoint).region,
    }
  },
});
```

## Amplify ライブラリのインストール

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
まず、`aws-amplify` ライブラリをインストールします:

```sh title="Terminal" showLineNumbers={false}
npm add aws-amplify
```
<!-- /Platform -->

<!-- Platform: swift -->
1. アプリケーションに Amplify ライブラリをインストールするには、Xcode でプロジェクトを開き、**File > Add Packages...** を選択します。

2. **Amplify Library for Swift** GitHub リポジトリ URL (`https://github.com/aws-amplify/amplify-swift`) を検索バーに入力し、**Add Package** をクリックします。

  <Callout>

  **注:** **Dependency Rule** ドロップダウンから **Up to Next Major Version** を選択する必要があります。

  </Callout>
3. 最後に、**AWSPinpointAnalyticsPlugin**、**AWSCognitoAuthPlugin**、および **Amplify** をターゲットに追加します。その後、**Add Package** をクリックします。
<!-- /Platform -->

<!-- Platform: android -->
**Gradle Scripts** を展開し、**build.gradle.kts (Module :app)** を開きます。クイックスタートガイドの手順に従うことで、既に Amplify を設定しています。

これらのライブラリを依存関係ブロックに追加して、Analytics を追加します:
```kotlin title="app/build.gradle.kts"
android {
    compileOptions {
        // Support for modern Java features
        isCoreLibraryDesugaringEnabled = true
    }
}

dependencies {
    // Amplify API dependencies
    // highlight-start
    implementation("com.amplifyframework:aws-analytics-pinpoint:ANDROID_VERSION")
    implementation("com.amplifyframework:aws-auth-cognito:ANDROID_VERSION")    
    // highlight-end
    // ... other dependencies
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:ANDROID_DESUGAR_VERSION")
}
```

**Sync Now** をクリックします。
<!-- /Platform -->

<!-- Platform: flutter -->
Flutter プロジェクトディレクトリで、**pubspec.yaml** を開きます。
これらのライブラリを依存関係ブロックに追加して、Analytics を追加します:

```yaml
dependencies:
  amplify_analytics_pinpoint: ^2.0.0
  amplify_auth_cognito: ^2.0.0
  amplify_flutter: ^2.0.0
```
<!-- /Platform -->

## Amplify Analytics の初期化

設定ファイルをインポートしてアプリに読み込みます。Amplify 設定ステップをアプリのルートエントリポイントに追加することをお勧めします。

<!-- Platform: javascript, angular, react, vue, react-native -->
```js title="src/index.js"
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```
<!-- /Platform -->

<!-- Platform: nextjs -->
```js title="pages/_app.tsx"
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);
```
<!-- /Platform -->

<InlineFilter filters= {["swift"]}>
> **Warning:** 次のコマンドを実行して `amplify_outputs.json` ファイルが生成されていることを確認してください:
> 
> ```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```
> 
> 次に、ファイルをプロジェクトに移動します。これは、ファイルを Xcode プロジェクトにドラッグアンドドロップすることで実行できます。

アプリで Amplify Analytics と Authentication カテゴリを使用するには、`Amplify.add(plugin:)` および `Amplify.configure(with:)` メソッドを呼び出して、対応するプラグインを作成して設定する必要があります。

#### [SwiftUI]

メイン `App` ファイルの先頭に以下のインポートを追加します:

```swift
import Amplify
import AWSCognitoAuthPlugin
import AWSPinpointAnalyticsPlugin
```

初期化子に次のコードを追加します。ない場合は、デフォルトの `init` を作成できます:

```swift
init() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSPinpointAnalyticsPlugin())
        try Amplify.configure(with: .amplifyOutputs)
        print("Amplify configured with Auth and Analytics plugins")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }
}
```

#### [UIKit]

`AppDelegate.swift` ファイルの先頭に以下のインポートを追加します:

```swift
import Amplify
import AWSCognitoAuthPlugin
import AWSPinpointAnalyticsPlugin
```

`application:didFinishLaunchingWithOptions` メソッドに次のコードを追加します:

```swift
func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSPinpointAnalyticsPlugin())
        try Amplify.configure(with: .amplifyOutputs)
        print("Amplify configured with Auth and Analytics plugins")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }

    return true
}
```

このアプリケーションをビルドして実行すると、コンソール ウィンドウに以下が表示されます:

```console
Amplify configured with Auth and Analytics plugin
```
</InlineFilter>

<!-- Platform: flutter -->
**Project Setup** セクションで説明されているように、Auth および Analytics プラグインと、追加した他のプラグインを追加します:

```dart
import 'package:amplify_analytics_pinpoint/amplify_analytics_pinpoint.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> _configureAmplify() async {
  // Add Pinpoint and Cognito Plugins, and any other plugins you want to use
  final analyticsPlugin = AmplifyAnalyticsPinpoint();
  final authPlugin = AmplifyAuthCognito();
  await Amplify.addPlugins([analyticsPlugin, authPlugin]);
}
```

<Callout>

macOS でアプリを実行する場合、[プロジェクトセットアップガイド](/gen1/[platform]/start/project-setup/platform-setup/#enable-keychain)で説明されているように、Xcode でキーチェーン共有を有効にする必要があります。

</Callout>

プロジェクトセットアップで生成された amplify_outputs.dart ファイルが含まれ、Amplify.configure に送信されていることを確認してください:

```dart
import 'package:amplify_analytics_pinpoint/amplify_analytics_pinpoint.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> _configureAmplify() async {
  // ...
  await Amplify.addPlugins([analyticsPlugin, authPlugin]);

  // Once Plugins are added, configure Amplify
  // Note: Amplify can only be configured once.
  try {
    await Amplify.configure(amplifyConfig);
  } on AmplifyAlreadyConfiguredException {
    safePrint(
      'Tried to reconfigure Amplify; this can occur when your app restarts on Android.',
    );
  }
}
```

クラスは次のようになります:

```dart
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_analytics_pinpoint/amplify_analytics_pinpoint.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> _configureAmplify() async {
  // Add any Amplify plugins you want to use
  final analyticsPlugin = AmplifyAnalyticsPinpoint();
  final authPlugin = AmplifyAuthCognito();
  await Amplify.addPlugins([analyticsPlugin, authPlugin]);

  // Once Plugins are added, configure Amplify
  // Note: Amplify can only be configured once.
  try {
    await Amplify.configure(amplifyConfig);
  } on AmplifyAlreadyConfiguredException {
    safePrint(
      'Tried to reconfigure Amplify; this can occur when your app restarts on Android.',
    );
  }
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await _configureAmplify();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}): super(key: key);

  // ...
}
```
<!-- /Platform -->

<!-- Platform: android -->
Amplify Auth および Analytics カテゴリを初期化するには、各カテゴリに対して `Amplify.addPlugin()` メソッドを呼び出します。初期化を完了するには、`Amplify.configure()` を呼び出します。

アプリケーションクラスの `onCreate()` メソッドに次のコードを追加します:

> **Warning:** `Amplify.configure` 関数を呼び出す前に、必ずコンソールから `amplify_outputs.json` ファイルをダウンロードするか、次のコマンドで生成してください:
> 
> ```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main --out-dir app/src/main/res/raw
```
> 
> 次に、生成またはダウンロードしたファイルが Android プロジェクトのアプリケーション用の適切なリソースディレクトリ (例: `app/src/main/res/raw`) にあることを確認してください。そうしないと、アプリケーションをコンパイルできません。

#### [Java]

```java
import android.util.Log;
import com.amplifyframework.AmplifyException;
import com.amplifyframework.analytics.pinpoint.AWSPinpointAnalyticsPlugin;
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin;
import com.amplifyframework.core.Amplify;
import com.amplifyframework.core.configuration.AmplifyOutputs;

```

```java
Amplify.addPlugin(new AWSCognitoAuthPlugin());
Amplify.addPlugin(new AWSPinpointAnalyticsPlugin());
```

クラスは次のようになります:

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPinpointAnalyticsPlugin plugins
            Amplify.addPlugin(new AWSCognitoAuthPlugin());
            Amplify.addPlugin(new AWSPinpointAnalyticsPlugin());
            Amplify.configure(AmplifyOutputs.fromResource(R.raw.amplify_outputs), getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

#### [Kotlin]

```kotlin
import android.util.Log
import com.amplifyframework.AmplifyException
import com.amplifyframework.analytics.pinpoint.AWSPinpointAnalyticsPlugin
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.core.configuration.AmplifyOutputs
```

```kotlin
Amplify.addPlugin(AWSCognitoAuthPlugin())
Amplify.addPlugin(AWSPinpointAnalyticsPlugin())
```

クラスは次のようになります:

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPinpointAnalyticsPlugin plugins
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.addPlugin(AWSPinpointAnalyticsPlugin())
            Amplify.configure(AmplifyOutputs.fromResource(R.raw.amplify_outputs), applicationContext)

            Log.i("MyAmplifyApp", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
        }
    }
}
```

#### [RxJava]

```java
import android.util.Log;
import com.amplifyframework.AmplifyException;
import com.amplifyframework.analytics.pinpoint.AWSPinpointAnalyticsPlugin;
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin;
import com.amplifyframework.core.configuration.AmplifyOutputs;
import com.amplifyframework.rx.RxAmplify;
```

```java
RxAmplify.addPlugin(new AWSCognitoAuthPlugin());
RxAmplify.addPlugin(new AWSPinpointAnalyticsPlugin());
```

クラスは次のようになります:

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSCognitoAuthPlugin and AWSPinpointAnalyticsPlugin plugins
            RxAmplify.addPlugin(new AWSCognitoAuthPlugin());
            RxAmplify.addPlugin(new AWSPinpointAnalyticsPlugin());
            RxAmplify.configure(AmplifyOutputs.fromResource(R.raw.amplify_outputs), getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error);
        }
    }
}
```

<!-- /Platform -->

次のステップ:

おめでとうございます! これで Analytics バックエンドがプロビジョニングされ、Analytics ライブラリがインストールされました。次のリンクをチェックして、Amplify Analytics のユースケースを確認してください:

- [イベントの記録](/[platform]/frontend/analytics/record-events/)
- [セッションの追跡](/[platform]/frontend/analytics/auto-track-sessions/)
- [ユーザーの識別](/[platform]/frontend/analytics/identify-user/)

### リファレンス

[Amazon Pinpoint Construct ライブラリ](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_pinpoint-readme.html)

<!-- Platform: react-native -->
## 既知の問題

Amazon Kinesis (`aws-amplify/analytics/kinesis`)、Amazon Kinesis Data Firehose (`aws-amplify/analytics/kinesis-firehose`)、Personalize Event (`aws-amplify/analytics/personalize`) を使用する場合、バンドラーを起動するときに次のエラーが発生する可能性があります:

> Error: Unable to resolve module stream from /path/to/node_modules/@aws-sdk/... これは [既知の問題](https://github.com/aws/aws-sdk-js-v3/issues/4877)です。この問題を解決するには、[そこで](https://github.com/aws/aws-sdk-js-v3/issues/4877#issuecomment-1656007484)概説されている手順に従ってください。
<!-- /Platform -->

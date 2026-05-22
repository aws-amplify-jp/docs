---
title: "Amplify Auth のセットアップ"
section: "build-a-backend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-12-03T11:13:25.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/"
---

Amplify Auth は [Amazon Cognito](https://aws.amazon.com/cognito/) により提供されています。Cognito は、ユーザー登録、認証、アカウント復旧、その他の操作を処理する堅牢なユーザーディレクトリサービスです。[概念を確認してさらに学ぶ](/[platform]/build-a-backend/auth/concepts/)。

認証リソースの定義を開始するには、認証リソースファイルを開くか作成します：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})
```

デフォルトでは、認証リソースは `email` をデフォルトのログインメカニズムとしてスキャフォルドされます。認証リソースを設定して以下でのサインインを許可することもできます：

- 電話番号
- 外部プロバイダー（Google、Facebook、Amazon、または Sign in with Apple）
<!-- Platform: android, angular, javascript, nextjs, react, react-native, swift, vue -->
- [パスワードレス認証](/[platform]/build-a-backend/auth/concepts/passwordless/)（メール OTP、SMS OTP、または WebAuthn パスキー）
<!-- /Platform -->

> **Info:** **注記：** 最低限、ユーザーがアプリにサインインする方法を設定するために `loginWith` 値を渡す必要があります。値を指定しない場合は、メールとパスワードでのサインインがデフォルトで設定されます。

<!-- Platform: android, angular, javascript, nextjs, react, react-native, swift, vue -->
## パスワードレス認証を有効化

パスワードレス認証方法を有効にして、より安全でユーザーフレンドリーなエクスペリエンスを提供できます：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true // Enable email-based one-time passwords
    }
  }
});
```

[パスワードレス認証オプションについてさらに学ぶ](/[platform]/build-a-backend/auth/concepts/passwordless/)。
<!-- /Platform -->

## 認証リソースをデプロイ

認証リソースを選択して定義した後、以下のコマンドを実行して、個人用クラウドサンドボックスにリソースを作成します。

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```
<!-- /Platform -->
<!-- Platform: flutter -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-format dart --outputs-out-dir lib
```
<!-- /Platform -->
<!-- Platform: android -->
> **Warning:** `app/src/main/res` ディレクトリにまだ "raw" フォルダが存在しない場合は、必ず追加してください。

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-out-dir <path_to_app/src/main/res/raw>
```
<!-- /Platform -->
<!-- Platform: swift -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox
```
<!-- /Platform -->

デプロイが成功した後、このコマンドは出力ファイル（`amplify_outputs.json`）も生成します。これにより、フロントエンドアプリがバックエンドリソースに接続できるようになります。バックエンド認証リソースで設定する値は、生成された出力ファイルに設定され、フロントエンドの [`Authenticator 接続コンポーネント`](https://ui.docs.amplify.aws/react/connected-components/authenticator) が自動的に設定されます。

## アプリケーションコードを認証リソースに接続

サインインフローを作成して正しく実装することは、複雑で時間がかかることがあります。Amplify の Authenticator UI コンポーネントはこれを簡素化し、アプリ全体の認証フローを迅速に構築できるようにします。コンポーネントは `amplify/auth/resource.ts` の設定とシームレスに連携して、バックエンドリソースに自動的に接続します。

Amplify には React、Vue、Angular、React Native、Swift、Android、Flutter 向けの事前構築 UI コンポーネントがあります。このガイドでは、Web アプリケーション向けのコンポーネントに焦点を当てています。

<!-- Platform: javascript, react -->
まず、`@aws-amplify/ui-react` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-amplify/ui-react
```

次に、**pages/\_app.tsx** を開いて `Authenticator` コンポーネントを追加します。

```ts title="pages/_app.tsx"
import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <Component {...pageProps} />
        </main>
      )}
    </Authenticator>
  );
};
```
<!-- /Platform -->
<!-- Platform: vue -->

#### [Vue 3]

まず、`@aws-amplify/ui-vue` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-amplify/ui-vue
```

次に、**src/App.vue** を開いて `Authenticator` コンポーネントを追加します。

**Authenticator**

`Authenticator` コンポーネントは、アプリに認証フローを追加するシンプルな方法を提供します。このコンポーネントは、選択したフレームワークで認証ワークフローをカプセル化し、バックエンド Auth リソースによって支えられています。`Authenticator` は `user` 情報と `signOut` 関数を内部テンプレートに渡します。

```html
<script setup>
  import { Authenticator } from "@aws-amplify/ui-vue";
  import "@aws-amplify/ui-vue/styles.css";

  import { Amplify } from 'aws-amplify';
  import outputs from '../amplify_outputs.json';

  Amplify.configure(outputs);
</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
      <button @click="signOut">Sign Out</button>
    </template>
  </authenticator>
</template>
```

#### [Vue 2]

まず、`@aws-amplify/ui-components` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-amplify/ui-components
```

次に **src/main.ts** を開いて、最後のインポートの下に以下を追加します：

```js title="src/main.ts"
import '@aws-amplify/ui-components';
import {
  applyPolyfills,
  defineCustomElements
} from '@aws-amplify/ui-components/loader';
import Vue from 'vue';

Vue.config.ignoredElements = [/amplify-\w*/];

applyPolyfills().then(() => {
  defineCustomElements(window);
});
```

次に、**src/App.ts** を開いて `amplify-authenticator` コンポーネントを追加します。

**amplify-authenticator**

`amplify-authenticator` コンポーネントは、アプリに認証フローを追加するシンプルな方法を提供します。このコンポーネントは、選択したフレームワークで認証ワークフローをカプセル化し、バックエンド Auth リソースによって支えられています。オプションの `amplify-sign-out` コンポーネントは、サインアウトボタンをレンダリングしたい場合に利用できます。

```html title="src/App.ts"
<template>
  <amplify-authenticator>
    <div>
      My App
      <amplify-sign-out></amplify-sign-out>
    </div>
  </amplify-authenticator>
</template>
```

<!-- /Platform -->
<!-- Platform: angular -->
まず、`@aws-amplify/ui-angular` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
npm add @aws-amplify/ui-angular
```

次に **app.module.ts** を開いて、Amplify インポートと設定を追加します：

```js title="app.module.ts"
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppComponent } from './app.component';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AmplifyAuthenticatorModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

次に、**styles.css** にデフォルトテーマをインポートします：

```css title="styles.css"
@import '~@aws-amplify/ui-angular/theme.css';
```

次に、**app.component.html** を開いて `amplify-authenticator` コンポーネントを追加します。

**amplify-authenticator**

`Authenticator` コンポーネントは、アプリに認証フローを追加するシンプルな方法を提供します。このコンポーネントは、選択したフレームワークで認証ワークフローをカプセル化し、バックエンド Auth リソースによって支えられています。`Authenticator` は `user` 情報と `signOut` 関数を内部テンプレートに渡します。

`amplify-authenticator` コンポーネントは、アプリに認証フローを追加するシンプルな方法を提供します。このコンポーネントは、選択したフレームワークで認証ワークフローをカプセル化し、バックエンド Auth リソースによって支えられています。`amplify-authenticator` は `user` 情報と `signOut` 関数を内部テンプレートに渡します。

```html title="app.component.html"
<amplify-authenticator>
  <ng-template
    amplifySlot="authenticated"
    let-user="user"
    let-signOut="signOut"
  >
    <h1>Welcome {{ user.username }}!</h1>
    <button (click)="signOut()">Sign Out</button>
  </ng-template>
</amplify-authenticator>
```
<!-- /Platform -->
<!-- Platform: react-native -->
まず、`@aws-amplify/ui-react-native` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
npm add \
  @aws-amplify/react-native \
  @aws-amplify/ui-react-native \
  aws-amplify \
  @react-native-community/netinfo \
  @react-native-async-storage/async-storage \
  react-native-safe-area-context@^4.2.5 \
  react-native-get-random-values
```

> **Info:** プロジェクトが `React Native Authenticator` を使用したフェデレーションサインインをサポートする場合、`@aws-amplify/rtn-web-browser` パッケージも必要です：
> 
> ```bash title="Terminal" showLineNumbers={false}
npm add @aws-amplify/rtn-web-browser
```

次に、以下を実行して iOS cocoapods をインストールします：

```bash title="Terminal" showLineNumbers={false}
npx pod-install
```

> **Warning:** Expo からネイティブライブラリとプラットフォーム依存関係を呼び出すには、関連プラットフォーム用のフォルダを生成するための prebuild コマンドを実行する必要があります。
> 
> ```bash title="Terminal" showLineNumbers={false}
npx expo prebuild
```
次に、認証フローをセットアップするために `App.tsx` ファイルを以下で更新します：

```typescript
import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default App;
```
<!-- /Platform -->
<!-- Platform: flutter -->
まず、`amplify_authenticator` ライブラリをインストールします：

```bash title="Terminal" showLineNumbers={false}
flutter pub add amplify_flutter
flutter pub add amplify_auth_cognito
flutter pub add amplify_authenticator
```

または `pubspec.yaml` ファイルを以下で更新します：

```yaml
dependencies:
  amplify_flutter: ^2.0.0
  amplify_auth_cognito: ^2.0.0
  amplify_authenticator: ^2.0.0
```

そして以下のコマンドを実行してライブラリをダウンロードします。

```bash title="Terminal" showLineNumbers={false}
flutter pub get
```

次に、`main.dart` ファイルを以下で更新します：

```dart
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';

import 'amplify_outputs.dart';

Future<void> main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    await _configureAmplify();
    runApp(const MyApp());
  } on AmplifyException catch (e) {
    runApp(Text("Error configuring Amplify: ${e.message}"));
  }
}

// highlight-start
Future<void> _configureAmplify() async {
  try {
    await Amplify.addPlugin(AmplifyAuthCognito());
    await Amplify.configure(amplifyConfig);
    safePrint('Successfully configured');
  } on Exception catch (e) {
    safePrint('Error configuring Amplify: $e');
  }
}
// highlight-end

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    // highlight-next-line
    return Authenticator(
      child: MaterialApp(
        // highlight-next-line
        builder: Authenticator.builder(),
        home: const Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // highlight-next-line
                SignOutButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```
<!-- /Platform -->
<!-- Platform: android -->
> **Warning:** compileSdk バージョンが 34 以上であることを確認してください。

Authenticator コンポーネントは [Jetpack Compose](https://developer.android.com/jetpack/compose) を使用して構築されています。アプリの `build.gradle` ファイルの android セクションに以下を追加することで Jetpack Compose を有効にします：

```kotlin title="app/build.gradle.kts" showLineNumbers={false}
compileOptions {
    // Support for modern Java features
    isCoreLibraryDesugaringEnabled = true
}
buildFeatures {
    compose = true
}
composeOptions {
  kotlinCompilerExtensionVersion = "1.2.0"
}
dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:ANDROID_DESUGAR_VERSION")
}
```

以下の依存関係をアプリの `build.gradle.kts` ファイルに追加して、プロンプトが表示されたら「Sync Now」をクリックします：

```kotlin title="app/build.gradle.kts" 
dependencies {
    implementation("com.amplifyframework.ui:authenticator:ANDROID_AUTHENTICATOR_VERSION")
}
```

> **Warning:** `Amplify.configure` 関数を呼び出す前に、コンソールから `amplify_outputs.json` ファイルをダウンロードするか、以下のコマンドで生成してください：
> 
> ```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main --out-dir app/src/main/res/raw
```
> 
> 次に、生成またはダウンロードしたファイルが Android プロジェクトの適切なリソースディレクトリ（例えば `app/src/main/res/raw`）にあることを確認します。そうしないと、アプリケーションがコンパイルできなくなります。

```kotlin title="MyAmplifyApp.kt"
import android.app.Application
import android.util.Log
import com.amplifyframework.AmplifyException
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.core.configuration.AmplifyOutputs

class MyAmplifyApp: Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // highlight-next-line
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(AmplifyOutputs(R.raw.amplify_outputs), applicationContext)
            Log.i("MyAmplifyApp", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify", error)
        }
    }
}
```

最後に、MainActivity.kt ファイルを更新して Amplify UI コンポーネントを使用します：

```kotlin
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.amplifyframework.core.Amplify
import com.amplifyframework.ui.authenticator.ui.Authenticator
// highlight-next-line
import <your-package-name>.ui.theme.MyAmplifyAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAmplifyAppTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // highlight-next-line
                    Authenticator { state ->
                        Column {
                            Text(
                                text = "Hello ${state.user.username}!",
                            )
                            Button(onClick = {
                                // highlight-next-line
                                Amplify.Auth.signOut {  }
                            }) {
                                Text(text = "Sign Out")
                            }
                        }
                    }
                }
            }
        }
    }
}
```
<!-- /Platform -->
<!-- Platform: swift -->
### 前提条件

Amplify ライブラリが統合されたアプリケーションと、以下のいずれかの最小ターゲット：

- **iOS 13.0**（**Xcode 14.1** 以上を使用）
- **macOS 10.15**（**Xcode 14.1** 以上を使用）
- **tvOS 13.0**（**Xcode 14.3** 以上を使用）
- **watchOS 9.0**（**Xcode 14.3** 以上を使用）
- **visionOS 1.0**（**Xcode 15** 以上を使用）（プレビューサポート - 詳細は以下を参照）

<Callout>

visionOS サポートは現在 **プレビュー** 段階で、最新の [Amplify Release](https://github.com/aws-amplify/amplify-swift/releases) を使用することで利用できます。
新しい Xcode および visionOS バージョンがリリースされると、必要に応じた修正がベストエフォート ベースで更新されます。

</Callout>
<Callout>

**注記：** macOS プロジェクトで Amplify Auth を使用するには、キーチェーン共有機能を有効にする必要があります。Xcode で **アプリケーションターゲット** > **署名と機能** > **+ 機能** に移動して、**キーチェーン共有** を選択します。

この機能は、Auth がプラットフォームのベストプラクティスとして macOS 上のデータ保護キーチェーンを使用するため必須です。macOS でのキーチェーンの動作とキーチェーン共有エンタイトルメントの詳細は、[TN3137: macOS キーチェーン API と実装](https://developer.apple.com/documentation/technotes/tn3137-on-mac-keychains) を参照してください。

アプリケーションに機能を追加する詳細については、[Xcode 機能](https://developer.apple.com/documentation/xcode/capabilities) を参照してください。

</Callout>

生成されたファイルをプロジェクトに移動します。ファイルをプロジェクトにドラッグ＆ドロップして行うことができます。

![ユーザーが生成されたファイルを Xcode にドラッグ＆ドロップすると、ダイアログが表示されます。ターゲット、追加されたフォルダ、宛先オプションが表示されます。デフォルト設定はドラッグ＆ドロップで十分です。](/images/lib/getting-started/ios/set-up-swift-8.png)

Xcode でプロジェクトを開き、ファイル > パッケージを追加 を選択して、以下の依存関係を追加します：

- Amplify Library for Swift：GitHub URL（https://github.com/aws-amplify/amplify-swift）を入力して、**Up to Next Major Version** を選択して **Add Package** をクリック

  - 以下のライブラリを選択します：
    - Amplify
    - AWSCognitoAuthPlugin

- Amplify UI Swift - Authenticator：GitHub URL（https://github.com/aws-amplify/amplify-ui-swift-authenticator）を入力して、**Up to Next Major Version** を選択して **Add Package** をクリック

  - 以下のライブラリを選択します：
    - Authenticator

次に、`MyAmplifyAppApp.swift` ファイルの `init` 部分を以下のコードで更新します：

```swift title="MyAmplifyApp.swift"
import Amplify
import Authenticator
import AWSCognitoAuthPlugin
import SwiftUI

@main
struct MyApp: App {
    init() {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure(with: .amplifyOutputs)
        } catch {
            print("Unable to configure Amplify \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            Authenticator { state in
                VStack {
                    Text("Hello, \(state.user.username)")
                    Button("Sign out") {
                        Task {
                            await state.signOut()
                        }
                    }
                }
            }
        }
    }
}
```
<!-- /Platform -->

Authenticator コンポーネントをアプリに追加したら、サインアップ、サインイン、サインアウト機能をテストできます。また [Authenticator 接続コンポーネントをカスタマイズ](https://ui.docs.amplify.aws/react/connected-components/authenticator/customization) して、必要に応じて色とスタイルを調整することもできます。

## 次のステップ

Amplify アプリでメールとパスワードを使用した認証のセットアップが完了しました。さらに機能を追加したい場合は、以下について学ぶことをお勧めします：

- [認証概念についてさらに学ぶ](/[platform]/本番環境への移行/)
- [本番環境への移行](/[platform]/build-a-backend/auth/moving-to-production/)

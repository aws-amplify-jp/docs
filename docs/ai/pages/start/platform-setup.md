---
title: "プラットフォーム設定"
section: "start"
platforms: ["flutter"]
gen: 2
last-updated: "2025-12-29T21:54:06.000Z"
url: "https://docs.amplify.aws/react/start/platform-setup/"
---

## iOS

iOSをターゲットにする場合、Amplifyには最小デプロイメントターゲット13.0以上およびXcode 15.0以上が必要です。以下の手順に従って、最小デプロイメントターゲットを更新してください。

`ios/Podfile`を開き、ターゲットiOSプラットフォームを13.0以上に更新します。

> **Info:** `ios/Podfile`が存在しない場合は、`pubspec.yaml`に`amplify_flutter`を追加して`pub get`を実行してください。これでファイルが自動的に作成されます。

```diff title="ios/Podfile"
- # Uncomment this line to define a global platform for your project
- # platform :ios, '12.0'
+ platform :ios, '13.0'
```

Xcodeでプロジェクトを開き、Runner、Targets -> Runnerの順に選択し、「General」タブをクリックします。「Minimum Deployments」セクションで、iOSバージョンを13.0以上に更新します。

![ランナー一般ウィンドウの最小デプロイメントセクションでiOSバージョンを13.0以上に設定](/images/project-setup/flutter/ios/target-min-deployment-version.png)

Runner、Project -> Runnerの順に選択し、「Build Settings」タブをクリックします。「iOS Deployment Target」を13.0以上に更新します。

![ランナー情報ウィンドウのデプロイメントターゲットセクションでiOSバージョンを13.0以上に設定](/images/project-setup/flutter/ios/project-min-deployment-version.png)

## Android

Amplify FlutterはAPIレベル24以上（Android 7.0以上）をサポートしており、Androidをターゲットにする場合、Gradle 8以上、Kotlin 1.9以上、Java 17以上が必要です。以下の手順に従って、アプリケーションでこれらの変更を適用してください。

> **Warning:** 以下の手順は、Flutter 3.16以降で作成されたFlutterアプリを対象としています。アプリがバージョン3.16より前に作成された場合は、以下の手順に従う前に[こちらのガイド](https://docs.flutter.dev/release/breaking-changes/flutter-gradle-plugin-apply)に従ってGradleの宣言的プラグインブロックに移行してください。

#### [Gradle Kotlin]
1. `android/settings.gradle.kts`を開き、Android GradleプラグインとKotlinのバージョンを更新します：

```diff title="android/settings.gradle.kts"
plugins {
    id("dev.flutter.flutter-plugin-loader") version "1.0.0"
-   id("com.android.application") version "8.7.0" apply false
-   id("org.jetbrains.kotlin.android") version "1.8.22" apply false
+   id("com.android.application") version "8.12.1" apply false
+   id("org.jetbrains.kotlin.android") version "2.2.0" apply false
}
```

2. `android/gradle/wrapper/gradle-wrapper.properties`を開き、Gradle `distributionUrl`を更新します。

```diff title="android/gradle/wrapper/gradle-wrapper.properties"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
-distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-all.zip
+distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-all.zip
```

3. `android/app/build.gradle.kts`を開き、Javaバージョンと最小AndroidSDKバージョンを更新します。

```diff title="android/app/build.gradle.kts"
android {
    namespace = "com.example.myapp"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion
    compileOptions {
-       sourceCompatibility = JavaVersion.VERSION_1_8
-       targetCompatibility = JavaVersion.VERSION_1_8
+       sourceCompatibility = JavaVersion.VERSION_17
+       targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
-       jvmTarget = JavaVersion.VERSION_11.toString()
+       jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.myapp"
        // You can update the following values to match your application needs.
        // For more information, see: https://docs.flutter.dev/deployment/android#reviewing-the-gradle-build-configuration.
-       minSdk = flutter.minSdkVersion
+       minSdk = 24
        targetSdk = flutter.targetSdkVersion
        versionCode = flutterVersionCode.toInteger()
        versionName = flutterVersionName
    }
    
    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.debug
        }
    }
}
```

#### [Gradle Groovy]
1. `android/settings.gradle`を開き、Android GradleプラグインとKotlinのバージョンを更新します：

```diff title="android/settings.gradle"
plugins {
    id "dev.flutter.flutter-plugin-loader" version "1.0.0"
-   id "com.android.application" version "7.3.0" apply false
-   id "org.jetbrains.kotlin.android" version "1.7.10" apply false
+   id "com.android.application" version "8.12.1" apply false
+   id "org.jetbrains.kotlin.android" version "2.2.0" apply false
}
```

2. `android/gradle/wrapper/gradle-wrapper.properties`を開き、Gradle `distributionUrl`を更新します。

```diff title="android/gradle/wrapper/gradle-wrapper.properties"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
-distributionUrl=https\://services.gradle.org/distributions/gradle-7.0-all.zip
+distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-all.zip
```

3. `android/app/build.gradle`を開き、Javaバージョンと最小AndroidSDKバージョンを更新します。

```diff title="android/app/build.gradle"
android {
    namespace = "com.example.myapp"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion
    compileOptions {
-       sourceCompatibility = JavaVersion.VERSION_11
-       targetCompatibility = JavaVersion.VERSION_11
+       sourceCompatibility = JavaVersion.VERSION_17
+       targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.myapp"
        // You can update the following values to match your application needs.
        // For more information, see: https://docs.flutter.dev/deployment/android#reviewing-the-gradle-build-configuration.
-       minSdk = flutter.minSdkVersion
+       minSdk = 24
        targetSdk = flutter.targetSdkVersion
        versionCode = flutterVersionCode.toInteger()
        versionName = flutterVersionName
    }
    
    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.debug
        }
    }
}
```

> **Info:** より高いバージョンのGradleまたはAndroid Gradleプラグインを使用したい場合は、[こちら](https://developer.android.com/build/releases/gradle-plugin#updating-gradle)の互換性マトリックスを参照してください。

### リリースビルドのネットワークパーミッション

Flutterアプリはデバッグモードではデフォルトでネットワークリクエストを作成するアクセス権を持っています。このパーミッションはリリースモードでビルドする場合に追加する必要があります。これを行うには、`android/app/src/main/AndroidManifest.xml`を開き、以下の追加を行います。

```xml title="android/app/src/main/AndroidManifest.xml"
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
// highlight-start
   <uses-permission android:name="android.permission.INTERNET"/>
// highlight-end
...
</manifest>
```

## Web

Webをターゲットにする場合、Amplify固有の要件やセットアップ手順はありません。Flutterがサポートするブラウザを使用する必要があります。詳細は以下のFlutterドキュメントを参照してください：

- [サポートされているデプロイメントプラットフォーム](https://docs.flutter.dev/reference/supported-platforms)
- [FAQ: FlutterはどのWebブラウザをサポートしていますか？](https://docs.flutter.dev/development/platform-integration/web/faq#which-web-browsers-are-supported-by-flutter)

## macOS

macOSをターゲットにする場合、Amplifyには最小デプロイメントターゲット10.15以上およびXcode 15.0以上が必要です。さらに、ネットワーク、キーチェーンのエンタイトルメント、およびコード署名を有効にする必要があります。

### 最小バージョンの更新

`macos/Podfile`を開き、ターゲットmacOSプラットフォームを10.15以上に更新します。

> **Info:** `macos/Podfile`が存在しない場合は、`pubspec.yaml`に`amplify_flutter`を追加して`pub get`を実行してください。これでファイルが自動的に作成されます。

```diff title="ios/Podfile"
- platform :osx, '10.14'
+ platform :osx, '10.15'
```

Xcodeでプロジェクトを開き、Runner、Targets -> Runnerの順に選択し、「General」タブをクリックします。「Minimum Deployments」セクションで、macOSバージョンを10.15以上に更新します。

![ランナー一般セクションの「Minimum Deployments」タブでmacOSバージョンを10.15以上に設定](/images/project-setup/flutter/mac/target-min-deployment-version.png)

Runner、Project -> Runnerの順に選択し、「Info」タブをクリックします。「macOS Deployment Target」を10.15以上に更新します。

![ランナー情報セクションの「macOS Deployment Target」タブでmacOSバージョンを10.15以上に設定](/images/project-setup/flutter/mac/project-min-deployment-version.png)

### ネットワーク呼び出しを有効にする

Xcodeでプロジェクトを開き、Runner、Targets -> Runnerの順に選択し、「Signing and Capabilities」タブをクリックします。「App Sandbox」の下で「Outgoing Connections (Client)」を選択します。

![ランナーの署名と機能タブのアプリサンドボックスセクションで発信接続を選択](/images/project-setup/flutter/mac/xcode-entitlements.png)

ネットワークエンタイトルメントの詳細については、Appleのドキュメント[com.apple.security.network.client](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_network_client)を参照してください。

### キーチェーン共有を有効にする

> **Info:** この機能はAmplifyがmacOSでプラットフォームベストプラクティスとしてデータ保護キーチェーンを使用するため必須です。
> macOSでのキーチェーンの動作方法とキーチェーン共有エンタイトルメントの詳細については、[TN3137: macOSキーチェーンAPI及び実装](https://developer.apple.com/documentation/technotes/tn3137-on-mac-keychains)を参照してください。

Xcodeでプロジェクトを開き、Runner、Targets -> Runnerの順に選択し、「Signing and Capabilities」タブをクリックします。

1. 「+アイコン」をクリックします。

![ランナータブの署名と機能セクションでプラスアイコンが囲まれている](/images/project-setup/flutter/mac/enable-keychain-access.png)

2. 後続のモーダルで「Keychain Sharing」を検索し、追加します。

![キーチェーンを検索した後のキーチェーン共有検索結果](/images/project-setup/flutter/mac/search-keychain-sharing.png)

3. 「Signing and Capabilities」の「Keychain Sharing」までスクロールダウンし、「+」アイコンをクリックします。デフォルトではバンドルIDが使用されます。

![ランナーの署名と機能セクションのキーチェーン共有セクションで強調表示されたプラスアイコン](/images/project-setup/flutter/mac/adding-keychain-access-group.png)

4. 最後に、開発チームを追加して署名を有効にします。

![ランナータブの署名と機能セクションで強調表示されたチームセレクタと開発署名有効ボタン](/images/project-setup/flutter/mac/enable-signing.png)

## Windows

Windowsをターゲットにする場合、Amplify固有の要件やセットアップ手順はありません。FlutterがサポートするWindowsバージョンを使用する必要があります。詳細は以下のFlutterドキュメントを参照してください：

- [サポートされているデプロイメントプラットフォーム](https://docs.flutter.dev/reference/supported-platforms)

## Linux

Amplify FlutterはLinuxをターゲットにする場合、[libsecret](https://wiki.gnome.org/Projects/Libsecret)ライブラリに依存しています。

### ローカル開発

Amplify Flutterに依存するアプリを実行およびデバッグするには、`libsecret-1-dev`をインストールする必要があります。以下のコマンドを実行して`libsecret-1-dev`をインストールしてください。これにより`libglib2.0-dev`などの`libsecret-1-dev`の依存関係もインストールされます。

> **Info:** 以下のコマンドはUbuntu用です。他のLinuxディストリビューションではコマンドが異なる可能性があります。

```terminal
sudo apt-get update
sudo apt-get install -y libsecret-1-dev
```

### アプリをパッケージ化する

Snapcraftを使用してアプリをパッケージ化する場合、必要な依存関係を`snapcraft.yaml`ファイルに含めます。詳細については、[Flutterのスナップストアへのリリースに関するドキュメント](https://docs.flutter.dev/deployment/linux)を参照してください。

```yaml
parts:
  my-app:
    plugin: flutter
    source: .
    flutter-target: lib/main.dart
    build-packages:
      - libsecret-1-dev
    stage-packages:
      - libsecret-1-0
```

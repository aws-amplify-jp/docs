## Amplifyライブラリのインストール

**アプリ** build.gradleファイルに次の依存関係を追加し、尋ねられたら「今すぐ同期」をクリックしてください：

```groovy
dependencies {
    implementation 'com.amplifyframework:aws-datastore:1.6.4'

    // Java 8 機能のサポート
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.0.10'
}
```

同じファイルの先頭に、Amplify で使用される Java 8 機能をサポートするために、 `compileOptions` を追加します。

```groovy
android {
    compileOptions {
        // Java 8 機能のサポート
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

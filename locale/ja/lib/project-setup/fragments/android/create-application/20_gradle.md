Amplify for Android は Apache Maven パッケージとして配布されています。このセクションでは、パッケージやその他の必要なディレクティブをビルドの設定に追加します。

**Gradle Scripts**の下で **build.gradle (Module: MyAmplifyApp)** を開きます。

次の行を追加します。

```groovy
android {
    compileOptions {
        // Support for Java 8 features
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    // Amplify core dependency
    implementation 'com.amplifyframework:core:1.6.4'

    // Support for Java 8 features
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.0.10'
}
```

- Set `coreLibraryDesugaringEnabled`, `sourceCompatibility`, and `targetCompatibility` to allow your application to make use of Java 8 features like Lambda expressions
- `依存関係` ブロックにAmplifyコアとDesugaringライブラリを追加

<amplify-callout> Amplify AndroidはAPIレベル16以上に対応しています。 最小SDKが21未満の場合は、 [Androidのマルチデックスサポート](https://developer.android.com/studio/build/multidex#mdex-pre-l) を追加するドキュメントに従ってください。 </amplify-callout>

Run **Gradle Sync**

Android Studio では、プロジェクトを新しい構成と同期させる必要があります。 これを行うには、ファイルエディタの上の通知バーにある **Sync Now** をクリックします。

![](~/images/lib/getting-started/android/set-up-android-studio-sync-gradle.png)

完了すると、画面下部の *ビルド* タブの出力に *CONFIGURE SUCCESSFUL* が表示されます。

![](~/images/lib/getting-started/android/set-up-android-studio-configure-successful.png)

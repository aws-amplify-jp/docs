`amplify-tools-gradle-plugin` Gradle プラグインはAmplify CLI ヘッドレスモード間の統合レイヤーを提供します (i. をクリックします。AWSの資格情報は不要です。Android Studioは、IDEのビルドプロセスに統合され、シームレスなエクスペリエンスを提供します。

まず、プロジェクト レベル `build.gradle` にプラグインを追加します。

`buildscript`の `依存関係` ブロックの下に依存関係としてプラグインを追加します。

```groovy
buildscript {
    repositories {
        mavenCentral()
        google()
        jcenter()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:4.0.1'
        // Add this next line:
        classpath 'com.amplifyframework:amplify-tools-gradle-plugin:1.0.2'
    }
}
```

同じプロジェクト レベル `build.gradle`の最後にプラグインを適用します。
```groovy
apply plugin: 'com.amplifyframework.amplifytools'
```

Android Studio で、 **メニューから** を選択します。

これが完了すると、Android Studio のトップメニューバーに新しい実行/デバッグ構成が表示されます。 緑色の **実行** ボタンの左を見てください。ドロップダウンには次のように表示されます。

- `モデル`
- `anplifyPush`


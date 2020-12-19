### API プラグインを追加

DataStoreのクラウド同期は、舞台裏にある [API カテゴリ](~/lib/graphqlapi/getting-started.md) を使用します。そのため、最初のステップは、APIプラグインを追加することです。

アプリレベル `build.gradle のAPIプラグインに依存関係を宣言していることを確認してください`:

```groovy
dependencies {
    // Add this line.
    implementation 'com.amplifyframework:aws-api:1.6.4'
}
```

次に、Amplify初期化コードにプラグインを追加し、以前に追加した `AWSDataStorePlugin` を追加します。


<amplify-block-switcher> <amplify-block name="Java">

```java
Amplify.addPlugin(new AWSDataStorePlugin());
// この行を追加する
Amplify.addPlugin(new AWSApiPlugin());
Amplify.configure(getApplicationContext());
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
Amplify.addPlugin(AWSDataStorePlugin())
// この行を追加
Amplify.addPlugin(AWSApiPlugin())
Amplify.configure(applicationContext)
```

</amplify-block> </amplify-block-switcher>


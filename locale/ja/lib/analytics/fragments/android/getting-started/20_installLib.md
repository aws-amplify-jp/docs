**Gradle スクリプト**を展開し、 **build.gradle (Module: app)**を開きます。 Amplifyの設定は、プロジェクト設定の手順に従って行います。

依存関係ブロックにこれらのライブラリを追加して、Analytics を追加します。

```groovy
dependencies {
    implementation 'com.amplifyframework:core:1.6.4'

    // `dependencies` にこれらの行を追加
    implementation 'com.amplifyframework:aws-analytics-pinpoint:1.6.4'
    implementation 'com.amplifyframework:aws-auth-cognito:1.6.4'
}
```

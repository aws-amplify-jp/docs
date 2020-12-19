Expand **Gradle Scripts**, open **build.gradle (Module: app)**. You will already have configured Amplify by following the steps in the [Project Setup walkthrough](~/lib/project-setup/create-application.md).

`依存関係` ブロックにこれらのライブラリを追加して予測を追加します。

```groovy
dependencies {
    implementation 'com.amplifyframework:core:1.6.4'

    // `dependencies` にこれらの行を追加
    implementation 'com.amplifyframework:aws-predictions:1.6.4'
    implementation 'com.amplifyframework:aws-auth-cognito:1.6.4'
}
```

`aws-auth-cognito` は `aws-prediction` で使用されるバックエンドサービスの認証を提供します。

**Sync Now** をクリックします。

Expand **Gradle Scripts**, open **build.gradle (Module: app)**. You will already have configured Amplify by following the steps in the [Project Setup walkthrough](~/lib/project-setup/create-application.md).

これらのライブラリを `依存関係` ブロックに追加します。
```groovy
dependencies {
    implementation 'com.amplifyframework:aws-storage-s3:1.6.4'
    implementation 'com.amplifyframework:aws-auth-cognito:1.6.4'
}
```

`aws-auth-cognito` は Amazon S3 の認証を提供するために使用されます。

**Sync Now** をクリックします。

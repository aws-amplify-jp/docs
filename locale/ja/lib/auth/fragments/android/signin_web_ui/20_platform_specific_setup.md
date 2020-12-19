## AndroidManifest.xmlを更新
Add the following activity to your app's `AndroidManifest.xml` file, replacing `myapp` with whatever value you used for your redirect URI prefix:

  ```xml
  <activity
      android:name="com.amazonaws.mobileconnectors.cognitoauth.activities.CustomTabsRedirectActivity">
      <intent-filter>
          <action android:name="android.intent.action.VIEW" />

          <category android:name="android.intent.category.DEFAULT" />
          <category android:name="android.intent.category.BROWSABLE" />

          <data android:scheme="myapp" />
      </intent-filter>
  </activity>
  ```

<amplify-callout> これらの手順は、バージョン 1.2.0 以降に更新されています。1.2 より前の Amplify のバージョンに対してこれを設定した場合。 では、 `singleInstance` の起動モードと同様に、 `android:scheme` で `intent-filter` を削除してください。 </amplify-callout>

## 応答ハンドラーを追加
HostedUIを呼び出している `アクティビティ` に次の結果ハンドラを追加します:

<amplify-block-switcher> <amplify-block name="Java">

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        Amplify.Auth.handleWebUISignInResponse(data);
    }
}
```

 </amplify-block> <amplify-block name="Kotlin">

```kotlin
オーバーライド楽しいonActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)

    if (requestCode == AWScognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        Amplify.Auth.handleWebUISignInResponse(data)
    }
}
```

 </amplify-block> <amplify-block name="RxJava">

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        RxAmplify.Auth.handleWebUISignInResponse(data);
    }
}
```

 </amplify-block> </amplify-block-switcher>

<amplify-callout> Amplifyのバージョンを1.2より前に設定した場合。 で指定した `アクティビティ` から `onNewIntent` メソッドコードを削除してください。 </amplify-callout>

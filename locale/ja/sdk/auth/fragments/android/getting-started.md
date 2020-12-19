## 依存関係のインストール

プロジェクトディレクトリで `amplify init`を使用して初期化した後、 **App** `build.gradle` を以下のように更新します:

```groovy
//For AWSMobileClient only:
implementation 'com.amazonaws:aws-android-sdk-mobile-client:2.16.+'

//For the drop-in UI also:
implementation 'com.amazonaws:aws-android-sdk-auth-userpools:2.16.+'
implementation 'com.amazonaws:aws-android-sdk-auth-ui:2.16.+'

//For hosted UI also:
implementation 'com.amazonaws:aws-android-sdk-cognitoauth:2.16.+'
```

For the `AWSMobileClient` alone you can have a minimum SDK version of **15**, but for the drop-in UI you will need a minimum of **23** set in your `build.gradle`:

```
minSdkVersion 15
```

`AndroidManifest.xml` ファイルに次の権限を追加します。

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

Android Studio プロジェクトをビルドします。

## 自動セットアップ

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して認証を追加
```

これまでに、API カテゴリなど、舞台裏で Authを使用するAmplifyカテゴリを有効にしている場合は、すでに認証設定を持っている可能性があります。 そのような場合は、設定を編集するために、 `増幅する auth update` コマンドを実行してください。

CLI プロンプトは、アプリの認証フローをカスタマイズするのに役立ちます。指定されたオプションを使用すると、次のことができます。
- サインイン/登録フローを編集する
- 多要素認証のための電子メールとSMSメッセージを編集する
- ユーザーの属性をカスタマイズします。例：名前、電子メール
- Facebook、Twitter、Google、Amazonなどのサードパーティの認証プロバイダを有効にする

認証オプションを設定した後、バックエンドを更新します:

```bash
push を増幅する
```

A configuration file called `awsconfiguration.json` will be copied to your project `./app/src/main/res/raw` directory. The `AWSMobileClient` will leverage this for communicating with backend services.

### Lambda Triggers

The CLI allows you to configure [Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html) for your Amazon Cognito User Pool.  These enable you to add custom functionality to your registration and authentication flows. [Read more](~/cli/usage/lambda-triggers.md)

## 手動セットアップ

CLI を使用しない手動設定の場合は、次のような `awsconfiguration.json` ファイルが必要です。
- Cognitoユーザプール: `CognitoUserPool : { Default: ...}`
- Cognito Identity Pools: `IdentityManager` と `CredentialsProvider: {CognitoIdentity: ...}`

```xml
    {
        "IdentityManager": {
            "Default": {}
        },
        "CredentialsProvider": {
            "CognitoIdentity": {
                "Default": {
                    "PoolId": "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
                    "Region": "XX-XXXX-X"
                }
            }
        },
        "CognitoUserPool": {
            "Default": {
                "PoolId": "XX-XXXX-X_abcd1234",
                "AppClientId": "XXXXXXXX",
                "Region": "XX-XXXX-X"
            }
        }
    }
```

Federated シナリオなど、Cognito User PoolsとIdentity Poolsの両方を使用している場合は、上記のすべてのキーが必要になります。

### 初期化

MainActivity に移動し、 `onCreate()` 内で `initialize()` ルーチンを実行します。

```java
AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {

        @Override
        public void onResult(UserStateDetails userStateDetails) {
            Log.i("INIT", "onResult: " + userStateDetails.getUserState());
        }

        @Override
        public void onError(Exception e) {
            Log.e("INIT", "Initialization error.", e);
        }
    }
);
```

Build and run your program to see the initialized client in LOGCAT messages. Since you haven't logged in yet it will print a state of `SIGNED_OUT`. The `getUserState()` function returns an ENUM which you can perform different actions in your workflow. For example:

```java
AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
     @Override
    public void onResult(UserStateDetails userStateDetails) {
        switch (userStateDetails.getUserState()){
            case SIGNED_IN:
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        TextView textView = (TextView) findViewById(R.id.text);
                        textView.setText("Logged IN");
                    }
                });
                break;
            case SIGNED_OUT:
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        TextView textView = (TextView) findViewById(R.id.text);
                        textView.setText("Logged OUT");
                    }
                });
                break;
            default:
                AWSMobileClient.getInstance().signOut();
                break;
        }
    }

    @Override
    public void onError(Exception e) {
        Log.e("INIT", e.toString());
    }
});
```

You might leverage the above workflow to perform other actions in the `SIGNED_IN` case, such as calling [GraphQL or REST APIs with AWS AppSync and Amazon API Gateway](~/sdk/api/graphql.md) or uploading content with [Amazon S3](~/sdk/storage/getting-started.md).

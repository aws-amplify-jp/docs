## 概要

[Amazon Location Service](http://aws.amazon.com/location) は、アプリケーションに位置情報を追加できる位置情報サービスです。 Amazon Location Service では、地図や興味のあるポイントを提供するアプリケーションを構築できます。 リソースを追跡し、場所に基づいてアクションを実行し、通りの住所を地理座標に変換します。 このガイドでは、以下の情報を提供します。

- Amazon Location Service SDK を使用して Android アプリをセットアップおよび構成する方法
- アプリケーションに認証を追加する方法
- Amazon Location Service API へのアクセス方法

サービスの詳細については、 [Amazon Location Service Developer Guide](https://docs.aws.amazon.com/location/latest/developerguide/) を参照してください。

## 前提条件

Android アプリ内で Amazon Location Service を使用する場合は、API レベル 16 以降をターゲットにする必要があります。

## 依存関係のインストール

次の手順では、必要な Amazon Location Service SDK を Android アプリにインストールする方法を定義します。

**依存関係をインストールするには:**

1. Android Studio で、プロジェクト ビューアーで **Gradle スクリプト** を展開し、 **build.gradle (Module: YourApp) を開きます。**
1. **dependencies** ブロックに、次の行を追加します。

    ```groovy
    implementation 'com.<unk> s:aws-android-sdk-mobile-client:2.20.+'
    implementation 'com.<unk> s:aws-android-sdk-location:2.20.+)
    ```

1. ファイルエディタの上部にある通知バーの **Sync Now** をクリックして、プロジェクトの設定を更新します。 Android アプリに Amazon Location Service SDK の依存関係が正常に追加されました。

## Amplify CLI を使用してアプリに認証を追加する

Amplify Frameworkは、主要認証プロバイダとして [Amazon Cognito](https://aws.amazon.com/cognito/) を使用しています。 Amazon Cognitoは、ユーザー登録、認証、アカウント復旧などの操作を行う堅牢なユーザーディレクトリサービスです。 Amazon CognitoとAmplify CLIを使用してアプリに認証を追加するには、次の手順を使用します。

1. ターミナルをクリックして Android Studio でターミナルウィンドウを開きます。
1. 次のコマンドを実行して、 [Amplify CLI](https://docs.amplify.aws/cli/start/install) をインストールします。

    <amplify-block-switcher>

    <amplify-block name="NPM">

    ```bash
    npm install -g @aws-amplify/cli
    ```

    </amplify-block>

    <amplify-block name="cURL (Mac and Linux)">

    ```bash
    curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
    ```

    </amplify-block>

    <amplify-block name="cURL (Windows)">

    ```bash
    curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
    ```

    </amplify-block>

    </amplify-block-switcher>

1. アプリのルートディレクトリから次のコマンドを実行して、Amplifyプロジェクトを初期化します。

    ```bash
    initを増幅する
    ```

1. Cognito Identity Poolを作成します。アプリユーザーを認証し、Amazon Location Service へのアクセスを許可するために使用されます。 バックエンドで認証リソースのプロビジョニングを開始するには、プロジェクトディレクトリに移動して次のコマンドを実行します。

    ```bash
    増幅して認証を追加
    ```

1. プロンプトが表示されたら、以下の情報を入力してください。

    ```console
    ? Do you want to use the default authentication and security configuration? 
      `Default configuration`
    ? How do you want users to be able to sign in? 
      `Username`
    ? Do you want to configure advanced settings? 
      `No, I am done.`
    ```

1. Run the following command to push your changes to the cloud. When completed, the `awsconfiguration.json` file will be updated to reference your newly provisioned backend auth resources.

    ```bash
    push を増幅する
    ```

## SDK の初期化

新しい Amazon Cognito ID プールを使用するには、Activity の onCreate メソッドで AWSMobileClient を初期化するために次のコードを追加してください。

<amplify-block-switcher>

<amplify-block name="Java">

```java
AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails userStateDetails) {
        Log.i("QuickStart", "onResult: " + userStateDetails.getUserState());
    }

    @Override
    public void onError(Exception error) {
        Log.e("QuickStart", "Initialization error: ", error);
    }
});
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
AWSMobileClient.getInstance().initialize(applicationContext, object : Callback<UserStateDetails> {
    override fun onResult(userStateDetails: UserStateDetails) {
        Log.i("QuickStart", "onResult: " + userStateDetails.userState)
    }

    override fun onError(error: Exception) {
        Log.e("QuickStart", "Initialization error: ", error)
    }
})
```

</amplify-block> </amplify-block-switcher>

ゲストユーザがバックエンドリソースにアクセスできるようにします。

Amazon 位置情報サービスを使用するようにアプリのセットアップと設定が完了しました！

## Amazon Location Service API の使用

In order to access Amazon Location Service APIs you will need to create resources. You can create resources using the [Amazon Location Service console](http://console.aws.amazon.com/location/home) or using the [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/). Once you have created the resources, you can use these resources by calling the [APIs](https://aws-amplify.github.io/aws-sdk-android/docs/reference/).

このセクションでは、Amazon Location Service API の使用例を示します。 この例では、最初に Amazon Location Service コンソールで Place Index を作成し、API を使用して場所を検索します。

### 新しい場所インデックスの作成

1. [Amazon Location Service コンソール](https://console.aws.amazon.com/location/places/home#/create) を開き、インデックスを作成します。
1. **名前** に **MyPlaceIndex** を入力します。
1. **Create place index** を押します

    ![アマゾンロケーションサービス - 場所のインデックスを作成](~/images/als/create-place-index.png)

1. 以下のスクリーンショットのように、 *arn:aws:geo* から始まります。

    ![Amazon Location Service - Place index](~/images/als/my-place-index.png)

### ゲストユーザーに場所のインデックスへのアクセスを許可する

次に、アプリケーションのゲストユーザーに、Amazon Location Service で作成したPlace Indexリソースへのアクセス権を付与するインラインポリシーを作成します。

1. プロジェクトのルートに移動し、次のコマンドを実行します。

    ```bash
    コンソールの認証を増幅する
    ```

1. **どのコンソール** の **アイデンティティプール** を選択するプロンプトが表示されたら。
1. Amazon Cognitoコンソールに移動します。ページの右上隅にある **Edit Identity pool** をクリックします。
1. Open the drop down for **Unauthenticated identities**, choose **Enable access to unauthenticated identities**, and then press **Save Changes**.
1. Click on **Edit identity pool** once more. Make a note of the name of the Unauthenticated role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`.
1. [AWS Identity and Access Management (IAM) コンソール](https://console.aws.amazon.com/iam/home#/roles) を開き、ロールを管理します。
1. **Search** フィールドに、上記の未認証ロールの名前を入力してクリックします。
1. **+ Add インラインポリシー**をクリックし、 **JSON** タブをクリックします。
1. `[ARN]` プレースホルダに、上記のプレースインデックスのARNを入力し、ポリシーの内容を以下に置き換えます。

    ```json
{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "geo:SearchPlaceIndexForText",
                "Resource": "[ARN]"
            }
        ]
}
    ```

1. **Review Policy** ボタンをクリックします。
1. **名前** フィールドに、 *LocationTracker* と入力します。
1. **ポリシーの作成** ボタンをクリックします。Android アプリに認証が正常に追加されました。

### 場所を検索中

作成した場所のインデックスを使用して場所を検索する方法は次のとおりです。

<amplify-block-switcher>

<amplify-block name="Java">

```java
AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails userStateDetails) {
        ExecutorService executorService = Executors.newFixedThreadPool(4);

        executorService.execute(() -> {
            AmazonLocationClient client = new AmazonLocationClient(AWSMobileClient.getInstance());
            SearchPlaceIndexForTextRequest request = new SearchPlaceIndexForTextRequest();

            request.setText("Space Needle");
            request.setIndexName("MyPlaceIndex");

            SearchPlaceIndexForTextResult response = client.searchPlaceIndexForText(request);

            for (SearchForTextResult result : response.getResults()) {
                Log.i("QuickStart", result.getPlace().toString());
            }
        });
    }

    @Override
    public void onError(Exception error) {
        Log.e("QuickStart", "Initialization error: ", error);
    }
});
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
AWSMobileClient.getInstance().initialize(applicationContext, object : Callback<UserStateDetails> {
    override fun onResult(userStateDetails: UserStateDetails) {
        val executorService = Executors.newFixedThreadPool(4)

        executorService.execute {
            val client = AmazonLocationClient(AWSMobileClient.getInstance())
            val request = SearchPlaceIndexForTextRequest()

            request.text = "Space Needle"
            request.indexName = "MyPlaceIndex"

            val response = client.searchPlaceIndexForText(request)

            for (result in response.results) {
                Log.i("QuickStart", result.place.toString())
            }
        }
    }

    override fun onError(error: Exception) {
        Log.e("QuickStart", "Initialization error: ", error)
    }
})
```

</amplify-block> </amplify-block-switcher>

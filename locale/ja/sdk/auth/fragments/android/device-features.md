You can use the device related features of Amazon Cognito UserPools by enabling the `Devices` features. Go to your Cognito UserPool, click on `Devices` in Left Navigation Menu and chose one of `User Opt In` or `Always`.

`Always` を選択した場合、アプリケーションのユーザーが使用するすべてのデバイスが記憶されます。

デバイス機能の詳細については、以下の [ブログ](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/) をご覧ください。

## 用語

* *追跡*

デバイスが追跡されると、鍵と秘密鍵のペアからなる一連のデバイス資格情報が各デバイスに割り当てられます。 特定のユーザーの追跡されたすべてのデバイスは、Amazon Cognitoコンソールデバイスブラウザから表示できます。 これは、format@@0パネルからユーザーを選択して表示できます。 加えて、いくつかのメタデータを見ることができます(それが記憶されているかどうか、それが追跡され始めた時間、最後の認証時間など)。 関連付けられています


* *記憶されている*

記憶されたデバイスも追跡されます。 ユーザー認証中 記憶されたデバイスに割り当てられたキーとシークレットのペアは、以前にアプリケーションにサインインしたユーザーと同じデバイスであることを確認するためにデバイスを認証するために使用されます。 また、Amazon Cognitoコンソールから記憶されたデバイスを見ることもできます。


* *記憶されていません*

記憶されていないデバイスは、デバイスがまだ追跡されているにもかかわらず、記憶されることの裏側です。 デバイスは、ユーザー認証フロー中に使用されなかったかのように扱われます。 これは、デバイスの資格情報がデバイスの認証に使用されないことを意味します。 AWS Mobile SDK の新しい API では、これらのデバイスは公開されませんが、Amazon Cognito コンソールで確認できます。

## デバイスを記憶する

このオプションはトラッキングされたデバイスを `記憶`としてマークします

```java
AWSMobileClient.getInstance().getDeviceOperations().updateStatus(true, new Callback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

## デバイスを更新

このオプションは、トラッキングされたデバイスを `記憶されていない`とマークします。

```java
AWSMobileClient.getInstance().getDeviceOperations().updateStatus(false, new Callback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

## デバイスを忘れた

このオプションはデバイスの追跡を完全に停止します。

```java
AWSMobileClient.getInstance().getDeviceOperations().forget(new Callback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

> 注: ``を呼び出したら、同じ認証セッションでデバイスのステータスを更新できます。 エンドユーザーは、デバイスを覚えるために再度サインインする必要があります。

## 端末の詳細を取得する

```java
AWSMobileClient.getInstance().getDeviceOperations().get(new Callback<Device>() {
    @Override
    public void onResult(Device result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

## デバイス一覧

```java
AWSMobileClient.getInstance().getDeviceOperations().list(new Callback<ListDevicesResult>() {
    @Override
    public void onResult(ListDevicesResult result) {
        Log.d(TAG, "onResult: ");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```
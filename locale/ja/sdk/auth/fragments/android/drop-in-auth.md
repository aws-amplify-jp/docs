`AWSMobileClient` クライアントは、アプリケーションのシンプルな「ドロップイン」UIをサポートしています。以下のようなドロップイン認証UIを追加できます：

```java
// 'this' refers the current active activity
AWSMobileClient.getInstance().showSignIn(this, new Callback<UserStateDetails>() {
    @Override
    public void onResult(UserStateDetails result) {
        Log.d(TAG, "onResult: " + result.getUserState());
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "onError: ", e);
    }
});
```

In the above code you would have created an Android Activity called `NextActivity` which would automatically be navigated to upon successful sign-up and sign-in. For testing, you can alternatively just use `MainActivity.class` after initializing:

```java
AWSMobileClient.getInstance().showSignIn(
        this,
        SignInUIOptions.builder()
                .nextActivity(NextActivity.class)
                .build(),
        new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails result) {
                Log.d(TAG, "onResult: " + result.getUserState());
                switch (result.getUserState()){
                    case SIGNED_IN:
                        Log.i("INIT", "logged in!");
                        break;
                    case SIGNED_OUT:
                        Log.i(TAG, "onResult: User did not choose to sign-in");
                        break;
                    default:
                        AWSMobileClient.getInstance().signOut();
                        break;
                }
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "onError: ", e);
            }
        }
);
```

The above code also shows an additional Auth API, `signOut()`. For more advanced scenarios, you can call the `AWSMobileClient` APIs, such as for building your own UI or using functionality in different UX of your application lifecycle.

## カスタマイズ

現在、 `AWSMobileClient` を使用してドロップインUIの次のプロパティを変更できます:
- ロゴ: ImageView でサポートされているDrawable リソース
- 背景色: Android でサポートされているすべての色

```java
AWSMobileClient.getInstance().showSignIn(
        this,
        SignInUIOptions.builder()
                .nextActivity(NextActivity.class)
                .logo(R.id.logo)
                .backgroundColor(R.color.black)
                .canCancel(false)
                .build(),
        new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails result) {
                Log.d(TAG, "onResult: " + result.getUserState());
            }


            @Override
            public void onError(Exception e) {
                Log.e(TAG, "onError: ", e);
            }
        }
);
```

`canCancel` プロパティを設定することで、サインインプロセスを解除することを許可できます。 
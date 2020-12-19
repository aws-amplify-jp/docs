<amplify-block-switcher> <amplify-block name="Java">

```java
AWSMobileClient mobileClient = (AWSMobileClient) Amplify.Auth.getPlugin("awsCognitoAuthPlugin").getEscapeHatch();
```

 </amplify-block> <amplify-block name="Kotlin">

 ```kotlin
val mobileClient = Amplify.Auth.getPlugin("awsCognitoAuthPlugin").escapeHatch as AWSMibleClient?
```

 </amplify-block> </amplify-block-switcher>

他のソーシャルプロバイダからの有効なトークンを使用して、 `federatedSignin` へのエスケープハッチを使用できます。詳細はこちら [](https://docs.amplify.aws/sdk/auth/federated-identities/q/platform/android)

```java
mobileClient.federatedSignIn(IdentityProvider.FACEBOOK.toString(), "<FACEBOOK_TOKEN_HERE>", new Callback<UserStateDetails>() {
    @Override
    public void onResult(final UserStateDetails userStateDetails) {
        //Handle the result
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "sign-in error", e);
    }
});
```
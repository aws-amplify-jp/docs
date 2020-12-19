## サインアップ

ユーザープールに新しいユーザーを作成します:

```java
final String username = getInput(R.id.signUpUsername);
final String password = getInput(R.id.signUpPassword);
final Map<String, String> attributes = new HashMap<>();
attributes.put("email", "name@email.com");
AWSMobileClient.getInstance().signUp(username, password, attributes, null, new Callback<SignUpResult>() {
    @Override
    public void onResult(final SignUpResult signUpResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "Sign-up callback state: " + signUpResult.getConfirmationState());
                if (!signUpResult.getConfirmationState()) {
                    final UserCodeDeliveryDetails details = signUpResult.getUserCodeDeliveryDetails();
                    makeToast("Confirm sign-up with: " + details.getDestination());
                } else {
                    makeToast("Sign-up done.");
                }
            }
        });
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "Sign-up error", e);
    }
});
```

## サインアップを確認

ユーザープールにサインアップした後に新しいユーザーを確認します:

```java
final String username = getInput(R.id.confirmSignUpUsername);
final String code = getInput(R.id.confirmSignUpCode);
AWSMobileClient.getInstance().confirmSignUp(username, code, new Callback<SignUpResult>() {
    @Override
    public void onResult(final SignUpResult signUpResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "Sign-up callback state: " + signUpResult.getConfirmationState());
                if (!signUpResult.getConfirmationState()) {
                    final UserCodeDeliveryDetails details = signUpResult.getUserCodeDeliveryDetails();
                    makeToast("Confirm sign-up with: " + details.getDestination());
                } else {
                    makeToast("Sign-up done.");
                }
            }
        });
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "Confirm sign-up error", e);
    }
});
```

## 確認コードを再送信する

```java
AWSMobileClient.getInstance().resendSignUp("your_username", new Callback<SignUpResult>() {
    @Override
    public void onResult(SignUpResult signUpResult) {
        Log.i(TAG, "A verification code has been sent via" + 
            signUpResult.getUserCodeDeliveryDetails().getDeliveryMedium() 
            + " at " + 
            signUpResult.getUserCodeDeliveryDetails().getDestination());
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, e);
    }
});
```

## SignIn

ユーザー資格情報でサインイン:

```java
AWSMobileClient.getInstance().signIn(username, password, null, new Callback<SignInResult>() {
    @Override
    public void onResult(final SignInResult signInResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "Sign-in callback state: " + signInResult.getSignInState());
                switch (signInResult.getSignInState()) {
                    case DONE:
                        makeToast("Sign-in done.");
                        break;
                    case SMS_MFA:
                        makeToast("Please confirm sign-in with SMS.");
                        break;
                    case NEW_PASSWORD_REQUIRED:
                        makeToast("Please confirm sign-in with new password.");
                        break;
                    default:
                        makeToast("Unsupported sign-in confirmation: " + signInResult.getSignInState());
                        break;
                }
            }
        });
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "Sign-in error", e);
    }
});
```

## Confirm SignIn (MFA)

In order to setup multifactor authentication, choose `Manual configuration` while setting up auth in the CLI. When you get to the `Multifactor authentication` step, choose these values:

```console
 Multifactor authentication (MFA) user login options: ON (Required for all logins, can not be enabled later)
 For user login, select the MFA types: SMS Text Message
 Please specify an SMS authentication message: Your authentication code is {####}
 Email based user registration/forgot password: Enabled (Requires per-user email entry at registration)
 Please specify an email verification subject: Your verification code
 Please specify an email verification message: Your verification code is {####}
 Do you want to override the default password policy for this User Pool? No
 Warning: you will not be able to edit these selections. 
 What attributes are required for signing up? Email, Phone Number (This attribute is not supported by Facebook, Login With Amazon.)
```

Note in the example above that for the `What attributes are required for signing up?` prompt, you need to use the arrow keys to scroll down in the list and select `Phone Number`. Otherwise you will not be able to add a phone number to the user and thus will not be able to sign in since SMS MFA is required.

ユーザーのサインアップ時 `メールアドレス` と `電話番号` の両方を含む属性マップを必ず渡してください。

サインインを呼び出し、 `SMS_MFA` の応答を取り戻した後。 次のコマンドで受信したSMSコードのユーザー入力を送信できます。

```java
AWSMobileClient.getInstance().confirmSignIn(signInChallengeResponse, new Callback<SignInResult>() {
    @Override
    public void onResult(SignInResult signInResult) {
        Log.d(TAG, "Sign-in callback state: " + signInResult.getSignInState());
        switch (signInResult.getSignInState()) {
            case DONE:
                makeToast("Sign-in done.");
                break;
            case SMS_MFA:
                makeToast("Please confirm sign-in with SMS.");
                break;
            case NEW_PASSWORD_REQUIRED:
                makeToast("Please confirm sign-in with new password.");
                break;
            default:
                makeToast("Unsupported sign-in confirmation: " + signInResult.getSignInState());
                break;
        }
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "Sign-in error", e);
    }
});
```

## パスワードを強制的に変更

 If a user is required to change their password on first login, there is a `NEW_PASSWORD_REQUIRED` state returned when `signIn` is called. You need to provide a new password given by the user in that case. It can be done using `confirmSignIn` with the new password.

```java
AWSMobileClient.getInstance().signIn("username", "password", null, new Callback<SignInResult>() {
    @Override
    public void onResult(final SignInResult signInResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "Sign-in callback state: " + signInResult.getSignInState());
                switch (signInResult.getSignInState()) {
                    case DONE:
                        makeToast("Sign-in done.");
                        break;
                    case NEW_PASSWORD_REQUIRED:
                        makeToast("Please confirm sign-in with new password.");
                        break;
                    default:
                        makeToast("Unsupported sign-in confirmation: " + signInResult.getSignInState());
                        break;
                }
            }
        });
    }
     @Override
    public void onError(Exception e) {
        Log.e(TAG, "Sign-in error", e);
    }
});

AWSMobileClient.getInstance().confirmSignIn("NEW_PASSWORD_HERE", new Callback<SignInResult>() {
    @Override
    public void onResult(SignInResult signInResult) {
        Log.d(TAG, "Sign-in callback state: " + signInResult.getSignInState());
        switch (signInResult.getSignInState()) {
            case DONE:
                makeToast("Sign-in done.");
                break;
            case SMS_MFA:
                makeToast("Please confirm sign-in with SMS.");
                break;
            default:
                makeToast("Unsupported sign-in confirmation: " + signInResult.getSignInState());
                break;
        }
    }
     @Override
    public void onError(Exception e) {
        Log.e(TAG, "Sign-in error", e);
    }
});
```

## パスワードを忘れた場合

Forgot password is a 2 step process. You need to first call `forgotPassword()` method which would send a confirmation code to user via email or phone number. The details of how the code was sent are included in the response of `forgotPassword()`. Once the code is given by the user, you need to call `confirmForgotPassword()` with the confirmation code to confirm the change of password.

```java
AWSMobileClient.getInstance().forgotPassword("username", new Callback<ForgotPasswordResult>() {
    @Override
    public void onResult(final ForgotPasswordResult result) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "forgot password state: " + result.getState());
                switch (result.getState()) {
                    case CONFIRMATION_CODE:
                        makeToast("Confirmation code is sent to reset password");
                        break;
                    default:
                        Log.e(TAG, "un-supported forgot password state");
                        break;
                }
            }
        });
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "forgot password error", e);
    }
});

AWSMobileClient.getInstance().confirmForgotPassword("NEW_PASSWORD_HERE", "CONFIRMATION_CODE", new Callback<ForgotPasswordResult>() {
    @Override
    public void onResult(final ForgotPasswordResult result) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "forgot password state: " + result.getState());
                switch (result.getState()) {
                    case DONE:
                        makeToast("Password changed successfully");
                        break;
                    default:
                        Log.e(TAG, "un-supported forgot password state");
                        break;
                }
            }
        });
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "forgot password error", e);
    }
});
```

## SignOut

```java
AWSMobileClient.getInstance().signOut();
```

## グローバルサインアウト

グローバルサインアウトを使用すると、すべてのアクティブなログインセッションからユーザーにサインアウトできます。 これを行うことで、すべてのOIDCトークン(idトークン)を取り消します。 ユーザーがすべてのデバイスからサインアウトされることを意味するトークンとリフレッシュトークンにアクセスします。 ただし、トークンは取り消されますが、AWSの資格情報は有効期限が切れるまで有効です(デフォルトでは1時間)。

```java
AWSMobileClient.getInstance().signOut(SignOutOptions.builder().signOutGlobally(true).build(), new Callback<Void>() {
    @Override
    public void onResult(final Void result) {
        Log.d(TAG, "signed-out");
    }

    @Override
    public void onError(Exception e) {
        Log.e(TAG, "sign-out error", e);
    }
});
```

## ユーティリティのプロパティ

`AWSMobileClient` は、アプリケーションで使用するためにローカルに自動的にキャッシュされるいくつかのプロパティ "ヘルパー" を提供します。

```java
AWSMobileClient.getInstance().getUsername()       //String
AWSMobileClient.getInstance().isSignedIn()        //Boolean
AWSMobileClient.getInstance().getIdentityId()     //String
```

## セキュリティトークンの管理

**`AWSMobileClient`で認証を使用する場合、Amazon Cognitoトークンを手動で更新する必要はありません。 トークンは必要に応じてライブラリによって自動的に更新されます。**

### OIDCトークン

```java
AWSMobileClient.getInstance().getTokens();
AWSMobileClient.getInstance().getTokens().getIdToken().getTokenString();
```

### AWS 資格情報

```java
AWSMobileClient.getInstance().getCredentials();
```

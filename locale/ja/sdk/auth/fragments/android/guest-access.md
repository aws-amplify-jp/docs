Many applications have UX with "Guest" or "Unauthenticated" users. This is provided out of the box with `AWSMobileClient` through the initialization routine you have added. However, the Amplify CLI does not enable this by default with the `amplify add auth` flow. You can enable this by running `amplify update auth` and choosing `Manual Configuration` when prompted. Ensure you choose the **...connected with AWS IAM controls** which will allow you to select **Allow unauthenticated logins**.

When complete run `amplify push` and your `awsconfiguration.json` will work automatically with your updated Cognito settings. The `AWSMobileClient` user session will automatically have permissions configured for Guest/Unauthenticated users upon initialization.

"Drop-In Auth" または `AWSMobileClient` API を使用してアプリにログインすると、ユーザーセッションは認証済みロールに移行します。

注意: initialize が `SIGNED_OUT`として状態を与える場合は、 `AWSMobileClient.getInstance().getCredentials()` を呼び出してから、initialize を再度呼び出します。

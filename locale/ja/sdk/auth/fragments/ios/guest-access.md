Many applications have UX with Guest or "Unauthenticated" users. This functionality is supported out of the box with `AWSMobileClient` through the initialization routine. However, the Amplify CLI does not enable this by **default** with the `amplify add auth` flow. You can enable this by

- `増幅更新認証` を実行
- `手動設定` を選択します。
- AWS IAMコントロールに接続されている `User Sign-Up, Sign-Inを選択`
- `未認証ログインを許可` を選択します。

When complete run `amplify push` to update your backend and `awsconfiguration.json` file. The `AWSMobileClient` user session will automatically have permissions configured for Guest users upon initialization.

> [Drop-In Auth](~/sdk/auth/drop-in-auth.md) を使用するか、 [Auth API](~/sdk/auth/working-with-api.md)を使用して直接アプリケーションにログインする場合。 ユーザーセッションは自動的に認証されたロールに移行します。

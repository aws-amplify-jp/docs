AWS Cognito Authプラグインは、デバイスがオンラインになれば自動的にゲスト資格情報を取得するように設定できます。これにより、ログインする必要がなくても他のカテゴリの「匿名」を使用できるようになります。 属性の更新など、この状態ではユーザー固有のメソッドは実行できません。 パスワードを変更するか現在のユーザーを取得します。 ただし、 ここで説明する `fetchAuthSession` メソッド [を使用してデバイスに割り当てられた固有の Identity ID を取得できます](~/lib/auth/access_credentials.md)。

認証カテゴリでゲストアクセスを有効にするには、次の手順に従ってください:

```console
amplify update auth
What do you want to do? Walkthrough all the auth configurations
Select the authentication/authorization services that you want to use: [choose whatever you initially selected - default is User Sign-Up, Sign-In, connected with AWS IAM controls]
Allow unauthenticated logins? (Provides scoped down permissions that you can control via AWS IAM)
❯ Yes
 No
 I want to learn more.

 [proceed through the rest of the steps choosing the values you want - default is usually "No"]
```

これで完了です! オンラインであれば、自動的にゲスト資格情報を取得できます(その後、オフラインで使用するためにキャッシュされます)。

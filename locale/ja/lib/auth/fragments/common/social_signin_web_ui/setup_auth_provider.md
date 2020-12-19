## 認証プロバイダーのセットアップ

<amplify-block-switcher> <amplify-block name="Facebook Login">

1. Facebook [で](https://developers.facebook.com/docs/facebook-login) 開発者アカウントを作成します。

2. [Facebook の認証情報で](https://developers.facebook.com/) にサインインします。

3. *My Apps* メニューから *Add New App* を選択します。 ![画像](~/images/cognitoHostedUI/facebook1.png)

4. Facebook アプリに名前を付け、 *アプリIDの作成* を選択します。 ![画像](~/images/cognitoHostedUI/facebook2.png)

5. 左のナビゲーションバーで、 *設定* を選択し、 *Basic* を選択します。 ![画像](~/images/cognitoHostedUI/facebook3.png)

6. *App ID* と *App Secret*に注意してください。CLI フローの次のセクションでそれらを使用します。

</amplify-block> <amplify-block name="Google Sign-In">

1. [Google 開発者コンソール](https://console.developers.google.com) に移動します。
2. 左のナビゲーションバーで、 *資格情報* を選択します。 ![画像](~/images/cognitoHostedUI/google5.png)
3. *資格情報の作成* ドロップダウン リストから *OAuth クライアント ID* ![Image](~/images/cognitoHostedUI/google6.png) を選択して、OAuth2.0 資格情報を作成します。
4. *Web アプリケーション* を選択します。
5. *Create* をクリックします。
6. *OAuth クライアント ID* および *クライアント シークレット*に注意してください。CLI フローの次のセクションでそれらが必要になります。
7. *OK* を選択します。

</amplify-block> <amplify-block name="Login with Amazon">

1. Amazon [で](https://developer.amazon.com/login-with-amazon)開発者アカウントを作成します。
2. [Amazon の認証情報で](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html) にサインインします。
3. AmazonクライアントIDとクライアントシークレットを受け取るには、Amazonセキュリティプロファイルを作成する必要があります。セキュリティプロファイルの作成を選択してください。 ![画像](~/images/cognitoHostedUI/amazon1.png)
4. セキュリティプロファイル名、セキュリティプロファイル説明、および同意プライバシー通知URLを入力します。 ![画像](~/images/cognitoHostedUI/amazon2.png)
5. 保存を選択します。
6. クライアントIDと秘密を表示するには、クライアントIDとクライアントシークレットを選択します。 CLI フローの次のセクションでそれらが必要になります。 ![画像](~/images/cognitoHostedUI/amazon3.png)

</amplify-block>

<amplify-block name="Sign in with Apple">

1. [Apple 開発者の資格情報で](https://developer.apple.com/account/) にサインインします。
2. メインの開発者ポータルページで、 **証明書、ID、 & Profiles** を選択します。
3. 左のナビゲーションバーで、 **Identifier** を選択します。
4. **ページで** + format@@2 アイコンを選択します。
5. **ページで** を選択します。
6. App ID の登録ページで、App ID プレフィックスの「Team ID」の値を確認します。
7. テキスト ボックスに説明を入力し、iOS アプリのバンドル ID を入力します。 format@@1![画像](~/images/cognitoHostedUI/apple1.png)
8. format@@0で、format@@1を選択します。
9. **Continue**を選択し、設定を確認し、 **Register** を選択します。
10. 右側の **ページで**App ID **を選択し、** を選択します。
11. **+** アイコンを選択し、 **サービスID** を選択します。
12. *説明* テキストボックスに説明を入力し、サービス ID の識別子を入力します。 ![画像](~/images/cognitoHostedUI/apple2.png)
13. 続行し、サービスIDを登録します。

</amplify-block> </amplify-block-switcher>
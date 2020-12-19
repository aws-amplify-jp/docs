<amplify-callout> Apple でサインインする CLI にはまだ追加されていません。以下の手順に従って有効にしてください。 </amplify-callout>

完了したら、 `amplify push` を実行して変更を公開します。完了すると、WebUI用に自動生成されたURLが表示されます。

このURLの認証プロバイダを通知する必要があります：

<amplify-block-switcher> <amplify-block name="Facebook Login">

1. [Facebook の認証情報で](https://developers.facebook.com/) にサインインします。
2. *My Apps* メニューから *Your App* を選択します。 ![画像](~/images/cognitoHostedUI/facebook1.png)
3. 左のナビゲーションバーで、 *設定* を選択し、 *Basic* を選択します。 ![画像](~/images/cognitoHostedUI/facebook3.png)
4. ページ下部から *+ Add Platform* を選択し、 *Website* を選択します。 ![画像](~/images/cognitoHostedUI/facebook4.png)
5. *サイトのURL*に/oauth2/idpponseエンドポイントでユーザプールドメインを入力してください。

    `https://<your-user-pool-domain>/oauth2/idpponse`

    ![画像](~/images/cognitoHostedUI/facebook5.png)
6. 変更を保存
7. *App Domains* にユーザープールドメインを入力してください:

    `https://<your-user-pool-domain>`

    ![画像](~/images/cognitoHostedUI/facebook6.png)
8. 変更を保存
9. ナビゲーションバーから *Products* を選択し、 *Set up* from *Facebook Login*. ![画像](~/images/cognitoHostedUI/facebook7.png)
10. ナビゲーションバーから *Facebook Login* を選択し、 *Settings* を選択します。
11. リダイレクトURLを *有効なOAuthリダイレクト URI*に入力します。/oauth2/idpressポンスエンドポイントを持つユーザープールドメインで構成されます。

    `https://<your-user-pool-domain>/oauth2/idpponse`

    ![画像](~/images/cognitoHostedUI/facebook8.png)
12. 変更を保存

</amplify-block> <amplify-block name="Google Sign-In">

1. [Google Developer Console](https://developers.google.com/identity/sign-in/web/sign-in) に移動
2. *CONFIGURE A PROJECT* をクリックする ![画像](~/images/cognitoHostedUI/google1.png)
3. プロジェクト名を入力し、 *NEXT* を選択します。 ![画像](~/images/cognitoHostedUI/google2.png)
4. 製品名を入力し、 *次* を選択します。
5. *から* Web ブラウザー *を選択します。* ドロップダウン リストから呼び出します。 ![画像](~/images/cognitoHostedUI/google3.png)
6. *CREATE*をクリックします。このステップから *Client ID* と *Client Secret* を使用しません。
7. 完了をクリックします。
8. [Google 開発者コンソール](https://console.developers.google.com) に移動します。
9. 左のナビゲーションバーで、 *資格情報* を選択します。 ![画像](~/images/cognitoHostedUI/google5.png)
10. 最初のステップで作成したクライアントを選択し、編集オプションを選択します。
11. Authorized Javascript オリジンにユーザープールドメインを入力します。
12. `/oauth2/idpponse` エンドポイントで *Authorized Redirect URI* を入力します。

    ![画像](~/images/cognitoHostedUI/google7.png)

    注意: エラーメッセージが表示された場合 `無効なリダイレクト: 送信する前にドメインを許可されたドメインリストに追加する必要があります。 <code> エンドポイントを追加する場合は、` *許可されたドメインリスト* に移動してドメインを追加してください。
13. *保存* をクリックします。

</amplify-block> <amplify-block name="Login with Amazon">

1. [Amazon の認証情報で](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html) にサインインします。
2. 歯車にカーソルを合わせて、前のステップで作成したセキュリティプロファイルに関連付けられているWeb設定を選択し、編集を選択します。 ![画像](~/images/cognitoHostedUI/amazon4.png)
3. 許可されたオリジンにユーザプールドメインを入力し、/oauth2/idpressポンスエンドポイントを使用してユーザプールドメインを許可された返りURLに入力します。 ![画像](~/images/cognitoHostedUI/amazon5.png)
5. 保存を選択します。

</amplify-block> <amplify-block name="Sign in with Apple">

1. [Apple 開発者の資格情報で](https://developer.apple.com/account/) にサインインします。
2. メインの開発者ポータルページで、 **証明書、ID、 & Profiles** を選択します。
3. 左ナビゲーションバーで **Identifiers** を選択し、右側のドロップダウンリストから **Service ID** を選択します。
4. 上記の `認証プロバイダの設定` ステップで作成されたサービス ID を選択します。
5. **Apple** でサインインし、 **Configure** を選択します。
6. **Primary App ID** の下で、以前に作成されたアプリ ID を選択します。
7. **ドメインとサブドメイン**にユーザープールドメインを入力します。
8. `/oauth2/idpponse` エンドポイントを **Return URL**に入力します。 ![画像](~/images/cognitoHostedUI/apple3.png)
9. **次へ**をクリックし、情報を確認し、 **完了** を選択します。
10. *サービス ID 設定を編集* **続行**をクリックし、情報を確認し、 **保存** を選択します。
11. メインの証明書、識別子 & プロファイルで、 **キー** を選択します。
12. Keysページで、 **+** アイコンを選択します。
13. **キー名** の下にキーの名前を入力します。
14. **Apple** でサインインを有効にし、 **設定** を選択します ![画像](~/images/cognitoHostedUI/apple4.png)
15. **Primary App ID** の下で、以前に作成されたアプリ ID を選択します。
16. **保存** をクリックします
17. **新しいキーを登録する** をクリックして **続ける**, 情報を確認し、 **Register** を選択します。
18. ページ上でKey IDをメモするようにリダイレクトされ、秘密鍵を含む.p8ファイルをダウンロードします。 ![画像](~/images/cognitoHostedUI/apple5.png)

### Amazon Cognitoユーザープールのセットアップ
1. 端末のタイプ `で認証コンソール` を増幅し、 `ユーザー プール` を選択して Amazon Cognito ユーザー プールの AWS コンソールを開きます。
2. format@@0 の [Identity providers] タブで format@@1 を選択します。
3. Apple サービス ID、チーム ID、キー IDを入力してください そして、目的のスコープと共に、Appleアプリケーションでサインインするためのダウンロードされた秘密キー。
4. 属性マッピングタブを選択し、Apple タブを選択します。
5. Apple 属性の横にある format@@0 のチェックボックスをオンにします。 として、Apple 属性から値を受け取るユーザープール属性と、Amazon Cognitoからトークンを受け取るユーザープール属性を選択します。
6. 「App Integration」で「App Client設定」を選択し、Apple IdPでサインインすることで、App Clientにフェデレーションを許可するようにします。 「Apple でサインイン」を許可する App クライアントを探し、「Apple でサインイン」チェックボックスをオンにします。

</amplify-block> </amplify-block-switcher>

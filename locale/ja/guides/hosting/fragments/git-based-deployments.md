このガイドでは、Amplifyホスティングを使用してGitHubリポジトリから静的サイトをホストする方法を説明します。

この例では、 __React__ アプリケーションをデプロイします。 また、以下のようなプロジェクトやフレームワークも利用できます。

1. 静的HTML
2. Vue
3. 角度
4. Ionic
5. Gatsby

## 1. 新しいアプリケーションを作成

```sh
npx create-react-app amplifyapp
cd anplifyapp
npm start
```

## 2. Initialize GitHub repository

このステップでは、GitHub リポジトリを作成し、リポジトリにコードをコミットします。 この手順を完了するにはGitHubアカウントが必要です。アカウントをお持ちでない場合は、こちら [](https://github.com/join)にサインアップしてください。

a. アプリケーション用に新しい GitHub リポジトリを作成する ([リンク](https://github.com/new) ) 。

![新しい GitHub リポジトリをあなたのマップ用に作成](~/images/hosting/git/1.png)

b. git を初期化し、アプリケーションを CLI で次のコマンドを実行する新しい GitHub リポジトリにプッシュします。

```sh
git init
git remote add origin git@github.com:username/reponammegit add .
git add .
git commit -m ‘initial commit’
git push origin master
```

## 4. アプリを AWS Amplify にデプロイする

このステップでは、先ほど作成したGitHubリポジトリをAWS Amplifyサービスに接続します。 これにより、アプリをAWS上でビルド、デプロイ、ホストすることができます。

a. [AWS アカウント](https://console.aws.amazon.com/) にサインインし、 [Amplify コンソール](https://console.aws.amazon.com/amplify/home) にアクセスします。

b. デプロイの下で開始を選択します。

![開始する方法を選択](~/images/hosting/git/3.png)

c. リポジトリ サービスとして GitHub を選択し、format@@0 を選択します。

![Select GitHub](~/images/hosting/git/4.png)

d. GitHubで認証し、Amplifyコンソールに戻ります。以前に作成したリポジトリとmasterブランチを選択し、次へを選択します。

![認証](~/images/hosting/git/5.png)

e. デフォルトのビルド設定を受け入れ、format@@0を選択します。

![ビルド設定](~/images/hosting/git/6.png)

f. 最終的な詳細を確認し、format@@0を選択します。

![レビューの詳細](~/images/hosting/git/7.png)

g. AWS Amplify Consoleがソースコードをビルドし、https://branchname.appid.anplifyapp.com にアプリをデプロイします。

![デプロイ成功](~/images/hosting/git/8.png)

h. ビルドが完了したら、サムネイルを選択して、ウェブアプリが稼働中に表示されます。

![アプリを表示](~/images/hosting/git/9.png)
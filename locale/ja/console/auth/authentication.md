---
title: 認証
description: アプリの認証を設定およびデプロイします
---

認証は、ユーザーの身元を確認するプロセスです。アプリケーションのログインフローのコードを記述するのは難しく、時間がかかることがあります。 Admin UI では、完全な [Amazon Cognito](https://aws.amazon.com/cognito/) 認証ソリューションをアプリに簡単に追加できます。 電子メールやパスワード、Amazon、Google、Facebookなどのログイン方法を指定するだけです。 認証フロー全体の認証UIコンポーネントが提供されます。

ソーシャルログインメカニズムのいずれかを追加する場合は、 また、アプリ ID、アプリ シークレット、リダイレクトURIも指定する必要があります。 ソーシャルサインインの仕組みの詳細については、 [ソーシャルサインイン(OAuth)](~/lib/auth/social.md) を参照してください。

多要素認証 (MFA) は、ユーザー名とパスワードのみに依存しない認証方法を追加することで、アプリケーションのセキュリティを向上させます。 AWS AmplifyはAmazon Cognitoを使用してMFAを提供しています。詳細については、 [多要素認証](~/lib/auth/mfa.md) を参照してください。

アプリケーションの認証を構成してデプロイする必要があることに注意してください。 [ユーザーとグループを作成する](~/console/auth/user-management.md) または [許可ルール](~/console/authz/authorization.md) をデータ モデルに適用する前に。

## アプリへのログイン方法を設定するには
1. AWS Managementコンソールにサインインし、AWS Amplifyを開きます。
2. ナビゲーション ウィンドウで、アプリケーションを選択します。
3. アプリケーション情報ページで、 **管理者UIを開く** タブを選択します。
4. **** メニューで **認証** を選択します。
5. In the **Configure log in** section, choose a login mechanism to add from the **Add login mechanism** list. Valid options are *Username*, *Phone number*, *Facebook*, *Google*, and *Amazon*. If you choose one of the social sign-in mechanisms, *Facebook*, *Google*, or *Amazon*, you will also need to enter your *App ID*, *App Secret*, and redirect URLs.
6. (Optional) Add multi-factor authentication (MFA).  MFA is set to **Off** by default. To turn on MFA, do the following in the **Multi-factor authentication** section:
  * すべてのユーザーにMFAを必要とするには **強制** を選択するか、個々のユーザーがMFAを有効にできるようにするには **オプション** を選択します。
  * (オプション) **SMS**を選択し、SMSメッセージを入力します。
  * (オプション)サインアップとサインインを含む認証フローでアプリケーションをロードする場合は、 **Authenticator Application** を選択します。
5. In the **Configure sign up** section, expand **Password protection settings** and customize the password policy settings to enforce. u6. Choose **Save and Deploy**. This starts a CloudFormation deployment with the progress displayed in the upper right corner of the page.

ログインメカニズムの設定、およびサインアップ設定は、認証の導入後に変更できません。 これらの設定を変更するには、最初にデプロイされた認証を削除し、次に新しい設定を作成してデプロイする必要があります。 ただし、新しいログインメカニズムを追加し、多要素認証を追加し、パスワード保護設定を更新することができます。

[\\]: * (上の最後の文は本当ですか?)

## 認証設定をリセットするには
1. AWS Managementコンソールにサインインし、AWS Amplifyを開きます。
2. ナビゲーション ウィンドウで、アプリケーションを選択します。
3. アプリケーション情報ページで、 **管理者UIを開く** タブを選択します。
4. **** メニューで **認証** を選択します。
5. **認証** ページの最後に、 **すべての認証設定とユーザーをリセットする** を選択します。
6. **Delete authentication** confirmation ウィンドウで、 **Delete all authentication rules** を選択します。
5. デプロイの進行状況がページの右上隅に表示されます。
6. 削除認証のデプロイが完了したら、 ユーザーがアプリにどのようにログインするかを設定するための手順 [の手順に従って、新しい認証ルールをデプロイします](~/console/auth/authentication.md#to-configure-how-users-log-in-to-an-app)。

[\\]: * (上記の結果は何ですか?何について警告すべきですか?)
---
title: "ローカル開発用にAWSを設定する"
section: "start"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-24T20:22:12.000Z"
url: "https://docs.amplify.aws/react/start/account-setup/"
---

> **Info:** **注意**: AWSアカウントとプロファイルがすでにローカルで設定されている場合、このガイドに従う必要はありません。設定済みのAWSプロファイルに`AmplifyBackendDeployFullAccess` IAMロールを追加してください。

このガイドは、[IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)と[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)を使用して一時認証情報をセットアップするのに役立ちます。これにより、シングルサインオン（SSO）、ユーザー、グループ、権限セットなどをチーム向けに定義できます。AWS Organizationsは複数のAWSアカウントを含むように拡張できます。組織内のユーザーは、その権限セットが許可する範囲でAWSアカウントを利用できます。

Amplifyは、AWSサービスへのアクセスを簡素化するために標準的なローカル認証情報チェーンプロバイダーを利用しています。このガイドではIAM Identity Centerについて説明していますが、[AWSローカル認証の追加方法](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-prereqs-keys)を探索することもできます。

<details><summary>IAM Identity Center用語</summary>

IAM Identity Centerは、ユーザーが単一のユーザーアイデンティティを使用してサインインし、割り当てられたすべてのAWSアカウント、ビジネスアプリケーション、およびAWSクラウドのカスタムアプリケーションにアクセスできるようにします。このシングルサインオン機能は、複数の認証情報を管理する複雑さを軽減し、ユーザー認証を一元化することでセキュリティを向上させます。

### ユーザー

ユーザーとは、ユーザーアイデンティティとグループ情報が保存および管理される場所です。IAM Identity CenterはMicrosoft Active Directoryなどの外部アイデンティティソースと統合するか、AWSによって提供される組み込みアイデンティティストアを使用することができます。

### 権限セット

ユーザーやグループに割り当てることができる権限のコレクション。権限セットは、ユーザーがAWSアカウントで実行を許可されるアクションを定義します。IAMポリシーに似ていますが、複数のアカウント全体でアクセスを管理するためにIAM Identity Center内で使用されます。

### AWSOrganization

AWS OrganizationsとIAM Identity Centerは、複数のAWSアカウント全体の管理を効率化するために協力しています。AWS Organizationsはアカウント構造とポリシーを管理し、IAM Identity Centerはそれと統合して、シングルサインオンを有効にし、組織のロールに権限を合わせます。このシナジーは、安全で一貫したアクセス制御を確保し、ユーザーと権限の管理を簡素化します。

### ローカルプロファイル

認証情報は通常、[AWSプロファイル](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-using-profiles)の使用により解決されます。プロファイルには永続認証情報またはSSOMETADATAを含めることができ、AWS CLIと同じ手法を使用してAmplifyで使用するように設定できます:

- `--profile`フラグで
- `AWS_PROFILE`環境変数で

### 一時認証情報

永続認証情報の代替として、_セッション_の権限を定義できます。セッションは[IAMロールを_引き受けた_](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html)とき、またはAWS IAM Identity Centerを使用してサインインしたときに作成されます。これらのセッションには、一時認証情報を検証するために使用され、AWSへのリクエストに含める必要がある追加の「セッショントークン」が付属しています。ローカルで作業している場合、これは追加の環境変数として表示されます。

一時セキュリティ認証情報を使用して、AWS CLIまたはAWS API（AWS SDKを通じて）を使用してAWSリソースへのプログラムリクエストを作成できます。一時認証情報は、IAMユーザー認証情報などの長期セキュリティ認証情報と同じ権限を提供します。ただし、いくつかの違いがあり、[AWS ID and Access Management documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)で説明されています。

</details>

## Identity Centerをセットアップする

以下の手順に従ってください。**AWSプロファイルをセットアップしたことがない場合**。

既存のプロファイルがある場合は、[`AmplifyBackendDeployFullAccess`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmplifyBackendDeployFullAccess.html)マネージドポリシーを[IAMユーザー](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)にアタッチしてください。

### 1. Amplify権限を持つユーザーを作成する

AWSコンソールにサインインして[IAM Identity Centerページ](https://console.aws.amazon.com/singlesignon/home)にアクセスし、**有効化**を選択します。

![](/images/gen2/account-setup/sso-enable.png)

ダイアログが開き、「AWSEnvironmentでIAM Identity Centerを設定する方法を選択する」というメッセージが表示されます。**AWS Organizationsで有効化**を選択し、**続行**を選択します。

![](/images/gen2/account-setup/sso-enable-dialog.png)

次に、IAM Identity Centerコンソールでユーザーをセットアップする操作をシミュレートする一連のステップを自動化します。開始するには、コンソールフッターにあるCloudShellを開きます。

CloudShellターミナルに次のコマンドを貼り付け、このAWSアカウントに関連付けるメールアドレスを入力します:

```bash title="CloudShell" showLineNumbers={false}
read -p "Enter email address: " user_email # hit enter
```

```console showLineNumbers={false}
Enter email address: <your-email-address>
```

次に、次のコマンドを実行します

```bash title="CloudShell"
response=$(aws sso-admin list-instances)
ssoId=$(echo $response | jq '.Instances[0].IdentityStoreId' -r)
ssoArn=$(echo $response | jq '.Instances[0].InstanceArn' -r)
email_json=$(jq -n --arg email "$user_email" '{"Type":"Work","Value":$email}')
response=$(aws identitystore create-user --identity-store-id $ssoId --user-name amplify-admin --display-name 'Amplify Admin' --name Formatted=string,FamilyName=Admin,GivenName=Amplify --emails "$email_json")
userId=$(echo $response | jq '.UserId' -r)
response=$(aws sso-admin create-permission-set --name amplify-policy --instance-arn=$ssoArn --session-duration PT12H)
permissionSetArn=$(echo $response | jq '.PermissionSet.PermissionSetArn' -r)
aws sso-admin attach-managed-policy-to-permission-set --instance-arn $ssoArn --permission-set-arn $permissionSetArn --managed-policy-arn arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess
accountId=$(aws sts get-caller-identity | jq '.Account' -r)
aws sso-admin create-account-assignment --instance-arn $ssoArn --target-id $accountId --target-type AWS_ACCOUNT --permission-set-arn $permissionSetArn --principal-type USER --principal-id $userId
# Hit enter
```

これが機能したことを検証するには、CloudShellで次のコマンドを実行します。このプロセスで何か失敗した場合は、**[issue報告](https://github.com/aws-amplify/amplify-backend/issues)**してください。この情報は[次のステップ](#2-set-up-local-aws-profile)で利用できるようにしておいてください。

```bash title="CloudShell" showLineNumbers={false}
// highlight-next-line
printf "\n\nStart session url: https://$ssoId.awsapps.com/start\nRegion: $AWS_REGION\nUsername: amplify-admin\n\n"

# you should see
Start session url: https://d-XXXXXXXXXX.awsapps.com/start
Region: us-east-1
Username: amplify-admin
```

<details><summary>手動セットアップの方が良いですか?</summary>

- AWSOrganizationが作成され、IAM Identity Centerが有効になった後、ダッシュボードが表示されます。ナビゲーションペインで、**権限セット**を選択します。

  ![AWS IAM Identity Centerダッシュボード、ナビゲーションペインで「権限セット」を示しています。](/images/gen2/account-setup/sso-dashboard-highlight-permission-sets.png)

- **権限セットを作成**を選択します。
- 権限セットのタイプについて尋ねられたら、**カスタム権限セット**を選択します。次に、**次へ**を選択します。**AWS Managed Policies (set)**を展開して、_amplify_を検索します。**AmplifyBackendDeployFullAccess**を選択し、**次へ**を選択します。

  ![AWS IAM Identity Centerカスタム権限セットページ、「AmplifyBackendDeployFullAccess」AWS マネージドポリシーが選択されています。](/images/gen2/account-setup/sso-permission-set-custom.png)

- 権限セットに_amplify-policy_という名前を付けて、必要に応じてセッション期間を変更します。**次へ**を選択します。

  ![AWS IAM Identity Centerカスタム権限セット詳細ページ、名前「AmplifySet」が表示されています。](/images/gen2/account-setup/sso-permission-set-custom-details.png)

- 権限セットを確認して、**作成**を選択します。
- 権限セットが作成されたら、IAM Identity Centerダッシュボードに戻ります。これでユーザーの作成準備ができました。ナビゲーションペインを使用して、**ユーザー**を選択します。
- ユーザーの詳細を入力して、**次へ**を選択します。

  ![AWS IAM Identity Centerユーザー作成画面、ユーザー名「amplify-admin」が表示されています。](/images/gen2/account-setup/sso-create-user.png)

- オプションでグループを作成してユーザーを追加し、**次へ**を選択します。
- ユーザー情報を確認して、**ユーザーを追加**を選択します。ユーザーはその後、ユーザー作成中に指定されたメールアドレスを使用してメールを確認する必要があります。
- 新しいユーザーが作成されたら、IAM Identity Centerダッシュボードに戻ります。次のステップは、ユーザーにAWSアカウントへのアクセス権を付与することです。このデモでは、Organizationの作成に使用したAWSアカウントを使用しますが、Amplify用にOrganization配下に新しいAWSアカウントを作成することもできます。管理アカウントの横にあるチェックボックスを選択して、**ユーザーまたはグループを割り当て**を選択します。

  ![AWS IAM Identity Center「AWSアカウント」ページ、管理アカウントがチェックされています。](/images/gen2/account-setup/sso-aws-accounts.png)

- ユーザーまたはグループを割り当てるよう促されたら、**ユーザー**タブを選択し、ステップ13で作成したユーザーを選択して、**次へ**を選択します。

  ![AWS IAM Identity Center「AWSアカウント」ページで、「amplify-admin」を管理AWSアカウントに割り当てています](/images/gen2/account-setup/sso-aws-accounts-add-user.png)

- ステップ9で作成した権限セットを割り当てて、**次へ**を選択します。
- 割り当て情報を確認して、**送信**を選択します。
- これでアクセスポータルにサインインする準備ができました。IAM Identity Centerダッシュボードに戻ります。**設定サマリー**ペイン内で、**AWSアクセスポータルURL**のURLをコピーします。

  ![AWS IAM Identity Centerダッシュボード、AWSアクセスポータルURLを強調表示しています。](/images/gen2/account-setup/sso-dashboard-access-portal.png)

- コピーしたURLに移動して、ユーザー_amplify-admin_としてサインインします。サインイン後、AWSアカウントにアクセスできます。

  ![AWS IAM Identity Centerアクセスポータル、AWSアカウントが表示されています。](/images/gen2/account-setup/sso-access-portal.png)

</details>

### 2. ユーザーのパスワードを作成する

次のステップに必要なユーザーのパスワードを作成します。IdCコンソールで、_ユーザー > amplify_admin > パスワードをリセット > パスワードをリセットするための指示をユーザーにメールで送信_に移動します。

メール（スパムフォルダも確認してください）をチェックします。_パスワードをリセット_リンクをクリックして、任意のパスワードを選択します。サインイン時は、ユーザー名として_amplify-admin_を使用してください。

![](/images/gen2/account-setup/sso-reset-password.png)

## ローカルセットアップを完了する

次に、作成したばかりのユーザーにリンクされたAWSプロファイルをローカルマシンにセットアップします。[IAM Identity Centerユーザー認証情報を取得する](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtogetcredentials.html)ためのいくつかのオプションがありますが、AWS CLI設定ウィザードを使用します。

### 3. AWS CLIをインストールする

[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)をインストールします。

#### [Mac]
ブラウザで、macOS pkgファイルをダウンロードします:

[Macにインストール](https://awscli.amazonaws.com/AWSCLIV2.pkg)

#### [Windows]
ブラウザで、Windows（64ビット）用のAWS CLI MSIインストーラーをダウンロードして実行します:

[Windowsにインストール](https://awscli.amazonaws.com/AWSCLIV2.msi)

AWS CLIをインストールするには、次のコマンドを実行します。

#### [Linux]

```bash showLineNumbers={false}
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install -i /usr/local/aws-cli -b /usr/local/bin
```

### 4. ローカルAWSプロファイルをセットアップする

ターミナルを開きます。これでSSOユーザーを使用するAWSプロファイルを設定する準備ができました。CloudShellからの情報を使用して、以下の情報を入力します。

```console title="Terminal" showLineNumbers={false}
//highlight-next-line
aws configure sso

| SSO session name (Recommended): amplify-admin
| SSO start URL: <START SESSION URL>
| SSO region: <your-region>
| SSO registration scopes [sso:account:access]: <leave blank>
| Attempting to automatically open the SSO authorization page in your default browser.
| If the browser does not open or you wish to use a different device to authorize this request, open the following URL:
|
| https://device.sso.us-east-2.amazonaws.com/
|
| Then enter the code:
|
| SOME-CODE

## browser opens
```

この情報を提供すると、ブラウザが自動的に開き、作成したばかりのユーザー名とパスワードでサインインして、多要素認証デバイスを設定するよう求めます。

ここで、ターミナルに戻り、次の情報を入力します:

```console title="Terminal" showLineNumbers={false}
The only AWS account available to you is: <your-aws-account-id>
Using the account ID <your-aws-account-id>
The only role available to you is: amplify-policy
Using the role name "amplify-policy"
CLI default client Region [us-east-1]: <your-region>
CLI default output format [None]:
```

**プロファイル名を`default`に設定してください**。また、自動生成されたプロファイル名を覚えておいてください。後で必要になります。

```console title="Terminal" showLineNumbers={false}
CLI profile name [amplify-policy-<your-aws-account-id>]: default
To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile default
```

`~/.aws/config`を確認すると、SSOプロファイルが表示されます:

```ini title="~/.aws/config"
[profile default]
sso_session = amplify-admin
sso_account_id = <your-aws-account-id>
sso_role_name = AdministratorAccess
region = <your-region>
[sso-session amplify-admin]
sso_start_url = https://xxxxxx.awsapps.com/start#
sso_region = <your-region>
sso_registration_scopes = sso:account:access
```

### 5. AWSアカウントをブートストラップする

これでこのAWSプロファイルをAWS Amplifyで使用する準備ができました。Amplifyプロジェクトを開き、サンドボックスを開始します。複数のローカルプロファイルがあるか、プロファイルに`default`以外の名前を付けた場合は、`--profile`でプロファイルを指定できます。

```bash title="Terminal" showLineNumbers={false}
// highlight-next-line
npx ampx sandbox

# OR

// highlight-next-line
npx ampx sandbox --profile <profile-name>

```

クラウドサンドボックス環境でリソースのデプロイを開始する前に、Amplifyはリソースのデプロイを開始する前に、アカウントとAWSリージョンのワンタイムブートストラップセットアップを完了する必要があります。

<details><summary>ブートストラップとは?</summary>

ブートストラップは、AWS CDKアプリをAWSEnvironmentにデプロイする前にリソースをプロビジョニングするプロセスです。これらのリソースには、ファイルを保存するためのAmazon S3バケットと、デプロイを実行するために必要な権限を付与するIAMロールが含まれます。必要なリソースは、通常`CDKToolkit`という名前のAWS CloudFormationスタック（ブートストラップスタック）で定義されます。他のAWS CloudFormationスタックと同様に、デプロイされるとAWS CloudFormationコンソールに表示されます。このプロセスの詳細は[CDK documentation](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)をご覧ください。

</details>

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --profile amplify-admin
The region us-east-1 has not been bootstrapped. Sign in to the AWS console as a Root user or Admin to complete the bootstrap process, then restart the sandbox.
If this is not the region you are expecting to bootstrap, check for any AWS environment variables that may be set in your shell or use --profile <profile-name> to specify a profile with the correct region.
```

初回セットアップ時に、`npx ampx sandbox`はAWSManagement Consoleにサインインするよう求めます。アカウント**ルートユーザー**、またはアカウント**AdministratorAccess**権限を持つユーザーとしてサインインする必要があります。サインインすると、Amplifyコンソールにリダイレクトされます。**新しいアプリを作成**ページで、**今すぐセットアップを初期化**を選択します。ブートストラップ処理が完了するまで数分かかる場合があります。

![](/images/gen2/account-setup/profile5.png)

## 成功

ブートストラップ処理を正常に完了しました。これでターミナルに戻って新しいAmplifyサンドボックス環境を作成できます:

```bash showLineNumbers={false}
npx ampx sandbox --profile <value>
```

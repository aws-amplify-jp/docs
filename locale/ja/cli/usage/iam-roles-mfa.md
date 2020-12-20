---
title: IAM ロール & MFA
description: Amplify CLI は、共有された `~/.aws/config` ファイル内のロールのプロファイルを定義して、IAM ロールを想定するように設定します。
--- 

You can optionally configure the Amplify CLI to assume an IAM role by defining a profile for the role in the shared `~/.aws/config` file. This is similar to how the [AWS CLI](https://aws.amazon.com/cli/) functions, including short term credentials. This can be useful when you have multiple developers using one or more AWS accounts, including team workflows where you want to restrict the category updates they might be permitted to make.

`amplify init` または `amplify configure プロジェクト` コマンドの実行中にプロンプトされたとき。 役割に設定されたプロファイルを選択すると、Amplify CLI が一時資格情報を取得、キャッシュ、更新するロジックを処理します。 多要素認証 (MFA) が有効な場合。 一時的な資格情報を取得または更新する必要がある場合は、CLIはMFAトークンコードを入力するよう求めます。

The Amplify CLI has its own mechanism of caching temporary credentials, it does NOT use the same cache of the AWS CLI. The temporary credentials are cached at `~/.amplify/awscloudformation/cache.json`. You can remove all cached credentials by removing this file. If you only want to remove the cached temp credentials associated with a particular project, execute `amplify awscloudformation reset-cache` or it's alias `amplify aws reset-cache` in the project.

## IAMロールを作成し、仮定するためのステップバイステップガイド
以下は、IAMロールを作成し、Amplify CLIで利用できるようにする方法についてのステップバイステップガイドです。

セットアップには3つの部分があり、この機能を実証するための例を使用します。

Biz Corpが在庫管理のウェブポータルを開発するためにDev Corpを採用することを決定したと仮定する そして、Dev CorpはAmplify CLIを使用して開発プロセスをスピードアップしています。

## 1. 役割を設定する（Biz部隊）
1. AWS 管理コンソールにサインインし、 [IAM](https://console.aws.amazon.com/iam/) コンソールを開きます。
2. コンソールのナビゲーション画面で、 `ロール` を選択し、 `ロールの作成` を選択します。
3. `別のAWSアカウント` ロールタイプを選択します。
4. アカウント IDには、Dev CorpのAWSアカウントID(AWSリソースへのアクセスを許可するエンティティのアカウントID)を入力します。
5. Although optional, it is recommended to select `Require external ID` and enter the external id given to you by Dev Corp. (click [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html) for more details on external IDs).
6. 多要素認証(MFA)でサインインするユーザーにロールを制限したい場合 `[MFA が必要] を選択します`(MFAの詳細については、 [ここ](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html) をクリックします)。
7. `次へ: 権限` を選択します。
8. Dev Corpの開発者にロールが仮定されたときに持たせたい権限ポリシーを選択します。 注意: 次のような、CloudFormationアクションを実行し、関連リソースを作成するためにロールパーミッションを付与しなければなりません(プロジェクトで使用するカテゴリによって異なります)。
- Cognitoユーザーとアイデンティティプール
- S3 バケツ数
- DynamoDBテーブル
- AppSync APIs
- API Gateway APIs
- ピンポイントのエンドポイント
- Cloudfront の配布
- IAM ロール
- Lambda 関数
- Lex bots

9. `を選択します: タグ付け`, 必要に応じてタグを付けます(オプション)。
10. `次へ: レビュー`を選択し、ロールの名前を入力し、必要に応じてロールの説明を追加します。
11. "Role name" などの必須フィールドを入力します。
11. `ロールの作成` を選択します。
12. Arn Role を Dev Corp. に渡します。

## 2. ロール(Dev Corp)を想定するユーザーを設定

### 2.1 Biz社が上記の役割を担う権限を持つポリシーを作成する

1. Biz社からロールアーンを入手。
2. AWS 管理コンソールにサインインし、 [IAM](https://console.aws.amazon.com/iam/) コンソールを開きます。 (Dev 社が別の AWS アカウントを持っていると仮定します)。
3. コンソールのナビゲーションペインで、 `ポリシー` を選択し、 `ポリシーの作成` を選択します。
4. 「JSON」タブを選択し、以下の内容をペインに貼り付け、 `<biz_corp_rol_arn>` を以前にメモした値に置き換えます。
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "<biz_corp_rol_arn>"
        }
    ]
}
```
5. `レビューポリシー` を選択します。
6. ポリシー名を入力し、必要に応じてポリシーの説明を追加します。
7. `ポリシーの作成` を選択します。

### 2.2 利用者にポリシーを添付

1. AWS 管理コンソールにサインインし、 [IAM](https://console.aws.amazon.com/iam/) コンソールを開きます。
2. コンソールのナビゲーション ウィンドウで、 `ユーザー` を選択し、 `ユーザー` を選択します。
3. 新しいユーザの `ユーザ名` を入力します。
4. `アクセスタイプ` のプログラムアクセスを選択します。
5. `次へ: 権限` を選択します。
6. `ページで、` を選択します。
7. 2.1で作成されたポリシーを選択します。
9. `を選択します:`にタグを付け、希望する場合はタグを付けます(オプション)。
10. `次へ: レビュー` を選択します。
11. `Create User` を選択します。
12. `.csv` をクリックして資格情報のコピーをダウンロードします。 必要に応じて、アクセスキーIDとシークレットアクセスキーをコピーして安全な場所に保存することもできます。 これらの資格情報は後のセクションで使用されます。

### 2.3 MFAデバイスの割り当て (オプション)

This must be set up if the Biz Corp selected to `Require MFA` when creating the role. This needs to be set up by Dev Corp users and in their respective AWS account.<br/> We are using a virtual MFA device, such as the Google Authenticator app, in this example.

1. AWS 管理コンソールにサインインし、 [IAM](https://console.aws.amazon.com/iam/) コンソールを開きます。
2. コンソールのナビゲーション画面で、 `ユーザー` を選択し、2.2 で上記のユーザーを選択します。
3. `セキュリティ資格情報` タブを選択します。
4. `割り当てられた MFA デバイス` ラベルの横にあり、 `Manage` オプションを選択します。
5. MFAデバイスの管理ウィザードで、 `Virtual MFAデバイス`を選択し、 `Continue` を選択します。
7. Choose `Show QR code` if the MFA app supports QR code, and scan the QR code from your virtual device(Google Authenticator app in our case), if not, choose `Show secret key` and type it into the MFA app.
8. MFAコード1ボックスで、仮想MFAデバイスに現在表示されているワンタイムパスワードを入力します。 デバイスが新しいワンタイムパスワードを生成するのを待ちます。 次に、MFAコード2ボックスに2番目のワンタイムパスワードを入力し、次にMFAの割り当てを選択します。
9. パート3で使用される `割り当てられたMFAデバイス`の隣にあるMFAデバイスをコピーします。

## 3. ローカル開発環境の設定 (Dev Corp)
1. ローカル開発システム上で、存在しない場合は次の2つのファイルを作成します。<br/> `~/.aws/config`<br/> `~/.aws/credentials`<br/>
2. `~/.aws/config` ファイルに以下の内容を挿入します。

```
[profile bizcorprole]
role_arn=<role_arn_from_part#1>
source_profile=devcorpuser
mfa_serial=<mfa_serial_from_part_2.3---optional>
external_id=<external_id_as_mentioned_in_part#1--optional>
region=us-east-1

[profile devcorpuser]
region=us-east-1
```

`mfa_serial` と `external_id` は省略可能で、設定されていない場合は省略してください。

3. `~/.aws/credentials` ファイルに以下の内容を挿入します:
```
[devcorpuser]
aws_access_key_id=<key_id_from_part_2.2>
aws_secret_access_key=<secret_access_key_from_part_2.2>
```

現在、Dev CorpがAmplify プロジェクトを初期化しようとしている場合、上記で設定した `bizcorprole` プロファイルを選択することができます。 そして、ユーザーが設定された認証方法に基づいて、MFAコードなどの対応する質問が表示されます。 これ以降は ユーザーは、BizのコープアカウントにAWSリソースのデプロイ/管理を成功させることができます(Bizのコープが設定したアクセスポリシーに基づいて)。


IAM ロールとその使用法については、 [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) および [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html) のドキュメントを参照してください。
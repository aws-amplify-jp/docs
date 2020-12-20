---
title: 既存のS3バケットまたはDynamoDBテーブルを使用
description: Amplify CLIを構成して、既存のS3バケットまたはDynamoDBテーブルリソースを他のAmplifyカテゴリのストレージリソースとして使用します。(API、Function、その他)
---

既存のS3バケットまたはDynamoDBテーブルをAmplifyプロジェクトにインポートします。 インポートストレージを `増幅する` コマンドを実行して、 & アカウントからS3またはDynamoDBリソースをインポートします。

```sh
インポートストレージを増幅する
```

インポートプロセスを完了するために、 `anmpify push` を実行し、このバックエンドの変更をクラウドにデプロイしてください。

`importストレージを増幅する` コマンドは次のようになります。
* Amplifyライブラリ設定ファイル(aws-exports.js, anplifyconfiguration.json)に、選択したS3バケット情報を自動的に入力します。
* 指定されたS3バケットまたはDynamoDBテーブルを、すべてのストレージ依存カテゴリ(API、Function、Predictionsなど)のストレージメカニズムとして提供します
* Lambda関数が選択したS3またはDynamoDBリソースにアクセスできるようにします。

この機能は、以下のような場合に特に便利です:
* Amplifyカテゴリ（APIやFunctionなど）を有効にして既存のストレージリソースにアクセスします。
* アプリケーションスタックに Amplify を徐々に採用します。
* Amplifyで作業中にS3とDynamoDBのリソースを独立して管理します。

## 既存の S3 バケットをインポート

インポートストレージを `増幅する`を実行すると、「S3バケット-コンテンツ(画像、オーディオ、ビデオなど)」オプションを選択します。

`amplify push` を実行してインポート手順を完了します。

> AmplifyプロジェクトはS3バケット1つに制限されています。

### Amplifyライブラリを使用してインポートされたS3バケットに接続します

デフォルトでは、Amplifyライブラリは、S3バケットが次のアクセスパターンで構成されていると仮定しています。
- `public/` - アプリのすべてのユーザーがアクセス可能
- `protected/{user_identity_id}/` - すべてのユーザーによって読み取ることができますが、作成ユーザーによってのみ書き込み可能
- `private/{user_identity_id}/` - 個々のユーザーのみアクセス可能

Amplify推奨ポリシーを使用するようにIAMロールを設定するか、Amplifyライブラリ設定で [デフォルトのストレージパスの動作](~/lib/storage/configureaccess.md/q/platform/js#customize-object-key-path)を上書きすることができます。

S3バケットのCORS設定を確認することを強くお勧めします。 [レコメンドガイド](~/lib/storage/getting-started.md/q/platform/js#amazon-s3-bucket-cors-policy-setup) をご覧ください。

### Amplify推奨ポリシーを使用するIAMロールの設定

CognitoリソースをインポートしたS3バケットを使用している場合 次に、Cognito Identity Poolの認証済みおよび未認証の役割のポリシーを更新する必要があります。 新しい __管理されたポリシー__ ( *インライン ポリシー*ではありません) を次のステートメントでこれらのロールに作成します。

> `{YOUR_S3_BUCKET_NAME}` を S3 バケットの名前に置き換えてください。

#### 認証されていないロールポリシー:
- `public/` の IAM policy ステートメント :
```json
{
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/public/*"
    ],
    "Effect": "Allow"
}
```

- `public/`, `protected/`, および `private/` への読み取りアクセスのための IAM policy ステートメント :
```json
{
    "Action": [
        "s3:GetObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/protected/*"
    ],
    "Effect": "Allow"
},
{
    "Condition": {
        "StringLike": {
            "s3:prefix": [
                "public/",
                "public/*",
                "protected/",
                "protected/*"
            ]
        }
    },
    "Action": [
        "s3:ListBucket"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}"
    ],
    "Effect": "Allow"
}
```

#### 認証済みロールポリシー:
- `public/` の IAM policy ステートメント :
```json
{
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/public/*"
    ],
    "Effect": "Allow"
}
```

- `protected/` の IAM policy ステートメント :
```json
{
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/protected/${cognito-identity.amazonaws.com:sub}/*"
    ],
    "Effect": "Allow"
}
```

- `private/` の IAM policy ステートメント :
```json
{
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/private/${cognito-identity.amazonaws.com:sub}/*"
    ],
    "Effect": "Allow"
}
```

- `public/`, `protected/`, および `private/` への読み取りアクセスのための IAM policy ステートメント :
```json
{
    "Action": [
        "s3:GetObject"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/protected/*"
    ],
    "Effect": "Allow"
},
{
    "Condition": {
        "StringLike": {
            "s3:prefix": [
                "public/",
                "public/*",
                "protected/",
                "protected/*",
                "private/${cognito-identity.amazonaws.com:sub}/",
                "private/${cognito-identity.amazonaws.com:sub}/*"
            ]
        }
    },
    "Action": [
        "s3:ListBucket"
    ],
    "Resource": [
        "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}"
    ],
    "Effect": "Allow"
}
```

## 既存の DynamoDB テーブルをインポート

`implify import storage`を実行すると、「DynamoDBテーブル - NoSQLデータベース」オプションを選択します。 DynamoDBテーブルを正常にインポートするには、DynamoDBテーブルをAmplifyプロジェクトと同じリージョン内に配置する必要があります。

`amplify push` を実行してインポート手順を完了します。

> Amplifyプロジェクトは複数のDynamoDBテーブルを含めることができます。

## マルチ環境のサポート

`amplify env add`を使用して新しい環境を作成するとき。 Amplify CLI はデフォルトで、Amplifyプロジェクト以外でアプリケーションのストレージリソースを管理していると仮定します。 別の S3 バケットまたは DynamoDB テーブルをインポートするか、インポートされた同じストレージリソースを維持するかを尋ねられます。

Amplifyに新しい環境でストレージリソースを管理させたい場合 `amplify remove storage` を実行して、インポートされたストレージリソースのリンクを解除し、 `増幅ストレージを追加` して、新しい環境で新しい Amplify-managed S3 バケットと DynamoDB テーブルを作成します。

## 既存の S3 バケットまたは DynamoDB テーブルのリンクを解除します

既存のCognitoリソースのリンクを解除するには、 `ストレージを増幅します`。 これにより、Amplifyプロジェクトから参照されているS3バケットまたはDynamoDBテーブルのリンクが解除されます。 S3バケットまたはDynamoDBテーブル自体は削除されません。

`amplify push` を実行して、リンク解除の手順を完了します。

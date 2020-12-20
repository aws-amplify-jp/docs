---
title: 単一の環境を共有
description: 単一のAmplify環境を共有する複数のチームメンバーが推奨するワークフローを学びます。
---

クラウドには2つの独立した環境 (マスター & dev) があり、Gitのバックエンドインフラストラクチャコードを増幅する対応するgit ブランチがあります。 すべてのチームメンバーが同じAmplifyプロジェクトで作業し、同じ開発環境でバックエンドに関連する変更をプッシュして変更をテストするとします。 各チームメンバーは以下を実行します:

```bash
cd <project-dir>
は init を増幅する
```
<amplify-callout warning>

既存の環境を再利用できるようにするために、プロジェクトのルートが `増幅する` フォルダが設定されていることを確認してください。

</amplify-callout>

```console
既存の環境を使用しますか？ はい
使用したい環境を選択してください:
<unk> dev
master
# 残りの init ステップ
# 増幅を追加/更新 
push を増幅する
```

チームが同じ開発者バックエンドを共有しているため、 定期的にチームメンバーは開発環境を同期させるために チームメンバーが推進した変更を取り込む必要がある 開発ブランチ & 環境から変更を取り込みましょう。

```bash
増幅する
```

## チーム内でプロジェクトを共有
増幅/dir file-structure 内では、以下のような構造を含む **team-provider-info.json** ファイルを観察します。

```json
{
    "dev": {
        "awscloudformation": {
            "AuthRoleName": "multenvtest-20181115101929-authRole",
            "UnauthRoleArn": "arn:aws:iam::132393967379:role/multenvtest-20181115101929-unauthRole",
            "AuthRoleArn": "arn:aws:iam::132393967379:role/multenvtest-20181115101929-authRole",
            "Region": "us-east-1",
            "DeploymentBucketName": "multenvtest-20181115101929-deployment",
            "UnauthRoleName": "multenvtest-20181115101929-unauthRole",
            "StackName": "multenvtest-20181115101929",
            "StackId": "arn:aws:cloudformation:us-east-1:132393967379:stack/multenvtest-20181115101929/fc7b1010-e902-11e8-a9bd-50fae97e0835"
        }
    },
    "master": {
        "awscloudformation": {
            "AuthRoleName": "multenvtest-20181115102119-authRole",
            "UnauthRoleArn": "arn:aws:iam::345090917734:role/multenvtest-20181115102119-unauthRole",
            "AuthRoleArn": "arn:aws:iam::345090917734:role/multenvtest-20181115102119-authRole",
            "Region": "us-east-1",
            "DeploymentBucketName": "multenvtest-20181115102119-deployment",
            "UnauthRoleName": "multenvtest-20181115102119-unauthRole",
            "StackName": "multenvtest-20181115102119",
            "StackId": "arn:aws:cloudformation:us-east-1:345090917734:stack/multenvtest-20181115102119/3e907b70-e903-11e8-a18b-503acac41e61"
        }
    }
}
```

このファイルはチームメンバー間で共有されます 同じCloudFormationスタックにリソースをプッシュ/プロビジョニングできるようになり、チームがプッシュ/プル方法で作業できるようになり、クラウドのプロジェクトの最新の状態と常に同期できるようになります。

注意: チームメンバーは、正しい資格情報(アクセスキー/シークレットキー)がある場合にのみ、スタックにプッシュすることができます。

プロジェクトを公開してサーバーレスインフラストラクチャをオープンソースにしたい場合は、anplify/team-provider-info.json ファイルを削除するか、gitignore ファイルに入れてください。

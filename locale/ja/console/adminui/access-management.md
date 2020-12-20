---
title: チームへのアクセスを管理
description: プロジェクトへのチームアクセスを管理する
---

With the Admin UI, team members with different job functions can collaborate on different aspects of a project deployed in the Amplify Console. Admin UI developers can create accounts with scoped access to resources and invite team members to join via email. Team members with *Full access* can create and manage AWS resources, while team members with *Manage only* access can edit application content and users.

以下の手順に従って、チームメンバーとプロジェクトへのアクセスを追加および管理します。

## チームメンバーをプロジェクトに招待するには

1. AWS管理コンソールにサインインし、AWS Amplifyを開きます。
2. ナビゲーション ウィンドウで、 **管理者 UI 管理** を選択します。
3. **Admin UI management** **Access control settings** セクションで、 **Add team members** を選択します。
4. **メールアドレス**の場合、招待するチームメンバーのメールアドレスを入力します。
5. **アクセスレベル**の場合、チームメンバーにアクセス権限を付与するレベルを選択します。
  * **フルアクセス** により、チームメンバーはAWSリソースを作成および管理できます。
  * **** アクセスのみを管理することで、チームメンバーはアプリのコンテンツとユーザーを編集できます。
6. 招待状を電子メールで送信するには、 **招待を送信**を選択してください。 チームメンバーには、一時的な資格情報が記載されたメールと、Admin UI でプロジェクトにアクセスするためのリンクが送信されます。

## チームメンバーのアクセスを編集したり、ユーザーを削除するには
1. AWS管理コンソールにサインインし、AWS Amplifyを開きます。
2. ナビゲーション ウィンドウで、 **管理者 UI 管理** を選択します。
3. **管理** ページの **アクセス制御設定** セクションで、編集または削除するチームメンバーを選択します。
4. 次のいずれかを実行します。
  * **編集**を選択します。 **チームメンバーの編集** ウィンドウで、チームメンバーの **アクセスレベル** を選択します。
  * **Delete**を選択します。 **Delete users** ウィンドウで、削除アクションを確認します。
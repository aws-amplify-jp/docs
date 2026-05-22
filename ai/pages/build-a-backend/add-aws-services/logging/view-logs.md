---
title: "ログの表示"
section: "build-a-backend/add-aws-services/logging"
platforms: ["swift", "android"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/logging/view-logs/"
---

ログメッセージは、[初期設定](/[platform]/build-a-backend/add-aws-services/logging/set-up-logging)で作成して指定したAmazon CloudWatchログループに送信されます。各ユーザーのログメッセージは、ログループ内のユーザー固有のログストリームにあります。ログストリーム名は、ユーザーのデバイス識別子とユーザー識別子に基づいて生成されます。
認証済みユーザーの場合、ログストリーム名は`<device-identifier>.<user-identifier>`です。認証されていないユーザーの場合、ログストリーム名は`<device-identifier>.guest`です。

デバイス識別子は、ユーザーのハードウェアデバイスとOSが提供する一意の識別子です。必要に応じて、Amplify Authカテゴリを使用して、特定のユーザーの[ユーザー識別子を取得](/[platform]/frontend/logging/configure-user/#retrieve-userids-with-amplify-auth)できます。また、Amazon CognitoコンソールにアクセスしてUser poolsの`User ID`を検査することで、ユーザー識別子を取得することもできます。

## AWSコンソールでログを表示する
AWSコンソールでログにアクセスするには、以下の手順に従ってください:
1. AWSコンソールにログインする
2. Amazon CloudWatchに移動する
3. 左側のナビゲーションパネルの**Logs**メニューから、**Log groups**メニュー項目をクリックする
4. **Log groups**ウィンドウで、**Filter**フィールドにログループ名を入力する
5. フィルタリングされた結果に返されたログループをクリックして、すべてのログストリームを表示する

---
title: アクセスコントロール
description: 認証ルールの設定
---

<amplify-callout warning>

データモデル [の例](~/console/data/data-model.md#data-modeling-example) をクローンしてフォローします。

</amplify-callout>

私達は私達が私達の本屋の例のために作成したそれぞれのモデルのためにセットアップ役割ベースの認可規則を定義するつもりである。 承認ルールは、特定の条件に基づいて誰がテーブルをクエリまたは更新できるかを制限するのに役立ちます。

## 所有者承認ルールを設定する
1. Using the *Books* data model that we created in the [Create a data model example](~/console/data/data-model.md#Create-a-data-model-example), set the authorization mode to **Cognito user pool**.
2. 右側の **モデル** ペインで、 **所有者** ウィンドウを展開します。
3. Choose **Create**, **Read**, **Update** and **Delete** to specify that *Owners* have create, read, update, and delete access. The settings look as follows.

![GSA](~/images/console/10_ownersaccess.png)

## プライベート認証ルールを設定する
1. Using the *Books* data model that we created in the [Create a data model example](~/console/data/data-model.md#Create-a-data-model-example), set the authorization mode to **Cognito user pool**.
2. 右側の **Model** ペインで、 **Any signed-in users** ウィンドウを展開します。
3. Choose **Create**, **Read**, and **Update** to specify that any signed-in authenticated user has create, read, and update, access. The settings look as follows.

![GSA](~/images/console/11_privatesaccess.png)

[\\]: * ("user"は、adminuiのuser-management経由で追加されたユーザーとして定義されていますか?)

## グループ承認ルールを設定する
1. Using the *Books* data model that we created in the [Create a data model example](~/console/data/data-model.md#Create-a-data-model-example), set the authorization mode to **Cognito user pool**.
2. Create an *Editors* group using the instructions to [create a group](~/console/auth/user-management.md#To-create-a-group). Alternately, you can create a new group from the **Add a new rule for...** menu.
3. 右側の **モデル** ペインで、 *エディター* を **新しいルールを追加...** メニューから選択します。

![GSA](~/images/console/8_menudetaileditors.png)

4. Choose **Create**, **Read**, **Update** and **Delete** to specify that signed in users in the *Editors* group have create, read, update, and delete access. The settings look as follows.

![GSA](~/images/console/9_editorgroupaccess.png)


## 公開承認ルールを設定する

データモデルを公にアクセスできるようにしたい場合は、API_KEY または IAM ベースの認証に切り替えます。

1. Using the *Books* data model that we created in the [Create a data model example](~/console/data/data-model.md#Create-a-data-model-example), set the authorization mode to **API Key**.
2. In the **Model** pane on the right, expand the **Anyone** window. Choose **Read** to specify that any signed in user has read access to the data in the *Book* model. The settings look as follows.

![GSA](~/images/console/7_publicauthreadonly.png)
Appleは、App Storeにアプリを送信する際に、アプリのデータ使用ポリシーを提供することをアプリ開発者に求めています。 以下は、Appleによって識別されたさまざまなカテゴリと、Amplifyライブラリが使用する対応するデータタイプです。

## 連絡先情報

| データタイプ  | レガシーSDK                    | カテゴリを増幅する | 目的     | アイデンティティにリンクされました | トラッキング | 開発者による提供 |
| ------- | -------------------------- | --------- | ------ | ----------------- | ------ | -------- |
| 名前      |                            |           |        |                   |        |          |
|         | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSConnect                 | NA        | アプリの機能 | Y                 | N      | Y        |
| メールアドレス |                            |           |        |                   |        |          |
|         | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSConnect                 | NA        | アプリの機能 | Y                 | N      | Y        |
| 電話番号    |                            |           |        |                   |        |          |
|         | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | Y        |
|         | AWSConnect                 | NA        | アプリの機能 | Y                 | N      | Y        |


## ユーザーコンテンツ

| データタイプ   | レガシーSDK                 | カテゴリを増幅する | 目的     | アイデンティティにリンクされました | トラッキング | 開発者による提供 |
| -------- | ----------------------- | --------- | ------ | ----------------- | ------ | -------- |
| 写真または動画  |                         |           |        |                   |        |          |
|          | AWSS3                   | ストレージ     | アプリの機能 | N                 | N      | Y        |
|          | AWSRekognition          | 予測        | アプリの機能 | N                 | N      | Y        |
|          | AWSTextract             | 予測        | アプリの機能 | N                 | N      | Y        |
|          | AWSTranslate            | 予測        | アプリの機能 | N                 | N      | Y        |
| オーディオデータ |                         |           |        |                   |        |          |
|          | AWSTransscribe          | 予測        | アプリの機能 | N                 | N      | Y        |
|          | AWSTransscribeStreaming | 予測        | アプリの機能 | N                 | N      | Y        |

## 識別子
| データタイプ  | レガシーSDK                    | カテゴリを増幅する | 目的     | アイデンティティにリンクされました | トラッキング | 開発者による提供 |
| ------- | -------------------------- | --------- | ------ | ----------------- | ------ | -------- |
| ユーザー ID |                            |           |        |                   |        |          |
|         | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCognitoIdentity         | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCore                    | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSConnect                 | NA        | アプリの機能 | Y                 | N      | N        |
|         | AWSConnectParticipant      | NA        | アプリの機能 | Y                 | N      | N        |
|         | AWSSTS                     | NA        | アプリの機能 | Y                 | N      | N        |
|         | AWSLex                     | NA        | アプリの機能 | Y                 | N      | N        |
|         | AWSPinpoint                | 分析        | 分析     | Y                 | Y      | N        |
| デバイス ID |                            |           |        |                   |        |          |
|         | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
|         | AWSPinpoint                | 分析        | 分析     | Y                 | Y      | N        |


## その他のデータ
| データタイプ                       | レガシーSDK                    | カテゴリを増幅する | 目的     | アイデンティティにリンクされました | トラッキング | 開発者による提供 |
| ---------------------------- | -------------------------- | --------- | ------ | ----------------- | ------ | -------- |
| OS のバージョン                    |                            |           |        |                   |        |          |
|                              | AWSCore                    | すべてのカテゴリ  | 分析     | N                 | Y      | N        |
| OS 名                         |                            |           |        |                   |        |          |
|                              | AWSCore                    | すべてのカテゴリ  | 分析     | N                 | Y      | N        |
| ロケール情報                       |                            |           |        |                   |        |          |
|                              | AWSCore                    | すべてのカテゴリ  | 分析     | N                 | Y      | N        |
|                              |                            |           |        |                   |        |          |
| アプリのバージョン                    |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| アプリの最小OSターゲット                |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| タイムゾーン情報                     |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| ネットワーク情報                     |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| SIMカードがあります                  |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| 携帯電話キャリア名                    |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| デバイスモデル                      |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| 端末名                          |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| デバイスの OS バージョン               |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| デバイスの高さと幅                    |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| デバイスの言語                      |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |
| UIDEvice.identifierForVendor |                            |           |        |                   |        |          |
|                              | AWSMobileClient            | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoAuth             | 認証        | アプリの機能 | Y                 | N      | N        |
|                              | AWSCognitoIdentityProvider | 認証        | アプリの機能 | Y                 | N      | N        |


## 健康とフィットネス
データが収集されていません

## 財務情報
データが収集されていません

## 場所
データが収集されていません

## 機密情報
データが収集されていません

## 連絡先
データが収集されていません

## 閲覧履歴
データが収集されていません

## 履歴を検索
データが収集されていません

## 診断
データが収集されていません



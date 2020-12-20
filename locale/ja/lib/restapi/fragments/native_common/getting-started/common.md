Amplify APIカテゴリは、バックエンドへのリクエストを行うためのインターフェースを提供します。 Amplify CLI は、 [Amazon API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/) および [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/) を使用して REST API とハンドラをデプロイします。

## 目標
Amplify APIを使用してアプリケーションを設定し、APIゲートウェイへのリクエストを行い、Amplify Authが提供する認証を使用してラムダ機能をトリガーします。

## 前提条件

<inline-fragment platform="ios" src="~/lib/restapi/fragments/ios/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/restapi/fragments/android/getting-started/10_preReq.md"></inline-fragment>

## API の設定

<inline-fragment platform="ios" src="~/lib/restapi/fragments/ios/getting-started/11_amplifyInit.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/restapi/fragments/android/getting-started/11_amplifyInit.md"></inline-fragment>

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/restapi/fragments/ios/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/restapi/fragments/android/getting-started/20_installLib.md"></inline-fragment>

## Amplify APIを初期化

<inline-fragment platform="ios" src="~/lib/restapi/fragments/ios/getting-started/30_initapi.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/restapi/fragments/android/getting-started/30_initapi.md"></inline-fragment>

## POST リクエストを作成

次のコードをアプリケーションにコピー&ペーストして、アプリが起動したときに1回だけ実行されるようにします。

<inline-fragment platform="ios" src="~/lib/restapi/fragments/ios/getting-started/40_postTodo.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/restapi/fragments/android/getting-started/40_postTodo.md"></inline-fragment>

バックエンドに移動するには、 [API Gateway コンソール](https://aws.amazon.com/apigateway) に移動し、API を選択します。 API の名前は、CLI ステップで指定したラベルとして使用するリソースのフレンドリーな名前に対応します。

## 次のステップ

おめでとうございます! あなたは API Gateway に電話をかけ、Lambda 機能をトリガーしました。 Amplify APIの使用例については、以下のリンクを参照してください。

* [データを取得中](~/lib/restapi/fetch.md)
* [データの更新](~/lib/restapi/update.md)
* [データの削除](~/lib/restapi/delete.md)
* [認可ルールを定義](~/lib/restapi/authz.md)

Analytics カテゴリを使用すると、アプリケーションの分析データを収集できます。 Analytics カテゴリには、 [Amazon Pinpoint](https://aws.amazon.com/pinpoint) と [Amazon Kinesis](https://aws.amazon.com/kinesis) (Kinesis support is only available in the Amplify JavaScript library).

## 目標

Amplify Analyticsを使用してアプリケーションを設定および構成し、分析イベントを記録します。

## 前提条件

<inline-fragment platform="ios" src="~/lib/analytics/fragments/ios/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/analytics/fragments/android/getting-started/10_preReq.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/analytics/fragments/flutter/getting-started/10_preReq.md"></inline-fragment>

## 分析バックエンドの設定

プロジェクトのルートフォルダで次のコマンドを実行します。 CLI は、Amazon Pinpoint リソース名や分析イベント設定など、Analytics カテゴリの設定オプションをプロンプトします。

> Analytics カテゴリは、分析イベントを送信するためにアプリケーションを承認するために、舞台裏の認証カテゴリを使用します。

```bash
anmpify add analytics
```

```console
? Select an Analytics provider (Use arrow keys)
    `Amazon Pinpoint`
? Provide your pinpoint resource name: 
    `yourPinpointResourceName`
? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started) 
    `Yes`
```

バックエンドをデプロイするには、次を実行します。

```bash
push を増幅する
```

Upon completion, `amplifyconfiguration.json` should be updated to reference provisioned backend analytics resources. Note that these files should already be a part of your project if you followed the [Project setup walkthrough](~/lib/project-setup/create-application.md).

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/analytics/fragments/ios/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/analytics/fragments/android/getting-started/20_installLib.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/analytics/fragments/flutter/getting-started/20_installLib.md"></inline-fragment>

## Amplify分析を初期化

<inline-fragment platform="ios" src="~/lib/analytics/fragments/ios/getting-started/30_initAnalytics.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/analytics/fragments/android/getting-started/30_initAnalytics.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/analytics/fragments/flutter/getting-started/30_initAnalytics.md"></inline-fragment>

## イベントを記録

<inline-fragment platform="ios" src="~/lib/analytics/fragments/ios/getting-started/40_record.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/analytics/fragments/android/getting-started/40_record.md"></inline-fragment> <inline-fragment platform="flutter" src="~/lib/analytics/fragments/flutter/getting-started/40_record.md"></inline-fragment>

## Analytics コンソールを表示

ターミナルから次のコマンドを実行します。format@@0タブに移動し、format@@1を選択します。

```console
コンソール分析を増幅する
```

次のステップ:

おめでとうございます! これで、Analytics のバックエンドプロビジョニングとAnalytics ライブラリがインストールされました。Amplify Analytics のユースケースを参照するには、次のリンクを参照してください。

* [イベントを記録](~/lib/analytics/record.md)
* [セッションを追跡](~/lib/analytics/autotrack.md)
* [ユーザーを識別する](~/lib/analytics/identifyuser.md)
* [脱出ハッチ](~/lib/analytics/escapehatch.md)
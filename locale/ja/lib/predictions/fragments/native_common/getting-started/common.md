The Predictions category enables you to integrate machine learning into your application without any prior machine learning experience. It supports translating text from one language to another, converting text to speech, text recognition from an image, entities recognition, labeling real world objects, interpretation of text, and uploading images for automatic training. This functionality is powered by AWS services including: [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html), [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html), [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is-transcribe.html), [Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html), [Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html), and [Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html).

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/10_coreml.md"></inline-fragment>

## 目標

Amplify Predictionsを使用してアプリケーションをセットアップおよび設定し、テキストを翻訳する簡単な例を説明します。

## 前提条件

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/20_preReq.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/predictions/fragments/android/getting-started/20_preReq.md"></inline-fragment>

## バックエンドサービスの提供

予測カテゴリを使用するには、認証バックエンドリソースをセットアップする必要があります。 バックエンドで認証リソースをプロビジョニングするには、プロジェクトディレクトリに移動し、 **コマンド** を実行します。

```bash
amplifyの追加予測
```

プロンプトが表示されたら以下を入力します:

```console
? Please select from one of the categories below
    `Convert`
? You need to add auth (Amazon Cognito) to your project in order to add storage for user files. Do you want to add auth now? (Y/n) 
    `Y`
? Do you want to use the default authentication and security configuration?
    `Default configuration`
? How do you want users to be able to sign in?
    `Email`
? Do you want to configure advanced settings?
    `No, I am done.`
? What would you like to convert?
    `Translate text into a different language`
? Provide a friendly name for your resource
    `transTextSample`
? What is the source language?
    `English`
? What is the target language?
    `Italian`
? Who should have access?
    ` Auth and Guest users`
```

このステージで選択された言語は、アプリが翻訳元のデフォルト言語になりますのでご注意ください。 これらのソース言語とターゲット言語は、アプリケーションでコードを書くときに上書きすることができます。

クラウドに変更をプッシュするには、 **コマンド** を実行します。

```bash
push を増幅する
```

完了すると、 `amplifyconfiguration.json` が新しくプロビジョニングされたバックエンドリソースを参照するように更新されます。

## Amplifyライブラリのインストール

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/30_installLib.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/predictions/fragments/android/getting-started/30_installLib.md"></inline-fragment>

## Amplify予測を初期化

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/40_init.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/predictions/fragments/android/getting-started/40_init.md"></inline-fragment>

## テキストの翻訳

ある言語から別の言語にテキストを翻訳するには、翻訳したいテキスト、ソース言語、およびターゲット言語を指定します。 ソースとターゲット言語パラメータは、Amplify CLI を使用してこのリソースを追加する際に行った任意の選択を上書きします。

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/50_translate.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/predictions/fragments/android/getting-started/50_translate.md"></inline-fragment>

このコードを実行した結果、次のようにコンソールに表示されます。

```console
Me gusta comer espaguetis
```

## 次のステップ

おめでとうございます！ある言語から別の言語にテキストを翻訳しました。他のAmplify予測のユースケースを探索するには、次のリンクを参照してください。

<inline-fragment platform="ios" src="~/lib/predictions/fragments/ios/getting-started/60_nextSteps.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/predictions/fragments/android/getting-started/60_nextSteps.md"></inline-fragment>
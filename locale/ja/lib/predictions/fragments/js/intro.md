予測カテゴリは、アプリケーションを強化するためにAIとMLクラウドサービスを使用するためのソリューションを提供します。一部のサポートされているユースケース:

- ある言語から別の言語へのテキストの翻訳
- テキストを音声に変換中
- 画像からのテキスト認識
- エンティティ認識
- 実際のオブジェクトにラベル付け
- テキストの解釈
- 自動トレーニング用の画像をアップロードしています
- テキストを書き換え中

<br />
予測は大きく3つの重要なユースケースに分類されます - 識別、変換、。 クライアントAPIとCLIワークフローで利用可能なInterpret。   
<br /><br />

- `識別する` はテキスト(単語、表、本からのページ)、イメージからのエンティティ (顔や有名人) を見つけます。 また、椅子、机などの実際のオブジェクトを識別することもできます。これは画像から「ラベル」と呼ばれます。

- `` を使用すると、翻訳元の言語から翻訳先の言語にテキストを翻訳できます。 テキスト入力から音声音声を生成することもでき、最後にWebSocketストリームを使用して音声入力を転写することもできます。

- `解釈` では、言語、エンティティ (場所、人々) 、キーフレーズ、センチメント (正、中立、負)、および構文 (代名詞、動詞、形容詞) のテキストを解析できます。

一般的な使用事例は以下にリストされており、クライアントアプリケーションから動的なイメージインデックスを実行できる高度なワークフローがあります。

Predictions comes with built-in support for [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html), [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html), [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is-transcribe.html), [Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html), [Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html), and [Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html).

さらに、予測は、ネイティブ(iOS/Android)アプリケーションからSageMaker推論APIの一般的な呼び出しをサポートしています。
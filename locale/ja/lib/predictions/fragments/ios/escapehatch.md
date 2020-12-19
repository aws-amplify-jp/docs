利用できないAmplify予測カテゴリで使用されているAWSサービスの機能が必要な場合。 我々は脱出ハッチを提供しますあなたはそのサービスへの参照を得ることができます。 例えば、 `AWSRekognition` への参照を取得するには:

```swift
guard let predictionsPlugin = try Amplify.Predictions.getPlugin(for: "awsPredictionsPlugin") as? AWSPredictionsPlugin else {
    print("Unable to cast to AWSPredictionsPlugin")
    return
}

guard let rekognitionService = predictionsPlugin.getEscapeHatch(key: .rekognition) as? AWSRekognition else {
    print("Unable to get AWSRekognition")
    return
}

let request = AWSRekognitionCreateCollectionRequest()
if let request = request {
    rekognitionService.createCollection(request)
}
```

In addition to `AWSRekognition`, this same pattern can be used to get access to `AWSTranslate`, `AWSPolly`, `AWSTranscribeStreaming`, `AWSComprehend`, and `AWSTextract`.  For example:
```swift
guard let translateService = predictionsPlugin.getEscapeHatch(key: .translate) as? AWSTranslate else {
    print("Unable to get AWSTranslate")
    return
}

guard let pollyService = predictionsPlugin.getEscapeHatch(key: .polly) as? AWSPolly else {
    print("Unable to get AWSPolly")
    return
}

guard let transcribeService = predictionsPlugin.getEscapeHatch(key: .transcribe) as? AWSTranscribeStreaming else {
    print("Unable to get AWSTranscribeStreaming")
    return
}

guard let comprehendService = predictionsPlugin.getEscapeHatch(key: .comprehend) as? AWSComprehend else {
    print("Unable to get AWSComprehend")
    return
}

guard let textractService = predictionsPlugin.getEscapeHatch(key: .textract) as? AWSTextract else {
    print("Unable to get AWSTextract")
    return
}
```

**APIドキュメントのリソース**
* [Amazon Rekognition API Reference](https://docs.aws.amazon.com/rekognition/latest/dg/API_Reference.html)
* [Amazon Translate API リファレンス](https://docs.aws.amazon.com/translate/latest/dg/API_Reference.html)
* [Amazon Polly APIリファレンス](https://docs.aws.amazon.com/polly/latest/dg/API_Reference.html)
* [Amazon Transscribe API Reference](https://docs.aws.amazon.com/transcribe/latest/dg/API_Reference.html)
* [Amazon Compreview API Reference](https://docs.aws.amazon.com/comprehend/latest/dg/API_Reference.html)
* [Amazon Textract API Reference](https://docs.aws.amazon.com/textract/latest/dg/API_Reference.html)

利用できないAmplify予測カテゴリで使用されているAWSサービスの機能が必要な場合。 我々は脱出ハッチを提供しますあなたはそのサービスへの参照を得ることができます。 例えば、 `AmazonRekognitionClient` への参照を取得するには :

<amplify-block-switcher> <amplify-block name="Java">

```java
// Obtain reference to the plugin
AWSPredictionsPlugin predictionsPlugin = (AWSPredictionsPlugin)
        Amplify.Predictions.getPlugin("awsPredictionsPlugin");
AWSPredictionsEscapeHatch escapeHatch = predictionsPlugin.getEscapeHatch();

// Send a new request to the Rekognition endpoint directly using the client
AmazonRekognitionClient client = escapeHatch.getRekognitionClient();
CreateCollectionRequest request = new CreateCollectionRequest()
        .withCollectionId("<new-collection-id-here>");
client.createCollection(request);
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
// Obtain reference to the plugin
val predictionsPlugin = Amplify.Predictions.getPlugin("awsPredictionsPlugin") as AWSPredictionsPlugin
val escapeHatch = predictionsPlugin.escapeHatch

// Send a new request to the Rekognition endpoint directly using the client
val client = escapeHatch.rekognitionClient
val request = CreateCollectionRequest().withCollectionId("<new-collection-id-here>")

client.createCollection(request)
```

</amplify-block> </amplify-block-switcher>

**APIドキュメントのリソース**

* [Amazon Rekognition API Reference](https://docs.aws.amazon.com/rekognition/latest/dg/API_Reference.html)
* [Amazon Translate API リファレンス](https://docs.aws.amazon.com/translate/latest/dg/API_Reference.html)
* [Amazon Polly APIリファレンス](https://docs.aws.amazon.com/polly/latest/dg/API_Reference.html)
* [Amazon Compreview API Reference](https://docs.aws.amazon.com/comprehend/latest/dg/API_Reference.html)
* [Amazon Textract API Reference](https://docs.aws.amazon.com/textract/latest/dg/API_Reference.html)
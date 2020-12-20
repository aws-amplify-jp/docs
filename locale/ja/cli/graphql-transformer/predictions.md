---
title: 機械学習サービスを接続
description: '@predictionディレクティブでは、Amazon Rekognition、Amazon Translate、Amazon PollyなどのAI/MLサービスのオーケストレーションをクエリできます。'
---

## @predictions

`@予測` ディレクティブを使用すると、Amazon Rekognition、Amazon Translate、Amazon PollyなどのAI/MLサービスのオーケストレーションをクエリすることができます。

> Note: Support for adding the `@predictions` directive uses the s3 storage bucket which is configured via the CLI. At the moment this directive works only with objects located within `public/`.

### 定義

このディレクティブでサポートされているアクションは定義に含まれています。

```graphql
  @predictions(actions: [PredictionsActions!]! on FIELD_DEFINITION
  enum PredictionsActions {
    identifyText # uses Amazon Rekognition to detect text
    identifyLabels # uses Amazon Rekognition to detect labels
    convertTextToSpeech # uses Amazon Polly in a lambda in a lambda to output a presigned url to composized speak
    translateText # uses Amazon Translate to translate text from source to target language
}
```

### 使用法


次のスキーマを指定すると、指定されたイメージに対して以下の操作を行うクエリ操作が定義されます。

- 画像からテキストを識別する
- その画像からテキストを翻訳
- 翻訳されたテキストからスピーチを合成します。

```graphql
type Query {
  speakTranslatedImageText: String @predictions(actions: [
    identifyText
    translateText
    convertTextToSpeech
  ])
}
```

そのクエリの例は以下のようになります:

```graphql
query SpeakTranslatedImageText($input: SpeakTranslatedImageTextInput!) {
  speakTranslatedImageText(input: {
    identifyText: {
      key: "myimage.jpg"
    }
    translateText: {
      sourceLanguage: "en"
      targetLanguage: "es"
    }
    convertTextToSpeech: {
      voiceID: "Conchita"
    }
  })
}
```

JSライブラリを使用するコード例:
```js
import React, { useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { speakTranslatedImageText } from './graphql/queries';

/* Configure Exports */
Amplify.configure(awsconfig);

function SpeakTranslatedImage() {
  const [ src, setSrc ] = useState("");
  const [ img, setImg ] = useState("");

  function putS3Image(event) {
    const file = event.target.files[0];
    Storage.put(file.name, file)
    .then (async (result) => {
      setSrc(await speakTranslatedImageTextOP(result.key))
      setImg(await Storage.get(result.key));
    })
    .catch(err => console.log(err));
  }

  return (
    <div className="Text">
      <div>
        <h3>Upload Image</h3>
        <input
              type = "file" accept='image/jpeg'
              onChange = {(event) => {
                putS3Image(event)
              }}
          />
        <br />
        { img && <img src = {img}></img>}
        { src &&
          <div> <audio id="audioPlayback" controls>
              <source id="audioSource" type="audio/mp3" src = {src}/>
          </audio> </div>
        }
      </div>
    </div>
  );
}

async function speakTranslatedImageTextOP(key) {
  const inputObj = {
    translateText: {
      sourceLanguage: "en", targetLanguage: "es" },
    identifyText: { key },
    convertTextToSpeech: { voiceID: "Conchita" }
  };
  const response = await API.graphql(
    graphqlOperation(speakTranslatedImageText, { input: inputObj }));
  return response.data.speakTranslatedImageText;
}
function App() {
  return (
    <div className="App">
        <h1>Speak Translated Image</h1>
        < SpeakTranslatedImage />
    </div>
  );
}
export default App;
```

### 仕組み
From example schema above, `@predictions` will create resources to communicate with Amazon Rekognition, Translate and Polly. For each action the following is created:

- 各サービスのIAMポリシー (例: Amazon Rekognition `detectText` Policy)
- AppSync VTL 関数
- AppSync のデータソース

最後に、 `speakTranslatedImageText` 用にリゾルバが作成されます。これは、ディレクティブに提供されているアクションリストで定義された AppSync 関数で構成されたパイプラインリゾルバです。

### アクション
@prediction定義セクションで説明されている各アクションは、シーケンスと同様に個別に使用できます。 現在サポートされているアクションのシーケンスは次のとおりです:

- `identifyText -> translateText -> convertTextToSpeech`
- `identifyLabels -> translateText -> convertTextToSpeech`
- `translateText -> convertTextToSpeech`


### アクションリソース
- [`translateText` 対応言語コード](https://docs.aws.amazon.com/translate/latest/dg/what-is.html#what-is-languages)
- [`convertTextToSpeech` 音声IDをサポート](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html)

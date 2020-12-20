## バックエンドの設定

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **識別**を選択します。その後、次の答えを使用します:

```console
? What would you like to identify? (Use arrow keys)
❯ Identify Text 
  Identify Entities 
  Identify Labels 
  Learn More 

? Would you also like to identify documents? Yes
? Who should have access? Auth and Guest users
```

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

使用するサービス: Amazon Rekognition（プレーンテキストの場合はデフォルト）とAmazon Textract（ドキュメントの場合はデフォルト）

## API の操作

入力画像内のテキストを検出します。入力はブラウザから直接、またはプロジェクトバケットからAmazon S3キーを送信できます。

```javascript
Predictions.identify({
    text: {
        source: {
            file
        }
    }
})
.then(response => console.log({ response }))
.catch(err => console.log({ err }));
```

## Amazon S3 に保存されている画像を識別します

```javascript
Predictions.identify({
    text: {
        source: {
            key: pathToPhoto,
            level?: 'public | private | protected', //optional, default is the configured on Storage category
        }
    }
})
.then((response) => console.log({ response }))
.catch(err => console.log({ err }));
```

> The following options are independent of which `source` is specified. For demonstration purposes we will reference a `file` but it can be an S3 Key as well. `Predictions.identify({text : {...}})` can detect unstructured text `PLAIN`, structured text from tables `TABLE` or text from forms `FORM`.

## プレーンテキストを識別する

プレーンテキストを検出するために、検出されたテキスト全体、検出された行、テキストの各行の位置、および各単語を見ることができます。

```javascript
Predictions.identify({
    text: {
        source: {
            file
        },
        format: "PLAIN", 
    }
})
.then(response => {
    const {
        text: {
            fullText, // String
            lines, // Array of String ordered from top to bottom
            linesDetailed: [
                {
                    /* array of
                    text, // String
                    boundingBox: {
                        width, // ratio of overall image width
                        height, // ratio of overall image height
                        left, // left coordinate as a ratio of overall image width
                        top // top coordinate as a ratio of overall image height
                    },
                    polygon // Array of { x, y } coordinates as a ratio of overall image width and height
                    */
                }
            ],  
            words // Array of objects that contains { text, boundingBox, polygon} 
        }
    } = response
})
.catch(err => console.log({ err }));
```

## 構造化されたフォームを特定

構造化されたフォーム（文書、表など）を検出するために。 イメージから得られるものです `keyValues` は、画像内で見つかった文字列と、選択されたチェックボックスや画像内の相対位置などのメタデータを、 `boundingBox` を使用して返します。

```javascript
Predictions.identify({
    text: {
        source: {
            file
        },
        format: "FORM", 
    }
})
.then(response => {
    const {
        text: { 
            // same as PLAIN +
            keyValues  // Array of { key (String), value: { text (String), selected (boolean)}, polygon, boundingBox } 
        }    
    } = response
})
.catch(err => console.log({ err }));
```

For example the below image would return `keyValues` with "Test" or "Checked" as a key, and `true` since they are selected. The location of these elements would be returned in the `boundingBox` value.

![画像](~/images/IdentifyTable.png)

## 構造化テーブルを識別する

画像から構造化されたテーブルを検出するためのツールです。
```javascript
Predictions.identify({
    text: {
        source: {
            file
        },
        format: "TABLE", 
    }
})
.then(response => {
    const {
        text: { 
            // same as PLAIN +
            tables : [
                {
                    size: { rows, columns }, 
                    table // Matrix Array[ Array ] of size rows
                    // each element of the array contains { text, boundingBox, polygon, selected, rowSpan, columnSpan}
                }
            ]
        }    
    } = response
})
.catch(err => console.log({ err }));
```

画像上のテーブルとフォームを検出するには、フォーマット"ALL"を選択してください。
```javascript
Predictions.identify({
    text: {
        source: {
            file
        },
        format: "ALL", 
    }
})
.then(response => {
    const {
        text: { 
            // same as PLAIN + FORM + TABLE
        }    
    } = response
})
.catch(err => console.log({ err }));
```

#### 写真からエンティティを識別する

Setup your backend with the following: If you haven't already done so, run `amplify init` inside your project and then `amplify add auth` (we recommend selecting the *default configuration*).

`増幅して予測を追加する` を実行し、 **識別**を選択します。その後、次の答えを使用します:

```console
? What would you like to identify? 
  Identify Text 
❯ Identify Entities 
  Identify Labels 
  Learn More 

? Would you like use the default configuration? Default Configuration

? Who should have access? Auth and Guest users
```

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

使用されるサービス: Amazon Rekognition

**高度な構成**

あらかじめ定義された画像のコレクションに対して [インデックスを作成し、Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/API_IndexFaces.html)に提供することで、アプリケーションのエンティティを識別する能力を高めることができます。 これは以下のいずれかの方法で行うことができます。
1. 管理者はS3バケットからインデックスされる画像を提供します
2. アプリのユーザーはインデックス化されたS3バケットにファイルをアップロードします

Amplifyは、ファイルがアップロードされたときにこのインデックスを自動的に実行するようにLambda Triggersを設定します。 Rekognitionは顔を格納しないので、むしろ顔の特徴はバックエンドに格納されるベクトルに格納されます。 これらの画像は、インデックス作成後に削除できます。 ただし、デフォルトでは、画像を削除すると、Lambda Triggersはインデックスを削除しますので、この機能を使用する場合は動作を変更する必要があります。

この機能をアプリケーションに追加するには、 **** で **** フローを識別する (既に有効になっている場合 `エンティティを識別する` を実行する必要があります `増幅更新予測`):

```console
? What would you like to identify? Identify Entities
? Would you like use the default configuration? Advanced Configuration
? Would you like to enable celebrity detection? Yes
? Would you like to identify entities from a collection of images? Yes
? How many entities would you like to identify 50
? Would you like to allow users to add images to this collection? Yes
? Who should have access? Auth and Guest users
? The CLI would be provisioning an S3 bucket to store these images please provide bucket name: mybucket
```

Note that if you already have an S3 bucket in your project from running `amplify add storage` it would be reused. To upload images from the CLI for administrator indexing, you can run `amplify predictions console` and select `Identify` which will open the S3 bucket location in the AWS console for you to upload your images.

アプリケーションユーザーの場合、 `Storage.put()` で画像をアップロードすると、Lambda 関数がインデックス作成を行うプレフィックスを指定します。

```javascript
Storage.put('test.jpg', file, 
  {
    level: 'protected',
    customPrefix: {
      protected: 'protected/predictions/index-faces/',
    }
});
```

In the sample React application code below, you will see that to use this functionality you will need to set `collection:true` when calling `Predictions.identify()` and remove `celebrityDetection: true`. The flow is that you will first upload an image to S3 with the `PredictionsUpload` function (which is connected to a button in the app) and after a few seconds you can send this same image to `Predictions.identify()` and it will check if that image has been indexed in the Collection.

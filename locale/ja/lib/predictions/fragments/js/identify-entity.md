## 画像からエンティティを識別する

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

### 高度な構成

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

In the sample React application code ahead, you will see that to use this functionality you will need to set `collection:true` when calling `Predictions.identify()` and remove `celebrityDetection: true`. The flow is that you will first upload an image to S3 with the `PredictionsUpload` function (which is connected to a button in the app) and after a few seconds you can send this same image to `Predictions.identify()` and it will check if that image has been indexed in the Collection.

## API の操作

`Predictions.identify({entities: {...}}) => Promise<>` Detects entities from an image and potentially related information such as position, faces, and landmarks. Can also identify celebrities and entities that were previously added. This function returns a Promise that returns an object with the entities that was identified.

入力はブラウザから直接、またはプロジェクトバケットからAmazon S3キーを送信することができます。

ブラウザーからアップロードされた画像から直接エンティティを検出します。(ファイルオブジェクト)

```javascript
Predictions.identify({
  entities: {
    source: {
      file,
    },
  }
})
. hen((response) => console.log({ response }))
.catch(err => console.log({ err }));
```

Amazon S3 キーから
```javascript
Predictions.identify({
  entities: {
    source: {
      key: pathToPhoto,
      level: 'public | private | protected', //optional, default is the configured on Storage category
    },
  }
})
.then((response) => console.log({ response }))
.catch(err => console.log({ err }));
```

The following options are independent of which `source` is specified. For demonstration purposes it will be used `file` but it can be used S3 Key as well.

目印(目、口、鼻)のある画像から面の境界ボックスを検出。

```javascript
Predictions.identify({
  entities: {
    source: {
      file,
    },
  }
})
.then(({ entities }) => {
  entities.forEach(({boundingBox, landmarks}) => {
    const { 
      width, // ratio of overall image width
      height, // ratio of overall image height
      left, // left coordinate as a ratio of overall image width
      top // top coordinate as a ratio of overall image height
    } = boundingBox;
    landmarks.forEach(landmark => {
        const {
            type, // string "eyeLeft", "eyeRight", "mouthLeft", "mouthRight", "nose"
            x, // ratio of overall image width
            y // ratio of overall image height
        } = landmark;
    })
  })
})
.catch(err => console.log({ err }));
```

画像上の有名人を検出します。有名人だけが関連情報を持つ名前とURLを返します。

```javascript
Predictions.identify({
  entities: {
    source: {
      file,
    },
    celebrityDetection: true // boolean. It will only show detected celebrities 
  }
})
.then(({ entities }) => {
  entities.forEach(({ boundingBox, landmarks, metadata }) => {
    const { 
        name,
        urls 
    } = metadata; // celebrity info

    // ...
  })
})
.catch(err => console.log({ err }));
```

以前にアップロードした画像からエンティティを検出する（エンティティを識別するための詳細設定など）

```javascript
Predictions.identify({
  entities: {
    source: {
      file,
    },
    collection: true
  }
})
.then(({ entities }) => {
  entities.forEach(({ boundingBox, metadata: { externalImageId } }) => {
    const {
      width, // ratio of overall image width
      height, // ratio of overall image height
      left, // left coordinate as a ratio of overall image width
      top // top coordinate as a ratio of overall image height
    } = boundingBox;
    console.log({ externalImageId }); // this is the object key on S3 from the original image!

    Storage.get("", {
        customPrefix: {
        public: externalImageId
        },
        level: "public",
    }).then(src => console.log({ src }));
  })
})
.catch(err => console.log(err));
```

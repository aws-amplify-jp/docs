## バックエンドのセットアップ

まだ実行していない場合 プロジェクト内で `amplify init` を実行し、 `増幅して認証を追加` します(デフォルトの設定 *を選択することをお勧めします*)。

`増幅して予測を追加する` を実行し、 **識別**を選択します。その後、次の答えを使用します:

```console
? What would you like to identify? 
  Identify Text 
  Identify Entities 
❯ Identify Labels 
  Learn More 

? Would you like use the default configuration? (Use arrow keys)
❯ Default Configuration 
  Advanced Configuration 

? Who should have access? Auth and Guest users
```

高度な設定では、安全でないコンテンツまたは特定されたラベルのすべてのモデレーションを選択できます。デフォルトでは両方を使用します。

Now run `amplify push` which will generate your `aws-exports.js` and create resources in the cloud. You can now either add this to your backend or skip and add more features to your app.

使用されるサービス: Amazon Rekognition

## API の操作

画像に机や椅子がある場合など、ラベルを検出します。

```javascript
Predictions.identify({
    labels: {
        source: {
            file,
        },
        type: "LABELS"
    }
})
.then(response => {
    const { labels } = response;
    labels.forEach(object => {
        const { name, boundingBoxes } = object
    });
})
.catch(err => console.log({ err }));
```

画像内の安全でないコンテンツを検出する

```javascript
Predictions.identify({
    labels: {
        source: {
            file,
        },
        type: "UNSAFE"
    }
})
.then(response => {
    const { unsafe } = response; // boolean 
})
.catch(err => console.log({ err }));
```

ラベルと安全でないコンテンツの両方に
```javascript
Predictions.identify({
    labels: {
        source: {
            file,
        },
        type: "ALL"
    }
})
.then(response => {
    const { labels } = response;
    const { unsafe } = response; // boolean 
    labels.forEach(object => {
        const { name, boundingBoxes } = object
    });
})
.catch(err => console.log({ err });
```

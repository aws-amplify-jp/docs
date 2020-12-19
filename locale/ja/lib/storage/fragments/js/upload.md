## Put
`Put` メソッドはファイルを Amazon S3 にアップロードします。

It returns a `{key: S3 Object key}` object on success:

```javascript
Storage.put('test.txt', 'Hello')
    .then (result => console.log(result)) // {key: "test.txt"}
    .catch(err => console.log(err));
```

### パブリックレベル

```javascript
Storage.put('test.txt', 'Hello')
    .then (result => console.log(result))
    .catch(err => console.log(err));
```

### 保護レベル

```javascript
Storage.put('test.txt', 'Protected Content', {
    level: 'protected',
    contentType: 'text/plain'
})
.then (result => console.log(result))
.catch(err => console.log(err));
```

### プライベートレベル

```javascript
Storage.put('test.txt', 'Private Content', {
    level: 'private',
    contentType: 'text/plain'
})
.then (result => console.log(result))
.catch(err => console.log(err));
```

### アップロードの進捗状況をモニターする

アップロードの進行状況を追跡するには、 `progressCallback` を使用します。

```javascript
Storage.put('test.txt', 'File content', {
    progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
  },
});
```
### 暗号化されたアップロード

AWS KMS でサーバー側暗号化を利用するには、Put API で次のようなオプションを渡すことができます。

```javascript
const serverSideEncryption = AES256 | aws:kms;
const SSECustomerAlgorithm = 'string';
const SSECustomerKey = new Buffer('...') || 'string';
const SSECustomerKeyMD5 = 'string';
const SSEKMSKeyId = 'string';
Storage.put('test.txt', 'File content', {
    serverSideEncryption, SSECustomerAlgorithm, SSECustomerKey, SSECustomerKeyMD5, SSEKMSKeyId
})
.then (result => console.log(result))
.catch (err => console.log(err));
```

他のオプションは以下のとおりです:

```javascript
Storage.put('test.txt', 'My Content', {
    acl: 'public-read', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    cacheControl: '', // (String) Specifies caching behavior along the request/reply chain
    contentDisposition: '', // (String) Specifies presentational information for the object
    expires: new Date().now() + 60 * 60 * 24 * 7, // (Date) The date and time at which the object is no longer cacheable. ISO-8601 string, or a UNIX timestamp in seconds
    metadata: { key: 'value' }, // (map<String>) A map of metadata to store with the object in S3.
})
.then (result => console.log(result))
.catch(err => console.log(err));
```

## ブラウザのアップロード
ブラウザーに画像をアップロード:

```javascript
class S3ImageUpload extends React.Component {
  onChange(e) {
      const file = e.target.files[0];
      Storage.put('example.png', file, {
          contentType: 'image/png'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
      return (
          <input
              type="file" accept='image/png'
              onChange={(evt) => this.onChange(evt)}
          />
      )
  }
}
```

## React Native のアップロード
React Native アプリに画像をアップロードしてください：

```javascript
uploadToStorage = async pathToImageFile => {
  try {
    const response = await fetch(pathToImageFile)

    const blob = await response.blob()

    Storage.put('yourKeyHere.jpeg', blob, {
      contentType: 'image/jpeg',
    })
  } catch (err) {
    console.log(err)
  }
}
```

アップロード中にネットワークエラーが発生した場合、Storageモジュールは最大4回のアップロードを再試行します。 すべての再試行後にアップロードに失敗すると、エラーが発生します。

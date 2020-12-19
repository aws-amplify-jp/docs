## 取得

保存されたファイルの URL を事前に取得します。 いくつかのオプションを指定できます: 主に [ファイルアクセス `レベル`](https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js) と `ファイルをダウンロード` するかどうか:

```typescript
await Storage.get(key: string, config: {
  level?: private | protected | public, // defaults to `public`
  identityId?: string, // id of another user, if `level: protected`
  download?: boolean, // defaults to false
  expires?: number, // validity of the URL, in seconds. defaults to 900 (15 minutes)
  contentType?: string // set return content type, eg "text/html"
})
```

`Storage.get` returns a signed URL `string` to your file, if `download` is false, which is the default. You can use this to create a download link for people to click on. This is our recommended option. Note that this method **does not check if the file actually exists** as that would involve an extra API call.

```js
// signed URL string
const signedURL = await Storage.get(key) // get key from Storage.list

// inside your template or JSX code. メモ 
 は同じ原点ではないため、ここでは動作しません 

 <a download>
<a href={signedURL} target="_blank">{fileName}</a>
```

If `download` is true, `Storage.get` returns an object with a `Body` field of type [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). It is up to you to programmatically save it to disk (we suggest a method below) or do whatever else you need with it.

### ファイルダウンロードオプション

`ダウンロード` オプションは、ダウンロードまたはプログラム操作のためのオブジェクト データを送信します。

```javascript
const data = await Storage.get(`filename.txt`, { download: true })

// data.Body is a Blob
data. ody.text().then(string => { 
  // String data return String 
})
```

Note that the `Blob` methods like `.text()` are not supported on [IE/Opera/Safari](https://developer.mozilla.org/en-US/docs/Web/API/Blob/text); in those cases you can [parse manually](https://developer.mozilla.org/en-US/docs/Web/API/Blob#JavaScript).

JavaScriptを使用してBlobsをプログラム的にダウンロードできます。

```js
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);
  a.click();
  return a;
}

// usage
Storage.get(fileKey, { download: true })
        .then(res => downloadBlob(res.Body, downloadFileName)) // derive downloadFileName from fileKey if you wish
```

`Storage.get(key, { download: true })` の完全な戻り値の署名は次のようになります。

```js
{
  $metadata: {
    attempts: 1
    httpHeaders: {content-length: "388187", content-type: "audio/x-m4a", last-modified: "Fri, 09 Oct 2020 14:29:13 GMT", x-amz-id-2: "/rRqsX/c2h5V00tYMtDY994wEenyPm0SDw1lyWyncWepyg+T6YJJSjLHKIsz0dxMI3kN5KjA6GQ=", …}
    httpStatusCode: 200
    requestId: undefined
    totalRetryDelay: 0
  },
  Body: Blob {size: 388187, type: "audio/x-m4a"}, // this will vary
  ContentLength: 388187,
  ContentType: "audio/x-m4a",
  ETag: ""c05e324f61613c2472d47a8ee6fbb628"",
  LastModified: Fri Oct 09 2020 22:29:13 GMT+0800 (Singapore Standard Time) {},
  Metadata: {},
  __type: "GetObjectOutput",
}
```

### ファイルアクセスレベル：

事前にアクセスレベルを設定するか、 `Storage.get` を呼び出す時点で設定できます。

```javascript
// Option 1: configure access ahead of time
Storage.configure({ level: 'private' });
await Storage.get('welcome.png'); // Gets the welcome.png belonging to current user


// Option 2: configure access inside the call
await Storage.get('welcome.png', { level: 'private' }); // same effect
```

アクセスレベルのクイックガイドはこちらです - [詳細はドキュメント](https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js) を参照してください：

- `public`: Accessible by all users of your app. Files are stored under the `public/` path in your S3 bucket.
- `protected`: Readable by all users, but writable only by the creating user. Files are stored under `protected/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user. **:**

    ```javascript
    // To get current user's objects
    await Storage.get('filename.txt', { level: 'protected' })
    // To get other users' objects
    await Storage.get('filename.txt', { 
        level: 'protected', 
        identityId: 'xxxxxxx' // the identityId of that user
    })
    ```
- `private`: **Only accessible for the signed in user**. Files are stored under `private/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user.


### ダウンロードの有効期限

`expires` オプションを使用して、URL の可用性を制限できます。この設定は、60 秒後に有効期限が切れる事前署名 URL を返します:

```javascript
await Storage.get('filename.txt', { expires: 60 })
```


### よく寄せられる質問

ユーザーは予期しない問題に遭遇する可能性があります。 オープンな問題へのリンクが記載されているドキュメントに事前通知します - 必要なものに投票してください チームの優先順位を高めるために

- Very common issue: Calling `Storage.get` for a nonexistent file, or incorrect credentials, **does not throw an error** because that would involve an extra API call. [Active issue here](https://github.com/aws-amplify/amplify-js/issues/1145). If you are having trouble accessing a file, make sure to check that you have the right filename, bucket, region, and auth configs. You can get a current list of files from `Storage.list`.
- `Storage.get` is cached; if you have recently modified a file you may not get the most recent version right away. [There is an active issue for a new option to enable cache busting.](https://github.com/aws-amplify/amplify-js/issues/6413)
- `Storage.get` は最新のキャッシュされたファイルのみを返します。 [以前のバージョンを表示する API はまだありません](https://github.com/aws-amplify/amplify-js/issues/2131)。
- ダウンロードの進捗状況の追跡はまだできません。 [](https://github.com/aws-amplify/amplify-js/issues/4734).
- [ファイルメタデータ](https://github.com/aws-amplify/amplify-js/issues/6157) のみを取得できません。
- [画像圧縮](https://github.com/aws-amplify/amplify-js/issues/6081) または S3バケット用のCloudFront CDNキャッシュはまだ不可能です。
- [Cognito グループベースのファイル](https://github.com/aws-amplify/amplify-js/issues/3388) へのアクセス用 API はありません。
- There is currently [no API for getting the identityId of other users](https://github.com/aws-amplify/amplify-js/issues/5177); you have to retrieve this from elsewhere before calling `Storage.get`.

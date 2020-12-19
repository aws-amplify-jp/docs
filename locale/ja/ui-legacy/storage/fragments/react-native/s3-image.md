`S3Image` コンポーネントは、 *Amazon S3 オブジェクトキー* を画像としてレンダリングします。

```jsx
import { S3Image } from 'aws-amplify-react-native';

render() {
    return <S3Image imgKey={key} />
}
```

プライベートイメージの場合、 `レベル` プロパティを指定してください。

```jsx
<S3Image level="private" imgKey={key} /> を返す
```

他のユーザーの保護された画像を表示するには、そのユーザーの `identityId` プロパティを指定してください。

```jsx
<S3Image level="protected" identityId={identityId} imgKey={key} /> を返す
```

アップロードを開始するには、 `body` プロパティを設定します。

```jsx
import { S3Image } from 'aws-amplify-react';

render() {
    return <S3Image imgKey={key} body={this.state.image_body} />
}

```

S3Imageに表示されている画像を非表示にするには、 `hidden` を設定してください。

```jsx
import { S3Image } from 'aws-amplify-react';

render() {
    return <S3Image hidden imgKey={key} />
}
```

**画像URL**

`S3Image` は実際の URL にパスを変換します。URL を取得するには、 `onLoad` イベントを待ちます。

```jsx
<S3Image imgKey={key} onLoad={url => console.log(url)} />
```

**写真の選択**

Set `picker` property to true on `S3Image`. A `PhotoPicker` let the user pick a picture from the device. After users picks an image, the image will be uploaded with `imgKey`.

```jsx
<S3Image imgKey={key} picker />
```

When you set `path`, the *key* for the image will be the combination of `path` and image file name.

```jsx
<S3Image path={path} picker />
```

カスタムキー値を生成するには、以下のようにコールバックを提供できます。

```jsx
function fileToKey(data) {
    const { name, size, type } = data;
    return 'test_' + name;
}

...
<S3Image path={path} picker fileToKey={fileToKey} />
```

<amplify-callout>

`S3Image` は、アンダースコアにするためにキー値のすべてのスペースをエスケープします。例えば、'a b' は 'a_b' に変換されます。

</amplify-callout>

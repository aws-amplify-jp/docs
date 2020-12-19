`S3Album` は `S3Image` と `S3Text` オブジェクトのリストをレンダリングします:

![画像](~/images/S3Album_and_code.png)

```jsx
import { S3Album } from 'aws-amplify-react-native';

render() {
    return <S3Album path={path} />
```

プライベートオブジェクトを表示するには、 `レベル` プロパティを指定します。

```jsx
<S3Album level="private" path={path} /> を返す
```

他のユーザーの保護されたオブジェクトを表示するには、そのユーザーの `identityId` プロパティも指定してください:

```jsx
<S3Album level="protected" identityId={identityId} path={path} /> を返す
```

`filter` プロパティを使ってアルバムのパスをカスタマイズできます:

```jsx
return (
    <S3Album
        level="private"
        path={path}
        filter={(item) => /jpg/i.test(item.path)}
    />
);
```

**ピッカー**

Set `picker` property to true on `S3Album`. A `Picker` let user select photos or text files from the device. The selected files will be automatically uploaded to the `path`.

```jsx
<S3Album path={path} picker />
```

デフォルトでは、写真ピッカーはファイル名をキーとしてS3に画像を保存します。カスタムキーを使用するには、コールバックを提供できます。

```jsx
function fileToKey(data) {
    const { name, size, type } = data;
    return 'test_' + name;
}

...
    <S3Album path={path} picker fileToKey={fileToKey} />
```
<amplify-callout>

`S3Album` は、アンダースコアを得るためにキー値のすべてのスペースをエスケープします。例えば、'a b' は 'a_b' に変換されます。

</amplify-callout>
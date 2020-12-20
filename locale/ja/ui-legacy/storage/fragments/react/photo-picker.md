`Picker` is used to pick a file from local device storage. `PhotoPicker` and `TextPicker` components are specific to image and text file types .

![画像](~/images/photo_picker_and_code.png)

`PhotoPicker` onPick イベントを聞く:
```jsx
import { PhotoPicker } from 'aws-amplify-react';

render() {
    <PhotoPicker onPick={data => console.log(data)} />
}
```

プレビューを表示するには、 `preview` ディレクティブを使用します。

```jsx
<PhotoPicker preview onLoad={dataURL => console.log(dataURL)} />
```

`onLoad` アクションを実装することで、画像の URL を取得できます。この場合、プレビューを非表示にすることもできます。

```jsx
<PhotoPicker preview="hidden" onLoad={dataURL => console.log(dataURL)} />
```

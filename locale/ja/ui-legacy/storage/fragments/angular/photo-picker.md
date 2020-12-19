Photo Pickerコンポーネントはローカル画像を選択し、Amazon S3にアップロードすることができるファイルアップロードコントロールをレンダリングします。 イメージが選択されると、base64 エンコードされたイメージプレビューが自動的に表示されます。 写真ピッカーを角度ビューでレンダリングするには、 *amplify-photo-picker* コンポーネントを使用します。

```html
<amplify-photo-picker 
    path="pics"
    (picked)="onImagePicked($event)"
    (loaded)="onImageLoaded($event)">
</amplify-photo-picker>
```

 - `(picked)` - 画像が選択されたときに発生します。イベントには、アップロードに使用できる `ファイル` オブジェクトが含まれます。
 - `(loaded)` - イメージのプレビューがレンダリングされ、表示されたときに発生します。
 - `path` - オプションの S3 イメージパス (prefix).
 - `storageOptions` - Storage.put リクエストの ‘options’ プロパティ内で渡されるオブジェクト。 これは、アップロードされるオブジェクトのパーミッション「レベル」プロパティを設定するために使用できます。つまり、「プライベート」、「保護」、または「パブリック」。

 [S3パーミッションの詳細については、こちらをご覧ください。](~/lib/storage/configureaccess.md)

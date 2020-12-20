PhotoPickerコンポーネントは、S3にアップロードするファイルを選択してプレビューすることができます。

使用法: `<amplify-photo-picker></amplify-photo-picker>`

設定:
```
<amplify-photo-picker v-bind:photoPickerConfig="photoPickerConfig"></amplify-photo-picker>
```

<inline-fragment framework="vue" src="~/ui-legacy/fragments/photo-picker-attributes.md"></inline-fragment>

storageOptions prop オブジェクトは .put リクエストに 'options' パラメータとして渡されます。 これは、アップロードされているオブジェクトの「レベル」を設定するために使用することができます(つまり、「保護」、「プライベート」、または「公開」)。

イベント:

* `AmplifyEventBus.$emit('fileUpload', img)`: ファイルがアップロードされたときに発生します (画像パスを含む)


### S3アルバム

S3Albumコンポーネントは、指定されたS3パスからイメージファイルを表示します。

使用法: `<amplify-s3-album path="uploads"></amplify-s3-album>`

プロパティ:

S3Albumコンポーネントは'path'プロパティを受け取ります(必須)。 また、「options」パラメータとして渡される s3AlbumConfig プロパティオブジェクトを受け入れることもできます。 et request. This can be used to set the 'level' of the objects being request(e.g. protected', 'private', or 'public').



イベント: なし
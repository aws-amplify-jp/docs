アルバムコンポーネントは、設定されたS3ストレージバケットからの画像のリストを表示します。Angularビューの *anplify-s3-album* コンポーネントを使用してください。

```html
<amplify-s3-album 
    path="pics" 
    (selected)="onAlbumImageSelected($event)">
</amplify-s3-album>
```
- `options` - .get 要求に「options」パラメーターとして渡されるオブジェクト。 これは、要求されるオブジェクトの「レベル」を設定するために使用することができます（例：「保護」、「プライベート」、または「公開」）
- `(selected)` - クリックした画像の S3 署名URL を取得するために使用されるイベント:

```javascript
onAlbumImageSelected( event ) {
      window.open( event, '_blank' );
}
```
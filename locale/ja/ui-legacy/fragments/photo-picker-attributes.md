<table>
    <thead>
      <tr>
        <th>属性</th>
        <th>タイプ</th>
        <th>説明</th>
        <th>デフォルト</th>
        <th>必須</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-column="Attribute">ヘッダー</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">コンポーネントヘッダー</td>
        <td data-column="Default">'ファイルアップロード'</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
          <td data-column="Attribute">タイトル</td>
          <td data-column="Type">文字列</td>
          <td data-column="Description">アップロードボタンに表示されるテキスト</td>
          <td data-column="Default">'アップロード'</td>
          <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">承認する</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">html 入力要素の ‘accept’ 属性を表す文字列</td>
        <td data-column="Default">'*/*'</td>
        <td data-column="Required">いいえ</td>
    </tr>
    <tr>
        <td data-column="Attribute">小道</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">ファイルアップロードのS3パス</td>
        <td data-column="Default">該当なし</td>
        <td data-column="Required">はい</td>
    </tr>
    <tr>
        <td data-column="Attribute">defaultName</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">S3にアップロードされたファイルの名前</td>
        <td data-column="Default">元のファイル名</td>
        <td data-column="Required">いいえ</td>
    </tr>
    <tr>
        <td data-column="Attribute">storageOptions</td>
        <td data-column="Type">オブジェクト</td>
        <td data-column="Description">s3カテゴリ関数に渡される options オブジェクト</td>
        <td data-column="Default">なし</td>
        <td data-column="Required">いいえ</td>
    </tr>
    </tbody>
</table>
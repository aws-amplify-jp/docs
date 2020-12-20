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
      <td data-column="Default">「新しいアカウントを作成」</td>
      <td data-column="Required">いいえ</td>
    </tr>
    <tr>
      <td data-column="Attribute">signUpFields</td>
      <td data-column="Type">配列</td>
      <td data-column="Description">下を参照</td>
      <td data-column="Default">下を参照</td>
      <td data-column="Required">いいえ</td>
    </tr>
    <tr>
      <td data-column="Attribute">defaultCountryCode</td>
      <td data-column="Type">文字列</td>
      <td data-column="Description">
        国コードドロップダウンで事前に選択されている値
      </td>
      <td data-column="Default">'1'</td>
      <td data-column="Required">いいえ</td>
    </tr>
    <tr>
      <td data-column="Attribute">hideAllDefaults</td>
      <td data-column="Type">boolean</td>
      <td data-column="Description">
        は、すべてのデフォルトのサインアップ項目を非表示にするかどうかを決定します。この
        は signUpFields 属性と組み合わせて機能します。
      </td>
      <td data-column="Default">
        signUpFields 属性がない場合、デフォルトは false になります
      </td>
      <td data-column="Required">いいえ</td>
    </tr>
    <tr>
      <td data-column="Attribute">hiddenDefaults</td>
      <td data-column="Type">配列</td>
      <td data-column="Description">
        特定のデフォルトフィールドを非表示にするかどうかを決定します
      </td>
      <td data-column="Default">
        該当なし ('username'、'password', 'phone_number',
        'email')
      </td>
      <td data-column="Required">いいえ</td>
    </tr>
  </tbody>
</table>
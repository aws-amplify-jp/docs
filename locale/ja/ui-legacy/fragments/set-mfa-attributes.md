<table>
    <thead>
      <tr>
        <th>属性</th>
        <th>タイプ</th>
        <th>説明</th>
        <th>デフォルト</th>
        <th>可能な値</th>
        <th>必須</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-column="Attribute">mfaDescription</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">ユーザー用のMFAの説明</td>
        <td data-column="Default">AWS Multi-Factor Authentication (MFA) は、ユーザー名とパスワードに追加の保護レイヤーを追加します。</td>
        <td data-column="Possible Values">該当なし</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">mfaTypes</td>
        <td data-column="Type">配列</td>
        <td data-column="Description">ラジオボタンの選択を引き起こすMFAタイプの配列</td>
        <td data-column="Default">[]</td>
        <td data-column="Possible Values">‘SMS’、‘TOTP’、‘None’</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">トークン説明</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">TOTP で使用する QR コードをデコードするための手順</td>
        <td data-column="Default">「携帯電話のカメラまたは認証アプリでQRコードをスキャンしてMFAコードを取得します。」  </td>
        <td data-column="Possible Values">該当なし</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">smsDescription</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">SMSラジオボタンのラベル</td>
        <td data-column="Default">「SMSテキストメッセージ（モバイルデバイスでコードを受信）」</td>
        <td data-column="Possible Values">該当なし</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">totpDescription</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">TOTP ラジオボタンのラベル</td>
        <td data-column="Default">「ワンタイムパスワード（QRコードとMFAアプリを使用して、モバイルデバイスにトークンを保存してください）</td>
        <td data-column="Possible Values">該当なし</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">noMfaDescription</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">ラジオボタンなしラベル</td>
        <td data-column="Default">「MFAを有効にしない」</td>
        <td data-column="Possible Values">該当なし</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
          <td data-column="Attribute">cancelHandler</td>
          <td data-column="Type">関数</td>
          <td data-column="Description">ユーザーが「キャンセル」ボタンをクリックしたときに呼び出される関数です</td>
          <td data-column="Default">該当なし</td>
          <td data-column="Possible Values">該当なし</td>
          <td data-column="Required">いいえ</td>
        </tr>
    </tbody>
  </table>
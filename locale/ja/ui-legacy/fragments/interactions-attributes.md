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
        <td data-column="Attribute">bot</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">Amplify設定で「aws_bots_config.name」に定義されているチャットボットの名前。</td>
        <td data-column="Default">該当なし</td>
        <td data-column="Required">はい</td>
      </tr>
      <tr>
        <td data-column="Attribute">clearComplete</td>
        <td data-column="Type">boolean</td>
        <td data-column="Description">は、チャットセッションの終了時にチャットメッセージが消去されるかどうかを指定します。</td>
        <td data-column="Default">true</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">botTitle</td>
        <td data-column="Type">文字列</td>
        <td data-column="Description">フロントエンドアプリのチャットボットコンポーネントの名前</td>
        <td data-column="Default">'チャットボット'</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">conversationModeOn</td>
        <td data-column="Type">boolean</td>
        <td data-column="Description">音声会話モードのオン/オフ</td>
        <td data-column="Default">false</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">voiceConfig</td>
        <td data-column="Type">オブジェクト</td>
        <td data-column="Description">無音検出パラメータを変更する</td>
        <td data-column="Default">{
          silenceDetectionConfig: {
              time: 2000,
              amplitude: 0.2
          }   
}</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">voiceEnabled</td>
        <td data-column="Type">boolean</td>
        <td data-column="Description">ユーザーの音声入力のオン/オフを切り替える</td>
        <td data-column="Default">false</td>
        <td data-column="Required">いいえ</td>
      </tr>
      <tr>
        <td data-column="Attribute">テキスト有効</td>
        <td data-column="Type">boolean</td>
        <td data-column="Description">ユーザーテキスト入力のオン/オフ</td>
        <td data-column="Default">true</td>
        <td data-column="Required">いいえ</td>
      </tr>
    </tbody>
</table>
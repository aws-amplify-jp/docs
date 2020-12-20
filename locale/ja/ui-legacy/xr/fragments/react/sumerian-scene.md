[を公開して、シュメールシーンを設定したら、](~/lib/xr/getting-started.md) 以下のサポートされているフレームワークのいずれかで Sumerian Scene UI コンポーネントを使用できます。

<amplify-callout>

メモ: 以下の各 UI コンポーネントは、親DOM要素の高さと幅を継承します。 親DOM要素の幅と高さのスタイルを所望のサイズに設定してください。

</amplify-callout>

## インストール
```
$ npm install aws-amplify-react
```

## 使用法
```javascript
import { SumerianScene } from 'aws-amplify-react';
...

render() {
  return (
    <div className="App">
      // sceneName: the configured friendly scene you would like to load
      <SumerianScene sceneName="scene1" />
    </div>
  );
}
```

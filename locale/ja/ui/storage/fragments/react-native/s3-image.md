`S3Image` コンポーネントは、 *Amazon S3 オブジェクトキー* を画像としてレンダリングします。

![S3Image](~/images/s3image.png)


```jsx
import React from 'react';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import { withAuthenticator, S3Image } from 'aws-amplify-react-native';

Amplify.configure(awsconfig)

const App = () => {
  return (
    <S3Image imgKey={key} />
  );
}

export default withAuthenticator(App);
```

プライベートイメージの場合、 `レベル` プロパティを指定してください。

```jsx
return (
    <S3Image level="private" imgKey={key} />
);
```

アップロードを開始するには、 `body` プロパティを設定します。

```jsx
return (
    <S3Image imgKey={key} body={this.state.image_body} />
);
```

フレームが画像の寸法と一致しない場合、画像のサイズを変更する方法を決定するには、 `resizeMode` プロパティを設定します。

![S3Image resizeMode の例](~/images/s3image-resize-mode.png)

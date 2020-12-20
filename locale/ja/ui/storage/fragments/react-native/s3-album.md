`S3Album` は `S3Image` オブジェクトのリストをレンダリングします:

![S3アルバム](~/images/s3album.png)

```jsx
import React from 'react';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import { withAuthenticator, S3Album } from 'aws-amplify-react-native';

Amplify.configure(awsconfig);

const App = () => {
    return (
        <S3Album path='/pictures' />
    );
}

export default withAuthenticator(App);
```

特定のフォルダにオブジェクトを表示するには、 `パス` プロパティを指定します。

```jsx
return (
    <S3Album path={path} />
);
```

プライベートオブジェクトを表示するには、 `レベル` プロパティを指定します。

```jsx
return (
    <S3Album level="private" path={path} />
);
```

`フィルター` プロパティを使用して、アルバムのパスをカスタマイズできます:

```jsx
return (
    <S3Album
        level="private"
        path={path}
        filter={(item) => /jpg/i.test(item.path)}
    />
);
```

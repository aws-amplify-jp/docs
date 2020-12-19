AWS AmplifyはLogger経由でコンソールログを書き込みます。アプリでLoggerを使うこともできます。

## インストール

Import Logger:
```javascript
import { Logger } from 'aws-amply';
```

## API の操作

異なるコンソールメッセージモードでロガーを呼び出すことができます:
```javascript
const logger = new Logger('foo');

logger.info('info bar');
logger.debug('debug bar');
logger.warn('warn bar');
logger.error('error bar');
```

エラーを処理する場合:
```javascript
try {
    // ...
} catch(e) {
    logger.error('error happened', e);
}
```

## ロギングレベルの設定

ロガーインスタンスを作成するときに、ログレベルを設定できます。

```javascript
const logger = new Logger('foo', 'INFO');

logger.debug('callback data', data); // これはメッセージを書き込みません
```

グローバルロガー設定はロガーインスタンスの設定を上書きします：

```javascript
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const logger = new Logger('foo', 'INFO');

logger. ebug('callback data', data); // これはグローバルログレベルが 'DEBUG' であるため、メッセージを書き込みます。
```

Web 開発中は、ブラウザーコンソールログでグローバルログレベルを設定できます。
```javascript
window.LOG_LEVEL = 'DEBUG';
```

サポートされているログレベル:

* `エラー`
* `WARN`
* `情報`
* `DEBUG`
* `VERBOSE`

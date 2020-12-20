## サインアップ

新しいユーザーのメールアドレス、パスワード、その他の属性を `Auth.signUp` に渡して、Amazon Cognito UserPoolに新しいユーザーを作成します。

```javascript
import { Auth } from 'aws-amplify';

async function signUp() {
    try {
        const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,          // optional
                phone_number,   // optional - E.164 number convention
                // other custom attributes 
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}
```

`Auth.signUp` promiseは、 [`ISignUpResult`](https://github.com/aws-amplify/amplify-js/blob/4644b4322ee260165dd756ca9faeb235445000e3/packages/amazon-cognito-identity-js/index.d.ts#L136-L139) を [`CognitoUser`](https://github.com/aws-amplify/amplify-js/blob/4644b4322ee260165dd756ca9faeb235445000e3/packages/amazon-cognito-identity-js/index.d.ts#L48) で返します。

```js
{
    user: CognitoUser;
    userConfirmed: boolean;
    userSub: string;
}
```

### サインアップを確認

多要素認証を有効にした場合、ユーザーから確認コードを取得した後にサインアップを確認します。

```js
import { Auth } from 'aws-amplify';

async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}
```

### カスタム属性

サインアッププロセス中にカスタム属性を作成するには、 `custom:`を追加してsignUpメソッドのattributeフィールドに追加します。

```js
Auth.signUp({
    username,
    password,
    attributes: {
        email,
        'custom:favorite_flavor': 'Cookie Dough' // カスタム属性, not standard
    }
})
```

> Amazon Cognitoはサインアップ時にカスタム属性を動的に作成しません。 カスタム属性を使用するには、最初にユーザープールに属性を作成する必要があります。 Amplify ClIを使用してカスタム属性を作成するには、 `console auth`を増幅してください。 AmplifyのCLIを使用していない場合は、AWSコンソールにアクセスし、Amazon Cognitoダッシュボードを開くことで、ユーザープールを表示できます。

## サインイン

ユーザー名とパスワードでサインインするとき ユーザー名とパスワードを Authクラスの `signIn` メソッドに渡します。

```javascript
import { Auth } from 'aws-amplify';

async function signIn() {
    try {
        const user = await Auth.signIn(username, password);
    } catch (error) {
        console.log('error signing in', error);
    }
}
```

### 確認コードを再送信する

```js
import { Auth } from 'aws-amplify';

async function resendConfirmationCode() {
    try {
        await Auth.resendSignUp(username);
        console.log('code resent successfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
}
```

## サインアウト

```javascript
import { Auth } from 'aws-amplify';

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}
```

### Global sign-out

これを行うと、すべての認証トークンを取り消します(id token)。 アクセストークンとリフレッシュトークン) これは、ユーザーがすべてのデバイスからサインアウトされていることを意味します 注意: トークンは取り消されていますが、 AWSの資格情報は有効期限が切れるまで有効です (デフォルトでは1時間です)

```js
import { Auth } from 'aws-amplify';

async function signOut() {
    try {
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log('error signing out: ', error);
    }
}
```

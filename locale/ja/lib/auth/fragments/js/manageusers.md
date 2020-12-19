このセクションでは、パスワードとユーザー管理のためのクライアント側の開発経験について説明します。 アプリケーションに管理アクションを公開する方法については、ここをクリックしてください [](~/cli/auth/admin.md).

## パスワード操作

### パスワードの変更

```javascript
import { Auth } from 'aws-amplify';

Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, 'oldPassword', 'newPassword');
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));
```

### パスワードを忘れた場合

```javascript
import { Auth } from 'aws-amplify';

// Send confirmation code to user's email
Auth.forgotPassword(username)
    .then(data => console.log(data))
    .catch(err => console.log(err));

// Collect confirmation code and new password, then
Auth.forgotPasswordSubmit(username, code, new_password)
    .then(data => console.log(data))
    .catch(err => console.log(err));
```

### 新しいパスワードを入力

ユーザーは、Amazon Cognitoで有効なユーザーディレクトリが作成された場合、最初のサインイン時に新しいパスワードと必須属性を提供するよう求められます。 このシナリオでは、ユーザーが入力した新しいパスワードを処理するために、以下の方法が呼び出されます。

```js
import { Auth } from 'aws-amplify';

Auth.signIn(username, password)
.then(user => {
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
        Auth.completeNewPassword(
            user,               // the Cognito User Object
            newPassword,       // the new password
            // OPTIONAL, the required attributes
            {
              email: 'xxxx@example.com',
              phone_number: '1234567890'
            }
        ).then(user => {
            // at this time the user is logged in if no MFA required
            console.log(user);
        }).catch(e => {
          console.log(e);
        });
    } else {
        // other situations
    }
}).catch(e => {
    console.log(e);
});
```

## アカウントリカバリーの確認

アカウントの復旧には電話番号または電子メールアドレスが必要です。以下により、ユーザーがそれらの属性を確認できます：
```javascript
// To initiate the process of verifying the attribute like 'phone_number' or 'email'
Auth.verifyCurrentUserAttribute(attr)
.then(() => {
     console.log('a verification code is sent');
}).catch((e) => {
     console.log('failed with error', e);
});

// To verify attribute with the code
Auth.verifyCurrentUserAttributeSubmit(attr, 'the_verification_code')
.then(() => {
     console.log('phone_number verified');
}).catch(e => {
     console.log('failed with error', e);
});
```

## 現在の認証済みユーザーを取得

`Auth.currentAuthenticatedUser()` を呼び出して現在の認証済みユーザオブジェクトを取得できます。

```javascript
import { Auth } from 'aws-amplify';

Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
}).then(user => console.log(user))
.catch(err => console.log(err));
```
This method can be used to check if a user is logged in when the page is loaded. It will throw an error if there is no user logged in. This method should be called after the Auth module is configured or the user is logged in. To ensure that you can listen on the auth events `configured` or `signIn`. [Learn how to listen on auth events.](~/lib/utilities/hub.md#authentication-events)

### 現在の認証済みユーザーの属性を取得します

You can also access the user's attributes like their email address, phone number, sub, or any other attributes that are associated with them from the user object returned by `Auth.currentAuthenticatedUser`.

```js
const { attributes } = await Auth.currentAuthenticatedUser();
```

## 現在のセッションを取得

`Auth.currentSession()` は、JWT `accessToken` を含む `CognitoUserSession`オブジェクトを返します。 `idToken`、 `refreshToken`。

このメソッドは、トークンが期限切れで有効な `リフレッシュトークン` が提示された場合、 `アクセストークン` と `idToken` を自動的に更新します。 したがって、必要に応じてセッションを更新するためにこのメソッドを使用できます。


```javascript
import { Auth } from 'aws-amplify';

Auth.currentSession()
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

## ユーザー属性の管理

サインアップ中にユーザー属性を渡すことができます:

```javascript
Auth.signUp({
    'username': 'jdoe',
    'password': 'mysecurerandompassword#123',
    'attributes': {
        'email': 'me@domain.com',
        'phone_number': '+12128601234', // E.164 number convention
        'given_name': 'Jane',
        'family_name': 'Doe',
        'nickname': 'Jane'
    }
});
```

ユーザー属性を取得できます:

```javascript
let user = await Auth.currentAuthenticatedUser();

const { attributes } = user;
```

ユーザー属性を更新できます:

```javascript
let user = await Auth.currentAuthenticatedUser();

let result = await Auth.updateUserAttributes(user, {
    'email': 'me@anotherdomain.com',
    'family_name': 'Lastname'
});
console.log(result); // SUCCESS
```

> すべてのカスタム属性の <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes" target="_blank">リストはこちら</a>にあります。

メールアドレスを変更すると、ユーザーは確認コードを受け取ります。アプリで確認コードを確認できます。

```javascript
let result = await Auth.verifyCurrentUserAttributeSubmit('email', 'abc123');
```

## セキュリティトークンの管理

> AWS Amplifyで認証を使用する場合は、Amazon Cognitoトークンを手動でリフレッシュする必要はありません。トークンは必要に応じてライブラリによって自動的にリフレッシュされます。

Security Tokens like *IdToken* or *AccessToken* are stored in *localStorage* for the browser and in *AsyncStorage* for React Native. If you want to store those tokens in a more secure place or you are using Amplify in server side, then you can provide your own `storage` object to store those tokens.

例:
```ts
class MyStorage {
    // the promise returned from sync function
    static syncPromise = null;
    // set item with the key
    static setItem(key: string, value: string): string;
    // get item with the key
    static getItem(key: string): string;
    // remove item with the key
    static removeItem(key: string): void;
    // clear out the storage
    static clear(): void;
    // If the storage operations are async(i.e AsyncStorage)
    // Then you need to sync those items into the memory in this method
    static sync(): Promise<void> {
        if (!MyStorage.syncPromise) {
            MyStorage.syncPromise = new Promise((res, rej) => {});
        }
        return MyStorage.syncPromise;
    }
}

// tell Auth to use your storage object
Auth.configure({
    storage: MyStorage
});
```

ここでは、AsyncStorage をストレージオブジェクトとして使用する方法の例を示します。これにより、AsyncStorage からメモリにアイテムを同期する方法が示されます。
```javascript
import { AsyncStorage } from 'react-native';

const MYSTORAGE_KEY_PREFIX = '@MyStorage:';
let dataMemory = {};

/** @class */
class MyStorage {
    static syncPromise = null;
    /**
     * This is used to set a specific item in storage
     */
    static setItem(key, value) {
        AsyncStorage.setItem(MYSTORAGE_KEY_PREFIX + key, value);
        dataMemory[key] = value;
        return dataMemory[key];
    }

    /**
     * This is used to get a specific key from storage
     */
    static getItem(key) {
        return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
    }

    /**
     * This is used to remove an item from storage
     */
    static removeItem(key) {
        AsyncStorage.removeItem(MYSTORAGE_KEY_PREFIX + key);
        return delete dataMemory[key];
    }

    /**
     * This is used to clear the storage
     */
    static clear() {
        dataMemory = {};
        return dataMemory;
    }

    /**
     * Will sync the MyStorage data from AsyncStorage to storageWindow MyStorage
    */
    static sync() {
        if (!MyStorage.syncPromise) {
            MyStorage.syncPromise =  new Promise((res, rej) => {
                AsyncStorage.getAllKeys((errKeys, keys) => {
                    if (errKeys) rej(errKeys);
                    const memoryKeys = keys.filter((key) => key.startsWith(MYSTORAGE_KEY_PREFIX));
                    AsyncStorage.multiGet(memoryKeys, (err, stores) => {
                        if (err) rej(err);
                        stores.map((result, index, store) => {
                            const key = store[index][0];
                            const value = store[index][1];
                            const memoryKey = key.replace(MYSTORAGE_KEY_PREFIX, '');
                            dataMemory[memoryKey] = value;
                        });
                        res();
                    });
                });
            });
        }
        return MyStorage.syncPromise;
    }
}

Auth.configure({
    storage: MyStorage
});
```

トークンの詳細については、 [Amazon Cognito Developer Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html) をご覧ください。

Cognito では、 __標準__ と __カスタム__ の両方のユーザー属性を管理することができます。

## 標準属性

### 標準属性の設定

Cognitoにはデフォルトで使用可能なユーザー属性がたくさんあります。これらのリストは次のとおりです:

- アドレス
- 誕生日
- メールアドレス
- ファミリー名
- 性別
- 与えられた名前
- ロケール
- ミドルネーム
- 名前
- ニックネーム：
- 電話番号
- 画像
- 優先ユーザー名
- プロファイル
- zoneinfo
- 更新日時
- ウェブサイト

To configure and enable __standard__ user attributes in your app, you can run the Amplify `update auth` command and choose __Walkthrough all the auth configurations__. When prompted for __Specify read attributes__ and __Specify write attributes__, choose the attributes you'd like to enable in your app.

### 標準属性の書き込みと更新

サインアップまたはサインアップ後にユーザー属性を作成できます。

#### サインアップ時にユーザー属性を作成する

サインアップ時にユーザー属性を設定するには、 `属性` フィールドを入力します。

```js
await Auth.signUp({
  username: 'someuser', password: 'mycoolpassword',
  attributes: {
    email: 'someuser@somedomain.com', address: '105 Main St. New York, NY 10001'
  }
});
```

#### サインアップ後にユーザー属性を管理する

サインアップ後にユーザー属性を管理するには、 `Auth` クラスの __updateUserAttributes__ メソッドを使用します。

```js
async function updateUser() {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
    'address': '105 Main St. New York, NY 10001'
  });
}
```

### ユーザー属性を読み込み中

ユーザ属性を読み取るには、認証クラスの `currentAuthenticatedUser` メソッドを使用できます:

```js
async function getUserInfo() {
  const user = await Auth.currentAuthenticatedUser();
  console.log('attributes:', user.attributes);
}
```

## カスタム属性

カスタム属性を設定するには、まず Amazon Cognito ダッシュボードを開く必要があります。

```sh
増幅コンソール auth

? どのコンソール: ユーザープール
```

次に、左側のナビゲーションの __属性__ をクリックし、 __カスタム属性を追加__ をクリックします。

### カスタム属性の書き込みと更新

サインアップまたはサインアップ後にカスタムユーザー属性を作成できます。 カスタム属性を管理する場合、属性の前に `custom:` を追加する必要があります。

#### サインアップ時にカスタムユーザー属性を作成する

サインアップ時にユーザー属性を作成するには、 `属性` フィールドを入力します。

```js
await Auth.signUp({
  username: 'someuser', password: 'mycoolpassword',
  attributes: {
    email: 'someuser@somedomain.com', 'custom:favorite_ice_cream': 'chocolate'
  }
})
```

#### サインアップ後にカスタムユーザー属性を管理する

サインアップ後にカスタムユーザー属性を管理するには、 `Auth` クラスの __updateUserAttributes__ メソッドを使用します。

```js
async function updateUser() {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
    'custom:favorite_ice_cream': 'vanilla'
  });
}
```
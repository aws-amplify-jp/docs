Storage module can manage files with three different access levels; `public`, `protected` and `private`. The Amplify CLI configures three different access levels on the storage bucket: public, protected and private. When you run `amplify add storage`, the CLI will configure appropriate IAM policies on the bucket using a Cognito Identity Pool Role. You will have the option of adding CRUD (Create/Update, Read and Delete) based permissions as well, so that Authenticated and Guest users will be granted limited permissions within these levels.

If you had previously enabled user sign-in by running `amplify add auth` in your project, the policies will be connected to an `Authenticated Role` of the Identity Pool which has scoped permission to the objects in the bucket for each user identity. If you haven't configured user sign-in, then an `Unauthenticated Role` will be assigned for each unique user/device combination, which still has scoped permissions to just their objects.

* 公開: アプリのすべてのユーザーがアクセスできます。ファイルは、S3バケットの `公開/` パスの下に保存されます。
* 保護: すべてのユーザーが読み取ることができますが、作成ユーザーによってのみ書き込み可能です。 ファイルは `protected/{user_identity_id}/` の下に保存されます。ここで、 `user_identity_id` は、そのユーザーの固有の Amazon Cognito ID に対応します。
* プライベート: 個々のユーザーのみアクセスできます。 ファイルは `private/{user_identity_id}/` の下に保存されます。ここで、 `user_identity_id` は、そのユーザーの固有の Amazon Cognito ID に対応します。

When using Auth and Storage modules together, you do not need to construct the `/{user_identity_id}/` manually as the library will use the configured Cognito Identity ID for your user/device along with the configured access level for an action. This includes UnAuthenticated access where you will first call `Auth.currentCredentials()` before a Storage action. See [Authentication](~/lib/auth/overview.md) for more information.

ストレージ オブジェクトでアクセスレベルをグローバルに設定することもできます。また、個々の関数呼び出しでアクセスレベルを設定することもできます。

> Storage モジュールのデフォルトのアクセスレベルは `public`です。 ストレージを設定しない限り、アップロードされたすべてのファイルはすべてのユーザーが公開されます。


ストレージオブジェクトのアクセスレベル設定:

```javascript
Storage.configure({ level: 'private' });
Storage.get('welcome.png'); // 現在のユーザーに属する welcome.png を取得します。
```

APIを呼び出すときの設定:

```javascript
Storage.get('welcome.png', { level: 'public' }); // welcome.png
```

デフォルトのアクセスレベルは `public`:
```javascript
Storage.get('welcome.png'); // welcome.png
```

ショートカット `保管庫`もあります。これは `プライベート` レベルが設定されたストレージインスタンスです。

```javascript
Storage.vault.get('welcome.png'); // 現在のユーザーに属するwelcome.pngを取得
```

## カスタマイズ

### オブジェクトキーパスのカスタマイズ

プレフィックスを定義することで、キーパスをカスタマイズできます。

```javascript
Storage.configure({
    customPrefix: {
        public: 'myPublicPrefix/',
        protectedPrefix/',
        private: 'myPrivatePrefix/'
    },
    // ...
})
```

たとえば、読み込みを有効にしたい場合。 パス *myPublicPrefix/*のすべてのオブジェクトに対する操作の書き込みと削除、IAMポリシーでそれを宣言します。

```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myPublicPrefix/*",
        ]
    }
]
```

If you want to have custom *private* path prefix like *myPrivatePrefix/*, you need to add it into your IAM policy:
```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myPrivatePrefix/${cognito-identity.amazonaws.com:sub}/*"
        ]
    }
]
```
これにより、認証されたユーザのみがパスの下にあるオブジェクトへのアクセスを保証します。
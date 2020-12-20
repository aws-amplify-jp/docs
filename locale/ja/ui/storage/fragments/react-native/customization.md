### アップロードパスをカスタマイズ

プレフィックスを定義することで、アップロードパスをカスタマイズできます。

```javascript
const customPrefix = {
    public: 'myPublicPrefix/',
    protected: 'myProtectedPrefix/',
    private: 'myPrivatePrefix/'
};

Storage.put('test.txt', 'Hello', {
    customPrefix: customPrefix,
    // ...
})
.then (result => console.log(result))
.catch(err => console.log(err));
```

たとえば、読み込みを有効にしたい場合。 パス *myPublicPrefix/*のすべてのオブジェクトに対する操作の書き込みと削除、IAMポリシーでそれを宣言します。

```json
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
```json
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
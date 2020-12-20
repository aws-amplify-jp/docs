すべてのAmazon S3リソースはデフォルトでプライベートです。 ユーザーに Amazon S3 バケットまたはオブジェクトへのアクセスを許可する場合。 [IAM ポリシー](http://docs.aws.amazon.com/IAM/latest/UserGuide/PoliciesOverview.html) で適切な権限を割り当てることができます。

## IAM ポリシーに基づく権限

When you upload objects to the S3 bucket the Amplify CLI creates, you must manually prepend the appropriate access-level information to the `key`. The correct prefix - `public/`, `protected/` or `private/` - will depend on the access level of the object as documented in the [Storage Access section](~/sdk/storage/getting-started.md#storage-access). For example:

```swift
var s3Object = S3ObjectInput()

// Accessible by all users
s3Object.key = "public/myFile.txt"

// Readable by all users, but writable only by the creating user
s3Object.key = "protected/\(cognitoIdentityId)/myFile.txt"

// Only accessible for the individual user
s3Object.key = "private/\(cognitoIdentityId)/myFile.txt"
```

**Note:** These keys must be prepended when you are uploading the object, and the same key must be specified as part of the object's key during download. The `cognitoIdentityId` is required for `protected` and `private` access and you can get it by using the [Authentication Utilities](~/sdk/auth/working-with-api.md#utility-properties) within AWSMobileClient: `AWSMobileClient.default().identityId`.

## 事前署名付きURL経由の一時的な権限

ただし、一時的に許可を与えたい場合はどうすればよいでしょう。 例: _一時的にファイルへのリンクを共有し、設定した時間_の後にリンクが切れるようにします。 事前に署名されたURLを使用して、ユーザーにS3オブジェクトへの一時的なアクセスを与えることができます。 事前に署名された URL を作成する場合、セキュリティ資格情報を入力する必要があります。 バケット名、オブジェクトキー、HTTPメソッド、および有効期限を指定します。 事前に署名された URL は指定された期間にのみ有効です。

以下の例は、S3 オブジェクトを取得するために事前に署名された URL を構築する方法を示しています。

```swift
let getPreSignedURLRequest = AWSS3GetPreSignedURLRequest()
getPreSignedURLRequest.bucket = "myBucket"
getPreSignedURLRequest.key = "myFile.txt"
getPreSignedURLRequest.httpMethod = .GET

// Change the value of the expires time interval as required
getPreSignedURLRequest.expires = Date(timeIntervalSinceNow: 3600)

AWSS3PreSignedURLBuilder.default().getPreSignedURL(getPreSignedURLRequest).continueWith { (task:AWSTask<NSURL>) -> Any? in
    if let error = task.error as? NSError {
        print("Error: \(error)")
        return nil
    }

    let presignedURL = task.result
    // Use the Pre-Signed URL here as required
    return nil
}
```

> The preceding example uses `GET` as the HTTP method: `AWSHTTPMethodGET`. For an upload request to S3, you would use a `PUT` method.

```swift
let getPreSignedURLRequest = AWSS3GetPreSignedURLRequest()
getPreSignedURLRequest.bucket = "myBucket"
getPreSignedURLRequest.key = "myFile.txt"
getPreSignedURLRequest.httpMethod = .PUT

// Change the value of the expires time interval as required
getPreSignedURLRequest.expires = Date(timeIntervalSinceNow: 3600) 
getPreSignedURLRequest.contentType = "text/plain"

AWSS3PreSignedURLBuilder.default().getPreSignedURL(getPreSignedURLRequest).continueWith { (task:AWSTask<NSURL>) -> Any? in
    if let error = task.error as? NSError {
        print("Error: \(error)")
        return nil
    }

    let presignedURL = task.result
    // Use the Pre-Signed URL here as required
    return nil
}
```
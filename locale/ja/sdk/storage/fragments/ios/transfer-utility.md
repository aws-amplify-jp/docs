Amazon S3からオブジェクトを簡単にアップロードおよびダウンロードできるようにします。 TransferUtilityコンポーネントには、背景転送、進捗管理、MultiPartアップロードのサポートが組み込まれています。 このセクションでは、アップロードとダウンロード機能の実装方法と、追加のストレージ使用事例について説明します。

<amplify-callout>

**Note:** If you use the transfer utility MultiPart upload feature, take advantage of automatic cleanup features by setting up the [AbortIncompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html) action in your Amazon S3 bucket life cycle configuration.

</amplify-callout>

## 転送ユーティリティオプション

`AWSS3TransferUtilityConfiguration` オブジェクトを使用して、 `TransferUtility` の操作を設定できます。

### isAccelerateModeEnabled
isAccelerateModeEnabledオプションを使用すると、転送アクセラレーションが有効になっているS3バケットからコンテンツをアップロードしてダウンロードできます。 このオプションはデフォルトで false に設定されています。 バケットの転送加速を有効にする方法については、 [Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) を参照してください。

_以下のコードサンプルは、TransferUtilityの認証情報を手動で設定します。 ベストプラクティスはAWSMobileClientを使用することです。詳細については [認証](~/sdk/auth/how-it-works.md) を参照してください。_

```swift
//Setup credentials, see your awsconfiguration.json for the "YOUR-IDENTITY-POOL-ID"
let credentialProvider = AWSCognitoCredentialsProvider(regionType: YOUR-IDENTITY-POOL-REGION, identityPoolId: "YOUR-IDENTITY-POOL-ID")

//Setup the service configuration
let configuration = AWSServiceConfiguration(region: .USEast1, credentialsProvider: credentialProvider)

//Setup the transfer utility configuration
let tuConf = AWSS3TransferUtilityConfiguration()
tuConf.isAccelerateModeEnabled = true

//Register a transfer utility object asynchronously
AWSS3TransferUtility.register(
    with: configuration!,
    transferUtilityConfiguration: tuConf,
    forKey: "transfer-utility-with-advanced-options"
) { (error) in
     if let error = error {
         //Handle registration error.
     }
}

//Look up the transfer utility object from the registry to use for your transfers.
let transferUtility:(AWSS3TransferUtility?) = AWSS3TransferUtility.s3TransferUtility(forKey: "transfer-utility-with-advanced-options")
```

### retryLimit
retryLimitオプションでは、エラーが発生したときにTransferUtilityが転送を再試行する回数を指定できます。 デフォルトでは、 `0` に設定されています。

```swift
tuConf.retryLimit = 5
```

### multiPartConcurrencyLimit
multiPartConcurrencyLimitオプションを使用すると、MultiPartアップロード要求に並行してアップロードされる部品の数を指定できます。 デフォルトでは、これは `5` に設定されています。

```swift
tuConf.multiPartConcurrencyLimit = 3
```

### timeoutIntervalForResource
timeoutIntervalForResourceパラメーターを使用すると、転送が実行される最大期間を指定できます。 このパラメータのデフォルト値は `50` 分です。 この値は、Amazon Cognitoの一時的な資格情報を使用する場合に重要です。

```swift
tuConf.timeoutIntervalForResource = 15*60 //15分
```

## ファイルをアップロード

 転送ユーティリティは、シングルパートとマルチパートの両方のアップロード方法を提供します。 転送がマルチパートアップロードを使用する場合、データは5MBの数に分割され、速度を上げるために並行して転送されます。

 次の例は、ファイルを S3 バケットにアップロードする方法を示しています。

```swift
func uploadData() {

  let data: Data = Data() // Data to be uploaded

  let expression = AWSS3TransferUtilityUploadExpression()
     expression.progressBlock = {(task, progress) in
        DispatchQueue.main.async(execute: {
          // Do something e.g. Update a progress bar.
       })
  }

  var completionHandler: AWSS3TransferUtilityUploadCompletionHandlerBlock?
  completionHandler = { (task, error) -> Void in
     DispatchQueue.main.async(execute: {
        // Do something e.g. Alert a user for transfer completion.
        // On failed uploads, `error` contains the error object.
     })
  }

  let transferUtility = AWSS3TransferUtility.default()

  transferUtility.uploadData(data,
       bucket: "YourBucket",
       key: "YourFileName",
       contentType: "text/plain",
       expression: expression,
       completionHandler: completionHandler).continueWith {
          (task) -> AnyObject? in
              if let error = task.error {
                 print("Error: \(error.localizedDescription)")
              }

              if let _ = task.result {
                 // Do something with uploadTask.
              }
              return nil;
      }
}
```

以下の例は、マルチパートアップロードを使用して S3 バケットにファイルをアップロードする方法を示しています。

```swift
func uploadData() {

   let data: Data = Data() // Data to be uploaded

   let expression = AWSS3TransferUtilityMultiPartUploadExpression()
      expression.progressBlock = {(task, progress) in
         DispatchQueue.main.async(execute: {
           // Do something e.g. Update a progress bar.
        })
   }

   var completionHandler: AWSS3TransferUtilityMultiPartUploadCompletionHandlerBlock
   completionHandler = { (task, error) -> Void in
      DispatchQueue.main.async(execute: {
         // Do something e.g. Alert a user for transfer completion.
         // On failed uploads, `error` contains the error object.
      })
   }

   let transferUtility = AWSS3TransferUtility.default()

   transferUtility.uploadUsingMultiPart(data:data,
        bucket: "YourBucket",
        key: "YourFileName",
        contentType: "text/plain",
        expression: expression,
        completionHandler: completionHandler).continueWith {
           (task) -> AnyObject! in
               if let error = task.error {
                  print("Error: \(error.localizedDescription)")
               }

               if let _ = task.result {
                  // Do something with uploadTask.
               }
               return nil;
       }
}
```

## ファイルをダウンロード

次の例は、S3バケットからファイルをダウンロードする方法を示しています。

```swift
func downloadData() {
   let expression = AWSS3TransferUtilityDownloadExpression()
   expression.progressBlock = {(task, progress) in DispatchQueue.main.async(execute: {
      // Do something e.g. Update a progress bar.
      })
   }

   var completionHandler: AWSS3TransferUtilityDownloadCompletionHandlerBlock?
   completionHandler = { (task, URL, data, error) -> Void in
      DispatchQueue.main.async(execute: {
      // Do something e.g. Alert a user for transfer completion.
      // On failed downloads, `error` contains the error object.
      })
   }

   let transferUtility = AWSS3TransferUtility.default()
   transferUtility.downloadData(
         fromBucket: "YourBucket",
         key: "YourFileName",
         expression: expression,
         completionHandler: completionHandler
         ).continueWith {
            (task) -> AnyObject! in if let error = task.error {
               print("Error: \(error.localizedDescription)")
            }

            if let _ = task.result {
              // Do something with downloadTask.

            }
            return nil;
        }
}
```

## 転送の進行状況を追跡する

`progressBlock` と `completionHandler` ブロックを `AWSS3TransferUtility` の呼び出しに渡すことで、転送の進行状況と完了アクションを実装します。

以下の例では、すべての転送で進捗状況と完了の処理がどのように行われるかを示しています。 `AWSS3TransferUtilityUploadExpression`, ` AWSS3TransferUtilityMultiPartUploadExpression ` と `AWSS3TransferUtilityDownloadExpression` と `AWSS3TransferUtilityDownloadExpression` には、 `progressBlock` が含まれており、プログレスバーを更新するために使用できる転送の進行状況が表示されます。

```swift
// For example, create a progress bar
let progressView: UIProgressView! = UIProgressView()
progressView.progress = 0.0;

let data = Data() // The data to upload

let expression = AWSS3TransferUtilityUploadExpression()
expression.progressBlock = {(task, progress) in DispatchQueue.main.async(execute: {
        // Update a progress bar.
        progressView.progress = Float(progress.fractionCompleted)
    })
}

let completionHandler: AWSS3TransferUtilityUploadCompletionHandlerBlock = { (task, error) -> Void in DispatchQueue.main.async(execute: {
        if let error = error {
            NSLog("Failed with error: \(error)")
        }
        else if(self.progressView.progress != 1.0) {
            NSLog("Error: Failed.")
        } else {
            NSLog("Success.")
        }
    })
}

var refUploadTask: AWSS3TransferUtilityTask?
let transferUtility = AWSS3TransferUtility.default()
transferUtility.uploadData(data,
           bucket: "S3BucketName",
           key: "S3UploadKeyName",
           contentType: "text/plain",
           expression: expression,
           completionHandler: completionHandler).continueWith { (task) -> AnyObject! in
                if let error = task.error {
                    print("Error: \(error.localizedDescription)")
                }

                if let uploadTask = task.result {
                    // Do something with uploadTask.
                    // The uploadTask can be used to pause/resume/cancel the operation, retrieve task specific information
                    refUploadTask = uploadTask
                }

                return nil;
            }
```

## 送金を一時停止する

転送を一時停止するには、 `AWSS3TransferUtilityUploadTask`への参照を保持します。 `AWSS3TransferUtilityMultiPartUploadTask` または `AWSS3TransferUtilityDownloadTask`.

As described in the previous section :ref:`native-track-progress-and-completion-of-a-transfer`, the variable `refUploadTask` is a reference to the `UploadTask` object that is retrieved from the `continueWith` block of an upload operation that is invoked through `transferUtility.uploadData`.

送金を一時停止するには、 `一時停止` メソッドを使用します。

```swift
refUploadTask.suspend()
```

## 転送を再開

転送を再開するには、 `resume` メソッドを使用します。

```swift
refUploadTask.resume()
```

## 送金をキャンセル

送金をキャンセルするには、 `cancel` メソッドを使用します。

```swift
refUploadTask.cancel()
```

## 背景の転送

iOS用TransferUtilityで行われるすべての転送は、NSURLSessionのバックグラウンドセッションを使用してバックグラウンドで行われます。 転送が開始されると、開始するアプリがフォアグラウンドに移動するかどうかに関係なく続行されます。 背景に移動するか、停止されるか、システムによって終了します。 これはアプリが強制終了されている場合には適用されないことに注意してください。 強制クローズされたアプリケーションによって開始される転送は、NSURLSession レベルのオペレーティングシステムによって終了されます。 通常のアップロードとダウンロードを行うには、転送を再開する必要があります。複数のアップロードを行う場合、TransferWiseは自動的に再開され、転送を継続します。

転送が完了したときに一時停止またはバックグラウンドでアプリをスリープ解除する AppDelegate の handleEventsForBackgroundURLSession メソッドを実装し、以下のように AWSS3TransferUtility の interceptApplication メソッドを呼び出してください。

```swift
func application(_ application: UIApplication, handleEventsForBackgroundURLSession identifier: String, completionHandler: @escaping () -> Void) {
    // Store the completion handler.
    AWSS3TransferUtility.interceptApplication(application, handleEventsForBackgroundURLSession: identifier, completionHandler: completionHandler)
}
```

## アプリの再起動時に転送を管理する

When an app that has initiated a transfer restarts (if it has been terminated by the system and not force-closed), it is possible that the transfer may still be in progress or completed. To make the restarting app aware of the status of transfers, instantiate the transfer utility using the `AWSS3TransferUtility.s3TransferUtility(forKey: "YOUR_KEY")` method. AWSS3TransferUtility uses the key to uniquely identify the NSURLSession of the transfers initiated by the app, so it is important to always use the same identifier. AWSS3TransferUtility will automatically reconnect to the transfers that were in progress the last time the app was running.

アプリのどこからでも呼び出すことができますが、AWSS3TransferUtilityを `appDidFinishLaunching` ライフサイクルメソッドでインスタンス化することをお勧めします。

## 一時停止時に転送を管理する フォアグラウンドに戻る

転送を開始したアプリが一時停止され、フォアグラウンドに戻ったとき。 転送がまだ進行中か完了している可能性があります どちらの場合も、アプリの進行・完了ハンドラブロックを再確立するために次のコードを使用します。

```swift
let uploadTasks = transferUtility.getUploadTasks().result
  for task in uploadTasks! {
       task.setCompletionHandler(completionHandler!)
       task.setProgressBlock(progressBlock!)
}


let downloadTasks = transferUtility.getDownloadTasks().result
   for task in downloadTasks! {
       task.setCompletionHandler(completionHandler!)
       task.setProgressBlock(progressBlock!)
    }
}


let multiPartUploadTasks = transferUtility.getMultiPartUploadTasks().result
    for task in multiPartUploadTasks! {
        task.setCompletionHandler(completionHandler!)
        task.setProgressBlock(progressBlock!)

 }
```

## オブジェクトメタデータで転送

The `AWSS3TransferUtilityUploadExpression` and `AWSS3TransferUtilityMultiPartUploadExpression` classes contain the method `setValue:forRequestHeader` where you can pass in metadata to Amazon S3. This example demonstrates passing in the Server-side Encryption Algorithm as a request header in uploading data to S3 using MultiPart. See [Object Key and Metadata](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html) for more information.

```swift

let data: Data = Data() // The data to upload

let uploadExpression = AWSS3TransferUtilityMultiPartUploadExpression()
uploadExpression.setValue("AES256", forRequestHeader: "x-amz-server-side-encryption-customer-algorithm")
uploadExpression.progressBlock = {(task, progress) in DispatchQueue.main.async(execute: {
        // Do something e.g. Update a progress bar.
    })
}

let transferUtility = AWSS3TransferUtility.default()

transferUtility.uploadUsingMultiPart(data:data,
            bucket: "S3BucketName",
            key: "S3UploadKeyName",
            contentType: "text/plain",
            expression: uploadExpression,
            completionHandler: nil).continueWith { (task) -> AnyObject! in
                if let error = task.error {
                    print("Error: \(error.localizedDescription)")
                }

                return nil;
            }
```

## アプリコードのアクセスレベルを操作する

すべてのAmazon S3リソースはデフォルトでプライベートです。 ユーザーにS3バケットやオブジェクトへのアクセス権を持たせたい場合 [IAM ポリシー](http://docs.aws.amazon.com/IAM/latest/UserGuide/PoliciesOverview.html) で適切な権限を割り当てることができます。

### IAM ポリシーに基づく権限

When you upload objects to the S3 bucket the Amplify CLI creates, you must manually prepend the appropriate access-level information to the `key`. The correct prefix - `public/`, `protected/` or `private/` - will depend on the access level of the object as documented in the [Storage Access section](~/sdk/storage/getting-started.md#storage-access).

## 転送ユーティリティと事前に署名された URL

転送ユーティリティは、バックグラウンドデータ転送に使用するAmazon S3の事前署名付きURLを生成します。 最善の方法は、Amazon Cognitoを転送ユーティリティとの認証情報に使用することです。 Amazon Cognito Identityでは、最大60分間有効なAWSの一時認証情報を受け取ります。 これらの資格情報を使用して構築された事前に署名された URL は、同じ時間制限によって束縛されます。その後、URL は期限切れになります。

Because of this limitation, when you use TransferUtility with Amazon Cognito, the expiry on the Pre-Signed URLs generated internally is set to **50 minutes**. Transfers that run longer than the 50 minutes will fail.  If you are transferring a large enough file where this becomes a constraint, you should create static credentials using AWSStaticCredentialsProvider ( _see [Authentication](~/sdk/auth/how-it-works.md) for more details on how to do this_)  and increase the expiry time on the Pre-Signed URLs by increasing the value for the `timeoutIntervalForResource` in the Transfer Utility Options.  Note that the max allowed expiry value for a Pre-Signed URL is 7 days.


## 追加リソース

* [Amazon Simple Storage Service Getting Started Guide](http://docs.aws.amazon.com/AmazonS3/latest/gsg/GetStartedWithS3.html)
* [Amazon Simple Storage Service API Reference](http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
* [Amazon Simple Storage Service Developer Guide](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)
* [アイデンティティとアクセス管理コンソール](https://console.aws.amazon.com/iam/home)
* [Amazon S3 バケットへのアクセスを許可する](http://blogs.aws.amazon.com/security/post/Tx3VRSWZ6B3SHAV/Writing-IAM-Policies-How-to-grant-access-to-an-Amazon-S3-bucket)
* [顧客から提供された暗号化キーを使用したデータの保護](https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html)
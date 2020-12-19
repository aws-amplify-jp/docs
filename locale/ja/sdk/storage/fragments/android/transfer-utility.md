Amazon S3からオブジェクトを簡単にアップロードおよびダウンロードできるようにします。 TransferUtilityコンポーネントには、背景転送、進捗管理、MultiPartアップロードのサポートが組み込まれています。 転送ユーティリティコンポーネントセットには、ネットワーク接続の変更を監視するTransferServiceというサービスが含まれています。 デバイスがオフラインになると、転送サービスは継続中のすべての転送を一時停止します。デバイスがオンラインになった場合、転送サービスは一時停止を再開します。


Starting with version 2.7.0, the `TransferService` will not be automatically started or stopped by `TransferUtility`. You have to start `TransferService` manually from your application. A recommended way is to start the service upon Application startup, by including the following line in the `onCreate` method of your app's Application class.

```java
getApplicationContext().startService(new Intent(getApplicationContext(), TransferService.class));
```

このセクションでは、アップロードとダウンロード機能の実装方法と、追加のストレージ使用事例について説明します。

<amplify-callout>

**Note:** If you use the transfer utility MultiPart upload feature, take advantage of automatic cleanup features by setting up the [AbortIncompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html) action in your Amazon S3 bucket life cycle configuration.

</amplify-callout>

## ファイルをアップロード

The following example shows how to use the TransferUtility to upload a file. Instantiate the TransferUtility object using the provided TransferUtility builder function. Use the `AWSMobileClient` to get the `AWSConfiguration` and `AWSCredentialsProvider` to pass into the builder. See [Authentication](~/sdk/auth/getting-started.md) for more details.

TransferUtilityはアップロードされるファイルのサイズをチェックし、ファイルサイズが5MBを超える場合、マルチパートアップロードに自動的に切り替わります。

```java
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.Callback;
import com.amazonaws.mobile.client.UserStateDetails;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferService;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.services.s3.AmazonS3Client;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class MainActivity extends Activity {
    private static final String TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getApplicationContext().startService(new Intent(getApplicationContext(), TransferService.class));

        // Initialize the AWSMobileClient if not initialized
        AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails userStateDetails) {
                Log.i(TAG, "AWSMobileClient initialized. User State is " + userStateDetails.getUserState());
                uploadWithTransferUtility();
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "Initialization error.", e);
            }
        });

    }

    public void uploadWithTransferUtility() {

        TransferUtility transferUtility =
                TransferUtility.builder()
                        .context(getApplicationContext())
                        .awsConfiguration(AWSMobileClient.getInstance().getConfiguration())
                        .s3Client(new AmazonS3Client(AWSMobileClient.getInstance()))
                        .build();

        File file = new File(getApplicationContext().getFilesDir(), "sample.txt");
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            writer.append("Howdy World!");
            writer.close();
        }
        catch(Exception e) {
            Log.e(TAG, e.getMessage());
        }

        TransferObserver uploadObserver =
                transferUtility.upload(
                        "public/sample.txt",
                        new File(getApplicationContext().getFilesDir(),"sample.txt"));

        // Attach a listener to the observer to get state update and progress notifications
        uploadObserver.setTransferListener(new TransferListener() {

            @Override
            public void onStateChanged(int id, TransferState state) {
                if (TransferState.COMPLETED == state) {
                    // Handle a completed upload.
                }
            }

            @Override
            public void onProgressChanged(int id, long bytesCurrent, long bytesTotal) {
                float percentDonef = ((float) bytesCurrent / (float) bytesTotal) * 100;
                int percentDone = (int)percentDonef;

                Log.d(TAG, "ID:" + id + " bytesCurrent: " + bytesCurrent
                        + " bytesTotal: " + bytesTotal + " " + percentDone + "%");
            }

            @Override
            public void onError(int id, Exception ex) {
                // Handle errors
            }

        });

        // If you prefer to poll for the data, instead of attaching a
        // listener, check for the state and progress in the observer.
        if (TransferState.COMPLETED == uploadObserver.getState()) {
            // Handle a completed upload.
        }

        Log.d(TAG, "Bytes Transferred: " + uploadObserver.getBytesTransferred());
        Log.d(TAG, "Bytes Total: " + uploadObserver.getBytesTotal());
    }
}
```

このコードを実行する場合は、AWS コンソールにログインし、S3 サービスに進みます。 このような Bucket とファイル構造が表示されます(この例では、フレンドリー名は `dev` で、Bucket 名は `storageemo` でした):

![画像](~/images/SampleStorageS3.png)

## ファイルをダウンロード

The following example shows how to use the TransferUtility to download a file. Instantiate the TransferUtility object using the provided TransferUtility builder function. Use the `AWSMobileClient` to get the `AWSConfiguration` and `AWSCredentialsProvider` to pass into the builder. See [Authentication](~/sdk/auth/getting-started.md) for more details.

```java
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.Callback;
import com.amazonaws.mobile.client.UserStateDetails;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferService;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.services.s3.AmazonS3Client;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class MainActivity extends Activity {
    private static final String TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getApplicationContext().startService(new Intent(getApplicationContext(), TransferService.class));

        // Initialize the AWSMobileClient if not initialized
        AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails userStateDetails) {
                Log.i(TAG, "AWSMobileClient initialized. User State is " + userStateDetails.getUserState());
                downloadWithTransferUtility();
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "Initialization error.", e);
            }
        });

    }

    private void downloadWithTransferUtility() {

        TransferUtility transferUtility =
                TransferUtility.builder()
                        .context(getApplicationContext())
                        .awsConfiguration(AWSMobileClient.getInstance().getConfiguration())
                        .s3Client(new AmazonS3Client(AWSMobileClient.getInstance()))
                        .build();

        TransferObserver downloadObserver =
                transferUtility.download(
                        "public/sample.txt",
                        new File(getApplicationContext().getFilesDir(), "download.txt"));

        // Attach a listener to the observer to get state update and progress notifications
        downloadObserver.setTransferListener(new TransferListener() {

            @Override
            public void onStateChanged(int id, TransferState state) {
                if (TransferState.COMPLETED == state) {
                    // Handle a completed upload.
                }
            }

            @Override
            public void onProgressChanged(int id, long bytesCurrent, long bytesTotal) {
                float percentDonef = ((float)bytesCurrent/(float)bytesTotal) * 100;
                int percentDone = (int)percentDonef;

                Log.d("Your Activity", "   ID:" + id + "   bytesCurrent: " + bytesCurrent + "   bytesTotal: " + bytesTotal + " " + percentDone + "%");
            }

            @Override
            public void onError(int id, Exception ex) {
                // Handle errors
            }

        });

        // If you prefer to poll for the data, instead of attaching a
        // listener, check for the state and progress in the observer.
        if (TransferState.COMPLETED == downloadObserver.getState()) {
            // Handle a completed upload.
        }

        Log.d("Your Activity", "Bytes Transferred: " + downloadObserver.getBytesTransferred());
        Log.d("Your Activity", "Bytes Total: " + downloadObserver.getBytesTotal());
    }
}
```

## 転送の進行状況を追跡する

TransferUtilityでは、 `ダウンロード` と `アップロード` メソッドは `TransferObserver` オブジェクトを返します。このオブジェクトは以下にアクセスできます:

1.  `列挙型`としての転送状態
2.  これまで転送された総バイト数
3.  転送する残りのバイト数
4.  送金の追跡に使用できるユニークなID

Given the transfer ID, the `TransferObserver` object can be retrieved from anywhere in your app, even if the app was terminated during a transfer. It also lets you create a `TransferListener`, which will be updated on changes to transfer state, progress, and when an error occurs.

To get the progress of a transfer, call `setTransferListener()` on your `TransferObserver`. This requires you to implement `onStateChanged`, `onProgressChanged`, and `onError` as shown in the example.

```java

TransferObserver transferObserver = download(MY_BUCKET, OBJECT_KEY, MY_FILE);
transferObserver.setTransferListener(new TransferListener(){

    @Override
    public void onStateChanged(int id, TransferState state) {
        // do something
    }

    @Override
    public void onProgressChanged(int id, long bytesCurrent, long bytesTotal) {
        int percentage = (int) (bytesCurrent/bytesTotal * 100);
        //Display percentage transferred to user
    }

    @Override
    public void onError(int id, Exception ex) {
        // do something
    }
});
```

The transfer ID can be retrieved from the `TransferObserver` object that is returned from the upload or download function.  You can also query for `TransferObservers` using the `getTransfersWithType(transferType)` or the `getTransfersWithTypeAndState(transferType, transferState)` method.

```java
// 転送の id を取得します。
int transferId = transferObserver.getId();
```

## 送金を一時停止する

転送は `pause(transferId)` メソッドを使用して一時停止できます。アプリが終了、クラッシュ、またはインターネット接続が失われた場合、転送は自動的に一時停止されます。

転送を一時停止するには:
```java
transferUtility.pause(idOfTransferToBePaused);
```

すべてのアップロードを一時停止するには:

```java
transferUtility.pauseAllWithType(TransferType.UPLOAD);
```

すべてのダウンロードを一時停止するには:

```java
transferUtility.pauseAllWithType(TransferType.DOWNLOAD);
```

任意のタイプのすべての送金を一時停止するには:

```java
transferUtility.pauseAllWithType(TransferType.ANY);
```

## 転送を再開

ネットワーク接続が失われた場合、ネットワーク接続が復元されると転送は自動的に再開されます。 アプリがクラッシュまたはオペレーティングシステムによって終了した場合、 `resume(transferId)` メソッドで転送を再開できます。


転送を再開するには:

```java
transferUtility.resume(idOfTransferToBeResumed);
```
すべてのアップロードを再開するには:

```java
transferUtility.resumeAllWithType(TransferType.UPLOAD);
```

すべてのダウンロードを再開するには:

```java
transferUtility.resumeAllWithType(TransferType.DOWNLOAD);
```

すべてのタイプの転送を再開するには:

```java
transferUtility.resumeAllWithType(TransferType.ANY);
```

## 送金をキャンセル

アップロードをキャンセルするには、 `TransferUtility` オブジェクトのcancel()またはcancelAllWithType()を呼び出します。

単一の送金をキャンセルするには、以下を使用してください:

```java

transferUtility.cancel(idToBeCancelled);
```

特定の種類のすべての送金をキャンセルするには、以下を使用してください:

```java

transferUtility.cancelAllWithType(TransferType.DOWNLOAD);
```

## 背景の転送

SDK はバックグラウンドスレッドを使用して Amazon S3 からオブジェクトをアップロードおよびダウンロードします。 これらの転送は、アプリがフォアグラウンドで実行されているかバックグラウンドで実行されているかにかかわらず、引き続き実行されます。

## 長時間稼動している送金

アプリにバックグラウンドで長時間の転送を実行させたい場合 アプリ内で実装できるバックグラウンドサービスから送金を開始できます。 転送を開始するためにサービスを使用する推奨方法は、 [Transfer Utilityサンプルアプリケーション](https://github.com/awslabs/aws-sdk-android-samples/tree/master/S3TransferUtilitySample) で示されています。

## Oreo以上のTransferWiseをサポートしています

`TransferNetworkLossHandler`, a broadcast receiver that listens for network connectivity changes is introduced in `2.11.0`. `TransferNetworkLossHandler` pauses the on-going transfers when the network goes offline and resumes the transfers that were paused when the network comes back online. `TransferService` registers the `TransferNetworkLossHandler` when the service is created and de-registers the handler when the service is destroyed.

* `TransferService` は、Android Oreo (API レベル 26) 以上を実行している場合、フォアグラウンドに移動されます。
  * フォアグラウンド状態への移行には、有効な `通知` オブジェクトが必要です。 継続中の通知の識別子と、サービスがフォアグラウンド状態から移行中の通知を削除する機能を決定するフラグ。 有効な通知オブジェクトが渡されない場合、サービスはフォアグラウンド状態に移行されません。
  * `TransferService` は、 `startForegroundService` メソッドを使用してサービスをフォアグラウンド状態に移動できるようになりました。 サービスは、サービスをフォアグラウンド状態に移行する次の方法で呼び出すことができます。

```java
Intent tsIntent = new Intent(getApplicationContext(), TransferService.class);
tsIntent.putExtra(TransferService.INTENT_KEY_NOTIFICATION, <notification-object>);
tsIntent.putExtra(TransferService.INTENT_KEY_NOTIFICATION_ID, <notification-id>);
tsIntent.putExtra(TransferService.INTENT_KE_REMOVE_NOTIFICATION, <remove-notification-when-service-stops-foreground>);
getApplicationContext().startgroundService(tsent);
```

## Unicode文字をキー名でサポート

**オブジェクトのアップロード/ダウンロード**

* Since `2.4.0` version of the SDK, the key name containing characters that require special handling are URL encoded and escaped `( space, %2A, ~, /, :, ', (, ), !, [, ] )` by the `AmazonS3Client`, after which the AWS Android Core Runtime encodes the URL resulting in double encoding of the key name.

* Starting `2.11.0`, the additional layer of encoding and escaping done by `AmazonS3Client` is removed. The key name will not be encoded and escaped by `AmazonS3Client`. Now, the key name that is given to `AmazonS3Client` or `TransferUtility` will appear on the Amazon S3 console as is.

**オブジェクトの一覧**

* S3 バケットに 特別な処理が必要な文字を含むキー名のオブジェクトが含まれている場合 そしてSDKにはXMLパーサ(XML 1)があるので。 一部の文字を解析できないパーサー) SDKは、Amazon S3がレスポンス内のキーをエンコードするよう要求する必要があります。 これは `ListObjectsRequest` 内の `encodingType` として `url` を渡すことで行うことができます。

```java
AmazonS3Client s3 = new AmazonS3Client(credentials);
final ObjectListing objectListing = s3.listObjects(
                new ListObjectsRequest(bucketName, prefix, null, null, null)
                    .withEncodingType(Constants.URL_ENCODING));
```

* Since `2.4.0`, there was a bug where the SDK did not decode the key names which are encoded by S3 when `url` is requested as the `encodingType`. This is fixed in `2.11.0`, where the SDK will decode the key names in the `ListObjectsResponse` sent by S3.

* S3 バケット内に特別な処理が必要な文字を含むキー名のオブジェクトがある場合。 `listObjectsRequest` 内の `url` として `encodingType` を渡す必要があります。


## オブジェクトメタデータで転送


To upload a file with metadata, use the `ObjectMetadata` object. Create a `ObjectMetadata` object and add in the metadata headers and pass it to the upload function.

```java
import com.amazonaws.services.s3.model.ObjectMetadata;

ObjectMetadata myObjectMetadata = new ObjectMetadata();

//create a map to store user metadata
Map<String, String> userMetadata = new HashMap<String,String>();
userMetadata.put("myKey","myVal");

//call setUserMetadata on our ObjectMetadata object, passing it our map
myObjectMetadata.setUserMetadata(userMetadata);
```

次に、メタデータと一緒にオブジェクトをアップロードします。

```java

TransferObserver observer = transferUtility.upload(
  MY_BUCKET,        /* The bucket to upload to */
  OBJECT_KEY,       /* The key for the uploaded object */
  MY_FILE,          /* The file where the data to upload exists */
  myObjectMetadata  /* The ObjectMetadata associated with the object*/
);
```

To download the metadata, use the S3 `getObjectMetadata` method. See the [API Reference](http://docs.aws.amazon.com/AWSAndroidSDK/latest/javadoc/com/amazonaws/services/s3/AmazonS3Client.html#getObjectMetadata%28com.amazonaws.services.s3.model.GetObjectMetadataRequest%29) and [Object Key and Metadata](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html) for more information.

## 転送ユーティリティオプション

`TransferUtilityOptions` オブジェクトを使用して、TransferUtilityの操作をカスタマイズできます。

### TransferThreadPoolSize
このパラメーターでは、並列に実行できる転送数を指定できます。 スレッドの数を増やすことで 並行してアップロードされるマルチパートアップロードのパーツ数を増やすことができます。 デフォルトでは、これは 2 * (N + 1) に設定されており、N はモバイルデバイスで利用可能なプロセッサの数です。 最小許容値は 2 です。

```java
TransferUtilityOptions = new TransferUtilityOptions();
options.setTransferThreadPoolSize(8);

TransferUtility transferUtility = TransferUtility.builder()
    // Passin S3Client, Context, AWSConfiguration/DefaultBucket Name
    .transferUtilityOptions(options)
    .build();
```

### TransferNetworkConnectionType
`TransferNetworkConnectionType` オプションを使用すると、Amazon S3 にデータを転送できるネットワーク接続の種類(WiFi / モバイル / ANY)を制限できます。

```java
TransferUtilityOptions = new TransferUtilityOptions(10, TransferNetworkConnectionType.WIFI);

TransferUtility transferUtility = TransferUtility.builder()
    // Passin S3Client, Content, AWSConfiguration/DefaultBucket Name
    .transferUtilityOptions(options)
    .build();
```

`TransferNetworkConnectionType.WIFI` を指定すると、デバイスが WiFi 接続されている場合にのみ、S3 との間のデータ転送が行われます。

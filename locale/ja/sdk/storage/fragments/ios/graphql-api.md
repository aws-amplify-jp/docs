**注意:** このセクションの残りの部分を進める前に、 [API](~/sdk/api/graphql.md) のドキュメントを確認してください。

You can upload and download Amazon S3 Objects using AWS AppSync, a GraphQL based solution to build data-driven apps with real-time and offline capabilities. Sometimes you might want to create logical objects that have more complex data, such as images or videos, as part of their structure.  _For example, you might create a Person type with a profile picture or a Post type that has an associated image_. You can use AWS AppSync to model these as GraphQL types. If any of your mutations have a variable with `bucket`, `key`, `region`, `mimeType`, and `localUri` fields, the SDK uploads the file to S3 for you.

`ファイルの更新` anplify/backend/api/yourAppName/schema.graphql `S3Object` 型を持つ次のスキーマを使用してください。

```graphql
type Picture @model {
  id: ID!
  name: String
  owner: String
  visibility: Visibility
  file: S3Object
  createdAt: String
}

type S3Object {
  bucket: String!
  region: String!
  key: String!
  localUri: String!
  mimeType: String!
}

enum Visibility {
  public
  private
}
```

and run `amplify push` to update the AppSync backend resource, remember to choose `update API.swift` when `Amplify CLI` prompts the choice

The AWS AppSync SDK doesn't take a direct dependency on the AWS SDK for S3, but takes in `AWSS3TransferUtility`. You will also need to take a dependency on the `AWSS3` SDK. You can do that by updating your Podfile:

```ruby
  ターゲット: 'PostsApp' do
    use_frameworks!
    pod 'AWSAppSync'
    pod 'AWSS3'
  end
```

次に、 `pod install` を実行して、新しい依存関係を取得します。

`クラス AppDelegate : UIResponder, UIApplicationDelegate` の `AppDelegate.swift` で `AWSAppSyncClient` と `AWSS3TransferUtility` を以下のように設定します:

```swift
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var appSyncClient: AWSAppSyncClient?

    func application(_ application: UIApplication, 
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Add the following config code
        do {
            let cacheConfiguration = try AWSAppSyncCacheConfiguration()
            let appSyncServiceConfig = try AWSAppSyncServiceConfig()
            let appSyncConfig = try AWSAppSyncClientConfiguration(
                appSyncServiceConfig: appSyncServiceConfig,
                cacheConfiguration: cacheConfiguration,
                s3ObjectManager: AWSS3TransferUtility.default())
            appSyncClient = try AWSAppSyncClient(appSyncConfig: appSyncConfig)
            print("AppSync Client Initialized")
        } catch {
            print("Error initializing AppSync Client")
        }

        return true
    }
}
```

また、API 変更時に画像を自動的にアップロードします。アクションをトリガーするには、次の方法を作成できます。

```swift
func uploadImage() {
    let s3ObjectInput = S3ObjectInput(bucket: "yourBucket",
                                      region: "yourBucketRegion",
                                      key: "public/imageName.jpeg",
                                      localUri: "uriOfImageToUpload",
                                      mimeType: "jpeg")

    let pictureMutationInput = CreatePictureInput(id: UUID().uuidString,
                                                  name: "yourInputName",
                                                  owner: "yourName",
                                                  visibility: Visibility(rawValue: "public"),
                                                  file: s3ObjectInput)      

    appSyncClient.perform(mutation: CreatePictureMutation(input: pictureMutationInput)) { (result, error) in
        if let error = error as? AWSAppSyncClientError {
            print("Error occurred: \(error.localizedDescription )")
        }
        if let resultError = result?.errors {
            print("Error saving the item on server: \(resultError)")
            return
        }
    }
}            
```
注意: `Bucket` と `領域` を `awsconfiguration.json 内で見つけたものに置き換えることを忘れないでください`

The mutation operation doesn't require any specific changes in method signature. It requires only an `S3Object` with `bucket`, `key`, `region`, `localUri`, and `mimeType`. Now when you do a mutation, it automatically uploads the specified file to Amazon S3 using the `AWSS3TransferUtility` client internally.

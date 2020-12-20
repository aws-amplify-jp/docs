注意: このセクションの残りの部分を進める前に、 [API](~/sdk/api/graphql.md) のドキュメントを確認してください。

You can also upload and download Amazon S3 Objects using AWS AppSync, a GraphQL based solution to build data-driven apps with real-time and offline capabilities. Sometimes you might want to create logical objects that have more complex data, such as images or videos, as part of their structure.  _For example, you might create a Person type with a profile picture or a Post type that has an associated image_. You can use AWS AppSync to model these as GraphQL types. If any of your mutations have a variable with bucket, key, region, mimeType, and localUri fields, the SDK uploads the file to Amazon S3 for you.

以下のポリシーを IAM ロールに添付して、プログラムによるバケットへの読み書きアクセスを許可します。

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::myBucket"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": ["arn:aws:s3:::myBucket/*"]
    }
  ]
}
```

## Schema Setup
If any mutations have an input type `S3ObjectInput` with fields `bucket`, `key`, `region`, `mimeType` and `localUri` fields, the SDK will upload the file to S3.
```
  input {
    bucket: String!
    key: String!
    region: String!
    localUri: String
    mimeType: String
}
```
For example, to add a photo field in the `Post` type. Update `Post` type, add the new `S3ObjectInput` type and add a new mutation, `putPostWithPhoto`.
```
  type Mutation {
      ...other mutations here...
      putPostWithPhoto(
          id: ID!,
          author: String!,
          title: String,
          content: String,
          url: String,
          ups: Int,
          downs: Int,
          photo: S3ObjectInput
          version: Int!
      ): Post
  }
  type S3Object {
       bucket: String!
       key: String!
       region: String!
  }
  input S3ObjectInput {
       bucket: String!
       key: String!
       region: String!
       localUri: String
       mimeType: String
  }
  type Post {
      id: ID!
      author: String!
      title: String
      content: String
      url: String
      ups: Int
      downs: Int
      photo: S3Object
      version: Int!
  }
```
Next, update the putPostWithPhoto mutation resolver to use `PutItemWithS3Object` template for request mapping and `Return single item` for response mapping from the AppSync console. Next, update the response mapping template for the `photo` field.
```
$util.toJson($util.dynamodb.fromS3ObjectJson($context.source.file))
```
## クライアント コード
複雑なオブジェクトを使用するには、Amazon S3 への読み書きには AWS Identity and Access Management クレデンシャルが必要です。 これらはAWS AppSync クライアントで使用される他の認証資格情報とは別にすることができます。 複雑なオブジェクトの資格情報は `S3ObjectManager実装` ビルダーパラメータで設定されます。以下のように使用できます:
```java
public class ClientFactory {
    // ...other code...
    private static volatile AWSAppSyncClient client;
    private static volatile S3ObjectManagerImplementation s3ObjectManager;
    public static AWSAppSyncClient getInstance(Context context) {
      if (client == null) {
        client = AWSAppSyncClient.builder()
                .context(context)
                .awsConfiguration(new AWSConfiguration(context))
                .s3ObjectManager(getS3ObjectManager(context)) // Here we initialize the s3 object manager.
                .build();
      }
      return client;
    }
    // Copy the below two methods and add the .s3ObjectManager builder parameter
    // initialize and fetch the S3 Client
    public static final S3ObjectManagerImplementation getS3ObjectManager(final Context context) {
      if (s3ObjectManager == null) {
          AmazonS3Client s3Client = new AmazonS3Client(getCredentialsProvider(context));
          s3Client.setRegion(Region.getRegion("us-east-1")); // you can set the region of bucket here
          s3ObjectManager = new S3ObjectManagerImplementation(s3Client);
      }
      return s3ObjectManager;
    }
    // initialize and fetch cognito credentials provider for S3 Object Manager
    public static final AWSCredentialsProvider getCredentialsProvider(final Context context){
    final CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
            context,
            Constants.COGNITO_IDENTITY, // Identity pool ID
            Regions.fromName(Constants.COGNITO_REGION) // Region
            );
      return credentialsProvider;
    }
}
```
The SDK uploads the file found at the `localUri` when the bucket, key, region, localUri, and mimeType are all provided. Now, the SDK uploads any field which has `S3ObjectInput` type in the mutation. The only requirement from a developer is to provide the correct bucket, key, region, localUri, and mimeType. Example: Add the following permissions to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
次に、投稿を追加するアクティビティで、次のようにコードを更新します。
```java
public class AddPostActivity extends AppCompatActivity {
    // ...other code...
    // Photo selector application code.
    private static int RESULT_LOAD_IMAGE = 1;
    private String photoPath;
    public void choosePhoto() {
        Intent i = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(i, RESULT_LOAD_IMAGE);
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RESULT_LOAD_IMAGE && resultCode == RESULT_OK && null != data) {
            Uri selectedImage = data.getData();
            String[] filePathColumn = {MediaStore.Images.Media.DATA};
            Cursor cursor = getContentResolver().query(selectedImage,
                    filePathColumn, null, null, null);
            cursor.moveToFirst();
            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String picturePath = cursor.getString(columnIndex);
            cursor.close();
            // String picturePath contains the path of selected Image
            photoPath = picturePath;
        }
    }
    // Actual mutation code
    private void save() {
        final String title = ((EditText) findViewById(R.id.updateTitle)).getText().toString();
        final String author = ((EditText) findViewById(R.id.updateAuthor)).getText().toString();
        final String url = ((EditText) findViewById(R.id.updateUrl)).getText().toString();
        final String content = ((EditText) findViewById(R.id.updateContent)).getText().toString();
        S3ObjectInput s3ObjectInput = S3ObjectInput.builder()
            .bucket("YOUR_BUCKET_NAME")
            .key("public/"+ UUID.randomUUID().toString())
            .region("us-east-1")
            .localUri(photoPath)
            .mimeType("image/jpg").build();
        PutPostWithPhotoMutation addPostMutation = PutPostWithPhotoMutation.builder()
                .title(title)
                .author(author)
                .url(url)
                .content(content)
                .ups(0)
                .downs(0)
                .photo(s3ObjectInput)
                .expectedVersion(1)
                .build();
        ClientFactory.getInstance(this).mutate(addPostMutation).enqueue(postsCallback);
    }
    // Mutation callback code
    private GraphQLCall.Callback<PutPostWithPhotoMutation.Data> postsCallback = new GraphQLCall.Callback<PutPostWithPhotoMutation.Data>() {
        @Override
        public void onResponse(@Nonnull final Response<PutPostWithPhotoMutation.Data> response) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(AddPostActivity.this, "Added post", Toast.LENGTH_SHORT).show();
                    AddPostActivity.this.finish();
                }
            });
        }
        @Override
        public void onFailure(@Nonnull final ApolloException e) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.e("", "Failed to perform AddPostMutation", e);
                    Toast.makeText(AddPostActivity.this, "Failed to add post", Toast.LENGTH_SHORT).show();
                    AddPostActivity.this.finish();
                }
            });
        }
    };
}
```

## 複雑なオブジェクト
多くの場合、画像やビデオなど、より複雑なデータを持つ論理オブジェクトを構造の一部として作成したい場合があります。 たとえば、プロフィール画像を含むPerson型を作成したり、関連画像を含むPost型を作成したりすることができます。 AWS AppSyncでは、これらを複合オブジェクトと呼ばれるGraphQL型としてモデル化できます。 変異のいずれかにバケット、キー、リージョンがある変数がある場合。 mimeType および localUri フィールドは、SDK が Amazon S3 にファイルをアップロードします。

この機能の完全な動作例については、GitHub の [aws-amplify-graphql](https://github.com/aws-samples/aws-amplify-graphql) を参照してください。

GraphQL 変圧器は、 `S3Object` 型を使用するときに、DynamoDB と S3 オブジェクトのポイントに書き込むようにリゾルバを設定します。 たとえば、Amplifyプロジェクトで以下を実行します。

```bash
増幅された認証を追加する #デフォルトの設定を選択する
増幅されたストレージを追加する #読み取り/書き込みアクセスのあるS3を選択する
増幅された api を追加する #認可タイプのCognito User Poolを選択する
```

プロンプトが表示されたら、次のスキーマを使用してください:
```graphql
type Todo @model {
    id: ID!
    name: String!
    description: String!
    file: S3Object
}

type S3Object {
    bucket: String!
    key: String!
    region: String!
}

input CreateTodoInput {
  id: ID
  name: String!
  description: String
  file: S3ObjectInput # This input type will be generated for you
}
```
保存し、 `を増幅して` を実行して変更をデプロイします。

To use complex objects you need AWS Identity and Access Management credentials for reading and writing to Amazon S3 which `amplify add auth` configured in the default setting along with a Cognito user pool. These can be separate from the other auth credentials you use in your AWS AppSync client. Credentials for complex objects are set using the `complexObjectsCredentials` parameter, which you can use with AWS Amplify and the complex objects feature like so:

```javascript
const client = new AWSAppSyncClient({
    url: ENDPOINT,
    region: REGION,
    auth: { ... },   //Can be User Pools or API Key
    complexObjectsCredentials: () => Auth.currentCredentials(),
});

(async () => {
  let file;

  if (selectedFile) { // selectedFile is the file to be uploaded, typically comes from an <input type="file" />
    const { name, type: mimeType } = selectedFile;
    const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(name);

    const bucket = aws_config.aws_user_files_s3_bucket;
    const region = aws_config.aws_user_files_s3_bucket_region;
    const visibility = 'private';
    const { identityId } = await Auth.currentCredentials();

    const key = `${visibility}/${identityId}/${uuid()}${extension && '.'}${extension}`;

    file = {
      bucket,
      key,
      region,
      mimeType,
      localUri: selectedFile,
    };
  }

  const result = await client.mutate({
    mutation: gql(createTodo),
    variables: {
      input: {
        name: 'Upload file',
        description: 'Uses complex objects to upload',
        file: file,
      }
    }
  });

})();
```

上記の変更を実行すると、レコードはAppSync API用のDynamoDBテーブルと、S3バケット内の対応するファイルになります。
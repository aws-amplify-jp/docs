画像や動画などのファイルの保存とクエリは、ほとんどのアプリケーションで一般的な要件ですが、GraphQLを使用してどのように行うのですか?

一つのオプションは、Base64が画像をエンコードし、変更内の文字列として送信することです。 これは、エンコードされたファイルが元のバイナリよりも大きいような欠点があります。 演算が高価でエンコードとデコードの複雑さが増しています

もう一つのオプションは、ファイルをアップロードするための別のサーバー(またはAPI)を持つことです。 これが好ましいアプローチであり、このガイドで説明されるテクニックです。

## どのように動作する

この作業を行うには通常、いくつかのことが必要になります。

1. GraphQL API
2. ファイルを保存するためのストレージサービスまたはデータベース
3. ファイルの場所への参照を含むGraphQLデータを保存するデータベース

例えば、Eコマースアプリ内の製品のスキーマを以下に示します。

```
type Product {
  id: ID!
  name: String!
  description: String
  price: int
  image: ?
}
```

この `イメージ` フィールドをどのように使用して、画像を保存して参照するためにアプリで動作させることができますか?

#### 突然変異用

1. 画像をS3に保存
2. 画像参照と他の製品データを使用してGraphQL API で製品を作成するために変更を送信します。

#### クエリ用

1. (画像参照を含む) API から製品データを問い合わせます
2. 別の API 呼び出しで S3 から画像の署名 URL を取得します

AWS Amplify、AWS AppSync、Amazon S3を使用してこれを実装する方法を見てみましょう。

<!-- ## Creating the client

In this guide the client code will be written in React, but you can use Vue, Angular, or any other JavaScript framework because the API calls the you will be writing are not React specific.

To get started, create a new JavaScript project, change into the directory and install the amplify and uuid dependencies:

```
npx create-react-app gqlimages
cd gqlimages
npm install aws-amplify @aws-amplify/ui-react uuid
``` -->
## サービスの作成
この API を構築するには、次のものが必要です。
1. 画像を格納するS3バケット。
2. タイプに関する画像参照やその他のデータを格納するGraphQL API
3. ユーザー認証のための認証サービス（S3にファイルをアップロードするためにのみ必要）
まず最初に認証サービスを作成します。そのためには、Amplifyプロジェクトを初期化し、認証を追加します。


```sh
amplify init
# Follow the steps to give the project a name, environment name, and set the default text editor.
# Accept defaults for everything else and choose your AWS Profile.

amplify add auth

? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Username
? Do you want to configure advanced settings?  No, I am done.
```

次に、ストレージサービス(Amazon S3)を作成します。

```sh
amplify add storage

? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Please provide a friendly name for your resource that will be used to label this category in the project: gqls3
? Please provide bucket name: <YOUR_UNIQUE_BUCKET_NAME>
? Who should have access: Auth and guest users
? What kind of access do you want for Authenticated users? create, update, read, delete
? What kind of access do you want for Guest users? read
```

次に、画像項目を持つタイプのGraphQL APIを作成します。 この画像にアクセスできるのはアプリを使っている人だけです。 誰かがこの画像を直接取得しようとすると、それを見ることはできません。

```sh
amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: gqls3
? Choose the default authorization type for the API: Amazon Cognito User Pool
? Do you want to configure advanced settings for the GraphQL API: Yes
? Configure additional auth types? Yes
? Choose the additional authorization types you want to configure for the API: API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365 (or your preferred expiration)
? Configure conflict detection? No
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields
? Do you want to edit the schema now? Yes
```

プロンプトが表示されたら、 __/amplify/backend/api/gqls3/schema.graphql__ にあるスキーマを以下のように更新します。

```graphql
type Product @model
  @auth(rules: [
      { allow: owner },
      { allow: private, operations: [read] },
      { allow: public, operations: [read] }
  ]) {
  id: ID!
  name: String!
  description: String
  price: Int
  image: String
}
```

<amplify-callout>

上記のスキーマは、Amazon Cognito User PoolsとAPIキー認証タイプの組み合わせを想定しています。 認証されたユーザーが製品を作成し、認証されたユーザーと認証されていないユーザーの両方が製品を読み取ることができます。

</amplify-callout>

CLIに戻り、 __Enter__ を押します。

次に、Amplify `push` コマンドを使用してサービスをデプロイします。

```sh
amplify push --y
```

### クライアントアプリケーションから API を操作する

バックエンドが作成されたので、製品や画像を保存して読み取るにはどうすればよいでしょうか?

以下は、製品と画像をAPIに保存するために使用できるコードです。

```js
import { Storage, API } from 'aws-amplify';
import { createProduct } from './graphql/mutations';

async function saveProduct() {
  const fileName = "product-image-1";
  await Storage.put(fileName, file);
  const product = { name: "Product 1", description: "Black dress", price: 200, image: fileName };
  await API.graphql({ query: createProduct, variables: { input: product }});
}
```

以下は、API から製品と対応する画像を照会するために使用できるコードです。

```javascript
import { Storage, API } from 'aws-amplify';
import { getProduct } from './graphql/mutations';

async function getProductById () {
  const product = await API.graphql({ query: getProduct, variables: { id: "12345" }});
  const s3Image = await Storage.get(product.data.getProduct.image);
  product.data.getProduct.s3Image = s3Image;
  console.log('product:', product);
}
```

APIから製品や画像の配列をクエリするために使用できるコードは次のとおりです。

```javascript
import { Storage, API } from 'aws-amplify';
import { listProducts } from './graphql/mutations';

async function listProductsWithImages () {
  const productData = await API.graphql({ query: listProducts });
  const products = await Promise.all(productData.data.listProducts.items.map(async product => {
    const image = await Storage.get(product.image)
    product.s3Image = image
    return product
  }))
  console.log('products: ', products)
}
```
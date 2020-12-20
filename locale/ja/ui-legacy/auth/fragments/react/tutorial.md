このチュートリアルでは、AWS Amplifyを使ってReactアプリケーションを構築する方法について説明します。 似たようなプロセスを React Native アプリケーション(ホスティングを省略)で使用できます。

## インストール

<amplify-block-switcher>

<amplify-block name="NPM">

```bash
npm install -g @aws-amplify/cli
```

</amplify-block>

<amplify-block name="cURL (Mac and Linux)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install | bash && $SHELL
```

</amplify-block>

<amplify-block name="cURL (Windows)">

```bash
curl -sL https://aws-amplify.github.io/anplify-cli/install-win -o install.cmd && install.cmd
```

</amplify-block>

</amplify-block-switcher>

```bash
増幅の設定
```

Windows をお使いの場合は、 [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) をお勧めします。

- [Create React App](https://github.com/facebook/create-react-app) がインストールされていることを確認してください。
- 以下のように新しいプロジェクトを作成します:<br> `npx create-react-app myapp`<br> `cd myapp`<br>

***CLI 入門***

開始するには、新しいディレクトリでプロジェクトを初期化します。

```
initを増幅する
```

After you answer the provided questions, you can use `amplify help` at any time to see the overall command structure, and `amplify help <category>` to see actions for a specific category.

Amplify CLIはAWS CloudFormionを使用し、アカウントで実行するためにプッシュする前に、ローカルに設定を追加または変更できます。 デプロイの状況をいつでも確認するには、 `amplify status` を実行します。

***Webアプリを公開***

React アプリケーションに変更を加えずに、以下のようにウェブホスティングを追加してください：

```
amplify add hosting
```

You would be prompted next to select the environment setup. Select **DEV (S3 only with HTTP)** for quick prototyping and testing, and once production ready you could run the `amplify update hosting` command to publish your app to Amazon CloudFront (a CDN service).

**注意:** **PROD** オプションを使用する場合、CDN 設定とコンテンツのレプリケーションには15~20分の遅延が発生する可能性があります。

Bucket 名やアプリケーション ファイルなどの情報を求められる場合は、 **Enter** を押してデフォルト値を使用できます。

**メモ** 注文エイリアスを使用してカテゴリ機能を追加または削除することができます。 `hostify add` を実行することもできます。

Run `amplify status` to see that status (not deployed). Next, build and deploy your site by running `amplify publish` or `amplify publish --invalidate-cache` - for cache invalidation in the distribution network (if CloudFront is added via the hosting category). After it's complete, your application is available in an S3 hosting bucket for testing. It's also fronted with an Amazon CloudFront distribution. (if it is added via the hosting category in the prior bucket)

## 認証を追加

Now that your app is in the cloud, you can add some features like enabling users to register for your site and log in. Run `amplify add auth` and select the **Default configuration**. This adds the auth resource configurations locally in your `amplify/backend/auth` directory.

Run `amplify push` to provision your auth resources in the cloud. The `./src/aws-exports.js` file that's created has all of the appropriate cloud resources defined for your application.

次に、AmplifyライブラリをWebアプリケーションに追加します。

```
yarn add aws-amplify aws-amplify-react
```

React Native アプリと連携する場合は以下を使用してください：

```
yarn add aws-amplify aws-anplify-react-native
react-native link amazon-cognito-identity-js # ExpoやExpoKitを使用する場合は実行しないでください。
```

`./src/App.js` を編集して、Amplifyライブラリ、設定、 [React HOC](https://reactjs.org/docs/higher-order-components.html)を含めます。その後、以下のようにライブラリを初期化します。

```javascript
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure(awsconfig);
```

ファイルの下部にある `withAuthenticator` を使用してデフォルトの `App` コンポーネントを以下のようにラップします:

```javascript
export default withAuthenticator(App, true);
```

`amplify publish` を使ってアプリをビルドして再び公開できるようになりました。 今回は新しいユーザーを登録し、メインアプリケーションを開く前にサインインすることができます。

> API & プロパティの詳細 `Authenticator` と `withAuthenticator` HOC は [Authentication Guide](~/ui-legacy/auth/authentcator/q/framework/react) にあります。

#### サインアップ設定

サインアップコンポーネントはユーザーにサインアップ機能を提供します。これは、 `Authenticator` コンポーネントの一部として含まれています。

使用法: `<Authenticator signUpConfig={ signUpConfig }/>`

認証 HOC の一部としても使用できます: `export default withAuthenticator(App, { signUpConfig });`

SignUpコンポーネントは、カスタマイズできる「signUpConfig」オブジェクトを受け取ります。

{% include sign-up-attributes.html %}

順番に signUpFields 配列はオブジェクトの配列で構成されています 各項目について説明します。登録フォームに表示されます。

{% include sign-up-fields.html %}

signUpFields 属性の例は次のようになります。

```js
const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'My custom email label',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    ... // and other custom attributes
  ]
};

export default withAuthenticator(App, { signUpConfig });
```

#### メールアドレス/電話番号でサインアップ/ログイン

ユーザープールがユーザー名としてメールアドレス/電話番号を許可するように設定されている場合 `usernameAttributes` [(設定の詳細)](~/lib/auth/getting-started.md/q/platform/js) を使用して、それに応じてUIコンポーネントを変更できます。

`email` をユーザー名として使用している場合:

```js
import { withAuthenticator, Authenticator } from 'aws-amplify-react';

// When using Authenticator
class App {
  // ...

  render() {
    return (
      <Authenticator usernameAttributes='email'/>
    );
  }
}

export default App;

// When using withAuthenticator
class App2 {
  // ...
}

export default withAuthenticator(App2, { usernameAttributes: 'email' });
```

ユーザー名に `電話番号` を使用している場合

```js
import { Authenticator, withAuthenticator } from 'aws-amplify-react';

class App {
  // ...

  render() {
    return (
      <Authenticator usernameAttributes='phone_number'/>
    );
  }
}

export default App;

// When using withAuthenticator
class App2 {
  // ...
}

export default withAuthenticator(App2, { usernameAttributes: 'phone_number' });
```

**Note:** If you are using custom signUpFields to customize the `username` field, then you need to make sure either the label of that field is the same value you set in `usernameAttributes` or the key of the field is `username`.

例:

```js
import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(awsconfig);

class App extends Component {}

const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'My user name',
      key: 'username',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    },
    {
      label: 'PhoneNumber',
      key: 'phone_number',
      required: true,
      displayOrder: 3,
      type: 'string'
    },
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 4,
      type: 'string'
    }
  ]
};
const usernameAttributes = 'My user name';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});
```

## アナリティクスとストレージを追加

次に、ユーザーの行動分析の追跡やクラウド内の画像のアップロード/ダウンロードなどの機能を追加します。

開始する前に、増幅分析を有効にするには、ユーザーを ID プールに関連付ける必要があります。 `amplify add auth` を実行し、手動設定を使用して認証を構成します。

Start by running `amplify add analytics` in your project. You can enable analytics for authenticated users only, or for users that aren't authenticated. You would be prompted to ask whether you want to allow guests and unauthenticated users to send analytics events, so you can choose `Yes`. You can also try a new project without authentication configured to test this feature.

Run `amplify add storage` and then select **Content (Images, audio, video, etc.)**. You'll then be prompted for authorization related questions. Choose **Auth and guest users** to give both authorized and guest users access. In the next prompts, based on your previous selection you would be asked to configure read/write permissions for the authorized and guest users. When complete, run `amplify push` to create the cloud resources.

Edit your `App.js` file in the React project again and modify your imports so that the `Analytics` and `Storage` categories are included in addition to the `S3Album` component, which we'll use to upload and download photos.

```javascript
import Amplify, { Analytics, Storage } from 'aws-amplify';
import { withAuthenticator, S3Album } from 'aws-amplify-react';
```

The `Analytics` category automatically tracks user session data such as sign-in events. However, you can record custom events or metrics at any time. You can also use the `Storage` category to upload files to a private user location after someone has logged in. First, add the following line after `Amplify.configure()` has been called:

`Storage.configure({ level: 'private' });`

次に、コンポーネントの `render` メソッドの前に次のメソッドを追加します。

```javascript
  uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;

    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    })
  }

  componentDidMount() {
    Analytics.record('Amplify_CLI');
  }
```

最後に `render` メソッドを変更して、ファイルをアップロードしたり、ログインしたユーザーに追加された `プライベート` の写真を以下のように表示したりできます:

```javascript
  render() {
    return (
      <div className="App">
        <p> Pick a file</p>
        <input type="file" onChange={this.uploadFile} />
        <S3Album level="private" path='' />
      </div>
    );
  }
```

変更を保存し、 `publish`を実行します。 すでに変更をプッシュしているため、ローカルビルドだけが作成され、ホスティングバケットにアップロードされます。 ログインして、ユーザーによって保護されている写真をアップロードします。 アップロード後、ページを更新して写真を表示することができます。

## GraphQLバックエンドを追加

アプリケーションがセットアップされたので、データベースに永続化できるバックエンドAPIを追加しましょう。 Amplify CLI には **GraphQL Transformer** が付属しており、データ要件に基づいて注釈付きGraphQL スキーマファイルを適切なAWS CloudFormationテンプレートに変換します。 これには以下のようなオプションが含まれます:

- `Amazon DynamoDBで型を格納するための @model`。
- `@auth` さまざまな認証戦略を定義します。
- `@connection` for specifying relationships between `@model` object types.
- `Amazon Elasticsearch Serviceに` @model `オブジェクトタイプのデータをストリーミングする @searchable`。

To get started run `amplify add api` and select `GraphQL`. When prompted, choose `Amazon Cognito User Pool` and the project will leverage your existing authentication setup. For `annotated schema`, choose **No**. For `guided schema creation`, choose **Yes**.

ガイドされた手順では、事前に注釈が付けられたデフォルトのスキーマがいくつか用意されています。 次のステップでは、フィールド `を含む` 単一オブジェクト を選択します。 でも後で別のプロジェクトでこれらのステップを再度見直すことができます このオプションを選択すると、テキストエディタに以下の注釈付きスキーマが表示されます:

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

これはAWS AppSyncにデプロイするGraphQLスキーマです。 GraphQL に精通している場合、項目やタイプの名前を変更したり追加したりすることができますが、クライアントコードも変更する必要があります。 準備ができたら、CLIに `` を入力し、 `増幅プッシュ`を実行します。

デプロイが完了したら、 `アプリを開きます。 s <code> 再び` を更新し、 `API` カテゴリと `graphqlOperation` メソッドの両方を次のように含めます:

```javascript
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify';
```

次のクエリと変更をコードに追加します。 __ 前に `クラス App はコンポーネント {...}` の定義を次のように拡張します。

```javascript
const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;
```

`App` コンポーネント内で、 `render()` メソッドの前に次の 2 つのメソッドを追加します。

```javascript
todoMutation = async () => {
  const todoDetails = {
    name: 'Party tonight!',
    description: 'Amplify CLI rocks!'
  };

  const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
  alert(JSON.stringify(newTodo));
};

listQuery = async () => {
  console.log('listing todos');
  const allTodos = await API.graphql(graphqlOperation(listTodos));
  alert(JSON.stringify(allTodos));
};
```

これで、アプリケーションからGraphQL呼び出しを行うことができます。 `render()` メソッドを更新して、変更とクエリを呼び出すための次のボタンを持つようにします:

```javascript
  render() {
    return (
      <div className="App">
        <p> Pick a file</p>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.listQuery}>GraphQL Query</button>
        <button onClick={this.todoMutation}>GraphQL Mutation</button>
        <S3Album level="private" path='' />
      </div>
    );
  }
```

Save the file and run `amplify publish`. After the backend is deployed, you can choose **GraphQL Mutation** to enter data into the database and **GraphQL Query** to retrieve a list of all entries. You can validate this in the AWS AppSync console too.

## REST API コールをデータベースに追加

For this example, we use a REST backend with a NoSQL database. Run `amplify add api` and follow the prompts. Select the **REST** option and provide a friendly name for your API, such as **myapi** or something else that you can remember. Use the default `/items` path and choose **Create a new lambda function**. Choose the option titled **CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)** when prompted. This creates an architecture using Amazon API Gateway with Express running in an AWS Lambda function that reads and writes to Amazon DynamoDB. You can modify the routes in the Lambda function later to meet your needs and update it in the cloud.

Since you do not have a database provisioned yet, the CLI workflow prompts you for this information. Alternatively, you can run `amplify add storage` beforehand to create a DynamoDB table and use it in this setup. When the CLI prompts you for the primary key structure, use an attribute named `id` of type `String`. Don't select any other options like sort keys or global secondary indexes (GSIs).

Next, for the API security type questions, choose **Yes** when prompted for Restriction of API access. Similar to the storage category, when prompted for **Who should have access?**, choose **Auth and guest users** to give both authorized and guest users access. In the next prompts, based on your previous selection you would be asked to configure read/write permissions for authorized and guest user.

React プロジェクトで、 `アプリを編集します。 s <code>` ファイルを再度作成し、 `API` カテゴリを含めることで、アプリから API 呼び出しを行うことができるようにインポートを変更します。

```javascript
import Amplify, { Analytics, Storage, API } from 'aws-amply';
```

`アプリで. s <code> , <code> render()`メソッドの前に以下のコードを追加し、 `myapi` を設定時に別の名前を使用した場合は、 `myapi` を更新します。

```javascript
post = async () => {
  console.log('calling api');
  const response = await API.post('myapi', '/items', {
    body: {
      id: '1',
      name: 'hello amplify!'
    }
  });
  alert(JSON.stringify(response, null, 2));
};
get = async () => {
  console.log('calling api');
  const response = await API.get('myapi', '/items/object/1');
  alert(JSON.stringify(response, null, 2));
};
list = async () => {
  console.log('calling api');
  const response = await API.get('myapi', '/items/1');
  alert(JSON.stringify(response, null, 2));
};
```

`render()` メソッドを更新し、次のメソッドへの呼び出しを含めます。

```javascript
  render() {
    return (
      <div className="App">
        <p> Pick a file</p>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.post}>POST</button>
        <button onClick={this.get}>GET</button>
        <button onClick={this.list}>LIST</button>

        <S3Album level="private" path='' />
      </div>
    );
  }
```

Save the file and run `amplify publish`. After the API is deployed along with the Lambda function and database table, your app is built and updated in the cloud. You can then add a record to the database by choosing **POST**, and then using **GET** or **LIST** to retrieve the record, which has been hard coded in this simple example.

In your project directory, open `./amplify/backend/function` and you'll see the Lambda function that you created. The `app.js` file runs the Express function and all of the HTTP method routes are available for you to manipulate. For example, the `API.post()` in your React app corresponded to the `app.post(path, function(req, res){...})` code in this Lambda function. If you choose to customize the Lambda function, you can update it in the cloud using `amplify push`.

## XR シュメールシーンの追加

アマゾンシュメールシーンをロードするには、 [Amplify Authカテゴリ](~/lib/auth/getting-started.md?platform=js) を有効にする必要があります。

```bash
増幅して認証を追加
```

The `./src/aws-exports.js` file that's created has all of the appropriate cloud resources defined for your application. Edit `./src/App.js` to include the Amplify library and configurations. Then, initialize the library as follows:

```javascript
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { SumerianScene } from 'aws-amplify-react';
import scene1Config from './sumerian_exports_<sceneId>'; // This file will be generated by the Sumerian AWS Console

Amplify.configure({
  ...awsconfig,
  XR: {
    region: 'us-east-1', // Sumerian region
    scenes: {
      scene1: {
        // Friendly scene name
        sceneConfig: scene1Config // Scene configuration from Sumerian publish
      }
    }
  }
});
```

`render()` メソッドを更新して、Sumerian Scene コンポーネントを含めます:

{% include_relative common/scene-size-note.md %}

```javascript
  render() {
    return (
      <div className="App">
        // sceneName: the configured friendly scene you would like to load
        <SumerianScene sceneName="scene1" />
      </div>
    );
  }
```

シュメールシーンの作成と公開については、 [XR ドキュメント](~/lib/xr/getting-started.md?platform=js) を参照してください。

## サーバーレス関数のテスト

Amplify CLI は Lambda 関数のローカルテストをサポートします。 以前に作成されたLambda関数のリソース名を取得するには、 `amplifyステータス` を実行し、次のように実行します。

```
amplify関数は <resourcename>を呼び出します。
```

In this case, the function runs, but it doesn't exit because this Lambda example starts an Express server which you need to manually close when testing it from the CLI. Use `ctrl-c` to close and open the `./amplify/backend/function/resourcename` directory to see the local structure that is packaged for Lambda invocation from API Gateway. The Lambda function is inside the `src` directory, along with `event.json`, which is used for the `amplify function invoke` command you just ran. `index.js` is also in this directory, which is the main entry point for the Serverless Express library that echoed out the test event and instantiated the server inside `app.js`. Since the Express routes defined in `app.js` don't have a path that's called via the test event, it responded with a 404 message. For more information, see https://github.com/awslabs/aws-serverless-express.

## JWT ストレージに関する注意

標準的なストレージアダプターを使用する場合、データは暗号化されていない状態で保存されます (`localStorage` ブラウザと React Nativeの `AsyncStorage` )。 Amplifyは、データを保持するために独自のストレージオブジェクトを使用するオプションを提供します。これを使用すると、次のようなライブラリの周りに細いラッパーを書くことができます。

- `react-native-keychain`
- `react-native-secure-storage`
- Expo's secure store

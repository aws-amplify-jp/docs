> ### 前提条件
> 
> * Android API レベル 16 (Android 4.1) 以上を対象とした [Android プロジェクト](https://developer.android.com/training/basics/firstapp/creating-project)
> * [Amplify CLI を](~/cli/start/install.md) インストールして設定

## Amplify付きGraphQL API

Amplify APIカテゴリは、RESTおよびGraphQLエンドポイントにHTTPリクエストを行うためのソリューションを提供します。GraphQLについては、 [AWS AppSync](https://aws.amazon.com/appsync/)をサポートしています。

## GraphQL API サービスの作成

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して api を追加
```

```console
? Please select from one of the below mentioned services: `GraphQL`
? Provide API name: `apiName`
? Choose the default authorization type for the API `API key`
? Enter a description for the API key:
? After how many days from now the API key should expire (1-365): `30`
? Do you want to configure advanced settings for the GraphQL API `No, I am done.`
? Do you have an annotated GraphQL schema? `No`
? Do you want a guided schema creation? `Yes`
? What best describes your project: `One-to-many relationship (e.g., "Blogs" with "Posts" and "Comments")`
? Do you want to edit the schema now? `No`
```

これにより、以下のスキーマが作成されます。
```graphql
type Blog @model {
  id: ID!
  name: String!
  posts: [Post] @connection(name: "BlogPosts")
}

type Post @model {
  id: ID!
  title: String!
  blog: Blog @connection(name: "BlogPosts")
  comments: [Comment] @connection(name: "PostComments")
}

type Comment @model {
  id: ID!
  content: String
  post: Post @connection(name: "PostComments")
}
```

API をデプロイするには、Amplify `push` コマンドを使用します。

```bash
push を増幅する
```

```console
? 続行してもよろしいですか? `はい`
? 新しく作成したGraphQL API `いいえ` 用のコードを生成しますか?
```

バックエンドが正常にプロビジョニングされると、2つの新しい生成されたファイルがあります: `amplifyconfiguration. son <code> and` awsconfiguration.json `` in your `app/src/main/res/raw` directory

プロジェクトにデプロイされたサービスをいつでも表示するには、次のコマンドを実行してAmplify Consoleに移動します。

```bash
増幅コンソール
```

次のコマンドでスキーマに対する操作を簡単に実行できるように、Javaモデルを生成します。

```console
$ amplify codegen models

The following types do not have '@auth' enabled. Consider using @auth with @model
     - Blog
     - Post
     - Comment
Learn more about [@auth here](~/cli/graphql-transformer/auth.md).


GraphQL schema compiled successfully.
```

This will generate the Model files to be used with `Amplify.API` to query, mutate, and subscribe to your AppSync endpoint. After build completes, the model files will be generated under `app/src/main/java/com/amplifyframework.datastore.generated.model`.

注意: 次の手順を実行するまで、これらのファイルにインポートエラーが表示されます。

## アプリケーションの設定

**プロジェクト** `build.gradle` を開き、 `mavenCentral()` をリポジトリとして追加します:

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
}
```

次に、 **アプリ** `build.gradle` に次の依存関係を追加します。

```groovy
dependencies {
  implementation 'com.amplifyframework:aws-api:1.6.4'

  // Java 8 機能のサポート
  coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.0.10'
}
```
**アプリ** `build.gradle`でも、このコードを追加して Java 8 の機能をAmplify でサポートします。

```groovy
android {
  compileOptions {
    // Java 8 機能のサポート
    coreLibraryDesugaringEnabled true
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
}
```

プロジェクトを Maven と同期し、正常にビルドされていることを確認します。

### (オプション) モデルを自動生成するためにGradle Pluginを追加する

スキーマを変更したときに、ローカルとサーバーの両方でモデルを簡単に更新したい場合。 以下の手順に従って、プロセス全体をビルド時に自動化する Gradle プラグインをインストールしてください。

1 - **プロジェクト** `build.gradle` に次の依存関係を追加:

* `classpath 'com.amplifyframework:amplify-tools-gradle-plugin:1.0.1'` 依存関係として
* 以下の例のように、 `'com.amplifyframework.amplifytools'` のプラグインです。

```groovy
buildscript {
  dependencies {
      classpath 'com.android.tools.build:gradle:4.0.1'
      classpath 'com.amplifyframework:amplify-tools-gradle-plugin:1.0.1'
  }
}

apply plugin: 'com.amplifyframework.amplifytools'
```

2 - 「プロジェクトを作る」を実行

When the build is successful, it adds two gradle tasks to you project - `modelgen` and `amplifyPush`. These can be found in the configuration dropdown menu which currently would display app if it's a new project, up where you would run your project. Whenever you update your schema (found at `amplify/backend/api/amplifyDatasource/schema.graphql`) run the `modelgen` task followed by `amplifyPush` to update your online resources and local Java models.

## Amplifyを初期化

MainActivity の上部に次のインポートを追加し、 `onCreate` メソッドの下部にコードを追加します(理想的には、これはアプリケーションクラスに入りますが、すぐに開始できます)。

```java
import com.amplifyframework.AmplifyException;
import com.amplifyframework.api.aws.AWSApiPlugin;
import com.amplifyframework.core.Amplify;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            Amplify.addPlugin(new AWSApiPlugin());
            Amplify.configure(getApplicationContext());
            Log.i("ApiQuickstart", "All set and ready to go!");
        } catch (AmplifyException exception) {
            Log.e("ApiQuickstart", exception.getMessage(), exception);
        }
    }    
}
```


### Summary

今、あなたはあなたのAndroidアプリケーションを構築し、実行し、logcatで「すべてのセットと行く準備ができて参照してくださいすることができるようにする必要があります。

この例では、Amplify CLI を使用して GraphQL API を設定します。 APIスキーマから自動生成されたJavaモデルクラスとAndroidアプリケーションに統合されました。

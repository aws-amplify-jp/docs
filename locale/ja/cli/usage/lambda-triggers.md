---
title: Lambda Triggers
description: Lambda トリガーは、ユーザーのジャーニーの特定のライフサイクル中に機能を追加するのに役立ちます。 Lambdaトリガーを認証シナリオ、S3バケット、DynamoDBテーブル、Kinesisストリームと関連付けます。
---

Lambda トリガーは、ユーザーのジャーニーの特定のライフサイクル中に機能を追加するのに役立ちます。 Amplifyは一般的なトリガーテンプレートを用意しており、いくつかの簡単な質問を通じて有効にしたり変更したりできます。

## Cognito Lambda Triggers

Certain AWS Services can [invoke Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html) in response to lifecycle events. The Amplify CLI provides trigger templates for common use cases.

これらのテンプレートの機能を変更したい場合は、プッシュする前にローカルで行うことができます。 CLI でテンプレートを選択した後、テンプレートのローカル コピーは `amplify/backend/function/<function-name>/src` にあります。

Amazon Cognitoでは、イベントごとに1つのLambdaトリガーを設定できます。 CognitoトリガーをCLI経由で設定する際の柔軟性を高めるため。 CLI は、JavaScript モジュールをループするインデックス ファイルを作成します。 設定する各テンプレートは、独自の JavaScript モジュールです。 これにより、単一のライフサイクルイベントに複数のユースケースと論理フローをアタッチできます。

インデックスファイルと各モジュールの両方を編集する機会があります。 たとえば、電子メール拒否リスト [PreSignUp](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html) トリガーを作成するとき、あなたは尋ねられます

```console
$ ローカルの PreSignUp lambda 関数を編集しますか? (Y/n)
```

「はい」を選択すると、エディタで索引ファイルが開きます。

次に、メール拒否リスト機能の個々のJavaScriptモジュールを編集するかどうかを尋ねられます。

```console
$ email-filter-deny-list 関数を今すぐ編集しますか?
```

### Lambda トリガーを設定

Cognitoユーザープール用にLambda Triggersを設定するには2つの方法があります。

1. デフォルトの認証CLIワークフローでは、高度な設定を構成する場合、Lambda Triggerテンプレートのリストが表示されます。

```console
$ 次の機能のいずれかを有効にしますか?
  <unk> <unk> Google reCaptcha チャレンジを追加
    <unk> メール確認リンク
    <unk> ユーザーをグループに追加する
    <unk> Email Domain Filtering (deny list)
    <unk> Email Domain Filtering (allow list)
    <unk> Custom Auth Challenge Flow (basic scaffolding - not for production)
    <unk> Override ID Token Claims
```

2.  マニュアルの認証CLIワークフローでは、上記のオプションを選択する機会が与えられます。 しかし、Lambda Trigger テンプレートを手動で設定することもできます。

```console
$ Do you want to configure Lambda Triggers for Cognito? Yes

$ Which triggers do you want to enable for Cognito?
◯ Learn More
 ──────────────
 ◯ Create Auth Challenge
❯◉ Custom Message
 ◯ Define Auth Challenge
 ◯ Post Authentication
 ◯ Post Confirmation
 ◯ Pre Sign-up
 ◯ Verify Auth Challenge Response
 ◯ Pre Token Generation

$ What functionality do you want to use for Custom Message
 ◯ Learn More
 ──────────────
❯◉ Send Account Confirmation Link w/ Redirect
 ◯ Create your own module
```

手動で設定されたLambda Triggersに強化された権限が必要な場合は、最初に設定された後に `増幅関数の更新` を実行できます。

### 認証テンプレート

CLI Authワークフローでは、以下のLambdaトリガーテンプレートが提供されます。

### Google reCaptcha によるカスタム認証チャレンジ

Captchaは、人間による介入を必要とするように設計された課題を提示することにより、フロントエンドアプリケーションがボットやその他の不要なページの相互作用を防ぐことができます。 Google reCaptcha サービスは captcha の一般的な実装です。

このテンプレートは 3 つのトリガーを構成します: [CreateAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html), [DefineAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html) , [VerifyAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html).

The first two will essentially allow the standard username/password flow to execute unimpeded, while VerifyAuthChallengeResponse will run when the `Auth.sendCustomChallenge` function is called with the data that is returned when the user interacts with the Google reCaptcha component.  The VerifyAuthChallengeResponse Lambda function will subsequently execute a POST request to Google, and will pass the success or failure of the reCaptcha interaction back to Cognito.

#### React Sample

以下のコードサンプルは、react-google-recaptcha npm パッケージを使用して React にカスタムの ConfirmSignIn コンポーネントを作成する方法を示しています。

```js
import React from 'react';
import './App.css';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, SignUp, SignIn, Greetings, ConfirmSignUp, AuthPiece } from 'aws-amplify-react';
import ReCAPTCHA from "react-google-recaptcha";


Amplify.configure({
  Auth: {
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    region: awsconfig.aws_cognito_region,
    userPoolId: awsconfig.aws_user_pools_id,
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
    authenticationFlowType: 'CUSTOM_AUTH'
  }
});

class MyCustomConfirmation extends AuthPiece {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(data) {
    Auth.sendCustomChallengeAnswer(this.props.authData, data)
    .then( (user) => {
      console.log('user signed in!: ', user)
      this.changeState('signedIn', user);
    })

  }

  render() {
    if (this.props.authState === 'customConfirmSignIn') {
      return (
        <div>
          <ReCAPTCHA
          sitekey="your-client-side-google-recaptcha-key"
          onChange={this.onChange}
          />
        </div>  
        );
      } else {
        return null;
      }
    }
  }

  class App extends React.Component {
    render() {
      return (
        <div className="App">
          <Authenticator hideDefault={true}>
            <SignIn />
            <SignUp />
            <ConfirmSignUp />
            <Greetings />
            <MyCustomConfirmation override={'ConfirmSignIn'}/>
            </Authenticator>
        </div>
      );
    }
  }

  function MyApp() {
    return <App />
  }

  export default MyApp;
```

#### 角度サンプル

次のコードサンプルは、ng-recaptcha npm パッケージを使用してAngular内にカスタムConfirmSignInコンポーネントを作成する方法を示します。

> Be sure to follow all instructions for [setting up an Angular application](~/start/start.md) with aws-amplify-angular, and [configure your Amplify instance](~/lib/auth/switch-auth.md) to use the CUSTOM_AUTH flow.

app.module.ts:
```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmplifyAngularModule,
    FormsModule,
    RecaptchaModule,
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

app.component.ts:
```js
import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cli-lambda-sample';
  confirmSignIn: boolean;
  myRecaptcha: boolean;
  user: any;
  constructor( private amplifyService: AmplifyService ) {
    this.amplifyService.authStateChange$
        .subscribe(authState => {
            this.confirmSignIn = authState.state === 'customConfirmSignIn';
            if (!authState.user) {
                this.user = null;
            } else {
                this.user = authState.user;
            }
    });
  }
  submitSignIn(e) {
    Auth.sendCustomChallengeAnswer(this.user, e)
    .then( (user) => {
      this.amplifyService.setAuthState({ state: 'signedIn', user });
    });
  }
}
```

app.component.html
```html
<amplify-authenticator [hide]="['ConfirmSignIn']"></amplify-authenticator>
<div  *ngIf="confirmSignIn">
    <re-captcha (resolved)="submitSignIn($event)" siteKey="your-client-side-google-recaptcha-key"></re-captcha>
</div>
```

#### Vue Sample

次のコードサンプルは、vue-recaptcha npm パッケージを使用して Vue にカスタムの ConfirmSignIn コンポーネントを作成する方法を示します。

App.vue
```javascript
<template>
  <div id="app">
    <amplify-authenticator></amplify-authenticator>
    <vue-recaptcha
      v-if="customConfirmSignIn"
      sitekey="your-client-side-google-recaptcha-key" @verify="onVerify"
    ></vue-recaptcha>
    <amplify-sign-out
      v-if="signedIn"
    ></amplify-sign-out>
  </div>
</template>

<script>
import { components } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue';
import VueRecaptcha from 'vue-recaptcha';


export default {
  name: 'app',
  components: {
    VueRecaptcha,
    ...components
  },
  data() {
    return {
      challengeResponse: '',
      customConfirmSignIn: false,
      signedIn: false,
      user: {},
    }
  },
  mounted: async function () {
    await this.$Amplify.Auth.currentAuthenticatedUser()
      .then((user) => {
        this.user = user;
        this.signedIn = true;
      })
      .catch((e) => {
        console.log('currentUser error', e)
      })
    AmplifyEventBus.$on('authState', info => {
      this.customConfirmSignIn = info === 'customConfirmSignIn';
      this.signedIn = info === 'signedIn';
    });
    AmplifyEventBus.$on('localUser', user => {
      this.user = user;
    });
  },
  methods: {
    onVerify: function (data) {
      this.$Amplify.Auth.sendCustomChallengeAnswer(this.user, data)
        .then( (user) => {
          AmplifyEventBus.$emit('authState', 'signedIn')
          return AmplifyEventBus.$emit('localUser', user)
        })
        .catch(function (err) { console.log('challenge error: ', err) });
    },           
  }
}
</script>
```

main.js
```js
import Vue from 'vue'
import App from './App.vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'

Amplify.configure({
  Auth: {
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    region: awsconfig.aws_cognito_region,
    userPoolId: awsconfig.aws_user_pools_id,
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
    authenticationFlowType: 'CUSTOM_AUTH'
  }
});
Vue.use(AmplifyPlugin, AmplifyModules)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

最後に、public/index.html で次のスクリプトを追加します。
```html
<script src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>
```

### カスタム認証チャレンジの基本的なScaffolding

このテンプレートは 3 つのトリガーを構成します: [CreateAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html), [DefineAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html) , [VerifyAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html).

しかし、完全に形成されたカスタム認証フローは提供されません。 代わりに、手動で編集できる 'hello world' カスタム認証フロースケルトンを作成します。 このテンプレートの目的は、独自のカスタム認証フローを構築するための出発点を与えることです。

### メール確認用リダイレクトリンク

Cognitoでは、ユーザーがアカウントを登録しようとしたときにユーザーにメールを送信するようにユーザープールを設定できます。 このメールには、CognitoのHosted UIへのリンクが含まれており、ユーザーのアカウントが確認済みとしてマークされます。

このトリガーテンプレートでは、制御する静的S3バケットへのリンクを含む電子メールメッセージを定義できます。 ユーザーのアカウントが確認され、選択したURLにリダイレクトされます(おそらくあなたのアプリケーション)。 URL にはクエリ文字列パラメータとしてユーザー名が自動的に格納されます。

このトリガーテンプレートはS3リソースを作成することに注意してください。 静的サイトに追加するファイルは、 `amplify/backend/auth/<your-resource-name>CustomMessage/assets`で編集することができます。これらは以下で構成されています:

* index.html
* spinner.js (ユーザーが確認を待っている間、ページに表示されるスピナーを制御します)
* style.css
* verify.js (確認リクエストを実行するスクリプト)

#### React Sample

以下は、aws-amplify-react authenticatorを設定し、ユーザにメールを確認するようにメッセージを表示する方法の例です。 デフォルトの「ConfirmSignUp」コンポーネントを表示する代わりに。

```js
import React from 'react';
import './App.css';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, SignUp, SignIn, Greetings, AuthPiece } from 'aws-amplify-react';


Amplify.configure(awsconfig);

class MyCustomConfirmation extends AuthPiece {
  render() {
    if (this.props.authState === 'confirmSignUp') {
      return (
        <div>Check your email for a confirmation link.</div>
      );
    } else {
      return null;
    }
  }
}



class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Authenticator hideDefault={true}>
          <SignIn />
          <SignUp />
          <Greetings />
          <MyCustomConfirmation override={'ConfirmSignUp'}/>
          </Authenticator>
      </div>
    );
  }
}

function MyApp() {
  return <App />
}

export default MyApp;
```

#### 角度サンプル

以下に、aws-amplify-angular authenticator を設定し、ユーザにメールを確認するようにメッセージを表示する方法の例を示します。 デフォルトの「ConfirmSignUp」コンポーネントを表示する代わりに。

Be sure to follow all instructions for [setting up an Angular application](~/start/start.md) with aws-amplify-angular.

app.component.ts:
```js
import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cli-lambda-sample';
  confirmSignUp: boolean;
  user: any;
  constructor( private amplifyService: AmplifyService ) {
    this.amplifyService.authStateChange$
        .subscribe(authState => {
            this.confirmSignUp = authState.state === 'confirmSignUp';
            if (!authState.user) {
                this.user = null;
            } else {
                this.user = authState.user;
            }
    });
  }
}
```

app.component.html:
```html
<amplify-authenticator [hide]="['ConfirmSignUp']"></amplify-authenticator>
<div  *ngIf="confirmSignUp">
  メールアカウントに確認メッセージがないか確認してください!
</div>

```

#### Vue Sample

以下は、アプリケーションがユーザーにメールを確認するようにメッセージを表示するように aws-amplify-vue 認証用コンポーネントを設定する方法の例です。 デフォルトの「ConfirmSignUp」コンポーネントを表示する代わりに。

```javascript
<template>
  <div id="app">
    <amplify-sign-up v-if="signUp"></amplify-sign-up>
    <amplify-sign-in v-if="signIn"  v-bind:usernameAttributes="usernameAttributes"></amplify-sign-in>
    <div v-if="confirming">Check your email for a confirmation email</div>
    <amplify-sign-out
      v-if="signedIn"
    ></amplify-sign-out>
  </div>
</template>

<script>
import { components } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue';
import VueRecaptcha from 'vue-recaptcha';


export default {
  name: 'app',
  components: {
    VueRecaptcha,
    ...components
  },
  data() {
    return {
      signIn: true,
      signUp: false,
      confirming: false,
      usernameAttributes: 'username',
      user: {},
    }
  },
  mounted: async function () {
    await this.$Amplify.Auth.currentAuthenticatedUser()
      .then((user) => {
        this.user = user;
        this.signIn = false;
      })
      .catch((e) => {
        console.log('currentUser error', e)
      })
    AmplifyEventBus.$on('authState', info => {
      this.signIn = info === 'signIn' || info === 'signedOut';
      this.confirming = info === 'confirmSignUp';
      this.signUp = info === 'signUp';
      this.signedIn = info === 'signedIn';
    });
    AmplifyEventBus.$on('localUser', user => {
      this.user = user;
    });
  }
}
</script>
```

### ユーザーをグループに追加

このトリガーを使用すると、登録時にユーザーを追加する Cognito グループを定義できます。

トリガーは、ユーザープール内のグループの存在を確認し、存在しない場合はグループを作成します。


### メールドメインフィルタリング (拒否リスト) とメールドメインフィルタ (許可リスト)

これらの2つのテンプレートを使用すると、許可または許可されていない(それぞれ)メールドメインを定義することができます。

### IDトークン請求を上書き

このテンプレートはPreトークン生成トリガーを使用しており、追加することができます。 Cognitoから返される [IDトークン](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html#amazon-cognito-user-pools-using-the-id-token) から請求を上書きまたは削除します。

操作したいクレームを定義するには、テンプレートを手動で編集する必要があります。テンプレートには現在ダミーの値がサンプルとして含まれています。


## S3 Lambda Triggers

`追加/更新ストレージ` フローに従うことで、Amplify CLIによって管理されるS3バケットにトリガーを関連付けることができます。 S3 ストレージ リソースの追加/更新を試みると、次の CLI プロンプトが表示され、トリガーを追加します。

```bash
? Do you want to add a Lambda Trigger for your S3 Bucket? Yes
? Select from the following options
❯ Choose an existing function from the project
  Create a new function
```
上のプロンプトでわかるように。 `増幅関数` を使用して、このプロジェクトの一部としてCLIを使用して作成された既存のLambda関数を使用するか、S3イベントを処理するベースのLambda関数を使用して新しい関数を作成するかを選択できます。 また、S3バケットにアクセスするために新しく作成された関数のLambda実行ロールに必要なIAMポリシーを自動的に入力します。

***注***: Lambda FunctionトリガーをS3バケットに1つだけ関連付けることができます。

## DynamoDB Lambda Triggers

Lambda トリガーを Amplify CLI で管理する DynamoDB テーブルに関連付けることができます。 DynamoDBをAmplify CLIでプロビジョニングするには2つの方法があります。

- [ストレージカテゴリ](~/cli/storage/overview.md#)の一部として
- [GraphQL API の一部として (@model アノテーション付きの型)](~/cli/graphql-transformer/model.md)


### ストレージカテゴリの一環として

Amplifyの追加/更新ストレージフローを使用して、DynamoDBテーブルをAmplifyプロジェクトに追加および管理できます。 DynamoDBストレージリソースの追加/更新を試みると、次のCLIプロンプトが表示され、トリガーを追加します。

```bash
? Do you want to add a Lambda Trigger for your Table? Yes
? Select from the following options (Use arrow keys)
❯ Choose an existing function from the project
  Create a new function
```

上のプロンプトでわかるように。 `増幅関数` を使用して、このプロジェクトの一部としてCLIを使用して作成された既存のLambda関数を使用するか、ベースのLambda関数ハンドルDynamoDBイベントを使用して新しい関数を作成するかを選択できます。

***注***: 複数の Lambda 関数トリガーを DynamoDB テーブルに関連付けることができます。

### GraphQL API の一部として (@model アノテーション付きの型)

`amplify add api`を介して追加できるGraphQL変圧器のDynamoDBバックグラウンド@modelsに関連付けることもできます。 DynamoDBアイテムの変更を引き起こすGraphQL変更により、Lambda関数をトリガーすることのできるDynamoDBストリームに変更レコードが公開されます。 このような関数を作成するには、次の新しいラムダ関数を追加します。

```bash
$ amplify add 関数
```

名前を指定し、Lambda Trigger テンプレートを選択してください:

```bash
? Provide a friendly name for your resource to be used as a label for this category in the project: testtrigger
? Provide the AWS Lambda function name: mytrigger
? Choose the function template that you want to use:
  Hello world function
  CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)
  Serverless express function (Integration with Amazon API Gateway)
❯ Lambda Trigger
```

次に、イベント ソース 質問のプロンプトが表示されたら、 `Amazon DynamoDB Stream` を選択します。

```bash
?Lambdaトリガーに関連付けたいイベント ソース（矢印キーを使用）
<unk> Amazon DynamoDB Stream
  Amazon Kinesis Stream
```

次に、 `APIカテゴリgraphql @model backgrounded DynamoDB table` を選択します。

```
?
> 現在のAmplifyプロジェクトでAPIカテゴリgraphql @model backed DynamoDBテーブルを使用します。
  現在のAmplifyプロジェクトで設定されたストレージカテゴリDynamoDBテーブルを使用します。
  直接DynamoDBストリームのARNを提供します。
```
上記の質問の後、トリガーを追加する @model によって注釈付けられた型のいずれかを選択できます。

上記のフローが完了すると、以下のテンプレートを使用して、 `amplify/backend/function` ディレクトリに定型式ラムダ関数トリガーが作成されます。

```js
exports.handler = function (event, context) {
  console.log(JSON.stringify(event, null, 2));
  event.Records.forEach((record) => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  context.done(null, 'Successfully processed DynamoDB record');
};
```

`record.dynamodb` will contain a DynamoDB change json describing the item changed in DynamoDB table. Please note that it does not represent an original and new item as stored in DynamoDB table. To retrieve a original and new item you need to convert a DynamoDB json to original form:

```js
const AWS = require('aws-sdk');
const records = event.Records.map(record => ({
  new: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
  old: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
}));
```

## キネシスストリームトリガー

Amplify Analytics カテゴリ Kinesis ストリーム リソースは、Lambda トリガーのイベント ソースとしても使用できます。 Kinesisストリームに公開されたイベントはラムダ機能をトリガーします。 分析を追加する `フローを` 増幅することで、Kinesis ストリームをAmplifyプロジェクトに追加できます。 Kinesis StreamのLambdaトリガーを作成するには、新しいlambda関数を追加します。

```bash
$ amplify add 関数
```

名前を指定し、Lambda Trigger テンプレートを選択してください:

```bash
? Provide a friendly name for your resource to be used as a label for this category in the project: testtrigger
? Provide the AWS Lambda function name: mytrigger
? Choose the function template that you want to use:
  Hello world function
  CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)
  Serverless express function (Integration with Amazon API Gateway)
❯ Lambda Trigger
```

次に、イベント ソース 質問のプロンプトが表示されたら、 `Amazon Kinesis Stream` を選択し、リソースを選択します。

```bash
? What event source do you want to associate with Lambda trigger (Use arrow keys)
  Amazon DynamoDB Stream
❯ Amazon Kinesis Stream
? Choose a Kinesis event source option (Use arrow keys)
❯ Use Analytics category kinesis stream in the current Amplify project
  Provide the ARN of Kinesis stream directly
```


After the completion of the above flow, a Lambda function will be created in your `amplify/backend/function` directory and will be invoked when a new event is pushed to a Kinesis stream. Please refer to [Working with the API](~/lib/analytics/getting-started.md) to learn more about publishing your events to Kinesis stream.

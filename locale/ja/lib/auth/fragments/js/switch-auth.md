
クライアント側の認証には3つの異なるフローがあります:

1. `USER_SRP_AUTH`: `USER_SRP_AUTH` フローは、 <a href="https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol" target="_blank">SRP プロトコル (Secure Remote Password)</a> を使用しており、パスワードがクライアントから離れることはなく、サーバーに不明です。 これは推奨されるフローであり、デフォルトで使用されます。

2. `USER_PASSWORD_AUTH`: `USER_PASSWORD_AUTH` フローは、ユーザーの認証情報を暗号化されていない状態でバックエンドに送信します。 「Migration」トリガーを使用してユーザーをCognitoに移行し、パスワードのリセットを強制しないようにしたい場合。 トリガーによって呼び出された Lambda 関数は、提供された資格情報を確認する必要があるため、この認証タイプを使用する必要があります。

3. `CUSTOM_AATH`: `CUSTOM_AATH` フローは、異なる要件を満たすようにカスタマイズ可能な一連のチャレンジおよび応答サイクルを可能にするために使用されます。

異なるフローを使用するように `認証` を設定するには:

```javascript
Auth.configure({
    // その他の設定...
    // ...
    authenticationFlowType: 'USER_SRP_AUTH' | 'USER_PASSWORD_AUTH' | 'CUSTOM_AUTH',
})
```

> 認証フローの詳細については、 [AWS Cognito 開発者向けドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#amazon-cognito-user-pools-custom-authentication-flow) をご覧ください。

## USER_PASSWORD_AUTH フロー

`USER_PASSWORD_AUTH` 認証フローのユースケースは、ユーザーを Amazon Cognito に移行します。

### 認証バックエンドのセットアップ

In order to use the authentication flow `USER_PASSWORD_AUTH`, your Cognito app client has to be configured to allow it. In the AWS Console, this is done by ticking the checkbox at General settings > App clients > Show Details (for the affected client) > Enable username-password (non-SRP) flow. If you're using the AWS CLI or CloudFormation, update your app client by adding `USER_PASSWORD_AUTH` to the list of "Explicit Auth Flows".

### Amazon Cognitoでユーザーを移行

Amazon Cognitoは、既存のユーザーディレクトリからCognitoにシームレスにユーザーを移行するトリガーを提供します。 これを達成するには、ユーザープールにすでに存在しないユーザーが認証するたびに、Lambda関数を呼び出すユーザープールの「Migration」トリガーを設定します。 またはパスワードをリセットします。

要するに、 Lambda関数は、既存のユーザーディレクトリに対するユーザー資格情報を検証し、成功時にユーザー属性とステータスを含むレスポンスオブジェクトを返します。 エラーが発生するとエラーメッセージが返されます。 この移行フローを設定する方法と、より詳細な手順 [](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-import-using-lambda.html) についてのドキュメント [ここで](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html#cognito-user-pools-lambda-trigger-syntax-user-migration) があります。ラムダがリクエストとレスポンスオブジェクトをどのように処理するかについて説明します。

## カスタム フロー

Amazon Cognitoユーザープールは認証フローのカスタマイズをサポートし、カスタムチャレンジタイプを有効にします。 利用者の身元を確認するためのパスワードに加えて。 これらのチャレンジタイプには、CAPTCHAまたは動的チャレンジ問題が含まれます。

カスタム認証フローの課題を定義するには、Amazon Cognitoに対して3つのLambdaトリガーを実装する必要があります。

<amplify-callout>

カスタム認証課題の Lambda Triggers の操作についての詳細は、 [Amazon Cognito Developer Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html) をご覧ください。

</amplify-callout>

### カスタム認証フロー

To initiate a custom authentication flow in your app, call `signIn` without a password. A custom challenge needs to be answered using the `sendCustomChallengeAnswer` method:

```javascript
import { Auth } from 'aws-amplify';

Auth.configure({
    // other configurations
    // ...
    authenticationFlowType: 'CUSTOM_AUTH'
});

let challengeResponse = "the answer for the challenge";

Auth.signIn(username, password)
    .then(user => {
        if (user.challengeName === 'CUSTOM_CHALLENGE') {
            // to send the answer of the custom challenge
            Auth.sendCustomChallengeAnswer(user, challengeResponse)
                .then(user => console.log(user))
                .catch(err => console.log(err));
        } else {
            console.log(user);
        }
    })
    .catch(err => console.log(err));
```

### CAPTCHA ベースの認証

ここにLambda Triggerを使ったCAPTCHAチャレンジを作成するサンプルがあります。

`Create Auth Challenge Lambda Trigger` は、ユーザへのチャレンジとして CAPTCHA を作成します。 CAPTCHA画像と期待される回答のURLがプライベートチャレンジパラメータに追加されます。

```javascript
export const handler = async (event) => {
    if (!event.request.session || event.request.session.length === 0) {
        event.response.publicChallengeParameters = {
            captchaUrl: "url/123.jpg",
        };
        event.response.privateChallengeParameters = {
            answer: "5",
        };
        event.response.challengeMetadata = "CAPTCHA_CHALLENGE";
    }
    return event;
};
```

この `認証チャレンジ Lambda Trigger` を定義すると、カスタムチャレンジが定義されます。

```javascript
export const handler = async (event) => {
    if (!event.request.session || event.request.session.length === 0) {
        // If we don't have a session or it is empty then send a CUSTOM_CHALLENGE
        event.response.challengeName = "CUSTOM_CHALLENGE";
        event.response.failAuthentication = false;
        event.response.issueTokens = false;
    } else if (event.request.session.length === 1 && event.request.session[0].challengeResult === true) {
        // If we passed the CUSTOM_CHALLENGE then issue token
        event.response.failAuthentication = false;
        event.response.issueTokens = true;
    } else {
        // Something is wrong. Fail authentication
        event.response.failAuthentication = true;
        event.response.issueTokens = false;
    }

    return event;
};
```

`認証チャレンジ応答Lambda Trigger` を使用してチャレンジ応答を検証します。

```javascript
export const handler = async (event, context) => {
    if (event.request.privateChallengeParameters.answer === event.request.challengeAnswer) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }

    return event;
};
```
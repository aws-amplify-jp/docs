---
title: "認証フローの切り替え"
section: "frontend/auth"
platforms: ["android", "angular", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/auth/switching-authentication-flows/"
---

<!-- Platform: swift -->
`AWSCognitoAuthPlugin`を使用すると、サインイン時に異なる認証フロー間で切り替えることができます。フローは`amplify_outputs.json`ファイルで設定するか、`signIn` APIへのランタイムパラメータとして`authFlowType`を渡すことで設定できます。

クライアント側の認証には、ランタイムで設定できる4つの異なるフローがあります。

1. `userSRP`: `userSRP`フローは[SRPプロトコル（セキュアリモートパスワード）](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol)を使用し、パスワードはクライアントから離れることなく、サーバーには不明です。これは推奨されるフローであり、デフォルトで使用されます。

2. `userPassword`: `userPassword`フローはユーザー認証情報を暗号化されない状態でバックエンドに送信します。「Migration」トリガーを使用してユーザーをCognitoに移行し、ユーザーにパスワードのリセットを強制しない場合は、このトリガーで呼び出されるLambda関数が指定された認証情報を検証する必要があるため、このタイプを使用する必要があります。

3. `customWithSRP`: `customWithSRP`フローはSRP認証で開始してからカスタム認証に切り替えるために使用されます。初期認証にSRPを使用し、その後の認証試行にカスタム認証を使用したい場合に便利です。

4. `customWithoutSRP`: `customWithoutSRP`フローは**SRPなし**で認証フローを開始してから、異なる要件を満たすようにカスタマイズできるチャレンジと応答のサイクルのシリーズを使用するために使用されます。

5. `userAuth`: `userAuth`フローは、ユーザーが利用可能な認証方法のリストから選択できる、選択ベースの認証フローです。このフローは、ユーザーに認証方法を選択するオプションを提供したい場合に便利です。ユーザーに利用可能な選択肢は、`emailOTP`、`smsOTP`、`webAuthn`、`password`、`passwordSRP`です。

`Auth`は`AuthSignInOptions`の`authFlowType`を`AuthFlowType.userPassword`、`AuthFlowType.customAuthWithoutSrp`、または`AuthFlowType.customAuthWithSrp`として`signIn`を呼び出すことで、ランタイム時に異なるフローを使用するように設定できます。`AuthSignInOptions`で`AuthFlowType`を指定しない場合は、デフォルトフロー（`AuthFlowType.userSRP`）が使用されます。

<Callout>

ランタイム設定は優先され、amplify_outputs.jsonに存在する認証フロータイプ設定をオーバーライドします。

</Callout>

> 認証フローの詳細については、[Amazon Cognitoデベロッパー向けドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#amazon-cognito-user-pools-custom-authentication-flow)を参照してください。

## USER_AUTH（選択ベースの認証）フロー

`USER_AUTH`認証フローのユースケースは、ユーザーに認証方法を選択するオプションを提供することです。ユーザーに利用可能な選択肢は、`emailOTP`、`smsOTP`、`webAuthn`、`password`、`passwordSRP`です。

```swift
let pluginOptions = AWSAuthSignInOptions(
    authFlowType: .userAuth)
let signInResult = try await Amplify.Auth.signIn(
    username: username,
    password: password,
    options: .init(pluginOptions: pluginOptions))
guard case .continueSignInWithFirstFactorSelection(let availableFactors) = signInResult.nextStep else {
    return
}
print("Available factors: \(availableFactors)")
```

認証方法の選択はユーザーによって行われます。ユーザーは利用可能な要因から選択して、選択した要因で進めることができます。`confirmSignIn` APIを選択した要因で呼び出して、サインインプロセスを続行する必要があります。以下は、`emailOTP`要因を選択して進める場合の例です。

```swift
// emailOTPを要因として選択
var confirmSignInResult = try await Amplify.Auth.confirmSignIn(
    challengeResponse: AuthFactorType.emailOTP.challengeResponse)
```

## USER_PASSWORD_AUTH フロー

`USER_PASSWORD_AUTH`認証フローのユースケースはAmazon Cognitoへのユーザー移行です。

ユーザー移行Lambda トリガーは、ユーザーをレガシーユーザー管理システムからユーザープールに移行するのに役立ちます。USER_PASSWORD_AUTH認証フローを選択する場合、ユーザーはユーザー移行中にパスワードをリセットする必要はありません。このフローは認証時にSSL接続経由でサービスにユーザーのパスワードを送信します。

すべてのユーザーを移行したら、より安全なSRPフローに切り替えてください。SRPフローはネットワーク経由でパスワードを送信しません。

```swift
func signIn(username: String, password: String) async throws {

    let option = AWSAuthSignInOptions(authFlowType: .userPassword)
    do {
        let result = try await Amplify.Auth.signIn(
            username: username,
            password: password,
            options: AuthSignInRequest.Options(pluginOptions: option))
        print("Sign in succeeded with result: \(result)")
    } catch {
        print("Failed to sign in with error: \(error)")
    }
}
```

### Amazon Cognitoでユーザーを移行する

Amazon Cognitoは、既存のユーザーディレクトリからユーザーをCognitoにシームレスに移行するためのトリガーを提供します。これは、ユーザープールの「Migration」トリガーを設定して、ユーザープール内にまだ存在しないユーザーが認証するか、パスワードをリセットするたびにLambda関数を呼び出すことで実現されます。

簡潔に言えば、Lambda関数は既存のユーザーディレクトリに対してユーザー認証情報を検証し、成功時にユーザー属性と状態を含むレスポンスオブジェクトを返します。エラーが発生した場合はエラーメッセージが返されます。[この移行フローをセットアップする方法](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-import-using-lambda.html)に関するドキュメント、および[lambdaがリクエストレスポンスオブジェクトをどのように処理すべきかについてのより詳細な手順](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html#cognito-user-pools-lambda-trigger-syntax-user-migration)があります。

## CUSTOM_AUTH フロー

Amazon Cognito User Poolsは、ユーザーのアイデンティティを検証するためにパスワードに加えてカスタムチャレンジタイプを有効にするために認証フローをカスタマイズできます。カスタム認証フローは、異なる要件を満たすようにカスタマイズできるチャレンジと応答のサイクルのシリーズです。これらのチャレンジタイプにはCAPTCHA、ダイナミックチャレンジ質問が含まれることがあります。

カスタム認証フローの課題を定義するために、Amazon Cognitoの3つのLambdaトリガーを実装する必要があります。

フローは`AuthSignInOptions`で`AuthFlowType.customAuthWithSrp`または`AuthFlowType.customAuthWithoutSrp`で設定した`signIn`を呼び出すことで開始されます。

カスタム認証フローをアプリケーションと統合する方法についての詳細は、[カスタム認証サインイン](/gen1/[platform]/build-a-backend/auth/sign-in-custom-flow/)の手順に従ってください。
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
クライアント側の認証には4つの異なるフローがあります。

1. `USER_SRP_AUTH`: `USER_SRP_AUTH`フローは[SRPプロトコル（セキュアリモートパスワード）](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol)を使用し、パスワードはクライアントから離れることなく、サーバーには不明です。これは推奨されるフローであり、デフォルトで使用されます。

2. `USER_PASSWORD_AUTH`: `USER_PASSWORD_AUTH`フローはユーザー認証情報をバックエンドに送信しますが、SRP暗号化を適用しません。「Migration」トリガーを使用してユーザーをCognitoに移行し、ユーザーにパスワードのリセットを強制しない場合は、このトリガーで呼び出されるLambda関数が指定された認証情報を検証する必要があるため、このタイプを使用する必要があります。

3. `CUSTOM_WITH_SRP` & `CUSTOM_WITHOUT_SRP`: 異なる要件を満たすようにカスタマイズできるチャレンジと応答のサイクルのシリーズができます。

4. `USER_AUTH`: `USER_AUTH`フローは、ユーザーが利用可能な認証方法のリストから選択できる、選択ベースの認証フローです。このフローは、ユーザーに認証方法を選択するオプションを提供したい場合に便利です。ユーザーに利用可能な選択肢は、`EMAIL_OTP`、`SMS_OTP`、`WEB_AUTHN`、`PASSWORD`、`PASSWORD_SRP`です。

認証フローは`signIn`を呼び出すときにカスタマイズできます。例えば、

```ts title="src/main.ts"
await signIn({
  username: "hello@mycompany.com",
  password: "hunter2",
  options: {
      authFlowType: 'USER_AUTH'
  }
})
```

> 認証フローの詳細については、[AWSコグニト開発者ドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#amazon-cognito-user-pools-custom-authentication-flow)を参照してください。

## USER_AUTH フロー

`USER_AUTH`サインインフローは、認証の第1要因として以下のメソッドをサポートします: `WEB_AUTHN`、`EMAIL_OTP`、`SMS_OTP`、`PASSWORD`、および`PASSWORD_SRP`。

認証を開始したときに必要な第1要因がわかっている場合は、`signIn` APIに`preferredChallenge`として渡して対応する認証フローを開始できます。

```ts
// PASSWORD_SRP / PASSWORD
// 第1要因としてパスワードを使用してサインイン
// パスワードは同じステップで提供する必要があることに注意してください
const { nextStep } = await signIn({
    username: "hello@mycompany.com",
    password: "hunter2",
    options: {
        authFlowType: "USER_AUTH",
        preferredChallenge: "PASSWORD_SRP" // または "PASSWORD"
    },
});

// WEB_AUTHN / EMAIL_OTP / SMS_OTP
// 第1要因としてパスワードレスチャレンジを使用してサインイン
// このステップではユーザーの追加入力は必要ありません
const { nextStep } = await signIn({
    username: "hello@example.com",
    options: {
        authFlowType: "USER_AUTH",
        preferredChallenge: "WEB_AUTHN" // または "EMAIL_OTP" または "SMS_OTP"
    },
});
```

必要な第1要因がわからない場合、またはユーザーに利用可能なオプションを提供したい場合は、初期の`signIn` APIコールから`preferredChallenge`を省略できます。

これにより、`CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION`ステップを介してユーザーが利用可能な認証第1要因を発見できます。その後、利用可能なオプションをユーザーに表示し、`confirmSignIn` APIを使用してユーザーの選択で応答できます。

```ts
const { nextStep: signInNextStep } = await signIn({
	username: '+15551234567',
	options: {
		authFlowType: 'USER_AUTH',
	},
});

if (
	signInNextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION'
) {
	// ユーザーに利用可能なチャレンジのリストを表示
	console.log(`Available Challenges: ${signInNextStep.availableChallenges}`);

	// `confirmSignIn` APIを使用してユーザーの選択で応答
	const { nextStep: nextConfirmSignInStep } = await confirmSignIn({
		challengeResponse: 'SMS_OTP', // または 'EMAIL_OTP'、'WEB_AUTHN'、'PASSWORD'、'PASSWORD_SRP'
	});
}

```
また、初期の`signIn` APIコールに渡された`preferredChallenge`がユーザーで利用できない場合、Amplifyは`CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION`ネクストステップでも応答することに注意してください。

<Callout>
第1要因の決定とパスワードレス認証要因でのサインインに関する詳細については、[パスワードレス](/[platform]/build-a-backend/auth/concepts/passwordless/)コンセプトページをご覧ください。
</Callout>

## USER_PASSWORD_AUTH フロー

`USER_PASSWORD_AUTH`認証フローのユースケースはAmazon Cognitoへのユーザー移行です。

### 認証バックエンドのセットアップ

`USER_PASSWORD_AUTH`認証フローを使用するには、Cognitoアプリクライアントをこれを許可するように設定する必要があります。AWSコンソールでは、これはGeneral settings > App clients > Show Details（影響を受けるクライアント）> Enable username-password（non-SRP）flowでチェックボックスをチェックすることで行われます。AWS CLIまたはCloudFormationを使用している場合は、アプリクライアントを更新して、「Explicit Auth Flows」のリストに`USER_PASSWORD_AUTH`を追加してください。

### Amazon Cognitoでユーザーを移行する

Amazon Cognitoは、既存のユーザーディレクトリからユーザーをCognitoにシームレスに移行するためのトリガーを提供します。これは、ユーザープールの「Migration」トリガーを設定して、ユーザープール内にまだ存在しないユーザーが認証するか、パスワードをリセットするたびにLambda関数を呼び出すことで実現されます。

簡潔に言えば、Lambda関数は既存のユーザーディレクトリに対してユーザー認証情報を検証し、成功時にユーザー属性と状態を含むレスポンスオブジェクトを返します。エラーが発生した場合はエラーメッセージが返されます。[Amazon Cognitoユーザープールインポートガイド](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-import-using-lambda.html)で移行フローと詳細な手順を確認し、[Amazon Cognito Lambdaトリガーガイド](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html#cognito-user-pools-lambda-trigger-syntax-user-migration)を使用して、lambdaがリクエストレスポンスオブジェクトをセットアップして処理する方法を確認してください。

## `CUSTOM_WITH_SRP` & `CUSTOM_WITHOUT_SRP` フロー

Amazon Cognitoユーザープールは、ユーザーのアイデンティティを検証するためにパスワードに加えてカスタムチャレンジタイプを有効にするために認証フローをカスタマイズできます。これらのチャレンジタイプにはCAPTCHA、ダイナミックチャレンジ質問が含まれることがあります。`CUSTOM_WITH_SRP`フローは`signIn`を呼び出すときにパスワードが必要です。これらのフローは両方ともCognitoの`CUSTOM_AUTH`フローにマッピングされます。

<Callout>

カスタム認証フローの課題を定義するために、Amazon Cognitoの3つのLambdaトリガーを実装する必要があります。セットアップ手順については、[AWS Amplifyカスタム認証チャレンジ例](/[platform]/build-a-backend/functions/examples/custom-auth-flows/)をご覧ください。

</Callout>

<Callout>

カスタム認証チャレンジのLambda トリガーの操作の詳細については、[Amazon Cognito開発者向けドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)をご覧ください。

</Callout>

### カスタム認証フロー

アプリケーションでカスタム認証フローを開始するには、パスワードなしで`signIn`を呼び出します。カスタムチャレンジは`confirmSignIn` APIを使用して応答する必要があります:

```ts title="src/main.ts"
import { signIn, confirmSignIn } from 'aws-amplify/auth';

const challengeResponse = 'the answer for the challenge';

const { nextStep } = await signIn({
  username,
  options: {
    authFlowType: 'CUSTOM_WITHOUT_SRP',
  },
});

if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
  // カスタムチャレンジの答えを送信
  await confirmSignIn({ challengeResponse });
}
```

### CAPTCHA認証

Lambda トリガーでCAPTCHAチャレンジを作成するには、[AWS Amplify Google reCAPTCHAチャレンジ例](/[platform]/build-a-backend/functions/examples/google-recaptcha-challenge/)をご覧ください。詳細な例があります。
<!-- /Platform -->

<!-- Platform: android -->
`AWSCognitoAuthPlugin`を使用すると、サインイン時に異なる認証フロー間で切り替えることができます。フローは`amplify_outputs.json`ファイルで設定するか、`signIn` APIへのオプションとして`authFlowType`を渡すことで設定できます。

クライアント側の認証には、ランタイムで設定できる4つの異なるフローがあります。

1. `USER_SRP_AUTH`: `USER_SRP_AUTH`フローは[SRPプロトコル（セキュアリモートパスワード）](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol)を使用し、パスワードはクライアントから離れることなく、サーバーには不明です。これは推奨されるフローであり、デフォルトで使用されます。

2. `USER_PASSWORD_AUTH`: `USER_PASSWORD_AUTH`フローはユーザー認証情報を暗号化されない状態でバックエンドに送信します。「Migration」トリガーを使用してユーザーをCognitoに移行し、ユーザーにパスワードのリセットを強制しない場合は、このトリガーで呼び出されるLambda関数が指定された認証情報を検証する必要があるため、このタイプを使用する必要があります。

3. `CUSTOM_AUTH_WITH_SRP`: `CUSTOM_AUTH_WITH_SRP`フローはSRP認証で開始してからカスタム認証に切り替えるために使用されます。初期認証にSRPを使用し、その後の認証試行にカスタム認証を使用したい場合に便利です。

4. `CUSTOM_AUTH_WITHOUT_SRP`: `CUSTOM_AUTH_WITHOUT_SRP`フローは**SRPなし**で認証フローを開始してから、異なる要件を満たすようにカスタマイズできるチャレンジと応答のサイクルのシリーズを使用するために使用されます。

5. `USER_AUTH`: `USER_AUTH`フローは、ユーザーが利用可能な認証方法のリストから選択できる、選択ベースの認証フローです。このフローは、ユーザーに認証方法を選択するオプションを提供したい場合に便利です。ユーザーに利用可能な選択肢は、`EMAIL_OTP`、`SMS_OTP`、`WEB_AUTHN`、`PASSWORD`、`PASSWORD_SRP`です。

`Auth`は`AWSCognitoAuthSignInOptions`の`authFlowType`を`AuthFlowType.USER_PASSWORD_AUTH`、`AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP`、`AuthFlowType.CUSTOM_AUTH_WITH_SRP`、または`AuthFlowType.USER_AUTH`として`signIn`を呼び出すことで、ランタイム時に異なるフローを使用するように設定できます。`AWSCognitoAuthSignInOptions`で`AuthFlowType`を指定しない場合は、`amplify_outputs.json`で指定されたデフォルトフローが使用されます。

<Callout>

ランタイム設定は優先され、`amplify_outputs.json`に存在する認証フロータイプ設定をオーバーライドします。

</Callout>

認証フローの詳細については、[Amazon Cognitoデベロッパー向けドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#amazon-cognito-user-pools-custom-authentication-flow)を参照してください。

## USER_AUTH（選択ベースの認証）フロー

`USER_AUTH`認証フローのユースケースは、ユーザーに認証方法を選択するオプションを提供することです。ユーザーに利用可能な選択肢は、`EMAIL_OTP`、`SMS_OTP`、`WEB_AUTHN`、`PASSWORD`、`PASSWORD_SRP`です。

<Callout>
Amplifyは、WebAuthnを使用する場合、PassKey UIをアプリケーションの[Task](https://developer.android.com/guide/components/activities/tasks-and-back-stack)にアタッチするために`Activity`参照を必要とします。`Activity`を指定しない場合、UIは別のTaskに表示されます。このため、アプリケーションが`USER_AUTH`フローを使用する場合、`signIn`と`confirmSignIn`両APIに`callingActivity`オプションを渡すことを強くお勧めします。
</Callout>

必要な第1要因がサインインフロー開始前にわかっている場合は、初期サインインコールに渡すことができます。

#### [Java]

```java
// PASSWORD_SRP / PASSWORD
// 第1要因としてパスワードを使用してサインイン
// 注：パスワードは同じステップで提供する必要があります
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.PASSWORD_SRP) // または "PASSWORD"
    .build();
Amplify.Auth.signIn(
    username,
    password,
    options,
    result -> Log.i("AuthQuickStart", "Next step for sign in is " + result.getNextStep()),
    error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error)
);

// WEB_AUTHN / EMAIL_OTP / SMS_OTP
// 第1要因としてパスワードレスチャレンジを使用してサインイン
// このステップではユーザー入力は必要ありません
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.WEB_AUTHN) // または "EMAIL_OTP" または "SMS_OTP"
    .build();
Amplify.Auth.signIn(
    username,
    null,
    options,
    result -> Log.i("AuthQuickStart", "Next step for sign in is " + result.getNextStep()),
    error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
// PASSWORD_SRP / PASSWORD
// 第1要因としてパスワードを使用してサインイン
// 注：パスワードは同じステップで提供する必要があります
val options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.PASSWORD_SRP) // または "PASSWORD"
    .build()
Amplify.Auth.signIn(
    username,
    password,
    options,
    { result -> Log.i("AuthQuickStart", "Next step for sign in is ${result.nextStep}") },
    { error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error) }
)

// WEB_AUTHN / EMAIL_OTP / SMS_OTP
// 第1要因としてパスワードレスチャレンジを使用してサインイン
// このステップではユーザー入力は必要ありません
val options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.WEB_AUTHN) // または "EMAIL_OTP" または "SMS_OTP"
    .build()
Amplify.Auth.signIn(
    username,
    null,
    options,
    { result -> Log.i("AuthQuickStart", "Next step for sign in is ${result.nextStep}") },
    { error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error) }
)
```

#### [Kotlin - Coroutines]

```kotlin
// PASSWORD_SRP / PASSWORD
// 第1要因としてパスワードを使用してサインイン
// 注：パスワードは同じステップで提供する必要があります
try {
    val options = AWSCognitoAuthSignInOptions.builder()
        .callingActivity(activity)
        .authFlowType(AuthFlowType.USER_AUTH)
        .preferredFirstFactor(AuthFactorType.PASSWORD_SRP) // または "PASSWORD"
        .build()
    val result = Amplify.Auth.signIn(
        username = "hello@example.com",
        password = "password",
        options = options
    )
    Log.i("AuthQuickstart", "Next step for sign in is ${result.nextStep}")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}

// WEB_AUTHN / EMAIL_OTP / SMS_OTP
// 第1要因としてパスワードレスチャレンジを使用してサインイン
// このステップではユーザー入力は必要ありません
try {
    val options = AWSCognitoAuthSignInOptions.builder()
        .callingActivity(activity)
        .authFlowType(AuthFlowType.USER_AUTH)
        .preferredFirstFactor(AuthFactorType.WEB_AUTHN) // または "EMAIL_OTP" または "SMS_OTP"
        .build()
    val result = Amplify.Auth.signIn(
        username = "hello@example.com",
        password = null,
        options = options
    )
    Log.i("AuthQuickstart", "Next step for sign in is ${result.nextStep}")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}
```

#### [RxJava]

```java
// PASSWORD_SRP / PASSWORD
// 第1要因としてパスワードを使用してサインイン
// 注：パスワードは同じステップで提供する必要があります
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.PASSWORD_SRP) // または "PASSWORD"
    .build();
RxAmplify.Auth.signIn(username, password, options)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Next step for sign in is " + result.getNextStep()),
        error -> Log.e("AuthQuickstart", "Failed to confirm sign in", error))
    );

// WEB_AUTHN / EMAIL_OTP / SMS_OTP
// 第1要因としてパスワードレスチャレンジを使用してサインイン
// このステップではユーザー入力は必要ありません
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .callingActivity(activity)
    .authFlowType(AuthFlowType.USER_AUTH)
    .preferredFirstFactor(AuthFactorType.WEB_AUTHN) // または "EMAIL_OTP" または "SMS_OTP"
    .build();
RxAmplify.Auth.signIn(username, null, options)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Next step for sign in is " + result.getNextStep()),
        error -> Log.e("AuthQuickstart", "Failed to confirm sign in", error))
    );
```

推奨される第1要因が指定されていないか利用できない場合、複数の要因がユーザーに利用可能な場合、フローは`CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION`の`AuthNextSignInStep.signInStep`値と`AuthNextSignInStep.availableFactors`のリストを返すことで利用可能な第1要因の選択に続行します。

認証方法の選択はユーザーによって行われます。ユーザーは利用可能な要因から選択して、選択した要因で進めることができます。`confirmSignIn` APIを選択した要因で呼び出して、サインインプロセスを続行する必要があります。以下は、`WEB_AUTHN`要因を選択して進める場合の例です。

#### [Java]

```java
AuthConfirmSignInOptions options = AWSCognitoAuthConfirmSignInOptions.builder()
    .callingActivity(activity)
    .build();
Amplify.Auth.confirmSignIn(
    AuthFactorType.WEB_AUTHN.getChallengeResponse(),
    options,
    result -> Log.i("AuthQuickStart", "Next step for sign in is " + result.getNextStep()),
    error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val options = AWSCognitoAuthConfirmSignInOptions.builder()
    .callingActivity(activity)
    .build()
Amplify.Auth.confirmSignIn(
    AuthFactorType.WEB_AUTHN.challengeResponse,
    options,
    { result -> Log.i("AuthQuickStart", "Next step for sign in is ${result.nextStep}") },
    { error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val options = AWSCognitoAuthConfirmSignInOptions.builder()
        .callingActivity(activity)
        .build()
    val result = Amplify.Auth.confirmSignIn(
        challengeResponse = AuthFactorType.WEB_AUTHN.challengeResponse,
        options = options
    )
    Log.i("AuthQuickstart", "Next step for sign in is ${result.nextStep}")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}
```

#### [RxJava]

```java
AuthConfirmSignInOptions options = AWSCognitoAuthConfirmSignInOptions.builder()
    .callingActivity(activity)
    .build();
RxAmplify.Auth.confirmSignIn(AuthFactorType.WEB_AUTHN.getChallengeResponse(), options)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Next step for sign in is " + result.getNextStep()),
        error -> Log.e("AuthQuickstart", "Failed to confirm sign in", error))
    );
```

## USER_PASSWORD_AUTH フロー

`USER_PASSWORD_AUTH`認証フローのユースケースはAmazon Cognitoへのユーザー移行です。

ユーザー移行Lambda トリガーは、ユーザーをレガシーユーザー管理システムからユーザープールに移行するのに役立ちます。USER_PASSWORD_AUTH認証フローを選択する場合、ユーザーはユーザー移行中にパスワードをリセットする必要はありません。このフローは認証時にSSL接続経由でサービスにユーザーのパスワードを送信します。

すべてのユーザーを移行したら、より安全なSRPフローに切り替えてください。SRPフローはネットワーク経由でパスワードを送信しません。

#### [Java]

```java
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.USER_PASSWORD_AUTH)
    .build();
Amplify.Auth.signIn(
    "hello@example.com",
    "password",
    options,
    result -> Log.i("AuthQuickStart", "Sign in succeeded with result " + result),
    error -> Log.e("AuthQuickStart", "Failed to sign in", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.USER_PASSWORD_AUTH)
    .build()
Amplify.Auth.signIn(
    "hello@example.com",
    "password",
    options,
    { result ->
        Log.i("AuthQuickstart", "Next step for sign in is ${result.nextStep}")
    },
    { error ->
        Log.e("AuthQuickstart", "Failed to sign in", error)
    }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val options = AWSCognitoAuthSignInOptions.builder()
        .authFlowType(AuthFlowType.USER_PASSWORD_AUTH)
        .build()
    val result = Amplify.Auth.signIn(
        username = "hello@example.com",
        password = "password",
        options = options
    )
    Log.i("AuthQuickstart", "Next step for sign in is ${result.nextStep}")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}
```

#### [RxJava]

```java
AuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.USER_PASSWORD_AUTH)
    .build();
RxAmplify.Auth.signIn("hello@example.com", "password", options)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Next step for sign in is " + result.getNextStep()),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

### 認証バックエンドのセットアップ

`USER_PASSWORD_AUTH`認証フローを使用するには、Cognitoアプリクライアントをこれを許可するように設定する必要があります。Amplify Gen 2ではデフォルトでSRP認証が有効になります。USER_PASSWORD_AUTHを有効にするには、`backend.ts`ファイルを以下の変更で更新できます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'

const backend = defineBackend({
  auth,
  data,
});

// highlight-start
backend.auth.resources.cfnResources.cfnUserPoolClient.explicitAuthFlows = [
  "ALLOW_USER_PASSWORD_AUTH",
  "ALLOW_USER_SRP_AUTH",
  "ALLOW_USER_AUTH",
  "ALLOW_REFRESH_TOKEN_AUTH"
];
// highlight-end
```

### Amazon Cognitoでユーザーを移行する

Amazon Cognitoは、既存のユーザーディレクトリからユーザーをCognitoにシームレスに移行するためのトリガーを提供します。これは、ユーザープールの「Migration」トリガーを設定して、ユーザープール内にまだ存在しないユーザーが認証するか、パスワードをリセットするたびにLambda関数を呼び出すことで実現されます。

簡潔に言えば、Lambda関数は既存のユーザーディレクトリに対してユーザー認証情報を検証し、成功時にユーザー属性と状態を含むレスポンスオブジェクトを返します。エラーが発生した場合はエラーメッセージが返されます。[このフローをセットアップする方法](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-import-using-lambda.html)に関するドキュメント、および[lambdaがリクエストレスポンスオブジェクトをどのように処理すべきかについてのより詳細な手順](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html#cognito-user-pools-lambda-trigger-syntax-user-migration)があります。

## CUSTOM_AUTH フロー

Amazon Cognito User Poolsは、ユーザーのアイデンティティを検証するためにパスワードに加えてカスタムチャレンジタイプを有効にするために認証フローをカスタマイズできます。カスタム認証フローは、異なる要件を満たすようにカスタマイズできるチャレンジと応答のサイクルのシリーズです。これらのチャレンジタイプにはCAPTCHA、ダイナミックチャレンジ質問が含まれることがあります。

カスタム認証フローの課題を定義するために、Amazon Cognitoの3つのLambdaトリガーを実装する必要があります。

フローは`AWSCognitoAuthSignInOptions`で`AuthFlowType.CUSTOM_AUTH_WITH_SRP`または`AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP`で設定した`signIn`を呼び出すことで開始されます。

カスタム認証フローをアプリケーションと統合する方法についての詳細は、[カスタム認証サインイン](/gen1/[platform]/build-a-backend/auth/sign-in-custom-flow/)の手順に従ってください。
<!-- /Platform -->

<Callout>

カスタム認証チャレンジのLambda トリガーの操作についての詳細については、[Amazon Cognito開発者向けドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)をご覧ください。

</Callout>

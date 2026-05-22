---
title: "カスタム認証フロー"
section: "build-a-backend/auth/customize-auth-lifecycle"
platforms: ["android", "flutter", "swift"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/customize-auth-lifecycle/custom-auth-flows/"
---

<!-- Platform: swift -->
Auth カテゴリは、ユーザーが定義した[カスタム認証フロー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)を実行するように設定できます。以下のガイドでは、シンプルなパスワードレス認証フローのセットアップ方法を示します。

## 前提条件
Amplify ライブラリが統合されたアプリケーションと、以下のいずれかの最小ターゲット:
- **iOS 13.0**（**Xcode 14.1** 以降を使用）
- **macOS 10.15**（**Xcode 14.1** 以降を使用）
- **tvOS 13.0**（**Xcode 14.3** 以降を使用）
- **watchOS 9.0**（**Xcode 14.3** 以降を使用）
- **visionOS 1.0**（**Xcode 15** 以降を使用）（プレビューサポート - 詳細は以下を参照）

完全な例については、[プロジェクト設定のウォークスルー](/[platform]/start/quickstart/)に従ってください。

<Callout>

visionOS サポートは現在**プレビュー**段階で、最新の [Amplify Release](https://github.com/aws-amplify/amplify-swift/releases) を使用することで利用できます。
新しい Xcode および visionOS バージョンがリリースされるにつれて、サポートは必要に応じて最善の努力で更新されます。

</Callout>

<Callout>

macOS プロジェクトで Auth を使用するには、Keychain Sharing 機能を有効にする必要があります。Xcode で、**アプリケーションターゲット** > **Signing & Capabilities** > **+ Capability** に移動し、**Keychain Sharing** を選択します。

この機能が必要な理由は、Auth がプラットフォームのベストプラクティスとして macOS で Data Protection Keychain を使用するためです。macOS での Keychain の動作と Keychain Sharing 権限の詳細については、[TN3137: macOS keychain APIs and implementations](https://developer.apple.com/documentation/technotes/tn3137-on-mac-keychains) を参照してください。

アプリケーションに機能を追加する方法の詳細については、[Xcode Capabilities](https://developer.apple.com/documentation/xcode/capabilities) を参照してください。

</Callout>

## Auth を設定する

カスタム認証フローは、[手動で設定](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)できます。

## ユーザーをサインインする

ユーザーからユーザー名を取得する UI を実装します。ユーザーがユーザー名を入力した後、以下のメソッドを呼び出してサインイン フローを開始できます:

#### [Async/Await]

```swift
func signIn(username: String) async {
    do {
        let options = AWSAuthSignInOptions(authFlowType: .customWithoutSRP)
        let signInResult = try await Amplify.Auth.signIn(username: username,
                                                        options: .init(pluginOptions: options))
        if case .confirmSignInWithCustomChallenge(_) = signInResult.nextStep {
            // ユーザーにカスタムチャレンジの入力を求めます。
        } else {
            print("Sign in succeeded")
        }
    } catch let error as AuthError {
        print("Sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func signIn(username: String) -> AnyCancellable {
    Amplify.Publisher.create {
        let options = AWSAuthSignInOptions(authFlowType: .customWithoutSRP)
        try await Amplify.Auth.signIn(username: username,
                                    options: .init(pluginOptions: options))
    }.sink {
        if case let .failure(authError) = $0 {
            print("Sign in failed \(authError)")
        }
    }
    receiveValue: { result in
        if case .confirmSignInWithCustomChallenge(_) = result.nextStep {
            // ユーザーにカスタムチャレンジの入力を求めます。
        } else {
            print("Sign in succeeded")
        }
    }
}
```

これはチャレンジのあるカスタム認証フローであるため、サインイン プロセスの結果には、次のステップ `.confirmSignInWithCustomChallenge` があります。ユーザーがカスタムチャレンジを入力できるように UI を実装します。

## カスタムチャレンジでサインインを確認する

ユーザーからカスタムチャレンジを取得するには、ユーザーが必要な値を送信するための適切な UI を作成し、その値を `confirmSignin()` API に渡します。

#### [Async/Await]

```swift
func customChallenge(response: String) async {
    do {
      _ = try await Amplify.Auth.confirmSignIn(challengeResponse: response)
      print("Confirm sign in succeeded") 
    } catch let error as AuthError {
      print("Confirm sign in failed \(error)")
    } catch {
      print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func customChallenge(response: String) -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.confirmSignIn(challengeResponse: response)
        }.sink {
            if case let .failure(authError) = $0 {
                print("Confirm sign in failed \(authError)")
            }
        }
        receiveValue: { _ in
            print("Confirm sign in succeeded")
        }
}
```

コンソール ウィンドウに以下が表示される場合、サインイン フローが完了しています:

```console
Confirm sign in succeeded
```

### Lambda トリガーセットアップ

AWS Amplify は、新しいバックエンド エクスペリエンスの一部として関数を作成できるようになりました。Functions の詳細と使用を開始する方法については、[Functions ドキュメント](/[platform]/build-a-backend/functions/)を確認してください。さらに、利用可能なトリガーの詳細については、[Cognito ドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)を参照してください。

### Secure Remote Password（SRP）を使用したカスタム認証フロー

Cognito User Pool では、最初のステップとして SRP を使用してカスタム認証フローを開始できます。このフローを使用したい場合は、以下に示すように、最初のチャレンジとして SRP_A を処理するように Define Auth Lambda トリガーをセットアップします:

```javascript
exports.handler = (event, context) => {
  if (event.request.session.length == 1 && 
      event.request.session[0].challengeName == 'SRP_A') {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'PASSWORD_VERIFIER';
  } else if (event.request.session.length == 2 && 
      event.request.session[1].challengeName == 'PASSWORD_VERIFIER' && 
      event.request.session[1].challengeResult == true) {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
  } else if (event.request.session.length == 3 && 
      event.request.session[2].challengeName == 'CUSTOM_CHALLENGE' && 
      event.request.session[2].challengeResult == true) {
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
  } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
  }
  context.done(null, event);
};
```

Lambda が最初のステップとして `SRP` で開始するようにセットアップされている場合、認証フローとして `customWithSRP` を使用してサインイン プロセスを開始していることを確認してください:

```swift
let options = AWSAuthSignInOptions(
    authFlowType: .customWithSRP)
let signInResult = try await Amplify.Auth.signIn(
    username: username,
    password: password,
    options: .init(pluginOptions: options))
```
<!-- /Platform -->
<!-- Platform: android -->
Auth カテゴリは、ユーザーが定義した[カスタム認証フロー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)を実行するように設定できます。以下のガイドでは、シンプルなパスワードレス認証フローのセットアップ方法を示します。

## 前提条件

* Amplify ライブラリが統合された、少なくとも Android SDK API レベル 24 をターゲットとする Android アプリケーション
    * Android プロジェクトの作成の完全な例については、[プロジェクト設定のウォークスルー](/[platform]/start/quickstart/)に従ってください

## Auth を設定する

カスタム認証フローは、[手動で設定](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)できます。

## ユーザーを登録する

上記のフローでは、ユーザーを登録するためのパラメータとして、ユーザー名と有効なメール ID が必要です。次の API を呼び出して、サインアップ フローを開始します。

#### [Java]

```java
AuthSignUpOptions options = AuthSignUpOptions.builder()
    .userAttribute(AuthUserAttributeKey.email(), "my@email.com")
    .build();
Amplify.Auth.signUp("username", "Password123", options,
    result -> Log.i("AuthQuickStart", "Result: " + result.toString()),
    error -> Log.e("AuthQuickStart", "Sign up failed", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
val options = AuthSignUpOptions.builder()
    .userAttribute(AuthUserAttributeKey.email(), "my@email.com")
    .build()
Amplify.Auth.signUp("username", "Password123", options,
    { Log.i("AuthQuickStart", "Sign up succeeded: $it") },
    { Log.e ("AuthQuickStart", "Sign up failed", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val options = AuthSignUpOptions.builder()
    .userAttribute(AuthUserAttributeKey.email(), "my@email.com")
    .build()
try {
    val result = Amplify.Auth.signUp("username", "Password123", options)
    Log.i("AuthQuickStart", "Result: $result") 
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Sign up failed", error)
}
```

#### [RxJava]

 ```java
RxAmplify.Auth.signUp(
    "username",
    "Password123",
    AuthSignUpOptions.builder().userAttribute(AuthUserAttributeKey.email(), "my@email.com").build())
    .subscribe(
        result -> Log.i("AuthQuickStart", "Result: " + result.toString()),
        error -> Log.e("AuthQuickStart", "Sign up failed", error)
    );
```

サインアップ フローの次のステップは、ユーザーを確認することです。確認コードは、サインアップ時に提供されたメール ID に送信されます。メールで受け取った確認コードを `confirmSignUp` の呼び出しに入力します。

#### [Java]

```java
Amplify.Auth.confirmSignUp(
    "username",
    "the code you received via email",
    result -> Log.i("AuthQuickstart", result.isSignUpComplete() ? "Confirm signUp succeeded" : "Confirm sign up not complete"),
    error -> Log.e("AuthQuickstart", error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.confirmSignUp(
    "username", "the code you received via email",
    { result ->
        if (result.isSignUpComplete) {
            Log.i("AuthQuickstart", "Confirm signUp succeeded")
        } else {
            Log.i("AuthQuickstart","Confirm sign up not complete")
        }
    },
    { Log.e("AuthQuickstart", "Failed to confirm sign up", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val code = "code you received via email"
    val result = Amplify.Auth.confirmSignUp("username", code)
    if (result.isSignUpComplete) {
        Log.i("AuthQuickstart", "Signup confirmed")
    } else {
        Log.i("AuthQuickstart", "Signup confirmation not yet complete")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Failed to confirm signup", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.confirmSignUp("username", "the code you received via email")
    .subscribe(
        result -> Log.i("AuthQuickstart", result.isSignUpComplete() ? "Confirm signUp succeeded" : "Confirm sign up not complete"),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

コンソール ウィンドウに以下が表示される場合、サインアップ フローが完了しています:

```console
Confirm signUp succeeded
```

## ユーザーをサインインする

ユーザーからユーザー名を取得する UI を実装します。ユーザーがユーザー名を入力した後、以下のメソッドを呼び出してサインイン フローを開始できます:

#### [Java]

```java
AWSCognitoAuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP)
    .build();
Amplify.Auth.signIn(
    "username",
    "password",
    options,
    result -> Log.i("AuthQuickstart", result.isSignedIn() ? "Sign in succeeded" : "Sign in not complete"),
    error -> Log.e("AuthQuickstart", error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
val options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP)
    .build()
Amplify.Auth.signIn(
    "username", 
    "password", 
    options,
    { result ->
        if (result.isSignedIn) {
            Log.i("AuthQuickstart", "Sign in succeeded")
        } else {
            Log.i("AuthQuickstart", "Sign in not complete")
        }
    },
    { Log.e("AuthQuickstart", "Failed to sign in", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP)
    .build()
try {
    val result = Amplify.Auth.signIn("username", "password", options)
    if (result.isSignedIn) {
        Log.i("AuthQuickstart", "Sign in succeeded")
    } else {
        Log.e("AuthQuickstart", "Sign in not complete")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}
```

#### [RxJava]

```java
AWSCognitoAuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITHOUT_SRP)
    .build();
RxAmplify.Auth.signIn("username", "password", options)
    .subscribe(
        result -> Log.i("AuthQuickstart", result.isSignedIn() ? "Sign in succeeded" : "Sign in not complete"),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

これはチャレンジのあるカスタム認証フローであるため、サインイン プロセスの結果には、次のステップ `.confirmSignInWithCustomChallenge` があります。ユーザーがカスタムチャレンジを入力できるように UI を実装します。

## カスタムチャレンジでサインインを確認する

ユーザーからカスタム チャレンジ (この場合は `1234`) を取得し、`confirmSignin()` API に渡します。

#### [Java]

```java
Amplify.Auth.confirmSignIn(
    "confirmation",
    result -> Log.i("AuthQuickstart", "Confirm sign in succeeded: " + result.toString()),
    error -> Log.e("AuthQuickstart", "Failed to confirm sign in", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.confirmSignIn("confirmation",
    { Log.i("AuthQuickstart", "Confirm sign in succeeded: $it") },
    { Log.e("AuthQuickstart", "Failed to confirm sign in", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.confirmSignIn("confirmation")
    Log.i("AuthQuickstart", "Confirm sign in succeeded: $result") 
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Failed to confirm signin", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.confirmSignIn("confirmation")
    .subscribe(
        result -> Log.i("AuthQuickstart", result.toString()),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

コンソール ウィンドウに以下が表示される場合、サインイン フローが完了しています:

```console
Confirm sign in succeeded
```

### Lambda トリガーセットアップ

AWS Amplify は、AWS Amplify の一部として関数を作成できるようになりました。Functions の詳細と使用を開始する方法については、[Functions ドキュメント](/[platform]/build-a-backend/functions/)を確認してください。さらに、利用可能なトリガーの詳細については、[Cognito ドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)を参照してください。

### Secure Remote Password（SRP）を使用したカスタム認証フロー

Cognito User Pool では、最初のステップとして SRP を使用してカスタム認証フローを開始できます。このフローを使用したい場合は、以下に示すように、最初のチャレンジとして SRP_A を処理するように Define Auth Lambda トリガーをセットアップします:

```javascript
exports.handler = (event, context) => {
  if (event.request.session.length == 1 &&
      event.request.session[0].challengeName == 'SRP_A') {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'PASSWORD_VERIFIER';
  } else if (event.request.session.length == 2 &&
      event.request.session[1].challengeName == 'PASSWORD_VERIFIER' &&
      event.request.session[1].challengeResult == true) {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
  } else if (event.request.session.length == 3 &&
      event.request.session[2].challengeName == 'CUSTOM_CHALLENGE' &&
      event.request.session[2].challengeResult == true) {
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
  } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
  }
  context.done(null, event);
};
```

Lambda が最初のステップとして `SRP` で開始するようにセットアップされている場合、認証フローとして `customWithSRP` を使用してサインイン プロセスを開始していることを確認してください:

#### [Java]

```java
AWSCognitoAuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITH_SRP)
    .build();
Amplify.Auth.signIn(
    "username",
    "password",
    options,
    result -> Log.i("AuthQuickstart", result.isSignedIn() ? "Sign in succeeded" : "Sign in not complete"),
    error -> Log.e("AuthQuickstart", error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
val options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITH_SRP)
    .build()
Amplify.Auth.signIn(
    "username", 
    "password", 
    options,
    { result ->
        if (result.isSignedIn) {
            Log.i("AuthQuickstart", "Sign in succeeded")
        } else {
            Log.i("AuthQuickstart", "Sign in not complete")
        }
    },
    { Log.e("AuthQuickstart", "Failed to sign in", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITH_SRP)
    .build()
try {
    val result = Amplify.Auth.signIn("username", "password", options)
    if (result.isSignedIn) {
        Log.i("AuthQuickstart", "Sign in succeeded")
    } else {
        Log.e("AuthQuickstart", "Sign in not complete")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign in failed", error)
}
```

#### [RxJava]

```java
AWSCognitoAuthSignInOptions options = AWSCognitoAuthSignInOptions.builder()
    .authFlowType(AuthFlowType.CUSTOM_AUTH_WITH_SRP)
    .build();
RxAmplify.Auth.signIn("username", "password", options)
    .subscribe(
        result -> Log.i("AuthQuickstart", result.isSignedIn() ? "Sign in succeeded" : "Sign in not complete"),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

<!-- /Platform -->

<!-- Platform: flutter -->
Auth カテゴリは、ユーザーが定義した[カスタム認証フロー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)を実行するように設定できます。以下のガイドでは、シンプルなパスワードレス認証フローのセットアップ方法を示します。

## 前提条件

Amplify には、iOS (13.0)、Android (API レベル 24)、および macOS (10.15) の最小ターゲット プラットフォームが必要です。Web、Windows、または Linux をターゲットにする場合は、[Flutter のサポートされているデプロイ プラットフォーム](https://docs.flutter.dev/reference/supported-platforms)を参照してください。いくつかのターゲット プラットフォームには追加のセットアップが必要です。プラットフォーム固有のセットアップの詳細については、[プラットフォーム セットアップ](/[platform]/frontend/auth/sign-in/#platform-setup)を参照してください。

## Auth を設定する

カスタム認証フローは、[手動で設定](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)できます。

## ユーザーを登録する

上記のフローでは、ユーザーを登録するためのパラメータとして、ユーザー名と有効なメール ID が必要です。次の API を呼び出してサインアップ フローを開始します。

Cognito での認証フローは設定を通じて切り替えることができますが、ユーザーはパスワード付きで登録することが依然として必要です。

```dart
Future<void> signUpCustomFlow() async {
  try {
    final userAttributes = <AuthUserAttributeKey, String>{
      AuthUserAttributeKey.email: 'email@domain.com',
      AuthUserAttributeKey.phoneNumber: '+15559101234',
      // additional attributes as needed
    };
    final result = await Amplify.Auth.signUp(
      username: 'myusername',
      password: 'mysupersecurepassword',
      options: SignUpOptions(userAttributes: userAttributes),
    );
    safePrint('Sign up result: $result');
  } on AuthException catch (e) {
    safePrint('Error signing up: ${e.message}');
  }
}
```

サインアップ フローの次のステップは、ユーザーを確認することです。確認コードは、サインアップ時に提供されたメール ID に送信されます。メールで受け取った確認コードを `confirmSignUp` の呼び出しに入力します。

```dart
Future<void> confirmUser({
  required String username,
  required String confirmationCode,
}) async {
  try {
    final result = await Amplify.Auth.confirmSignUp(
      username: username,
      confirmationCode: confirmationCode,
    );
    // Check if further confirmations are needed or if
    // the sign up is complete.
    await _handleSignUpResult(result);
  } on AuthException catch (e) {
    safePrint('Error confirming user: ${e.message}');
  }
}
```

## ユーザーをサインインする

ユーザーからユーザー名を取得する UI を実装します。ユーザーがユーザー名を入力した後、以下のメソッドを呼び出してサインイン フローを開始できます:

```dart
// Create state variables for the sign in status
var isSignedIn = false;
String? challengeHint;

Future<void> signInCustomFlow(String username) async {
  try {
    final result = await Amplify.Auth.signIn(username: username);
    setState(() {
      isSignedIn = result.isSignedIn;
      // Get the publicChallengeParameters from your Create Auth Challenge Lambda
      challengeHint = result.nextStep.additionalInfo['hint'];
    });
  } on AuthException catch (e) {
    safePrint('Error signing in: ${e.message}');
  }
}
```

<Callout>

ユーザーがすでにサインインし、有効なセッションがアクティブな場合、`signIn` を呼び出すことができないことに注意してください。最初に `signOut` を呼び出して、元のセッションを削除する必要があります。

</Callout>
## カスタムチャレンジでサインインを確認する

ユーザーからカスタム チャレンジを取得するには、ユーザーが必要な値を送信するための適切な UI を作成し、その値を `confirmSignin()` API に渡します。

```dart
Future<void> confirmSignIn(String generatedNumber) async {
  try {
    final result = await Amplify.Auth.confirmSignIn(
      /// Enter the random number generated by your Create Auth Challenge trigger
      confirmationValue: generatedNumber,
    );
    safePrint('Sign in result: $result');
  } on AuthException catch (e) {
    safePrint('Error signing in: ${e.message}');
  }
}
```

ユーザーが正しい応答を提供すると、アプリケーションで認証されます。

> **Warning:** <b>ConfirmSignIn の特別な処理</b>
> 
> `confirmSignIn` 呼び出し中に、Lambda から `failAuthentication: true` が返された場合、リクエストのセッションは Cognito によって無効化され、`NotAuthorizedException` がスローされます。回復するには、ユーザーは `Amplify.Auth.signIn` を呼び出して新しいサインインを開始する必要があります。
> 
> 例外: メッセージ `Invalid session for the user.` を含む `NotAuthorizedException`

## パスワード検証を含むカスタム認証フロー

このドキュメントの例では、パスワードレスのカスタム認証フローを示しています。ただし、ユーザーがカスタム認証フローの一部として有効なパスワードを提供することが必要な場合もあります。

有効なパスワードを必須にするには、[DefineAuthChallenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html) コードを変更して `PASSWORD_VERIFIER` ステップを処理できます:

```js
exports.handler = async (event) => {
  if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === 'SRP_A'
  ) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'PASSWORD_VERIFIER';
  } else if (
    event.request.session.length === 2 &&
    event.request.session[1].challengeName === 'PASSWORD_VERIFIER' &&
    event.request.session[1].challengeResult === true
  ) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
  } else if (
    event.request.session.length === 3 &&
    event.request.session[2].challengeName === 'CUSTOM_CHALLENGE' &&
    event.request.session[2].challengeResult === true
  ) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};
```
<!-- /Platform -->

---
title: "多要素認証"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-04-24T07:46:51.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/multi-factor-authentication/"
---

Amplify Auth は、ユーザーサインインフローにおける多要素認証（MFA）をサポートしています。MFA は、アカウントへのアクセスを試みるユーザーが本人であることを確認するための追加のセキュリティレイヤーです。ユーザーは自分のアイデンティティを確認するために追加情報を提供する必要があります。Amplify Auth は、時間ベースのワンタイムパスワード（TOTP）、テキストメッセージ（SMS）、およびメールによる MFA をサポートしています。

このガイドでは、これらの各方法で MFA を設定する方法を説明し、アプリケーションに適したセットアップを選択するためのトレードオフについて説明します。また、デバイスを記憶する MFA の設定方法と、ユーザーのサインインの手間を軽減する方法についても説明します。

> **Warning:** **MFA とパスワードレスは同時に使用できません。** Amazon Cognito は、同じユーザーに対して MFA とパスワードレスサインイン（パスキー、SMS OTP、メール OTP を含む）の両方を有効にすることをサポートしていません。ユーザーが MFA を設定している場合、パスワードレスサインインオプションは利用できません。詳細については、[Amazon Cognito MFA の前提条件](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html#user-pool-settings-mfa-prerequisites)を参照してください。

## 多要素認証の設定

`defineAuth` を使用してアプリの MFA を有効にします。以下の例は、TOTP で MFA を設定していますが、電話番号が必須属性ではないため、SMS は設定していません。
- SMS を MFA に使用する場合は、`userAttributes` で `phoneNumber` 属性を必須としてマークする必要があります。`loginWith.phone` が `true` の場合、この属性は自動的に必須としてマークされます。
- メールを MFA に使用する場合は、`email` 属性も `true` にし、`userAttributes` で必須としてマークする必要があります。`loginWith.email` が `true` の場合、この属性は自動的に必須としてマークされます。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true
  },
// highlight-start
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
    email: true,
  },
  senders: {
    email: {
      fromEmail: 'noreply@example.com',
      fromName: 'My App',
    },
  },
// highlight-end
  userAttributes: {
    phoneNumber: { 
      required: true
    }
  }
});
```

バックエンド auth リソースで MFA が SMS で `REQUIRED` に設定されている場合、サインアップ API 呼び出し時に電話番号を渡す必要があります。`email` または `username` を主要なサインインメカニズムとして使用している場合は、`phone_number` 属性をユーザー属性として渡す必要があります。

同様に、MFA がメールを配信メカニズムとして `REQUIRED` に設定されている場合、サインアップ API 呼び出し時にメールアドレスを渡す必要があります。`phoneNumber` または `username` を主要なサインインメカニズムとして使用している場合は、`email` 属性をユーザー属性として渡す必要があります。

この設定は、ユーザープールで有効になっている MFA メソッドの組み合わせによって変わる場合があります。

### MFA オプションを理解する

MFA を有効にする際には、2つの重要な決定事項があります：

- **MFA の強制:** このセットアップの一環として、MFA の強制方法を決定します。MFA モードを `REQUIRED` に設定して MFA を必須にすると、すべてのユーザーがサインインするために MFA を完了する必要があります。`OPTIONAL` のままにすると、ユーザーはアカウントの MFA を有効にするかどうかを選択できます。
- **MFA メソッド:** 使用する MFA メソッドも指定します：TOTP（時間ベースのワンタイムパスワード）、SMS（テキストメッセージ）、メール、またはそれらの組み合わせ。TOTP ベースの MFA の方がより安全であり、SMS やメールはアカウントの回復用に予約できるため、TOTP ベースの MFA の使用をお勧めします。

<Accordion title='TOTP、SMS、メール MFA メソッドの比較' headingLevel='4' eyebrow='詳しく見る'>

|  | 時間ベースのワンタイムパスワード（TOTP） | ショートメッセージサービス（SMS） | メール |
| --- | --- | --- | --- |
| **説明** | 認証アプリを使用して、共有秘密鍵と現在の時刻を含むユーザー認証用の短命な数値コードを生成します。 | テキストメッセージで共有されるワンタイムコードを生成し、ユーザー認証のために他の資格情報と一緒に入力します。 | ユーザーの登録済みメールアドレスにワンタイムコードを送信します。ユーザーはメールにアクセスしてコードを入力し、認証プロセスを完了する必要があります。 |
| **メリット** | コードはローカルで生成され、ネットワーク経由で送信されないため、SMS よりも安全です。TOTP アプリがインストールされている限り、携帯電話のサービスなしでも TOTP は機能します。 | ユーザー提供の電話番号で簡単に設定でき、一般的な認証方法として使い慣れています。 | メールはユーザー側で追加のハードウェアやソフトウェア要件を必要としない、広く使用されている馴染みのある通信チャンネルです。 |
| **制約** | コードを生成するアプリが必要で、アカウントの初期設定に追加の手順が加わります。コードはすぐに期限切れになるため、生成後すぐに使用する必要があります。 | SMS は携帯電話サービスを必要とし、ユーザーに追加コストが発生する可能性があります。まれですが、SMS メッセージは傍受される可能性もあります。 | メールサービスの可用性と信頼性に依存します。まれですが、メールは傍受されたり、アカウントが侵害されたりする可能性があります。 |

</details>

<!-- Platform: angular, javascript, nextjs, react, react-native, vue, android -->
ユーザーに対して複数の MFA メソッドが有効になっており、そのいずれも優先として設定されていない場合、`signIn` API は認証フローの次のステップとして `CONTINUE_SIGN_IN_WITH_MFA_SELECTION` を返します。このシナリオでは、ユーザーにサインインに使用したい MFA メソッドを選択するよう促し、その設定を `confirmSignIn` に渡す必要があります。
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react-native, react, vue -->
```ts
import { confirmSignIn, type SignInOutput } from 'aws-amplify/auth';

function handleSignInNextSteps(output: SignInOutput) {
	const { nextStep } = output;
	switch (nextStep.signInStep) {
		// ...
		case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
			const allowedMFATypes = nextStep.allowedMFATypes;
			const mfaType = promptUserForMFAType(allowedMFATypes);
		case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
			// prompt user to enter otp code delivered via SMS
			break;
		case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
			// prompt user to enter otp code from their authenticator app
			break;
		case 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE':
			// prompt user to enter otp code delivered via EMAIL
			break;
		// ...
	}
}

type MfaType = 'SMS' | 'TOTP' | 'EMAIL';

function promptUserForMFAType(allowedMFATypes?: MfaType[]): MfaType {
	// Prompt user to select MFA type
}

async function handleMFASelection(mfaType: MfaType) {
	try {
		const output = await confirmSignIn({
			challengeResponse: mfaType,
		});
		handleSignInNextSteps(output);
	} catch (error) {
		console.log(error);
	}
}
```
<!-- /Platform -->

<!-- Platform: android -->
```kotlin
fun signIn(username: String, password: String) {
    val result: AuthSignInResult
    try {
        result = Amplify.Auth.signIn(username, password)
    } catch (e: AuthException) {
        Log.e("MFASelection", "Failed to sign in", e)
    }
    handleNextSignInStep(username, result.nextStep)
}

fun handleNextSignInStep(
    username: String,
    nextStep: AuthNextSignInStep
) {
    when (nextStep.signInStep) {
        AuthSignInStep.CONTINUE_SIGN_IN_WITH_MFA_SELECTION -> {
            // User has multiple MFA methods and none are preferred
            promptUserForMfaType(nextStep.allowedMFATypes)
        }
        else -> {
            // Handle other SignInSteps
        }
    }
}

fun promptUserForMfaType(mfaTypes: Set<MFAType>?) {
    // Prompt user to select one of the passed-in MFA Types
    // Then invoke Amplify.Auth.confirmSignIn(selectedMfaType.challengeResponse)
}
```
<!-- /Platform -->

<!-- Platform: swift, flutter -->
ユーザーに対して複数の MFA メソッドが有効になっており、そのいずれも優先として設定されていない場合、`signIn` API は認証フローの次のステップとして `continueSignInWithMFASelection` を返します。このシナリオでは、ユーザーにサインインに使用したい MFA メソッドを選択するよう促し、その設定を `confirmSignIn` に渡す必要があります。
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> _handleSignInResult(SignInResult result) async {
  switch (result.nextStep.signInStep) {
    // ···
    case AuthSignInStep.continueSignInWithMfaSelection:
      final allowedMfaTypes = result.nextStep.allowedMfaTypes!;
      final selection = await _promptUserPreference(allowedMfaTypes);
      return _handleMfaSelection(selection);
    // ···
  }
}

Future<MfaType> _promptUserPreference(Set<MfaType> allowedTypes) async {
  // ···
}

Future<void> _handleMfaSelection(MfaType selection) async {
  try {
    final result = await Amplify.Auth.confirmSignIn(
      confirmationValue: selection.confirmationValue,
    );
    return _handleSignInResult(result);
  } on AuthException catch (e) {
    safePrint('Error sending MFA selection: ${e.message}');
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func signIn(username: String, password: String) async {
    do {
        let signInResult = try await Amplify.Auth.signIn(username: username, password: password)
        switch signInResult.nextStep {

        case .continueSignInWithMFASelection(let allowedMFATypes):
            print("Received next step as continue sign in by selecting MFA type")
            print("Allowed MFA types \(allowedMFATypes)")
            
            // Prompt the user to select the MFA type they want to use
            // Then invoke `confirmSignIn` api with the MFA type
        
        default:
            
            // Use has successfully signed in to the app
            print("Step: \(signInResult.nextStep)")
        }
    } catch let error as AuthError{
        print ("Sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}

func confirmSignInWithTOTPAsMFASelection() async {
    do {
        let signInResult = try await Amplify.Auth.confirmSignIn(
            challengeResponse: MFAType.totp.challengeResponse)

        if case .confirmSignInWithTOTPCode = signInResult.nextStep {
            print("Received next step as confirm sign in with TOTP")
        }

    } catch {
        print("Confirm sign in failed \(error)")
    }
}
```
<!-- /Platform -->

## SMS による多要素認証
<!-- Platform: react -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/react/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: swift -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/swift/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: flutter -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/flutter/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: android -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/android/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

上記のように SMS を MFA の第2認証レイヤーとして設定すると、ユーザーはユーザー名とパスワードでサインインした後、サインインを完了するためにテキストメッセージで認証コードを受け取ります。

> **Warning:** **警告:** SMS 認証コードを送信するには、[発信元番号をリクエスト](https://docs.aws.amazon.com/pinpoint/latest/userguide/settings-request-number.html)する必要があります。[本番環境ワークロードのための auth リソースの設定について詳しく学ぶ](/[platform]/build-a-backend/auth/moving-to-production/)。

### サインアップ時に SMS MFA を有効にする

サインアップ時にユーザーの SMS MFA を有効にするには、`phone_number` をユーザー属性として渡す必要があります。ただし、Cognito リソースの主要なサインインメカニズムが `phone_number`（`username` を有効にせずに）の場合は、属性として渡す必要はありません。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { signUp } from 'aws-amplify/auth';

await signUp({
  username: "hello@mycompany.com",
  password: "hunter2",
  options: {
    userAttributes: {
      phone_number: "+15555555555",
      email: "hello@mycompany.com",
    },
  },
});
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> signUpWithPhoneVerification(
  String username,
  String password,
) async {
  await Amplify.Auth.signUp(
    username: username,
    password: password,
    options: SignUpOptions(
      userAttributes: <AuthUserAttributeKey, String>{
        // ... if required
        AuthUserAttributeKey.email: 'test@example.com',
        AuthUserAttributeKey.phoneNumber: '+18885551234',
      },
    ),
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func signUp(username: String, password: String, email: String, phonenumber: String) async {
    do {
        let signUpResult = try await Amplify.Auth.signUp(
            username: username,
            password: password,
            options: .init(userAttributes: [
                AuthUserAttribute(.email, value: email), 
                AuthUserAttribute(.phoneNumber, value: phonenumber)
            ])
        )
        if case let .confirmUser(deliveryDetails, _, userId) = signUpResult.nextStep {
            print("Delivery details \(String(describing: deliveryDetails)) for userId: \(String(describing: userId)))")
        } else {
            print("SignUp Complete")
        }
    } catch let error as AuthError {
        print("An error occurred while registering a user \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

デフォルトでは、`confirmSignUp` API を使用してサインアップ後にユーザーアカウントを確認する必要があります。これにより、Amazon Cognito の設定に応じて、ユーザーの電話番号またはメールにワンタイムパスワードが送信されます。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { confirmSignUp } from 'aws-amplify/auth';

await confirmSignUp({
  username: "hello@mycompany.com",
  confirmationCode: "123456",
})
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> confirmSignUpPhoneVerification(
  String username,
  String otpCode,
) async {
  await Amplify.Auth.confirmSignUp(
    username: username,
    confirmationCode: otpCode,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func confirmSignUp(for username: String, with confirmationCode: String) async {
    do {
        let confirmSignUpResult = try await Amplify.Auth.confirmSignUp(
            for: username,
            confirmationCode: confirmationCode
        )
        print("Confirm sign up result completed: \(confirmSignUpResult.isSignUpComplete)")
    } catch let error as AuthError {
        print("An error occurred while confirming sign up \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

### サインイン時の SMS MFA の管理

ユーザーがサインインした後、アカウントに MFA が有効になっている場合は、ユーザーが電話番号に送信された確認コードを提供する `confirmSignIn` API を呼び出す必要があるチャレンジが返されます。

MFA が **ON** またはユーザーに対して有効になっている場合は、電話番号に送信された OTP で `confirmSignIn` を呼び出す必要があります。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { confirmSignIn } from 'aws-amplify/auth';

await confirmSignIn({
  challengeResponse: "123456"
});
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> confirmSignInPhoneVerification(String otpCode) async {
  await Amplify.Auth.confirmSignIn(
    confirmationValue: otpCode,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func confirmSignIn() async {
    do {
        let signInResult = try await Amplify.Auth.confirmSignIn(
            challengeResponse: "<confirmation code received via SMS>")
        print("Confirm sign in succeeded. Next step: \(signInResult.nextStep)")
    } catch let error as AuthError {
        print("Confirm sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

ユーザーがサインインした後、`updateMFAPreference` を呼び出して MFA タイプをユーザーに対して有効として記録し、オプションで優先として設定することで、その後のログインがこの MFA タイプをデフォルトで使用するようにします。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { updateMFAPreference } from 'aws-amplify/auth';

await updateMFAPreference({ sms: 'PREFERRED' });
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateMfaPreferences() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  await cognitoPlugin.updateMfaPreference(
    sms: MfaPreference.enabled, // or .preferred
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func updateMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let smsMfaPreference: MFAPreference = .preferred

    try await authCognitoPlugin?.updateMFAPreference(
        sms: smsMfaPreference)
}
```
<!-- /Platform -->

## TOTP による多要素認証

<!-- Platform: react -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/react/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: swift -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/swift/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: flutter -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/flutter/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: android -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/android/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

Web またはモバイルアプリケーションの多要素認証（MFA）に時間ベースのワンタイムパスワード（TOTP）を使用できます。Amplify Auth カテゴリには、認証アプリを使用した TOTP のセットアップと確認のサポートが含まれており、統合されたソリューションとユーザーのセキュリティ強化を提供します。Google Authenticator、Microsoft Authenticator などのこれらのアプリには TOTP アルゴリズムが組み込まれており、共有秘密鍵と現在の時刻を使用して短命な6桁のパスワードを生成します。

### ユーザーの TOTP を設定する

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
`signIn` API でユーザーサインインを開始した後、ユーザーが MFA メソッドとして TOTP を設定する必要がある場合、API 呼び出しはアプリで処理すべきチャレンジおよび次のステップとして `CONTINUE_SIGN_IN_WITH_TOTP_SETUP` を返します。このチャレンジは次の条件が満たされる場合に発生します：

- MFA がユーザープールで **必須** としてマークされている。
- TOTP がユーザープールで有効になっている。
- ユーザーがまだ TOTP MFA を設定していない。

`CONTINUE_SIGN_IN_WITH_TOTP_SETUP` ステップは、ユーザーがサインインする前に TOTP を設定する必要があることを意味します。このステップは、Microsoft Authenticator や Google Authenticator などの認証アプリを設定するために使用する必要がある `TOTPSetupDetails` タイプの関連値を返します。`TOTPSetupDetails` は `getSetupURI` というヘルパーメソッドを提供し、例えばユーザーのインストール済み認証アプリを開くボタンで使用できる URI を生成します。より高度なユースケースでは、`TOTPSetupDetails` には QR コードを生成したり、認証アプリに手動で入力したりするために使用できる `sharedSecret` も含まれています。

認証アプリが設定されると、ユーザーは TOTP コードを生成してライブラリに提供し、サインインプロセスを完了できます。

```ts
import { signIn, SignInOutput } from 'aws-amplify/auth';

const output = await signIn({
  username: "hello@mycompany.com",
  password: "hunter2"
});

const { nextStep } = output;
switch (nextStep.signInStep) {
  // ...
  case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
    const totpSetupDetails = nextStep.totpSetupDetails;
    const appName = 'my_app_name';
    const setupUri = totpSetupDetails.getSetupUri(appName);
    // Open setupUri with an authenticator APP to retrieve an OTP code
    break;
  // ...
}
```
<!-- /Platform -->

<!-- Platform: swift, flutter -->
`signIn` API でユーザーサインインを開始した後、ユーザーが MFA メソッドとして TOTP を設定する必要がある場合、API 呼び出しはアプリで処理すべきチャレンジおよび次のステップとして `continueSignInWithTOTPSetup` を返します。このチャレンジは次の条件が満たされる場合に発生します：

- MFA がユーザープールで **必須** としてマークされている。
- TOTP がユーザープールで有効になっている。
- ユーザーがまだ TOTP MFA を設定していない。

`continueSignInWithTOTPSetup` ステップは、ユーザーがサインインする前に TOTP を設定する必要があることを意味します。このステップは、Microsoft Authenticator や Google Authenticator などの認証アプリを設定するために使用する必要がある `TOTPSetupDetails` タイプの関連値を返します。`TOTPSetupDetails` は `getSetupURI` というヘルパーメソッドを提供し、例えばユーザーのインストール済み認証アプリを開くボタンで使用できる URI を生成します。より高度なユースケースでは、`TOTPSetupDetails` には QR コードを生成したり、認証アプリに手動で入力したりするために使用できる `sharedSecret` も含まれています。

認証アプリが設定されると、ユーザーは TOTP コードを生成してライブラリに提供し、サインインプロセスを完了できます。
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> signInUser(String username, String password) async {
  try {
    final result = await Amplify.Auth.signIn(
      username: username,
      password: password,
    );
    return _handleSignInResult(result);
  } on AuthException catch (e) {
    safePrint('Error signing in: ${e.message}');
  }
}

Future<void> _handleSignInResult(SignInResult result) async {
  switch (result.nextStep.signInStep) {
    // ···
    case AuthSignInStep.continueSignInWithTotpSetup:
      final totpSetupDetails = result.nextStep.totpSetupDetails!;
      final setupUri = totpSetupDetails.getSetupUri(appName: 'MyApp');
      safePrint('Open URI to complete setup: $setupUri');
    // ···
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func signIn(username: String, password: String) async {
    do {
        let signInResult = try await Amplify.Auth.signIn(
            username: username,
            password: password
        )

        if case .continueSignInWithTOTPSetup(let setUpDetails) = signInResult.nextStep {

            print("Received next step as continue sign in by setting up TOTP")
            print("Shared secret that will be used to set up TOTP in the authenticator app \(setUpDetails.sharedSecret)")

            // appName parameter will help distinguish the account in the Authenticator app
            let setupURI = try setUpDetails.getSetupURI(appName: "<Your_App_Name>>")

            print("TOTP Setup URI: \(setupURI)")

            // Prompt the user to enter the TOTP code generated in their authenticator app
            // Then invoke `confirmSignIn` api with the code

        }
    } catch let error as AuthError {
        print("Sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

TOTP コードは、テキストフィールドやその他の手段でユーザーから取得できます。ユーザーが TOTP コードを提供したら、TOTP コードを `challengeResponse` パラメータとして `confirmSignIn` を呼び出します。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { confirmSignIn } from 'aws-amplify/auth';

await confirmSignIn({
  challengeResponse: "123456"
});
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> confirmTotpUser(String totpCode) async {
  try {
    final result = await Amplify.Auth.confirmSignIn(
      confirmationValue: totpCode,
    );
    return _handleSignInResult(result);
  } on AuthException catch (e) {
    safePrint('Error confirming TOTP code: ${e.message}');
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func confirmSignIn() async {
    do {
        let signInResult = try await Amplify.Auth.confirmSignIn(
            challengeResponse: "<confirmation code received from Authenticator app>")
        print("Confirm sign in succeeded. Next step: \(signInResult.nextStep)")
    } catch let error as AuthError {
        print("Confirm sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

ユーザーがサインインした後、`updateMFAPreference` を呼び出して MFA タイプをユーザーに対して有効として記録し、オプションで優先として設定することで、その後のログインがこの MFA タイプをデフォルトで使用するようにします。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { updateMFAPreference } from 'aws-amplify/auth';

await updateMFAPreference({ totp: 'PREFERRED' });
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateMfaPreferences() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  await cognitoPlugin.updateMfaPreference(
    totp: MfaPreference.preferred,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func updateMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let totpMfaPreference: MFAPreference = .preferred

    try await authCognitoPlugin?.updateMFAPreference(
        totp: totpMfaPreference)
}
```
<!-- /Platform -->

### ユーザーのサインイン後に TOTP を有効にする

TOTP MFA は、ユーザーがサインインした後に設定できます。これは以下の条件が満たされた場合に可能です：

- MFA がユーザープールで **オプション** または **必須** としてマークされている。
- TOTP がユーザープールで有効な MFA メソッドとしてマークされている。

TOTP は、`Auth` カテゴリの `setUpTOTP` および `verifyTOTPSetup` API を呼び出すことで設定できます。

`setUpTOTP` API を呼び出して `TOTPSetupDetails` オブジェクトを生成します。これは Microsoft Authenticator や Google Authenticator などの認証アプリを設定するために使用する必要があります。`TOTPSetupDetails` は `getSetupURI` というヘルパーメソッドを提供し、例えばユーザーのインストール済み認証アプリを開くボタンで使用できる URI を生成します。より高度なユースケースでは、`TOTPSetupDetails` には QR コードを生成したり、認証アプリに手動で入力したりするために使用できる `sharedSecret` も含まれています。

`sharedSecret` を含み、QR コードを生成するか、認証アプリに手動で入力するために使用できます。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { setUpTOTP } from 'aws-amplify/auth';

const totpSetupDetails = await setUpTOTP();
const appName = 'my_app_name';
const setupUri = totpSetupDetails.getSetupUri(appName);
// Open setupUri with an authenticator APP to retrieve an OTP code
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> setUpTotp() async {
  try {
    final totpSetupDetails = await Amplify.Auth.setUpTotp();
    final setupUri = totpSetupDetails.getSetupUri(appName: 'MyApp');
    safePrint('Open URI to complete setup: $setupUri');
  } on AuthException catch (e) {
    safePrint('An error occurred setting up TOTP: $e');
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func setUpTOTP() async {
    do {
        let setUpDetails = try await Amplify.Auth.setUpTOTP()

        print("Received next step as continue sign in by setting up TOTP")
        print("Shared secret that will be used to set up TOTP in the authenticator app \(setUpDetails.sharedSecret)")

        // appName parameter will help distinguish the account in the Authenticator app
        let setupURI = try setUpDetails.getSetupURI(appName: "<Your_App_Name>>")

        print("TOTP Setup URI: \(setupURI)")

        // Prompt the user to enter the TOTP code generated in their authenticator app
        // Then invoke `confirmSignIn` api with the code
    } catch {
        print("TOTP Setup Initiation failed \(error)")
    }
}
```
<!-- /Platform -->

認証アプリが設定されると、ユーザーは TOTP コードを生成してライブラリに提供する必要があります。コードを `verifyTOTPSetup` に渡して TOTP セットアッププロセスを完了します。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { verifyTOTPSetup } from 'aws-amplify/auth';

await verifyTOTPSetup({ code: "123456" });
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> verifyTotpSetup(String totpCode) async {
  try {
    await Amplify.Auth.verifyTotpSetup(totpCode);
  } on AuthException catch (e) {
    safePrint('An error occurred verifying TOTP: $e');
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func verifyTOTPSetup(totpCodeFromAuthenticatorApp: String) async {
    do {
        try await Amplify.Auth.verifyTOTPSetup(
            code: totpCodeFromAuthenticatorApp)
    } catch {
        print("TOTP Setup Verification failed \(error)")
    }
}
```
<!-- /Platform -->

TOTP セットアップが完了したら、`updateMFAPreference` を呼び出して MFA タイプをユーザーに対して有効として記録し、オプションで優先として設定することで、その後のログインがこの MFA タイプをデフォルトで使用するようにします。

<!-- Platform: angular, javascript, nextjs, react, vue, android -->
```ts
import { updateMFAPreference } from 'aws-amplify/auth';

await updateMFAPreference({ sms: 'ENABLED', totp: 'PREFERRED' });
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateMfaPreferences() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  await cognitoPlugin.updateMfaPreference(
    sms: MfaPreference.enabled,
    totp: MfaPreference.preferred,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func updateMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let smsMfaPreference: MFAPreference = .enabled
    let totpMfaPreference: MFAPreference = .preferred

    try await authCognitoPlugin?.updateMFAPreference(
        sms: smsMfaPreference,
        totp: totpMfaPreference)
}
```
<!-- /Platform -->

### TOTP デバイスの紛失からの回復

> **Warning:** ユーザーが TOTP デバイスへのアクセスを失った場合、管理者に連絡してアカウントへのアクセスを支援してもらう必要があります。Cognito ユーザープールの設定に基づいて、管理者は [AdminSetUserMFAPreference](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminSetUserMFAPreference.html) を使用して、MFA の設定を別の MFA メソッドに変更するか、ユーザーの MFA を無効にすることができます。

Cognito ユーザープールで MFA が「必須」としてマークされており、別の MFA メソッドが設定されていないシナリオでは、管理者はまず [`AdminUpdateUserAttributes`](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html) の呼び出しを開始してユーザーの電話番号属性を更新する必要があります。これが完了したら、管理者は上記のように MFA の設定を SMS に変更できます。

## メールによる多要素認証
メール MFA を有効にするには、マルチファクター設定で `email: true` を設定し、メール送信者を設定します。

> **Warning:** ユーザーがメール MFA でサインインできるようにするには、ユーザープールに以下の設定オプションが必要です：
> 
> - ユーザープールで Plus または Essentials 機能プランを使用している。
> - ユーザープールが独自の Amazon SES リソースを使用してメールメッセージを送信している。
> 
> 詳細については、[Amazon Cognito メール MFA の設定](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa-sms-email-message.html)を参照してください。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true
  },
  multifactor: {
    mode: 'OPTIONAL',
    email: true,
  },
  // BE SURE TO PICK A RECOVERY OPTION APPROPRIATE FOR YOUR APPLICATION.
  accountRecovery: "EMAIL_AND_PHONE_WITHOUT_MFA",
  senders: {
    email: {
      fromEmail: 'noreply@example.com',
      fromName: 'My App',
    },
  },
});
```

<!-- Platform: swift -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/swift/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: flutter -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/flutter/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

<!-- Platform: android -->
> **Info:** Amplify で [Authenticator コンポーネント](https://ui.docs.amplify.aws/android/connected-components/authenticator)を使用している場合、この機能は追加コードなしで動作します。以下のガイドは独自の実装を作成するためのものです。
<!-- /Platform -->

上記のようにメールを MFA の第2認証レイヤーとして設定すると、ユーザーはユーザー名とパスワードでサインインした後、サインインを完了するためにメールで認証コードを受け取ります。

> **Warning:** メール認証コードを送信するには、以下の前提条件を満たす必要があります：
> - Cognito が [Amazon Simple Email Service（Amazon SES）](/[platform]/build-a-backend/auth/moving-to-production/#email)を使用してメールを送信するように設定されている必要があります。
> - Cognito でアカウントの回復が有効になっている場合、回復メッセージの配信方法を `メールのみ` に設定することはできません。

### サインアップ時に EMAIL MFA を有効にする

サインアップ時にユーザーのメール MFA を有効にするには、`email` をユーザー属性として渡す必要があります。ただし、Cognito リソースの主要なサインインメカニズムがすでに `email`（`username` を有効にせずに）の場合は、属性として渡す必要はありません。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { signUp } from 'aws-amplify/auth';

await signUp({
  username: "+15555555555",
  password: "hunter2",
  options: {
    userAttributes: {
      email: "hello@mycompany.com",
    },
  },
});
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
ArrayList<AuthUserAttribute> attributes = new ArrayList<>();
attributes.add(new AuthUserAttribute(AuthUserAttributeKey.email(), "my@email.com"));
attributes.add(new AuthUserAttribute(AuthUserAttributeKey.phoneNumber(), "+15551234567"));

Amplify.Auth.signUp(
    "username",
    "Password123",
    AuthSignUpOptions.builder().userAttributes(attributes).build(),
    result -> Log.i("AuthQuickstart", result.toString()),
    error -> Log.e("AuthQuickstart", error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
val attrs = mapOf(
    AuthUserAttributeKey.email() to "my@email.com",
    AuthUserAttributeKey.phoneNumber() to "+15551234567"
)
val options = AuthSignUpOptions.builder()
    .userAttributes(attrs.map { AuthUserAttribute(it.key, it.value) })
    .build()
Amplify.Auth.signUp("username", "Password123", options,
    { Log.i("AuthQuickstart", "Sign up result = $it") },
    { Log.e("AuthQuickstart", "Sign up failed", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val attrs = mapOf(
    AuthUserAttributeKey.email() to "my@email.com",
    AuthUserAttributeKey.phoneNumber() to "+15551234567"
)
val options = AuthSignUpOptions.builder()
    .userAttributes(attrs.map { AuthUserAttribute(it.key, it.value) })
    .build()
try {
    val result = Amplify.Auth.signUp("username", "Password123", options)
    Log.i("AuthQuickstart", "Sign up OK: $result")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Sign up failed", error)
}
```

#### [RxJava]

```java
ArrayList<AuthUserAttribute> attributes = new ArrayList<>();
attributes.add(new AuthUserAttribute(AuthUserAttributeKey.email(), "my@email.com"));
attributes.add(new AuthUserAttribute(AuthUserAttributeKey.phoneNumber(), "+15551234567"));

RxAmplify.Auth.signUp(
    "username",
    "Password123",
    AuthSignUpOptions.builder().userAttributes(attributes).build())
    .subscribe(
        result -> Log.i("AuthQuickstart", result.toString()),
        error -> Log.e("AuthQuickstart", error.toString())
    );
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> signUpWithEmailVerification(
  String username,
  String password,
) async {
  await Amplify.Auth.signUp(
    username: username,
    password: password,
    options: SignUpOptions(
      userAttributes: <AuthUserAttributeKey, String>{
        AuthUserAttributeKey.email: 'test@example.com',
        // ... if required
        AuthUserAttributeKey.phoneNumber: '+18885551234',
      },
    ),
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func signUp(username: String, password: String, email: String, phonenumber: String) async {
    do {
        let signUpResult = try await Amplify.Auth.signUp(
            username: username,
            password: password,
            options: .init(userAttributes: [
                AuthUserAttribute(.email, value: email), 
                AuthUserAttribute(.phoneNumber, value: phonenumber)
            ])
        )
        if case let .confirmUser(deliveryDetails, _, userId) = signUpResult.nextStep {
            print("Delivery details \(String(describing: deliveryDetails)) for userId: \(String(describing: userId)))")
        } else {
            print("SignUp Complete")
        }
    } catch let error as AuthError {
        print("An error occurred while registering a user \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

デフォルトでは、`confirmSignUp` API を使用してサインアップ後にユーザーアカウントを確認する必要があります。最初の `signUp` リクエストに続いて、Amazon Cognito の設定に応じて、ユーザーの電話番号またはメールにワンタイムパスコードが送信されます。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { confirmSignUp } from 'aws-amplify/auth';

await confirmSignUp({
  username: "+15555555555",
  confirmationCode: "123456",
})
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
 try {
      Amplify.Auth.confirmSignUp(
             "username",
             "confirmation code",
             result -> Log.i("AuthQuickstart", "Confirm signUp result completed: " + result.isSignUpComplete()),
             error -> Log.e("AuthQuickstart", "An error occurred while confirming sign up: " + error)
      );
} catch (Exception error) {
   Log.e("AuthQuickstart", "unexpected error: " + error);
}
```

#### [Kotlin - Callbacks]

```kotlin
 try {
      Amplify.Auth.confirmSignUp(
          "username",
          "confirmation code",
          { result ->
              Log.i("AuthQuickstart", "Confirm signUp result completed: ${result.isSignUpComplete}")
          }
      ) { error ->
          Log.e("AuthQuickstart", "An error occurred while confirming sign up: $error")
      }
} catch (error: Exception) {
    Log.e("AuthQuickstart", "unexpected error: $error")
}
```

#### [Kotlin - Coroutines]

```kotlin
try {
     val result = Amplify.Auth.confirmSignUp(
         "username",
         "confirmation code"
     )
     Log.i("AuthQuickstart", "Confirm signUp result completed: ${result.isSignUpComplete}")
} catch (error: Exception) {
   Log.e("AuthQuickstart", "unexpected error: $error")
}
```

#### [RxJava]

```java
RxAmplify.Auth.confirmSignUp(
        "username",
        "confirmation code").subscribe(
        result -> Log.i("AuthQuickstart", "Confirm signUp result completed: " + result.isSignUpComplete()),
        error -> Log.e("AuthQuickstart", "An error occurred while confirming sign up: " + error)
);
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> confirmSignUpEmailVerification(
  String username,
  String otpCode,
) async {
  await Amplify.Auth.confirmSignUp(
    username: username,
    confirmationCode: otpCode,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func confirmSignUp(for username: String, with confirmationCode: String) async {
    do {
        let confirmSignUpResult = try await Amplify.Auth.confirmSignUp(
            for: username,
            confirmationCode: confirmationCode
        )
        print("Confirm sign up result completed: \(confirmSignUpResult.isSignUpComplete)")
    } catch let error as AuthError {
        print("An error occurred while confirming sign up \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

### サインイン時の EMAIL MFA の管理

ユーザーがサインインした後、アカウントに MFA が有効になっている場合は、メールアドレスに送信されたユーザー提供の確認コードで `confirmSignIn` API を呼び出す必要があるチャレンジが発行されます。

MFA が **ON** またはユーザーに対して有効になっている場合は、メールアドレスに送信された OTP で `confirmSignIn` を呼び出す必要があります。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { confirmSignIn } from 'aws-amplify/auth';

await confirmSignIn({
  challengeResponse: "123456"
});
```
<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
try {
      Amplify.Auth.confirmSignIn(
            "confirmation code",
            result -> {
                if (result.isSignedIn()) {
                    Log.i("AuthQuickstart", "Confirm signIn succeeded");
                } else {
                    Log.i("AuthQuickstart", "Confirm sign in not complete. There might be additional steps: " + result.getNextStep());
                    // Switch on the next step to take appropriate actions.
                    // If `result.isSignedIn` is true, the next step
                    // is 'done', and the user is now signed in.
                }
            },
            error -> Log.e("AuthQuickstart", "Confirm sign in failed: " + error)
    );
} catch (Exception error) {
    Log.e("AuthQuickstart", "Unexpected error: " + error);
}
```

#### [Kotlin - Callbacks]

```kotlin
try {
    Amplify.Auth.confirmSignIn(
          "confirmation code",
          { result ->
              if (result.isSignedIn) {
                  Log.i("AuthQuickstart","Confirm signIn succeeded")
              } else {
                  Log.i("AuthQuickstart", "Confirm sign in not complete. There might be additional steps: ${result.nextStep}")
                  // Switch on the next step to take appropriate actions.
                  // If `result.isSignedIn` is true, the next step
                  // is 'done', and the user is now signed in.
              }
          }
    ) { error -> Log.e("AuthQuickstart", "Confirm sign in failed: $error")}
} catch (error: Exception) {
    Log.e("AuthQuickstart", "Unexpected error: $error")
}
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.confirmSignIn(
        "confirmation code"
    )
    if (result.isSignedIn) {
        Log.i("AuthQuickstart", "Confirm signIn succeeded")
    } else {
        Log.i("AuthQuickstart", "Confirm sign in not complete. There might be additional steps: ${result.nextStep}"
        )
        // Switch on the next step to take appropriate actions.
        // If `result.isSignedIn` is true, the next step
        // is 'done', and the user is now signed in.
    }
} catch (error: Exception) {
    Log.e("AuthQuickstart", "Unexpected error: $error")
}
```

#### [RxJava]

```java

RxAmplify.Auth.confirmSignIn(
                "confirmation code").subscribe(
                result -> {
                    if (result.isSignedIn()) {
                        Log.i("AuthQuickstart", "Confirm signIn succeeded");
                    } else {
                        Log.i("AuthQuickstart", "Confirm sign in not complete. There might be additional steps: " + result.getNextStep());
                        // Switch on the next step to take appropriate actions.
                        // If `result.isSignedIn` is true, the next step
                        // is 'done', and the user is now signed in.
                    }
                },
                error -> Log.e("AuthQuickstart", "Confirm sign in failed: " + error)
        );
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> confirmSignInEmailVerification(String otpCode) async {
  await Amplify.Auth.confirmSignIn(
    confirmationValue: otpCode,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func confirmSignIn() async {
    do {
        let signInResult = try await Amplify.Auth.confirmSignIn(
            challengeResponse: "<confirmation code received via email>")
        print("Confirm sign in succeeded. Next step: \(signInResult.nextStep)")
    } catch let error as AuthError {
        print("Confirm sign in failed \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```
<!-- /Platform -->

ユーザーがサインインした後、`updateMFAPreference` を呼び出して MFA タイプをユーザーに対して有効として記録し、オプションで優先として設定することで、その後のログインがこの MFA タイプをデフォルトで使用するようにします。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { updateMFAPreference } from 'aws-amplify/auth';

await updateMFAPreference({ email: 'PREFERRED' });
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
if (Amplify.Auth.getPlugin("awsCognitoAuthPlugin") instanceof AWSCognitoAuthPlugin) {
            AWSCognitoAuthPlugin plugin = (AWSCognitoAuthPlugin) Amplify.Auth.getPlugin("awsCognitoAuthPlugin");
            plugin.updateMFAPreference(
                    MFAPreference.DISABLED, // SMS Preference
                    MFAPreference.DISABLED, // TOTP Preference
                    MFAPreference.PREFERRED, // Email Preference
                    () -> Log.i("AuthQuickstart", "MFA preference updated successfully"),
                    e -> Log.e("AuthQuickstart", "Failed to update MFA preference.", e)
            );
        }
```

#### [Kotlin]

```kotlin
if (Amplify.Auth.getPlugin("awsCognitoAuthPlugin") is AWSCognitoAuthPlugin) {
    val plugin = Amplify.Auth.getPlugin("awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin
    plugin?.updateMFAPreference(
            MFAPreference.DISABLED, // SMS Preference
            MFAPreference.DISABLED, // TOTP Preference
            MFAPreference.PREFERRED, // Email Preference
        { Log.i("AuthQuickstart", "MFA preference updated successfully" ) },
        { e: AuthException? -> Log.e("AuthQuickstart", "Failed to update MFA preference", e) }
    )
}
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateMfaPreferences() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  await cognitoPlugin.updateMfaPreference(
    email: MfaPreference.enabled, // or .preferred
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func updateMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let emailMfaPreference: MFAPreference = .preferred

    try await authCognitoPlugin?.updateMFAPreference(
        email: emailMfaPreference)
}
```
<!-- /Platform -->

## ユーザーの優先 MFA メソッドを設定する

ユーザープールの設定によっては、特定のユーザーに複数の MFA オプションが利用可能な場合があります。ユーザーがアプリケーションにサインインするたびに MFA メソッドを選択する手間を省くために、Amplify は個々のユーザーの MFA 設定を管理するための 2 つのユーティリティ API を提供しています。

### 現在のユーザーの MFA 設定を取得する

現在のユーザーの現在の MFA 設定と有効な MFA タイプ（存在する場合）を取得するには、次の API を呼び出します。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { fetchMFAPreference } from 'aws-amplify/auth';

const { enabled, preferred } = await fetchMFAPreference();
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
if (Amplify.Auth.getPlugin("awsCognitoAuthPlugin") instanceof AWSCognitoAuthPlugin) {
    AWSCognitoAuthPlugin plugin = (AWSCognitoAuthPlugin) Amplify.Auth.getPlugin("awsCognitoAuthPlugin");
    plugin.fetchMFAPreference(
        preference -> Log.i(
            "AuthQuickStart",
            "Fetched MFA preference, enabled: " + preference.getEnabled() + ", preferred: " + preference.getPreferred()
        ),
        e -> Log.e("AuthQuickStart", "Failed to fetch MFA preference.", e)
    );
}
```

#### [Kotlin]

```kotlin
val cognitoAuthPlugin = Amplify.Auth.getPlugin("awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin
cognitoAuthPlugin?.fetchMFAPreference(
    { Log.d("AuthQuickStart", "Fetched MFA preference, enabled: ${it.enabled}, preferred: ${it.preferred}") },
    { Log.e("AuthQuickStart", "Failed to fetch MFA preference.", it) }
)
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> getCurrentMfaPreference() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  final currentPreference = await cognitoPlugin.fetchMfaPreference();
  safePrint('Enabled MFA types for user: ${currentPreference.enabled}');
  safePrint('Preferred MFA type for user: ${currentPreference.preferred}');
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func getMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let result = try await authCognitoPlugin?.fetchMFAPreference()

    print("Enabled MFA types: \(result?.enabled)")
    print("Preferred MFA type: \(result?.preferred)")
}
```
<!-- /Platform -->

### 現在のユーザーの MFA 設定を更新する

現在のユーザーの MFA 設定を更新するには、次の API を呼び出します。

> **Warning:** 一度に優先としてマークできる MFA メソッドは 1 つだけです。ユーザーが複数の MFA メソッドを有効にしており、複数の MFA メソッドを優先としてマークしようとすると、API はエラーをスローします。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts
import { updateMFAPreference } from 'aws-amplify/auth';

await updateMFAPreference({ sms: 'ENABLED', totp: 'PREFERRED' });
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
if (Amplify.Auth.getPlugin("awsCognitoAuthPlugin") instanceof AWSCognitoAuthPlugin) {
    AWSCognitoAuthPlugin plugin = (AWSCognitoAuthPlugin) Amplify.Auth.getPlugin("awsCognitoAuthPlugin");
    plugin.updateMFAPreference(
        MFAPreference.DISABLED, // SMS Preference
        MFAPreference.PREFERRED, // TOTP Preference
        null // Email Preference
        () -> Log.i( "AuthQuickStart", "Preference updated successfully"),
        e -> Log.e("AuthQuickStart", "Failed to update MFA preference.", e)
    );
}
```

#### [Kotlin - Callbacks]

```kotlin
val cognitoAuthPlugin = Amplify.Auth.getPlugin("awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin
cognitoAuthPlugin?.updateMFAPreference(
    MFAPreference.DISABLED, // SMS Preference
    MFAPreference.PREFERRED, // TOTP Preference
    null, // Email Preference
    { Log.d("AuthQuickStart", "Preference updated successfully") },
    { Log.e("AuthQuickStart", "Failed to update MFA preference.", it) }
)
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateMfaPreferences() async {
  final cognitoPlugin = Amplify.Auth.getPlugin(AmplifyAuthCognito.pluginKey);

  await cognitoPlugin.updateMfaPreference(
    sms: MfaPreference.enabled,
    totp: MfaPreference.preferred,
  );
}
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
func updateMFAPreferences() async throws {
    let authCognitoPlugin = try Amplify.Auth.getPlugin(
        for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    let smsMfaPreference: MFAPreference = .enabled
    let totpMfaPreference: MFAPreference = .preferred

    try await authCognitoPlugin?.updateMFAPreference(
        sms: smsMfaPreference,
        totp: totpMfaPreference)
}
```
<!-- /Platform -->

## デバイスを記憶する

デバイスを記憶する機能は、MFA と組み合わせて使用すると便利です。ユーザーがそのデバイスでサインインする際に第2要素の要件が自動的に満たされ、サインイン体験の摩擦が軽減されます。デフォルトでは、この機能はオフになっています。

> **Info:** **注意:** [デバイスのトラッキングと記憶](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/)機能は、以下のいずれかの条件が満たされる場合は利用できません：
> 
> - Cognito ユーザープールまたはホストされた UI を使用したフェデレーション OAuth フローが使用されている場合、または
> - `signIn` API が `authFlowType` として `USER_PASSWORD_AUTH` を使用している場合。

### デバイストラッキングの設定

`deviceTracking` コンストラクトを使用してデバイストラッキングを設定できます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.addPropertyOverride('DeviceConfiguration', {
  ChallengeRequiredOnNewDevice: true,
  DeviceOnlyRememberedOnUserPrompt: false
});
```

<Accordion title='デバイスのトラッキングに使用される主要な用語を理解する' headingLevel='4' eyebrow='詳しく見る'>

記憶済み、忘れられた、およびトラッキング済みデバイスの扱いにはいくつかの違いがあります。

- **トラッキング済み:** ユーザーが新しいデバイスでサインインするたびに、成功した認証イベントの終わりにクライアントにデバイスキーが付与されます。このデバイスキーを使用して、`ConfirmDevice` API の呼び出しに使用するソルトとパスワードベリファイアを生成します。この時点で、デバイスは「トラッキング済み」とみなされます。デバイスがトラッキング済み状態になると、Amazon Cognito コンソールを使用してトラッキングが開始された時間、最後の認証時間、およびそのデバイスに関するその他の情報を確認できます。
- **記憶済み:** 記憶済みデバイスもトラッキングされます。ユーザー認証中に、記憶済みデバイスに割り当てられたデバイスキーとシークレットのペアを使用してデバイスを認証し、ユーザーが以前にサインインに使用したデバイスと同じであることを確認します。
- **記憶されていない:** 記憶されていないデバイスは、Cognito がユーザーにデバイスを「オプトイン」で記憶させるよう設定されているが、ユーザーがデバイスを記憶しないことを選択したトラッキング済みデバイスです。このユースケースは、自分のものではないデバイスからアプリケーションにサインインするユーザー向けです。
- **忘れられた:** デバイスを記憶またはトラッキングしたくなくなった場合は、`forgetDevice()` API を使用してデバイスを記憶済みおよびトラッキング済みの両方から削除できます。

</details>

## 次のステップ

- [MFA が有効な状態でのサインアップ方法を学ぶ](/[platform]/frontend/auth/sign-in/#with-multi-factor-auth-enabled)
- [ユーザーデバイスの管理方法を学ぶ](/[platform]/build-a-backend/auth/manage-users/manage-devices/)

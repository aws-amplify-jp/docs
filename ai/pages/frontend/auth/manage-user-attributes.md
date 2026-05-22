---
title: "ユーザー属性の管理"
section: "frontend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/auth/manage-user-attributes/"
---

メールアドレスや電話番号などのユーザー属性は、個々のユーザーを識別するのに役立ちます。ユーザープロファイルに含めるユーザー属性を定義することで、ユーザーデータを大規模に管理しやすくなります。この情報は、ユーザージャーニーをパーソナライズし、コンテンツを調整し、直感的なアカウント管理を提供するなど、さまざまな用途に役立ちます。サインアップ時に事前に情報を収集することも、サインアップ後に顧客がプロファイルを更新できるようにすることもできます。このセクションでは、ユーザー属性の操作方法、設定方法、管理方法について詳しく説明します。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
## サインアップ時にユーザー属性を渡す

サインアップ時または認証されたユーザーのときにユーザー属性を作成できます。これをサインアップの一部として行うには、`signUp` APIの`userAttributes`オブジェクトにユーザー属性を渡します。

```ts
import { signUp } from "aws-amplify/auth";

await signUp({
  username: "jdoe",
  password: "mysecurerandompassword#123",
  options: {
    userAttributes: {
      email: "me@domain.com",
      phone_number: "+12128601234", // E.164 number convention
      given_name: "Jane",
      family_name: "Doe",
      nickname: "Jane",
    },
  },
});
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react, vue, react-native, nextjs, flutter, swift -->
## サインアップ時にカスタムユーザー属性を設定する

カスタム属性は、`signUp` APIの`userAttributes`オプションで渡すことができます。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
```ts
import { signUp } from "aws-amplify/auth";

await signUp({
  username: 'john.doe@example.com',
  password: 'hunter2',
  options: {
    userAttributes: {
      'custom:display_name': 'john_doe123',
    }
  }
});
```
<!-- /Platform -->
<!-- Platform: flutter -->
```dart
Future<void> _signUp({
    required String username,
    required String password,
    required String email,
    required String customValue,
}) async  {
  final userAttributes = {
    AuthUserAttributeKey.email: email,
    // Create and pass a custom attribute
    const CognitoUserAttributeKey.custom('my-custom-attribute'): customValue
  };
  await Amplify.Auth.signUp(
    username: username,
    password: password,
    options: SignUpOptions(
      userAttributes: userAttributes,
    ),
  );
}
```
<!-- /Platform -->
<!-- Platform: swift -->
```swift
func signUp(username: String, password: String, email: String) async {
    do {
        let signUpResult = try await Amplify.Auth.signUp(
            username: username,
            password: password,
            options: .init(userAttributes: [
                AuthUserAttribute(.email, value: email), 
                AuthUserAttribute(.custom("my-custom-attribute"), value: <custom attribute value>)
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
<!-- /Platform -->

## ユーザー属性を取得する

`fetchUserAttributes` APIを使用してユーザーのユーザー属性を取得し、プロファイルで読み取ることができます。これはフロントエンドエクスペリエンスをパーソナライズし、ユーザーが見るコンテンツを制御するのに役立ちます。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
```ts
import { fetchUserAttributes } from 'aws-amplify/auth';

await fetchUserAttributes();
```
<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func fetchAttributes() async {
    do {
        let attributes = try await Amplify.Auth.fetchUserAttributes()
        print("User attributes - \(attributes)")
    } catch let error as AuthError{
        print("Fetching user attributes failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func fetchAttributes() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.fetchUserAttributes()
        }.sink {
            if case let .failure(authError) = $0 {
                print("Fetch user attributes failed with error \(authError)")
            }
        }
        receiveValue: { attributes in
            print("User attributes - \(attributes)")
        }
}
```

<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.fetchUserAttributes(
    attributes -> Log.i("AuthDemo", "User attributes = " + attributes.toString()),
    error -> Log.e("AuthDemo", "Failed to fetch user attributes.", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.fetchUserAttributes(
    { Log.i("AuthDemo", "User attributes = $it") },
    { Log.e("AuthDemo", "Failed to fetch user attributes", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val attributes = Amplify.Auth.fetchUserAttributes()
    Log.i("AuthDemo", "User attributes = $attributes")
} catch (error: AuthException) {
    Log.e("AuthDemo", "Failed to fetch user attributes", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.fetchUserAttributes()
    .doOnSubscribe(() -> Log.i("AuthDemo", "Attributes:"))
    .flatMapObservable(Observable::fromIterable)
    .subscribe(
        eachAttribute -> Log.i("AuthDemo", eachAttribute.toString()),
        error -> Log.e("AuthDemo", "Failed to fetch attributes.", error)
    );
```

<!-- /Platform -->
<!-- Platform: flutter -->
```dart
Future<void> fetchCurrentUserAttributes() async {
  try {
    final result = await Amplify.Auth.fetchUserAttributes();
    for (final element in result) {
      safePrint('key: ${element.userAttributeKey}; value: ${element.value}');
    }
  } on AuthException catch (e) {
    safePrint('Error fetching user attributes: ${e.message}');
  }
}
```
<!-- /Platform -->

## ユーザー属性を更新する

`updateUserAttribute` APIを使用して、新しいユーザー属性を作成するか、既存のユーザー属性を更新できます。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->

#### [TypeScript]

```typescript
import {
  updateUserAttribute,
  type UpdateUserAttributeOutput
} from 'aws-amplify/auth';

async function handleUpdateUserAttribute(attributeKey: string, value: string) {
  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey,
        value
      }
    });
    handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case 'CONFIRM_ATTRIBUTE_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
      );
      // Collect the confirmation code from the user and pass to confirmUserAttribute.
      break;
    case 'DONE':
      console.log(`attribute was successfully updated.`);
      break;
  }
}
```

#### [JavaScript]

```javascript
import { updateUserAttribute } from 'aws-amplify/auth';

async function handleUpdateUserAttribute(attributeKey, value) {
  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey,
        value
      }
    });
    handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleUpdateUserAttributeNextSteps(output) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case 'CONFIRM_ATTRIBUTE_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
      );
      // Collect the confirmation code from the user and pass to confirmUserAttribute.
      break;
    case 'DONE':
      console.log(`attribute was successfully updated.`);
      break;
  }
}
```

<Callout>
  注：確認が必要な属性（メールや電話番号など）を変更すると、ユーザーはメールまたは携帯電話のいずれかに確認コードを受け取ります。このコードは confirmUserAttribute APIで使用して、変更を確認できます。
</Callout>
<!-- /Platform -->

<!-- Platform: swift -->

#### [Async/Await]

```swift
func updateAttribute() async {
    do {
        let updateResult = try await Amplify.Auth.update(
            userAttribute: AuthUserAttribute(.phoneNumber, value: "+2223334444")
        )

        switch updateResult.nextStep {
        case .confirmAttributeWithCode(let deliveryDetails, let info):
            print("Confirm the attribute with details send to - \(deliveryDetails) \(String(describing: info))")
        case .done:
            print("Update completed")
        }
    } catch let error as AuthError {
        print("Update attribute failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func updateAttribute() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.update(
          userAttribute: AuthUserAttribute(.phoneNumber, value: "+2223334444")
        )
    }.sink {
        if case let .failure(authError) = $0 {
            print("Update attribute failed with error \(authError)")
        }
    }
    receiveValue: { updateResult in
        switch updateResult.nextStep {
        case .confirmAttributeWithCode(let deliveryDetails, let info):
            print("Confirm the attribute with details send to - \(deliveryDetails) \(info)")
        case .done:
            print("Update completed")
        }
    }
}
```

<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
AuthUserAttribute userEmail =
    new AuthUserAttribute(AuthUserAttributeKey.email(), "email@email.com");
Amplify.Auth.updateUserAttribute(userEmail,
    result -> Log.i("AuthDemo", "Updated user attribute = " + result.toString()),
    error -> Log.e("AuthDemo", "Failed to update user attribute.", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.updateUserAttribute(
    AuthUserAttribute(AuthUserAttributeKey.email(), "email@email.com"),
    { Log.i("AuthDemo", "Updated user attribute = $it") },
    { Log.e("AuthDemo", "Failed to update user attribute.", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
val attribute =
    AuthUserAttribute(AuthUserAttributeKey.email(), "email@email.com")
try {
    val result = Amplify.Auth.updateUserAttribute(attribute)
    Log.i("AuthDemo", "Updated user attribute = $result")
} catch (error: AuthException) {
    Log.e("AuthDemo", "Failed to update user attribute.", error)
}
```

#### [RxJava]

```java
AuthUserAttribute userEmail =
    new AuthUserAttribute(AuthUserAttributeKey.email(), "email@email.com");
RxAmplify.Auth.updateUserAttribute(userEmail)
    .subscribe(
        result -> Log.i("AuthDemo", "Updated user attribute = " + result.toString()),
        error -> Log.e("AuthDemo", "Failed to update user attribute.", error)
    );
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> updateUserEmail({
  required String newEmail,
}) async {
  try {
    final result = await Amplify.Auth.updateUserAttribute(
      userAttributeKey: AuthUserAttributeKey.email,
      value: newEmail,
    );
    _handleUpdateUserAttributeResult(result);
  } on AuthException catch (e) {
    safePrint('Error updating user attribute: ${e.message}');
  }
}
```

ユーザー属性の更新は、完了する前に追加の確認が必要な場合があります。`Amplify.Auth.updateUserAttribute`から返された`UpdateUserAttributeResult`をチェックして、必要な次のステップを確認してください。更新が完了すると、次のステップは`done`になります。

```dart
void _handleUpdateUserAttributeResult(
  UpdateUserAttributeResult result,
) {
  switch (result.nextStep.updateAttributeStep) {
    case AuthUpdateAttributeStep.confirmAttributeWithCode:
      final codeDeliveryDetails = result.nextStep.codeDeliveryDetails!;
      _handleCodeDelivery(codeDeliveryDetails);
      break;
    case AuthUpdateAttributeStep.done:
      safePrint('Successfully updated attribute');
      break;
  }
}

void _handleCodeDelivery(AuthCodeDeliveryDetails codeDeliveryDetails) {
  safePrint(
    'A confirmation code has been sent to ${codeDeliveryDetails.destination}. '
    'Please check your ${codeDeliveryDetails.deliveryMedium.name} for the code.',
  );
}
```

複数のユーザー属性を一度に更新するには、`updateUserAttributes`を呼び出します。

```dart
Future<void> updateUserAttributes() async {
  const attributes = [
    AuthUserAttribute(
      userAttributeKey: AuthUserAttributeKey.email,
      value: 'email@email.com',
    ),
    AuthUserAttribute(
      userAttributeKey: AuthUserAttributeKey.familyName,
      value: 'MyFamilyName',
    ),
  ];
  try {
    final result = await Amplify.Auth.updateUserAttributes(
      attributes: attributes,
    );
    result.forEach((key, value) {
      switch (value.nextStep.updateAttributeStep) {
        case AuthUpdateAttributeStep.confirmAttributeWithCode:
          final destination = value.nextStep.codeDeliveryDetails?.destination;
          safePrint('Confirmation code sent to $destination for $key');
          break;
        case AuthUpdateAttributeStep.done:
          safePrint('Update completed for $key');
          break;
      }
    });
  } on AuthException catch (e) {
    safePrint('Error updating user attributes: ${e.message}');
  }
}
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react, vue, react-native, nextjs, android -->
## ユーザー属性を更新する

`updateUserAttributes` APIを使用して、複数の既存ユーザー属性を作成または更新できます。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
```typescript
import { updateUserAttributes, type UpdateUserAttributesOutput } from "aws-amplify/auth";

await updateUserAttributes({
  userAttributes: {
    email: "me@domain.com",
    name: "Jon Doe",
  },
});
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.updateUserAttributes(
    attributes, // attributes is a list of AuthUserAttribute
    result -> Log.i("AuthDemo", "Updated user attributes = " + result.toString()),
    error -> Log.e("AuthDemo", "Failed to update user attributes.", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.updateUserAttributes(
    attributes, // attributes is a list of AuthUserAttribute
    { Log.i("AuthDemo", "Updated user attributes = $it") },
    { Log.e("AuthDemo", "Failed to update user attributes", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.updateUserAttributes(attributes)
    Log.i("AuthDemo", "Updated user attributes = $result")
} catch (error: AuthException) {
    Log.e("AuthDemo", "Failed to update user attributes", error)
}
```

#### [RxJava]

```java
// attributes is a list of AuthUserAttribute
RxAmplify.Auth.updateUserAttributes(attributes)
    .subscribe(
        result -> Log.i("AuthDemo", "Updated user attributes = " + result.toString()),
        error -> Log.e("AuthDemo", "Failed to update user attributes.", error)
    );
```

<!-- /Platform -->
<!-- /Platform -->

## ユーザー属性を確認する

<!-- Platform: javascript, angular, react, vue, react-native, nextjs, flutter, android -->
一部の属性は、属性更新を完了するために確認が必要です。属性の確認が必要な場合、`updateUserAttribute`または`updateUserAttributes` APIの結果の一部は`CONFIRM_ATTRIBUTE_WITH_CODE`になります。確認コードは、配信の詳細で言及された配信媒体に送信されます。ユーザーが確認コードを取得したら、ユーザーがコードを入力するための UIを提示し、ユーザーの入力を使用して`confirmUserAttribute` APIを呼び出すことができます。
<!-- /Platform -->

<!-- Platform: swift -->
一部の属性は、属性更新を完了するために確認が必要です。属性の確認が必要な場合、`updateUserAttribute`または`updateUserAttributes` APIの結果の一部は`confirmAttributeWithCode`になります。確認コードは、配信の詳細で言及された配信媒体に送信されます。ユーザーが確認コードを取得したら、ユーザーがコードを入力するための UIを提示し、ユーザーの入力を使用して`confirmUserAttribute` APIを呼び出すことができます。
<!-- /Platform -->

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
```typescript
import {
  confirmUserAttribute,
  type ConfirmUserAttributeInput
} from 'aws-amplify/auth';

async function handleConfirmUserAttribute({
  userAttributeKey,
  confirmationCode
}: ConfirmUserAttributeInput) {
  try {
    await confirmUserAttribute({ userAttributeKey, confirmationCode });
  } catch (error) {
    console.log(error);
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->

#### [Async/Await]

```swift
func confirmAttribute() async {
    do {
        try await Amplify.Auth.confirm(userAttribute: .email, confirmationCode: "390739")
        print("Attribute verified")
    } catch let error as AuthError {
        print("Update attribute failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func confirmAttribute() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.confirm(userAttribute: .email, confirmationCode: "390739")
        }.sink {
            if case let .failure(authError) = $0 {
                print("Update attribute failed with error \(authError)")
            }
        }
        receiveValue: { _ in
            print("Attribute verified")
        }
}
```

<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.confirmUserAttribute(AuthUserAttributeKey.email(), "344299",
    () -> Log.i("AuthDemo", "Confirmed user attribute with correct code."),
    error -> Log.e("AuthDemo", "Failed to confirm user attribute. Bad code?", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.confirmUserAttribute(AuthUserAttributeKey.email(), "344299",
    { Log.i("AuthDemo", "Confirmed user attribute with correct code.") },
    { Log.e("AuthDemo", "Failed to confirm user attribute. Bad code?", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    Amplify.Auth.confirmUserAttribute(AuthUserAttributeKey.email(), "344299")
    Log.i("AuthDemo", "Confirmed user attribute with correct code.") 
} catch (error: AuthException) {
    Log.e("AuthDemo", "Failed to confirm user attribute. Bade code?", error) 
}
```

#### [RxJava]

```java
RxAmplify.Auth.confirmUserAttribute(AuthUserAttributeKey.email(), "344299")
    .subscribe(
        () -> Log.i("AuthDemo", "Confirmed user attribute using correct code."),
        error -> Log.e("AuthDemo", "Failed to confirm user attribute. Bad code?", error)
    );
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> verifyAttributeUpdate() async {
  try {
    await Amplify.Auth.confirmUserAttribute(
      userAttributeKey: AuthUserAttributeKey.email,
      confirmationCode: '390739',
    );
  } on AuthException catch (e) {
    safePrint('Error confirming attribute update: ${e.message}');
  }
}
```
<!-- /Platform -->

## ユーザー属性検証コードを送信する

ユーザーが認証されている間に属性を検証する必要がある場合は、以下に示すように`sendUserAttributeVerificationCode` APIを呼び出します。

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
```ts
import {
  sendUserAttributeVerificationCode,
  type VerifiableUserAttributeKey
} from 'aws-amplify/auth';

async function handleSendUserAttributeVerificationCode(
  key: VerifiableUserAttributeKey
) {
  try {
    await sendUserAttributeVerificationCode({
      userAttributeKey: key
    });
  } catch (error) {
    console.log(error);
  }
}
```
<!-- /Platform -->

<!-- Platform: swift -->

#### [Async/Await]

```swift
func sendVerificationCode() async {
    do {
        let deliveryDetails = try await Amplify.Auth.sendVerificationCode(forUserAttributeKey: .email)
        print("Resend code send to - \(deliveryDetails)")
    } catch let error as AuthError {
        print("Resend code failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func sendVerificationCode() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.sendVerificationCode(forUserAttributeKey: .email)
        }.sink {
            if case let .failure(authError) = $0 {
                print("Resend code failed with error \(authError)")
            }
        }
        receiveValue: { deliveryDetails in
            print("Resend code sent to - \(deliveryDetails)")
        }
}
```

<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.resendUserAttributeConfirmationCode(AuthUserAttributeKey.email(),
    result -> Log.i("AuthDemo", "Code was sent again: " + result.toString()),
    error -> Log.e("AuthDemo", "Failed to resend code.", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.resendUserAttributeConfirmationCode(
    AuthUserAttributeKey.email(),
    { Log.i("AuthDemo", "Code was sent again: $it") },
    { Log.e("AuthDemo", "Failed to resend code", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val attr = AuthUserAttributeKey.email()
    val result = Amplify.Auth.resendUserAttributeConfirmationCode(attr)
    Log.i("AuthDemo", "Code was sent again: $result."),
} catch (error: AuthException) {
    Log.e("AuthDemo", "Failed to resend code.", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.resendUserAttributeConfirmationCode(AuthUserAttributeKey.email())
    .subscribe(
        result -> Log.i("AuthDemo", "Code was resent: " + result.toString()),
        error -> Log.e("AuthDemo", "Failed to resend code.", error)
    );
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Future<void> resendVerificationCode() async {
  try {
    final result = await Amplify.Auth.resendUserAttributeConfirmationCode(
      userAttributeKey: AuthUserAttributeKey.email,
    );
    _handleCodeDelivery(result.codeDeliveryDetails);
  } on AuthException catch (e) {
    safePrint('Error resending code: ${e.message}');
  }
}
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react, vue, react-native, nextjs -->
## ユーザー属性を削除する

`deleteUserAttributes` APIを使用すると、1つ以上のユーザー属性を削除できます。

```ts
import {
  deleteUserAttributes,
  type DeleteUserAttributesInput
} from 'aws-amplify/auth';

async function handleDeleteUserAttributes(
  keys: DeleteUserAttributesInput['userAttributeKeys']
) {
  try {
    await deleteUserAttributes({
      userAttributeKeys: ['custom:my_custom_attribute', ...keys]
    });
  } catch (error) {
    console.log(error);
  }
}
```
<!-- /Platform -->

## 次のステップ

- [パスワード変更と復旧を設定する方法を学ぶ](/[platform]/build-a-backend/auth/manage-users/manage-passwords/)
- [カスタム属性を設定する方法を学ぶ](/[platform]/build-a-backend/auth/concepts/user-attributes#custom-attributes)

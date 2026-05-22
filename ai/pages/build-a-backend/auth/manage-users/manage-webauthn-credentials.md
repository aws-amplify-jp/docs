---
title: "WebAuthn認証器の管理"
section: "build-a-backend/auth/manage-users"
platforms: ["android", "angular", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-06-24T13:29:28.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/manage-users/manage-webauthn-credentials/"
---

<!-- Platform: react-native -->
> **Warning:** WebAuthn登録と認証は現在React Nativeではサポートされていませんが、他のパスキーレス機能は完全にサポートされています。
<!-- /Platform -->

Amplify Authはパスキーをカメラルートンの認証情報メカニズムとして使用しています。以下のAPIにより、ユーザーはCognitoアカウントに関連付けられたパスキーを登録、追跡、削除できます。

[Amplifyでのパスキーの使用詳細を学習](/[platform]/build-a-backend/auth/concepts/passwordless/#webauthn-passkey)

## WebAuthn認証器の関連付け

<!-- Platform: android -->
> **Warning:** パスキーの登録はAndroid 9（APIレベル28）以上でサポートされています。
<!-- /Platform -->
  
ユーザーがパスキーを登録するには認証されている必要があることに注意してください。これはユーザーがサインアップ中にパスキーを作成できないことも意味します。したがって、WebAuthnを使用するにはアカウントに関連付けられた少なくとも1つの他の第一要因認証メカニズムが必要です。

以下のAPIを使用してパスキーを関連付けることができます：

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { associateWebAuthnCredential} from 'aws-amplify/auth';

await associateWebAuthnCredential();

```
<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.associateWebAuthnCredential(
    activity,
    () -> Log.i("AuthQuickstart", "Associated credential"),
    error -> Log.e("AuthQuickstart", "Failed to associate credential", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.associateWebAuthnCredential(
    activity,
    { Log.i("AuthQuickstart", "Associated credential") },
    { Log.e("AuthQuickstart", "Failed to associate credential", error) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.associateWebAuthnCredential(activity)
    Log.i("AuthQuickstart", "Associated credential")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Failed to associate credential", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.associateWebAuthnCredential(activity)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Associated credential"), 
        error -> Log.e("AuthQuickstart", "Failed to associate credential", error)
    );
```

Amplifyがアプリケーションの[Task](https://developer.android.com/guide/components/activities/tasks-and-back-stack)にPassKey UIを表示できるように、`Activity`インスタンスを指定する必要があります。
<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func associateWebAuthNCredentials() async {
    do {
        try await Amplify.Auth.associateWebAuthnCredential()
        print("WebAuthn credential was associated")
    } catch {
        print("Associate WebAuthn Credential failed: \(error)")
    }
}
```

#### [Combine]

```swift
func associateWebAuthNCredentials() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.associateWebAuthnCredential()
    }.sink {
        print("Associate WebAuthn Credential failed: \($0)")
    }
    receiveValue: { _ in
        print("WebAuthn credential was associated")
    }
}
```

<!-- /Platform -->

ユーザーはローカル認証器を使用してパスキーを登録するように促されます。その後、AmplifyはそのパスキーをCognitoに関連付けます。

## WebAuthn認証器の一覧表示

以下のAPIを使用して登録済みのパスキーを一覧表示できます：

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { listWebAuthnCredentials } from 'aws-amplify/auth';

const result = await listWebAuthnCredentials();

for (const credential of result.credentials) {
	console.log(`Credential ID: ${credential.credentialId}`);
	console.log(`Friendly Name: ${credential.friendlyCredentialName}`);
	console.log(`Relying Party ID: ${credential.relyingPartyId}`);
	console.log(`Created At: ${credential.createdAt}`);
}

```
<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func listWebAuthNCredentials() async {
    do {
        let result = try await Amplify.Auth.listWebAuthnCredentials(
          options: .init(pageSize: 5))
          
        for credential in result.credentials {  
          print("Credential ID: \(credential.credentialId)")  
          print("Created At: \(credential.createdAt)")  
          print("Relying Party Id: \(credential.relyingPartyId)")  
          if let friendlyName = credential.friendlyName {    
            print("Friendly name: \(friendlyName)")    
          }
        }
          
        // Fetch the next page
        if let nextToken = result.nextToken {  
          let nextResult = try await Amplify.Auth.listWebAuthnCredentials(
            options: .init(
              pageSize: 5,
              nextToken: nextToken))
        }
    } catch {
        print("Associate WebAuthn Credential failed: \(error)")
    }
}
```

#### [Combine]

```swift
func listWebAuthNCredentials() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.listWebAuthnCredentials(
          options: .init(pageSize: 5))
    }.sink {
        print("List WebAuthn Credential failed: \($0)")
    }
    receiveValue: { result in
        for credential in result.credentials {  
          print("Credential ID: \(credential.credentialId)")  
          print("Created At: \(credential.createdAt)")  
          print("Relying Party Id: \(credential.relyingPartyId)")  
          if let friendlyName = credential.friendlyName {    
            print("Friendly name: \(friendlyName)")    
          }
        }
          
        if let nextToken = result.nextToken {  
          // Fetch the next page
        }
    }
}
```

<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.listWebAuthnCredentials(
    result -> result.getCredentials().forEach(credential -> {
        Log.i("AuthQuickstart", "Credential ID: " + credential.getCredentialId());
        Log.i("AuthQuickstart", "Friendly Name: " + credential.getFriendlyName());
        Log.i("AuthQuickstart", "Relying Party ID: " + credential.getRelyingPartyId());
        Log.i("AuthQuickstart", "Created At: " + credential.getCreatedAt());
    }),
    error -> Log.e("AuthQuickstart", "Failed to list credentials", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.listWebAuthnCredentials(
    { result ->
        result.credentials.forEach { credential ->
            Log.i("AuthQuickstart", "Credential ID: ${credential.credentialId}")
            Log.i("AuthQuickstart", "Friendly Name: ${credential.friendlyName}")
            Log.i("AuthQuickstart", "Relying Party ID: ${credential.relyingPartyId}")
            Log.i("AuthQuickstart", "Created At: ${credential.createdAt}")
        }
    },
    { error -> Log.e("AuthQuickstart", "Failed to list credentials", error) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.listWebAuthnCredentials()
    result.credentials.forEach { credential ->
        Log.i("AuthQuickstart", "Credential ID: ${credential.credentialId}")
        Log.i("AuthQuickstart", "Friendly Name: ${credential.friendlyName}")
        Log.i("AuthQuickstart", "Relying Party ID: ${credential.relyingPartyId}")
        Log.i("AuthQuickstart", "Created At: ${credential.createdAt}")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Failed to list credentials", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.listWebAuthnCredentials()
    .subscribe(
        result -> result.getCredentials().forEach(credential -> {
            Log.i("AuthQuickstart", "Credential ID: " + credential.getCredentialId());
            Log.i("AuthQuickstart", "Friendly Name: " + credential.getFriendlyName());
            Log.i("AuthQuickstart", "Relying Party ID: " + credential.getRelyingPartyId());
            Log.i("AuthQuickstart", "Created At: " + credential.getCreatedAt());
        }), 
        error -> Log.e("AuthQuickstart", "Failed to list credentials", error)
    );
```

<!-- /Platform -->

## WebAuthn認証器の削除

以下のAPIでパスキーを削除できます：

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { deleteWebAuthnCredential } from 'aws-amplify/auth';

const id = "credential-id-to-delete";

await deleteWebAuthnCredential({
  credentialId: id
});
```
<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func deleteWebAuthNCredentials(credentialId: String) async {
    do {
        try await Amplify.Auth.deleteWebAuthnCredential(credentialId: credentialId)
        print("WebAuthn credential was deleted")
    } catch {
        print("Delete WebAuthn Credential failed: \(error)")
    }
}
```

#### [Combine]

```swift
func deleteWebAuthNCredentials(credentialId: String) -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.deleteWebAuthnCredential(credentialId: credentialId)
    }.sink {
        print("Delete WebAuthn Credential failed: \($0)")
    }
    receiveValue: { _ in
        print("WebAuthn credential was deleted")
    }
}
```

<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.deleteWebAuthnCredential(
    credentialId,
    (result) -> Log.i("AuthQuickstart", "Deleted credential"),
    error -> Log.e("AuthQuickstart", "Failed to delete credential", error)
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.deleteWebAuthnCredential(
    credentialId,
    { Log.i("AuthQuickstart", "Deleted credential") },
    { Log.e("AuthQuickstart", "Failed to delete credential", error) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    val result = Amplify.Auth.deleteWebAuthnCredential(credentialId)
    Log.i("AuthQuickstart", "Deleted credential")
} catch (error: AuthException) {
    Log.e("AuthQuickstart", "Failed to delete credential", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.deleteWebAuthnCredential(credentialId)
    .subscribe(
        result -> Log.i("AuthQuickstart", "Deleted credential"), 
        error -> Log.e("AuthQuickstart", "Failed to delete credential", error)
    );
```

削除パスキーAPIには必須の入力として`credentialId`のみがあり、値を返しません。
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
## 実用的な例

以下はリストAPIと削除APIを一緒に使用するコード例です。この例では、ユーザーは3つのパスキーが登録されています。ユーザーは`pageSize`を2として使用しながらすべてのパスキーを一覧表示し、リスト内の最初のパスキーを削除したいと考えています。

```ts
import { 
  listWebAuthnCredentials,
  deleteWebAuthnCredential
} from 'aws-amplify/auth';

let passkeys = [];

const result = await listWebAuthnCredentials({ pageSize: 2 });

passkeys.push(...result.credentials);

const nextPage = await listWebAuthnCredentials({
  pageSize: 2,
  nextToken: result.nextToken,
});

passkeys.push(...nextPage.credentials);

const id = passkeys[0].credentialId;

await deleteWebAuthnCredential({
  credentialId: id
});
```
<!-- /Platform -->

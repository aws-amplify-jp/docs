---
title: "AWS SDK を使用する"
section: "build-a-backend/auth"
platforms: ["swift", "android"]
gen: 2
last-updated: "2024-09-24T23:57:23.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/use-aws-sdk/"
---

Amplify が機能を提供していない高度なユースケースの場合、エスケープハッチを取得して、基になる Amazon Cognito クライアントにアクセスできます。

<!-- Platform: swift -->
エスケープハッチは、基になる `AWSCognitoIdentityProvider` インスタンスへのアクセスを提供します。必要な型をインポートします：

```swift
import AWSCognitoAuthPlugin
import AWSCognitoIdentityProvider
```

次にこのコードでエスケープハッチを取得します：

```swift
func getEscapeHatch() {
    let client: CognitoIdentityProviderClient

    // Get the instance of AWSCognitoAuthPlugin
    let plugin = try? Amplify.Auth.getPlugin(for: "awsCognitoAuthPlugin") as? AWSCognitoAuthPlugin

    // Get the instance of CognitoIdentityProviderClient
    if case .userPoolAndIdentityPool(let userPoolClient, _) = plugin?.getEscapeHatch() {
        client = userPoolClient
    } else if case .userPool(let userPoolClient) = plugin?.getEscapeHatch() {
        client = userPoolClient
    } else {
        fatalError("No user pool configuration found")
    }
    print("Fetched escape hatch - \(String(describing: client))")
}
```
<!-- /Platform -->

<!-- Platform: android -->
基になる `CognitoIdentityProviderClient` と `CognitoIdentityClient` には、以下のようにアクセスできます

```kotlin
implementation "aws.sdk.kotlin:cognitoidentityprovider:1.0.44"
implementation "aws.sdk.kotlin:cognitoidentity:1.0.44"
```

#### [Kotlin]

```kotlin
suspend fun resendCodeUsingEscapeHatch() {
    // Get the instance of AWSCognitoAuthPlugin
    val cognitoAuthPlugin = Amplify.Auth.getPlugin("awsCognitoAuthPlugin")
    val cognitoAuthService = cognitoAuthPlugin.escapeHatch as AWSCognitoAuthService

    // Get the instance of CognitoIdentityProviderClient
    val cognitoIdentityProviderClient = cognitoAuthService.cognitoIdentityProviderClient
    val request = ResendConfirmationCodeRequest {
        clientId = "xxxxxxxxxxxxxxxx"
        username = "user1"
    }
    val response = cognitoIdentityProviderClient?.resendConfirmationCode(request)
}
```

#### [Java]

<Callout>

[ブロッキングインターフェースまたは Future に基づく同等の非同期インターフェースのいずれかを使用して Java から Kotlin クライアントを使用する方法について詳細を確認します](https://github.com/awslabs/smithy-kotlin/blob/main/docs/design/kotlin-smithy-sdk.md#java-interop)。

</Callout>

```java
// Get the instance of AWSCognitoAuthPlugin
AWSCognitoAuthPlugin cognitoAuthPlugin = (AWSCognitoAuthPlugin) Amplify.Auth.getPlugin("awsCognitoAuthPlugin");

// Get the instance of CognitoIdentityProviderClient
CognitoIdentityProviderClient client = cognitoAuthPlugin.getEscapeHatch().getCognitoIdentityProviderClient();
ResendConfirmationCodeRequest request = ResendConfirmationCodeRequest.Companion.invoke(dslBuilder -> {
    dslBuilder.setClientId("xxxxxxxxxxxxxxxx");
    dslBuilder.setUsername("user1");
    return null;
});

assert client != null;
client.resendConfirmationCode(request, new Continuation<ResendConfirmationCodeResponse>() {
    @NonNull
    @Override
    public CoroutineContext getContext() {
        return GlobalScope.INSTANCE.getCoroutineContext();
    }

    @Override
    public void resumeWith(@NonNull Object resultOrException) {
        Log.i(TAG, "Result: " + resultOrException);
    }
});
```

<!-- /Platform -->

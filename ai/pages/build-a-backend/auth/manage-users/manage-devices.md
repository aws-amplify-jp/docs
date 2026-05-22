---
title: "デバイスの管理"
section: "build-a-backend/auth/manage-users"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-08-20T18:34:28.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/manage-users/manage-devices/"
---

Amplify Authを使用すると、監査、MFAなど、ユーザーが使用するデバイスを追跡できます。開始する前に、デバイスステータスの用語を理解することが重要です：

- **追跡中:** ユーザーが新しいデバイスでサインインするたびに、クライアントは成功した認証イベントの終了時にデバイスキーを与えられます。このデバイスキーを使用して、ConfirmDevice APIを呼び出すために使用されるソルトとパスワード検証器を生成します。この時点で、デバイスは _追跡中_ と見なされます。デバイスが追跡中の状態になると、Amazon Cognito コンソールを使用して、追跡を開始した時刻、最後の認証時刻、およびそのデバイスに関する他の情報を確認できます。
- **記憶:** 記憶されたデバイスも追跡されます。ユーザー認証時に、記憶されたデバイスに割り当てられたデバイスキーとシークレットペアを使用してデバイスを認証し、ユーザーが以前にサインインするために使用した同じデバイスであることを確認します。
- **記憶されていない:** 記憶されていないデバイスは、追跡されたデバイスであり、Cognitoはユーザーにデバイスを記憶することを「オプトイン」することを要求するように設定されていますが、ユーザーはデバイスを記憶することにオプトインしていません。このユースケースは、ユーザーが自分が所有していないデバイスからアプリケーションにサインインする場合に使用されます。
- **忘れられた:** 忘れられたデバイスは、記憶されることから削除されたデバイスです。

> **Info:** **注:** [デバイス追跡と記憶](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/)機能は、外部プロバイダーとの連携サインインを使用する場合、デバイスがアップストリームアイデンティティプロバイダーで追跡されるため、利用できません。これらの機能は、CognitoのホストされたUIを使用する場合にも利用できません。

## デバイスを記憶

以下を使用してデバイスを記憶できます：

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { rememberDevice } from 'aws-amplify/auth';

await rememberDevice();
```
<!-- /Platform -->
<!-- Platform: flutter -->
```dart
Future<void> rememberCurrentDevice() async {
  try {
    await Amplify.Auth.rememberDevice();
    safePrint('Remember device succeeded');
  } on AuthException catch (e) {
    safePrint('Remember device failed with error: $e');
  }
}
```
<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.rememberDevice(
    () -> Log.i("AuthQuickStart", "Remember device succeeded"),
    error -> Log.e("AuthQuickStart", "Remember device failed with error " + error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.rememberDevice(
    { Log.i("AuthQuickStart", "Remember device succeeded") },
    { Log.e("AuthQuickStart", "Remember device failed with error", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    Amplify.Auth.rememberDevice()
    Log.i("AuthQuickStart", "Remember device succeeded")
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Remember device failed with error", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.rememberDevice()
    .subscribe(
      () -> Log.i("AuthQuickStart", "Remember device succeeded"),
      error -> Log.e("AuthQuickStart", "Remember device failed with error " + error.toString())
    );
```

<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func rememberDevice() async {
    do {
        try await Amplify.Auth.rememberDevice()
        print("Remember device succeeded")
    } catch let error as AuthError {
        print("Remember device failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func rememberDevice() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.rememberDevice()
    }.sink {
            if case let .failure(authError) = $0 {
                print("Remember device failed with error \(authError)")
            }
        }
        receiveValue: {
            print("Remember device succeeded")
        }
}
```

<!-- /Platform -->

## デバイスを忘れる

デバイスを忘れることもできますが、忘れられたデバイスは記憶されたり追跡されたりしないことに注意してください。

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { forgetDevice } from 'aws-amplify/auth';

await forgetDevice();
```
<!-- /Platform -->
<!-- Platform: flutter -->

#### [Current Device]

```dart
Future<void> forgetCurrentDevice() async {
  try {
    await Amplify.Auth.forgetDevice();
    safePrint('Forget device succeeded');
  } on AuthException catch (e) {
    safePrint('Forget device failed with error: $e');
  }
}
```

#### [Specific Device]

```dart
// A device that was fetched via Amplify.Auth.fetchDevices()
Future<void> forgetSpecificDevice(AuthDevice myDevice) async {
  try {
    await Amplify.Auth.forgetDevice(myDevice);
    safePrint('Forget device succeeded');
  } on AuthException catch (e) {
    safePrint('Forget device failed with error: $e');
  }
}
```

<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.forgetDevice(
    () -> Log.i("AuthQuickStart", "Forget device succeeded"),
    error -> Log.e("AuthQuickStart", "Forget device failed with error " + error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.forgetDevice(
    { Log.i("AuthQuickStart", "Forget device succeeded") },
    { Log.e("AuthQuickStart", "Forget device failed with error", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    Amplify.Auth.forgetDevice()
    Log.i("AuthQuickStart", "Forget device succeeded")
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Forget device failed with error", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.forgetDevice()
    .subscribe(
      () -> Log.i("AuthQuickStart", "Forget device succeeded"),
      error -> Log.e("AuthQuickStart", "Forget device failed with error " + error.toString())
    );
```

<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func forgetDevice() async {
    do {
        try await Amplify.Auth.forgetDevice()
        print("Forget device succeeded")
    } catch let error as AuthError {
        print("Forget device failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func forgetDevice() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.forgetDevice()
    }.sink {
        if case let .failure(authError) = $0 {
            print("Forget device failed with error \(authError)")
        }
    }
    receiveValue: {
        print("Forget device succeeded")
    }
}
```

<!-- /Platform -->

## デバイスを取得

以下を使用してデバイスのリストを取得できます：

<!-- Platform: angular, javascript, nextjs, react, react-native, vue -->
```ts
import { fetchDevices } from 'aws-amplify/auth';

const output = await fetchDevices();
```
<!-- /Platform -->
<!-- Platform: flutter -->
```dart
Future<void> fetchAllDevices() async {
  try {
    final devices = await Amplify.Auth.fetchDevices();
    for (final device in devices) {
      safePrint('Device: $device');
    }
  } on AuthException catch (e) {
    safePrint('Fetch devices failed with error: $e');
  }
}
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.fetchDevices(
    devices -> {
        for (AuthDevice device : devices) {
            Log.i("AuthQuickStart", "Device: " + device);
        }
    },
    error -> Log.e("AuthQuickStart", "Fetch devices failed with error: " + error.toString()));
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.fetchDevices(
    { devices ->
        devices.forEach { Log.i("AuthQuickStart", "Device: " + it) }
    },
    { Log.e("AuthQuickStart", "Fetch devices failed with error", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    Amplify.Auth.fetchDevices().forEach { device ->
        Log.i("AuthQuickStart", "Device: $device")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickStart",  "Fetch devices failed with error", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.fetchDevices()
    .subscribe(
        device -> Log.i("AuthQuickStart", "Device: " + device);
        error -> Log.e("AuthQuickStart", "Fetch devices failed with error: " + error.toString())
    );
```

<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func fetchDevices() async {
    do {
        let fetchDeviceResult = try await Amplify.Auth.fetchDevices()
        for device in fetchDeviceResult {
            print(device.id)
        }
    } catch let error as AuthError {
        print("Fetch devices failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func fetchDevices() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.fetchDevices()
    }.sink {
        if case let .failure(authError) = $0 {
            print("Fetch devices failed with error \(authError)")
        }
    }
    receiveValue: { fetchDeviceResult in
        for device in fetchDeviceResult {
            print(device.id)
        }
    }
}
```

<!-- /Platform -->

<!-- Platform: flutter -->
## 現在のデバイスを取得

以下を使用して現在のデバイスを取得できます：

```dart
Future<void> fetchCurrentUserDevice() async {
  try {
    final device = await Amplify.Auth.fetchCurrentDevice();
    safePrint('Device: $device');
  } on AuthException catch (e) {
    safePrint('Get current device failed with error: $e');
  }
}
```
<!-- /Platform -->

これで、デバイスを記憶、忘れる、および取得するように設定できました。

---
title: "ユーザーアカウントの削除"
section: "frontend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/auth/delete-user-account/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

ユーザーがアカウントを削除できるようにすることで、信頼性と透明性を向上させることができます。Amplify Auth を使用してプログラムでセルフサービスアカウント削除を有効にできます。

まだ Amplify Gen 2 アプリを作成していない場合は、[クイックスタート](/[platform]/start/quickstart)にアクセスしてください。

## ユーザーがアカウントを削除できるようにする

Amplify ライブラリを使用して、ユーザーのアカウント削除をすばやく設定できます。`deleteUser` API を呼び出して Auth カテゴリからユーザーを削除すると、ユーザーもサインアウトします。

アプリケーションがデフォルト設定である Cognito User Pool を使用している場合、このアクションは Cognito User Pool からのみユーザーを削除します。Cognito Identity Pool だけでフェデレーションしている場合は効果がありません。

> **Warning:** `deleteUser` API を呼び出す前に、Cognito に保存されていない関連するユーザーデータを削除する必要がある場合があります。たとえば、Amplify Data を使用してユーザーデータを永続化している場合は、[これらの手順](https://gist.github.com/aws-amplify-ops/27954c421bd72930874d48c15c284807)に従って関連するユーザーデータを削除できます。これにより、アカウントを削除するユーザーに関連するデータを削除する必要があるガイドライン（GDPR など）に対応できます。

次のメソッドを使用してアカウント削除を有効にできます。

<!-- Platform: javascript,  react-native, angular, nextjs, react, vue -->
```ts
import { deleteUser } from 'aws-amplify/auth';

async function handleDeleteUser() {
  try {
    await deleteUser();
  } catch (error) {
    console.log(error);
  }
}
```
<!-- /Platform -->
<!-- Platform: flutter -->
```dart
Future<void> deleteUser() async {
  try {
    await Amplify.Auth.deleteUser();
    safePrint('Delete user succeeded');
  } on AuthException catch (e) {
    safePrint('Delete user failed with error: $e');
  }
}
```
<!-- /Platform -->
<!-- Platform: android -->

#### [Java]

```java
Amplify.Auth.deleteUser(
    () -> Log.i("AuthQuickStart", "Delete user succeeded"),
    error -> Log.e("AuthQuickStart", "Delete user failed with error " + error.toString())
);
```

#### [Kotlin - Callbacks]

```kotlin
Amplify.Auth.deleteUser(
    { Log.i("AuthQuickStart", "Delete user succeeded") },
    { Log.e("AuthQuickStart", "Delete user failed with error", it) }
)
```

#### [Kotlin - Coroutines]

```kotlin
try {
    Amplify.Auth.deleteUser()
    Log.i("AuthQuickStart", "Delete user succeeded")
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Delete user failed with error", error)
}
```

#### [RxJava]

```java
RxAmplify.Auth.deleteUser()
    .subscribe(
      () -> Log.i("AuthQuickStart", "Delete user succeeded"),
      error -> Log.e("AuthQuickStart", "Delete user failed with error " + error.toString())
    );
```

<!-- /Platform -->
<!-- Platform: swift -->

#### [Async/Await]

```swift
func deleteUser() async {
    do {
        try await Amplify.Auth.deleteUser()
        print("Successfully deleted user")
    } catch let error as AuthError {
        print("Delete user failed with error \(error)")
    } catch {
        print("Unexpected error: \(error)")
    }
}
```

#### [Combine]

```swift
func deleteUser() -> AnyCancellable {
    Amplify.Publisher.create {
        try await Amplify.Auth.deleteUser()
    }.sink {
            if case let .failure(authError) = $0 {
                print("Delete user failed with error \(authError)")
            }
        }
        receiveValue: {
            print("Successfully deleted user")
        }
}
```

<!-- /Platform -->

UI を更新してユーザーにアカウントが削除されたことを知らせ、テストユーザーで機能をテストすることをお勧めします。ユーザーがアカウントを削除するとアプリケーションからサインアウトすることに注意してください。

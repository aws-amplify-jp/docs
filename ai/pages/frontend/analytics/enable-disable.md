---
title: "アナリティクスの有効化と無効化"
section: "frontend/analytics"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/analytics/enable-disable/"
---

## アナリティクスを無効にする

アナリティクスはアプリで構成するとデフォルトで有効になります。アプリでアナリティクスを無効にするには、`disable` 関数を使用します。

<!-- Platform: javascript, react-native, angular, nextjs, react, vue -->
```javascript title="src/index.js"
import { disable } from 'aws-amplify/analytics';

disable();
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Analytics.disable();
```

#### [Kotlin]

```kotlin
Amplify.Analytics.disable()
```

#### [RxJava]

```java
RxAmplify.Analytics.disable();
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
await Amplify.Analytics.disable();
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
Amplify.Analytics.disable()
```
<!-- /Platform -->

## アナリティクスを有効にする

アプリでアナリティクスを有効にするには、`enable` 関数を使用できます。

<!-- Platform: javascript, react-native, angular, nextjs, react, vue -->
```javascript title="src/index.js"
import { enable } from 'aws-amplify/analytics';

enable();
```
<!-- /Platform -->

<!-- Platform: android -->

#### [Java]

```java
Amplify.Analytics.enable();
```

#### [Kotlin]

```kotlin
Amplify.Analytics.enable()
```

#### [RxJava]

```java
RxAmplify.Analytics.enable();
```

<!-- /Platform -->

<!-- Platform: flutter -->
```dart
Amplify.Analytics.enable();
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
Amplify.Analytics.enable()
```
<!-- /Platform -->

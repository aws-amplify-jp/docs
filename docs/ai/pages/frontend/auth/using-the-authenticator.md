---
title: "Authenticator の使用"
section: "frontend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/auth/using-the-authenticator/"
---

<!-- Platform: swift -->
フロントエンドアプリケーションで Amplify Auth を始める最も簡単な方法は、カスタマイズ可能な UI と完全な認証フローを提供する [Authenticator コンポーネント](https://ui.docs.amplify.aws/swift/connected-components/authenticator) です。

```swift
import Amplify
import Authenticator
import AWSCognitoAuthPlugin
import SwiftUI

@main
struct MyApp: App {
    init() {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure(with: .amplifyOutputs)
        } catch {
            print("Unable to configure Amplify \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            Authenticator { state in
                VStack {
                    Text("Hello, \(state.user.username)")
                    Button("Sign out") {
                        Task {
                            await state.signOut()
                        }
                    }
                }
            }
        }
    }
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
フロントエンドアプリケーションで Amplify Auth を始める最も簡単な方法は、カスタマイズ可能な UI と完全な認証フローを提供する [Authenticator コンポーネント](https://ui.docs.amplify.aws/flutter/connected-components/authenticator) です。
<!-- /Platform -->

<!-- Platform: android -->
フロントエンドアプリケーションで Amplify Auth を始める最も簡単な方法は、カスタマイズ可能な UI と完全な認証フローを提供する [Authenticator コンポーネント](https://ui.docs.amplify.aws/android/connected-components/authenticator) です。
<!-- /Platform -->

<!-- Platform: javascript, nextjs, react -->
フロントエンドアプリケーションで Amplify Auth を始める最も簡単な方法は、カスタマイズ可能な UI と完全な認証フローを提供する [Authenticator コンポーネント](https://ui.docs.amplify.aws/react/connected-components/authenticator) です。

```tsx title="src/App.tsx"
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
```
<!-- /Platform -->

Authenticator コンポーネントは、バックエンドから生成された出力に基づいて自動的に設定されます。Authenticator の詳細とその外観をカスタマイズする方法について詳しくは、[Amplify UI ドキュメント](https://ui.docs.amplify.aws/) を参照してください。

<!-- Platform: javascript, nextjs, react -->
別の方法として、独自の UI を使用し、[`aws-amplify`](https://www.npmjs.com/package/aws-amplify) のライブラリを活用して認証フローを手動で処理することもできます。
<!-- /Platform -->

---
title: "パスワードレス"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-04-24T07:46:51.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/passwordless/"
---

Amplifyは、以下の方法を使用したパスワードレス認証フローに対応しています：

- [SMSベースのワンタイムパスワード (SMS OTP)](#sms-otp)
- [メールベースのワンタイムパスワード (Email OTP)](#email-otp)
- [WebAuthn パスキー](#webauthn-passkey)

パスワードレス認証により、従来のパスワードに関連するセキュリティリスクとユーザーの手間が軽減されます。

> **Warning:** **MFAとパスワードレスは一緒に使用することはできません。** Amazon Cognito は、同じユーザーに対して MFA とパスワードレスサインイン (パスキー、SMS OTP、Email OTP を含む) の両方を有効にすることはサポートしていません。ユーザーが MFA を設定している場合、パスワードレスサインインオプションは利用できません。詳細については、[Amazon Cognito MFA の前提条件](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html#user-pool-settings-mfa-prerequisites)を参照してください。

## パスワードレス認証の設定

`defineAuth` 設定でパスワードレス認証方法を直接有効にできます。パスワードレス方法は従来のパスワードベースの認証と一緒に使用され、ユーザーに複数のサインインオプションを提供します。

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true // Email OTP を有効化
    }
  }
});
```

複数のパスワードレス方法を同時に有効にできます：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true // Email OTP を有効化
    },
    phone: {
      otpLogin: true // SMS OTP を有効化
    },
    webAuthn: true // WebAuthn パスキーを有効化
  }
});
```

## SMS OTP

SMS ベースの認証は、電話番号を識別子として、テキストメッセージを検証チャネルとして使用します。高いレベルでは、エンドユーザーは認証のために次の手順を実行します：

1. ユーザーがサインアップ/サインイン時に電話番号を入力します
2. 時間制限のあるコードを含むテキストメッセージを受け取ります
3. ユーザーがコードを入力すると認証されます

### SMS OTP の設定

電話ログイン設定で `otpLogin: true` を設定して SMS OTP を有効にします：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    phone: {
      otpLogin: true
    }
  }
});
```

> **Info:** SMS ベースのワンタイムパスワードでは、Amazon Cognito ユーザープールがテキストメッセージを送信するために Amazon Simple Notification Service (SNS) を使用するように設定されている必要があります。[auth リソースを SNS で設定する方法を学習してください](/[platform]/build-a-backend/auth/moving-to-production/#sms)。
> 
> 

[アプリケーションコードで SMS OTP を使用する方法の詳細を学習してください](/[platform]/frontend/auth/sign-in/#sms-otp)。

## Email OTP

メールベースの認証は、メールアドレスを識別と検証に使用します。高いレベルでは、エンドユーザーは認証のために次の手順を実行します：

1. ユーザーがサインアップ/サインイン時にメールアドレスを入力します
2. 時間制限のあるコードを含むメールメッセージを受け取ります
3. ユーザーがコードを入力すると認証されます

### Email OTP の設定

メールログイン設定で `otpLogin: true` を設定して Email OTP を有効にします：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true
    }
  }
});
```

> **Info:** メールベースのワンタイムパスワードでは、Amazon Cognito ユーザープールがメールメッセージを送信するために Amazon Simple Email Service (SES) を使用するように設定されている必要があります。[auth リソースを SES で設定する方法を学習してください](/[platform]/build-a-backend/auth/moving-to-production/#email)。

[アプリケーションコードで Email OTP を使用する方法の詳細を学習してください](/[platform]/frontend/auth/sign-in/#email-otp)。

## WebAuthn パスキー

WebAuthn は生体認証またはセキュリティキーを認証に使用し、デバイス固有のセキュリティ機能を活用します。高いレベルでは、エンドユーザーは認証のために次の手順を実行します：

1. ユーザーがパスキーの登録を選択します
2. デバイスが生体認証/セキュリティキーの検証を促します
3. 今後のログインでは、同じ方法を使用して認証します

### WebAuthn の設定

認証設定で WebAuthn パスキーを有効にします。最もシンプルな設定は自動的な証明者 ID 解決を使用します：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true, // ユーザーはサインアップ方法が必要です
    webAuthn: true // 証明者 ID を自動的に解決します
  }
});
```

`webAuthn: true` を使用する場合、証明者 ID は自動的に解決されます：
- **サンドボックス**環境では: `localhost` に解決されます
- **ブランチ**デプロイメントでは: Amplify アプリドメイン (例: `[branch].[appId].amplifyapp.com`) に解決されます

本番環境またはカスタムドメインの場合は、証明者 ID を明示的に指定します：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    webAuthn: {
      relyingPartyId: 'example.com',
      userVerification: 'required' // または 'preferred' (デフォルト)
    }
  }
});
```

<!-- Platform: android -->
[Android 開発者ドキュメント](https://developer.android.com/design/ui/mobile/guides/patterns/passkeys)でパスキーがどのように機能するかについて詳しく読むことができます。

> **Warning:** パスキーの登録は Android 9 (API レベル 28) 以上でサポートされています。

Amplify でパスキーを使用するには、以下の手順に従う必要があります：

1. アプリケーションに `get_login_creds` 権限を付与する Digital Asset Links ファイルを Web サイトにデプロイします。このファイルの詳細については、[Credential Manager ドキュメント](https://developer.android.com/identity/sign-in/credential-manager#add-support-dal)を参照してください。
1. 上記で示したように `defineAuth` で WebAuthn を設定し、Web サイトドメインを `relyingPartyId` として指定します。
1. Amplify Android API を使用して、まず[パスキーを登録](/[platform]/build-a-backend/auth/manage-users/manage-webauthn-credentials/#associate-webauthn-credentials)してから[WebAuthn でサインイン](/[platform]/frontend/auth/sign-in/#webauthn-passkeys)します。
<!-- /Platform -->
<!-- Platform: swift -->

<!-- /Platform -->

[アプリケーションコードで WebAuthn パスキーを使用する方法の詳細を学習してください](/[platform]/frontend/auth/sign-in/#webauthn-passkeys)。

### 認証情報の管理

WebAuthn を使用したパスワードレス認証では、ユーザーの Amazon Cognito アカウントに 1 つ以上の認証情報を関連付ける必要があります。Amplify は各プラットフォームのローカル認証機器と統合する API を提供し、これらの認証情報の関連付けを簡単に作成、表示、削除できます。

[WebAuthn 認証情報の管理の詳細を学習してください](/[platform]/build-a-backend/auth/manage-users/manage-webauthn-credentials)。

## パスワードレス認証

パスワードレス認証方法を有効にする場合、従来のパスワード認証は引き続き利用可能です。これにより、ユーザーは優先する認証方法を柔軟に選択できます：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true // Email OTP がパスワード認証と一緒に有効化される
    }
  }
});
```

この設定では、ユーザーは以下のいずれかを使用して認証できます：
- メールとパスワード (従来)
- Email OTP (パスワードレス)

複数のパスワードレス方法を有効にして、ユーザーにさらに多くのオプションを提供できます：

```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      otpLogin: true
    },
    phone: {
      otpLogin: true
    },
    webAuthn: {
      relyingPartyId: 'example.com'
    }
  }
});
```

この設定では、ユーザーは以下を使用して認証できます：
- メールとパスワード
- Email OTP
- 電話とパスワード
- SMS OTP
- WebAuthn パスキー

> **Info:** WebAuthn を使用する場合、ユーザーは最初にサインアップするための方法 (メールまたは電話) が必要です。その後、WebAuthn 認証情報が彼らのアカウントに関連付けられ、将来のサインインに使用されます。

## 次のステップ

- [アプリケーションにパスワードレスサインインを実装する方法を学習してください](/[platform]/frontend/auth/sign-in/)
- [Email OTP のメール設定を構成してください](/[platform]/build-a-backend/auth/moving-to-production/#email)
- [SMS OTP の SMS 設定を構成してください](/[platform]/build-a-backend/auth/moving-to-production/#sms)
- [WebAuthn 認証情報を管理してください](/[platform]/build-a-backend/auth/manage-users/manage-webauthn-credentials/)

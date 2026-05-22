---
title: "外部アイデンティティプロバイダー"
section: "build-a-backend/auth/concepts"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/external-identity-providers/"
---

Amplify Authで外部サインインを設定する前に、使用する各プロバイダーで開発者アカウントを設定する必要があります。

<Callout>

**注釈:** Amazon Cognitoは、Facebook Login、Google Sign-In、Login with Amazon、Sign in with Appleのファーストクラスサポートを提供し、シームレスなセットアップを実現します。ただし、SAMLまたはOpenID Connect（OIDC）をサポートする他のアイデンティティプロバイダーを設定することもできます。

</Callout>

> **Warning:** **警告:** 外部サインインを設定する際は、属性を「必須」として指定する場合は注意が必要です。外部アイデンティティプロバイダーによって、Cognitoに返される情報のスコープが異なります。最初に「必須」として設定されたユーザープール属性は後から変更することはできず、ユーザーの移行または新しいユーザープールの作成が必要になる可能性があります。

#### [Facebook Login]

1. [Facebookの開発者アカウント](https://developers.facebook.com/docs/facebook-login)を作成します。
2. Facebook認証情報で[サインイン](https://developers.facebook.com/)します。
3. トップナビゲーションバーから「_My Apps_」を選択し、読み込まれたページで「_Create App_」を選択します。![Facebook開発者アカウントのMy Appsページの[Create App]ボタン。](/images/cognitoHostedUI/facebook1.png)
4. ユースケースについて「_Set up Facebook Login_」を選択します。![リストから選択された[Set up Facebook Login]オプション。](/images/cognitoHostedUI/facebook2.png)
5. プラットフォームについて「_Website_」を選択し、「_No, I'm not building a game_」を選択します。
6. FacebookアプリにはAppスププやDiscoveryに名前を付け、「_Create app_」を選択します。![Facebookアプリをまとめるフォームのフォームフィールド。](/images/cognitoHostedUI/facebook3.png)
7. 左側のナビゲーションバーから「_Settings_」を選択し、「_Basic_」を選択します。![ダッシュボードの[基本設定]タブのApp IDとApp Secret。](/images/cognitoHostedUI/facebook4.png)
8. 「_App ID_」と「_App Secret_」をメモします。次のセクションでCLIフローで使用します。

#### [Google Sign-In]

1. [Google開発者コンソール](https://console.developers.google.com)に移動します。
2. 「_Select a project_」をクリックします。![ナビゲーションバーの[プロジェクトを選択]ボタンが丸で囲まれています。](/images/cognitoHostedUI/google1.png)
3. 「_NEW PROJECT_」をクリックします。![プロジェクト選択ポップアップの新規プロジェクトボタンが丸で囲まれています。](/images/cognitoHostedUI/google2.png)
4. プロジェクト名を入力して「_CREATE_」をクリックします。![新しいプロジェクトページの[作成]ボタンが丸で囲まれています。](/images/cognitoHostedUI/google3.png)
5. プロジェクトが作成されたら、左側のナビゲーションメニューから「_APIs & Services_」を選択し、次に「_Credentials_」を選択します。![左上のメニューアイコンが選択され、次にAPIs and servicesオプション、次にcredentialsオプションが選択されています。](/images/cognitoHostedUI/google4.png)
6. 「_CONFIGURE CONSENT SCREEN_」をクリックします。![OAuth同意画面セクションの[同意画面を設定]ボタンが丸で囲まれています。](/images/cognitoHostedUI/google5.png)
7. 「_CREATE_」をクリックします。![OAuth同意画面セクションの[作成]ボタンが丸で囲まれています。](/images/cognitoHostedUI/google6.png)
8. 「_App Information_」と「_Developer contact information_」に入力します。これらは必須フィールドで、「_SAVE AND CONTINUE_」を3回クリック（OAuth同意画面->スコープ->テストユーザー）して同意画面のセットアップを完了します。
9. 「_Credentials_」タブに戻り、「_Create credentials_」ドロップダウンリストから「_OAuth client ID_」を選択してOAuth2.0認証情報を作成します。![「認証情報を作成」ボタンが丸で囲まれ、次に「認証情報」セクションのOAuthクライアントIDボタンが丸で囲まれています。](/images/cognitoHostedUI/google7.png)
10. 「_Application type_」として「_Web application_」を選択し、OAuth Clientに名前を付けます。
11. 「_Create_」をクリックします。
12. 「_Your client ID_」と「_Your Client Secret_」をメモします。次のセクションでCLIフローで必要になります。
13. 「_OK_」を選択します。

#### [Login with Amazon]

1. [Amazonの開発者アカウント](https://developer.amazon.com/login-with-amazon)を作成します。
2. Amazon認証情報で[サインイン](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html)します。
3. Amazon Client IDとClient Secretを受け取るには、Amazonセキュリティプロファイルを作成する必要があります。「_Create a Security Profile_」を選択します。![新しいセキュリティプロファイルを作成するボタンが表示されたLogin with Amazonコンソール。](/images/cognitoHostedUI/amazon1.png)
4. 「_Security Profile Name_」、「_Security Profile Description_」、「_Consent Privacy Notice URL_」に入力します。![新しいセキュリティプロファイルのフォームに入力するステップを示すセキュリティプロファイル管理ページ。](/images/cognitoHostedUI/amazon2.png)
5. 「_Save_」を選択します。
6. 「_Show Client ID_」と「_Client Secret_」を選択してクライアントIDとシークレットを表示します。次のセクションでCLIフローで必要になります。![クライアントIDとクライアントシークレットの選択。](/images/cognitoHostedUI/amazon3.png)

#### [Sign in with Apple]

1. Apple開発者認証情報で[サインイン](https://developer.apple.com/account/)します。
2. メインの開発者ポータルページで、「_Certificates, IDs, & Profiles_」を選択します。
3. 左側のナビゲーションバーで「_Identifier_」を選択します。
4. 「_Identifiers_」ページでプラスアイコン（+）を選択します。
5. 「_Register a New Identifier_」ページで「_App IDs_」を選択します。
6. 「_Register an App ID_」ページの「_App ID Prefix_」の下から「_Team ID_」の値をメモします。
7. 「_Description_」テキストボックスに説明を入力し、iOSアプリの`bundleID`を入力します。![証明書、識別子、プロファイルセクションのApp IDを登録します。](/images/cognitoHostedUI/apple1.png)
8. 「_Capabilities_」の下で「_Sign in with Apple_」を選択します。
9. 「_Continue_」を選択し、設定を確認してから「_Register_」を選択します。
10. 「_Identifiers_」ページで、右側から「_App IDs_」を選択し、次に「_Services ID_」を選択します。
11. プラスアイコン（+）を選択し、「_Register a New Identifier_」ページで「_Services IDs_」を選択します。
12. 「_Description_」テキストボックスに説明を入力し、Service IDの識別子を入力します。![証明書、識別子、プロファイルセクションのサービスIDを登録します。](/images/cognitoHostedUI/apple2.png)
13. 「_Continue_」を選択してService IDを登録します。

外部プロバイダーの開発者アカウントが設定されたので、Amplify固有の設定に戻ることができます。

## 外部サインインバックエンドを設定する

`amplify/auth/resource.ts`内で外部プロバイダーを追加する必要があります。

以下は、Amplify Authがサポートするすべての外部プロバイダーへのアクセスをセットアップする方法の例です。アプリケーションの`callbackUrls`と`logoutUrls` URLを設定する必要があります。これらはバックエンドリソースに対してアプリでのサインインおよびサインアウト操作の開始時に動作するかを指示します。

<Callout>

シークレットは、クラウドサンドボックスで使用するために[`ampx sandbox secret`](/[platform]/reference/cli-commands#npx-ampx-sandbox-secret)で手動で作成するか、ブランチ環境のAmplify Consoleで作成する必要があります。

</Callout>

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts title="amplify/auth/resource.ts"
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET')
      },
      signInWithApple: {
        clientId: secret('SIWA_CLIENT_ID'),
        keyId: secret('SIWA_KEY_ID'),
        privateKey: secret('SIWA_PRIVATE_KEY'),
        teamId: secret('SIWA_TEAM_ID')
      },
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET')
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET')
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://mywebsite.com/profile'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
    }
  }
});
```
<!-- /Platform -->
<!-- Platform: android, flutter, swift, react-native -->
```ts title="amplify/auth/resource.ts"
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET')
      },
      signInWithApple: {
        clientId: secret('SIWA_CLIENT_ID'),
        keyId: secret('SIWA_KEY_ID'),
        privateKey: secret('SIWA_PRIVATE_KEY'),
        teamId: secret('SIWA_TEAM_ID')
      },
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET')
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET')
      },
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    }
  }
});
```
<!-- /Platform -->

新しく設定された認証リソースとそのOAuthリダイレクトURIについて外部プロバイダーに通知する必要があります。

#### [Facebook Login]

1. Facebook認証情報で[Facebook開発者アカウントにサインイン](https://developers.facebook.com/)します。
2. トップナビゲーションバーから「_My Apps_」を選択し、「_Apps_」ページで以前作成したアプリを選択します。
3. 左側のナビゲーションバーで「_Products_」を選択します。まだ追加されていない場合は「_Facebook Login_」を追加します。
4. 既に追加されている場合は、「_Configure_」ドロップダウンの下から「_Settings_」を選択します。![「Configure」ドロップダウンから選択された[Settings]オプション。](/images/cognitoHostedUI/facebook5.png)
5. 「_Valid OAuth Redirect URIs_」の下に、ユーザープールドメインと`/oauth2/idpresponse`エンドポイントを入力します。

   `https://<your-user-pool-domain>/oauth2/idpresponse`

![ユーザープールドメインが/oauth2/エンドポイント付きでテキストフィールドに貼り付けられています。](/images/cognitoHostedUI/facebook6.png)

6. 変更を保存します。

#### [Google Sign-In]

1. [Google開発者コンソール](https://console.developers.google.com)に移動します。
2. 左側のナビゲーションバーで、「_Pinned_」または「_More Products_」の下にある「_APIs and Services_」を探します。
3. 「_APIs and Services_」サブメニュー内で「_Credentials_」を選択します。
4. 最初のステップで作成したクライアントを選択して「_Edit_」ボタンをクリックします。
5. 「_Authorized JavaScript origins_」フォームにユーザープールドメインを入力します。
6. 「_Authorized Redirect URIs_」にユーザープールドメインと`/oauth2/idpresponse`エンドポイントを入力します。

   ![「Authorized JavaScript origins」と「Authorized redirect URLs」のURLフォームフィールドが丸で囲まれています。](/images/cognitoHostedUI/google8.png)

   注釈: エンドポイントを追加するときに`Invalid Redirect: domain must be added to the authorized domains list before submitting.`というエラーメッセージが表示された場合は、「_Authorized Domains List_」に移動してドメインを追加してください。

7. 「_Save_」をクリックします。

#### [Login with Amazon]

1. Amazon認証情報で[サインイン](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html)します。
2. ギアにカーソルを合わせて、前のステップで作成したセキュリティプロファイルに関連する「_Web Settings_」を選択して、「_Edit_」を選択します。![ギアアイコンのドロップダウンメニューから選択されたWeb Settingsオプション。](/images/cognitoHostedUI/amazon4.png)
3. ユーザープールドメインを「_Allowed Origins_」に入力し、ユーザープールドメインと`/oauth2/idpresponse`エンドポイントを「_Allowed Return URLs_」に入力します。![ユーザープールドメインが[Allowed Origins]フィールドに入力され、/oauth2/が[Allowed Return URLs]フィールドのエンドポイントとして入力されています。](/images/cognitoHostedUI/amazon5.png)
4. 「_Save_」を選択します。

#### [Sign in with Apple]

1. Apple開発者認証情報で[サインイン](https://developer.apple.com/account/)します。
2. メインの開発者ポータルページで、「_Certificates, IDs, & Profiles_」を選択します。
3. 左側のナビゲーションバーで「_Identifiers_」を選択してから、右側のドロップダウンリストから「_Service IDs_」を選択します。
4. 上記のセクションで設定したときに作成したService IDを選択します。
5. 「_Sign In with Apple_」を有効にして「_Configure_」を選択します。
6. 「_Primary App ID_」の下で、前に作成したApp IDを選択します。
7. ユーザープールドメインを「_Domains and Subdomains_」に入力します。
8. ユーザープールドメインと`/oauth2/idpresponse`エンドポイントを「_Return URLs_」に入力します。![「Return URLs」テキストフィールドが選択されています。](/images/cognitoHostedUI/apple3.png)
9. 「_Next_」をクリックして情報を確認し、「_Done_」を選択します。
10. 「_Edit your Services ID Configuration_」で「_Continue_」をクリックして情報を確認し、「_Save_」を選択します。
11. メイン「_Certificates, Identifiers & Profiles_」で「_Keys_」を選択します。
12. 「_Keys_」ページでプラスアイコン（+）を選択します。
13. 「_Key Name_」の下でキーの名前を入力します。
14. 「_Sign in with Apple_」を有効にして「_Configure_」を選択します。![「Sign in with Apple」オプションが有効になり、キー名のテキストフィールドが入力されています。](/images/cognitoHostedUI/apple4.png)
15. 「_Primary App ID_」の下で前に作成したApp IDを選択します。
16. 「_Save_」をクリックします。
17. 「_Register a New Key_」で「_Continue_」をクリックして情報を確認し、「_Register_」を選択します。
18. 新しいページにリダイレクトされます。「_Key ID_」をメモして、秘密鍵を含む.p8ファイルをダウンロードします。![ダウンロードキーページが表示され、秘密鍵を含む.p8ファイルをダウンロードするオプション。](/images/cognitoHostedUI/apple5.png)

[ユーザープールを使用したソーシャルアイデンティティプロバイダーの詳細については](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html)

### 外部プロバイダーからユーザーデータを取得するためのスコープのカスタマイズ

`amplify/auth/resource.ts`ファイルで`scopes`を使用して、各外部プロバイダーをセットアップするときに取得するデータの詳細を決定できます。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
        // highlight-next-line
        scopes: ['profile']
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://mywebsite.com/profile'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
    }
  }
});
```
<!-- /Platform -->
<!-- Platform: android, flutter, swift, react-native -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
        // highlight-next-line
        scopes: ['email']
      },
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    }
  }
});
```
<!-- /Platform -->

### 属性マッピング

アイデンティティプロバイダー（IdP）サービスはユーザー属性をさまざまな形式で保存しています。Amazon Cognitoユーザープールで外部IdPを使用する場合、属性マッピングを使用すると、これらのさまざまな形式を一貫したスキーマに標準化できます。

[IdP属性をユーザープールプロファイルとトークンにマッピングする](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html)についてさらに詳しく学びます。

> **Warning:** **注釈:** フェデレーテッドユーザーがアプリケーションにサインインすると、ユーザープールが必要とする各属性のマッピングが必要です。さらに、各属性マッピングのターゲットがミュータブルであることを確認する必要があります。Amazon Cognitoは、最新の値が既存の情報と一致するかどうかに関係なく、ユーザーがサインインするときに各マップされた属性を更新しようとします。これらの条件が満たされない場合、Amazon Cognitoはエラーを返し、サインイン試行は失敗します。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
        // highlight-start
        attributeMapping: {
          email: 'email'
        }
        // highlight-end
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://mywebsite.com/profile'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
    }
  }
});
```
<!-- /Platform -->
<!-- Platform: android, flutter, swift, react-native -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      loginWithAmazon: {
        clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
        clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
        // highlight-start
        attributeMapping: {
          email: 'email'
        }
        // highlight-end
      },
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    }
  }
});
```
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, vue -->
[React Authenticatorコンポーネントを外部プロバイダー用に設定する方法についてさらに詳しく学びます](https://ui.docs.amplify.aws/react/connected-components/authenticator/configuration#external-providers)
<!-- /Platform -->

## OIDCプロバイダーを設定する

OIDCプロバイダーを設定するには、`amplify/auth/resource.ts`ファイルで設定します。例えば、Microsoft EntraIDプロバイダーをセットアップしたい場合は、以下のようにできます。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts title="amplify/auth/resource.ts"
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      oidc: [
        {
          name: 'MicrosoftEntraID',
          clientId: secret('MICROSOFT_ENTRA_ID_CLIENT_ID'),
          clientSecret: secret('MICROSOFT_ENTRA_ID_CLIENT_SECRET'),
          issuerUrl: '<your-issuer-url>',
        },
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://mywebsite.com/profile',
      ],
    },
  },
});
```
<!-- /Platform -->
<!-- Platform: android, flutter, swift, react-native -->
```ts title="amplify/auth/resource.ts"
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      oidc: [
        {
          name: 'MicrosoftEntraID',
          clientId: secret('MICROSOFT_ENTRA_ID_CLIENT_ID'),
          clientSecret: secret('MICROSOFT_ENTRA_ID_CLIENT_SECRET'),
          issuerUrl: '<your-issuer-url>',
        },
      ],
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    },
  },
});
```
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, vue -->
OIDCアイデンティティプロバイダーでサインインを開始するには、`signInWithRedirect` APIを使用します。

```ts title="src/my-client-side-js.js"
import { signInWithRedirect } from 'aws-amplify/auth';

await signInWithRedirect({
  provider: {
    custom: 'MicrosoftEntraID'
  }
});
```
<!-- /Platform -->

## SAMLプロバイダーを設定する

SAMLプロバイダーを設定するには、`amplify/auth/resource.ts`ファイルで設定します。例えば、Microsoft EntraIDプロバイダーをセットアップしたい場合は、以下のようにできます。

<!-- Platform: angular, javascript, nextjs, react, vue -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      saml: {
        name: 'MicrosoftEntraIDSAML',
        metadata: {
          metadataContent: '<your-url-hosting-saml-metadata>', // or content of the metadata file
          metadataType: 'URL', // or 'FILE'
        },
      },
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://mywebsite.com/profile',
      ],
    },
  },
});
```
<!-- /Platform -->
<!-- Platform: android, flutter, swift, react-native -->
```ts title="amplify/auth/resource.ts"
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      saml: {
        name: 'MicrosoftEntraIDSAML',
        metadata: {
          metadataContent: '<your-url-hosting-saml-metadata>', // or content of the metadata file
          metadataType: 'URL', // or 'FILE'
        },
      },
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    },
  },
});
```
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, vue -->
SAMLアイデンティティプロバイダーでサインインを開始するには、`signInWithRedirect` APIを使用します。

```ts title="src/my-client-side-js.js"
import { signInWithRedirect } from 'aws-amplify/auth';

await signInWithRedirect({
  provider: {
    custom: 'MicrosoftEntraIDSAML'
  }
});
```
<!-- /Platform -->

<!-- Platform: angular, javascript, nextjs, react, vue -->

## フロントエンドをセットアップする

> **Info:** Amplifyで[Authenticatorコンポーネント](https://ui.docs.amplify.aws/react/connected-components/authenticator/configuration#external-providers)を使用している場合、この機能は追加のコードなしで機能します。以下のガイドは独自の実装を書くためのものです。

外部アイデンティティプロバイダーでサインインを開始するには、`signInWithRedirect` APIを使用します。

```ts title="src/my-client-side-js.js"
import { signInWithRedirect } from 'aws-amplify/auth';

await signInWithRedirect({
  provider: 'Apple'
});
```

### リダイレクトURL

_Sign in_と_Sign out_リダイレクトURL（複数の場合もあります）は、サインインまたはサインアウト操作が発生した後にエンドユーザーをリダイレクトするために使用されます。開発/本番環境に異なるURLを使用したり、エンドユーザーを中間URLにリダイレクトしてからアプリに返したりするなど、様々なユースケースに対応するために複数のURLを指定したい場合があります。

#### サインアウト時にリダイレクトURLを指定する
複数のサインアウトリダイレクトURLが設定されている場合は、リダイレクトURLを選択する際のデフォルトの動作をオーバーライドして、`signOut`を呼び出すときに選択するURLを指定することができます。提供されるリダイレクトURLは、設定されているリダイレクトURLの少なくとも1つと一致する必要があります。`signOut`にリダイレクトURLが指定されていない場合は、現在のアプリドメインに基づいてURLが選択されます。

```ts
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';

// 次のURLが手動で提供されたか、Amplify設定ファイル経由で提供されたと仮定します。
// redirectSignOut: 'http://localhost:3000/,https://authProvider/logout?logout_uri=https://mywebsite.com/'

signOut({
  global: false,
  oauth: {
    redirectUrl: 'https://authProvider/logout?logout_uri=https://mywebsite.com/'
  }
});

```
<!-- /Platform -->
<!-- Platform: angular, javascript, nextjs, react, vue -->
### （マルチページアプリケーションの場合）リダイレクト後に外部サインインを完了する

マルチページアプリケーションを開発していて、リダイレクトされたページがサインインを開始したページと異なる場合は、サインインが確実に完了されるように、リダイレクトされたページに次のコードを追加する必要があります。

```ts title="src/my-redirected-page.ts"
import 'aws-amplify/auth/enable-oauth-listener';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

Hub.listen("auth", async ({ payload }) => {
  switch (payload.event) {
    case "signInWithRedirect":
      const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      console.log({user, userAttributes});
      break;
    case "signInWithRedirect_failure":
      // サインイン失敗を処理する
      break;
    case "customOAuthState":
      const state = payload.data; // これはsignInWithRedirect関数で提供されるcustomStateになります
      console.log(state);
      break;
  }
});
```

<Callout>

**注釈:** リスナーはSSR対応プロジェクトのコンテキスト内でクライアント側でのみ機能するため、クライアント側のみでリスナーをインポートするようにしてください。例えば、Next.jsプロジェクトでは、`'use client'`で上記のインポートステートメントをクライアント側のみでレンダリングするコンポーネントに追加する必要があります。

</Callout>

<Accordion eyebrow="内部では" headingLevel="4" title="マルチページアプリケーションで外部サインインを明示的に処理する必要がある理由">

`signInWithRedirect`関数をインポートして使用すると、エンドユーザーがアプリにリダイレクトされたときに外部サインインを完了するリスナーがサイドエフェクトとして追加されます。これはシングルページアプリケーションではうまく機能しますが、マルチページアプリケーションでは、元々サイドエフェクトとして追加されたリスナーを含まないページにリダイレクトされる可能性があります。したがって、ログイン成功ページに特定のOAuthリスナーを含める必要があります。

</details>
<!-- /Platform -->

<!-- Platform: react-native -->
## フロントエンドをセットアップする

> **Info:** Amplifyで[Authenticatorコンポーネント](https://ui.docs.amplify.aws/react/connected-components/authenticator/configuration#external-providers)を使用している場合、この機能は追加のコードなしで機能します。以下のガイドは独自の実装を書くためのものです。

外部アイデンティティプロバイダーでサインインを開始するには、`signInWithRedirect` APIを使用します。

```ts title="src/my-client-side-js.js"
import { signInWithRedirect } from 'aws-amplify/auth';

signInWithRedirect({
  provider: 'Apple'
});
```

### リダイレクトURL

_Sign in_と_Sign out_リダイレクトURL（複数の場合もあります）は、サインインまたはサインアウト操作が発生した後にエンドユーザーをリダイレクトするために使用されます。開発/本番環境に異なるURLを使用したり、エンドユーザーを中間URLにリダイレクトしてからアプリに返したりするなど、様々なユースケースに対応するために複数のURLを指定したい場合があります。

#### サインアウト時にリダイレクトURLを指定する
複数のサインアウトリダイレクトURLが設定されている場合は、リダイレクトURLを選択する際のデフォルトの動作をオーバーライドして、`signOut`を呼び出すときに選択するURLを指定することができます。提供されるリダイレクトURLは、設定されているリダイレクトURLの少なくとも1つと一致する必要があります。`signOut`にリダイレクトURLが指定されていない場合は、設定されたリダイレクトURLリストから、HTTPまたはHTTPSプリフィックスを含まない最初のアイテムが選択されます。

```ts
import { signOut } from 'aws-amplify/auth';

// 次のURLが手動で提供されたか、Amplify設定ファイル経由で提供されたと仮定します。
// redirectSignOut: 'myDevApp://,https://authProvider/logout?logout_uri=myDevApp://'

signOut({
  global: false,
  oauth: {
    redirectUrl: 'https://authProvider/logout?logout_uri=myapp://'
  }
});
```
<Callout> `redirectUrl`が`signOut`に提供されているかどうかに関わらず、設定されているリダイレクトURLリストに、httpまたはhttpsを含まないURLが存在することが期待されます。これはiOSがWebセッションを作成するときにappSchemeを必要とするためです。 </Callout>
<!-- /Platform -->

## 次のステップ

- [外部プロバイダーでサインインする方法を学ぶ](/[platform]/frontend/auth/sign-in/#sign-in-with-an-external-identity-provider)

---
title: "コンセプト"
section: "build-a-backend/auth"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-09-19T16:52:04.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/auth/concepts/"
---

Amplifyは、ユーザーに簡単なサインイン体験を提供しながら、アプリケーションをセキュアに保つのに役立ちます。この体験はセキュリティ戦略の影響を受けます。このセキュリティ戦略には、認証方法、セキュリティ認証情報、および必要に応じて追加の検証を有効にすることが含まれます。

- _認証_ は、**あなたが誰であるか** を検証するプロセスです（_AuthN_ と略されます）。この検証を行うシステムは、Identity Provider（IdP）と呼ばれます。これは自分でホストするIdPまたはクラウドサービスにすることができます。多くの場合、このIdPはApple、Facebook、Google、Amazonなどの外部プロバイダーです。
- _認可_ は、**何にアクセスできるか** を検証するプロセスです（_AuthZ_ と略されます）。これはカスタムロジック、事前定義されたルール、またはポリシー付きの署名されたリクエストでトークンを確認することで実行されることがあります。

一般的な認証方法と関連するリスクは次のとおりです：

- ユーザーがより簡単にアクセスできるようにする外部プロバイダーフェデレーション。ただし、データは第三者と共有されます。

これらの認証方法のセキュリティ認証情報と検証を改善するには、以下の方法があります：

- デフォルトのパスワードポリシーを変更して、ユーザーがより強力なパスワードを作成するようにします。
- ユーザーがパスワードをリセットする前に、追加の連絡先情報を提供することを要求します。
- 多要素認証（MFA）を有効にします。これはサインイン時にセキュリティのレイヤーを追加しますが、ユーザーにとっては摩擦が生じる可能性があります。

## Amazon Cognitoとは？

Amplify Authは [Amazon Cognito](https://aws.amazon.com/cognito/) により実装されています。Amazon Cognitoはアイデンティティおよびアクセス管理サービスで、Webアプリケーションまたはモバイルアプリケーションをセキュアにできます。これは2つのサービスで構成されています：

1. [Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) は、ユーザー登録、認証、アカウント復旧を処理する機能豊富なユーザーディレクトリサービスです
2. [Amazon Cognito Federated Identities または Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) は、ユーザーが他のAWSサービスと相互作用できるようにするために使用されるサービスです

Amplifyはユーザー情報を保存するためにUser Poolsと連携します。これには、Apple、Facebook、Google、またはAmazonなどの他のOpenIDプロバイダーとのフェデレーション、およびAWSリソースへのユーザーアクセスを管理するためのフェデレーションアイデンティティの活用が含まれます。

認可は通常、次の2つの方法のいずれかで実行されます：

1. クライアントがアクション許可または拒否するカスタムロジックを実行するバックエンドにトークンを渡します
2. クライアントがリクエストに署名し、バックエンドが署名を検証します。事前定義されたポリシーに基づいてアクションを許可または拒否します。事前定義されたルール（[IAMアクセスポリシー](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)として知られています）は、Amplifyにより自動的に構成されます。

最初の方法はHTTPまたはGraphQL APIの一般的な認可方法ですが、2番目の方法はAmazon S3、Amazon PinpointなどのようなAWSサービスとのインターフェースに必要です。

### ビルドの前に

Amazon Cognitoはセキュリティ戦略に基づいてカスタマイズできます。ただし、初期構成オプションの一部は、バックエンドリソースが構成された後は変更できません：

- 個別のユーザーを識別するために使用されるユーザー属性（メールと電話番号など）は、名前を変更または削除することはできません。
- サインイン方法（ユーザー名、メール、電話番号を含む）は、初期構成後に追加または変更することはできません。これには、サインインに使用される属性の定義と必須属性の定義の両方が含まれます。必須属性は設定後、すべてのユーザーの値を必要とします。
- 検証方法（ユーザー名とメールを含む）は必須属性と同じであり、構成後は削除できません。
- `sub` 属性は各ユーザープール内の一意の識別子で、変更することはできません。ユーザーのインデックス作成と検索に使用できます。
- MFAがすべてのユーザーの電話番号で **必須** に設定されている場合、ユーザーがサインアップするときにMFAセットアップ（つまり、電話番号の義務付け）を含める必要があります。

詳細については、[Amazon Cognitoドキュメント](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)を参照してください。これには、[ユーザープール属性](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html)と[ユーザープールへのMFAの追加](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html)が含まれます。

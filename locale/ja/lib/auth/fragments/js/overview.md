*Authentication* is a process to validate **who you are** (abbreviated as *AuthN*). The system which does this validation is referred to as an **Identity Provider** or **IdP**. This can be your own self-hosted IdP or a cloud service. Oftentimes, this IdP is a social provider such as Facebook, Google, or Amazon.

*Authorization* は、 **にアクセスできるもの** ( *AuthZ*と略称される) をバリデーションするプロセスです。 これは、カスタムロジック、定義済みルール、ポリシー付きの署名済みリクエストでトークンを参照することによって行われることがあります。

## AWSでの認証

Amplifyエコシステムで 最も一般的な認証方法は、Amazon Cognito User Poolsを独立して使用するか、ソーシャルプロバイダと共にユーザーの身元を検証することです( *Federation*)。

[Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) is a full-featured user directory service to handle user registration, authentication, and account recovery. [Amazon Cognito Federated Identities or Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) on the other hand, is a way to authorize your users to use AWS services.

Amplify interfaces with User Pools to store your user information, including federation with other OpenID providers like Facebook & Google, and it leverages Federated Identities to manage user access to AWS Resources, for example allowing a user to upload a file (to an S3 bucket). The Amplify CLI automates the access control policies for these AWS resources as well as provides [fine grained access controls via GraphQL](https://docs.amplify.aws/cli/graphql-transformer/directives#auth) for protecting data in your APIs.

認証は、多くの場合、2つの方法のいずれかで行われます:

1. クライアントは、アクションを許可または拒否するカスタムロジックを実行するバックエンドにトークンを渡します
1. クライアントはリクエストに署名し、バックエンドは署名を検証し、事前定義されたポリシーに応じてアクションを許可または拒否します。 定義済みのルールは [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html) ポリシーとして知られており、Amplify CLI によって自動的に設定されます。

最初のモードは、REST または GraphQL API の一般的な承認方法です。 一方、S3、Pinpoint、SumerianなどのAWSサービスとの接続には2番目のモードが必要です。

## サインアップとサインイン

For many apps, user sign-up and sign-in is all that is required. Once authenticated the app can talk to an API to access and mutate data. In this case, you can simply create a User Pool by running `amplify add auth` using the Amplify CLI and selecting the default setup. In your application you can use `Auth.signUp`  and `Auth.signIn` (or an Amplify UI component) to complete this process and retrieve tokens. The Amplify client will refresh the tokens calling `Auth.currentSession` if they are no longer valid.

![画像](~/images/SimpleAuthZ.png)

## ソーシャルプロバイダ連盟

Many apps also support login with social providers such as Facebook, Google Sign-In, or Login With Amazon. The preferred way to do this is via an OAuth redirect which lets users login using their social media account and a corresponding user is created in User Pools. With this design you do not need to include an SDK for the social provider in your app. Set this up by running `amplify add auth` and selecting the social provider  option. Upon completion you can use `Auth.federatedSignIn()` in your application to either show a pre-built "Hosted UI" or pass in a provider name (e.g. `Auth.federatedSignIn({provider: 'Facebook'})`) to interface directly and build out your own UI.

![画像](~/images/SocialAuthZ.png)

また、プロバイダからトークンを `Auth.federatedSignIn()`に直接渡すことで、Identity Poolsから直接認証情報を取得することもできます。 ただし、そのプロバイダのSDKを直接アプリで使用し、トークンの更新と認証フローを手動で管理する必要があります。


## AWSサービスへのアクセス

Some apps need to use AWS services which require [signing requests](https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html). Examples of this would be storing images or videos on S3, or sending analytics to Pinpoint or Kinesis. Amplify automatically signs requests with short term credentials from a Cognito Identity Pool which automatically expire, rotate, and refresh by the Amplify client libraries. Setting up your backend with `amplify add auth` and calling `Auth.signIn` will automatically do this for you as well after the client authenticates. The diagram below shows how JWT tokens are returned from User Pools and AWS credentials from Identity Pools. You can access these at any time with `Auth.currentSession()` and `Auth.currentCredentials()`.

![画像](~/images/AWSAuthZ.png)

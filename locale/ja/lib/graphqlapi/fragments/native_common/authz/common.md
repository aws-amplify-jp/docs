APIキー、Amazon IAM資格情報、Amazon Cognitoユーザープール、サードパーティOIDCプロバイダーをサポートしています。 `Amplify.configure()` を呼び出した場合、これは `amplifyconfiguration.json` ファイルから推定されます。

#### API キー

API キーは、AWS AppSync を使用してアプリケーションをセットアップしてプロトタイプを作成する最も簡単な方法です。 これは、誰でもAPIキーを簡単に見つけて、あなたのパブリックサービスへのリクエストを行うことができるので、悪用されやすいことを意味します。 認証チェックを行うには、CognitoユーザプールやAWS IAMなどの他の認証モードを使用します。 API キーは、AWS AppSync をプロビジョニングする際に設定された有効期限に応じて期限切れになり、必要に応じて拡張または新しいキーを作成する必要があります。

#### Amazon Cognito User Pools

Amazon Cognito's user pool is most commonly used with AWS AppSync when adding authorization check on your API calls. If your application needs to interact with other AWS services besides AWS AppSync, such as Amazon S3, you will need to use AWS IAM credentials with Amazon Cognito's identity pools. Amplify CLI can automatically configure this for you when running `amplify add auth` and will also automatically use the authenticated user from user pools to federate with the identity pools to provide the AWS IAM credentials in the application. [See this for more information about the differences](https://aws.amazon.com/premiumsupport/knowledge-center/cognito-user-pools-identity-pools/). This allows you to have both user pool credentials for AWS AppSync and AWS IAM credentials for other AWS resources. You can learn more about Amplify Auth outlined in the [Accessing credentials section](~/lib/auth/access_credentials.md). For manual configuration, add the following snippet to your `amplifyconfiguration.json` file, under the `awsCognitoAuthPlugin`:

```json
{
    ...
    "awsCognitoAuthPlugin": {
        "CognitoUserPool": {
            "Default": {
                "PoolId": "[POOL-ID]",
                "AppClientId": "[APP-CLIENT-ID]",
                "Region": "[REGION]"
            }
        }
    }
}
```
そして `awsAPIPlugin` の下で
```json
{
    ...
    "awsAPIPlugin": {
        "<YOUR-GRAPHQLENDPOINT-NAME": {
            "endpointType": "GraphQL",
            "endpoint": "[GRAPHQL-ENDPOINT]",
            "region": "[REGION]",
            "authorizationType": "AMAZON_COGNITO_USER_POOLS",
        }
    }
}

```

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/10_userpool.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/10_userpool.md"></inline-fragment>

#### IAM

Amazon Cognito identity pools allows you to use credentials from AWS IAM in a mobile application. The Amplify CLI can automatically configure this for you when running `amplify add auth`. For manual configuration, add the following snippet to your `amplifyconfiguration.json` file:

```json
{
    ...
    "awsCognitoAuthPlugin": {
        "CredentialsProvider": {
            "CognitoIdentity": {
                "Default": {
                    "PoolId": "[COGNITO-IDENTITY-POOLID]",
                    "Region": "[REGION]"
                }
            }
        } 
    }
}
```
そして `awsAPIPlugin` の下で
```json
{
    ...
    "awsAPIPlugin": {
        "<YOUR-GRAPHQLENDPOINT-NAME": {
            "endpointType": "GraphQL",
            "endpoint": "[GRAPHQL-ENDPOINT]",
            "region": "[REGION]",
            "authorizationType": "AWS_IAM",
        }
    }
}
```


#### OIDC

サードパーティ製のOIDCプロバイダーを使用している場合は、トークンの更新の詳細を管理する必要があります。 `anplifyconfiguration.json` ファイルとコードスニペットを以下のように更新します。

```json
{
    ...
    "awsAPIPlugin": {
        "<YOUR-GRAPHQLENDPOINT-NAME": {
            "endpointType": "GraphQL",
            "endpoint": "[GRAPHQL-ENDPOINT]",
            "region": "[REGION]",
            "authorizationType": "OPENID_CONNECT",
        }
    }
}
```

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/20_oidc.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/20_oidc.md"></inline-fragment>

If you are using Cognito's user pool as the authorization type, this will by default retrieve and use the Access Token for your requests. If you would like to override this behavior and use the ID Token instead, you can treat Cognito user pool as your OIDC provider and use `Amplify.Auth` to retrieve the ID Token for your requests.

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/21_oidc.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/21_oidc.md"></inline-fragment>

#### マルチ認証

This section talks about the capability of AWS AppSync to configure multiple authorization modes for a single AWS AppSync endpoint and region. Follow the [AWS AppSync Multi-Auth](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#using-additional-authorization-modes) to configure multiple authorization modes for your AWS AppSync endpoint.

プライベートおよびパブリックのデータを配信するために、GraphQL API を 1 つ設定できるようになりました。 プライベートデータには、IAM、Cognitoユーザプール、OIDCなどの認証メカニズムを使用して認証されたアクセスが必要です。 パブリックデータは認証されたアクセスを必要とせず、API キーなどの認可メカニズムを介して提供されます。 1 つの GraphQL API を設定して、複数の認証タイプを使用してプライベートデータを配信することもできます。 たとえば、GraphQL API を構成して、OIDC を使用していくつかのスキーマフィールドを承認することができます。 一方、Cognito User Pools や IAM を介して他のスキーマフィールドが表示されます。

As discussed in the above linked documentation, certain fields may be protected by different authorization types. This can lead the same query, mutation, or subscription to have different responses based on the authorization sent with the request; Therefore, it is recommended to use the different `friendly_name_<AuthMode>` as the `apiName` parameter in the `Amplify.API` call to reference each authorization type.

以下のスニペットでは、 `anplifyconfiguration.json` とクライアントコード構成の新しい値を強調します。

The `friendly_name` illustrated here is created from Amplify CLI prompt. There are 4 clients in this configuration that connect to the same API except that they use different `AuthMode`.

```json
{
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0",
    "api": {
        "plugins": {
            "awsAPIPlugin": {
                "[FRIENDLY-NAME-API-WITH-API-KEY]": {
                    "endpointType": "GraphQL",
                    "endpoint": "[GRAPHQL-ENDPOINT]",
                    "region": "[REGION]",
                    "authorizationType": "API_KEY",
                    "apiKey": "[API_KEY]"
                },
                "[FRIENDLY-NAME-API-WITH-IAM": {
                    "endpointType": "GraphQL",
                    "endpoint": "[GRAPHQL-ENDPOINT]",
                    "region": "[REGION]",
                    "authorizationType": "AWS_IAM",
                },
                "[FRIENDLY-NAME-API-WITH-USER-POOLS]": {
                    "endpointType": "GraphQL",
                    "endpoint": "https://xyz.appsync-api.us-west-2.amazonaws.com/graphql",
                    "region": "[REGION]",
                    "authorizationType": "AMAZON_COGNITO_USER_POOLS",
                },
                "[FRIENDLY-NAME-API-WITH-OPENID-CONNECT]": {
                    "endpointType": "GraphQL",
                    "endpoint": "https://xyz.appsync-api.us-west-2.amazonaws.com/graphql",
                    "region": "[REGION]",
                    "authorizationType": "OPENID_CONNECT",
                }
            }
        }
    }
}
```

AWS AppSync の `GRAPHQL-ENDPOINT` は `https://xyz.appsync-api.us-west-2.amazonaws.com/graphql` に似ています。

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/30_multi.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/30_multi.md"></inline-fragment>

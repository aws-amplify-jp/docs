REST エンドポイントの認証モードを決定する場合、いくつかのオプションとカスタマイズが組み込まれています。

## IAM 認証

By default, the API will be using IAM authorization and the requests will be signed for you automatically. IAM authorization has two modes: one using an **unauthenticated** role, and one using an **authenticated** role. When the user has not signed in through `Amplify.Auth.signIn`, the unauthenticated role is used by default. Once the user has signed in, the authenticate role is used, instead.

When you created your REST API with the Amplify CLI, you were asked if you wanted to restrict access. If you selected **no**, then the unauthenticated role will have access to the API. If you selected **yes**, you would have configured more fine grain access to your API.

### 未認証リクエスト

API カテゴリを使用して、認証を必要としないAPI Gateway エンドポイントにアクセスできます。 この場合、Amazon Cognito Identity Pool設定で認証されていないIDを許可する必要があります。 詳細については、 [Amazon Cognito Developer Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html#enable-or-disable-unauthenticated-identities) をご覧ください。

When your API is configured to use IAM as the authorization type, your requests will automatically have IAM credentials added to the headers of outgoing requests. You can verify that IAM is being used as the authorization type by inspecting the `authorizationType` associated with your API in `amplifyconfiguration.json`:

```json
{
    "awsAPIPlugin": {
        "<YOUR-RESTENDPOINT-NAME>": {
            "endpointType": "REST",
            "endpoint": "YOUR-REST-ENDPOINT",
            "region": "us-west-2",
            "authorizationType": "AWS_IAM"
        }
    }
}
```

## API キー

If you want to configure a public REST API, you can set an API key in Amazon API Gateway. Then, update your `amplifyconfiguration.json` to reference it.  The value associated to the `"authorizationType"` key should be `"API_KEY"`.  Also include a `"API_KEY"` as a key, and set its value to whatever your configured in API Gateway.

```json
{
    "awsAPIPlugin": {
        "<YOUR-RESTENDPOINT-NAME>": {
            "endpointType": "REST",
            "endpoint": "YOUR-REST-ENDPOINT",
            "region": "us-west-2",
            "authorizationType": "API_KEY",
            "API_KEY": "YOUR_API_KEY"
        }
    }
}
```

## Cognito User pool authorization

If you set up the API Gateway with a custom authorization with a Cognito User pool, then you can set the `amplifyconfiguration.json` to use `AMAZON_COGNITO_USER_POOLS`.

```json
{
    "awsAPIPlugin": {
        "<YOUR-RESTENDPOINT-NAME>": {
            "endpointType": "REST",
            "endpoint": "YOUR-REST-ENDPOINT",
            "region": "us-west-2",
            "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
    }
}
```

`amplifyconfiguration.json` は `awsCognitoAuthPlugin` ブロック内の Cognito 設定を含める必要があります。これには、Cognito のユーザープールに関する詳細が含まれています。
```json
{
    "CognitoUserPool": {
        "Default": {
            "PoolId": "YOUR-POOL-ID",
            "AppClientId": "YOUR-APP-CLIENT-ID",
            "AppClientSecret": "YOUR-APP-CLIENT-SECRET",
            "Region": "us-east-1"
        }
    },
    "CredentialsProvider": {
        "CognitoIdentity": {
            "Default": {
                "PoolId": "YOUR-COGNITO-IDENTITY-POOLID",
                "Region": "us-east-1"
            }
        }
    }
}
```

With this configuration, your access token will automatically be included in outbound requests to your API, as an `Authorization` header. For more details on how to configure the API Gateway with the custom authorization, see [this](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)


## OIDC

サードパーティ製のOIDCプロバイダーを使用している場合は、トークンの更新の詳細を管理する必要があります。 `anplifyconfiguration.json` ファイルとコードスニペットを以下のように更新します。

```json
{
    ...
    "awsAPIPlugin": {
        "<YOUR-RESTENDPOINT-NAME": {
            "endpointType": "GraphQL",
            "endpoint": "[REST-ENDPOINT]",
            "region": "[REGION]",
            "authorizationType": "OPENID_CONNECT",
        }
    }
}
```

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/20_oidc.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/20_oidc.md"></inline-fragment>

### アクセストークンまたはIDトークンの使用に関する注意

アクセストークンにはスコープとグループが含まれており、許可されたリソースへのアクセスを許可するために使用されます。 [これはカスタムスコープを有効にするためのチュートリアルです。](https://aws.amazon.com/premiumsupport/knowledge-center/cognito-custom-scopes-api-gateway/).

IDトークンには、名前、電子メール、電話番号などの認証済みユーザーの身元に関する主張が含まれています。 たとえば、 [Amplify CLI](https://docs.amplify.aws/cli/usage/lambda-triggers#override-id-token-claims) を使用するなど、カスタムクレームも含まれる可能性があります。

If you are using Cognito's user pool as the authorization type, this will by default retrieve and use the Access Token for your requests. If you would like to override this behavior and use the ID Token instead, you can treat Cognito user pool as your OIDC provider, set the authorization type to `OPENID_CONNECT` and use `Amplify.Auth` to retrieve the ID Token for your requests.

<inline-fragment platform="ios" src="~/lib/graphqlapi/fragments/ios/authz/21_oidc.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/graphqlapi/fragments/android/authz/21_oidc.md"></inline-fragment>

## HTTP リクエストヘッダーのカスタマイズ

HTTP リクエストでカスタムヘッダーを使用するには、まず Amazon API Gateway に追加する必要があります。 ヘッダーの設定についての詳細は、 [Amazon API Gateway Developer Guide](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html) をご覧ください。

Amplify CLI を使用して API を作成した場合、以下の手順でカスタムヘッダーを有効にできます。

1. [Amazon API Gateway console](https://aws.amazon.com/api-gateway/) を参照してください。
3. Amazon API Gateway コンソールで、設定したいパスをクリックします (例 /{proxy+})
4. *アクション* のドロップダウンメニューをクリックし、 **CORS を有効にする** を選択します。
5. 「Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,my-custom-header」のように、テキストフィールドAccess-Control-Allow-Headersにカスタムヘッダーを追加します。
6. 「CORSを有効にし、既存のCORSヘッダーを置き換え」をクリックして確認します。
7. Finally, similar to step 3, click the Actions drop-down menu and then select **Deploy API**. Select **Development** on deployment stage and then **Deploy**. (Deployment could take a couple of minutes).

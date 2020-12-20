Existing AWS AppSync resources can be used with the Amplify Libraries by referencing your AWS AppSync **endpoint** and configuring authorization  in your `amplifyconfiguration.json` file.

```json
{
    "api": {
        "plugins": {
            "awsAPIPlugin": {
                "[API NAME]": {
                    "endpointType": "GraphQL",
                    "endpoint": "[APPSYNC ENDPOINT]",
                    "region": "[REGION]",
                    "authorizationType": "[AUTHORIZATION TYPE]",
                    ...
                }
            }
        }
    }
}
```

- **API NAME**: API のフレンドリ名 (例: *api*)
  - **endpoint**: AWS AppSync API の HTTPS エンドポイント (例: *https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaa.appsync-api.us-east-1.amazonaws.com/graphql*)
  - **region**: リソースがプロビジョニングされるAWS地域 (例: *us-east-1*)
  - **authorizationType**: Authorization mode for accessing the API. This can be one of: `AMAZON_COGNITO_USER_POOLS`, `AWS_IAM`, `OPENID_CONNECT`, or `API_KEY`. Each mode requires additional configuration parameters. See [Configure authorization modes](~/lib/graphqlapi/authz.md) for  details.

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。 

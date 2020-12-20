既存のAmazon CognitoのIDプールとユーザープールは、 `amplifyconfiguration.json` ファイルで参照することで、Amplifyライブラリと一緒に使用できます。

```json
{
    "auth": {
        "plugins": {
            "awsCognitoAuthPlugin": {
                "IdentityManager": {
                    "Default": {}
                },
                "CredentialsProvider": {
                    "CognitoIdentity": {
                        "Default": {
                            "PoolId": "[COGNITO IDENTITY POOL ID]",
                            "Region": "[REGION]"
                        }
                    }
                },
                "CognitoUserPool": {
                    "Default": {
                        "PoolId": "[COGNITO USER POOL ID]",
                        "AppClientId": "[COGNITO USER POOL APP CLIENT ID]",
                        "Region": "[REGION]"
                    }
                },
                "Auth": {
                    "Default": {
                        "authenticationFlowType": "USER_SRP_AUTH"
                    }
                }
            }
        }
    }
}
```

- **資格情報プロバイダー**:
  - **Cognito Identity**:
    - **デフォルト**:
      - **PoolID**: Amazon Cognito Identity Pool のID (例: `us-east-1:123e4567-e89b-12d3-a456-426614174000`)
      - **Region**: リソースがプロビジョニングされたAWS地域 (例: `us-east-1`)
- **CognitoUserPool**:
  - **デフォルト**:
    - **PoolId**: Amazon Cognito User PoolのID(例: `us-east-1_abcdefghi`)
    - **AppClientId**: ユーザプールに対する認証に使用するクライアントのID
    - **Region**: リソースがプロビジョニングされたAWS地域 (例: `us-east-1`)

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。 

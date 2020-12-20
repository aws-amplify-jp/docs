- [認証](~/lib/auth/getting-started.md)
- [DataStore](~/lib/datastore/getting-started.md)
- [ユーザーファイルストレージ](~/lib/storage/getting-started.md)
- [サーバーレス API](~/lib/graphqlapi/getting-started.md)
- [分析](~/lib/analytics/getting-started.md)
- [AI/ML](~/lib/predictions/getting-started.md)
- [プッシュ通知](~/lib/push-notifications/getting-started.md)
- [PubSub](~/lib/pubsub/getting-started.md)
- [AR/VR](~/lib/xr/getting-started.md)

## 既存のAWSリソース

If you want to use your existing AWS resources with your app you will need to **manually configure** your app with an `awsconfiguration.json` file in your code. For example, if you were using Amazon Cognito Identity, Cognito User Pools, AWS AppSync, or Amazon S3:

```json
{
    "CredentialsProvider": {
        "CognitoIdentity": {
            "Default": {
                "PoolId": "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
                "Region": "XX-XXXX-X"
            }
        }
    },
    "CognitoUserPool": {
        "Default": {
            "PoolId": "XX-XXXX-X_abcd1234",
            "AppClientId": "XXXXXXXX",
            "Region": "XX-XXXX-X"
        }
    },
    "AppSync": {
        "Default": {
            "ApiUrl": "https://XXXXXX.appsync-api.XX-XXXX-X.amazonaws.com/graphql",
            "Region": "XX-XXXX-X",
            "AuthMode": "AMAZON_COGNITO_USER_POOLS"
        }
    },
    "S3TransferUtility": {
        "Default": {
            "Bucket": "BUCKET_NAME",
            "Region": "XX-XXXX-X"
        }
    }
}
```

上記の構成では、 `Region`、 `Bucket`などの適切な値を設定する必要があります。

## AWS SDKインターフェイス

他のAWSサービスを使用する場合は、生成されたSDKクライアントを介して直接サービスインターフェースオブジェクトを使用できます。

<amplify-callout>

サービス インターフェイス オブジェクトを使用するには、Amazon Cognito ユーザの [IAM ロール](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html) には、要求されたサービスを呼び出すための適切な権限が必要です。

</amplify-callout>

AWSAndroid SDKでサポートされているAWSサービスインターフェースオブジェクトで、AWSMobileClientからサービスコールコンストラクタに資格情報を渡すことで、メソッドを呼び出すことができます。 詳細は [SDK セットアップ オプション](~/sdk/configuration/setup-options.md) を参照してください。

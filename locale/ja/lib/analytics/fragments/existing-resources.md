Existing Amazon Pinpoint resources can be used with the Amplify Libraries by referencing your **Application ID** and **Region** in your `amplifyconfiguration.json` file.

```dart
{
    "analytics": {
        "plugins": {
            "awsPinpointAnalyticsPlugin": {
                "pinpointAnalytics": {
                    "appId": "[APP ID]",
                    "region": "[REGION]"
                },
                "pinpointTargeting": {
                    "region": "[REGION]"
                }
            }
        }
    }
}
```

- **pinpointAnalytics**
  - **appId**: Amazon Pinpoint アプリケーションID
  - **region**: リソースがプロビジョニングされるAWS地域 (例: `us-east-1`)
- **ターゲットをピンポイントする**
  - **region**: リソースがプロビジョニングされるAWS地域 (例: `us-east-1`)

アプリケーションにAWSリソースを追加する前に、アプリケーションにAmplifyライブラリがインストールされている必要があります。 この手順を実行する必要がある場合は、 [Amplifyライブラリのインストール](~/lib/project-setup/create-application.md#n2-install-amplify-libraries) を参照してください。 

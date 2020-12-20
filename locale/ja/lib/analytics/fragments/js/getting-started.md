Analytics カテゴリを使用すると、アプリケーションの分析データを収集できます。 Analytics カテゴリには、 [Amazon Pinpoint](https://aws.amazon.com/pinpoint) と [Amazon Kinesis](https://aws.amazon.com/kinesis) (Kinesis support is only available in the Amplify JavaScript library).

## 目標

Amplify Analyticsを使用してアプリケーションを設定および構成し、分析イベントを記録します。

## 前提条件
* [Amplify CLI をインストールおよび設定](https://docs.amplify.aws/cli/start/install)

## 分析バックエンドの設定

プロジェクトのルートフォルダで次のコマンドを実行します。 CLI は、Amazon Pinpoint リソース名や分析イベント設定など、Analytics カテゴリの設定オプションをプロンプトします。

> Analytics カテゴリは、分析イベントを送信するためにアプリケーションを承認するために、舞台裏の認証カテゴリを使用します。

```bash
anmpify add analytics
```

```console
? Provide your pinpoint resource name: 
    `yourPinpointResourceName`
Adding analytics would add the Auth category to the project if not already added.
? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started) 
    `Yes`
```

バックエンドをデプロイするには、次を実行します。

```bash
push を増幅する
```

A configuration file called `aws-exports.js` will be copied to your configured source directory, for example `./src`. The CLI will also print the URL for Amazon Pinpoint console to track your app events.

## アプリの設定

設定ファイルをアプリに読み込みます。Amplify設定ステップをアプリのルートエントリポイントに追加することをお勧めします。 例えば `App.js` 、Angularの `main.ts` など。

```javascript
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```

解析を無効にしない限り、ユーザーセッションデータは自動的に収集されます。結果を確認するには、 [Amazon Pinpoint コンソール](https://console.aws.amazon.com/pinpoint/home/) を参照してください。

## 予定の記録

カスタムイベントを記録するには、 `レコード` メソッドを呼び出します。

```javascript
import Amplify, { Analytics } from 'aws-amplify';

Analytics.record({ name: 'albumVisit' });
```

## モジュラーインポートの使用

You can import only specific categories into your app if you are only using specific features, analytics for example: `npm install @aws-amplify/analytics` which will only install the Analytics category. For working with AWS services you will also need to install and configure `@aws-amplify/auth`.

分析のみインポート:

```javascript
import Analytics from '@aws-amplify/analytics';

Analytics.record({ name: 'albumVisit' });
```

## APIリファレンス

完全な API 参照については、 [API リファレンス](https://aws-amplify.github.io/amplify-js/api/classes/analyticsclass.html) を参照してください。

## 既存の分析バックエンドを設定

手動設定により、既存の Amazon Pinpoint リソースをアプリケーションで使用できます。

```javascript
import Amplify from 'aws-amplify';

Amplify.configure({
    // To get the AWS Credentials, you need to configure 
    // the Auth module with your Cognito Federated Identity Pool
    Auth: {
        identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx',
        region: 'us-east-1'
    },
    Analytics: {
        // OPTIONAL - disable Analytics if true
        disabled: false,
        // OPTIONAL - Allow recording session events. Default is true.
        autoSessionRecord: true,

        AWSPinpoint: {
            // OPTIONAL -  Amazon Pinpoint App Client ID
            appId: 'XXXXXXXXXXabcdefghij1234567890ab',
            // OPTIONAL -  Amazon service region
            region: 'XX-XXXX-X',
            // OPTIONAL -  Customized endpoint
            endpointId: 'XXXXXXXXXXXX',
            // OPTIONAL - Default Endpoint Information
            endpoint: {
                address: 'xxxxxxx', // The unique identifier for the recipient. For example, an address could be a device token, email address, or mobile phone number.
                attributes: {
                    // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
                    hobbies: ['piano', 'hiking'],
                },
                channelType: 'APNS', // The channel type. Valid values: APNS, GCM
                demographic: {
                    appVersion: 'xxxxxxx', // The version of the application associated with the endpoint.
                    locale: 'xxxxxx', // The endpoint locale in the following format: The ISO 639-1 alpha-2 code, followed by an underscore, followed by an ISO 3166-1 alpha-2 value
                    make: 'xxxxxx', // The manufacturer of the endpoint device, such as Apple or Samsung.
                    model: 'xxxxxx', // The model name or number of the endpoint device, such as iPhone.
                    modelVersion: 'xxxxxx', // The model version of the endpoint device.
                    platform: 'xxxxxx', // The platform of the endpoint device, such as iOS or Android.
                    platformVersion: 'xxxxxx', // The platform version of the endpoint device.
                    timezone: 'xxxxxx' // The timezone of the endpoint. Specified as a tz database value, such as Americas/Los_Angeles.
                },
                location: {
                    city: 'xxxxxx', // The city where the endpoint is located.
                    country: 'xxxxxx', // The two-letter code for the country or region of the endpoint. Specified as an ISO 3166-1 alpha-2 code, such as "US" for the United States.
                    latitude: 0, // The latitude of the endpoint location, rounded to one decimal place.
                    longitude: 0, // The longitude of the endpoint location, rounded to one decimal place.
                    postalCode: 'xxxxxx', // The postal code or zip code of the endpoint.
                    region: 'xxxxxx' // The region of the endpoint location. For example, in the United States, this corresponds to a state.
                },
                metrics: {
                    // Custom metrics that your app reports to Amazon Pinpoint.
                },
                /** Indicates whether a user has opted out of receiving messages with one of the following values:
                 * ALL - User has opted out of all messages.
                 * NONE - Users has not opted out and receives all messages.
                 */
                optOut: 'ALL',
                // Customized userId
                userId: 'XXXXXXXXXXXX',
                // User attributes
                userAttributes: {
                    interests: ['football', 'basketball', 'AWS']
                    // ...
                }
            },

            // Buffer settings used for reporting analytics events.
            // OPTIONAL - The buffer size for events in number of items.
            bufferSize: 1000,

            // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
            flushInterval: 5000, // 5s 

            // OPTIONAL - The number of events to be deleted from the buffer when flushed.
            flushSize: 100,

            // OPTIONAL - The limit for failed recording retries.
            resendLimit: 5
        }
    }
});
```

### IAM ポリシーを更新:

Amazon Pinpoint サービスは、 `レコード` API を使用するために IAM ポリシーが必要です。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "mobiletargeting:UpdateEndpoint",
                "mobiletargeting:PutEvents"
            ],
            "Resource": [
                "arn:aws:mobiletargeting:*:${accountID}:apps/${appId}*"
            ]
        }
    ]
}
```

## エンドポイントを更新

エンドポイントは Pinpoint 内のアプリケーションを一意に識別します。 <a href="https://docs.aws.amazon.com/pinpoint/latest/apireference/rest-api-endpoints.html" target="_blank">エンドポイント</a> を更新するには、 `updateEndpoint()` メソッドを使用します。

```javascript
import Analytics from '@aws-amplify/analytics';

Analytics.updateEndpoint({
    address: 'xxxxxxx', // The unique identifier for the recipient. For example, an address could be a device token, email address, or mobile phone number.
    attributes: {
        // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
        hobbies: ['piano', 'hiking'],
    },
    channelType: 'APNS', // The channel type. Valid values: APNS, GCM
    demographic: {
        appVersion: 'xxxxxxx', // The version of the application associated with the endpoint.
        locale: 'xxxxxx', // The endpoint locale in the following format: The ISO 639-1 alpha-2 code, followed by an underscore, followed by an ISO 3166-1 alpha-2 value
        make: 'xxxxxx', // The manufacturer of the endpoint device, such as Apple or Samsung.
        model: 'xxxxxx', // The model name or number of the endpoint device, such as iPhone.
        modelVersion: 'xxxxxx', // The model version of the endpoint device.
        platform: 'xxxxxx', // The platform of the endpoint device, such as iOS or Android.
        platformVersion: 'xxxxxx', // The platform version of the endpoint device.
        timezone: 'xxxxxx' // The timezone of the endpoint. Specified as a tz database value, such as Americas/Los_Angeles.
    },
    location: {
        city: 'xxxxxx', // The city where the endpoint is located.
        country: 'xxxxxx', // The two-letter code for the country or region of the endpoint. Specified as an ISO 3166-1 alpha-2 code, such as "US" for the United States.
        latitude: 0, // The latitude of the endpoint location, rounded to one decimal place.
        longitude: 0, // The longitude of the endpoint location, rounded to one decimal place.
        postalCode: 'xxxxxx', // The postal code or zip code of the endpoint.
        region: 'xxxxxx' // The region of the endpoint location. For example, in the United States, this corresponds to a state.
    },
    metrics: {
        // Custom metrics that your app reports to Amazon Pinpoint.
    },
    /** Indicates whether a user has opted out of receiving messages with one of the following values:
        * ALL - User has opted out of all messages.
        * NONE - Users has not opted out and receives all messages.
        */
    optOut: 'ALL',
    // Customized userId
    userId: 'XXXXXXXXXXXX',
    // User attributes
    userAttributes: {
        interests: ['football', 'basketball', 'AWS']
        // ...
    }
}).then(() => {
});
```

<a href="https://docs.aws.amazon.com/pinpoint/latest/developerguide/audience-define-user.html" target="_blank">Amazon Pinpoint と Endpoint についての詳細</a> を参照してください。

## カスタムプラグインの使用

Analytics 用のカスタムプラグインを作成できます。これは、カスタム アナリティクスのバックエンドとアプリケーションを統合する場合に役立ちます。

プラグインを作成するには、 `AnalyticsProvider` インターフェイスを実装します。

```typescript
import { Analytics, AnalyticsProvider } from 'aws-amplify';

export default class MyAnalyticsProvider implements AnalyticsProvider {
    // category and provider name
    static category = 'Analytics';
    static providerName = 'MyAnalytics';

    // you need to implement these four methods
    // configure your provider
    configure(config: object): object;

    // record events and returns true if succeeds
    record(params: object): Promise<boolean>;

    // return 'Analytics';
    getCategory(): string;

    // return the name of you provider
    getProviderName(): string;
}
```

プラグインを登録できるようになりました：

```javascript
// add the plugin
Analytics.addPluggable(new MyAnalyticsProvider());

// get the plugin
Analytics.getPluggable(MyAnalyticsProvider.providerName);

// remove the plugin
Analytics.removePluggable(MyAnalyticsProvider.providerName);

// send configuration into Amplify
Analytics.configure({
    MyAnalyticsProvider: { 
        // My Analytics provider configuration 
    }
});

```

デフォルトのプロバイダー (Amazon Pinpoint) は、 `Analyticsを呼び出すときに使用されます。 ecord() <code> 異なるプロバイダを指定しない限り:` `Analytics.record({..},'MyAnalyticsProvider')`.

## Analytics コンソールを表示

ターミナルから次のコマンドを実行します。format@@0タブに移動し、format@@1を選択します。
```console
コンソール分析を増幅する
```
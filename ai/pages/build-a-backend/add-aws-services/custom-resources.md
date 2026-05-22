---
title: "カスタムリソース"
section: "build-a-backend/add-aws-services"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-24T17:12:21.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/custom-resources/"
---

> **Warning:** カスタムリソースを使用すると、任意のAWSサービスをAmplifyバックエンドに統合できます。カスタムリソースが安全であり、ベストプラクティスに準拠していること、およびAmplifyがアプリ用に作成するリソースと連携することを確認する責任があります。

Amplify Gen 2では、[AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/latest/guide/home.html)を使用してカスタムAWSリソースをAmplifyアプリに追加できます。AWS CDKは、[`create-amplify`](https://www.npmjs.com/package/create-amplify)ワークフローの一部としてデフォルトでインストールされます。AWS CDKはオープンソースソフトウェア開発フレームワークであり、TypeScriptなどの使い慣れたプログラミング言語を使用してクラウドアプリケーションリソースを定義します。

AWS CDKはAmplifyアプリ内で使用して、Amplifyが標準でサポートしていない以上のカスタムリソースと構成を追加できます。例えば、開発者はCDKを使用してRedisキャッシュをセットアップし、カスタムセキュリティルールを実装し、AWS Fargate上にコンテナをデプロイしたり、その他のAWSサービスを使用したりできます。

AWS CDKコードを通じて定義されたインフラストラクチャは、Amplifyアプリバックエンドと一緒にデプロイされます。これはAmplifyのシンプルさとCDKの柔軟性を組み合わせて、さらなるカスタマイズが必要な状況に対応します。

> **Info:** AWS CDKアプリは[コンストラクト](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)として知られるビルディングブロックで構成されており、これらは[スタック](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Stack.html)と[アプリ](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.App.html)を形成するために組み合わせられます。詳細については、AWS Cloud Development Kit (AWS CDK) v2 Developer Guideの[Concepts](https://docs.aws.amazon.com/cdk/v2/guide/core_concepts.html)セクションを参照できます。

Amplifyコードファーストの開発者体験を使用して、既存またはカスタムCDK[コンストラクト](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)をAmplifyアプリの[バックエンド](/[platform]/how-amplify-works/concepts/#backend)に追加できます。

## 既存のCDKコンストラクトの追加

AWS CDKには[多くの既存コンストラクト](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)が付属しており、Amplifyバックエンドに直接追加できます。例えば、[Amazon Simple Queue Service (Amazon SQS)](https://aws.amazon.com/sqs/)キューと[Amazon Simple Notification Service (Amazon SNS)](https://aws.amazon.com/sns/)トピックをバックエンドに追加するには、`amplify/backend.ts`ファイルに以下を追加します。

```ts title="amplify/backend.ts"
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data
});

const customResourceStack = backend.createStack('MyCustomResources');

new sqs.Queue(customResourceStack, 'CustomQueue');
new sns.Topic(customResourceStack, 'CustomTopic');
```

`backend.createStack()`の使用に注意してください。このメソッドはバックエンドに、カスタムリソース用の新しいCloudFormationスタックを作成するよう指示します。複数のカスタムスタックを作成でき、任意のスタックに複数のリソースを配置できます。

## CDKコンストラクトの定義

<Callout>

コンストラクトはAWS CDKアプリの基本的なビルディングブロックです。コンストラクトは「クラウドコンポーネント」を表し、コンポーネントを作成するためにAWS CloudFormationに必要なすべてのものをカプセル化します。[詳しく読む](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)。

</Callout>

上記のように、既存のAWS CDKコンストラクトをAmplifyバックエンドで直接使用できます。ただし、一般的なコンストラクトのいくつかのパターンを繰り返す可能性があります。カスタムコンストラクトを使用すると、共通パターンを再利用可能なコンポーネントにカプセル化できます。これにより、ベストプラクティスを実装し、開発を加速し、アプリケーション全体で一貫性を保つことができます。

一般的なユースケースは、Lambda関数とAmazon SNS、Amazon Simple Email Service (Amazon SES)を組み合わせたカスタム通知コンストラクトを作成することです。

このAWS CDKコンストラクトはAmazon SNSとLambdaを使用した疎結合通知システムを実装します。1つのLambda関数からSNSトピックに通知メッセージをパブリッシュでき、トピックにサブスクライブされた別のLambdaを使用して非同期でメッセージを処理できます。

主なコンポーネントは以下の通りです:

- 通知メッセージを受信するAmazon SNSトピック
- Amazon SNSトピックにメッセージをパブリッシュするLambda関数
- トピックにサブスクライブされた2番目のLambdaで、メッセージを処理してAmazon SES経由でメールを送信します

パブリッシャーLambdaは、メールの件名、本文テキスト、および受信者アドレスを含むメッセージをパブリッシュできます。メーラーLambdaはSNSトピックからメッセージを取得し、実際のメール送信を処理します。

`CustomNotifications`カスタムCDKコンストラクトは次のように定義できます:

```ts title="amplify/custom/CustomNotifications/resource.ts"
import * as url from 'node:url';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

// message to publish
export type Message = {
  subject: string;
  body: string;
  recipient: string;
};

type CustomNotificationsProps = {
  /**
   * The source email address to use for sending emails
   */
  sourceAddress: string;
};

export class CustomNotifications extends Construct {
  public readonly topic: sns.Topic;
  constructor(scope: Construct, id: string, props: CustomNotificationsProps) {
    super(scope, id);

    const { sourceAddress } = props;

    // Create SNS topic
    this.topic = new sns.Topic(this, 'NotificationTopic');

    // Create Lambda to publish messages to SNS topic
    const publisher = new lambda.NodejsFunction(this, 'Publisher', {
      entry: url.fileURLToPath(new URL('publisher.ts', import.meta.url)),
      environment: {
        SNS_TOPIC_ARN: this.topic.topicArn
      },
      runtime: Runtime.NODEJS_18_X
    });

    // Create Lambda to process messages from SNS topic
    const emailer = new lambda.NodejsFunction(this, 'Emailer', {
      entry: url.fileURLToPath(new URL('emailer.ts', import.meta.url)),
      environment: {
        SOURCE_ADDRESS: sourceAddress
      },
      runtime: Runtime.NODEJS_18_X
    });

    // Subscribe emailer Lambda to SNS topic
    this.topic.addSubscription(new subscriptions.LambdaSubscription(emailer));

    // Allow publisher to publish to SNS topic
    this.topic.grantPublish(publisher);
  }
}
```

`Publisher`のLambda関数コードは以下の通りです:

```ts title="amplify/custom/CustomNotifications/publisher.ts"
// amplify/custom/CustomNotifications/publisher.ts
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { Handler } from 'aws-lambda';
import type { Message } from './resource';

const client = new SNSClient({ region: process.env.AWS_REGION });

// define the handler that will publish messages to the SNS Topic
export const handler: Handler<Message, void> = async (event) => {
  const { subject, body, recipient } = event;
  const command = new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify({
      subject,
      body,
      recipient
    })
  });
  try {
    const response = await client.send(command);
    console.log('published', response);
  } catch (error) {
    console.log('failed to publish message', error);
    throw new Error('Failed to publish message', { cause: error });
  }
};
```

`Emailer`のLambda関数コードは以下の通りです:

```ts title="amplify/custom/CustomNotifications/emailer.ts"
// amplify/custom/CustomNotifications/emailer.ts
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { SNSHandler } from 'aws-lambda';
import type { Message } from './resource';

const sesClient = new SESClient({ region: process.env.AWS_REGION });

// define the handler to process messages from the SNS topic and send via SES
export const handler: SNSHandler = async (event) => {
  for (const record of event.Records) {
    const message: Message = JSON.parse(record.Sns.Message);

    // send the message via email
    await sendEmail(message);
  }
};

const sendEmail = async (message: Message) => {
  const { recipient, subject, body } = message;

  const command = new SendEmailCommand({
    Source: process.env.SOURCE_ADDRESS,
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Text: { Data: body }
      },
      Subject: { Data: subject }
    }
  });

  try {
    const result = await sesClient.send(command);
    console.log(`Email sent to ${recipient}: ${result.MessageId}`);
  } catch (error) {
    console.error(`Error sending email to ${recipient}: ${error}`);
    throw new Error(`Failed to send email to ${recipient}`, { cause: error });
  }
};
```

`CustomNotifications`CDKコンストラクトは、各インスタンスに異なるプロパティを使用して、Amplify`backend`に1回以上追加できます。

```ts title="amplify/backend.ts"
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { CustomNotifications } from './custom/CustomNotifications/resource';

const backend = defineBackend({
  auth,
  data
});

const customNotifications = new CustomNotifications(
  backend.createStack('CustomNotifications'),
  'CustomNotifications',
  { sourceAddress: 'sender@example.com' }
);

backend.addOutput({
  custom: {
    topicArn: customNotifications.topic.topicArn,
    topicName: customNotifications.topic.topicName,
  },
});
```

## コミュニティCDKリソース

[Construct Hub](https://constructs.dev/)は、再利用可能なインフラストラクチャコンポーネントのコミュニティ駆動カタログです。これは開発者がAWS CDKの再利用可能なパターンを発見して共有する場所で、AWSによって管理されています。

さらに、[AWS CDKを使用したサンプルプロジェクト](https://github.com/aws-samples/aws-cdk-examples)リポジトリには、再利用可能なCDKコンストラクトの多くの例が含まれています。

これらのリソースを使用して、Amplifyアプリで使用できるカスタムCDKコンストラクトを作成できます。

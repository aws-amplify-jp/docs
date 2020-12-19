> 前提条件: [Amplify CLI をインストールして構成します](~/cli/start/install.md)

## 新しいバックエンドを作成

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
amplifyの追加予測
```

CLIは、どのようなユースケースを持っているか(画像からオブジェクトを識別する)など、予測カテゴリの設定オプションをプロンプトします。 テキストの翻訳など)、デフォルトまたは詳細設定。

Predictionsカテゴリは、アプリケーションがAI/MLアクションを実行することを認可するために、舞台裏のAuthカテゴリを使用します。

`add` コマンドはバックエンドの設定を自動的に作成します。すべての設定が完了したら、以下を実行します。

```bash
push を増幅する
```

`aws-exports.js` と呼ばれる設定ファイルが、 `./src` などの設定されたソースディレクトリにコピーされます。

## フロントエンドの設定

設定ファイルをアプリに読み込みます。Amplify設定ステップをアプリのルートエントリポイントに追加することをお勧めします。 例えば `App.js` 、Angular や Ionic の `main.ts` など。

```javascript
import Amplify from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictsProvider());
```

## 既存のバックエンドをインポート

手動設定により、既存のAmazon AIやMLリソースをアプリで使用できます。

```javascript
import Amplify from 'aws-amplify';

Amplify.configure({
    // To get the AWS Credentials, you need to configure 
    // the Auth module with your Cognito Federated Identity Pool
    "Auth": {
        "identityPoolId": "us-east-1:xxx-xxx-xxx-xxx-xxx",
        "region": "us-east-1"
    },
    "predictions": {
        "convert": {
            "translateText": {
                "region": "us-east-1",
                "proxy": false,
                "defaults": {
                    "sourceLanguage": "en",
                    "targetLanguage": "zh"
                }
            },
            "speechGenerator": {
                "region": "us-east-1",
                "proxy": false,
                "defaults": {
                    "VoiceId": "Ivy",
                    "LanguageCode": "en-US"
                }
            },
            "transcription": {
                "region": "us-east-1",
                "proxy": false,
                "defaults": {
                    "language": "en-US"
                }
            }
        },
        "identify": {
            "identifyText": {
                "proxy": false,
                "region": "us-east-1",
                "defaults": {
                    "format": "PLAIN"
                }
            },
            "identifyEntities": {
                "proxy": false,
                "region": "us-east-1",
                "celebrityDetectionEnabled": true,
                "defaults": {
                    "collectionId": "identifyEntities8b89c648-test",
                    "maxEntities": 50
                }
            },
            "identifyLabels": {
                "proxy": false,
                "region": "us-east-1",
                "defaults": {
                    "type": "LABELS"
                }
            }
        },
        "interpret": {
            "interpretText": {
                "region": "us-east-1",
                "proxy": false,
                "defaults": {
                    "type": "ALL"
                }
            }
        }
    }
});
```

### IAM Policy

Amplify CLI は、適切な機能を使用するために、Cognito Identity Pool のロールに適切な IAM ポリシーを設定します。 ライブラリを手動で使用している場合は、これを自分で設定する必要があります。 以下のポリシーは、format@@0カテゴリのすべてのサービスの設定ポリシーを示します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "translate:TranslateText",
                "polly:SynthesizeSpeech",
                "transcribe:StartStreamTranscriptionWebSocket",
                "comprehend:DetectSentiment",
                "comprehend:DetectEntities",
                "comprehend:DetectDominantLanguage",
                "comprehend:DetectSyntax",
                "comprehend:DetectKeyPhrases",
                "rekognition:DetectFaces",
                "rekognition:RecognizeCelebrities"
                "rekognition:DetectLabels",
                "rekognition:DetectModerationLabels",
                "rekognition:DetectText",
                "rekognition:DetectLabel",
                "textract:AnalyzeDocument",
                "textract:DetectDocumentText",
                "textract:GetDocumentAnalysis",
                "textract:StartDocumentAnalysis",
                "textract:StartDocumentTextDetection",
                "rekognition:SearchFacesByImage"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

`rekognition:SearchFacesByImage` では、リソースを `arn:aws:rekognion:<REGION>:<ACCOUNT_ID>:collection/<COLLECTION_ID>`などの個々のコレクションにスコープすることができます。 Amplify CLIはこれを自動的に行います。

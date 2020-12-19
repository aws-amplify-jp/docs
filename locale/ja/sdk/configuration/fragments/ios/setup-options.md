AWS SDKには、アプリケーションに共通の機能と機能をすばやく追加するための、 [ハイレベルのクライアントインターフェイス](~/start/start.md) が含まれています。 カスタムまたは高度な要件がある場合は、生成された AWS サービスインターフェイスを手動で追加して直接操作することもできます。

## CocoaPods のセットアップ

The AWS Mobile SDK for iOS is available through [CocoaPods](https://cocoapods.org). Install CocoaPods by running the following commands from the folder containing your projects `*.xcodeproj` file:

```bash
gem install cocoapods
pod setup
pod init
```

In your project directory (the directory where your `*.xcodeproj` file is), open the empty text file named `Podfile`. Replace `myAppName` with your app name. You can also remove pods for services that you don't use. For example, if you don't use `AWSAutoScaling`, remove or do not include the `AWSAutoScaling` pod.

```ruby
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '9.0'
use_frameworks!

target :'YOUR-APP-NAME' do
    pod 'AWSAuth'
    pod 'AWSAuthCore'
    pod 'AWSAuthUI'
    pod 'AWSAutoScaling'
    pod 'AWSCloudWatch'
    pod 'AWSCognito'
    pod 'AWSCognitoAuth'
    pod 'AWSCognitoIdentityProvider'
    pod 'AWSCognitoIdentityProviderASF'
    pod 'AWSCore'
    pod 'AWSDynamoDB'
    pod 'AWSEC2'
    pod 'AWSElasticLoadBalancing'
    pod 'AWSFacebookSignIn'
    pod 'AWSGoogleSignIn'
    pod 'AWSIoT'
    pod 'AWSKMS'
    pod 'AWSKinesis'
    pod 'AWSLambda'
    pod 'AWSLex'
    pod 'AWSLogs'
    pod 'AWSMachineLearning'
    pod 'AWSMobileClient'
    pod 'AWSPinpoint'
    pod 'AWSPolly'
    pod 'AWSRekognition'
    pod 'AWSS3'
    pod 'AWSSES'
    pod 'AWSSNS'
    pod 'AWSSQS'
    pod 'AWSSimpleDB'
    pod 'AWSUserPoolsSignIn'
end
```

Once complete, run `pod install` and open the `*.xcworkspace` with Xcode and **build** your project to start using the SDK. Once you have created a workspace, always use `*.xcworkspace` to open the project instead of `*.xcodeproj`.

SDK の新しいバージョンがリリースされるたびに、 `pod update` を実行し、プロジェクトを再構築して新機能を使用することで更新できます。

## Carthage のセットアップ

AWS Mobile SDK for iOS は [Carthage](https://github.com/Carthage/Carthage)から入手できます。 [Carthage](https://github.com/Carthage/Carthage#installing-carthage) の最新バージョンをインストールします。

`カートファイル`に以下を追加:

```
github "aws-amplify/aws-sdk-ios"
```

Once complete, run `carthage update` and open the `*.xcworkspace` or `*.xcodeproj` file with Xcode and chose your `Target`. In the `General` tab, find `Embedded Binaries`, then choose the `+` button.

Choose the `Add Other` button, navigate to the `AWS<#ServiceName#>.framework` files under `Carthage > Build > iOS` and select `AWSCore.framework` and the other service frameworks you require. Do not select the `Destination: Copy items` if needed check box when prompted.

* AWSAuth
* AWSAuthCore
* AWSAuthUI
* AWSAutoScaling
* AWSCloudWatch
* AWSCognito
* AWSCognitoAuth
* AWSCognitoIdentityProvider
* AWSCognitoIdentityProviderASF
* AWSCore
* AWSDynamoDB
* AWSEC2
* AWSElasticLoadBalancing
* AWSFacebookSignIn
* AWSGoogleサインイン
* AWSIoT
* AWSKMS
* AWSKinesis
* AWSLambda
* AWSLex
* AWSログ
* AWSmachineLearning
* AWSMobileClient
* AWSPinpoint
* AWSPolly
* AWSRekognition
* AWSS3
* AWSES
* AWSSNS
* AWSSQS
* AWSSimpleDB
* AWSUserPoolsSignIn

Under the `Build Phases` tab in your `Target`, choose the `+` button on the top left and then select `New Run Script Phase`.

ビルドフェーズを以下のように設定します。このフェーズが「埋め込みフレームワーク」フェーズの下にあることを確認します。

```
Shell /bin/sh

bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/AWSCore.framework/strip-frameworks.sh"

Show environment variables in build log: Checked
Run script only when installing: Not checked

Input Files: Empty
Output Files: Empty
```

Now **build** your project to start using the SDK. Whenever a new version of the SDK is released you can update by running `carthage update` and rebuilding your project to use the new features.

> 注意:AWS SDK for iOSは、最新バージョンのXcodeを使用してCarthageバイナリをビルドします。 ビルド済みのバイナリを使用するには、Xcode のバージョンが同じである必要があります。 そうでなければ、 `--no-use-binaries` フラグを `cartage update` コマンドに渡すことで、マシン上でフレームワークを構築する必要があります。

## Frameworks setup

Download the [latest SDK](https://sdk-for-ios.amazonwebservices.com/latest/aws-ios-sdk.zip). Older SDK versions can be downloaded from `https://sdk-for-ios.amazonwebservices.com/aws-ios-sdk-#.#.#.zip`, where `#.#.#` represents the version number. So for version 2.10.2, the download link is [https://sdk-for-ios.amazonwebservices.com/aws-ios-sdk-2.10.2.zip](https://sdk-for-ios.amazonwebservices.com/aws-ios-sdk-2.10.2.zip).

With your project open in Xcode, select your `Target`. Under `General` tab, find `Embedded Binaries` and then click the `+` button.

Click the `Add Other...` button, navigate to the `AWS<#ServiceName#>.framework` files and select them. Check the `Destination: Copy items if needed` checkbox when prompted.

* `AWSAuth.framework`
* `AWSAuthCore.framework`
* `AWSAuthUI.framework`
* `AWSAutoScaling.framework`
* `AWSCloudWatch.framework`
* `AWSCognito.framework`
* `AWSCognitoAuth.framework`
* `AWSCognitoIdentityProvider.framework`
* `AWSCognitoIdentityProviderASF.framework`
* `AWScore.framework`
* `AWSDynamoDB.framework`
* `AWSEC2.framework`
* `AWSElasticLoadBalancing.framework`
* `AWSFacebookSignIn.framework`
* `AWSGoogleSignIn.framework`
* `AWSIoT.framework`
* `AWSKMS.framework`
* `AWSKinesis.framework`
* `AWSLambda.framework`
* `AWSLex.framework`
* `AWSLogs.framework`
* `AWSMachineLearning.framework`
* `AWSMobileClient.framework`
* `AWSPinpoint.framework`
* `AWSPolly.framework`
* `AWSRekognition.framework`
* `AWSS3.framework`
* `AWSSES.framework`
* `AWSSNS.framework`
* `AWSSQS.framework`
* `AWSSimpleDB.framework`
* `AWSUserPoolsSignIn.framework`

Under the `Build Phases` tab in your `Target`, click the `+` button on the top left and then select `New Run Script Phase`. Then setup the build phase as follows. Make sure this phase is below the `Embed Frameworks` phase.

    Shell /bin/sh
    
    bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/AWSCore.framework/strip-frameworks.sh"
    
    Show environment variables in build log: Checked
    Run script only when installing: Not checked
    
    Input Files: Empty
    Output Files: Empty

Now **build** your project to start using the SDK. Whenever a new version of the SDK is released you can update by selecting the previously imported AWS frameworks in `Project Navigator` in Xcode and pressing 'delete' on your keyboard. Then select `Move to Trash` and follow the installation process above to include the new version of the SDK.

## AWS SDKバージョンvs. セマンティックバージョン管理

AWS SDK for iOS は、セマンティックバージョンに従っていません。 代わりに、後方互換性のあるバグ修正 *と* 壊れない変更の両方について、パッチレベルのバージョンが増加します。 をクリックして、変更を破るマイナーバージョンを増やします。 主なバージョン変更はまれであり、通常は劇的に異なるプログラミングモデルを示します。

比較のために、Semantic バージョン管理は、後方互換性のあるバグ修正のパッチレベルを増加させます。 後方互換性のある新機能のマイナーバージョンと、互換性のない変更のためのメジャーバージョンです。

## 直接AWSサービスへのアクセス

You can call AWS service interface objects directly via the generated SDK clients. You can use the client credentials provided by the [AWSMobileClient](~/sdk/auth/getting-started.md) when using the `.default()` method on a service object (e.g. `AWSSQS.default()`). This will leverage short term AWS credentials from Cognito Identity. Alternatively, you can call the constructors manually.

**注意:** 認証情報プロバイダとして AWSMobileClient に依存している場合。 その後、他のサービスクライアントを構築する前に AWSMobileClient を初期化します。 AWSMobileClient は、すべてのデフォルトクライアントの資格情報プロバイダーとして自身をアタッチします。 しかし、AWSMobileClientを初期化する前にデフォルトの資格情報プロバイダを添付する場合。 サービスクライアントの API 呼び出しを認証するために使用される資格情報を AWSMobileClient に依存させることはできません。

<amplify-callout warning>

サービス インターフェイス オブジェクトを使用するには、Amazon Cognito ユーザの [IAM ロール](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html) には、要求されたサービスを呼び出すための適切な権限が必要です。

</amplify-callout>

For example, if you were using [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) in Swift you would first add `AWSSQS` to your `Podfile` and install the dependencies with `pod install` (alternatively follow the instructions for [Carthage](#carthage-setup) or [Frameworks](#frameworks-setup)). Next, update your `awsconfiguration.json` like so:

```json
    "SQS" : {
        "Default": {
            "Region": "XX-XXXX-X"
        }
}
```

**Note**: The key is `SQS` and not `AWSSQS` as the `awsconfiguration.json` file does not prefix keys with `AWS`.

次に、Xcode プロジェクトに `AWSSQS` をインポートし、クライアントを作成します。

```swift
import AWSSQS

func addItemSQS() {
        let sqs = AWSSQS.default()
        let req = AWSSQSSendMessageRequest()
        req?.queueUrl = "https://sqs.XX-XXXX-X.amazonaws.com/XXXXXXXXXXXX/MyQueue"
        req?.messageBody = "hello world"
        sqs.sendMessage(req!) { (result, err) in
            if let result = result {
                print("SQS result: \(result)")
            }
            if let err = err {
                print("SQS error: \(err)")
            }
        }
    }
```

`self.addItemSQS()` を呼び出して、アプリケーションからこのアクションを呼び出すことができます。

## ログ

このSDKのバージョン2.5.4以降では、ログ収集は [CocoaLumberjack SDK](https://github.com/CocoaLumberjack/CocoaLumberjack)を利用しており、柔軟で高速なオープンソースのログフレームワークです。 出力ターゲットあたりのログレベルを設定する機能を含む、多くの機能をサポートしています。 例えば、コンソールに記録された簡潔なメッセージと、ログファイルに詳細なメッセージを表示します。

CocoaLumberjackのロギングレベルは、レベルがverboseに設定されている場合、verbose以下のレベルからのすべてのメッセージがログに記録されるような加算機能です。 必要に応じてカスタムロギングを設定することもできます。詳細については、 [CocoaLumberjack ロギングレベル](https://github.com/CocoaLumberjack/CocoaLumberjack/blob/master/Documentation/CustomLogLevels.md) を参照してください。

AWSCoreをインポートして呼び出しすることで、開発サイクルの段階に合わせてログレベルを変更できます。

```swift
AWSDDLog.sharedInstance.logLevel = .verbose
```

次のログレベルオプションが使用できます。

- `.off`
- `.error`
- `.warning`
- `.info`
- `.debug`
- `.verbose`

App Store に公開する前に、ログレベルを  `.off` に設定することをお勧めします。

CocoaLumberjackはファイルに直接ログを記録したり、Xcodeコンソールと統合するフレームワークとして使用することができます。例えば：

```swift
//File Logger example
let fileLogger: AWSDDFileLogger = AWSDDFileLogger() // File Logger
fileLogger.rollingFrequency = TimeInterval(60*60*24)  // 24 hours
fileLogger.logFileManager.maximumNumberOfLogFiles = 7
AWSDDLog.add(fileLogger)


//Console example
AWSDDLog.add(AWSDDTTYLogger.sharedInstance) // TTY = Xcode console
```

## インメモリ オブジェクトを使用して構成

As an alternative to the `awsconfiguration.json` file, since version `2.11.0` a configuration object can also be used for configuring the client. This approach can be useful for resolving configuration in runtime instead of the pre-defined JSON file:

```swift
let configuration: [String: Any] = [
    "IdentityManager": [
        "Default": [:]
    ],
    "Auth": [
        "Default": [
            "OAuth": [
                "AppClientId": "APP_CLIENT_ID",
                "Scopes": ["email"]
            ]
        ]
    ]
]

let mobileClient = AWSMobileClient(configuration: configuration)
mobileClient.initialize { (userState, error) in
    // initialization logic
}
```

<amplify-callout warning>

Please note that creating multiple instances of `AWSMobileClient` <b>is not supported</b>. The configuration cannot be reset and/or re-initialized. Therefore, even though you can instantiate `AWSMobileClient` multiple times, all instances will have the same configuration reference. If you configure `AWSMobileClient` as shown above, make sure to use the initialized in memory object of mobileClient instead of the singleton object of `AWSMobileClient`.

</amplify-callout>

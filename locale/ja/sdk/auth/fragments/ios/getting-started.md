## 依存関係のインストール

`amplify init`を使用してプロジェクトディレクトリに初期化後、 `Podfile` を次のように編集します:

```ruby
'MyApp' をターゲットにする ##MyAppをアプリケーション名
  use_frameworksに置き換えます! 
 pod 'AWSMobileClient' # 必要な依存関係
  pod 'AWSAuthUI' # ドロップインUIを使用するために必要なオプションの依存関係
  pod 'AWSUserPoolsSignIn' # ドロップインUIを使用するために必要なオプションの依存関係
  pod 'AWSUserPoolsSignIn' # 必要なオプションの依存関係
end
```

次に、次のコマンドを実行します。

```bash
pod install --repo-update
```

Open the **.xcworkspace** file for your project (close the **.xcodeproj** file if you already have it open). The CLI will create the `awsconfiguration.json` file in your project directory. In the Finder, drag `awsconfiguration.json` into Xcode under the top Project Navigator folder (the folder name should match your Xcode project name). When the `Options` dialog box appears, do the following:

* 必要に応じて `項目をコピー` チェックボックスをクリアします。
* `グループの作成`を選択し、 `終了` を選択します。

プロジェクトを一度ビルドすると、すべてのフレームワークが確実に取り込まれ、コンパイルされます。

## 自動セットアップ

プロジェクトのrootフォルダで次のコマンドを実行します。

```bash
増幅して認証を追加
```

> これまでにAmplifyカテゴリを有効にしており、例えばストレージカテゴリなど、舞台裏でAuthを使用している場合は、すでに認証設定を行っている可能性があります。 そのような場合は、設定を編集するために、 `増幅する auth update` コマンドを実行してください。

Amplify CLI プロンプトは、認証設定をカスタマイズするのに役立ちます。
- サインイン/登録フローを編集する
- 多要素認証のための電子メールとSMSメッセージを編集する
- ユーザーの属性をカスタマイズします。例：名前、電子メール
- Facebook、Twitter、Google、Amazonなどのサードパーティの認証プロバイダを有効にする

認証オプションを設定した後、バックエンドを更新します:

```bash
push を増幅する
```

### Lambda Triggers

The CLI allows you to configure [Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html) for your Amazon Cognito User Pool. These enable you to add custom functionality to your registration and authentication flows. [Read more](~/cli/usage/lambda-triggers.md)

## 手動セットアップ

CLI を使用しない手動設定の場合は、次のような `awsconfiguration.json` ファイルが必要です。

```json
    {
        "IdentityManager": {
            "Default": {}
        },
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
        }
    }
```

Cognitoユーザーとアイデンティティプールの両方を使用している場合は、上記のすべてのキーが必要です。

### 初期化

Xcode プロジェクトで `AppDelegate.swift` ファイルを開き、 `AWSMobileClient` をインポートして `アプリケーション` 機能に追加します。

```swift
import AWSMobileClient

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

            // Initialize AWSMobileClient singleton
            AWSMobileClient.default().initialize { (userState, error) in
                if let userState = userState {
                    print("UserState: \(userState.rawValue)")
                } else if let error = error {
                    print("error: \(error.localizedDescription)")
                }
            }

        return true
    }
    ...
```

Build and run your program to see the initialized client in Xcode messages. Since you haven't logged in yet it will print a state of `signedOut`. The `userState` returns an ENUM which you can perform different actions in your workflow. For example, now add to the `viewDidLoad()` function of your `ViewController.swift`:

```swift

    import AWSMobileClient

    ...

    override func viewDidLoad() {
        super.viewDidLoad()
        switch( AWSMobileClient.default().currentUserState) {
            case .signedIn:
                DispatchQueue.main.async {
                    print("Logged In")
                }
            case .signedOut:
                DispatchQueue.main.async {
                    print("Signed Out")
                }
            default:
                AWSMobileClient.default().signOut()
            }
    }
```

You might leverage the above workflow to perform other actions in the `signedIn` case, such as calling [GraphQL APIs with AWS AppSync](~/sdk/api/graphql.md) or uploading content with [Amazon S3](~/sdk/storage/getting-started.md).

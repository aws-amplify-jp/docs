デバイスを覚えることは、多要素認証(MFA)と組み合わせると便利です。 Amazon CognitoユーザープールでMFAが有効になっている場合 エンドユーザーは、サインインするたびに電子メールまたはSMSで受信したセキュリティコードを入力する必要があります。 これはセキュリティを高めますが、ユーザーの経験を犠牲にしています。

デバイスを覚えておくと、ユーザーがそのデバイスにサインインしたときに第2の要件を自動的に満たすことができます。 ユーザー体験の摩擦を減らすことができます

## 認証カテゴリの設定
<amplify-callout> Web UI サインインメソッドのいずれかを使用している場合、デバイスの記憶機能は機能しません。 </amplify-callout>

記憶されたデバイス機能を有効にするには、Cognito User Pool コンソールを開きます。 これを行うには、 **プロジェクトディレクトリ** に移動し、 **コマンド** を発行します。
```bash
増幅認証コンソール
```

**次のオプションを選択して** Cognito User Pool コンソールを開きます:
```bash
?どのコンソール
    ユーザープール
```

When the console opens, **click on Devices** from the left navigation menu, which will render the following page allowing you to configure your preference for remembering a user's device.

![認証する](~/images/auth/webconsole_remember1.png)

**デフォルトでユーザーのデバイスを覚えておくか、ユーザーに選択権を与えるかに応じて、** のいずれかを選択します。

CognitoユーザープールでMFAが有効になっている場合、マルチファクタ認証時に2番目のファクタを抑制するオプションがあります。  **記憶されたデバイスを第2因子メカニズムとして使用する場合は、** を選択します。

![認証する](~/images/auth/webconsole_remember2.png)

選択したら、「変更を保存」をクリックします。記憶されたデバイスを管理するためにコードを更新する準備が整いました。

## API
### デバイスを記憶する
デバイスを記憶としてマークすることができます: <inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/10_rememberDevice.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/10_rememberDevice.md"></inline-fragment>

### デバイスを忘れた
以下のAPIを使用してデバイスを忘れることができます。忘れたデバイスはまだ追跡されていることに注意してください。 思い出された、忘れられた、そして追跡された間の違いについては、以下を参照してください。 <inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/20_forgetDevice.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/20_forgetDevice.md"></inline-fragment>

### デバイスを取得
次の方法で、記憶されたデバイスのリストを取得できます: <inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/30_fetchDevice.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/30_fetchDevice.md"></inline-fragment>

## 用語
* **追跡**
  * ユーザーが新しいデバイスでサインインするたびに、クライアントには認証イベントが成功した後にデバイスキーが与えられます。 このデバイスキーを使用して、確認デバイスAPIを呼び出すために使用されるソルトとパスワード検証器を生成します。 この時点で、デバイスは **tracked**と見なされます。 デバイスが追跡された状態になったら、Amazon Cognitoコンソールを使用してトラッキングが開始された時間を確認できます。 最後の認証時間とそのデバイスに関する他の情報です
* **記憶されている**
  * 記憶されたデバイスも追跡されます。 ユーザー認証中 記憶されたデバイスに割り当てられたデバイスキーと秘密のペアは、ユーザーが以前サインインに使用したデバイスと同じデバイスであることを確認するために使用されます。
* **記憶されていません**
  * 記憶されていないデバイスは、Cognitoがデバイスを覚えるためにユーザーに「オプトイン」を要求するように設定されている追跡デバイスです。 しかし、ユーザーはデバイスを記憶させることを選択していません。 このユースケースは、所有していないデバイスからアプリケーションにサインインするユーザーに使用されます。
* **忘れた**
  * In the event that you no longer want to remember or track a device, you can use the `Amplify.Auth.forgetDevice()` API to remove this device from being both remembered and tracked.

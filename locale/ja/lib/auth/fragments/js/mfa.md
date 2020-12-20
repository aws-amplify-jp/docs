MFA (Multi-factor認証) は、認証方法を追加し、ユーザー名(またはエイリアス)とパスワードのみに依存しないことで、アプリケーションのセキュリティを強化します。 AWS AmplifyはAmazon Cognitoを使用してMFAを提供します。 Amazon CognitoでMFAを設定する方法については、 [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html) を参照してください。

Amazon CognitoでMFAを有効にすると、アプリをMFAと連携させることができます。

## Setup TOTP

TOTP (時間ベースのワンタイムパスワード) ユーザー名とパスワードが確認された後、時間ベースのワンタイム(TOTP)パスワードを使用して認証を完了するようアプリのユーザーに求められます。

アプリでユーザーのTOTPを設定できます：

```javascript
import { Auth } from 'aws-amplify';

// To setup TOTP, first you need to get a `authorization code` from Amazon Cognito
// `user` is the current Authenticated user
Auth.setupTOTP(user).then((code) => {
    // You can directly display the `code` to the user or convert it to a QR code to be scanned.
    // E.g., use following code sample to render a QR code with `qrcode.react` component:  
    //      import QRCode from 'qrcode.react';
    //      const str = "otpauth://totp/AWSCognito:"+ username + "?secret=" + code + "&issuer=" + issuer;
    //      <QRCode value={str}/>
});

// ...

// Then you will have your TOTP account in your TOTP-generating app (like Google Authenticator)
// Use the generated one-time password to verify the setup
Auth.verifyTotpToken(user, challengeAnswer).then(() => {

    // don't forget to set TOTP as the preferred MFA method
    Auth.setPreferredMFA(user, 'TOTP');
    // ...
}).catch( e => {
    // Token is not verified
});
```

## MFAタイプの設定

Amazon Cognitoでサポートされている複数のMFAタイプです。あなたのコードで優先メソッドを設定できます。

```javascript
import { Auth } from 'aws-amplify';

// You can select preferred mfa type, for example:
// Select TOTP as preferred
Auth.setPreferredMFA(user, 'TOTP').then((data) => {
    console.log(data);
    // ...
}).catch(e => {});

// Select SMS as preferred
Auth.setPreferredMFA(user, 'SMS');

// Select no-mfa
Auth.setPreferredMFA(user, 'NOMFA');
```

## 現在の優先MFAタイプを取得

コード内で現在推奨されているMFAタイプを入手できます。
```javascript
import { Auth } from 'aws-amplify';

// Will retrieve the current mfa type from cache
Auth.getPreferredMFA(user,{
    // Optional, by default is false. 
    // If set to true, it will get the MFA type from server side instead of from local cache.
    bypassCache: false 
}).then((data) => {
    console.log('Current preferred MFA type is: ' + data);
})
```

## ユーザーがMFAタイプを選択できるようにします

複数のMFAタイプを使用する場合は、アプリユーザーに希望する認証方法を選択させることができます。 `SelectMFAType` UI コンポーネント。これは、 `aws-amplify-react` パッケージで提供されており、利用可能なMFAタイプのリストをレンダリングします。

```javascript
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { SelectMFAType } from 'aws-amplify-react';

Amplify.configure(awsconfig);

// Please have at least TWO types
// Please make sure you set it properly according to your Cognito User pool
const MFATypes = {
    SMS: true, // if SMS enabled in your user pool
    TOTP: true, // if TOTP enabled in your user pool
    Optional: true, // if MFA is set to optional in your user pool
}

class App extends Component {
    // ...
    render() {
        return (
            // ...
            <SelectMFAType authData={this.props.authData} MFATypes={MFATypes}>
        )
    }
}

export default withAuthenticator(App, true);
```

## 高度な使用事例

### カスタム認証チャレンジでサインイン

ユーザー名とパスワードでサインインする場合は、直接サインインするか、認証を受ける前にいくつかのチャレンジに合格するよう求められます。

The `user` object returned from `Auth.signIn` will contain `challengeName` and `challengeParam` if the user needs to pass those challenges. You can call corresponding functions based on those two parameters.

チャレンジ名:

* `SMS_MFA`: ユーザーは SMS メッセージから受信したコードを入力する必要があります。 `Auth.confirmSignin` でコードを送信できます。
* `SOFTWARE_TOKEN_MFA`: ユーザーは OTP(1 回限りのパスワード)を入力する必要があります。 `Auth.confirmSignIn` でコードを送信できます。
* `NEW_PASSWORD_REQUIRED`: This happens when the user account is created through the Cognito console. The user needs to input the new password and required attributes. You can submit those data by `Auth.completeNewPassword`.
* `MFA_SETUP`: This happens when the MFA method is TOTP(the one time password) which requires the user to go through some steps to generate those passwords. You can start the setup process by `Auth.setupTOTP`.

以下のコードはデモ用にのみ使用されます。

```javascript
import { Auth } from 'aws-amplify';

async function signIn() {
    try {
        const user = await Auth.signIn(username, password);
        if (user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // You need to get the code from the UI inputs
            // and then trigger the following function with a button click
            const code = getCodeFromUserInput();
            // If MFA is enabled, sign-in should be confirmed with the confirmation code
            const loggedUser = await Auth.confirmSignIn(
                user,   // Return object from Auth.signIn()
                code,   // Confirmation code  
                mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
            );
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // You need to get the new password and required attributes from the UI inputs
            // and then trigger the following function with a button click
            // For example, the email and phone_number are required attributes
            const {username, email, phone_number} = getInfoFromUserInput();
            const loggedUser = await Auth.completeNewPassword(
                user,              // the Cognito User Object
                newPassword,       // the new password
                // OPTIONAL, the required attributes
                {
                    email,
                    phone_number,
                }
            );
        } else if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
        } else {
            // The user directly signs in
            console.log(user);
        }
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            console.log(err);
        }
    }
}
```

### Lambda Trigger のカスタムバリデーションデータでサインイン

PreAuthentication Lambdaトリガーに送信されるユーザー名、パスワード、およびvalidationDataを持つオブジェクトを渡すこともできます。

```js
try {
    const user = await Auth.signIn({
        username, // Required, the username
        password, // Optional, the password
        validationData, // Optional, an arbitrary key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication
    });
    console.log('user is signed in!', user);
} catch (error) {
    console.log('error signing in:' , error);
}
```

### Cognitoユーザープールでメールの一意性を強制する

When your Cognito User Pool sign-in options are set to "*Username*", and "*Also allow sign in with verified email address*", the *signUp()* method creates a new user account every time it's called, without validating email uniqueness. In this case you will end up having multiple user pool identities and all previously created accounts will have their *email_verified* attribute changed to *false*.

To enforce Cognito User Pool signups with a unique email, you need to change your User Pool's *Attributes* setting in [Amazon Cognito console](https://console.aws.amazon.com/cognito) as the following:

![カップ](~/images/cognito_user_pool_settings.png)
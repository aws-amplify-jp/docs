ターミナルで、プロジェクトに移動し、 `amplify add auth`を実行してください。 を選択し、以下のオプションを選択します(最後の手順はFacebookに固有ですが、他のプロバイダーには似ています)。

```terminal
? Do you want to use the default authentication and security configuration? 
    `Default configuration with Social Provider (Federation)`
? How do you want users to be able to sign in? 
    `Username`
? Do you want to configure advanced settings? 
    `No, I am done.`
? What domain name prefix you want us to create for you? 
    `(default)`
? Enter your redirect signin URI: 
    `myapp://callback/`
? Do you want to add another redirect signin URI 
    `No`
? Enter your redirect signout URI: 
    `myapp://signout/`
? Do you want to add another redirect signout URI 
    `No`
? Select the social providers you want to configure for your user pool: 
    `<choose your provider and follow the prompts to input the proper tokens>`
```
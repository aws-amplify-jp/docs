ターミナルで、プロジェクトに移動し、 `amplify add auth`を実行し、次のオプションを選択します。


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
    `myapp://`
? Do you want to add another redirect signin URI 
    `No`
? Enter your redirect signout URI: 
    `myapp://`
? Do you want to add another redirect signout URI 
    `No`
? Select the social providers you want to configure for your user pool: 
    `<hit enter>`
```

終了したら、 `amplify push` を実行して変更を公開します。

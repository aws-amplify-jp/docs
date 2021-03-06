バックエンドで api リソースのプロビジョニングを開始するには、プロジェクト ディレクトリに移動し、 **コマンド** を実行します。

```bash
増幅して api を追加
```

プロンプトが表示されたら以下を入力します:
```console
? Please select from one of the below mentioned services: 
    `REST`
? Provide a friendly name for your resource to be used as a label for this category in the project: 
    `api`
? Provide a path (e.g., /book/{isbn}): 
    `/todo`
? Choose a Lambda source 
    `Create a new Lambda function`
? Provide a friendly name for your resource to be used as a label for this category in the project: 
    `todo`
? Provide the AWS Lambda function name: 
    `todo`
? Choose the function runtime that you want to use: 
    `NodeJS`
? Choose the function template that you want to use: 
    `Serverless ExpressJS function (Integration with API Gateway)`
? Do you want to access other resources created in this project from your Lambda function? 
    `No`
? Do you want to invoke this function on a recurring schedule? 
    `No`
? Do you want to edit the local lambda function now?
    `No`
? Restrict API access 
    `No`
? Do you want to add another path? 
    `No`
```

クラウドに変更をプッシュするには、 **コマンド** を実行します。

```bash
push を増幅する
```

Upon completion, `amplifyconfiguration.json` should be updated to reference provisioned backend storage resources.  Note that these files should already be a part of your project if you followed the [Project setup walkthrough](~/lib/project-setup/create-application.md).

<amplify-callout warning>

The current version of the Amplify CLI will create classes intended for use with the AWS SDK for Android in your project. If you see compilation errors relating to `com.amazonaws.mobileconnectors.apigateway.annotation`, please delete the directory with the name of your API in Android Studio.

</amplify-callout>

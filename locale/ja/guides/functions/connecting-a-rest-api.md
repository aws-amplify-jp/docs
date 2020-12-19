---
title: Lambda関数へのREST APIの接続
description: REST API をLambda 関数に接続する方法
---

このガイドでは、REST APIを既存のLambda関数に接続する方法を学びます。

始めるには、新しいAPIを作成してください。

```sh
amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: myapi
? Provide a path (e.g., /book/{isbn}): /hello
? Choose a Lambda source: Use a Lambda function already added in the current Amplify project
? Choose the Lambda function to invoke by this path: <your-function-name>
? Restrict API access: N
? Do you want to add another path: N
```

APIのデプロイ:

```sh
push を増幅する
```

APIを使用できるようになりました！

クライアント側アプリケーションからAPIを操作する方法の詳細については、こちらのドキュメント [をご覧ください](~/lib/restapi/getting-started.md)
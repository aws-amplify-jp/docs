---
title: 概要
description: AmplifyコンソールまたはAmazon CloudFront/S3を使用してアプリをデプロイし、ホストします。 Amplifyコンソールは、インスタントキャッシュの無効化やアトミックデプロイなどの機能を備えた、完全に管理されたホスティングを提供します。
---

AmplifyコンソールまたはAmazon CloudFront/S3を使用してアプリをデプロイし、ホストします。 Amplifyコンソールは、インスタントキャッシュの無効化やアトミックデプロイなどの機能を備えた、完全に管理されたホスティングを提供します。 CDNとホスティングバケットの設定をより詳細にコントロールするには、CloudFrontとS3を使用してください。

## ワークフロー

- `amplify add hosting`<br/> これは、ホスティングリソースをバックエンドに追加します。 このコマンドはまず、DEVまたはPRODのいずれかの環境選択を求めます。 完了すると、リソースのCloudFormationテンプレートがanplify/backend/hostingディレクトリに配置されます。 <br/><br/>
- `configure configure hosting`<br/> このコマンドは、ホスティングで使用されるリソースの異なるセクションを設定するための手順を説明します。 S3、CloudFront、およびパブリッシュの無視を含む。 詳細は以下をご覧ください。<br/><br/>
- `amplify publish`<br/> `amplify publish` コマンドは、バックエンドとプロジェクトのフロントエンドの両方をビルドして公開するように設計されています。 現在の実装では、フロントエンドの公開機能は静的なWebホスティング用のJavaScriptプロジェクトでのみ使用できます。<br/><br/>
- `amplify remove hosting`<br/> This removes the hosting resources locally from the backend. On your next `amplify push` the provisioned hosting resources will get removed from the cloud. <br/><br/>

## AWS Amplifyコンソールの使用

<amplify-callout>

AWS Amplifyコンソールは、Amplifyウェブアプリ用の継続的なデプロイメントとホスティングサービスです。 [詳細はこちら](https://console.amplify.aws)。

</amplify-callout>

The AWS Amplify Console provides a Git-based workflow for building, deploying, and hosting your Amplify web app — both the frontend and backend — from source control. Once you connect a feature branch, all code commits are automatically deployed to an `amplifyapp.com` subdomain or your custom domain. [Get Started](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)

AmplifyアプリのホスティングオプションとしてAmplifyコンソールを追加する際に発生するコンセプトは以下のとおりです。

### デプロイの種類

`増幅してホスティング` フローでAmplifyアプリをホスティングするためにAmplifyコンソールを選択した場合。 フローの一部として選択できる2つの段階があります

- **Continuous deployment** allows you to publish changes on every code commit by connecting your GitHub, Bitbucket, GitLab, or AWS CodeCommit repositories. Selecting this option would open up your AWS Amplify console where you can connect your Git  repository. Once your repository is connected, run `git push` to deploy changes to both your backend and frontend in a single workflow.
- **Manual deployment** allows you to publish your web app to the Amplify Console without connecting a Git provider. If you select this option, you will have to run the `amplify publish` command every time you would like to see your changes reflected in the cloud.

デプロイタイプを変更するには `増幅してホスティングを削除` し、 `ホスティングを追加する` を実行して、新しい優先デプロイタイプを選択する必要があります。

### カスタムドメイン、リダイレクト、その他

The `amplify configure hosting` command for the Amplify Console option, opens up the AWS Amplify Console browser tab for you where you can configure settings such as rewrite/redirect URL's, password protection, custom domain. These settings do not get replicated or cloned between environments and you'd have to configure them on a per-environment basis.

**メモ**:

Amplify Consoleは自動的にキャッシュの無効化を処理し、追加の設定やコマンド/コマンドラインパラメータは必要ありません。

If you start from the Amplify Console's home page and connect your project's code repository (by clicking `Connect app` button), the frontend environment is created for your project once the workflow successfully completes. After setting up hosting in the Amplify Console, you cannot run the `amplify hosting add` command from your local installation of the Amplify CLI. To disable hosting, please visit the Amplify Console and disconnect the branch from the `App settings > General` page.

If you're hosting a Single Page Web App (SPA) with routing such as [`react-router`](https://reactrouter.com/web/guides/quick-start), you'll need to add a [redirect](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) in the Amplify console.

![SPAのリダイレクト](~/images/hosting/spa-redirect.png)

## Amazon S3とAmazon Cloudfront

Amplify CLI は、Amazon S3 と Amazon Cloudfront を使用して静的なウェブサイトを直接管理するオプションも提供します。 以下は、AmplifyアプリのホスティングオプションとしてS3 & Cloudfrontを追加するときに発生する概念です。

### ステージ
If you select Amazon S3 & Amazon Cloudfront for hosting your Amplify App in the `amplify add hosting` flow, there are two stages you can select from as a part of the flow:
- DEV: S3 静的ウェブホスティング
- PROD: S3とCloudFront

場合によっては、15分以上かかる場合があり、グローバルなCDNフットプリント全体にCloudFrontディストリビューションを提供するのに時間がかかる場合があります。 したがって、Amplify CLI はアプリケーションのプロトタイピング時にのみ、S3 静的サイトを備えた DEV 構成を提供します。 および本番環境にデプロイする準備ができたら、PROD 構成を使用します。 S3を使用したDEVステージに注意してください。 静的サイトではHTTPSをサポートしていないため、 **アプリのプロトタイピングにのみお勧めします**。

Amazon CloudFront service can also be added or removed in your Amplify project later on top of your Amazon S3 bucket by using the `amplify hosting configure` command. Note that if the hosting S3 bucket is newly created in regions other than us-east-1, you might get the `HTTP 307 Temporary Redirect` error in the beginning when you access your published application through CloudFront. This is because CloudFront forwards requests to the default S3 endpoint (s3.amazonaws.com), which is in the us-east-1 region, and it can take up to 24 hours for the new hosting bucket name to propagate globally.

Amazon S3とAmazon CloudFrontの詳細については。 [S3 static web hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) [CloudFront DEV ガイド](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

### キャッシュの無効化
If you select Amazon S3 & Amazon Cloudfront for hosting your Amplify App in the `amplify add hosting` flow, the frontend build artifacts will be uploaded to the S3 hosting bucket, and then if Amazon CloudFront is enabled along with it, the `amplify publish` command executed with the `--invalidateCloudFront` or `-c` flag will send an invalidation request to the Amazon CloudFront service to invalidate its cache.

### 詳細設定
`増幅設定ホスティング` コマンドは、Amazon S3 & Amazon Cloudfrontを介してホスティングするときに使用されるリソースの異なるセクションを設定するための手順を説明します。 設定可能なオプションは次のとおりです。
- `Website`<br/> Configures the S3 bucket for static web hosting. You can set the index doc and error doc references by configuring this option. Both are set to be `index.html` by default.<br/><br/>
- `CloudFront`<br/> CloudFrontコンテンツ配信ネットワーク(CDN)を設定します。 デフォルトのキャッシュ動作に対してTTL(Time To Live)を設定し、カスタムエラー応答を設定できます。<br/><br/>
- `公開`<br/> 公開無視パターンを設定します。 publish コマンドの git ベースのプロジェクトのファイルを無視します。 publish コマンドは、パターンに一致する名前を持つ配布フォルダ内のこれらのディレクトリとファイルのセットを無視します。

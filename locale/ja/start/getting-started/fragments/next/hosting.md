Next.jsでAmplifyアプリの構築に成功しました！何かを構築したので、ウェブにデプロイしましょう！

> **Note**: Amplify Console is adding support for Server-Side Rendering (SSR). [Vote & comment on this issue](https://github.com/aws-amplify/amplify-console/issues/412) to show your support!

## [サーバーレス Next.js コンポーネント](https://github.com/serverless-nextjs/serverless-next.js) を使用する

> _詳細については、 [Serverless Next.js コンポーネントの発表](https://www.serverless.com/blog/serverless-nextjs) を参照してください。_

### オプション1:ビデオガイドを見る

次への展開方法については、以下のビデオをご覧ください。 s サーバレスフレームワークを使用するか、次のセクションにスキップしてステップバイステップの指示に従ってください。 <iframe src="https://www.youtube-nocookie.com/embed/2SwlDpfGkXM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

### オプション 2: 指示に従ってください

以下の内容で __serverless.yml__ を作成します。

```yaml
# serverless.yml
nextanmped:
  component: "@sls-next/serverless-component@1.17.0"
```

最後に、次のコマンドでデプロイします。

```bash
npx serverless
```

アプリケーションへのリンクが出力に表示されます。

```console
  nextアンプ:
    appUrl: https://••••••••••••••.cloudfront.net
    bucketName: XXXXXXXX-XXXXXXXXXXX
    distributionId: XXXXXXXXXXXXXXXXXXX
```

> **Note**: Your CloudFront Distribution may take several minutes to go from "In Progress" to "Active".  Visit your [CloudFront Console](https://console.aws.amazon.com/cloudfront/home) to monitor progress.

👏 おめでとうございます。あなたのアプリはオンラインです！

アプリを削除するには、次の手順を実行します。

```bash
npx サーバーレス削除
```

Amplifyで初めてのアプリを構築しました！何かを構築したので、AmplifyコンソールでWebにデプロイしましょう！

## アプリにホスティングを追加
Webアプリを手動でデプロイするか、自動連続デプロイメントを設定することができます。 このガイドでは、静的Webアプリを手動でデプロイしてホストし、他の人とすばやく共有する方法について説明します。 継続的な展開について知りたい場合は、 [このガイド](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html#standard) に従ってください。

プロジェクトのルートから、次のコマンドを実行し、 **太字オプション**を選択します。
```bash
amplify add hosting
```

```console
? 実行するプラグインモジュールを選択します: # Amplify コンソールでホスティング(カスタムドメインで管理されたホスティング、継続的デプロイメント)
? タイプを選択してください: # 手動デプロイ
```

## アプリを公開

アプリを公開するには、次のコマンドを実行します。

```bash
amplify publish
```

👏 おめでとうございます。あなたのアプリはオンラインです！

![画像](~/images/browser-published.png)

After publishing, your terminal will display your app URL hosted on a `amplifyapp.com` domain. Whenever you have additional changes to publish, just re-run the `amplify publish` command.

If you get an "AccessDenied" error within an XML document, ensure that `DistributionDir` is set to the correct directory in `amplify/.config/project-config.json` and then re-run `amplify publish`

Amplifyコンソールでアプリとホスティング設定を表示するには、 `anplify console` コマンドを実行します。

---
title: カスタムドメイン
description: カスタムドメインの管理者UIにアクセス
---

If your app is set up to use the Amplify Console's web hosting features, you can access the Admin UI with the custom domain for your app's frontend. For example, if you host your app at `https://example.com`, you can set up a friendly redirect to the Admin UI for the app at a domain address such as `https://example.com/amplify/adminui`.

カスタムドメインを接続すると、サードパーティの DNS プロバイダで DNS 設定を更新するプロセスが異なります。 カスタムドメインの接続の詳細については、 [カスタムドメインの設定](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html) を参照してください。 *AWS Amplify Console User Guide*. このトピックには、GoDaddy、Google Domains、Amazon Route 53でDNS設定を更新する手順が含まれています。

## Admin UI のカスタムドメインアクセスを設定するには
1. AWS管理コンソールにサインインし、AWS Amplifyを開きます。
2. Admin UI アクセスのためのカスタムドメインに接続するアプリを選択します。
3. ナビゲーション ウィンドウで、 **アプリ 設定**、 **ドメイン 管理** を選択します。
4. **Domain Management** ページで、 **Add domain** を選択します。
5. **Add domain**, for **Domain**, enter your root domain, then choose **Configure domain**.
6. At the bottom of the **Add domain** page, select the **Set up redirects for custom domain to point to admin UI** checkbox.
7. DNSプロバイダーでドメインのDNS管理設定を更新します。 ドメインの所有権と第三者ドメインのDNS伝播の検証には最大48時間かかることに注意してください。

After your app is successfully connected to your custom domain, you can access the Admin UI at your domain address with `/amplify/staging` appended. For example, if your app's domain is `https://example.com`, by default you can access the Admin UI at `https://example.com/amplify/staging`. You can also customize the domain address with a custom redirect rule.

## 管理者 UI アクセス用のリダイレクトルールを追加するには
1. AWS管理コンソールにサインインし、AWS Amplifyを開きます。
2. Admin UI アクセスのためにリダイレクト ルールを追加するアプリを選択します。
3. ナビゲーション ウィンドウで、 **アプリ 設定**、 **管理者 UI 管理** を選択します。
4. **ドメイン管理** セクションには、Admin UI のリダイレクト ルールが表示されます。
5. **管理** を選択します。
6. Choose **Add redirect rule**, and then do the following:
  * **ソース**の場合、カスタムリダイレクトルールを入力します。たとえば、 `/anplify/adminui` などです。
  * **ターゲット**の場合、管理UIを開くバックエンド環境を選択します。たとえば、 `ステージ` です。
7. **保存** を選択します。

In this example, if an app is hosted at `https://example.com`, the Admin UI for the `staging` backend is available at `https://example.com/amplify/adminui`.


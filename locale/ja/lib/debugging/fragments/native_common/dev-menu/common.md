アプリの **デバッグ** ビルドを実行すると、情報にアクセスし、ログを表示できます。 そして、アプリケーションから直接開発者メニューからAmplifyのGitHubの課題を提出してください。 開発者メニューからGitHubの課題を提出することで、課題に関する重要な情報(デバイスと環境情報)が自動的に課題説明に追加されます。 Amplifyチームメンバーが問題の解決をより良く支援できるようにします。

<docs-filter platform="ios">

![Amplify iOS Developer Menu](~/images/debugging/iosDevMenu.png)

</docs-filter>

<docs-filter platform="android">

![Amplify Android Developer Menu](~/images/debugging/androidDevMenu.png)

</docs-filter>

<amplify-callout warning>

開発者メニューは **本番** アプリビルドで無効になっています。

</amplify-callout>

## セットアップ

<inline-fragment platform="ios" src="~/lib/debugging/fragments/ios/dev-menu/setup.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/debugging/fragments/android/dev-menu/setup.md"></inline-fragment>

## アクセスと利用状況

<inline-fragment platform="ios" src="~/lib/debugging/fragments/ios/dev-menu/usage.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/debugging/fragments/android/dev-menu/usage.md"></inline-fragment>

開発者メニューには次のものがあります。

* **環境情報** - アプリや開発環境情報で使用されているAmplifyプラグインのバージョンを表示します。
* **デバイス情報** - アプリケーションの実行に使用しているデバイスに関する情報を表示します。
* **Logs** - Amplifyロガーによって生成されたログを表示し、検索します。
* **GitHub Issue をファイルする** - 問題の説明を入力すると、Issue レポートが生成されます。 このレポートには、課題の説明、環境情報、デバイス情報が含まれています。 開発者メニュー内で、この課題レポートをコピーしたり、直接 GitHub に問題を提出することができます。 課題本文には、前述の情報が事前に入力されます。 開発者メニューを使って GitHub の問題を提出する場合は、問題を提出する前に問題情報を確認することができます。
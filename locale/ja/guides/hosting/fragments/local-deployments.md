このガイドでは、Amplifyホスティングを使用してローカルAmplifyプロジェクトから静的サイトをホストする方法を説明します。

この例では、React アプリケーションをデプロイしますが、以下のタイプのプロジェクトやフレームワークを使用することもできます。

1. 静的HTML
2. Vue
3. 角度
4. Ionic
5. Gatsby

## 1. 新しいウェブアプリを作成し、ディレクトリに変更

```sh
npx create-react-app amplifyapp
cd anplifyapp
```

## 2. Amplifyプロジェクトを初期化

```sh
amplify init

# Follow the steps to give the project a name, environment name, and set the default text editor.
# Accept defaults for everything else and choose your AWS Profile.
```

## 3. ホスティングを追加

```sh
amplify add hosting

? 実行するプラグインモジュールを選択します: Ampliify Console でホスティングする
? タイプを選択します。
```

## 4. アプリをデプロイする

これでアプリがデプロイできるようになりました。これを行うには、 `publish` コマンドを実行します。
```sh
amplify publish
```

## 5. Amplifyコンソールで表示

Amplifyコンソールでいつでもプロジェクトを表示するには、 `コンソール` コマンドを実行します。

```sh
増幅コンソール
```
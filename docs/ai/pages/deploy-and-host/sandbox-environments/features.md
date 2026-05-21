---
title: "サンドボックス機能"
section: "deploy-and-host/sandbox-environments"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-03-25T17:56:34.000Z"
url: "https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/"
---

サンドボックス環境には、シークレット管理、複数サンドボックスのデプロイ、設定生成、クライアントコード生成など、Amplifyアプリの追加機能が含まれています。

## サンドボックスでシークレットを保護する

> **Info:** サンドボックスで設定したシークレットはAmplifyコンソールに表示されません。AWS Systems Manager (SSM) パラメータストアコンソールで確認できます。

Amplify Gen 2は、APIキーやデータベース認証情報などの機密データを管理するための安全なシークレットストレージを提供します。シークレットは環境変数に似ていますが、暗号化されたAWS Systems Manager パラメータストアのキーと値のペアです。シークレットは`/amplify`プレフィックスの下のAWSパラメータストアに保存されます。

### シークレットを設定する

次のコマンドを使用して、サンドボックス環境にシークレットを追加できます:

```bash
npx ampx sandbox secret set foo
? Enter secret value: ###
Done!

npx ampx sandbox secret set bar
? Enter secret value: ###
Done!
```

これらのコマンドの実行後、サンドボックスには`foo`と`bar`という2つのシークレットが存在します。

### シークレットを一覧表示する

次のコマンドを使用して、サンドボックス環境で利用可能なすべてのシークレット名を一覧表示できます:

```bash
npx ampx sandbox secret list
 - foo
 - bar
```

### シークレットを取得する

> **Warning:** **注意:** このコマンドはシークレット値をプレーンテキストでターミナルに出力します。ターミナルログが保存される可能性がある場所（CI/CDジョブなど）でこのコマンドを使用しないでください。

シークレットの値を表示するには、次のコマンドを実行します。

```bash
npx ampx sandbox secret get foo
name: foo
version: 1
value: abc123
lastUpdated: Mon Nov 13 2023 22:19:12 GMT-0800 (Pacific Standard Time)
```

### シークレットを削除する

サンドボックスからシークレットを削除するには、ターミナルで次のコマンドを実行します:

```bash
npx ampx sandbox secret remove foo
```

### すべてのシークレットを削除する

サンドボックスからすべてのシークレットを削除するには、ターミナルで次のコマンドを実行します:

```bash
npx ampx sandbox secret remove --all
```

### シークレットを参照する

シークレットを設定した後、バックエンド定義で`secret()`関数を使用してシークレットを参照できます。次の例は、アプリでソーシャルサインインと認証を設定する方法を示しています。環境に応じて、Amplifyは自動的に正しいシークレット値を読み込みます。

```ts
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      facebook: {
        // highlight-start
        clientId: secret('foo'),
        clientSecret: secret('bar')
        // highlight-end
      }
    }
  }
});
```

`secret()`関数はシークレットの値を取得しません。バックエンド定義にシークレット値への参照を配置します。シークレット値はバックエンドのデプロイ時にのみ解決されます。

`secret()`関数は、バックエンド定義内の特定の場所でのみ使用できます。たとえば、[認証プロバイダーの設定](/[platform]/build-a-backend/auth/concepts/external-identity-providers)と[関数シークレット](/[platform]/build-a-backend/functions/environment-variables-and-secrets/#accessing-environment-variables)です。

> **Info:** Amplifyホスティングを介して`secret()`参照を使用するバックエンドをデプロイするには、シークレット値を[Amplifyアプリまたはブランチの設定](/[platform]/deploy-and-host/fullstack-branching/secrets-and-vars)する必要があります。

## 複数のAWSプロファイルを操作する

ローカルに複数のAWSプロファイルが設定されている場合があります。`ampx sandbox secret`コマンドを実行するには、`--profile`フラグを使用して特定のプロファイルにデプロイします。たとえば、ローカルに2つのAWSプロファイル（`default`と`work`）が設定されている場合、`work`プロファイルのサンドボックスにシークレットを追加するには、ターミナルで次のコマンドを実行します:

```bash
npx ampx sandbox secret set foo --profile work
```

## 複数の名前付きサンドボックスを操作する

> **Info:** アプリごとに複数のサンドボックスをプロビジョニングすることは可能ですが、推奨されません。複数の一時的な環境を1人の開発者が管理すると複雑になります。複数のサンドボックスでは、どのコードバージョンまたは設定がどこにデプロイされているかを追跡するのが難しくなります。開発者ごとに1つのサンドボックスを使用することで、ワークフローをシンプルに保つことができます。

異なる機能またはテスト環境を異なるサンドボックスで利用できるようにしたい場合、複数のサンドボックスを作成できます。デフォルトでは、サンドボックスはローカルマシンのユーザー名に基づいて名付けられます。この名前をオーバーライドするには、`--identifier`オプションを使用します:

```bash
npx ampx sandbox --identifier feature1sandbox
```

これにより、`feature1sandbox`という名前のサンドボックスが起動します。

デプロイが完了したら、サンドボックスを終了し、ターミナルで次のコマンドを実行します:

```bash
npx ampx sandbox --identifier feature2sandbox
```

デプロイが成功したら、`feature1sandbox`と`feature2sandbox`という2つのサンドボックスが作成されます。これらを切り替えることができますが、一度に実行できるのは1つだけです。

### 名前付きサンドボックスでのシークレット管理

複数のサンドボックスを操作する場合、シークレットは各サンドボックスに設定する必要があります。すべての`sandbox secret`コマンドは`--identifier`引数を受け入れて、名前付きサンドボックスのシークレットを管理します。たとえば、`feature1sandbox`にシークレットを追加するには:

```bash
npx ampx sandbox --identifier feature1sandbox secret set baz
```

## 関数ログをストリーミングする

Amplifyは、関数ログをターミナルまたはファイルに直接ストリーミングする機能を提供します。[関数ログストリーミングの詳細を確認](/[platform]/build-a-backend/functions/streaming-logs/)してください。

## クライアント設定を生成する

クライアント設定（`amplify_outputs.json`ファイル）には、環境固有のAWSリソースとやり取りするための設定文字列が含まれています。Amplifyクライアントライブラリがライブラリ APIを使用してバックエンドリソースに接続するには、クライアント設定が必要です。デフォルトでは、クラウドサンドボックスはプロジェクトのルート（例：`@/amplify_outputs.json`）にクライアント設定ファイルを生成します。ファイルを別のパス（モノレポやAndroidアプリなど）に配置したい場合は、ターミナルで次のコマンドを実行します:

<!-- Platform: angular,javascript,nextjs,react,react-native,vue -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-out-dir ./path/to/config --outputs-format ["json", "dart"]
```

または、ブランチ環境の設定を生成してテストしたい場合は、ターミナルで次のコマンドを実行します。

```bash
npx ampx generate outputs --app-id <your-amplify-app-id> --branch main --format ["json", "dart"] --out-dir ./path/to/config
```
<!-- /Platform -->

<!-- Platform: flutter -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-format dart --outputs-out-dir lib
```
<!-- /Platform -->
<!-- Platform: android -->
> **Warning:** app/src/main/res ディレクトリに "raw" フォルダが存在しない場合は、必ず追加してください。

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-format json-mobile --outputs-out-dir app/src/main/res/raw
```
<!-- /Platform -->

<!-- Platform: swift -->
```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox --outputs-format json-mobile
```

サンドボックス環境が実行されている場合、アプリケーション用の設定ファイルも生成します。ただし、Xcodeはそれらを認識できません。ファイルを認識するには、生成されたファイルをプロジェクトにドラッグアンドドロップする必要があります。

<!-- /Platform -->

### デプロイメント環境

または、ブランチ環境の設定を生成してテストしたい場合は、ターミナルで次のコマンドを実行できます:

<!-- Platform: android,angular,flutter,javascript,nextjs,react,react-native,swift,vue -->
WebとReact Nativeの場合、デフォルトの形式と出力ディレクトリで設定を生成します。

```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main
```
<!-- /Platform -->
<!-- Platform: flutter -->
```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main --format dart --out-dir lib
```
<!-- /Platform -->
<!-- Platform: android -->
> **Warning:** app/src/main/res ディレクトリに "raw" フォルダが存在しない場合は、必ず追加してください。

```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --branch main --out-dir app/src/main/res/raw
```
<!-- /Platform -->
<!-- Platform: swift -->
```bash title="Terminal" showLineNumbers={false}
npx ampx generate outputs --app-id <app-id> --format json-mobile
```

サンドボックス環境が実行されている場合、フロントエンドアプリケーション用のバックエンド出力ファイルが生成されます。ただし、Xcodeはそれらを認識できません。ファイルを認識するには、生成されたファイルをプロジェクトにドラッグアンドドロップする必要があります。

<!-- /Platform -->

## クライアントコード生成を生成する

> **Info:** Amplify Gen 2は、Amplify Gen 1とは異なり、明示的なコード生成ステップを必要としないデータの完全に型指定されたエクスペリエンスを導入しています。モバイルアプリを構築している場合またはGen 1の要件がある場合は、このコマンドが必要になります。

コード生成は、GraphQL APIのデータモデルを表すSwift（iOS）、Java（Android）、JavaScriptの本質的なコードを生成します。また、GraphQLステートメント（クエリ、ミューテーション、サブスクリプション）を生成できるため、手動でコーディングする必要がなくなります。

サンドボックスがデプロイを完了したら、ターミナルで次のコマンドを実行してニーズに固有のクライアントコードを生成できます:

```bash
npx ampx generate graphql-client-code
--format [choices: "modelgen", "graphql-codegen", "introspection"]
```

## サンドボックスを削除する

クラウドサンドボックス環境は複数の方法で削除できます:

1. Ctrl+Cでサンドボックスを終了し、リソースを削除することを選択します。
1. `npx ampx sandbox delete`または`npx ampx sandbox delete --name`を実行します。
1. Amplifyコンソールにアクセスして、[サンドボックスを削除](/[platform]/deploy-and-host/sandbox-environments/setup/#manage-sandbox-environments)します。

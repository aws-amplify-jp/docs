`aws-amplify-angular` パッケージは、Angularコンポーネントのセットであり、アプリケーションとAWS-Amplifyライブラリを統合するのに役立ちます。 Angular 5.0以上に対応しています。

<amplify-callout>

Angular 9 は、Angular UI Components の旧バージョンではサポートされていません。 Angular 9を使ってアプリをお使いの場合は、新しい [Angular UI Component package](~/ui/ui.md/q/framework/angular) をご覧ください。

</amplify-callout>

## インストール

Angular アプリに `aws-amplify` と `aws-amplify-angular` npm パッケージをインストールします。

```bash
npm install aws-amplify aws-amplify-angular 
```

### Angular 6-8 Support

現在、Angular(6+)の最新バージョンでは、以前のバージョンで提供されていた「global」または「プロセス」のシムは含まれていません。 以下を `polyfills.ts` ファイルに追加して再作成します。

```javascript
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
```

また、AWS Amplify Angular コンポーネントは Ivy をまだサポートしていないことに注意してください。

### セットアップ

Amplify CLI を使用してバックエンド設定を作成し、生成された設定ファイルをインポートします。

この例では、Amazon CognitoユーザプールとAmazon S3ストレージでの認証を有効にします。 これにより `aws-exports.js` の設定ファイルがプロジェクトの `src` ディレクトリの下に作成されます。

[Amplify CLI](~/cli/start/install.md) がインストールされていることを確認してください

```bash
増幅init
増幅して認証を追加
増幅してストレージを追加
プッシュを増幅する
```

[認証ガイド](~/lib/auth/getting-started.md) および [ストレージガイド](~/lib/storage/getting-started.md) をご覧ください。これらのカテゴリの有効化と構成についての詳細はこちらをご覧ください。

バックエンドを作成すると、 `amplify init` コマンドで指定した設定済みのソースディレクトリに設定ファイルが生成されます。

When working with underlying `aws-js-sdk`, the "node" package should be included in *types* compiler option. update your `src/tsconfig.app.json`:
```json
"compilerOptions": {
    "types" : ["node"]
}
```

## Amplify角度モジュールとAmplifyプロバイダのインポート

「aws-amplify-angular」パッケージでは、AngularプロバイダとしてAmplify-JSライブラリにアクセスできます。選択肢は2つあります:

1. Amplify JSライブラリ全体でプロバイダを構成する
2. Amplify JSライブラリのみを選択してプロバイダを構成します。

オプション1は、すべてのAmplifyJSモジュールを使用する場合や、バンドルサイズに関心がない場合に適しています。 オプション2は、バンドルサイズが懸念される場合に適切です。


### オプション 1: Amplify JSモジュールごとにAmplifyプロバイダを設定する

設定ファイルをインポートし、 `main.ts` に読み込む:

```javascript
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```


[app module](https://angular.io/guide/bootstrapping) `src/app/app.module.ts` で Amplify Module and Service:

```javascript
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

@NgModule({
  ...
  imports: [
    ...
    AmplifyAngularModule
  ],
  ...
  providers: [
    ...
    AmplifyService
  ]
  ...
});
```

### オプション2:指定されたAmplifyJSモジュールを使用してAmplifyプロバイダを構成する

設定ファイルをインポートし、 `main.ts` に読み込む:

```javascript
import Amplify from '@aws-amplify/core';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
```

[appモジュール](https://angular.io/guide/bootstrapping) `src/app/app.module.ts` では、Amplify Module、Service、Amplify Moduleヘルパーをインポートします。 さらに、Amplifyプロバイダ経由でアクセスしたい増幅モジュールをインポートします。

これらのモジュールはAmplifyModulesヘルパーに渡されます。

```javascript
import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import Interactions from '@aws-amplify/interactions';
import Storage from '@aws-amplify/storage';

@NgModule({
  ...
  imports: [
    ...
    AmplifyAngularModule
  ],
  ...
    providers: [
    {
      provide: AmplifyService,
      useFactory:  () => {
        return AmplifyModules({
          Auth,
          Storage,
          Interactions
        });
      }
    }
  ],
  ...
});
```

## Amplifyサービスの使用

`AmplifyService` は、AWS Amplifyコアカテゴリと、依存性注入とオブザーバーを通じて認証状態を提供します。

### 依存性注入の使用

*依存性インジェクション* で [AmplifyService](https://angular.io/guide/dependency-injection-in-action)を使用するには、アプリケーション内の任意のコンポーネントまたはサービスのコンストラクタに注入します。

```javascript
import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor( private amplifyService: AmplifyService ) {}

}
```

### カテゴリの使用

組み込みのサービスプロバイダからカテゴリにアクセスできます:

```javascript
import { Component } from '@angular/core';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private amplifyService:AmplifyService ) {

      /** now you can access category APIs:
       * this.amplifyService.auth();          // AWS Amplify Auth
       * this.amplifyService.analytics();     // AWS Amplify Analytics
       * this.amplifyService.storage();       // AWS Amplify Storage
       * this.amplifyService.api();           // AWS Amplify API
       * this.amplifyService.cache();         // AWS Amplify Cache
       * this.amplifyService.pubsub();        // AWS Amplify PubSub
       **/
  }

}
```

## Styles

aws-amplify-angular コンポーネントを使用するには、'@aws-amplify/ui' をインストールする必要があります。

デフォルトのスタイルを使用するには、styles.cssファイルに以下を追加してください: `@import '~aws-amplify-angular/Theme.css';`

*default styles.css* を上書きするカスタム <a href="https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-angular/theme.css" target="_blank">styles.css</a> をインポートすることで、コンポーネントにカスタムスタイルを使用できます。

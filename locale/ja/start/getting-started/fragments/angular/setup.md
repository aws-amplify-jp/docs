## 新しいAngularアプリを作成

新しいAngularアプリを起動するには、 [Angular CLI](https://github.com/angular/angular-cli) を使用してください。

```bash
npx -p @angular/cli ng new amplify-app

? Would you like to add Angular routing? Y
? Which stylesheet format would you like to use? (your preferred stylesheet provider)

cd amplify-app
```

### Angular 6+ Support

現在、Angular(6+)の最新バージョンには、以前のバージョンで提供されている「global」または「プロセス」のシムは含まれていません。 `src/polyfills.ts` ファイルに以下を追加して再作成します。

```javascript
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
```

## 新しいAmplifyバックエンドを作成

Angularアプリを起動しました。 今度は、アプリをサポートするために必要なバックエンドサービスを作成できるように、このアプリ用にAmplifyを設定しましょう。 プロジェクトのルートから、以下を実行します。

```bash
initを増幅する
```

Amplifyを初期化すると、アプリに関する情報が表示されます。 Angularの新しいバージョンの場合 Angularがプロジェクトをどのように構築するかを一致させるために、Distribution Directory Path を `dist` から `dist/amplify-app` に変更する必要があります。

```console
Enter a name for the project (amplifyapp)

# All AWS services you provision for your app are grouped into an "environment"
# A common naming convention is dev, staging, and production
Enter a name for the environment (dev)

# Sometimes the CLI will prompt you to edit a file, it will use this editor to open those files.
Choose your default editor

# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
Choose the type of app that you're building (javascript)

What JavaScript framework are you using (angular)

Source directory path (src)

Distribution directory path (dist)
Change from dist to dist/amplify-app

Build command (npm run-script build)

Start command (ng serve or npm start)

# This is the profile you created with the `amplify configure` command in the introduction step.
Do you want to use an AWS profile
```

新しいAmplifyプロジェクトを初期化すると、いくつかのことが起こります。

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as authentication, GraphQL API, storage, and set up authorization rules for the API. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- `.gitignore` ファイルを変更し、生成されたファイルを無視リストに追加します。
- AWS Amplifyコンソールで、 `amplifyコンソール`を実行することでアクセスできるクラウドプロジェクトが作成されます。 Consoleは、Amplifyカテゴリごとにプロビジョニングされたリソースへの深いリンクをバックエンド環境のリストを提供します。 最近のデプロイのステータスとバックエンドリソースのプロモーション、クローン、プル、削除方法に関する説明。

## Amplifyライブラリのインストール

`amplify-app` ディレクトリ内で、Amplify Angularライブラリをインストールしてアプリを実行します。

```bash
npm install --save aws-amplify @aws-amplify/ui-angular

npm start
```

The `@aws-amplify/ui-angular` package is a set of Angular components and an Angular provider which helps integrate your application with the AWS-Amplify library.  It supports Angular 5.0 and above.  It also includes a [supplemental module](#ionic-4-components) for Ionic-specific components.

<amplify-callout>

Angular CLI output warnings: if you see CommonJS or AMD dependencies optimization bailouts warnings using Angular +9 you can use this [gist](https://gist.github.com/gsans/8982c126c4fef668c094ff288f04241b) to remove them. More details about these [here](https://angular.io/guide/build#configuring-commonjs-dependencies).

</amplify-callout>

### Amplify Angular UI モジュールのインポート

**Amplify Angular UI Module** を `src/app/app.module.ts` に追加します:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* import AmplifyUIAngularModule  */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* configure app with AmplifyUIAngularModule */
    AmplifyUIAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

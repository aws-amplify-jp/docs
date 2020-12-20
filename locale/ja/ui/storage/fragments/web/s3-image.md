<inline-fragment src="~/ui/storage/fragments/web/installation.md"></inline-fragment>

## 使用法

<docs-filter framework="react">

```jsx
import React from "react";
import Amplify from "aws-amplify";
import {AmplifyS3Image} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const App = () => <AmplifyS3Image imgKey="example.png" />;
```

</docs-filter>

<docs-filter framework="angular">

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```html
<amplify-s3-image img-key="example.png"></amplify-s3-image>
```

</docs-filter>

<docs-filter framework="ionic">

_app.module.ts_

```js
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

import {AmplifyUIAngularModule} from "@aws-amplify/ui-angular";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```html
<amplify-s3-image img-key="example.png"></amplify-s3-image>
```

</docs-filter>

<docs-filter framework="vue">

_main.js_

```js
import Vue from "vue";
import App from "./App.vue";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

_App.vue_

```html
<template>
  <amplify-s3-image img-key="example.png" />
</template>
```

</docs-filter>

<ui-component-props tag="amplify-s3-image" prop-type="attr" use-table-headers></ui-component-props>

<ui-component-props tag="amplify-s3-image" prop-type="css" use-table-headers></ui-component-props>

```css
amplify-s3-image {
  --height: 200px;
  --width: 400px;
}
```

## ユースケース

### 保護されたアクセスレベルからファイルを取得する

S3 バケットから保護されたファイルは、所有者の `identityId` を使用して所有者以外の誰でもアクセスできます。

<docs-filter framework="react">

```jsx
const App = () => (
  <AmplifyS3Image
    level="protected"
    imgKey="example.png"
    identityId="us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX"
  />
);
```

</docs-filter>

<docs-filter framework="angular">

_app.component.html_

```html
<amplify-s3-image
  level="protected"
  img-key="example.png"
  identity-id="us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX"
></amplify-s3-image>
```

</docs-filter>

<docs-filter framework="ionic">

_app.component.html_

```html
<amplify-s3-image
  level="protected"
  img-key="example.png"
  identity-id="us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX"
></amplify-s3-image>
```

</docs-filter>

<docs-filter framework="vue">

_App.vue_

```html
<template>
  <amplify-s3-image
    level="protected"
    img-key="example.png"
    identity-id="us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX"
  />
</template>
```

</docs-filter>

## 移行

`aws-amplify-<framework>` ライブラリを最新の `@aws-amplify/ui- に使用してから移行するには、<framework>` ライブラリを以下の手順で使用します。

<inline-fragment src="~/ui/storage/fragments/web/installation-diff.md"></inline-fragment>

### 使用法

<docs-filter framework="react">

```diff
- import { S3Image } from 'aws-amplify-react';
+ import { AmplifyS3Image } from '@aws-amplify/ui-react';

const App = () => (

+ <AmplifyS3Image imgKey="example.png" />
- <S3Image imgKey="example.png" />

);
```

</docs-filter>

<docs-filter framework="angular">

_app.module.ts_

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
- import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
+ import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
- imports: [AmplifyAngularModule, BrowserModule],
+ imports: [AmplifyUIAngularModule, BrowserModule],
- providers: [AmplifyService],
+ providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```diff
+ <amplify-s3-image img-key="example.png"></amplify-s3-image>
- <s3-image img-key="example.png"></s3-image>
```

</docs-filter>

<docs-filter framework="ionic">

_app.module.ts_

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
- import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
+ import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
- imports: [AmplifyAngularModule, BrowserModule],
+ imports: [AmplifyUIAngularModule, BrowserModule],
- providers: [AmplifyService],
+ providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_app.component.html_

```diff
+ <amplify-s3-image img-key="example.png"></amplify-s3-image>
- <s3-image img-key="example.png"></s3-image>
```

</docs-filter>

<docs-filter framework="vue">

_main.ts_

```diff
import Vue from 'vue';
import App from "./App.vue";
- import Amplify, * as AmplifyModules from 'aws-amplify'
- import { AmplifyPlugin } from 'aws-amplify-vue'
+ import '@aws-amplify/ui-vue';
+ import Amplify from 'aws-amplify';
+ import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

new Vue({
  render: h => h(App),
}).$mount('#app');
```

_App.vue_

```diff
 <template>
- <s3-image img-key="example.png" />
+ <amplify-s3-image img-key="example.png" />
 </template>
```

</docs-filter>

`ピッカー` プロパティを有効にして `S3Image` を使用している場合は、 [`S3ImagePicker`](~/ui/storage/s3-image-picker.md) のドキュメントを参照してください。

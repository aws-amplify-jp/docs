[![npm version](https://badge.fury.io/js/aws-amplify-vue.svg)](https://badge.fury.io/js/aws-amplify-vue)

`aws-amplify-vue` パッケージは、VueアプリケーションとAWS-Amplifyライブラリを統合したVueコンポーネントのセットです。 パッケージはバージョン2.5以上のVueアプリケーションをサポートし、Vue 3.0 CLIを使用して作成されました。

## 設定

Vueアプリで、以下をインストールしてください。

```bash
npm i aws-amplify
npm i aws-amplify-vue
```

次にmain.jsを変更します。

```javascript
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

Vue.use(AmplifyPlugin, AmplifyModules)

// It's important that you instantiate the Vue instance after calling Vue.use!

new Vue({
  render: h => h(App)
}).$mount('#app')

```

App.vueで:

```
<script>
import { components } from 'aws-amplify-vue'

export default {
  name: 'app', 
  components: {
    ...<yourOtherComponents>,
    ...components
  }
}
</script>

```

## AmplifyEventBus

aws-amplify-vueパッケージは、コンポーネント内でイベントを発行しリッスンするためのVue EventBusを実装しています。 コンポーネントによって発生するイベントは、個々のコンポーネントのドキュメントにリストされています。

コンポーネント内でこれらのイベントをリッスンするには、EventBusをインポートします。

```javascript
import { AmplifyEventBus } from 'aws-amplify-vue';
```

次に、イベントリスナーを登録します(ライフサイクルフック内での可能性があります):

```javascript
AmplifyEventBus.$on('authState', info => {
  console.log(`Here is the authイベントがAmplifyコンポーネント: ${info}`)
});
```

## AmplifyPlugin

Amplify-vueパッケージは、AmplifyライブラリにアクセスするVueプラグインを提供します。アプリケーションの設定時にプラグインをインストールしました。

`Vue.use(AmplifyPlugin, AmplifyModules)`

This makes the Amplify library available to the aws-amplify-vue components as well as your application. Please note that you can restrict the modules that are made available to the plugin by passing only specific modules in the second argument of `Vue.use` call.

### AmplifyPlugin の使用

Amplifyライブラリを呼び出すには、 `この$Amplifyを使用します。` の後にはどちらかのモジュールを使用します。
